/**
 * EconomySystem.js
 * ----------------
 * المرحلة 4 — Architecture Foundation / Economy Boundary.
 *
 * مسؤول عن:
 * - التحقق من القدرة على الدفع.
 * - تنفيذ معاملات العملة.
 * - إضافة مكافآت العملة.
 *
 * لا يملك:
 * - واجهة المستخدم.
 * - الدفاعات.
 * - الأعداء.
 * - تعريفات المحتوى.
 *
 * ملاحظة:
 * GameState ما زال يخزن الرصيد فعليًا في هذه المرحلة.
 * هذا النظام يمثل حدود الاقتصاد، وسيتم نقل الملكية إليه
 * تدريجيًا بعد تثبيت السلوك والاختبارات.
 */

const EconomySystem = {
  initialized: false,

  init() {
    this.initialized = true;
  },

  canAfford(amount) {
    if (
      typeof GameState === "undefined"
    ) {
      console.error(
        "EconomySystem: GameState is not available."
      );

      return false;
    }

    const cost =
      Math.max(
        0,
        Number(amount) || 0
      );

    return GameState.canAfford(
      cost
    );
  },

  spend(amount) {
    if (
      typeof GameState === "undefined"
    ) {
      console.error(
        "EconomySystem: GameState is not available."
      );

      return false;
    }

    const cost =
      Math.max(
        0,
        Number(amount) || 0
      );

    if (
      !this.canAfford(cost)
    ) {
      return false;
    }

    return GameState.spendCurrency(
      cost
    );
  },

  add(amount) {
    if (
      typeof GameState === "undefined"
    ) {
      console.error(
        "EconomySystem: GameState is not available."
      );

      return null;
    }

    const value =
      Math.max(
        0,
        Number(amount) || 0
      );

    GameState.player.currency +=
      value;

    return {
      amount: value,

      total:
        GameState.player.currency,
    };
  },

  rewardEnemyKill(reward) {
    if (
      typeof GameState === "undefined"
    ) {
      console.error(
        "EconomySystem: GameState is not available."
      );

      return null;
    }

    return GameState.rewardEnemyKill(
      reward
    );
  },

  getBalance() {
    if (
      typeof GameState === "undefined"
    ) {
      return 0;
    }

    return Math.max(
      0,
      Number(
        GameState.player.currency
      ) || 0
    );
  },
};
