/**
 * GameState.js
 * ------------
 * الحالة المركزية للعبة (Player level, currency, unlocks...).
 * هذا الكائن هو "مصدر الحقيقة" لأي بيانات تخص تقدم اللاعب.
 * الأنظمة الأخرى تقرأ/تكتب هنا، لكن لا تملك نسخها الخاصة.
 * لاحقًا (مرحلة Save System) هذا الكائن هو اللي يُحفظ ويُستعاد.
 */

const GameState = {
  version: 1, // Save Versioning — قسم 62 بالمواصفات

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

  // دالة مساعدة لعرض حالة سريعة بالـ Debug HUD لاحقًا
  summary() {
    return `Lvl ${this.player.level} | XP ${this.player.xp} | Gold ${this.player.currency}`;
  },
};
