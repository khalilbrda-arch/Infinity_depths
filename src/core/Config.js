/**
 * Config.js
 * ---------
 * المكان المركزي لكل الأرقام والإعدادات المهمة بالمشروع.
 * حسب GAME_SPEC.md قسم 78 — "الأرقام المهمة مركزية".
 */

const CONFIG = {
  // ---------- عام ----------
  VERSION: "0.3.0-player-fps",

  // ---------- الكاميرا (تُدار الآن عبر Player، انظر PLAYER أدناه) ----------
  CAMERA: {
    FOV: 65,
    NEAR: 0.1,
    FAR: 1000,
  },

  // ---------- اللاعب (المرحلة 3 — منظور الشخص الأول) ----------
  PLAYER: {
    EYE_HEIGHT: 3,
    MOVE_SPEED: 8,
    LOOK_SENSITIVITY: 0.0028,
    PITCH_LIMIT: 1.2, // بالراديان، يمنع الدوران الكامل عموديًا
    SPAWN: { x: 0, y: 0, z: 22 }, // خارج الجزيرة قليلاً، ينظر ناحيتها
    START_YAW: 0,
    START_PITCH: 0,
  },

  // ---------- الإضاءة ----------
  LIGHTING: {
    HEMISPHERE_SKY_COLOR: 0xbfe3ff,
    HEMISPHERE_GROUND_COLOR: 0x1a3a2a,
    HEMISPHERE_INTENSITY: 0.7,
    SUN_COLOR: 0xfff0d0,
    SUN_INTENSITY: 1.4,
  },

  // ---------- الأداء ----------
  PERFORMANCE: {
    MAX_PIXEL_RATIO: 2,
    TARGET_FPS: 60,
  },

  // ---------- الخلفية / السماء ----------
  SKY: {
    TOP_COLOR: 0x4fa8d8,
    BOTTOM_COLOR: 0xdff3ff,
  },

  // ---------- العالم ----------
  WORLD: {
    OCEAN_SIZE: 300,
    OCEAN_SEGMENTS: 120,
    OCEAN_COLOR: 0x1fa3c8,
    WAVE_AMPLITUDE: 0.35,
    SAND_COLOR: 0xe8c67a,
    GRASS_COLOR: 0x4caf6a,
  },
};
