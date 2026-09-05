/**

* WaveManager.js
* ---
* المرحلة 4 — Architecture Foundation / Wave Boundary.
* 
* مسؤول عن:
* - إدارة حالة الموجة.
* - بناء تركيبة الموجة.
* - جدولة ظهور الأعداء.
* - انتظار انتهاء أعداء الموجة.
* - اكتشاف Game Over عبر أحداث النظام.
* 
* لا يملك:
* - حالة الأعداء الداخلية.
* - HP الأعداء.
* - منطق الضرر.
* - الاقتصاد.
* - واجهة العرض.
* - GameState.
* 
* يعتمد على EventBus لمعرفة أن القاعدة دُمّرت.
  */

const WaveManager = {
initialized: false,

// idle | countdown | spawning | waiting-clear | game-over
state: "idle",

currentWave: 0,

_timer: 0,

_spawnQueueRemaining: 0,

_spawnInterval: 0.9,

_waveEnemyStats: null,

gameOverTriggered: false,

baseDestroyed: false,

_baseDestroyedListener: null,

init() {
this.initialized = true;

this.state = "countdown";

this.currentWave = 0;

this._timer =
  CONFIG.WAVES.TIME_BEFORE_FIRST_WAVE;

this._spawnQueueRemaining = 0;

this._spawnInterval =
  CONFIG.WAVES.SPAWN_INTERVAL;

this._waveEnemyStats = null;

this.gameOverTriggered = false;

this.baseDestroyed = false;

/*
 * إعادة ربط المستمع بأمان عند إعادة التهيئة.
 *
 * EventBus قد يبقى موجودًا بين الاختبارات
 * أو جلسات اللعبة، لذلك نزيل المستمع السابق
 * قبل تسجيله من جديد.
 */
if (
  typeof EventBus !== "undefined"
) {
  if (
    this._baseDestroyedListener
  ) {
    EventBus.off(
      "BaseDestroyed",
      this._baseDestroyedListener
    );
  }

  this._baseDestroyedListener =
    () => {
      this.baseDestroyed = true;
    };

  EventBus.on(
    "BaseDestroyed",
    this._baseDestroyedListener
  );
}

WaveUI.init();

},

update(delta) {
if (
!this.initialized ||
this.gameOverTriggered
) {
return;
}

const safeDelta =
  Math.max(
    0,
    Math.min(
      Number(delta) || 0,
      0.1
    )
  );

/*
 * حالة القاعدة تصل إلى WaveManager
 * عبر EventBus فقط.
 */
if (
  this.baseDestroyed
) {
  this._triggerGameOver();

  return;
}

switch (this.state) {
  case "countdown":
    this._updateCountdown(
      safeDelta
    );
    break;

  case "spawning":
    this._updateSpawning(
      safeDelta
    );
    break;

  case "waiting-clear":
    this._updateWaitingClear();
    break;
}

WaveUI.update({
  wave: this.currentWave,
  state: this.state,
  countdown:
    this._getCountdownSeconds(),
  remaining:
    this._getRemainingCount(),
});

},

// =========================================================
// COUNTDOWN
// =========================================================

_updateCountdown(delta) {
this._timer -= delta;

if (this._timer <= 0) {
  this._startNextWave();
}

},

_startNextWave() {
this.currentWave += 1;

const composition =
  this._buildWaveComposition(
    this.currentWave
  );

this._spawnQueueRemaining =
  composition.quantity;

this._waveEnemyStats =
  composition.stats;

this._spawnInterval =
  composition.spawnDelay;

this._timer = 0;

this.state = "spawning";

this._emit(
  "WaveStarted",
  {
    wave:
      this.currentWave,

    quantity:
      composition.quantity,
  }
);

},

// =========================================================
// SPAWNING
// =========================================================

_updateSpawning(delta) {
this._timer -= delta;

if (
  this._timer <= 0 &&
  this._spawnQueueRemaining > 0
) {
  const enemy =
    EnemyManager.spawnEnemy({
      name: "Basic Enemy",

      type: "basic",

      maxHp:
        this._waveEnemyStats.maxHp,

      speed:
        this._waveEnemyStats.speed,

      armor:
        this._waveEnemyStats.armor,

      resistance:
        this._waveEnemyStats.resistance,

      damage:
        this._waveEnemyStats.damage,

      reward:
        this._waveEnemyStats.reward,
    });

  /*
   * مهم:
   * لا نعتبر العدو Spawned إذا فشل
   * EnemyManager في إنشائه.
   */
  if (!enemy) {
    console.error(
      "WaveManager: failed to spawn enemy."
    );

    this._timer =
      this._spawnInterval;

    return;
  }

  this._spawnQueueRemaining -= 1;

  this._timer =
    this._spawnInterval;

  this._emit(
    "EnemySpawnRequested",
    {
      wave:
        this.currentWave,

      enemyId:
        enemy.id,

      type:
        enemy.type,
    }
  );
}

if (
  this._spawnQueueRemaining <= 0
) {
  this.state =
    "waiting-clear";
}

},

// =========================================================
// WAITING CLEAR
// =========================================================

_updateWaitingClear() {
if (
typeof EnemyManager ===
"undefined"
) {
return;
}

if (
  EnemyManager.getAliveEnemies()
    .length === 0
) {
  this._completeWave();
}

},

_completeWave() {
this.state =
"countdown";

this._timer =
  CONFIG.WAVES.TIME_BETWEEN_WAVES;

this._emit(
  "WaveCompleted",
  {
    wave:
      this.currentWave,
  }
);

},

// =========================================================
// DIFFICULTY SCALING
// =========================================================

_buildWaveComposition(
waveNumber
) {
const W =
CONFIG.WAVES;

const S =
  W.SCALING;

const growth =
  Math.max(
    0,
    waveNumber - 1
  );

const quantity =
  Math.min(
    S.QUANTITY_MAX,
    S.QUANTITY_BASE +
      Math.floor(
        growth *
          S.QUANTITY_PER_WAVE
      )
  );

const maxHp =
  Math.round(
    W.BASE_ENEMY.maxHp *
      Math.pow(
        1 +
          S.HP_PER_WAVE,
        growth
      )
  );

const speed =
  Number(
    (
      W.BASE_ENEMY.speed *
      (
        1 +
        S.SPEED_PER_WAVE *
          growth
      )
    ).toFixed(2)
  );

const armor =
  Math.round(
    S.ARMOR_PER_WAVE *
      Math.floor(
        growth / 2
      )
  );

const damage =
  Math.round(
    W.BASE_ENEMY.damage *
      (
        1 +
        S.DAMAGE_PER_WAVE *
          growth
      )
  );

const reward =
  Math.round(
    W.BASE_ENEMY.reward *
      (
        1 +
        S.REWARD_PER_WAVE *
          growth
      )
  );

return {
  quantity,

  spawnDelay:
    W.SPAWN_INTERVAL,

  stats: {
    maxHp,

    speed,

    armor,

    resistance:
      W.BASE_ENEMY.resistance,

    damage,

    reward,
  },
};

},

// =========================================================
// GAME OVER
// =========================================================

_triggerGameOver() {
if (
this.gameOverTriggered
) {
return;
}

this.gameOverTriggered =
  true;

this.state =
  "game-over";

this._emit(
  "GameOver",
  {
    wave:
      this.currentWave,
  }
);

GameOverUI.show(
  this.currentWave
);

},

isGameOver() {
return (
this.gameOverTriggered
);
},

// =========================================================
// HELPERS
// =========================================================

_getCountdownSeconds() {
if (
this.state ===
"countdown"
) {
return Math.max(
0,
Math.ceil(
this._timer
)
);
}

return 0;

},

_getRemainingCount() {
if (
typeof EnemyManager ===
"undefined"
) {
return 0;
}

if (
  this.state ===
  "spawning"
) {
  return (
    this._spawnQueueRemaining +
    EnemyManager
      .getAliveEnemies()
      .length
  );
}

if (
  this.state ===
  "waiting-clear"
) {
  return EnemyManager
    .getAliveEnemies()
    .length;
}

return 0;

},

// =========================================================
// EVENTS
// =========================================================

_emit(
eventName,
payload
) {
if (
typeof EventBus ===
"undefined"
) {
console.error(
"WaveManager: EventBus is not available for "${eventName}"."
);

  return false;
}

EventBus.emit(
  eventName,
  payload
);

return true;

},
};
