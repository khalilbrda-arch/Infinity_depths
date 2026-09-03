Infinity Depths — System Ownership

1. Purpose

هذا الملف يحدد مالك كل نظام في اللعبة.

الهدف:

- منع تداخل المسؤوليات.
- منع الأنظمة من تعديل بيانات لا تملكها.
- منع ظهور Duplicate Systems.
- منع God Objects.
- تحديد طريقة التواصل بين الأنظمة.
- تسهيل تطوير المشروع عندما يصبح ضخمًا.

---

2. Ownership Rule

كل نظام يجب أن يكون له:

1. Owner واضح.
2. State واضح.
3. مسؤوليات محددة.
4. مدخلات معروفة.
5. مخرجات معروفة.
6. أنظمة مسموح له بالتواصل معها.
7. أنظمة ممنوع عليه امتلاك مسؤولياتها.

لا يعني هذا أن النظام لا يستطيع قراءة نظام آخر.

يعني أن القراءة لا تعني الملكية.

---

3. Core Ownership Map

System| Owner| Reads| Modifies
Game Coordinator| Game.js| Game systems| Lifecycle only
Time| GameTime| Clock| Time state
Input| TouchControls / InteractionController| User input| Interaction state
Camera| CameraController| Input| Camera
World| World modules| Config / Game state| World objects
Base| GameState / future BaseSystem| Combat events| Base HP
Enemies| EnemyManager| Enemy definitions / waves| Enemy instances
Waves| WaveManager| Wave definitions| Wave runtime
Defenses| DefenseManager| Defense definitions / input| Defense instances
Combat| Combat modules| Defense/enemy state| Damage/combat results
Projectiles| ProjectileManager| Projectile definitions| Projectile instances
Economy| EconomySystem| Rewards / transactions| Currency
Progression| ProgressionSystem| XP / requirements| Unlocks / levels
Inventory| InventorySystem| Items| Inventory
Collection| CollectionSystem| Collected content| Collection state
Merge| MergeSystem| Merge definitions / inventory| Merge results
Boss| BossSystem| Boss definitions / combat| Boss runtime state
Quests| QuestSystem| Events / definitions| Quest progress
Weather| WeatherSystem| Weather definitions| Weather state
Day/Night| DayNightSystem| Time| Lighting/state
Save| SaveManager| Owned persistent state| Save data
UI| UI modules| Read-only gameplay state/events| Presentation only
Audio| AudioSystem| Audio events| Audio playback
VFX| VFXSystem| VFX events| Visual effects
Asset Registry| AssetRegistry| Asset definitions| Asset references

---

4. Game Coordinator

Owner

"Game.js"

Responsibilities

- Initialize systems.
- Establish dependencies.
- Start the game.
- Update systems in the correct order.
- Handle global lifecycle.

Must Not Own

- Economy rules.
- Combat calculations.
- Enemy behavior.
- Defense behavior.
- Quest logic.
- Save serialization.

"Game.js" coordinates.

It does not become a God Object.

---

5. Time System

Owner

"GameTime"

Current implementation:

"src/core/Time.js"

Owns

- Delta time.
- Elapsed time.
- Clock lifecycle.

Other Systems May

Read time.

Other Systems Must Not

Create competing global clocks for gameplay logic without explicit justification.

---

6. Input System

Current Owners

"TouchControls"

"InteractionController"

Owns

- Touch/pointer interpretation.
- Tap detection.
- Pan detection.
- Zoom detection.
- World interaction requests.

Must Not Own

- Damage.
- Economy.
- Defense statistics.
- Enemy behavior.
- Camera gameplay rules.

Input describes what the player did.

Gameplay decides what that action means.

---

7. Camera System

Owner

"CameraController"

Current file:

"src/camera/CameraController.js"

Owns

- Camera position.
- Camera angle.
- Zoom.
- Pan.
- Camera bounds.

Current Design

Fixed-angle top-down camera.

Approximate tilt:

"58°"

Must Not Own

- Player movement.
- Defense movement.
- Combat.
- World progression.

---

8. World System

Owners

World modules under:

"src/world/"

Current modules include:

- Ocean.
- Island.
- DefenseMap.
- Interactables.

Owns

- World objects.
- Battlefield environment.
- Static world presentation.
- World interaction targets.

Must Not Own

- Economy transactions.
- Combat calculations.
- Quest progression.

---

9. Base System

Current State

Base HP is currently represented through gameplay state.

Future Owner

"BaseSystem"

when the complexity requires a dedicated system.

Owns

- Base HP.
- Base damage.
- Base destruction.
- Base-related events.

Must Not Own

- Enemy movement.
- Wave spawning.
- UI.

---

10. Enemy System

Owner

"EnemyManager"

Supporting modules:

src/enemies/Enemy.js
src/enemies/EnemyManager.js
src/enemies/EnemyPath.js

Owns

- Enemy runtime instances.
- Enemy spawning from requests.
- Enemy movement.
- Enemy targeting behavior where applicable.
- Enemy death.
- Enemy runtime status effects.

Reads

- Enemy definitions.
- Path data.
- Time.
- Combat results.

Must Not Own

- Wave progression.
- Economy rules.
- Quest rules.
- UI.

---

11. Wave System

Owner

"WaveManager"

Current file:

"src/waves/WaveManager.js"

Owns

- Wave sequence.
- Wave timing.
- Spawn scheduling.
- Wave completion.
- Wave progression.

Reads

- Wave definitions.
- Enemy definitions.

Commands

WaveManager may request:

Spawn Enemy

It does not directly implement Enemy behavior.

---

12. Defense System

Owner

"DefenseManager"

Supporting module:

"src/defenses/Defense.js"

Owns

- Defense runtime instances.
- Defense placement.
- Defense configuration at runtime.
- Defense targeting requests.
- Defense lifecycle.

Reads

- Defense definitions.
- Player affordability state.
- World placement constraints.

Must Not Own

- Economy rules.
- Projectile simulation.
- UI rendering.

---

13. Defense Placement

Owner

"InteractionController" + "DefenseManager"

Current Design

Tap-to-place.

Not:

- drag-and-drop;
- fixed slots.

Placement is free within valid battlefield areas.

Rule

Input requests placement.

Defense system validates and performs placement.

---

14. Combat System

Owner

Combat modules.

Current modules:

src/combat/Projectile.js
src/combat/ProjectileManager.js

Owns

- Damage calculations.
- Target interactions.
- Attack resolution.
- Combat effects.
- Status effect application where appropriate.

Must Not Own

- Currency rules.
- Quest progression.
- UI.

---

15. Projectile System

Owner

"ProjectileManager"

Owns

- Projectile instances.
- Projectile movement.
- Projectile lifecycle.
- Projectile collision/hit resolution.

Reads

- Target state.
- Projectile definitions.
- Time.

Must Not Own

- Economy.
- Wave progression.
- Defense placement.

---

16. Economy System

Future Owner

"EconomySystem"

Owns

- Currency balances.
- Transactions.
- Costs.
- Rewards.
- Validation of affordability.
- Currency changes.

Rules

No other system directly modifies currency.

Correct:

Reward
    ↓
EconomySystem
    ↓
Currency

Incorrect:

EnemyManager → currency += 100

---

17. Progression System

Future Owner

"ProgressionSystem"

Owns

- XP.
- Levels.
- Unlocks.
- Progression requirements.
- Map/feature unlocks.

Must Not Own

- Currency transactions.
- Inventory implementation.
- Quest UI.

---

18. Inventory System

Future Owner

"InventorySystem"

Owns

- Item quantities.
- Item addition/removal.
- Inventory capacity if introduced.
- Inventory validation.

Must Not Own

- Collection completion.
- Merge rules.

---

19. Collection System

Future Owner

"CollectionSystem"

Owns

- Discovered/collected content.
- Collection completion.
- Collection metadata.

Collection is not the same thing as runtime inventory.

---

20. Merge System

Future Owner

"MergeSystem"

Owns

- Merge recipes.
- Merge validation.
- Input requirements.
- Merge result generation.
- Merge transactions.

Must Not Own

- Generic inventory logic.
- Economy implementation.

---

21. Boss System

Future Owner

"BossSystem"

Owns

- Boss-specific runtime state.
- Boss phases.
- Boss abilities.
- Boss mechanics.
- Boss-specific transitions.

Bosses reuse the existing combat architecture.

Bosses must not create a completely separate combat engine unless proven necessary.

---

22. Quest System

Future Owner

"QuestSystem"

Owns

- Quest definitions.
- Objectives.
- Progress.
- Completion.
- Rewards request.

Preferred Communication

Quests should react to gameplay events.

Example:

EnemyKilledEvent
        ↓
QuestSystem
        ↓
Objective Progress

---

23. Weather System

Future Owner

"WeatherSystem"

Owns

- Current weather.
- Weather transitions.
- Weather effects.

Weather gameplay modifiers must be defined explicitly.

---

24. Day/Night System

Future Owner

"DayNightSystem"

Owns

- Time-of-day state.
- Day/night transitions.
- Lighting state.
- Related world presentation.

It must not create an independent time system.

---

25. Save System

Owner

"SaveManager"

Owns

- Serialization.
- Deserialization.
- Save validation.
- Versioning.
- Migration.
- Backup.
- Recovery.

Rule

Runtime objects are reconstructed.

They are not blindly serialized.

Save structure follows:

"SAVE_SCHEMA.md"

---

26. UI System

Owners

Modules under:

"src/ui/"

Current modules include:

- BaseHUD.
- WaveUI.
- DefenseUI.
- GameOverUI.
- Toast.

UI Owns

- Presentation.
- Input presentation.
- Menus.
- HUD.
- Feedback.

UI Must Not Own

- Economy calculations.
- Combat calculations.
- Enemy behavior.
- Save logic.
- Progression rules.

UI requests actions through the appropriate system.

---

27. Audio System

Future Owner

"AudioSystem"

Owns

- Music.
- Sound effects.
- Audio playback.
- Audio settings.

Gameplay systems should communicate audio-worthy events rather than directly managing audio files wherever practical.

---

28. VFX System

Future Owner

"VFXSystem"

Owns

- Hit effects.
- Death effects.
- Ability effects.
- Environmental effects.

Gameplay logic should not become dependent on VFX implementation.

---

29. Asset Registry

Future Owner

"AssetRegistry"

Owns

Mapping:

visualId
audioId
vfxId
asset reference

Gameplay definitions should reference stable IDs instead of hardcoded visual implementation.

---

30. Event Ownership

Events represent facts.

Examples:

EnemySpawnedEvent
EnemyKilledEvent
DefensePlacedEvent
DefenseDestroyedEvent
WaveStartedEvent
WaveCompletedEvent
BaseDamagedEvent
BaseDestroyedEvent
RewardGrantedEvent
QuestCompletedEvent

Rule

The system that owns the fact publishes it.

Systems that need the information subscribe.

---

31. Event Restrictions

Events must not:

- replace every direct function call;
- hide critical control flow;
- create circular event chains;
- mutate unrelated systems without ownership;
- become a God Event.

---

32. Direct Calls

Direct calls are allowed when:

- ownership is obvious;
- the operation is synchronous;
- the dependency is legitimate;
- no circular dependency is created.

Events are preferred for cross-domain notifications.

---

33. Dependency Direction

Preferred dependency direction:

Input
  ↓
Gameplay Commands
  ↓
Gameplay Systems
  ↓
State / Domain Results
  ↓
Events
  ↓
UI / Audio / VFX / Analytics

Presentation must not become the owner of gameplay.

---

34. Forbidden Dependency Examples

Forbidden:

UI → GameState.currency += 100

Forbidden:

ProjectileManager → Quest UI manipulation

Forbidden:

Enemy → directly modify unrelated UI

Forbidden:

CameraController → economy

Forbidden:

WaveUI → WaveManager internal state mutation

---

35. GameState Rule

"GameState" may contain shared state during the current prototype stage.

However:

GameState must not become the owner of every domain.

As systems mature, domain state should move to its appropriate owner.

---

36. Data Ownership

Definitions belong to their domain.

Examples:

EnemyDefinition → Enemy domain
DefenseDefinition → Defense domain
WaveDefinition → Wave domain
MergeDefinition → Merge domain
QuestDefinition → Quest domain

Runtime instances are created by their owning system.

---

37. Configuration Ownership

"Config.js" is currently a prototype configuration source.

As the data architecture matures:

- static configuration;
- content definitions;
- balance values;
- runtime state

must be separated.

---

38. Testing Ownership

Each system owns tests for its own behavior.

Integration tests validate interactions between systems.

Example:

Enemy
+
Combat
+
Economy
+
Quest

must not be tested only through UI.

---

39. Performance Ownership

Each system is responsible for avoiding unnecessary work.

The Performance phase will later establish measured budgets for:

- FPS.
- CPU.
- GPU.
- memory.
- entities.
- draw calls.
- loading time.

No optimization should be performed solely by assumption.

---

40. Mobile Ownership

Mobile compatibility is a project-wide requirement.

Each system must consider:

- touch;
- memory;
- CPU;
- GPU;
- battery;
- screen sizes;
- device performance.

---

41. Save Ownership Boundary

Gameplay systems own their gameplay state.

"SaveManager" owns persistence.

Therefore:

EconomySystem
    ↓
provides serializable economy state

SaveManager
    ↓
stores it

SaveManager must not implement economy logic.

---

42. Future Online Boundary

The offline game remains authoritative over its local runtime.

Future networking must not force current systems to become network-dependent.

Future architecture:

Gameplay Domain
        ↑
Local / Network Authority Boundary

Multiplayer is a separate phase.

---

43. Ownership Conflict Rule

If two systems appear to own the same responsibility:

1. Stop.
2. Inspect both systems.
3. Determine the domain owner.
4. Move only the minimum required responsibility.
5. Record the decision.
6. Test regression.

Never create a second system just to avoid deciding ownership.

---

44. Duplicate System Rule

Before creating any new system:

Search the repository for existing functionality.

If equivalent functionality exists:

extend it instead of creating a duplicate.

---

45. New System Rule

A new system is justified only if:

- an existing owner cannot reasonably own the responsibility;
- separation improves testability or scalability;
- ownership becomes clearer;
- the system has a stable domain boundary.

---

46. Current Prototype Mapping

Current systems:

Game.js
    → Game Coordinator

GameState.js
    → Shared prototype gameplay state

Time.js
    → Time

EnemyManager.js
    → Enemy ownership

WaveManager.js
    → Wave ownership

DefenseManager.js
    → Defense ownership

ProjectileManager.js
    → Projectile ownership

InteractionController.js
    → Interaction ownership

TouchControls.js
    → Input ownership

CameraController.js
    → Camera ownership

src/world/*
    → World ownership

src/ui/*
    → Presentation ownership

---

47. Current Architecture Risk

The most important current risk is not that the existing systems are broken.

The main risk is future uncontrolled growth.

Therefore architecture work must focus on boundaries rather than rewriting working gameplay.

---

48. Architecture Foundation Requirement

Before Economy, Merge, Collection, Bosses, or large-scale content expansion:

The following must be sufficiently defined:

- ownership;
- data contracts;
- event boundaries;
- save boundary;
- error handling;
- testing boundaries;
- asset boundary;
- dependency direction.

---

49. Ownership Gate

Phase 3 is complete only when:

- [ ] Every current major system has an owner.
- [ ] No major responsibility has two owners.
- [ ] Future systems have defined ownership.
- [ ] UI does not own gameplay.
- [ ] Input does not own gameplay.
- [ ] Camera does not own gameplay.
- [ ] Save does not own gameplay.
- [ ] Economy will own currency transactions.
- [ ] Progression will own progression.
- [ ] Merge will own merge rules.
- [ ] Collection will remain separate from inventory.
- [ ] Bosses will reuse combat architecture.
- [ ] Event boundaries are defined.
- [ ] Duplicate-system creation is forbidden.
- [ ] GameState growth is controlled.

---

50. Next Step

After this ownership map is accepted internally:

Phase 4 — Architecture Foundation

The next implementation work will focus on:

1. Data contracts.
2. Event boundaries where actually needed.
3. State ownership boundaries.
4. Error handling.
5. Testing foundation.
6. Asset boundary.
7. Save boundary preparation.
8. Performance baseline.

No feature expansion until the Architecture Gate is passed.

---

51. Final Rule

Every piece of code must have an answer to:

«Who owns this?»

If there is no clear answer, the architecture is not ready.

If there are two answers, the architecture has a conflict.

If there is one clear answer, development can proceed.
