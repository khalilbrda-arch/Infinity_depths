/**

* Infinity Depths
* Phase 4 — Regression Tests
* 
* الهدف:
* - منع عودة WaveManager إلى الاعتماد المباشر على GameState.
* - التأكد من أن Game يستخدم EventBus كحد فاصل.
* - التأكد من أن تدمير القاعدة ينتج BaseDestroyed مرة واحدة فقط.
* 
* التشغيل:
* node --test tests/phase4-regression.test.js
* 
* لا يحتاج Three.js أو DOM حقيقي.
  */

const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// ============================================================
// HELPERS
// ============================================================

const ROOT =
path.resolve(
__dirname,
".."
);

function readSource(relativePath) {
return fs.readFileSync(
path.join(
ROOT,
relativePath
),
"utf8"
);
}

function loadScript(
relativePath,
context
) {
const source =
readSource(
relativePath
);

const exportedNames = {
"src/core/EventBus.js":
"EventBus",

"src/core/GameState.js":
  "GameState",

"src/core/Game.js":
  "Game",

};

const exportedName =
exportedNames[
relativePath
];

if (exportedName) {
const value =
vm.runInContext(
"(function () { ${source} return ${exportedName}; })()",
context,
{
filename:
relativePath,
}
);

context[
  exportedName
] = value;

return value;

}

return vm.runInContext(
source,
context,
{
filename:
relativePath,
}
);
}

function createContext(
overrides = {}
) {
return vm.createContext({
console,
Math,
Number,
String,
Boolean,
Object,
Array,
JSON,

window: {
  addEventListener() {},
},

...overrides,

});
}

function loadGameContext() {
const context =
createContext({
CONFIG: {
DEFENSE_MAP: {
BASE: {
hp: 100,
maxHp: 100,
},
},
},
});

loadScript(
"src/core/EventBus.js",
context
);

loadScript(
"src/core/GameState.js",
context
);

loadScript(
"src/core/Game.js",
context
);

return context;
}

// ============================================================
// ARCHITECTURE BOUNDARY
// ============================================================

test(
"Regression: WaveManager has no direct GameState dependency",
() => {
const source =
readSource(
"src/waves/WaveManager.js"
);

assert.equal(
  source.includes(
    "GameState"
  ),
  false,
  "WaveManager must not reference GameState directly."
);

}
);

test(
"Regression: WaveManager listens for BaseDestroyed through EventBus",
() => {
const source =
readSource(
"src/waves/WaveManager.js"
);

assert.equal(
  source.includes(
    '"BaseDestroyed"'
  ),
  true,
  "WaveManager must subscribe to BaseDestroyed."
);

assert.equal(
  source.includes(
    "EventBus.on"
  ),
  true,
  "WaveManager must use EventBus for the base-destroyed boundary."
);

}
);

test(
"Regression: Game owns the EnemyReachedBase -> GameState boundary",
() => {
const source =
readSource(
"src/core/Game.js"
);

assert.equal(
  source.includes(
    '"EnemyReachedBase"'
  ),
  true
);

assert.equal(
  source.includes(
    "GameState.damageBase"
  ),
  true
);

}
);

test(
"Regression: Game emits BaseDestroyed",
() => {
const source =
readSource(
"src/core/Game.js"
);

assert.equal(
  source.includes(
    '"BaseDestroyed"'
  ),
  true,
  "Game must emit BaseDestroyed."
);

}
);

// ============================================================
// EVENT FLOW
// ============================================================

test(
"Regression: destroying the base emits BaseDestroyed",
() => {
const context =
loadGameContext();

let destroyedEvents =
  0;

let receivedPayload =
  null;

context.EventBus.on(
  "BaseDestroyed",
  (payload) => {
    destroyedEvents += 1;
    receivedPayload =
      payload;
  }
);

context.Game
  ._setupEventSubscriptions();

context.EventBus.emit(
  "EnemyReachedBase",
  {
    enemyId:
      "enemy_regression_01",

    type:
      "basic",

    damage:
      100,
  }
);

assert.equal(
  context.GameState.base.hp,
  0
);

assert.equal(
  context.GameState.isBaseDestroyed(),
  true
);

assert.equal(
  destroyedEvents,
  1
);

assert.deepEqual(
  receivedPayload,
  {
    hp: 0,
    maxHp: 100,
    damage: 100,
  }
);

}
);

test(
"Regression: BaseDestroyed is emitted only on the transition to destroyed",
() => {
const context =
loadGameContext();

let destroyedEvents =
  0;

context.EventBus.on(
  "BaseDestroyed",
  () => {
    destroyedEvents += 1;
  }
);

context.Game
  ._setupEventSubscriptions();

context.EventBus.emit(
  "EnemyReachedBase",
  {
    enemyId:
      "enemy_regression_02",

    type:
      "basic",

    damage:
      100,
  }
);

context.EventBus.emit(
  "EnemyReachedBase",
  {
    enemyId:
      "enemy_regression_03",

    type:
      "basic",

    damage:
      50,
  }
);

assert.equal(
  context.GameState.base.hp,
  0
);

assert.equal(
  destroyedEvents,
  1,
  "BaseDestroyed must not be emitted repeatedly after destruction."
);

}
);

test(
"Regression: non-lethal base damage does not emit BaseDestroyed",
() => {
const context =
loadGameContext();

let destroyedEvents =
  0;

context.EventBus.on(
  "BaseDestroyed",
  () => {
    destroyedEvents += 1;
  }
);

context.Game
  ._setupEventSubscriptions();

context.EventBus.emit(
  "EnemyReachedBase",
  {
    enemyId:
      "enemy_regression_04",

    type:
      "basic",

    damage:
      25,
  }
);

assert.equal(
  context.GameState.base.hp,
  75
);

assert.equal(
  destroyedEvents,
  0
);

}
);

// ============================================================
// ISOLATION
// ============================================================

test(
"Regression: EnemyDied does not emit BaseDestroyed",
() => {
const context =
loadGameContext();

let destroyedEvents =
  0;

context.EventBus.on(
  "BaseDestroyed",
  () => {
    destroyedEvents += 1;
  }
);

context.Game
  ._setupEventSubscriptions();

context.EventBus.emit(
  "EnemyDied",
  {
    enemyId:
      "enemy_regression_05",

    type:
      "basic",

    reward:
      10,
  }
);

assert.equal(
  context.GameState.base.hp,
  100
);

assert.equal(
  destroyedEvents,
  0
);

}
);

console.log(
"\n========================================"
);

console.log(
"Infinity Depths — Phase 4 Regression Tests"
);

console.log(
"========================================\n"
);
