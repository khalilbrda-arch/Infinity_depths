/**
 * TouchControls.js
 * ----------------
 * نظام الإدخال الجديد بالكامل (يحل محل النسخة القديمة في src/player/).
 * لا يوجد عصا تحكم افتراضية ولا "نظر حولك" — فقط:
 *
 *  - إصبع واحد + سحب  = Pan  (تجميع إزاحة السحب بالبكسل).
 *  - إصبعين + تغيير المسافة بينهم = Zoom.
 *  - على الحاسوب (للاختبار فقط، لا يؤثر على الهاتف): سحب بالماوس = Pan، عجلة الماوس = Zoom.
 *
 * مستقل تمامًا عن الكاميرا — لا يعرف عنها شيئًا، فقط يوفر:
 * consumePan() و consumeZoom() لـ CameraController.
 */

const TouchControls = {
  _panAccum: { x: 0, y: 0 },
  _zoomAccum: 0,

  _activeTouches: {}, // id -> {x, y}
  _lastPinchDist: null,

  _mouseDown: false,
  _lastMouseX: 0,
  _lastMouseY: 0,

  init() {
    window.addEventListener("touchstart", (e) => this._onTouchStart(e), { passive: false });
    window.addEventListener("touchmove", (e) => this._onTouchMove(e), { passive: false });
    window.addEventListener("touchend", (e) => this._onTouchEnd(e), { passive: false });
    window.addEventListener("touchcancel", (e) => this._onTouchEnd(e), { passive: false });

    // دعم الماوس للاختبار على الحاسوب فقط
    window.addEventListener("mousedown", (e) => this._onMouseDown(e));
    window.addEventListener("mousemove", (e) => this._onMouseMove(e));
    window.addEventListener("mouseup", () => this._onMouseUp());
    window.addEventListener("wheel", (e) => this._onWheel(e), { passive: false });
  },

  // ---------- اللمس ----------

  _onTouchStart(e) {
    for (const t of e.changedTouches) {
      this._activeTouches[t.identifier] = { x: t.clientX, y: t.clientY };
    }
    if (this._touchCount() === 2) {
      this._lastPinchDist = this._currentPinchDist();
    }
  },

  _onTouchMove(e) {
    e.preventDefault();

    if (this._touchCount() === 1) {
      const t = e.changedTouches[0];
      const prev = this._activeTouches[t.identifier];
      if (prev) {
        this._panAccum.x += t.clientX - prev.x;
        this._panAccum.y += t.clientY - prev.y;
      }
    }

    for (const t of e.changedTouches) {
      this._activeTouches[t.identifier] = { x: t.clientX, y: t.clientY };
    }

    if (this._touchCount() === 2) {
      const dist = this._currentPinchDist();
      if (this._lastPinchDist !== null) {
        // تباعد الإصبعين (dist يكبر) = تقريب الكاميرا (Zoom In) => قيمة سالبة
        this._zoomAccum += this._lastPinchDist - dist;
      }
      this._lastPinchDist = dist;
    }
  },

  _onTouchEnd(e) {
    for (const t of e.changedTouches) {
      delete this._activeTouches[t.identifier];
    }
    if (this._touchCount() < 2) {
      this._lastPinchDist = null;
    }
  },

  _touchCount() {
    return Object.keys(this._activeTouches).length;
  },

  _currentPinchDist() {
    const pts = Object.values(this._activeTouches);
    if (pts.length < 2) return 0;
    const dx = pts[0].x - pts[1].x;
    const dy = pts[0].y - pts[1].y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  // ---------- الماوس (اختبار على الحاسوب فقط) ----------

  _onMouseDown(e) {
    this._mouseDown = true;
    this._lastMouseX = e.clientX;
    this._lastMouseY = e.clientY;
  },

  _onMouseMove(e) {
    if (!this._mouseDown) return;
    this._panAccum.x += e.clientX - this._lastMouseX;
    this._panAccum.y += e.clientY - this._lastMouseY;
    this._lastMouseX = e.clientX;
    this._lastMouseY = e.clientY;
  },

  _onMouseUp() {
    this._mouseDown = false;
  },

  _onWheel(e) {
    e.preventDefault();
    this._zoomAccum += e.deltaY * 0.05;
  },

  // ---------- يُستدعى من CameraController كل إطار ----------

  consumePan() {
    const p = { x: this._panAccum.x, y: this._panAccum.y };
    this._panAccum.x = 0;
    this._panAccum.y = 0;
    return p;
  },

  consumeZoom() {
    const z = this._zoomAccum;
    this._zoomAccum = 0;
    return z;
  },
};
