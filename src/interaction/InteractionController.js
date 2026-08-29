/**
 * InteractionController.js
 * -------------------------
 * يربط "النقرة" (من TouchControls) بـ"عناصر الخريطة" (من Interactables).
 * كل إطار: يقرأ consumeTap() من TouchControls، وإذا وُجدت نقرة، يحوّلها
 * إلى شعاع (Raycaster) من الكاميرا عبر نقطة الشاشة، ويتحقق من تقاطعه
 * مع الأجسام القابلة للتفاعل الحية فقط.
 *
 * مستقل عن الكاميرا (يقرأ موقعها فقط) وعن الإدخال (يستهلك بياناته الجاهزة)،
 * ولا يحتوي منطق مكافآت — ذلك من مسؤولية Interactables/GameState.
 */

const InteractionController = {
  camera: null,
  _raycaster: null,
  _pointer: null,

  init(camera) {
    this.camera = camera;
    this._raycaster = new THREE.Raycaster();
    this._pointer = new THREE.Vector2();
  },

  update() {
    const tap = TouchControls.consumeTap();
    if (!tap) return;

    // تحويل إحداثيات الشاشة (CSS px) إلى NDC (-1..1) لكل من x وy.
    this._pointer.x = (tap.x / window.innerWidth) * 2 - 1;
    this._pointer.y = -(tap.y / window.innerHeight) * 2 + 1;

    this._raycaster.setFromCamera(this._pointer, this.camera);

    const candidates = Interactables.getLiveMeshes();
    if (candidates.length === 0) return;

    const hits = this._raycaster.intersectObjects(candidates, false);
    if (hits.length === 0) return;

    const result = Interactables.interact(hits[0].object);
    if (result) {
      Toast.show(result);
    }
  },
};
