/**
 * CombatSystem.js
 * ---------------
 * المرحلة 4 — Architecture Foundation / Combat Boundary.
 *
 * مسؤول عن تمرير نتائج الهجمات إلى نظام الأعداء دون أن تعرف المقذوفات
 * أو الدفاعات مدير الأعداء مباشرة.
 *
 * هذه خطوة تأسيسية محافظة:
 * - لا تغيّر معادلة الضرر الحالية.
 * - لا تنقل حساب Armor أو Damage من Enemy.
 * - لا تغيّر منطق الموت أو المكافآت.
 *
 * Enemy.takeDamage() ما زال يملك حاليًا حساب الضرر الفعلي وArmor.
 * وسيتم نقل قواعد القتال تدريجيًا بعد تثبيت الحدود واختبارات السلوك.
 *
 * ملاحظة:
 * CombatSystem لا يحتاج إلى دورة init مستقلة في هذه المرحلة؛
 * فهو Boundary/Resolver وليس نظامًا يحتاج إلى امتلاك موارد أو Scene.
 */

const CombatSystem = {
  /**
   * حل إصابة مقذوف لهدف.
   *
   * هذه الدالة تستبدل الاتصال المباشر السابق من:
   *
   * Projectile
   *     ↓
   * EnemyManager.damageEnemy()
   *
   * إلى:
   *
   * Projectile
   *     ↓
   * CombatSystem
   *     ↓
   * EnemyManager
   *
   * السلوك الفعلي للضرر لا يتغير في هذه المرحلة.
   */
  resolveProjectileHit(targetEnemy, amount) {
    if (
      !targetEnemy ||
      !targetEnemy.alive
    ) {
      return null;
    }

    if (
      typeof EnemyManager === "undefined"
    ) {
      console.error(
        "CombatSystem: EnemyManager is not available."
      );

      return null;
    }

    return EnemyManager.damageEnemy(
      targetEnemy,
      amount
    );
  },
};
