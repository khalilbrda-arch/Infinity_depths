/**
 * GameState.js
 * ------------
 * المصدر المركزي لحالة اللعبة.
 *
 * المرحلة 6:
 *  - Base HP
 *  - Enemy rewards
 *
 * لاحقًا سيكون هذا الكائن أساس Save System.
 */

const GameState = {
  version: 1,

  player: {
    level: 1,
    xp: 0,
    currency: 0,
    rank: "Novice",
  },

  unlocked: {
    areas: ["bay_start"],
    defenses: [],
  },

  interactions: {
    openedIds: [],
  },

  base: {
    hp: CONFIG.DEFENSE_MAP.BASE.hp,
    maxHp: CONFIG.DEFENSE_MAP.BASE.maxHp,
  },

  hasInteracted(id) {
    return this.interactions.openedIds.includes(id);
  },

  registerInteraction(id, reward) {
    if (this.hasInteracted(id)) {
      return false;
    }

    this.interactions.openedIds.push(id);

    this.player.currency +=
      Math.max(0, reward || 0);

    return true;
  },

  /**
   * إلحاق الضرر بالقاعدة.
   */
  damageBase(amount) {
    const damage =
      Math.max(
        0,
        Number(amount) || 0
      );

    this.base.hp =
      Math.max(
        0,
        this.base.hp - damage
      );

    return {
      damage,
      hp: this.base.hp,
      maxHp: this.base.maxHp,
      destroyed:
        this.base.hp <= 0,
    };
  },

  /**
   * استعادة صحة القاعدة.
   * ستفيدنا لاحقًا في أنظمة العلاج/الإصلاح.
   */
  healBase(amount) {
    const value =
      Math.max(
        0,
        Number(amount) || 0
      );

    this.base.hp =
      Math.min(
        this.base.maxHp,
        this.base.hp + value
      );

    return this.base.hp;
  },

  /**
   * هل يملك اللاعب ذهبًا كافيًا؟ (المرحلة 8 — تكلفة وضع دفاع).
   */
  canAfford(cost) {
    return (
      this.player.currency >=
      Math.max(0, Number(cost) || 0)
    );
  },

  /**
   * خصم ذهب (المرحلة 8). يفشل بأمان إذا كان الرصيد غير كافٍ.
   */
  spendCurrency(amount) {
    const cost =
      Math.max(
        0,
        Number(amount) || 0
      );

    if (this.player.currency < cost) {
      return false;
    }

    this.player.currency -= cost;

    return true;
  },

  /**
   * مكافأة قتل عدو.
   *
   * XP الحقيقي يمكن توسيعه لاحقًا.
   */
  rewardEnemyKill(reward) {
    const gold =
      Math.max(
        0,
        Number(reward) || 0
      );

    this.player.currency +=
      gold;

    return {
      gold,
      totalGold:
        this.player.currency,
    };
  },

  /**
   * هل القاعدة مدمرة؟
   */
  isBaseDestroyed() {
    return this.base.hp <= 0;
  },

  summary() {
    return (
      `Lvl ${this.player.level}` +
      ` | XP ${this.player.xp}` +
      ` | Gold ${this.player.currency}` +
      ` | Base ${Math.ceil(this.base.hp)}/${this.base.maxHp}`
    );
  },
};
