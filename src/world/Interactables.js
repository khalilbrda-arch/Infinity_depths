/**
 * Interactables.js
 * ----------------
 * عناصر الخريطة القابلة للتفاعل بالنقر (Tap) — قسم 39 بالمواصفات (World Interaction).
 * لا يوجد "اكتشاف": كل العناصر هنا ظاهرة ومكانها ثابت منذ بداية اللعبة.
 *
 * مسؤول عن:
 *  - بناء صناديق الكنز وعقد الموارد من بيانات CONFIG.INTERACTABLES (Data Driven — قسم 77).
 *  - تحريك تعويم/دوران بسيط لجذب الانتباه.
 *  - توفير قائمة الأجسام الحية (غير المجموعة بعد) لأي نظام Raycasting خارجي.
 *  - تنفيذ فعل "التفاعل" (فتح/جمع) عند الطلب، وتطبيق المكافأة عبر GameState.
 *
 * لا يعرف شيئًا عن الإدخال أو الكاميرا — فقط عن العالم والحالة.
 */

const Interactables = {
  group: null,
  _entries: [], // { id, type, mesh, reward, collected }

  create(scene) {
    this.group = new THREE.Group();
    const C = CONFIG.INTERACTABLES;

    for (const def of C.CHESTS) {
      this._spawn(def, "chest");
    }
    for (const def of C.RESOURCES) {
      this._spawn(def, "resource");
    }

    scene.add(this.group);
    return this.group;
  },

  _spawn(def, type) {
    const C = CONFIG.INTERACTABLES;

    // إذا كان قد تم التفاعل معه بالفعل بجلسة سابقة (Save مستقبلي)، لا نبنيه أصلاً.
    if (GameState.hasInteracted(def.id)) return;

    const isChest = type === "chest";
    const size = isChest ? C.CHEST_SIZE : C.RESOURCE_SIZE;
    const color = isChest ? C.CHEST_COLOR : C.RESOURCE_COLOR;

    const geo = isChest
      ? new THREE.BoxGeometry(size, size * 0.8, size * 0.7)
      : new THREE.OctahedronGeometry(size, 0);

    const mat = new THREE.MeshStandardMaterial({
      color,
      flatShading: true,
      roughness: 0.6,
      metalness: 0.1,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(def.x, C.GROUND_Y + size * 0.5, def.z);
    mesh.castShadow = true;
    mesh.userData.interactableId = def.id;
    this.group.add(mesh);

    this._entries.push({
      id: def.id,
      type,
      mesh,
      reward: def.reward,
      collected: false,
      _bobOffset: Math.random() * Math.PI * 2,
      _baseY: mesh.position.y,
    });
  },

  update(elapsed) {
    const C = CONFIG.INTERACTABLES;
    for (const entry of this._entries) {
      if (entry.collected) continue;
      entry.mesh.position.y =
        entry._baseY + Math.sin(elapsed * C.BOB_SPEED + entry._bobOffset) * C.BOB_HEIGHT;
      entry.mesh.rotation.y += C.SPIN_SPEED * (1 / 60);
    }
  },

  // تُستخدم من InteractionController للـ Raycasting — الأجسام الحية فقط.
  getLiveMeshes() {
    return this._entries.filter((e) => !e.collected).map((e) => e.mesh);
  },

  // يُستدعى عند نقر مؤكد على أحد الأجسام. يُرجع بيانات المكافأة أو null.
  interact(mesh) {
    const entry = this._entries.find((e) => e.mesh === mesh);
    if (!entry || entry.collected) return null;

    const registered = GameState.registerInteraction(entry.id, entry.reward);
    if (!registered) return null;

    entry.collected = true;
    this.group.remove(entry.mesh);

    return { id: entry.id, type: entry.type, reward: entry.reward };
  },
};
