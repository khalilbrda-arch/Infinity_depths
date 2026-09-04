/**
 * DefenseManager.js
 * -----------------
 * المرحلة 8 — Defense Manager + Placement (قسم 138 بالمواصفات).
 *
 * مسؤول عن:
 *  - وضع الدفاعات (Tap-to-Place — انظر ملاحظة أسفله).
 *  - التحقق من صلاحية المكان (DefenseMap.isPositionBuildable من المرحلة 5).
 *  - خصم التكلفة (GameState.spendCurrency).
 *  - الاحتفاظ بالدفاعات الموضوعة وتحديثها كل إطار.
 *
 * قرار مسجَّل بهذه المرحلة: الوضع يتم بالنقر (Tap) على مكان صالح على
 * الجزيرة أثناء "وضع البناء" — وليس سحب وإفلات (Drag & Drop) مباشر.
 * هذا متسق مع نظام الإدخال الحالي بالمشروع (TouchControls يوفّر Tap
 * كحدث منفصل عن Pan فقط، بلا موضع تمرير مستمر أثناء اللمس). نقل/سحب
 * دفاع موضوع بالفعل (قسم 54 بالمواصفات) مؤجَّل لمرحلة تحسين لاحقة.
 *
 * Phase 4:
 *  - DataContracts تتحقق من تعريف الدفاع قبل استخدامه.
 *  - DefenseManager هو حدود دخول تعريف الدفاع إلى نظام التشغيل.
 *  - لا يملك تعريفات المحتوى الثابتة.
 */

const DefenseManager = {
  scene: null,
  group: null,

  defenses: [],
  nextId: 1,

  initialized: false,

  // وضع البناء الحالي — يُقرأ من InteractionController عند كل نقرة.
  isPlacing: false,
  _placingTypeId: null,

  _groundPlane: null,

  init(scene) {
    this.scene = scene;

    this.group =
      new THREE.Group();

    this.defenses = [];
    this.nextId = 1;

    this.isPlacing = false;
    this._placingTypeId = null;

    this._groundPlane =
      new THREE.Plane(
        new THREE.Vector3(0, 1, 0),
        -CONFIG.DEFENSES.GROUND_Y
      );

    scene.add(this.group);

    this.initialized = true;

    DefenseUI.init();

    return this.group;
  },

  // =========================================================
  // PLACEMENT MODE
  // =========================================================

  startPlacement(typeId) {
    if (
      typeof DataContracts === "undefined"
    ) {
      console.error(
        "DefenseManager: DataContracts is not available."
      );

      return;
    }

    const definition =
      CONFIG.DEFENSES.TYPES[typeId];

    if (
      !definition
    ) {
      return;
    }

    if (
      !DataContracts.validateDefenseDefinition(
        definition
      )
    ) {
      console.error(
        "DefenseManager: invalid defense definition.",
        definition
      );

      return;
    }

    this.isPlacing = true;
    this._placingTypeId = typeId;

    DefenseUI.setPlacingState(
      true,
      definition
    );
  },

  cancelPlacement() {
    this.isPlacing = false;
    this._placingTypeId = null;

    DefenseUI.setPlacingState(
      false,
      null
    );
  },

  /**
   * يحوّل نقرة الشاشة (عبر Raycaster جاهز من InteractionController) إلى
   * نقطة أرضية (x, z) عند مستوى GROUND_Y. يُستخدم فقط أثناء وضع البناء.
   */
  getGroundIntersection(raycaster) {
    const point =
      new THREE.Vector3();

    const hit =
      raycaster.ray.intersectPlane(
        this._groundPlane,
        point
      );

    if (!hit) {
      return null;
    }

    return {
      x: point.x,
      z: point.z,
    };
  },

  /**
   * محاولة وضع الدفاع الحالي (_placingTypeId) عند (x, z).
   * تفشل بأمان (رسالة توضيحية عبر Toast) إذا كان المكان غير صالح،
   * أو يوجد دفاع قريب جدًا، أو الذهب غير كافٍ.
   */
  attemptPlace(x, z) {
    if (
      !this.isPlacing ||
      !this._placingTypeId
    ) {
      return;
    }

    const T =
      CONFIG.DEFENSES.TYPES[
        this._placingTypeId
      ];

    if (!T) {
      console.error(
        "DefenseManager: selected defense type does not exist.",
        this._placingTypeId
      );

      this.cancelPlacement();

      return;
    }

    if (
      typeof DataContracts === "undefined"
    ) {
      console.error(
        "DefenseManager: DataContracts is not available."
      );

      this.cancelPlacement();

      return;
    }

    if (
      !DataContracts.validateDefenseDefinition(
        T
      )
    ) {
      console.error(
        "DefenseManager: invalid defense definition.",
        T
      );

      this.cancelPlacement();

      return;
    }

    if (
      !DefenseMap.isPositionBuildable(
        x,
        z
      )
    ) {
      Toast.showMessage(
        "لا يمكن البناء هنا — قريب جدًا من مسار الأعداء ⛔"
      );

      return;
    }

    if (
      this._isOverlapping(
        x,
        z
      )
    ) {
      Toast.showMessage(
        "يوجد دفاع آخر بهذا المكان بالفعل ⛔"
      );

      return;
    }

    if (
      !GameState.canAfford(
        T.cost
      )
    ) {
      Toast.showMessage(
        "الذهب غير كافٍ 🪙"
      );

      return;
    }

    GameState.spendCurrency(
      T.cost
    );

    const defense =
      new Defense({
        id:
          `defense_${this.nextId++}`,

        typeId:
          this._placingTypeId,

        x,
        z,
      });

    this.defenses.push(
      defense
    );

    this.group.add(
      defense.getObject()
    );

    Toast.showMessage(
      `${T.name} تم وضعه ✅`
    );

    this.cancelPlacement();
  },

  _isOverlapping(x, z) {
    const minDistance =
      CONFIG.DEFENSES.MIN_DISTANCE_BETWEEN;

    return this.defenses.some(
      (defense) =>
        Math.hypot(
          defense.x - x,
          defense.z - z
        ) < minDistance
    );
  },

  // =========================================================
  // UPDATE
  // =========================================================

  update(delta) {
    if (!this.initialized) {
      return;
    }

    for (const defense of this.defenses) {
      defense.update(delta);
    }
  },

  getDefenses() {
    return this.defenses;
  },

  // =========================================================
  // CLEANUP
  // =========================================================

  clear() {
    for (const defense of this.defenses) {
      defense.destroy();
    }

    this.defenses = [];
  },
};
