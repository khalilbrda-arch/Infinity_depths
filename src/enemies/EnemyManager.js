/**

* EnemyManager.js
* ---
* المرحلة 6 — Enemy Manager.
* 
* مسؤول عن:
* - إنشاء الأعداء.
* - الاحتفاظ بالأعداء النشطين.
* - تحديث حركتهم.
* - اكتشاف وصولهم للقاعدة.
* - التعامل مع موتهم.
* - منح المكافآت.
* 
* Waves ليست هنا.
* 
* Phase 4:
* - DataContracts تتحقق من بيانات العدو عند نقطة الإنشاء.
* - لا يملك EnemyManager تعريفات المحتوى الثابتة.
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

scene.add(this.group);

this.initialized = true;

return this.group;

},

/**

* إنشاء عدو جديد.
* 
* هذه الدالة هي حدود دخول بيانات العدو
* إلى الحالة التشغيلية Enemy.
* 
* DataContracts تتحقق من بيانات الـspawn
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

this.enemies.push(enemy);

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
    enemy.damage
  );

GameState.damageBase(
  damage
);

enemy.alive = false;

enemy.animationState =
  "attack";

// لا نحصل على مكافأة عند وصول العدو.
// المكافأة تكون عند قتله فقط.

},

/**

* إلحاق الضرر بعدو.
* 
* ستستخدمها أنظمة القتال الحالية.
  */
  damageEnemy(
  enemy,
  amount
  ) {
  if (!enemy || !enemy.alive) {
  return null;
  }

const result =
  enemy.takeDamage(
    amount
  );

if (result.killed) {
  this._handleEnemyDeath(
    enemy
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

if (alive.length === 0) {
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
  */
  _handleEnemyDeath(enemy) {
  if (!enemy) {
  return;
  }

GameState.rewardEnemyKill(
  enemy.reward
);

enemy.die();

},

/**

* إزالة الأعداء الذين انتهوا.
  */
  _cleanupDeadEnemies() {
  const remaining = [];

for (const enemy of this.enemies) {
  if (enemy.alive) {
    remaining.push(enemy);
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
