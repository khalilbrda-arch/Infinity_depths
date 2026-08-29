/**
 * WaveManager.js
 * --------------
 * المرحلة 7 — Wave System.
 *
 * مسؤول عن:
 *  - عدّاد رقم الموجة الحالية.
 *  - بناء تركيبة كل موجة (Quantity + إحصائيات مصعَّدة) اعتمادًا على CONFIG.WAVES.
 *  - جدولة ظهور الأعداء (Spawn Delay) عبر EnemyManager.spawnEnemy().
 *  - اكتشاف اكتمال الموجة (كل الأعداء ظهروا وماتوا/وصلوا) والانتقال للموجة التالية.
 *  - اكتشاف Game Over (القاعدة دُمّرت) وتجميد النظام.
 *
 * لا يحتوي على منطق حركة/HP الأعداء أنفسهم — تلك مسؤولية Enemy/EnemyManager
 * (فصل متعمد، نفس فلسفة فصل EnemyPath عن Enemy بالمرحلة 6).
 */

const WaveManager = {
  initialized: false,

  // idle | countdown | spawning | waiting-clear | game-over
  state: "idle",

  currentWave: 0,

  // عدّاد الوقت المستخدم حسب الحالة (عدّ تنازلي قبل الموجة، أو بين ظهور عدو والذي يليه).
  _timer: 0,

  _spawnQueueRemaining: 0,
  _spawnInterval: 0.9,
  _waveEnemyStats: null,

  gameOverTriggered: false,

  init() {
    this.initialized = true;

    this.state = "countdown";
    this.currentWave = 0;
    this._timer = CONFIG.WAVES.TIME_BEFORE_FIRST_WAVE;

    this.gameOverTriggered = false;

    WaveUI.init();
  },

  update(delta) {
    if (!this.initialized || this.gameOverTriggered) {
      return;
    }

    if (GameState.isBaseDestroyed()) {
      this._triggerGameOver();
      return;
    }

    switch (this.state) {
      case "countdown":
        this._updateCountdown(delta);
        break;

      case "spawning":
        this._updateSpawning(delta);
        break;

      case "waiting-clear":
        this._updateWaitingClear();
        break;
    }

    WaveUI.update({
      wave: this.currentWave,
      state: this.state,
      countdown: this._getCountdownSeconds(),
      remaining: this._getRemainingCount(),
    });
  },

  // =========================================================
  // COUNTDOWN → بدء الموجة التالية
  // =========================================================

  _updateCountdown(delta) {
    this._timer -= delta;

    if (this._timer <= 0) {
      this._startNextWave();
    }
  },

  _startNextWave() {
    this.currentWave += 1;

    const composition = this._buildWaveComposition(this.currentWave);

    this._spawnQueueRemaining = composition.quantity;
    this._waveEnemyStats = composition.stats;
    this._spawnInterval = composition.spawnDelay;
    this._timer = 0;

    this.state = "spawning";
  },

  // =========================================================
  // SPAWNING → إطلاق أعداء الموجة الحالية تباعًا
  // =========================================================

  _updateSpawning(delta) {
    this._timer -= delta;

    if (this._timer <= 0 && this._spawnQueueRemaining > 0) {
      EnemyManager.spawnEnemy({
        name: "Basic Enemy",
        type: "basic",
        maxHp: this._waveEnemyStats.maxHp,
        speed: this._waveEnemyStats.speed,
        armor: this._waveEnemyStats.armor,
        resistance: this._waveEnemyStats.resistance,
        damage: this._waveEnemyStats.damage,
        reward: this._waveEnemyStats.reward,
      });

      this._spawnQueueRemaining -= 1;
      this._timer = this._spawnInterval;
    }

    if (this._spawnQueueRemaining <= 0) {
      this.state = "waiting-clear";
    }
  },

  // =========================================================
  // WAITING-CLEAR → انتظار موت/وصول كل أعداء الموجة
  // =========================================================

  _updateWaitingClear() {
    if (EnemyManager.getAliveEnemies().length === 0) {
      this._completeWave();
    }
  },

  _completeWave() {
    this.state = "countdown";
    this._timer = CONFIG.WAVES.TIME_BETWEEN_WAVES;
  },

  // =========================================================
  // DIFFICULTY SCALING (قسم 14 بالمواصفات)
  // =========================================================

  /**
   * يبني تركيبة الموجة رقم waveNumber: عدد الأعداء + إحصائياتهم
   * بعد التصعيد. التصعيد يشمل HP وSpeed وArmor وDamage وReward
   * وليس فقط HP × 2، حسب قسم 14 بالمواصفات.
   */
  _buildWaveComposition(waveNumber) {
    const W = CONFIG.WAVES;
    const S = W.SCALING;

    // عدد مرات التصعيد المطبَّقة (الموجة 1 = بدون أي تصعيد).
    const growth = waveNumber - 1;

    const quantity = Math.min(
      S.QUANTITY_MAX,
      S.QUANTITY_BASE + Math.floor(growth * S.QUANTITY_PER_WAVE)
    );

    const maxHp = Math.round(
      W.BASE_ENEMY.maxHp * Math.pow(1 + S.HP_PER_WAVE, growth)
    );

    const speed = Number(
      (W.BASE_ENEMY.speed * (1 + S.SPEED_PER_WAVE * growth)).toFixed(2)
    );

    const armor = Math.round(S.ARMOR_PER_WAVE * Math.floor(growth / 2));

    const damage = Math.round(
      W.BASE_ENEMY.damage * (1 + S.DAMAGE_PER_WAVE * growth)
    );

    const reward = Math.round(
      W.BASE_ENEMY.reward * (1 + S.REWARD_PER_WAVE * growth)
    );

    return {
      quantity,
      spawnDelay: W.SPAWN_INTERVAL,
      stats: {
        maxHp,
        speed,
        armor,
        damage,
        reward,
        resistance: W.BASE_ENEMY.resistance,
      },
    };
  },

  // =========================================================
  // GAME OVER
  // =========================================================

  _triggerGameOver() {
    if (this.gameOverTriggered) {
      return;
    }

    this.gameOverTriggered = true;
    this.state = "game-over";

    GameOverUI.show(this.currentWave);
  },

  isGameOver() {
    return this.gameOverTriggered;
  },

  // =========================================================
  // HELPERS (لعرض الواجهة فقط)
  // =========================================================

  _getCountdownSeconds() {
    if (this.state === "countdown") {
      return Math.max(0, Math.ceil(this._timer));
    }

    return 0;
  },

  _getRemainingCount() {
    if (this.state === "spawning") {
      return (
        this._spawnQueueRemaining +
        EnemyManager.getAliveEnemies().length
      );
    }

    if (this.state === "waiting-clear") {
      return EnemyManager.getAliveEnemies().length;
    }

    return 0;
  },
};
