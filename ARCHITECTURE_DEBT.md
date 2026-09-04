Infinity Depths — Architecture Debt

Purpose

This document records known architectural weaknesses, risks, and deferred technical decisions in Infinity Depths.

Architecture debt must be visible and tracked.

It must not silently become implementation.

No debt item should be resolved by introducing unrelated systems or unnecessary refactoring.

---

1. Current Architecture Debt

AD-001 — GameState Responsibility Growth

Status: OPEN
Severity: MEDIUM

Problem

"src/core/GameState.js" currently contains several types of runtime state.

As the project grows, this can turn into a God Object.

Risk

Future systems may begin placing unrelated state into "GameState", making dependencies difficult to understand and maintain.

Required Resolution

During the Architecture Foundation phase, determine clear boundaries between:

- Session state
- Level state
- Economy state
- Progression state
- Collection state
- World state
- Save state
- UI state

Constraint

Do not rewrite "GameState" blindly.

Existing working systems must be preserved and migrated only when justified.

---

2. Missing Event Architecture

Status: OPEN
Severity: MEDIUM

Problem

Current systems communicate partly through direct calls.

There is no centralized, formally defined gameplay event architecture.

Risk

As more systems are introduced, direct dependencies may increase.

Example future relationship:

Enemy Death
    ↓
Reward
Economy
Quest
Statistics
UI
VFX
Audio

Required Resolution

During Architecture Foundation, identify where events genuinely reduce coupling.

Events must have:

- Stable names
- Explicit payloads
- Clear ownership
- Defined producers
- Defined consumers

Constraint

Do not create an event for every interaction.

---

3. Missing Data Contracts

Status: OPEN
Severity: HIGH

Problem

The project does not yet have a complete formal data-contract layer.

Required Contracts

At minimum:

- EnemyDefinition
- DefenseDefinition
- BossDefinition
- RewardDefinition
- UpgradeDefinition
- QuestDefinition
- MapDefinition
- MergeDefinition

Risk

Without stable contracts, content systems may become tightly coupled to individual implementations.

Required Resolution

Define the contracts during Architecture Foundation.

Content should become primarily data-driven.

---

4. Missing Asset Contract

Status: OPEN
Severity: MEDIUM

Problem

Gameplay does not yet use a complete production asset registry architecture.

Intended Architecture

Gameplay
    ↓
Visual ID
    ↓
Asset Registry
    ↓
Model / Texture / Animation / VFX

Risk

Gameplay code could become directly dependent on individual asset implementations.

Required Resolution

Establish an asset contract before large-scale visual production.

---

5. Missing Save Architecture

Status: OPEN
Severity: HIGH

Problem

Runtime progress is currently lost when the page is reloaded.

There is no implemented:

- Versioned save
- Validation
- Migration
- Backup
- Recovery
- Corruption handling

Risk

Adding persistent systems without a stable save contract can create incompatible player data.

Required Resolution

Define the save contract before persistent progression systems expand.

---

6. Missing Automated Testing Infrastructure

Status: OPEN
Severity: HIGH

Problem

No formal automated testing infrastructure has been identified.

Missing Levels

- Static validation
- Unit tests
- Integration tests
- Gameplay tests
- Regression tests

Risk

As the codebase grows, regressions may become difficult to detect.

Required Resolution

Establish the minimum testing foundation during Architecture Foundation.

---

7. Missing Performance Baseline

Status: OPEN
Severity: HIGH

Problem

There is currently no measured performance baseline.

Missing Measurements

- FPS
- Frame time
- CPU usage
- GPU usage
- Memory
- Entity count
- Draw calls
- Loading time
- Long-session behavior

Risk

Optimization decisions may be based on assumptions rather than measurements.

Required Resolution

Create a measurable baseline before large-scale optimization.

---

8. Manual Script Loading / Build Infrastructure

Status: OPEN
Severity: MEDIUM

Problem

The current application manually loads JavaScript files through "index.html".

No formal:

- "package.json"
- npm pipeline
- Vite/Webpack pipeline
- TypeScript pipeline

has been confirmed.

Risk

The current approach may become difficult to maintain as the number of systems increases.

Required Resolution

Evaluate the architecture during Phase 4.

Do not migrate build tooling merely for appearance.

Migration must only occur if justified by project requirements.

---

9. Prototype-Level Visual Architecture

Status: OPEN
Severity: LOW / MEDIUM

Problem

Current visuals rely heavily on Three.js primitive geometry and prototype materials.

Risk

Large-scale content production could become dependent on temporary visual implementations.

Required Resolution

Introduce the production asset pipeline after the gameplay architecture is stable.

---

10. Mobile Compatibility Coverage

Status: OPEN
Severity: HIGH

Problem

The project is mobile-first, but complete device compatibility testing has not yet been performed.

Missing Verification

- Multiple screen sizes
- Aspect ratios
- Touch reliability
- Performance
- Memory
- Browser compatibility
- Orientation
- Long sessions
- Background/resume behavior

Required Resolution

Establish representative mobile testing during later device-compatibility phases.

Current Rule

Do not claim mobile compatibility is complete without real-device verification.

---

11. Production Android Architecture

Status: DEFERRED

Problem

There is currently no native Android/Gradle project.

Decision

Do not introduce native Android packaging prematurely.

The game architecture must first stabilize.

Revisit

After the web/game architecture and gameplay foundation are sufficiently mature.

---

12. Direct System Coupling

Status: OPEN
Severity: MEDIUM

Problem

Some existing systems communicate through direct references and calls.

Risk

Future systems such as quests, rewards, statistics, audio, and VFX may increase coupling.

Required Resolution

During Phase 3 and Phase 4, document system ownership and identify relationships that genuinely require decoupling.

---

13. Prototype UI Architecture

Status: OPEN
Severity: LOW / MEDIUM

Problem

The current UI is functional but remains prototype-level.

Constraint

UI must not own gameplay state.

UI should:

- Display state
- Send commands/intents
- React to state/events

Gameplay systems remain authoritative.

---

14. Cache-Busting Dependency

Status: OPEN
Severity: LOW

Problem

The current architecture uses query-string cache versions for JavaScript files.

Rule

When JavaScript changes require cache invalidation, the corresponding version in "index.html" must be updated.

Current Known Version

"?v=11"

This value must be verified against the actual repository before future changes.

---

15. Architecture Debt Rules

All architecture debt follows these rules:

1. Debt must be documented.
2. Debt must not be hidden by adding hacks.
3. Debt does not automatically justify a rewrite.
4. Existing working systems should be preserved where possible.
5. Architecture changes require evidence.
6. Large changes must be isolated and tested.
7. Save compatibility must be considered before persistent data changes.
8. Performance optimization must be measurement-driven.
9. New systems require explicit ownership.
10. Resolved debt must be documented as resolved.

---

16. Current Priority

The current priority order is:

PROJECT MEMORY
      ↓
SOURCE OF TRUTH
      ↓
SYSTEM OWNERSHIP
      ↓
ARCHITECTURE FOUNDATION
      ↓
ARCHITECTURE GATE

No feature expansion should bypass these stages.

---

17. Current Debt Summary

ID| Area| Severity| Status
AD-001| GameState boundaries| Medium| Open
AD-002| Event architecture| Medium| Open
AD-003| Data contracts| High| Open
AD-004| Asset contract| Medium| Open
AD-005| Save architecture| High| Open
AD-006| Automated testing| High| Open
AD-007| Performance baseline| High| Open
AD-008| Build infrastructure| Medium| Open
AD-009| Production visuals| Low/Medium| Open
AD-010| Mobile verification| High| Open
AD-011| Android architecture| —| Deferred
AD-012| System coupling| Medium| Open
AD-013| UI architecture| Low/Medium| Open
AD-014| Cache busting| Low| Open

---

Current Gate

PHASE 1 — PROJECT MEMORY

These files are documentation artifacts only.

They do not authorize implementation of the systems listed as missing.

Phase 2 may begin only after all required Phase 1 documentation is verified as present and internally consistent.
