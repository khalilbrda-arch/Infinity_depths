/**
 * Game.js
 * -------
 * نقطة الدخول الرئيسية للمحرك.
 * مسؤول عن: Scene, Camera, Renderer, Lighting, Sky, Game Loop.
 * يستدعي أنظمة العالم (Ocean, Island) لبنائها، لكن لا يحتوي منطقها الداخلي.
 */

const Game = {
  scene: null,
  camera: null,
  renderer: null,
  container: null,

  init() {
    this.container = document.getElementById("game-container");

    this._setupScene();
    this._setupCamera();
    this._setupRenderer();
    this._setupLighting();
    this._setupSky();
    this._setupResize();

    // بناء العالم
    Ocean.create(this.scene);
    Island.create(this.scene);

    GameTime.init();

    this._hideBootScreen();
    this._loop();
  },

  _setupScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x9fd7e8, 0.015);
  },

  _setupCamera() {
    const c = CONFIG.CAMERA;
    this.camera = new THREE.PerspectiveCamera(
      c.FOV,
      window.innerWidth / window.innerHeight,
      c.NEAR,
      c.FAR
    );
    this.camera.position.set(
      c.START_POSITION.x,
      c.START_POSITION.y,
      c.START_POSITION.z
    );
    this.camera.lookAt(c.LOOK_AT.x, c.LOOK_AT.y, c.LOOK_AT.z);
  },

  _setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, CONFIG.PERFORMANCE.MAX_PIXEL_RATIO)
    );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
  },

  _setupLighting() {
    const L = CONFIG.LIGHTING;

    const hemi = new THREE.HemisphereLight(
      L.HEMISPHERE_SKY_COLOR,
      L.HEMISPHERE_GROUND_COLOR,
      L.HEMISPHERE_INTENSITY
    );
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight(L.SUN_COLOR, L.SUN_INTENSITY);
    sun.position.set(40, 60, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    this.scene.add(sun);
  },

  _setupSky() {
    const S = CONFIG.SKY;
    const skyGeo = new THREE.SphereGeometry(400, 32, 32);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color(S.TOP_COLOR) },
        bottomColor: { value: new THREE.Color(S.BOTTOM_COLOR) },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPosition;
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        void main() {
          float h = normalize(vWorldPosition).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h,0.0),0.5),0.0)), 1.0);
        }
      `,
    });
    this.scene.add(new THREE.Mesh(skyGeo, skyMat));
  },

  _setupResize() {
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  },

  _hideBootScreen() {
    const boot = document.getElementById("boot-screen");
    if (boot) boot.style.display = "none";
  },

  _updateDebugHud() {
    const hud = document.getElementById("debug-hud");
    if (!hud) return;
    const fps = GameTime.delta > 0 ? Math.round(1 / GameTime.delta) : 0;
    hud.textContent = `FPS: ${fps} | ${GameState.summary()}`;
  },

  _loop() {
    requestAnimationFrame(() => this._loop());
    GameTime.tick();
    Ocean.update(GameTime.elapsed);
    this._updateDebugHud();
    this.renderer.render(this.scene, this.camera);
  },
};

window.addEventListener("load", () => Game.init());
