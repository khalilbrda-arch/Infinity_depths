/**
 * Player.js
 * ---------
 * اللاعب بمنظور الشخص الأول (First Person).
 * لا يوجد جسم مرئي — الكاميرا نفسها هي "عين" اللاعب.
 * يقرأ الإدخال من TouchControls (مستقل عنه تمامًا)، ويحرك موقع/دوران الكاميرا.
 */

const Player = {
  position: { x: 0, y: 0, z: 0 },
  yaw: 0,
  pitch: 0,
  camera: null,

  init(camera) {
    const p = CONFIG.PLAYER;
    this.camera = camera;

    this.position.x = p.SPAWN.x;
    this.position.y = p.SPAWN.y;
    this.position.z = p.SPAWN.z;
    this.yaw = p.START_YAW;
    this.pitch = p.START_PITCH;

    // ترتيب دوران خاص يمنع التشوه (Gimbal Lock) بكاميرا FPS
    this.camera.rotation.order = "YXZ";

    this._applyToCamera();
  },

  update(delta) {
    const p = CONFIG.PLAYER;

    // ---------- النظر حولك ----------
    const look = TouchControls.consumeLook();
    this.yaw -= look.x * p.LOOK_SENSITIVITY;
    this.pitch -= look.y * p.LOOK_SENSITIVITY;
    this.pitch = Math.max(-p.PITCH_LIMIT, Math.min(p.PITCH_LIMIT, this.pitch));

    // ---------- الحركة (بالنسبة لاتجاه النظر الحالي) ----------
    const move = TouchControls.getMove();
    const forwardX = -Math.sin(this.yaw);
    const forwardZ = -Math.cos(this.yaw);
    const rightX = Math.cos(this.yaw);
    const rightZ = -Math.sin(this.yaw);

    const speed = p.MOVE_SPEED * delta;
    this.position.x += (forwardX * move.y + rightX * move.x) * speed;
    this.position.z += (forwardZ * move.y + rightZ * move.x) * speed;

    this._applyToCamera();
  },

  _applyToCamera() {
    const p = CONFIG.PLAYER;
    this.camera.position.set(
      this.position.x,
      this.position.y + p.EYE_HEIGHT,
      this.position.z
    );
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  },
};
