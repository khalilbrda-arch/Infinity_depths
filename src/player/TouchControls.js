/**
 * TouchControls.js
 * ----------------
 * نظام الإدخال باللمس. مستقل تمامًا عن منطق اللاعب أو الكاميرا
 * (حسب GAME_SPEC.md قسم 75 — InputManager موحد، لا يرتبط مباشرة بمنطق اللعبة).
 *
 * - نصف الشاشة الأيسر: عصا تحكم افتراضية ديناميكية (تظهر مكان لمسة الإصبع) للحركة.
 * - نصف الشاشة الأيمن: سحب الإصبع يدوّر الكاميرا (نظر حولك).
 */

const TouchControls = {
  _moveTouchId: null,
  _lookTouchId: null,
  _joyBase: null,
  _joyKnob: null,
  _joyOrigin: { x: 0, y: 0 },
  _joyRadius: 45,
  _moveVector: { x: 0, y: 0 },
  _lookAccum: { x: 0, y: 0 },
  _lastLookX: 0,
  _lastLookY: 0,

  init() {
    this._createJoystickElements();

    window.addEventListener("touchstart", (e) => this._onTouchStart(e), { passive: false });
    window.addEventListener("touchmove", (e) => this._onTouchMove(e), { passive: false });
    window.addEventListener("touchend", (e) => this._onTouchEnd(e), { passive: false });
    window.addEventListener("touchcancel", (e) => this._onTouchEnd(e), { passive: false });
  },

  _createJoystickElements() {
    const base = document.createElement("div");
    base.style.cssText = `
      position:fixed; width:90px; height:90px; border-radius:50%;
      background:rgba(255,255,255,0.15); border:2px solid rgba(255,255,255,0.45);
      display:none; z-index:40; pointer-events:none; transform:translate(-50%,-50%);
    `;
    const knob = document.createElement("div");
    knob.style.cssText = `
      position:fixed; width:40px; height:40px; border-radius:50%;
      background:rgba(255,255,255,0.6); z-index:41; pointer-events:none;
      transform:translate(-50%,-50%);
    `;
    document.body.appendChild(base);
    document.body.appendChild(knob);
    this._joyBase = base;
    this._joyKnob = knob;
  },

  _onTouchStart(e) {
    for (const t of e.changedTouches) {
      const isLeftSide = t.clientX < window.innerWidth / 2;

      if (isLeftSide && this._moveTouchId === null) {
        this._moveTouchId = t.identifier;
        this._joyOrigin.x = t.clientX;
        this._joyOrigin.y = t.clientY;
        this._showJoystick(t.clientX, t.clientY);
      } else if (!isLeftSide && this._lookTouchId === null) {
        this._lookTouchId = t.identifier;
        this._lastLookX = t.clientX;
        this._lastLookY = t.clientY;
      }
    }
  },

  _onTouchMove(e) {
    for (const t of e.changedTouches) {
      if (t.identifier === this._moveTouchId) {
        this._updateJoystick(t.clientX, t.clientY);
      } else if (t.identifier === this._lookTouchId) {
        const dx = t.clientX - this._lastLookX;
        const dy = t.clientY - this._lastLookY;
        this._lookAccum.x += dx;
        this._lookAccum.y += dy;
        this._lastLookX = t.clientX;
        this._lastLookY = t.clientY;
      }
    }
    e.preventDefault();
  },

  _onTouchEnd(e) {
    for (const t of e.changedTouches) {
      if (t.identifier === this._moveTouchId) {
        this._moveTouchId = null;
        this._moveVector.x = 0;
        this._moveVector.y = 0;
        this._hideJoystick();
      } else if (t.identifier === this._lookTouchId) {
        this._lookTouchId = null;
      }
    }
  },

  _showJoystick(x, y) {
    this._joyBase.style.left = x + "px";
    this._joyBase.style.top = y + "px";
    this._joyBase.style.display = "block";
    this._joyKnob.style.left = x + "px";
    this._joyKnob.style.top = y + "px";
    this._joyKnob.style.display = "block";
  },

  _hideJoystick() {
    this._joyBase.style.display = "none";
    this._joyKnob.style.display = "none";
  },

  _updateJoystick(x, y) {
    const dx = x - this._joyOrigin.x;
    const dy = y - this._joyOrigin.y;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), this._joyRadius);
    const angle = Math.atan2(dy, dx);
    const clampedX = Math.cos(angle) * dist;
    const clampedY = Math.sin(angle) * dist;

    this._joyKnob.style.left = this._joyOrigin.x + clampedX + "px";
    this._joyKnob.style.top = this._joyOrigin.y + clampedY + "px";

    this._moveVector.x = clampedX / this._joyRadius;
    this._moveVector.y = -clampedY / this._joyRadius; // دفع الإصبع لفوق = تقدم للأمام
  },

  // يُستدعى كل إطار من Player — يرجع اتجاه الحركة الحالي
  getMove() {
    return this._moveVector;
  },

  // يُستدعى كل إطار من Player — يرجع مقدار دوران النظر منذ آخر إطار، ثم يصفّره
  consumeLook() {
    const l = { x: this._lookAccum.x, y: this._lookAccum.y };
    this._lookAccum.x = 0;
    this._lookAccum.y = 0;
    return l;
  },
};
