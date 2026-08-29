MASTER GAME SPECIFICATION

INFINITE DEPTHS — أعماق اللانهاية

الإصدار الرئيسي: 1.0

نوع المشروع: 3D Mobile-First Strategy / Tower Defense / Exploration / Combat

الوضع الأول: Offline PvE

الوضع المستقبلي: Online PvP / Cooperative

الهدف: بناء لعبة تجارية قابلة للتوسع لسنوات

00 — القاعدة الأساسية للمشروع

هذه الوثيقة هي المرجع الرئيسي لبناء اللعبة.

يجب اعتبار اللعبة مشروعًا حقيقيًا طويل الأمد، وليس Prototype مؤقتًا.

يجب أن تكون جميع الأنظمة:

Modular

قابلة للتوسع

قابلة لإعادة الاستخدام

قابلة للاختبار

منفصلة المسؤوليات

قابلة للاستبدال

مناسبة للأجهزة المحمولة

لا يجب التضحية بالـArchitecture من أجل إضافة Feature بسرعة.

01 — الرؤية العامة

اسم اللعبة:

أعماق اللانهاية

Infinite Depths

الفكرة:

عالم ثلاثي الأبعاد يستطيع اللاعب التجول داخله بحرية.

يصل اللاعب إلى مناطق دفاعية تحتوي على طريق تسير عليه موجات الأعداء تلقائيًا.

اللاعب لا يشاهد خريطة ثابتة من الأعلى فقط.

بل يدخل العالم بنفسه.

يمشي.

يستكشف.

يجمع الموارد.

يبني الدفاعات.

ينقل الدفاعات.

يطورها.

يفك تركيبها.

يركبها مع بعضها.

يختبر تشكيلات مختلفة.

يدافع عن قاعدته.

ومع تقدم اللعبة يصبح قادرًا على الهجوم على عوالم ومناطق أخرى.

02 — هوية اللعبة

اللعبة ليست Tower Defense تقليدية.

هي مزيج من:

3D Exploration

Tower Defense

Strategy

Defense Construction

Free Combination System

Progression

PvE

Future PvP

03 — الحلقة الأساسية Gameplay Loop

الحلقة الأساسية:

استكشاف

↓

جمع موارد

↓

العثور على دفاعات / شراء دفاعات

↓

بناء التشكيلة

↓

بدء الموجة

↓

الأعداء يسيرون على الطريق

↓

الدفاعات تهاجم

↓

قتل الأعداء

↓

الحصول على Rewards

↓

تطوير الدفاعات

↓

فتح دفاعات جديدة

↓

تجربة Combinations

↓

إعادة بناء التشكيلة

↓

مواجهة موجات أقوى

↓

فتح مناطق جديدة

↓

مواجهة Boss

↓

التقدم إلى منطقة جديدة

04 — العالم

العالم ثلاثي الأبعاد.

ليس مجرد شاشة واحدة.

يحتوي العالم على:

مناطق.

جزر.

طرق.

قواعد.

ممرات.

مباني.

موارد.

أسرار.

مناطق مقفلة.

مناطق قابلة للاستكشاف.

يمكن للاعب التحرك بحرية داخل المناطق المسموحة.

05 — نظام المناطق

كل منطقة لها:

اسم.

مستوى مطلوب.

شروط فتح.

بيئة.

أعداء.

موارد.

Boss.

مستوى صعوبة.

أنواع دفاعات مناسبة.

أسرار.

فتح المناطق تدريجي.

أمثلة:

الخليج الهادئ

منطقة البداية.

الشعاب المرجانية

تفتح بعد تقدم اللاعب.

المياه العميقة

تحتاج معدات ومستوى أعلى.

جزيرة الضباب

منطقة نادرة.

أعماق الليل

مرتبطة بوقت العالم.

الخندق المظلم

منطقة Endgame مستقبلية.

06 — Player

اللاعب شخصية 3D.

خصائصه:

Position

Rotation

Movement Speed

Level

XP

Currency

Rank

Inventory

Equipment

Unlocked Areas

Unlocked Defenses

Collection Progress

07 — الحركة

يجب دعم:

WASD

والتحكم بالهاتف:

Virtual Joystick

الحركة:

Smooth.

Responsive.

Mobile optimized.

يجب ألا تكون الحركة ثقيلة أو بطيئة.

08 — الكاميرا

Third Person Camera.

تتبع اللاعب.

تدعم:

Orbit.

Zoom.

Vertical rotation.

Horizontal rotation.

Collision.

Smoothing.

الهاتف:

Swipe على الجزء الأيمن من الشاشة.

09 — العالم التفاعلي

العالم ليس ديكورًا فقط.

يمكن لاحقًا التفاعل مع:

Buildings

Resources

NPCs

Chests

Doors

Portals

Areas

Defensive Stations

Shops

10 — قاعدة اللاعب

لكل منطقة دفاعية قاعدة.

القاعدة:

لها HP.

يمكن تطويرها.

يمكن تدميرها.

لها مظهر.

تحتوي على Slots دفاعية.

لها دفاعات خاصة لاحقًا.

إذا وصل الأعداء إليها:

يبدأون بتدميرها.

إذا وصل HP إلى صفر:

Game Over.

11 — Enemy Path System

الأعداء لا يتحركون بحرية في الوضع الأساسي.

لديهم:

Path.

الـPath عبارة عن نقاط مرتبة.

Enemy:

Spawn

↓

Path Point 1

↓

Path Point 2

↓

Path Point 3

↓

Base

يجب أن يكون Path System مستقلًا عن Enemy AI.

12 — Enemy System

كل عدو له:

ID

Name

Type

HP

Max HP

Speed

Armor

Resistance

Reward

Damage

Target

Status Effects

Model

Animation state

أنواع مستقبلية:

Basic Fast Tank Flying Shielded Healer Swarm Stealth Splitter Boss

13 — Wave System

الموجات تتكون من:

Wave Number

Spawn Groups

Enemy Types

Spawn Delay

Quantity

Difficulty Modifier

Reward Modifier

كل Wave يمكن أن تكون مختلفة.

14 — Difficulty Scaling

لا نريد فقط:

Enemy HP × 2

يجب أن يتغير:

HP

Speed

Armor

Resistance

Quantity

Composition

Special Abilities

حتى تصبح الموجات أكثر استراتيجية.

15 — Defense System

الدفاعات هي قلب اللعبة.

كل Defense عبارة عن كيان مستقل.

له:

ID

Name

Category

Level

Damage

Fire Rate

Range

Targeting

Projectile

Cost

Rarity

Traits

Modules

Abilities

Element

Upgrade Data

Merge Data

16 — أنواع الدفاعات

أمثلة:

Cannon

Machine Gun

Sniper

Mortar

Tesla

Freeze Tower

Flame Tower

Missile Launcher

Poison Tower

Laser Tower

Healing Tower

Support Tower

Slow Tower

Area Tower

لكن القائمة ليست ثابتة.

يجب أن يسمح النظام بإضافة مئات الأنواع.

17 — الدفاعات ليست متساوية

لا يوجد Defense أفضل دائمًا.

كل Defense له:

Strengths

و

Weaknesses.

مثال:

Cannon:

Damage

Fire Rate

Sniper:

Range

Critical

Slow

Freeze:

Crowd Control

Damage

18 — نظام Traits

الدفاع يمكن أن يمتلك Traits.

مثال:

Burning

Frozen

Electric

Piercing

Explosive

Rapid

Heavy

LongRange

Critical

Poisonous

Chain

Area

ShieldBreaker

BossHunter

19 — نظام العناصر

عناصر مستقبلية:

Fire

Ice

Electric

Poison

Water

Wind

Earth

Dark

Light

Void

يمكن أن تؤثر العناصر على:

Damage.

Status.

Enemy resistance.

Merge results.

20 — نظام الاستهداف

الدفاع يستطيع اختيار:

First

Last

Nearest

Strongest

Weakest

Lowest HP

Highest HP

Boss

Flying

Special

ويجب أن يكون Targeting System مستقلًا.

21 — نظام المقذوفات

Projectile System مستقل.

يدعم:

Bullet

Missile

Laser

Explosion

Chain

Area effect

Homing

Piercing

22 — Combat System

نظام Combat موحد.

يجب أن يدعم:

Damage

Critical Damage

Armor

Resistance

Elemental Damage

Status Effects

Healing

Shield

Damage Over Time

Area Damage

23 — Status Effects

أمثلة:

Burn

Freeze

Slow

Poison

Shock

Bleed

Weakness

ArmorBreak

Stun

Silence

24 — نظام الدمج الأساسي

هذا أحد أهم أنظمة اللعبة.

لا نريد:

A + B = C فقط.

بل:

كل Defense يمكن أن يمتلك:

Base

Modules

Traits

Elements

Modifiers

Abilities

25 — Free Merge System

يمكن للاعب تركيب دفاع مع دفاع آخر.

مثال:

Cannon

Electric Core

=

Electric Cannon

لكن ليس بالضرورة أن يكون أقوى في كل شيء.

مثال:

+Chain Damage

-Range

26 — Trade-Off System

الدمج يمكن أن يعطي:

ميزة

مقابل

عيب.

مثال:

+50% Damage

-30% Fire Rate

أو:

+Range

-Projectile Speed

أو:

+Slow

-Damage

هذا يمنع وجود Combination واحد يهيمن على اللعبة.

27 — Merge Compatibility

ليس كل Combination متساويًا.

يمكن أن تكون هناك:

Perfect Synergy

Good Synergy

Neutral

Bad Synergy

Rare Synergy

Secret Synergy

28 — Hidden Combinations

بعض التركيبات يمكن أن تنتج:

دفاعات سرية.

لكن لا يجب أن يكون النظام عشوائيًا بالكامل.

يجب أن يكون قابلًا للحساب والتوازن.

29 — Unmerge

يمكن للاعب فك الدمج.

لكن مقابل تكلفة صغيرة.

لا نريد أن يشعر اللاعب أنه عالق في قرار واحد.

30 — Merge History

النظام يمكن أن يسجل التركيبات المكتشفة.

ويُستخدم لاحقًا في:

Collection

Codex

Achievements

31 — الدفاعات النادرة

Rarity:

Common

Uncommon

Rare

Epic

Legendary

Mythic

Secret

لا تعني الندرة دائمًا القوة المطلقة.

قد يكون Defense نادرًا بسبب:

Mechanic

أو

Combination potential.

32 — تطوير الدفاعات

Upgrade System:

Level

↓

Stats

↓

Abilities

↓

Visual Changes

لكن بعض الترقيات يمكن أن تغير أسلوب الدفاع.

33 — الاقتصاد

Currencies مستقبلية:

Gold

Crystals

Materials

Special Tokens

لكن يجب ألا يتم إنشاء اقتصاد Pay-to-Win.

34 — XP

اللاعب يحصل على XP من:

Waves.

Enemies.

Quests.

Bosses.

Exploration.

XP يؤدي إلى:

Level Up.

35 — Player Levels

المستوى يفتح:

Areas.

Defenses.

Equipment.

Quests.

Challenges.

36 — Rank

رتب اللاعب:

Novice

Apprentice

Hunter

Veteran

Elite

Master

Legend

Sea Legend

ويمكن تغيير الأسماء لاحقًا.

37 — Inventory

يحتوي على:

Defenses

Modules

Materials

Equipment

Special Items

38 — Equipment

يمكن أن يكون للاعب:

Rod

Boat

Tools

Accessories

لكن يجب ألا يتحول النظام إلى RPG معقد بلا داعٍ.

39 — Exploration

الاستكشاف مكافأته ليست فقط XP.

يمكن اكتشاف:

Chests.

Materials.

Secret areas.

Hidden paths.

NPCs.

Lore.

Rare items.

Boss entrances.

40 — Daily Quests

أمثلة:

اقتُل 50 عدوًا.

أكمل 3 موجات.

استخدم Defense معينًا.

اكتشف منطقة.

لكن الـDaily System يجب أن يعمل Offline في البداية.

41 — Achievements

أمثلة:

First Defense

First Boss

100 Enemies

1000 Enemies

First Secret Combination

No Damage Wave

Complete Area

42 — Boss System

Bosses ليست مجرد:

HP ضخم.

كل Boss له:

Phase.

Abilities.

Weaknesses.

Patterns.

Special mechanics.

43 — Boss Example

وحش بحري عملاق:

Phase 1:

يتقدم.

Phase 2:

يستدعي أعداء.

Phase 3:

يدمر بعض الدفاعات.

Phase 4:

يصبح أسرع.

44 — Weather System

الطقس يؤثر على Gameplay.

أمثلة:

Clear

Rain

Storm

Fog

Night

Heat

45 — Weather Effects

Storm:

+Rare enemies

-Visibility

+Risk

Fog:

-Range

+Special creatures

Night:

Special enemies

Special resources

46 — Day/Night

العالم لديه Time System.

يمكن أن توجد محتويات:

Day Only

Night Only

Storm Only

47 — Dynamic Events

أحداث نادرة:

Treasure Ship

Sea Monster

Storm

Enemy Invasion

Rare Merchant

Mystery Portal

48 — NPC System

لاحقًا:

Merchants

Quest Givers

Fishermen

Engineers

Explorers

لكن لا نحتاج NPC AI معقدًا في البداية.

49 — Story

القصة ليست إجبارية.

تتوسع تدريجيًا.

العالم يحتوي على:

Lore

Mysteries

Ancient civilizations

Sea creatures

Unknown islands

50 — UI

واجهة Mobile First.

يجب أن تكون:

واضحة.

جميلة.

سريعة.

قليلة الإزعاج.

51 — Main Menu

يحتوي على:

Play

Collection

Inventory

Shop

Quests

Settings

لكن يتم فتح العناصر تدريجيًا.

52 — In-Game HUD

يحتوي على:

HP Base

Currency

Wave

Player Level

Objectives

Menu

53 — Defense Placement UI

عند الدخول إلى وضع البناء:

يظهر:

Defense Bar

Selected Defense

Cost

Range

Stats

Confirm

Cancel

54 — Drag & Drop

يجب أن يدعم النظام لاحقًا:

سحب Defense

وضعه

تحريكه

استبداله

دمجه

فك دمجه

55 — Build Slots

الخريطة تحتوي على:

Build Slots

لكن يمكن أن توجد مناطق تسمح بالبناء الحر.

56 — Defense Mobility

اللاعب يستطيع إعادة ترتيب الدفاعات.

وهذا جزء من الاستراتيجية.

57 — Game Modes

الوضع الأساسي:

Story / PvE

لاحقًا:

Endless

Boss Rush

Challenge

Daily

PvP

Co-op

58 — PvP مستقبلاً

لا نبني Networking الآن.

لكن Architecture يجب ألا تمنع إضافته لاحقًا.

PvP يمكن أن يكون:

اللاعب يبني دفاعاته.

واللاعب الآخر يرسل موجات أعداء.

أو:

Attack / Defense.

59 — Online Architecture Future

لاحقًا فقط.

قد نحتاج:

Server

Authentication

Matchmaking

State Synchronization

Anti-Cheat

لكن:

لا يتم تنفيذ أي منها في النسخة Offline.

60 — Save System

في Offline:

Local Save.

يمكن استخدام:

localStorage

أو IndexedDB

حسب الحاجة.

يجب أن يكون Save System مستقلًا.

61 — Save Data

يحفظ:

Level

XP

Currency

Unlocked Areas

Unlocked Defenses

Inventory

Collection

Achievements

Settings

62 — Save Versioning

يجب أن يحتوي Save Data على:

version

حتى نستطيع تحديث بيانات اللاعبين مستقبلًا.

63 — Settings

لاحقًا:

Graphics

FPS

Camera Sensitivity

Joystick Size

Language

Vibration

Sound

Music

لكن Audio لا ينفذ في المراحل الأولى.

64 — Localization

اللعبة يجب أن تكون قابلة لدعم:

العربية

English

ثم لغات أخرى.

لا تضع النصوص داخل كل نظام بشكل عشوائي.

استخدم Localization System.

65 — Graphics Style

الأسلوب:

Stylized 3D Fantasy

ليس Photorealistic.

الهدف:

جميل

واضح

ملون

مميز

ويعمل على الهاتف.

66 — Environment

العالم يمكن أن يحتوي على:

Ocean

Islands

Rocks

Trees

Plants

Buildings

Ruins

Bridges

Cliffs

Caves

67 — Asset Strategy

في البداية:

Procedural / Primitive Assets.

ثم لاحقًا:

Custom 3D Assets

Textures

Animations

VFX

UI Assets

68 — Animation

لاحقًا:

Idle

Walk

Run

Attack

Hit

Death

Special

لكن لا نحتاج نظام Animation معقدًا في أول نسخة.

69 — VFX

لاحقًا:

Fire

Explosion

Ice

Electric

Poison

Laser

Water

Impact

Boss Effects

يجب أن تكون VFX قابلة لإعادة الاستخدام.

70 — Particle System

يجب مراعاة Mobile Performance.

لا نستخدم أعدادًا ضخمة من particles.

71 — Performance

Mobile First.

يجب مراقبة:

FPS

Memory

Draw Calls

Triangles

Texture Memory

Object Count

Particle Count

72 — Object Pooling

استخدم Pooling مستقبلًا للأشياء المتكررة:

Projectiles

Enemies

Particles

Effects

73 — Physics

لا نستخدم Physics Engine ثقيلًا إلا إذا أصبح ضروريًا.

نستخدم حلولًا بسيطة حيث يمكن.

74 — Collision

نظام Collision مستقل.

يدعم لاحقًا:

Player

Environment

Camera

Projectiles

Enemies

Defenses

75 — Input Architecture

InputManager موحد.

يدعم:

Touch

Mouse

Keyboard

Gamepad مستقبلًا.

لا تربط Game Logic مباشرة بأحداث DOM.

76 — Event System

نحتاج Event Bus خفيف عند الحاجة.

أمثلة:

EnemyKilled

WaveStarted

WaveCompleted

DefensePlaced

DefenseMerged

BossDefeated

LevelUp

AreaUnlocked

77 — Data Driven Design

البيانات يجب أن تكون منفصلة عن Logic.

مثلاً Defense Definition.

بدل كتابة:

if tower === "cannon"

في كل مكان.

78 — Configuration

الأرقام المهمة مركزية.

مثل:

Player Speed

Enemy Speed

Wave Scaling

Defense Costs

Damage

Ranges

79 — Debug Mode

نحتاج Debug Tools مستقبلًا.

مثل:

Show Path

Show Enemy IDs

Show Defense Range

Show FPS

Spawn Enemy

Skip Wave

Add Currency

لكن Debug Mode لا يظهر للاعب العادي.

80 — Testing

كل مرحلة يجب اختبارها.

لا نضيف Features فوق نظام مكسور.

81 — Architecture

يجب فصل:

Core

World

Player

Enemies

Defenses

Combat

Economy

Progression

Merge

UI

Save

Audio

VFX

Network

82 — Dependency Direction

الأنظمة الأساسية لا تعتمد على UI.

Game Logic لا يعتمد على DOM.

UI يعرض البيانات ولا يمتلك Game Logic.

83 — No God Object

ممنوع إنشاء:

Game.js

يحتوي على كل شيء.

يجب تقسيم المسؤوليات.

84 — No Global Chaos

تجنب:

window.game

window.player

window.enemyManager

إلا عند الحاجة الشديدة للتطوير.

85 — Error Handling

الأخطاء يجب أن تكون واضحة.

لا نسمح بخطأ صغير أن يكسر Game Loop بالكامل.

86 — Offline Requirement

النسخة الأولى تعمل بدون إنترنت.

بعد تحميل المشروع:

كل Gameplay Logic محلي.

87 — No External Services

في النسخة الأولى:

لا Firebase.

لا Supabase.

لا Backend.

لا API.

لا Analytics.

لا Ads.

لا Cloud.

لا Login.

لا Multiplayer.

88 — Audio

يضاف في مرحلة مستقلة بعد استقرار Gameplay.

يشمل لاحقًا:

Music

SFX

Ambient

UI Sounds

Boss Sounds

Environment

89 — Audio Architecture

عند إضافة الصوت:

AudioManager

MusicManager

SFXManager

Volume Settings

لكن لا تنشئها الآن.

90 — Online

يضاف فقط بعد اكتمال Offline.

السبب:

Offline هو أساس Gameplay.

لا نريد أن نعقد المشروع مبكرًا.

91 — PvP Balance

عند إضافته:

لا يمكن أن تعتمد القوة على المال فقط.

يجب أن يكون:

Strategy > Spending.

92 — Monetization Future

ليس الآن.

وعندما يأتي وقتها يجب أن تكون:

Cosmetics

Optional Content

Battle Pass محتمل

لكن لا نريد Pay-to-Win.

93 — Cosmetics

لاحقًا:

Player Skins

Boat Skins

Defense Skins

Base Skins

Effects

Trails

94 — Collection

موسوعة تحتوي على:

Enemies

Defenses

Bosses

Areas

Combinations

95 — Discovery

عندما يكتشف اللاعب Combination جديد:

يتم تسجيله.

لكن لا يجب كشف كل الأسرار بسهولة.

96 — Strategic Depth

اللعبة يجب أن تجعل اللاعب يفكر:

أين أضع الدفاع؟

أي Defense أستخدم؟

هل أدمجه؟

ماذا سأخسر؟

متى أفك الدمج؟

أي Targeting؟

أي Element؟

هل أستخدم Damage أم Crowd Control؟

هل أبني دفاعات كثيرة أم قليلة قوية؟

97 — No Dominant Strategy

يجب مراقبة التوازن.

لا نريد Defense واحدًا يحل كل شيء.

98 — Content Expansion

Architecture يجب أن تسمح بإضافة:

100+

500+

1000+

Defense combinations.

بدون إعادة كتابة Core.

99 — Enemy Expansion

Architecture تسمح بإضافة مئات الأعداء.

100 — Area Expansion

يمكن إضافة مناطق جديدة دون تعديل الأنظمة الأساسية.

101 — Save Compatibility

عند تحديث اللعبة:

الـSave القديم يجب أن يبقى قابلًا للقراءة قدر الإمكان.

102 — Mobile Optimization

الأولوية:

60 FPS إن أمكن.

مع توفير Quality Levels للأجهزة الضعيفة.

103 — Quality Levels

Low

Medium

High

Ultra

لكن يمكن تأجيلها.

104 — Responsive UI

يجب دعم:

Android Phones

Small Screens

Large Screens

Tablets

Landscape

Portrait

105 — Touch UX

الأزرار كبيرة بما يكفي.

لا تعتمد على Hover.

لا تستخدم عناصر صغيرة.

106 — Camera UX

حركة الكاميرا لا تكون:

سريعة جدًا.

أو بطيئة جدًا.

Sensitivity قابلة للتعديل لاحقًا.

107 — Tutorial

Tutorial تدريجي.

لا نرمي 20 نظامًا في وجه اللاعب.

أول شيء:

Move

Explore

Build

Defend

Reward

Upgrade

Merge

108 — Progressive Unlocking

الميزات نفسها تفتح تدريجيًا.

مثال:

Level 1:

Basic Defense

Level 3:

Upgrade

Level 5:

Merge

Level 10:

Advanced Modules

Level 15:

New Area

وهكذا.

109 — Reward Psychology

المكافآت يجب أن تكون:

واضحة

مرضية

متنوعة

لكن غير استغلالية.

110 — Failure

عند الخسارة:

لا نعاقب اللاعب بشكل مبالغ.

نوضح:

Why Lost

Damage Taken

Best Defense

Rewards

111 — Replayability

إعادة اللعب يجب أن تكون مفيدة بسبب:

Different Enemy Composition

Weather

Defense Combinations

Challenges

Random Events

112 — Endless Mode

لاحقًا.

Wave 1 → ∞

مع Scaling متوازن.

113 — Challenge Mode

قواعد خاصة:

No Merge

Only Fire

Low HP

Fast Enemies

Boss Only

114 — Boss Rush

Boss بعد Boss.

115 — Exploration Events

يمكن للاعب أثناء الاستكشاف العثور على:

حدث مفاجئ.

كنز.

عدو نادر.

بوابة.

منطقة مخفية.

116 — World Identity

كل منطقة يجب أن تشعر بأنها مختلفة.

ليس فقط تغيير لون الأرض.

117 — Environment Gameplay

البيئة قد تؤثر على:

Range

Movement

Elements

Enemies

Defense

118 — Water

الماء ليس مجرد خلفية.

يمكن أن يصبح جزءًا من Gameplay لاحقًا.

119 — Boats

لاحقًا يمكن للاعب استخدام قارب للتنقل بين الجزر.

120 — World Map

خريطة عالمية مستقبلية:

Areas

Islands

Locked Regions

Boss Regions

Events

121 — Progression Philosophy

كل تقدم يجب أن يعطي اللاعب شيئًا:

قوة

خيارًا

منطقة

Mechanic

Collection

Cosmetic

122 — Player Choice

نريد Builds مختلفة.

لا يوجد Build واحد إجباري.

123 — Build System

يمكن للاعب بناء:

Damage Build

Control Build

Element Build

Critical Build

Defense Build

Economy Build

Hybrid Build

124 — Synergy

بعض الدفاعات تعمل أفضل مع بعضها.

مثال:

Freeze

Sniper

125 — Anti-Synergy

بعض التركيبات تخلق عيوبًا.

وهذا مقصود.

126 — Meta Progression

لاحقًا يمكن وجود تقدم دائم بين المناطق.

127 — Local Save Security

في Offline لا يمكن منع التعديل على Save بالكامل.

لكن يمكن تصميم Save Format جيد.

128 — Development Philosophy

كل مرحلة:

Build

↓

Run

↓

Test

↓

Fix

↓

Optimize

↓

Commit

↓

Next Stage

129 — Git Architecture

المشروع يجب أن يكون Git-friendly.

Commits صغيرة ومنطقية.

130 — Versioning

الإصدارات:

0.1 Foundation

0.2 World

0.3 Player

0.4 Enemies

0.5 Defenses

0.6 Combat

0.7 Waves

0.8 Economy

0.9 Merge

1.0 Offline Alpha

ثم نرفع الإصدار تدريجيًا.

131 — المرحلة 1

CORE FOUNDATION

المطلوب:

Project setup.

Three.js.

Renderer.

Scene.

Camera.

Game loop.

Time.

Config.

GameState.

Input foundation.

Error handling.

132 — المرحلة 2

3D WORLD

Ocean.

Island.

Terrain.

Lighting.

Fog.

Environment.

World bounds.

133 — المرحلة 3

PLAYER

Character.

Movement.

Third-person camera.

Mobile joystick.

Touch camera.

Collision.

Ground detection.

134 — المرحلة 4

EXPLORATION

Interactions.

Areas.

World markers.

Basic resources.

Chests.

Exploration state.

135 — المرحلة 5

DEFENSE MAP

Path.

Spawn.

Base.

Build zones.

Defense slots.

Wave preparation.

136 — المرحلة 6

ENEMIES

Enemy base.

Enemy manager.

Path following.

HP.

Damage.

Death.

Rewards.

137 — المرحلة 7

WAVES

Wave manager.

Spawn groups.

Difficulty.

Wave UI.

Wave completion.

Game over.

138 — المرحلة 8

DEFENSES

Defense base.

Defense manager.

Placement.

Stats.

Targeting.

Attack.

139 — المرحلة 9

COMBAT

Projectiles.

Damage.

Critical.

Armor.

Resistance.

Status Effects.

140 — المرحلة 10

ECONOMY

Gold.

Rewards.

Costs.

Upgrades.

Inventory.

141 — المرحلة 11

PROGRESSION

XP.

Levels.

Rank.

Unlocks.

Areas.

Defenses.

142 — المرحلة 12

MERGE ENGINE

أهم مرحلة.

Defense Components.

Traits.

Modules.

Elements.

Modifiers.

Compatibility.

Merge Recipes.

Dynamic Results.

Trade-offs.

Unmerge.

Cost.

Discovery.

143 — المرحلة 13

COLLECTION

Defense Codex.

Enemy Codex.

Boss Codex.

Combination Discovery.

Completion percentage.

144 — المرحلة 14

BOSSES

Boss framework.

Phases.

Abilities.

Weaknesses.

Rewards.

145 — المرحلة 15

WEATHER + DAY/NIGHT

World clock.

Weather.

Gameplay modifiers.

Special events.

146 — المرحلة 16

QUESTS

Main quests.

Daily quests.

Challenges.

Achievements.

147 — المرحلة 17

ADVANCED WORLD

More islands.

More areas.

Hidden locations.

NPC foundation.

Events.

148 — المرحلة 18

VISUAL UPGRADE

استبدال Prototype geometry تدريجيًا بـ:

Custom models.

Better materials.

Textures.

Animation.

VFX.

Environment assets.

149 — المرحلة 19

AUDIO

Audio manager.

Music.

SFX.

Environment.

Combat.

Boss audio.

UI audio.

150 — المرحلة 20

POLISH

UI polish.

Animations.

Feedback.

VFX.

Camera effects.

Performance.

Loading.

Error states.

151 — المرحلة 21

MOBILE OPTIMIZATION

اختبار الأجهزة الضعيفة والمتوسطة والقوية.

تحسين:

Draw calls.

Memory.

FPS.

Garbage collection.

Object pooling.

Assets.

Loading.

152 — المرحلة 22

OFFLINE ALPHA

يجب أن تحتوي على:

Exploration

Defense

Enemies

Waves

Combat

Economy

Progression

Merge

Bosses

Save

وتعمل Offline.

153 — المرحلة 23

BALANCING

اختبار:

Economy.

Damage.

Enemy scaling.

Merge combinations.

Boss difficulty.

Progression.

154 — المرحلة 24

ONLINE PREPARATION

لا نضيف Network بعد.

نراجع فقط Architecture.

نحدد:

Authoritative State

Client State

Match State

Player State

155 — المرحلة 25

ONLINE MULTIPLAYER

يتم بناؤها لاحقًا فقط.

تشمل:

Authentication

Lobby

Matchmaking

Server

Synchronization

PvP

Co-op

Anti-Cheat

156 — المرحلة 26

LIVE CONTENT

لاحقًا:

Events

Seasons

Challenges

New Areas

New Defenses

New Bosses

157 — المرحلة 27

FINAL RELEASE

يشمل:

Performance

Security

Save migration

UI

Localization

Audio

Assets

Testing

Bug fixing

Build pipeline

Release preparation

158 — قاعدة البناء

لا ننتقل من مرحلة إلى المرحلة التالية إلا بعد:

الكود يعمل.

لا توجد أخطاء حرجة.

Architecture سليمة.

Mobile controls تعمل.

الأنظمة القديمة لم تنكسر.

الملفات منظمة.

يمكن حفظ نسخة Git.

159 — قاعدة الملفات

كلما كبر المشروع:

لا نضع كل شيء في ملف واحد.

كل نظام يحصل على ملفاته.

إذا أصبح الملف كبيرًا جدًا:

قسّمه.

160 — قاعدة التوافق

أي نظام جديد يجب أن يكون متوافقًا مع الأنظمة السابقة.

لا نكسر API داخليًا بدون سبب.

161 — قاعدة عدم التسرع

إذا كان هناك حل سريع:

لكن سيجعل المشروع أصعب بعد شهر،

لا نستخدمه.

162 — الهدف النهائي

أريد أن تتحول:

Infinite Depths

من Prototype صغير إلى:

لعبة 3D استراتيجية عالمية قابلة للتوسع.

يجب أن يشعر اللاعب بأنه:

يستكشف عالمًا.

يبني دفاعه.

يصمم تشكيلته.

يخاطر بالدمج.

يكتشف تركيبات جديدة.

يواجه أعداءً متنوعين.

يهزم Bosses.

يفتح مناطق.

ويطور أسلوب لعب خاصًا به.

163 — المبدأ النهائي

لا نريد:

Tower Defense + Exploration بشكل سطحي.

نريد أن يكون:

الاستكشاف

و

الدفاع

و

الدمج

و

الاستراتيجية

أنظمة مترابطة.

كل قرار في اللعبة يجب أن يؤثر في قرار آخر.

164 — طريقة العمل بيننا

لن يتم إنشاء المشروع كاملًا دفعة واحدة.

عندما يطلب المستخدم:

"أعطني القسم X"

يجب تنفيذ القسم المطلوب فقط.

يجب:

تحديد الملفات الجديدة.

تحديد الملفات التي سيتم تعديلها.

إنشاء الكود الكامل.

الحفاظ على الأنظمة السابقة.

شرح مكان كل ملف.

اختبار منطقي للكود.

ذكر أي اعتماد جديد.

عدم إضافة Features من أقسام لاحقة بلا حاجة.

165 — عند وجود ملف سابق

لا تستبدله عشوائيًا.

إذا كان يحتاج تعديلًا:

اكتب النسخة الكاملة المحدثة للملف.

لا تعطِ المستخدم:

"أضف هذه الأسطر في السطر 438"

إذا كان الملف طويلًا.

الأفضل إعطاء الملف الكامل المحدث.

166 — عند اكتمال كل مرحلة

يجب أن يكون لدينا:

Working Build

ثم ننتقل إلى المرحلة التالية.

167 — معيار الجودة

كل كود يجب أن يكون:

Readable

Maintainable

Modular

Performant

Extensible

Mobile Friendly

Offline Compatible

168 — الأولوية

ترتيب الأولويات:

Correctness

Architecture

Gameplay

Performance

UX

Visual Quality

Polish

169 — ممنوع

لا تستخدم حلولًا وهمية مثل:

"Fake 3D"

أو:

صورة ثابتة للعالم.

اللعبة يجب أن تكون:

3D حقيقية باستخدام WebGL / Three.js.

170 — النتيجة المطلوبة

في النهاية يجب أن يكون لدينا Codebase حقيقي:

Core

World

Player

Enemies

Defenses

Combat

Merge

Progression

Economy

UI

Save

Audio

VFX

ثم Online مستقبلًا.

END OF MASTER SPECIFICATION

هذه الوثيقة هي المرجع الأساسي.

لا يتم تنفيذ جميع الأقسام دفعة واحدة.

نبدأ بالقسم:

01 — CORE FOUNDATION

ثم نبني المشروع تدريجيًا حتى يصبح Infinite Depths لعبة كاملة.
