PROJECT STATE — Infinite Depths
هذا الملف هو المرجع الحي لحالة المشروع. يُحدَّث بعد كل خطوة حقيقية.
عند بدء أي محادثة جديدة، يجب قراءة هذا الملف كاملاً أولاً، بالإضافة إلى GAME_SPEC.md (وخصوصًا الملاحظة الإلزامية بأعلاه والأقسام 01، 07، 08، 39).
⚠️ القرار المعماري الأهم بالمشروع (لا يُلغى إلا بطلب صريح من المستخدم)
اللعبة كاميرا ثابتة الزاوية من فوق (Fixed-Angle Top-Down)، أسلوب Clash of Clans — زاوية ميلان 58° عن الأرض، تحكم فقط بالسحب (Pan) والتكبير/التصغير (Zoom). لا يوجد جسم لاعب متحرك إطلاقًا (لا Player.js، لا منظور شخص أول/ثالث، لا WASD/Joystick).
⚠️ قرار إضافي مسجَّل: لا يوجد أي نظام "استكشاف" (Exploration) بهذه اللعبة — لا مناطق مجهولة تُكتشف تدريجيًا، لا ضباب حرب، لا مكافأة مقابل التجول. كل عنصر تفاعلي (صندوق/مورد) ظاهر على الخريطة منذ البداية، ويُفتح/يُجمع بنقرة (Tap) مباشرة عليه. القسم 39 بالمواصفات اسمه الآن "World Interaction" (سابقًا Exploration).
الترتيب الزمني للقرارات: Third-Person (تصميم أولي) → First-Person (تغيير أول) → Fixed-Angle Top-Down بدون استكشاف (القرار الحالي والنهائي).
آخر تحديث
تم تنفيذ المرحلة 4 — World Interaction بالكامل على مستوى الكود: عناصر تفاعلية (3 صناديق كنز + 6 عقد موارد) ظاهرة على الجزيرة منذ بداية اللعبة، تُفتح/تُجمع بنقرة (Tap) مباشرة، مع مكافأة ذهب فورية وإشعار بصري (Toast) قصير. تم فصل "النقرة" عن "السحب" داخل نظام الإدخال نفسه (TouchControls) بحيث لا يتعارضان.
آخر مرحلة مكتملة (على مستوى الكود — بانتظار اختبار فعلي)
المرحلة 4 — WORLD INTERACTION 🔧 الكود جاهز ومرفوع، لم يُختبر على الهاتف بعد.
تم فعليًا:
إضافة CONFIG.INTERACTABLES (تعريف بيانات الصناديق والموارد: id/موقع/مكافأة) وCONFIG.TAP_INPUT (حدود كشف النقرة) بملف Config.js.
تحديث GameState.js: إضافة interactions.openedIds وhasInteracted(id) وregisterInteraction(id, reward) — لمنع جمع نفس العنصر مرتين ولإضافة المكافأة للعملة.
تحديث TouchControls.js بالكامل: إضافة كشف "نقرة" (Tap) منفصل عن Pan — لمس سريع (< 300ms) بحركة محدودة (< 12px) يُعتبر نقرة، عبر consumeTap()، بدل الاعتماد فقط على consumePan()/consumeZoom(). يدعم اللمس والماوس معًا.
ملف جديد /src/world/Interactables.js: يبني صناديق/موارد كأجسام 3D بدائية (Box/Octahedron) فوق موقعها المحدد، بحركة تعويم ودوران بسيطة، ويوفر getLiveMeshes() وinteract(mesh).
ملف جديد /src/interaction/InteractionController.js: يحوّل نقرة الشاشة إلى Raycaster من الكاميرا، يتحقق من التقاطع مع عناصر Interactables الحية فقط، وينفّذ التفاعل عند الإصابة.
ملف جديد /src/ui/Toast.js: إشعار نصي بسيط (DOM) يظهر "صندوق كنز +25 🪙" أو "مورد +5 🪙" لحوالي ثانية عند كل تفاعل ناجح.
تحديث Game.js: استدعاء Interactables.create() بعد بناء العالم، InteractionController.init() بعد الكاميرا، واستدعاء InteractionController.update() وInteractables.update() بحلقة اللعبة.
تحديث index.html: ترتيب سكربتات جديد (يضيف Toast، Interactables، InteractionController)، رقم الكاش الحالي ?v=6، تلميح تحكم محدَّث "... انقر على العناصر للتفاعل".
سلوك معروف ومقبول بهذه المرحلة (ليس خطأ):
عند النقر السريع، قد تتحرك الكاميرا بمقدار بسيط جدًا (أقل من نصف وحدة) بسبب أن أي حركة إصبع صغيرة تُحتسب أيضًا كـPan تراكمي — هذا متوقع ومقبول، وليس خللًا يستدعي إصلاحًا عاجلاً.
مواقع الصناديق/الموارد ثابتة يدويًا بالكود حاليًا (لا نظام Placement عشوائي أو محرر مستويات بعد) — طبيعي لهذه المرحلة المبكرة.
لا حفظ دائم (Save System) بعد — إذا أُعيد تحميل الصفحة، تعود كل العناصر المجموعة للظهور من جديد (GameState لا يُحفظ محليًا بعد). هذا مخطط له بمرحلة لاحقة منفصلة (Save System).
⏳ بانتظار تأكيد المستخدم الفعلي على الهاتف:
هل النقر يعمل بدقة (يفتح العنصر الصحيح عند النقر عليه فعليًا)؟
هل يوجد تعارض محسوس بين النقر والسحب؟
هل حجم/وضوح الصناديق والموارد مناسب على شاشة الهاتف؟
قاعدة صارمة بالمشروع: لا تُصنَّف هذه المرحلة "مكتملة نهائيًا" إلا بعد هذا التأكيد.
المرحلة القادمة (بعد تأكيد المرحلة 4)
المرحلة 5 — DEFENSE MAP (المسار، نقطة الظهور، القاعدة، مناطق البناء) — قسم 135 بالمواصفات.
الملفات الموجودة حاليًا في المشروع (الحالة الفعلية بعد التحديث)
| الملف | المسار الكامل | الوظيفة | الحالة |
|---|---|---|---|
| README.md | /README.md | ملف GitHub افتراضي | ✅ موجود |
| GAME_SPEC.md | /GAME_SPEC.md | وثيقة المواصفات الكاملة | ✅ محدَّثة (كاميرا ثابتة + لا استكشاف) |
| PROJECT_STATE.md | /PROJECT_STATE.md | هذا الملف | ✅ محدَّث |
| index.html | /index.html | نقطة الدخول (?v=6) | ✅ مرفوع، بانتظار اختبار |
| Config.js | /src/core/Config.js | الإعدادات المركزية (CAMERA، CAMERA_CONTROL، INTERACTABLES، TAP_INPUT، إضاءة، عالم) | ✅ مرفوع، بانتظار اختبار |
| GameState.js | /src/core/GameState.js | حالة تقدّم اللاعب + حالة التفاعل (interactions) | ✅ مرفوع، بانتظار اختبار |
| Time.js | /src/core/Time.js | نظام الوقت المستقل | ✅ مرفوع ومُختبر |
| Game.js | /src/core/Game.js | محرك اللعبة (Scene, Renderer, Lighting, Sky, Loop) | ✅ مرفوع، بانتظار اختبار |
| Ocean.js | /src/world/Ocean.js | نظام المحيط المتحرك | ✅ مرفوع ومُختبر |
| Island.js | /src/world/Island.js | نظام الجزيرة | ✅ مرفوع ومُختبر |
| Interactables.js | /src/world/Interactables.js | صناديق وموارد الخريطة (بناء + تعويم + تفاعل) | 🆕 جديد، بانتظار اختبار |
| TouchControls.js | /src/input/TouchControls.js | Pan + Zoom + Tap (نقرة) | ✅ محدَّث، بانتظار اختبار |
| CameraController.js | /src/camera/CameraController.js | إدارة موقع/زاوية الكاميرا الثابتة | ✅ مرفوع، بانتظار اختبار |
| InteractionController.js | /src/interaction/InteractionController.js | يحوّل النقرة إلى Raycaster ويربطها بعناصر الخريطة | 🆕 جديد، بانتظار اختبار |
| Toast.js | /src/ui/Toast.js | إشعار بصري بسيط عند التفاعل | 🆕 جديد، بانتظار اختبار |
محذوف نهائيًا من المشروع (لا يجب أن يظهر أو يُشار له مجددًا كملف حالي):
مجلد /src/player/ بالكامل (Player.js والنسخة القديمة من TouchControls.js بمنظور شخص أول)
الأنظمة المكتملة والمُختبرة فعليًا على الهاتف
✅ Core Foundation
✅ 3D World (Ocean + Island)
الأنظمة المرفوعة بانتظار اختبار فعلي على الهاتف
🔧 Camera & Touch Controls (Pan + Zoom، زاوية 58°)
🔧 World Interaction (صناديق/موارد + نقر + Toast)
الأنظمة الناقصة (حسب خارطة الطريق في GAME_SPEC.md)
Defense Map, Enemies, Waves, Defenses, Combat, Economy, Progression, Merge Engine, Collection, Bosses, Weather + Day/Night, Quests, Advanced World, Visual Upgrade, Audio, Polish, Mobile Optimization, Camera/Terrain Collision (تحسين مؤجل), Save System, Offline Alpha, Balancing, Online Preparation (مستقبلي), Online Multiplayer (مستقبلي)
ملاحظات مهمة للمتابعة
المشروع يُبنى مرحلة بمرحلة حسب GAME_SPEC.md قسم 164.
قاعدة صارمة: لا تُصنَّف أي مرحلة "مكتملة" إلا بعد تأكيد المستخدم الفعلي على الهاتف.
قاعدة الـCache: أي تحديث لملف JS يتطلب رفع رقم ?v= داخل index.html (حاليًا 6).
قرار مسجَّل ونهائي: كاميرا ثابتة الزاوية بدون جسم لاعب، وبدون أي نظام استكشاف. لا تتم إعادة اقتراح أي منهما إلا بطلب صريح جديد من المستخدم.
لا يوجد Save System بعد — أي تقدّم (عناصر مجموعة، ذهب) يُفقد عند تحديث الصفحة. هذا معروف ومخطط له بمرحلة لاحقة منفصلة.
كل ملف كود يُعطى للمستخدم بشكل منفصل، مع مساره الكامل، بدون أي كتابة إضافية مطلوبة من المستخدم.
رابط اللعبة المباشر: https://khalilbrda-arch.github.io/Infinity_depths/
سجل المراحل (Changelog)
[✅ مكتملة] المرحلة 1 — Core Foundation
[✅ مكتملة] المرحلة 2 — 3D World
[مُلغاة واستُبدلت] المرحلة 3 (نسخة قديمة) — Player (First Person)
[✅ مكتملة] المرحلة 3 (النسخة الحالية) — Camera & Touch Controls (بانتظار تأكيد نهائي على الهاتف)
[🔧 الكود جاهز، بانتظار اختبار] المرحلة 4 — World Interaction
ملفات جديدة: /src/world/Interactables.js، /src/interaction/InteractionController.js، /src/ui/Toast.js
تحديثات: Config.js (INTERACTABLES + TAP_INPUT)، GameState.js (interactions)، TouchControls.js (consumeTap)، Game.js (ربط الأنظمة الجديدة)، index.html (v=6)
بانتظار: تأكيد المستخدم الفعلي أن النقر يعمل بدقة على الهاتف بدون تعارض مع السحب
