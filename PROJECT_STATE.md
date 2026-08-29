PROJECT STATE — Infinite Depths
هذا الملف هو المرجع الحي لحالة المشروع. يُحدَّث بعد كل خطوة حقيقية.
عند بدء أي محادثة جديدة، يجب قراءة هذا الملف كاملاً أولاً، بالإضافة إلى GAME_SPEC.md (وخصوصًا الملاحظة الإلزامية بأعلاه والأقسام 01، 07، 08، 39).

⚠️ القرار المعماري الأهم بالمشروع (لا يُلغى إلا بطلب صريح من المستخدم)
اللعبة كاميرا ثابتة الزاوية من فوق (Fixed-Angle Top-Down)، أسلوب Clash of Clans — زاوية ميلان 58° عن الأرض، تحكم فقط بالسحب (Pan) والتكبير/التصغير (Zoom). لا يوجد جسم لاعب متحرك إطلاقًا (لا Player.js، لا منظور شخص أول/ثالث، لا WASD/Joystick).

⚠️ قرار إضافي مسجَّل (طلب صريح من المستخدم، قسم 135/138 بالمواصفات): لا يوجد "خانات دفاع" (Slots) بمواقع ثابتة. الدفاعات تُوضع بحرية بأي مكان على الجزيرة، بشرط عدم وضعها فوق مسار الأعداء أو ضمن هامش أمان قريب منه (PATH_EXCLUSION_RADIUS). راجع DefenseMap.isPositionBuildable(x, z).

⚠️ قرار إضافي مسجَّل (المرحلة 8): طريقة وضع الدفاع هي النقر (Tap-to-Place) على مكان صالح على الجزيرة أثناء "وضع البناء" — وليس سحب وإفلات (Drag & Drop) مباشر. هذا القرار متسق مع بنية الإدخال الحالية بالمشروع (TouchControls يوفّر Tap كحدث منفصل تمامًا عن Pan، بلا موضع تمرير مستمر أثناء اللمس على الهاتف). سحب/نقل دفاع موضوع بالفعل (قسم 54 بالمواصفات) مؤجَّل لمرحلة تحسين لاحقة — لم يُبنَ الآن، ولا يُقترح إلا بطلب صريح جديد.

⚠️ قرار إضافي مسجَّل: لا يوجد أي نظام "استكشاف" (Exploration) بهذه اللعبة — لا مناطق مجهولة تُكتشف تدريجيًا، لا ضباب حرب، لا مكافأة مقابل التجول. كل عنصر تفاعلي (صندوق/مورد) ظاهر على الخريطة منذ البداية، ويُفتح/يُجمع بنقرة (Tap) مباشرة عليه. القسم 39 بالمواصفات اسمه الآن "World Interaction" (سابقًا Exploration).

الترتيب الزمني للقرارات: Third-Person (تصميم أولي) → First-Person (تغيير أول) → Fixed-Angle Top-Down بدون استكشاف (القرار الحالي والنهائي).

آخر تحديث
✅ المستخدم أكد اكتمال المرحلة 7 (WAVES) فعليًا. بناءً على طلبه، تم تنفيذ المرحلتين 8 و9 معًا بهذه الجولة:

**المرحلة 8 — DEFENSES (قسم 138):**
ملف جديد /src/defenses/Defense.js — فئة الدفاع الواحد (كلاس، بنفس نمط Enemy.js): نموذج بصري Prototype (قاعدة أسطوانية + برج كروي + ماسورة تدور نحو الهدف)، استهداف (targeting: "first" — أقرب عدو لوصول القاعدة ضمن المدى)، تبريد/معدل إطلاق (fireRate)، ونداء ProjectileManager.spawn() عند الجاهزية.
ملف جديد /src/defenses/DefenseManager.js — وضع الدفاعات: وضع بناء (isPlacing) يُفعَّل من زر DefenseUI، تحويل نقرة الشاشة لنقطة أرضية عبر Raycaster + THREE.Plane (getGroundIntersection)، تحقق DefenseMap.isPositionBuildable + عدم تراكب دفاعين (MIN_DISTANCE_BETWEEN) + كفاية الذهب (GameState.canAfford)، خصم التكلفة (GameState.spendCurrency)، ثم إنشاء Defense وإضافته للمشهد. تحديث كل الدفاعات كل إطار (update).
ملف جديد /src/ui/DefenseUI.js — زر ثابت أسفل الشاشة "🔫 وضع مدفع (40)"، يتحول إلى "✖ إلغاء" أثناء وضع البناء مع تلميح نصي فوقه. كل حدث لمس/نقر على الزر يستدعي e.stopPropagation() حتى لا تُفسَّر نفس اللمسة كنقرة داخل العالم عبر TouchControls (المُركَّبة على window).
تحديث Config.js — قسم CONFIG.DEFENSES جديد بالكامل: GROUND_Y، MIN_DISTANCE_BETWEEN، وTYPES.cannon (نوع دفاع واحد فقط بهذه المرحلة — cost 40، damage 8، critChance 0.15، critMultiplier 1.8، range 7، fireRate 1.1، targeting "first"، إعدادات المقذوف والألوان). البنية Data-Driven (قسم 77): إضافة نوع دفاع جديد لاحقًا = إضافة مُدخَل هنا فقط، بدون لمس Defense.js/DefenseManager.js.
تحديث GameState.js — إضافة canAfford(cost) وspendCurrency(amount) (خصم آمن، يفشل إذا كان الرصيد غير كافٍ).
تحديث InteractionController.js — عند DefenseManager.isPlacing، أي نقرة تُحوَّل مباشرة لمحاولة وضع دفاع (بدل التحقق من الصناديق/الموارد/مناطق البناء).
تحديث GameOverUI.js — عند Game Over: DefenseManager.cancelPlacement() + DefenseUI.disable() (لا معنى لوضع دفاعات جديدة بعد تدمير القاعدة).

**المرحلة 9 — COMBAT (قسم 139):**
ملف جديد /src/combat/Projectile.js — مقذوف واحد (كلاس): Homing بسيط (يعيد حساب اتجاهه نحو الموضع الحالي للهدف كل إطار، وليس خطًا مستقيمًا ثابتًا)، عند الوصول يستدعي EnemyManager.damageEnemy() فيُطبَّق الضرر (والـArmor تلقائيًا، مُنفَّذ أصلًا بـEnemy.takeDamage منذ المرحلة 6). إذا اختفى الهدف قبل الإصابة (مات بمقذوف آخر أو وصل القاعدة) يختفي المقذوف بصمت (Miss) بلا خطأ.
ملف جديد /src/combat/ProjectileManager.js — إنشاء/تحديث/تنظيف كل المقذوفات النشطة كل إطار.
تحديث Config.js — قسم CONFIG.COMBAT جديد: PROJECTILE_RADIUS، HIT_DISTANCE.
تحديث Enemy.js — إضافة بنية عامة لـStatus Effects (applyStatus, _updateStatusEffects, getSpeedMultiplier) تدعم "slow" (إبطاء) و"poison" (ضرر دوري). **لا يستخدمها "cannon" حاليًا** (ضرر مباشر بلا عنصر) — جاهزة فقط لأنواع دفاعات مستقبلية (Freeze Tower، Poison Tower...) دون أي تعديل لاحق بمنطق الأعداء. Critical مُنفَّذ بالكامل ضمن Defense._fire() (نسبة critChance وcritMultiplier من TYPES.cannon).
تحديث Game.js — تهيئة ProjectileManager قبل DefenseManager (v0.9). كلاهما يُحدَّثان كل إطار داخل نفس الشرط الذي يجمّد EnemyManager عند Game Over (!WaveManager.isGameOver()). Debug HUD يعرض الآن عدد الدفاعات أيضًا.
تحديث index.html — ترتيب سكربتات جديد (Combat قبل Defenses لأن Defense._fire() يستدعي ProjectileManager.spawn() مباشرة)، رقم الكاش الحالي ?v=11 على كل الملفات.

سلوك معروف ومقبول بهذه المرحلة (ليس خطأ):
نوع دفاع واحد فقط ("مدفع") — التنويع (قناص، تجميد، إلخ) لم يُطلب بعد، والبنية Data-Driven تسمح بإضافته لاحقًا بسهولة دون إعادة كتابة الأساس.
لا سحب/نقل لدفاع موضوع بالفعل — الوضع بالنقر فقط. النقل (Drag & Drop) قسم 54 مؤجَّل.
لا HP للدفاعات نفسها ولا هجوم من الأعداء عليها — الأعداء يستهدفون القاعدة فقط (كما بالمرحلتين 6/7)، الدفاعات لا يمكن تدميرها حاليًا.
Status Effects بنية جاهزة غير مُستخدمة فعليًا (لا دفاع حالي يطبّق slow/poison) — ليست نقصًا، بل تجهيز مسبق مقصود.
لا حفظ دائم (Save System) بعد — أي تقدّم (ذهب، دفاعات موضوعة، موجة حالية) يُفقد عند تحديث الصفحة.

⏳ بانتظار تأكيد المستخدم الفعلي على الهاتف:
هل يظهر زر "وضع مدفع" بوضوح أسفل الشاشة، وهل الضغط عليه يدخل وضع البناء (يتحول لـ"✖ إلغاء" مع ظهور التلميح)؟
هل النقر على مكان بعيد عن المسار يضع المدفع فعليًا ويخصم 40 ذهب؟ وهل النقر قرب المسار/فوق دفاع آخر يُظهر رسالة الرفض الصحيحة بدل الوضع؟
هل يدور برج المدفع تلقائيًا نحو أقرب عدو داخل مداه، ويطلق مقذوفًا مضيئًا يتبع العدو فعليًا حتى يُصيبه؟
هل يموت العدو المصاب بعد عدد كافٍ من الطلقات (حسب HP الموجة الحالية)، وهل الذهب يزيد عند قتله (المكافأة)؟
هل يعمل كل هذا دون أي تعارض ملحوظ مع Pan/Zoom أو مع النقر على الصناديق/الموارد/مناطق البناء الأخرى؟
قاعدة صارمة بالمشروع: لا تُصنَّف هذه المرحلة (8+9) "مكتملة نهائيًا" إلا بعد هذا التأكيد.

الملفات الموجودة حاليًا في المشروع (الحالة الفعلية بعد التحديث)
| الملف | المسار الكامل | الوظيفة | الحالة |
|---|---|---|---|
| README.md | /README.md | ملف GitHub افتراضي | ✅ موجود |
| GAME_SPEC.md | /GAME_SPEC.md | وثيقة المواصفات الكاملة | ✅ (بلا تغيير بهذه الجولة) |
| PROJECT_STATE.md | /PROJECT_STATE.md | هذا الملف | ✅ محدَّث |
| index.html | /index.html | نقطة الدخول (?v=11) | ✅ محدَّث، بانتظار اختبار |
| Config.js | /src/core/Config.js | الإعدادات المركزية (+ DEFENSES، + COMBAT) | ✅ محدَّث، بانتظار اختبار |
| GameState.js | /src/core/GameState.js | حالة اللاعب (+ canAfford، + spendCurrency) | ✅ محدَّث، بانتظار اختبار |
| Time.js | /src/core/Time.js | نظام الوقت المستقل | ✅ مرفوع ومُختبر |
| Game.js | /src/core/Game.js | محرك اللعبة (+ ربط Defense/Projectile Managers) | ✅ محدَّث، بانتظار اختبار |
| Ocean.js | /src/world/Ocean.js | نظام المحيط المتحرك | ✅ مرفوع ومُختبر |
| Island.js | /src/world/Island.js | نظام الجزيرة | ✅ مرفوع ومُختبر |
| Interactables.js | /src/world/Interactables.js | صناديق وموارد الخريطة | ✅ مرفوع ومُختبر |
| DefenseMap.js | /src/world/DefenseMap.js | مسار + قاعدة + isPositionBuildable() | ✅ مرفوع ومُختبر |
| EnemyPath.js | /src/enemies/EnemyPath.js | نظام مسار الأعداء | ✅ مرفوع ومُختبر |
| Enemy.js | /src/enemies/Enemy.js | كيان العدو (+ Status Effects: applyStatus/slow/poison) | ✅ محدَّث، بانتظار اختبار |
| EnemyManager.js | /src/enemies/EnemyManager.js | إدارة الأعداء | ✅ مرفوع ومُختبر |
| WaveManager.js | /src/waves/WaveManager.js | نظام الموجات + Difficulty Scaling | ✅ مؤكَّد من المستخدم |
| Projectile.js | /src/combat/Projectile.js | مقذوف واحد (Homing + ضرر عند الإصابة) | 🆕 جديد، بانتظار اختبار |
| ProjectileManager.js | /src/combat/ProjectileManager.js | إدارة كل المقذوفات النشطة | 🆕 جديد، بانتظار اختبار |
| Defense.js | /src/defenses/Defense.js | كيان الدفاع (استهداف + تصويب + إطلاق) | 🆕 جديد، بانتظار اختبار |
| DefenseManager.js | /src/defenses/DefenseManager.js | وضع الدفاعات + تحديثها | 🆕 جديد، بانتظار اختبار |
| TouchControls.js | /src/input/TouchControls.js | Pan + Zoom + Tap | ✅ مرفوع ومُختبر |
| CameraController.js | /src/camera/CameraController.js | إدارة الكاميرا الثابتة | ✅ مرفوع ومُختبر |
| InteractionController.js | /src/interaction/InteractionController.js | يوجّه النقرة (+ فرع وضع البناء) | ✅ محدَّث، بانتظار اختبار |
| Toast.js | /src/ui/Toast.js | إشعار بصري | ✅ مرفوع ومُختبر (بلا تغيير) |
| BaseHUD.js | /src/ui/BaseHUD.js | شريط HP القاعدة | ✅ مرفوع ومُختبر (بلا تغيير) |
| WaveUI.js | /src/ui/WaveUI.js | عرض رقم/حالة الموجة | ✅ مؤكَّد من المستخدم |
| GameOverUI.js | /src/ui/GameOverUI.js | شاشة نهاية اللعبة (+ تعطيل DefenseUI) | ✅ محدَّث، بانتظار اختبار |
| DefenseUI.js | /src/ui/DefenseUI.js | زر وضع الدفاع + تلميح | 🆕 جديد، بانتظار اختبار |

محذوف نهائيًا من المشروع (لا يجب أن يظهر أو يُشار له مجددًا كملف حالي):
مجلد /src/player/ بالكامل (Player.js والنسخة القديمة من TouchControls.js بمنظور شخص أول)

الأنظمة المكتملة والمُختبرة فعليًا على الهاتف
✅ Core Foundation
✅ 3D World (Ocean + Island)
✅ Camera & Touch Controls (Pan + Zoom، زاوية 58°)
✅ World Interaction (صناديق/موارد + نقر + Toast)
✅ Defense Map (مسار + نقطة ظهور + قاعدة/HP + مناطق بناء)
✅ Enemies (حركة على المسار + HP + موت + وصول للقاعدة)
✅ Waves (تصعيد الصعوبة + Game Over)

الأنظمة المرفوعة بانتظار اختبار فعلي على الهاتف
🔧 Defenses (وضع حر بالنقر + استهداف + تصويب)
🔧 Combat (مقذوفات + ضرر + Critical)

الأنظمة الناقصة (حسب خارطة الطريق في GAME_SPEC.md)
Economy (تحسين/متجر)، Progression، Merge Engine، Collection، Bosses، Weather + Day/Night، Quests، Advanced World، Visual Upgrade، Audio، Polish، Mobile Optimization، Camera/Terrain Collision (تحسين مؤجل)، Save System، Drag & Drop لنقل الدفاعات (تحسين مؤجل)، Offline Alpha، Balancing، Online Preparation (مستقبلي)، Online Multiplayer (مستقبلي)

ملاحظات مهمة للمتابعة
المشروع يُبنى مرحلة بمرحلة حسب GAME_SPEC.md قسم 164.
قاعدة صارمة: لا تُصنَّف أي مرحلة "مكتملة" إلا بعد تأكيد المستخدم الفعلي على الهاتف.
قاعدة الـCache: أي تحديث لملف JS يتطلب رفع رقم ?v= داخل index.html (حاليًا 11 على كل الملفات).
قرار مسجَّل ونهائي: كاميرا ثابتة الزاوية بدون جسم لاعب، وبدون أي نظام استكشاف. لا تتم إعادة اقتراح أي منهما إلا بطلب صريح جديد من المستخدم.
قرار مسجَّل: وضع الدفاعات بالنقر (Tap-to-Place) وليس Drag & Drop. لا يُعاد اقتراح Drag & Drop إلا بطلب صريح جديد.
لا يوجد Save System بعد — أي تقدّم يُفقد عند تحديث الصفحة.
كل ملف كود يُعطى للمستخدم بشكل منفصل، مع مساره الكامل، بدون أي كتابة إضافية مطلوبة من المستخدم.
رابط اللعبة المباشر: https://khalilbrda-arch.github.io/Infinity_depths/

سجل المراحل (Changelog)
[✅ مكتملة] المرحلة 1 — Core Foundation
[✅ مكتملة] المرحلة 2 — 3D World
[مُلغاة واستُبدلت] المرحلة 3 (نسخة قديمة) — Player (First Person)
[✅ مكتملة] المرحلة 3 (النسخة الحالية) — Camera & Touch Controls
[✅ مكتملة] المرحلة 4 — World Interaction (تم تأكيدها فعليًا على الهاتف من المستخدم)
[✅ مكتملة] المرحلة 5 — Defense Map
[✅ مكتملة] المرحلة 6 — Enemies
[✅ مكتملة، مؤكَّدة من المستخدم] المرحلة 7 — Waves
[🔧 الكود جاهز، بانتظار اختبار] المرحلة 8 — Defenses
  ملفات جديدة: /src/defenses/Defense.js، /src/defenses/DefenseManager.js، /src/ui/DefenseUI.js
  تحديثات: Config.js (DEFENSES)، GameState.js (canAfford/spendCurrency)، InteractionController.js (فرع وضع البناء)، GameOverUI.js (تعطيل DefenseUI)، index.html (v=11)
[🔧 الكود جاهز، بانتظار اختبار] المرحلة 9 — Combat
  ملفات جديدة: /src/combat/Projectile.js، /src/combat/ProjectileManager.js
  تحديثات: Config.js (COMBAT)، Enemy.js (بنية Status Effects عامة)، Game.js (ربط ProjectileManager/DefenseManager بحلقة اللعبة)، index.html (v=11)
بانتظار: تأكيد المستخدم الفعلي أن وضع المدافع، التصويب، إطلاق النار، وقتل الأعداء تعمل جميعًا بشكل صحيح على الهاتف دون تعارض مع باقي الأنظمة (راجع قسم "بانتظار تأكيد المستخدم" أعلاه)

المرحلة القادمة (بعد تأكيد المرحلتين 8 و9)
المرحلة 10 — ECONOMY (Gold، Rewards، Costs، Upgrades، Inventory) — قسم 140 بالمواصفات.
