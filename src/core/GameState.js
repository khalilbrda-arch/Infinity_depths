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

  // حالة التفاعل مع عناصر الخريطة (قسم 39 — World Interaction).
  // لا علاقة لها بـ"اكتشاف" — فقط تتبّع أي عنصر ظاهر تم فتحه/جمعه فعلاً.
  interactions: {
    openedIds: [], // مصفوفة IDs لصناديق ومصادر تم التفاعل معها بالفعل
  },

  // هل تم التفاعل مع هذا العنصر (بمعرّفه) من قبل؟
  hasInteracted(id) {
    return this.interactions.openedIds.includes(id);
  },

  // تسجيل تفاعل جديد + إضافة المكافأة للعملة. يُرجع false إذا كان قد تم التفاعل معه سابقًا.
  registerInteraction(id, reward) {
    if (this.hasInteracted(id)) return false;
    this.interactions.openedIds.push(id);
    this.player.currency += reward;
    return true;
  },

  // دالة مساعدة لعرض حالة سريعة بالـ Debug HUD لاحقًا
  summary() {
    return `Lvl ${this.player.level} | XP ${this.player.xp} | Gold ${this.player.currency}`;
  },
};
