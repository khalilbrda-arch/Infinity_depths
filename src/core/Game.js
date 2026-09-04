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
 *  - Economy initialization
 *  - Enemy Manager
 *  - Wave Manager
 *  - Projectile Manager
 *  - Defense Manager
 *  - Event subscriptions بين الأنظمة
 *  - Game Loop
 *
 * لا يوجد Player.
 * الكاميرا ثابتة الزاوية وتُدار عبر CameraController.
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

    this._setupScene();
    this._setupCamera();
    this._setupRenderer();
    this._setupLighting();
    this._setupSky();
    this._setupResize();

    Ocean.create(this.scene);
    Island.create(this.scene);
    Interactables.create(this.scene);
    DefenseMap.create(this.scene);

    TouchControls.init();

    CameraController.init(
      this.camera
    );

    InteractionController.init(
      this.camera
    );

    BaseHUD.init();

    if (
      typeof EconomySystem !== "undefined"
    ) {
      EconomySystem.init();
    }

    this._setupEventSubscriptions();

    EnemyManager.init(
      this.scene
    );

    WaveManager.init();

    ProjectileManager.init(
      this.scene
    );

    DefenseManager.init(
      this.scene
    );

    GameTime.init();

    this._hideBootScreen();

    this._loop();
  },

  // =========================================================
  // EVENT BOUNDARY
  // =========================================================

  _setupEventSubscriptions() {
    if (
      typeof EventBus === "undefined"
    ) {
      console.error(
        "Game: EventBus is not available."
      );

      return;
    }

    EventBus.on(
      "EnemyReachedBase",
      (payload) => {
        if (!payload) {
          return;
        }

        GameState.damageBase(
          payload.damage
        );
      }
    );

    EventBus.on(
      "EnemyDied",
      (payload) => {
        if (!payload) {
          return;
        }

        if (
          typeof EconomySystem === "undefined"
        ) {
          console.error(
            "Game: EconomySystem is not available."
          );

          return;
        }

        EconomySystem.rewardEnemyKill(
          payload.reward
        );
      }
    );
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

    GameTime.tick();

    const delta =
      GameTime.delta;

    const elapsed =
      GameTime.elapsed;

    CameraController.update();

    InteractionController.update();

    Ocean.update(
      elapsed
    );

    Interactables.update(
      elapsed
    );

    DefenseMap.update(
      elapsed
    );

    if (!WaveManager.isGameOver()) {
      EnemyManager.update(
        delta
      );

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

    BaseHUD.update();

    this._updateDebugHud();

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
