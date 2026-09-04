/**
 * EnemyManager.js
 * ---------------
 * المرحلة 6 — Enemy Manager.
 *
 * مسؤول عن:
 * - إنشاء الأعداء.
 * - الاحتفاظ بالأعداء النشطين.
 * - تحديث حركتهم.
 * - اكتشاف وصولهم للقاعدة.
 * - إدارة دورة حياة الأعداء.
 *
 * Waves ليست هنا.
 *
 * Phase 4:
 * - DataContracts تتحقق من بيانات العدو عند نقطة الإنشاء.
 * - لا يملك EnemyManager تعريفات المحتوى الثابتة.
 * - لا يدير GameState مباشرة.
 * - النتائج العابرة للأنظمة تُرسل عبر EventBus.
 */

const EnemyManager = {
  group: null,

  enemies: [],

  nextId: 1,

  initialized: false,

  // =========================================================
  // INIT
  // =========================================================

  init(scene) {
    this.group =
      new THREE.Group();

    this.enemies = [];
    this.nextId = 1;

    EnemyPath.init();

    scene.add(
      this.group
    );

    this.initialized = true;

    return this.group;
  },

  // =========================================================
  // SPAWN
  // =========================================================

  spawnEnemy(data = {}) {
    if (!this.initialized) {
      return null;
    }

    const enemyData = {
      id:
        data.id ||
        `enemy_${this.nextId++}`,

      name:
        data.name ||
        "Basic Enemy",

      type:
        data.type ||
        "basic",

      maxHp:
        data.maxHp ?? 20,

      speed:
        data.speed ?? 2.2,

      armor:
        data.armor ?? 0,

      resistance:
        data.resistance ?? 0,

      damage:
        data.damage ?? 10,

      reward:
        data.reward ?? 5,
    };

    if (
      typeof DataContracts === "undefined"
    ) {
      console.error(
        "EnemyManager: DataContracts is not available."
      );

      return null;
    }

    if (
      !DataContracts.validateEnemySpawnData(
        enemyData
      )
    ) {
      console.error(
        "EnemyManager: invalid enemy spawn data.",
        enemyData
      );

      return null;
    }

    const enemy =
      new Enemy(enemyData);

    this.enemies.push(
      enemy
    );

    const spawn =
      EnemyPath.getSpawnPoint();

    enemy.model.position.set(
      spawn.x,
      spawn.y + 0.75,
      spawn.z
    );

    this.group.add(
      enemy.getObject()
    );

    if (
      typeof EventBus !== "undefined"
    ) {
      EventBus.emit(
        "EnemySpawned",
        {
          enemyId: enemy.id,
          type: enemy.type,
        }
      );
    }

    return enemy;
  },

  // =========================================================
  // TEST SPAWN
  // =========================================================

  spawnTestEnemy() {
    return this.spawnEnemy({
      name: "Basic Enemy",
      type: "basic",
      maxHp: 20,
      speed: 2.2,
      armor: 0,
      resistance: 0,
      damage: 10,
      reward: 5,
    });
  },

  // =========================================================
  // UPDATE
  // =========================================================

  update(delta) {
    if (!this.initialized) {
      return;
    }

    for (const enemy of this.enemies) {
      if (!enemy.alive) {
        continue;
      }

      if (enemy.hasReachedBase()) {
        continue;
      }

      enemy.update(delta);

      /*
       * بعض أسباب الموت، مثل Poison، تحدث داخل Enemy.update()
       * مباشرة وليس عبر damageEnemy().
       *
       * لذلك يجب أن يلتقط EnemyManager هذه النتيجة هنا
       * ويمررها عبر نفس مسار EnemyDied.
       */
      if (!enemy.alive) {
        if (!enemy.reachedBase) {
          this._handleEnemyDeath(
            enemy
          );
        }

        continue;
      }

      if (
        enemy.hasReachedBase()
      ) {
        this._handleBaseReached(
          enemy
        );
      }
    }

    this._cleanupDeadEnemies();
  },

  // =========================================================
  // BASE REACHED
  // =========================================================

  _handleBaseReached(enemy) {
    if (!enemy.alive) {
      return;
    }

    if (!enemy.reachedBase) {
      return;
    }

    const damage =
      Math.max(
        0,
        Number(enemy.damage) || 0
      );

    enemy.alive = false;

    enemy.animationState =
      "attack";

    if (
      typeof EventBus === "undefined"
    ) {
      console.error(
        "EnemyManager: EventBus is not available while handling base reached."
      );

      return;
    }

    EventBus.emit(
      "EnemyReachedBase",
      {
        enemyId: enemy.id,
        type: enemy.type,
        damage,
      }
    );

    // لا توجد مكافأة عند وصول العدو.
  },

  // =========================================================
  // DAMAGE
  // =========================================================

  damageEnemy(
    enemy,
    amount
  ) {
    if (
      !enemy ||
      !enemy.alive
    ) {
      return null;
    }

    const result =
      enemy.takeDamage(
        amount
      );

    if (
      result &&
      result.killed
    ) {
      this._handleEnemyDeath(
        enemy
      );
    } else if (
      typeof EventBus !== "undefined"
    ) {
      EventBus.emit(
        "EnemyDamaged",
        {
          enemyId: enemy.id,
          type: enemy.type,
          amount,
          result,
        }
      );
    }

    return result;
  },

  // =========================================================
  // QUERIES
  // =========================================================

  getAliveEnemies() {
    return this.enemies.filter(
      (enemy) =>
        enemy.alive &&
        !enemy.reachedBase
    );
  },

  getClosestEnemyToBase() {
    const alive =
      this.getAliveEnemies();

    if (
      alive.length === 0
    ) {
      return null;
    }

    let closest =
      alive[0];

    for (const enemy of alive) {
      if (
        enemy.pathDistance >
        closest.pathDistance
      ) {
        closest = enemy;
      }
    }

    return closest;
  },

  // =========================================================
  // DEATH
  // =========================================================

  _handleEnemyDeath(enemy) {
    if (!enemy) {
      return;
    }

    const reward =
      Math.max(
        0,
        Number(enemy.reward) || 0
      );

    /*
     * die() آمنة إذا كان العدو ميتًا مسبقًا،
     * وهذا يسمح أيضًا بالتعامل مع موت Poison.
     */
    enemy.die();

    if (
      typeof EventBus === "undefined"
    ) {
      console.error(
        "EnemyManager: EventBus is not available while handling enemy death."
      );

      return;
    }

    EventBus.emit(
      "EnemyDied",
      {
        enemyId: enemy.id,
        type: enemy.type,
        reward,
      }
    );
  },

  // =========================================================
  // CLEANUP
  // =========================================================

  _cleanupDeadEnemies() {
    const remaining = [];

    for (const enemy of this.enemies) {
      if (enemy.alive) {
        remaining.push(
          enemy
        );
        continue;
      }

      enemy.destroy();
    }

    this.enemies =
      remaining;
  },

  // =========================================================
  // CLEAR
  // =========================================================

  clear() {
    for (const enemy of this.enemies) {
      enemy.destroy();
    }

    this.enemies = [];
  },
};
