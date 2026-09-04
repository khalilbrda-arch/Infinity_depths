/**
 * DataContracts.js
 * ----------------
 * عقود بيانات المحتوى الثابت.
 *
 * هذا الملف لا يملك حالة تشغيلية ولا يغيّر سلوك اللعبة.
 * وظيفته تحويل بيانات CONFIG إلى تعريفات قابلة للتحقق قبل أن تستخدمها الأنظمة.
 *
 * Phase 4 — Architecture Foundation / AD-003
 */

const DataContracts = {
  /**
   * التحقق من تعريف عدو.
   * التعريف هنا بيانات ثابتة فقط؛ لا يحتوي HP الحالي أو target أو model.
   */
  validateEnemyDefinition(definition) {
    if (!definition || typeof definition !== "object") {
      return false;
    }

    const requiredNumbers = [
      "maxHp",
      "speed",
      "armor",
      "resistance",
      "damage",
      "reward",
    ];

    for (const key of requiredNumbers) {
      if (
        typeof definition[key] !== "number" ||
        !Number.isFinite(definition[key]) ||
        definition[key] < 0
      ) {
        return false;
      }
    }

    return true;
  },

  /**
   * التحقق من تعريف دفاع.
   * التعريف هنا لا يحتوي instance state مثل cooldown أو target.
   */
  validateDefenseDefinition(definition) {
    if (!definition || typeof definition !== "object") {
      return false;
    }

    if (
      typeof definition.id !== "string" ||
      definition.id.length === 0
    ) {
      return false;
    }

    const requiredNumbers = [
      "cost",
      "damage",
      "critChance",
      "critMultiplier",
      "range",
      "fireRate",
      "projectileSpeed",
    ];

    for (const key of requiredNumbers) {
      if (
        typeof definition[key] !== "number" ||
        !Number.isFinite(definition[key]) ||
        definition[key] < 0
      ) {
        return false;
      }
    }

    if (
      typeof definition.targeting !== "string" ||
      definition.targeting.length === 0
    ) {
      return false;
    }

    return true;
  },
};

// تحقق مبكر من تعريفات المحتوى الحالية بدون إنشاء حالة جديدة.
DataContracts.validateEnemyDefinition(
  CONFIG.WAVES.BASE_ENEMY
);

for (const defenseId in CONFIG.DEFENSES.TYPES) {
  DataContracts.validateDefenseDefinition(
    CONFIG.DEFENSES.TYPES[defenseId]
  );
}
