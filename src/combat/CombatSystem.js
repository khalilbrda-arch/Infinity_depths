/**
 * CombatSystem.js
 * ---------------
 * المرحلة 4 — Architecture Foundation / Combat Boundary.
 *
 * مسؤول عن تمرير نتائج الهجمات إلى نظام الأعداء دون أن تعرف المقذوفات
 * أو الدفاعات مدير الأعداء مباشرة.
 *
 * هذه خطوة تأسيسية محافظة: لا تغيّر معادلة الضرر الحالية.
 * Enemy.takeDamage() ما زال يملك حاليًا حساب الضرر الفعلي وArmor.
 * سيتم نقل قواعد الحساب تدريجيًا بعد تثبيت حدود المسؤوليات واختبارات السلوك.
 */

const CombatSystem = {
  initialized: false,

  init() {
    this.initialized = true;
    return this;
  },

  /**
   * حل إصابة مقذوف لهدف.
   *
   * النتيجة نفسها التي كان Projectile يحصل عليها مباشرة من
   * EnemyManager.damageEnemy().
   */
  resolveProjectileHit(targetEnemy, amount) {
    if (!this.initialized) {
      return null;
    }

    if (
      !targetEnemy ||
      !targetEnemy.alive
    ) {
      return null;
    }

    return EnemyManager.damageEnemy(
      targetEnemy,
      amount
    );
  },
};
