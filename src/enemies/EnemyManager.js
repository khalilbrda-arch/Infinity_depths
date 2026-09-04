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
 * - التعامل مع دورة حياة العدو.
 *
 * Waves ليست هنا.
 *
 * Phase 4:
 * - DataContracts تتحقق من بيانات العدو عند نقطة الإنشاء.
 * - لا يملك EnemyManager تعريفات المحتوى الثابتة.
 * - لا يدير Economy أو GameState مباشرة.
 * - نتائج وصول العدو أو موته تُرسل عبر EventBus.
 */

const EnemyManager = {
  group: null,

  enemies: [],

  nextId: 1,

  initialized: false,

  /**
   * تهيئة النظام.
   */
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

  /**
   * إنشاء عدو جديد.
   *
   * هذه الدالة هي حدود دخول بيانات العدو
   * إلى الحالة التشغيلية Enemy.
   *
   * DataContracts تتحقق من بيانات الـ spawn
   * قبل إنشاء instance جديد.
   */
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

  /**
   * عدو تجريبي واحد.
   *
   * يبقى متوافقًا مع النظام الحالي،
   * لكنه لا يُستخدم من Game.js.
   */
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

  /**
   * تحديث جميع الأعداء.
   */
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

  /**
   * العدو وصل إلى القاعدة.
   *
   * EnemyManager لا يغير GameState مباشرة.
   * بل يصدر نتيجة النظام عبر EventBus.
   */
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
      typeof EventBus !== "undefined"
    ) {
      EventBus.emit(
        "EnemyReachedBase",
        {
          enemyId: enemy.id,
          type: enemy.type,
          damage,
        }
      );
    } else {
      console.error(
        "EnemyManager: EventBus is not available while handling base reached."
      );
    }

    // لا توجد مكافأة عند وصول العدو.
    // المكافأة تكون عند قتله فقط.
  },

  /**
   * إلحاق الضرر بعدو.
   *
   * CombatSystem يستخدم هذه الحدود بدلًا من
   * الاتصال المباشر من Projectile.
   */
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

  /**
   * الحصول على الأعداء الأحياء.
   */
  getAliveEnemies() {
    return this.enemies.filter(
      (enemy) =>
        enemy.alive &&
        !enemy.reachedBase
    );
  },

  /**
   * الحصول على أقرب عدو إلى القاعدة.
   */
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

  /**
   * التعامل مع موت العدو.
   *
   * لا يمنح المكافأة مباشرة.
   * بل يرسل النتيجة إلى Game/Event boundary.
   */
  _handleEnemyDeath(enemy) {
    if (!enemy) {
      return;
    }

    const reward =
      Math.max(
        0,
        Number(enemy.reward) || 0
      );

    enemy.die();

    if (
      typeof EventBus !== "undefined"
    ) {
      EventBus.emit(
        "EnemyDied",
        {
          enemyId: enemy.id,
          type: enemy.type,
          reward,
        }
      );
    } else {
      console.error(
        "EnemyManager: EventBus is not available while handling enemy death."
      );
    }
  },

  /**
   * إزالة الأعداء الذين انتهوا.
   */
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

  /**
   * تنظيف النظام بالكامل.
   */
  clear() {
    for (const enemy of this.enemies) {
      enemy.destroy();
    }

    this.enemies = [];
  },
};
