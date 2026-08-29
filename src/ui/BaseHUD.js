/**
 * BaseHUD.js
 * ----------
 * واجهة قاعدة اللاعب.
 *
 * تعرض:
 *  - HP الحالي
 *  - Max HP
 *
 * لا تحتوي على منطق ضرر.
 * تقرأ فقط من GameState.
 */

const BaseHUD = {
  _container: null,
  _bar: null,
  _text: null,

  init() {
    if (this._container) return;

    const container = document.createElement("div");

    container.id = "base-hud";

    container.style.cssText = `
      position: fixed;

      top: 10px;
      right: 10px;

      width: 170px;

      padding: 8px 10px;

      background: rgba(8, 18, 30, 0.82);

      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;

      box-sizing: border-box;

      z-index: 55;

      pointer-events: none;

      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        system-ui,
        sans-serif;
    `;

    const title = document.createElement("div");

    title.textContent = "🏰 قاعدة اللاعب";

    title.style.cssText = `
      color: #ffffff;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 5px;
    `;

    const barBackground = document.createElement("div");

    barBackground.style.cssText = `
      width: 100%;
      height: 8px;

      background: rgba(255,255,255,0.12);

      border-radius: 5px;

      overflow: hidden;
    `;

    const bar = document.createElement("div");

    bar.style.cssText = `
      width: 100%;
      height: 100%;

      background: #55d66b;

      border-radius: 5px;

      transition:
        width 0.2s ease,
        background 0.2s ease;
    `;

    const text = document.createElement("div");

    text.style.cssText = `
      margin-top: 4px;

      color: #dcefff;

      font-size: 10px;
      font-weight: 600;

      text-align: right;
    `;

    barBackground.appendChild(bar);

    container.appendChild(title);
    container.appendChild(barBackground);
    container.appendChild(text);

    document.body.appendChild(container);

    this._container = container;
    this._bar = bar;
    this._text = text;

    this.update();
  },

  update() {
    if (!this._container) return;

    const base = GameState.base;

    const maxHp = Math.max(1, base.maxHp);
    const hp = Math.max(0, Math.min(base.hp, maxHp));

    const ratio = hp / maxHp;

    this._bar.style.width = `${ratio * 100}%`;

    if (ratio > 0.6) {
      this._bar.style.background = "#55d66b";
    } else if (ratio > 0.3) {
      this._bar.style.background = "#ffb347";
    } else {
      this._bar.style.background = "#ff5d5d";
    }

    this._text.textContent =
      `HP ${Math.ceil(hp)} / ${maxHp}`;
  },
};
