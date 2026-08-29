/**
 * Game.js
 * -------
 * نقطة الدخول الرئيسية للمحرك.
 *
 * المرحلة الحالية:
 * v0.9 — Defenses + Combat
 *
 * المسؤول عن:
 *  - Scene
 *  - Camera
 *  - Renderer
 *  - Lighting
 *  - Sky
 *  - World
 *  - Input
 *  - Interaction
 *  - Base HUD
 *  - Enemy Manager
 *  - Wave Manager
 *  - Projectile Manager
 *  - Defense Manager
 *  - Game Loop
 *
 * لا يوجد Player.
 * الكاميرا ثابتة الزاوية وتُدار عبر CameraController.
 *
 * ترتيب الأنظمة:
 *
 * World
 *   ↓
 * Input
 *   ↓
 * Camera
 *   ↓
 * Interaction
 *   ↓
 * Enemies (يتجمّد عند Game Over)
 *   ↓
 * Waves (يدير الدورة الكاملة + يكتشف Game Over)
 *   ↓
 * UI
 *   ↓
 * Render
 */

const Game = {
  scene: null,
  camera: null,
  renderer: null,
  container: null,

  init() {
    this.container =
      document.getElementById("game-container");

    if (!this.container) {
      console.error(
        "Game: #game-container غير موجود."
      );
      return;
    }

    // --------------------------------
    // Engine
    // --------------------------------

    this._setupScene();
    this._setupCamera();
    this._setupRenderer();
    this._setupLighting();
    this._setupSky();
    this._setupResize();

    // --------------------------------
    // World
    // --------------------------------

    Ocean.create(this.scene);
    Island.create(this.scene);
    Interactables.create(this.scene);
    DefenseMap.create(this.scene);

    // --------------------------------
    // Input
    // --------------------------------

    TouchControls.init();

    // --------------------------------
    // Camera
    // --------------------------------

    CameraController.init(
      this.camera
    );

    // --------------------------------
    // Interaction
    // --------------------------------

    InteractionController.init(
      this.camera
    );

    // --------------------------------
    // Base HUD
    // --------------------------------

    BaseHUD.init();

    // --------------------------------
    // Enemy System
    // --------------------------------
    //
    // المرحلة 6:
    // EnemyPath
    // Enemy
    // EnemyManager
    //

    EnemyManager.init(
      this.scene
    );

    // --------------------------------
    // Wave System
    // --------------------------------
    //
    // المرحلة 7:
    // WaveManager يتولى الآن جدولة ظهور الأعداء بالكامل
    // (لم يعد هناك عدو تجريبي يدوي — spawnTestEnemy لم تعد تُستدعى هنا).
    //

    WaveManager.init();

    // --------------------------------
    // Combat System (المقذوفات)
    // --------------------------------
    //
    // المرحلة 9:
    // يجب تهيئة ProjectileManager قبل DefenseManager لأن أول دفاع قد
    // يُوضع ويطلق مقذوفًا بنفس الإطار نظريًا.

    ProjectileManager.init(
      this.scene
    );

    // --------------------------------
    // Defense System
    // --------------------------------
    //
    // المرحلة 8:
    // DefenseManager يتولى وضع الدفاعات وتحديثها (استهداف + إطلاق نار
    // عبر ProjectileManager أعلاه).

    DefenseManager.init(
      this.scene
    );

    // --------------------------------
    // Game Time
    // --------------------------------

    GameTime.init();

    // --------------------------------
    // Start
    // --------------------------------

    this._hideBootScreen();

    this._loop();
  },

  // =========================================================
  // SCENE
  // =========================================================

  _setupScene() {
    this.scene =
      new THREE.Scene();

    this.scene.fog =
      new THREE.FogExp2(
        0x9fd7e8,
        0.015
      );
  },

  // =========================================================
  // CAMERA
  // =========================================================

  _setupCamera() {
    const c =
      CONFIG.CAMERA;

    this.camera =
      new THREE.PerspectiveCamera(
        c.FOV,
        window.innerWidth /
          window.innerHeight,
        c.NEAR,
        c.FAR
      );

    /*
     * CameraController.init()
     * سيضبط الموقع والزاوية الفعلية.
     */
  },

  // =========================================================
  // RENDERER
  // =========================================================

  _setupRenderer() {
    this.renderer =
      new THREE.WebGLRenderer({
        antialias: true,
      });

    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    this.renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        CONFIG.PERFORMANCE.MAX_PIXEL_RATIO
      )
    );

    this.renderer.shadowMap.enabled =
      true;

    this.renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    this.container.appendChild(
      this.renderer.domElement
    );
  },

  // =========================================================
  // LIGHTING
  // =========================================================

  _setupLighting() {
    const L =
      CONFIG.LIGHTING;

    const hemi =
      new THREE.HemisphereLight(
        L.HEMISPHERE_SKY_COLOR,
        L.HEMISPHERE_GROUND_COLOR,
        L.HEMISPHERE_INTENSITY
      );

    this.scene.add(
      hemi
    );

    const sun =
      new THREE.DirectionalLight(
        L.SUN_COLOR,
        L.SUN_INTENSITY
      );

    sun.position.set(
      40,
      60,
      20
    );

    sun.castShadow =
      true;

    sun.shadow.mapSize.set(
      1024,
      1024
    );

    this.scene.add(
      sun
    );
  },

  // =========================================================
  // SKY
  // =========================================================

  _setupSky() {
    const S =
      CONFIG.SKY;

    const skyGeo =
      new THREE.SphereGeometry(
        400,
        32,
        32
      );

    const skyMat =
      new THREE.ShaderMaterial({
        side: THREE.BackSide,

        uniforms: {
          topColor: {
            value:
              new THREE.Color(
                S.TOP_COLOR
              ),
          },

          bottomColor: {
            value:
              new THREE.Color(
                S.BOTTOM_COLOR
              ),
          },
        },

        vertexShader: `
          varying vec3 vWorldPosition;

          void main() {
            vec4 worldPosition =
              modelMatrix *
              vec4(position, 1.0);

            vWorldPosition =
              worldPosition.xyz;

            gl_Position =
              projectionMatrix *
              modelViewMatrix *
              vec4(position, 1.0);
          }
        `,

        fragmentShader: `
          varying vec3 vWorldPosition;

          uniform vec3 topColor;
          uniform vec3 bottomColor;

          void main() {
            float h =
              normalize(
                vWorldPosition
              ).y;

            float factor =
              max(
                pow(
                  max(h, 0.0),
                  0.5
                ),
                0.0
              );

            gl_FragColor =
              vec4(
                mix(
                  bottomColor,
                  topColor,
                  factor
                ),
                1.0
              );
          }
        `,
      });

    this.scene.add(
      new THREE.Mesh(
        skyGeo,
        skyMat
      )
    );
  },

  // =========================================================
  // RESIZE
  // =========================================================

  _setupResize() {
    window.addEventListener(
      "resize",
      () => {
        if (
          !this.camera ||
          !this.renderer
        ) {
          return;
        }

        this.camera.aspect =
          window.innerWidth /
          window.innerHeight;

        this.camera.updateProjectionMatrix();

        this.renderer.setSize(
          window.innerWidth,
          window.innerHeight
        );
      }
    );
  },

  // =========================================================
  // BOOT SCREEN
  // =========================================================

  _hideBootScreen() {
    const boot =
      document.getElementById(
        "boot-screen"
      );

    if (boot) {
      boot.style.display =
        "none";
    }
  },

  // =========================================================
  // DEBUG HUD
  // =========================================================

  _updateDebugHud() {
    const hud =
      document.getElementById(
        "debug-hud"
      );

    if (!hud) {
      return;
    }

    const fps =
      GameTime.delta > 0
        ? Math.round(
            1 / GameTime.delta
          )
        : 0;

    const enemyCount =
      EnemyManager.initialized
        ? EnemyManager.getAliveEnemies().length
        : 0;

    const defenseCount =
      DefenseManager.initialized
        ? DefenseManager.getDefenses().length
        : 0;

    hud.textContent =
      `FPS: ${fps}` +
      ` | ${GameState.summary()}` +
      ` | Wave: ${WaveManager.currentWave}` +
      ` | Enemies: ${enemyCount}` +
      ` | Defenses: ${defenseCount}`;
  },

  // =========================================================
  // MAIN LOOP
  // =========================================================

  _loop() {
    requestAnimationFrame(
      () => this._loop()
    );

    // -----------------------------
    // Time
    // -----------------------------

    GameTime.tick();

    const delta =
      GameTime.delta;

    const elapsed =
      GameTime.elapsed;

    // -----------------------------
    // Camera
    // -----------------------------

    CameraController.update();

    // -----------------------------
    // Input / Interaction
    // -----------------------------

    InteractionController.update();

    // -----------------------------
    // World
    // -----------------------------

    Ocean.update(
      elapsed
    );

    Interactables.update(
      elapsed
    );

    DefenseMap.update(
      elapsed
    );

    // -----------------------------
    // Enemies + Waves
    // -----------------------------
    //
    // عند Game Over: تتجمّد حركة الأعداء (لا EnemyManager.update)
    // بينما يبقى WaveManager.update يعمل فقط لاكتشاف حالة اللعبة
    // المنتهية (لا يجدول أي شيء جديد بهذه الحالة).

    if (!WaveManager.isGameOver()) {
      EnemyManager.update(
        delta
      );

      // -----------------------------
      // Defenses + Combat (المرحلتان 8 و9)
      // -----------------------------
      //
      // تتجمّد مثل الأعداء تمامًا عند Game Over — لا معنى لاستمرار
      // الدفاعات بإطلاق النار أو المقذوفات بالحركة بعد تدمير القاعدة.

      DefenseManager.update(
        delta
      );

      ProjectileManager.update(
        delta
      );
    }

    WaveManager.update(
      delta
    );

    // -----------------------------
    // UI
    // -----------------------------

    BaseHUD.update();

    this._updateDebugHud();

    // -----------------------------
    // Render
    // -----------------------------

    this.renderer.render(
      this.scene,
      this.camera
    );
  },
};


// ===========================================================
// BOOT
// ===========================================================

window.addEventListener(
  "load",
  () => {
    Game.init();
  }
);
