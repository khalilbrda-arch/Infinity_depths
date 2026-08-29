/**
 * GameState.js
 * ------------
 * الحالة المركزية للعبة.
 * هذا الكائن هو المصدر الرئيسي لحالة تقدم اللاعب.
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
    hp: 100,
    maxHp: 100,
  },

  hasInteracted(id) {
    return this.interactions.openedIds.includes(id);
  },

  registerInteraction(id, reward) {
    if (this.hasInteracted(id)) return false;

    this.interactions.openedIds.push(id);
    this.player.currency += reward;

    return true;
  },

  summary() {
    return `Lvl ${this.player.level} | XP ${this.player.xp} | Gold ${this.player.currency}`;
  },
};
