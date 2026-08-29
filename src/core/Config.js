/**
 * Config.js
 * ---------
 * المكان المركزي لكل الأرقام والإعدادات المهمة بالمشروع.
 * حسب GAME_SPEC.md قسم 78 — "الأرقام المهمة مركزية".
 * أي نظام جديد يحتاج رقم ثابت (سرعة، مسافة، لون...) يُضاف هنا،
 * لا يُكتب مباشرة داخل ملفات الأنظمة.
 */

const CONFIG = {
  // ---------- عام ----------
  VERSION: "0.2.1-world-camera-fix",

  // ---------- الكاميرا ----------
  CAMERA: {
    FOV: 50,
    NEAR: 0.1,
    FAR: 1000,
    START_POSITION: { x: 0, y: 24, z: 38 },
    LOOK_AT: { x: 0, y: 3, z: 0 },
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
