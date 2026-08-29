/**
 * Toast.js
 * --------
 * إشعار نصي بسيط يظهر لثانية عند فتح صندوق/جمع مورد، ثم يختفي.
 * UI بسيط جدًا (DOM فوق الـ Canvas) — لا يحمل أي منطق لعبة، فقط عرض.
 * قسم 52/53 بالمواصفات (HUD وواجهات بسيطة قابلة للتوسع لاحقًا).
 */

const Toast = {
  _el: null,
  _hideTimeout: null,

  _ensureElement() {
    if (this._el) return this._el;
    const el = document.createElement("div");
    el.id = "interaction-toast";
    el.style.cssText = `
      position: fixed;
      top: 18%;
      left: 50%;
      transform: translate(-50%, 0);
      background: rgba(10, 20, 32, 0.75);
      color: #ffe9a8;
      font-family: -apple-system, system-ui, sans-serif;
      font-size: 14px;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 20px;
      z-index: 60;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease, transform 0.15s ease;
    `;
    document.body.appendChild(el);
    this._el = el;
    return el;
  },

  show(result) {
    const el = this._ensureElement();
    const label = result.type === "chest" ? "صندوق كنز" : "مورد";
    el.textContent = `${label} +${result.reward} 🪙`;

    el.style.opacity = "1";
    el.style.transform = "translate(-50%, -6px)";

    clearTimeout(this._hideTimeout);
    this._hideTimeout = setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translate(-50%, 0)";
    }, 1100);
  },
};
