/**
 * Enemy.js
 * --------
 * المرحلة 6 — Enemy Base.
 *
 * يمثل عدوًا واحدًا.
 *
 * لا يعرف هذا الملف شيئًا عن Waves.
 * ولا ينشئ أعداء.
 * ولا يقرر من يستهدفه.
 *
 * EnemyManager هو المسؤول عن الإدارة.
 * EnemyPath مسؤول عن المسار.
 */

class Enemy {
  constructor(data = {}) {
    this.id =
      data.id ||
      `enemy_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

    this.name =
      data.name || "Basic Enemy";

    this.type =
      data.type || "basic";

    this.maxHp =
      data.maxHp ?? 20;

    this.hp =
      data.hp ?? this.maxHp;

    this.speed =
      data.speed ?? 2.2;

    this.armor =
      data.armor ?? 0;

    this.resistance =
      data.resistance ?? 0;

    this.damage =
      data.damage ?? 10;

    this.reward =
      data.reward ?? 5;

    this.target =
      data.target || "base";

    this.statusEffects = [];

    this.model = null;

    this.animationState = "walk";

    // موقع العدو على المسار بوحدة المسافة.
    this.pathDistance = 0;

    this.alive = true;
    this.reachedBase = false;

    this._buildModel();
  }

  _buildModel() {
    const geometry =
      new THREE.CapsuleGeometry(
        0.45,
        0.8,
        4,
        8
      );

    const material =
      new THREE.MeshStandardMaterial({
        color: 0xd94a4a,
        roughness: 0.8,
        flatShading: true,
      });

    this.model =
      new THREE.Mesh(
        geometry,
        material
      );

    this.model.castShadow = true;
    this.model.receiveShadow = true;

    this.model.userData.owner = "enemy";
    this.model.userData.enemyId = this.id;

    // Prototype فقط.
    // النموذج النهائي سيُستبدل في مرحلة Visual Upgrade.
    this.model.scale.set(
      1,
      1.15,
      1
    );
  }

  getObject() {
    return this.model;
  }

  update(delta) {
    if (!this.alive || this.reachedBase) {
      return;
    }

    this.pathDistance +=
      this.speed * delta;

    const totalLength =
      EnemyPath.getTotalLength();

    if (
      this.pathDistance >=
      totalLength
    ) {
      this.pathDistance =
        totalLength;

      this.reachedBase = true;
      this.animationState = "attack";

      this._updateTransform();

      return;
    }

    this._updateTransform();
  }

  _updateTransform() {
    if (!this.model) return;

    const position =
      EnemyPath.getPositionAtDistance(
        this.pathDistance
      );

    const direction =
      EnemyPath.getDirectionAtDistance(
        this.pathDistance
      );

    this.model.position.set(
      position.x,
      position.y + 0.75,
      position.z
    );

    if (
      Math.abs(direction.x) > 0.001 ||
      Math.abs(direction.z) > 0.001
    ) {
      this.model.rotation.y =
        Math.atan2(
          direction.x,
          direction.z
        );
    }
  }

  takeDamage(amount) {
    if (!this.alive) {
      return {
        killed: false,
        damage: 0,
        remainingHp: 0,
      };
    }

    const rawDamage =
      Math.max(0, amount);

    const effectiveDamage =
      Math.max(
        1,
        rawDamage - this.armor
      );

    this.hp =
      Math.max(
        0,
        this.hp - effectiveDamage
      );

    if (this.hp <= 0) {
      this.die();

      return {
        killed: true,
        damage: effectiveDamage,
        remainingHp: 0,
      };
    }

    return {
      killed: false,
      damage: effectiveDamage,
      remainingHp: this.hp,
    };
  }

  die() {
    if (!this.alive) return;

    this.alive = false;
    this.animationState = "death";
  }

  getHpRatio() {
    return this.maxHp > 0
      ? this.hp / this.maxHp
      : 0;
  }

  hasReachedBase() {
    return this.reachedBase;
  }

  destroy() {
    if (
      this.model &&
      this.model.parent
    ) {
      this.model.parent.remove(
        this.model
      );
    }

    this.model = null;
  }
}
