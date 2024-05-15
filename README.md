# 🌙 برنامج تعلم القرآن
<div align="justify">
السلام عليكم يا زملائي. يهدف هذا التطبيق إلي تيسير سماع، قرائة وتعلم القرآن عبر الهواتف التي يقضي عليها كثيرون منا جزءًا كبيرًا من الوقت كل يوم.
<br><br>

فقد قال الله تعالي: **{  يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنْكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ }** (آية ١١ - المجادلة) كما ورد عن النبي صلى الله عليه وسلم في صحيح البخاري: **(خيركم من تعلم القرآن وعلمه)** وروي الإمام مسلم عن أبي هريرة رضي الله عنه أن رسول الله صلى الله عليه وسلم قال **(ومن سلك طريقا يلتمس فيه علما سهل الله له طريقا به إلى الجنة)** وهذا فقط بعض ما ورد في القرآن الكريم والسنة النبوية في فضل تعلم القرآن.
<br><br>
ومن خواص التطبيق والتي قد يتميز ببعضها عن التطبيقات الأخري:
</div>

<img  alt="Screen Shot 2024-05-06 at 1 51 52 AM" src="https://github.com/EssamWisam/Learn-Quran-App/assets/49572294/546df1ca-f466-412d-beb3-c8d5d2a2c6ad">

خاصية السماع فقط تحتاج إلي الانترنت.

![De_pages-to-jpg-0003](https://github.com/EssamWisam/Learn-Quran-App/assets/49572294/baf018d0-336a-4361-8edd-30c9c389ab39)

<img alt="image" src="https://github.com/EssamWisam/Learn-Quran-App/assets/49572294/8f608af9-37a9-44f3-b448-20d15e975f4e">

<div align="justify">
  
ويمكن تحميل النسخة التجريبية للبرنامج من خلال هذا <a href="https://expo.dev/artifacts/eas/wbmdwzJHsJDk6qnKwRqayZ.apk">الرابط</a> وفي حال اكتشافكم لأي عطب برمجي كما هو محتمل جداً في هذه المرحلة نرجو الإبلاغ عن ذلك عبر جيتهاب أو أي وسيلة أخري ومرحب ايضاً بكافة التعليقات الهادفة للتحسين أو ألافكار. سيتم إن شاء الله رفع التطبيق على متجر جوجل بلاي بعد التأكد من أنه يخلو من أي مشاكل.
</div>

## 👨🏻‍💻 التقنيات والمساهمة

تم بناء هذا التطبيق باستخدام ريأكت نيتف وهو يختلف بشكل محدود ومحدد عن رياكت كما قد بينت من قبل [هنا](https://github.com/EssamWisam/CST-Front-End-Course/blob/main/6.%20React%20Native/React%20Native.ipynb).

ويأخذ البرنامج الهيكل التالي
```
.
├── App.tsx                     نقطة الدخول
├── Navigation.tsx              يحدد طرق التنقل بين الصفحات المختلفة
├── Pages
│   ├── HomePage                عناصر الصفحة الرئيسية (قائمة السور والأجزاء)                                                      
│   ├── SurahPage               عناصر صفحة عرض السورة وسماعها والتمرير التلقائي
│   ├── TafsirPage              عناصر صفحة عرض التفسير والبويب الموضوع للسورة وبطاقة المعلومات
│   ├── BookmarksPage           عناصر صفحة الحافظة (مستعارة من صفحة التفسير)
│   ├── SettingsPage            عناصر صفحة الإعدادات
│   └── EmptyPage               صفحة فارغة لا تعرض 
├── Quran                       يحتوي على القرآن الكريم، تفسير الوسيط وما ألي ذلك وكود بيثون يساعد في تكوين الملفات
│   ├── Quran.txt
│   ├── Tafsir.ipynb
│   ├── TafsirParse.ipynb
│   ├── ...
│   └── update-sections-json.ipynb
├── Redux                        يحتوي على المتغيرات المستخدمة في عناصر مختلفة في البرنامج
│   ├── slices
│   └── store.ts
├── app.json                      يحتوي على اسم البرنامج وبيانات اخري
├── assets                        يحتوي على لوجو البرنامج والصور والخطوط الاخري المستخدمة
├── fonts.ts                      يقوم لتحميل الخطوط إلي البرنامج
└── helpers.ts                    به دوال مستخدمة في عناصر مختلفة من البرنامج
```

لا تتردت بعمل "طلب سحب" إذا اردت المساهمة سواء كان ذلك لإضافة خاصية جديدة أو إصلاح أي عطل تكتشفه في التطبيق وجزاكم الله كل خير.

## 🤔 لماذا تفسير الوسيط


<div align="justify">
  
من الأسباب الرئيسية التي جعلتني افكر في بناء هذا التطبيق، كانت قراءتي (لبعضٍ من) تفسير الوسيط للشيخ المصري محمد الطنطاوي - رحمه الله. كنت آنذاك أبحث في التفاسير المختلفة لبعض السور، وكنت أعتاد البحث أكثر في تفسير الآية لفهمها بشكل أعمق وأشمل، حتى وقفتُ على تفسير الوسيط، فوجدتُ فيه القدر الممتاز من الوضوح والشمول.
<br><br>
يمكنك النظر في ذلك من خلال قرائة التفاسير المختلفة (الميسر، المختصر، القرطبي، ابن كثير وما إلي ذلك) لنفس الآية من خلال موقع [SurahQuran](https://surahquran.com/aya-tafsir-65-21.html): كثيرٌ منها قد لا يوضح دور الكلمات والأساليب الموجودة في الآية في استنتاج تفسيرها (مما يفيد التسهيل والتبسيط فهي تفاسير عظيمة علي أي حال)، أما التفسير الوسيط فوجدت أنه عادةً أو كثيراً ما يفسر الآية كلمة بكلمة (بالقدر المطلوب) ويتحدث في ذلك عن أصول الكلمات وأمثلة لاستخدامها في اللغة والمنطق وراء مجيئها في الأساليب عينها ثم يستنتج من ذلك التفسير العام للآية (الذي يُذكر مثله في بعض التفاسير الأخرى بدون استنتاج للتسهيل) ومن ثم يكمل التفسير بالاستعانة إلى السنة أو الآيات الأخرى وعندما تتعدد الآراء في تأويلٍ معين، يذكر أهمها ويختار ويبرر رأيه الخاص منها. وبهذا يمكن للمتعلم استنتاج (البعض من)  التفسير للآيات الأخرى التي تحتوي على نفس الكلمات أو الأساليب الموجودة في الآيات التي تعلمها من قبل.
<br><br>

ومن مزايا قراءة التفسير الوسيط عبر هذا التطبيق انه لا يحتاج إلي الانترنت وانه يعرض التفسير بعد إضافة المسافات والالوان لتيسير قرائته.
<br><br>
ومن كتب التفسير الحديثة الأخري العظيمة التي اطلعت عليها، التفسير المنير للشيخ السوري وهبة الزحيلي. يعرض هذا التفسير -بشكل في منتهى التنظيم- المواضيع المختلفة في كل سورة ولكل موضوع منهم يمر على الآيات المتضَمنة ويشرح لكلٍ منها: الإعراب، البلاغة، المفردات اللغوية، التفسير والبيان، فقه الحياة أو الأحكام. كما لو كان نسخة منظمة، مطولة ومتعمقة من تفسير الوسيط ولهذا فهو يستحق تطبيقه الخاص الذي يعرض التفسير كما هو منظم في كتابه. في هذا التطبيق استعرت منه فقط التبويب الموضوعي للسور واستخدمت تفسير الوسيط فضلاً عنه لأنه أبسط وأقصر ولا يحتاج إلي تنظيم معين.

</div>

## 📚 المرجعيات 
- استعنت ب[alquran.cloud](https://alquran.cloud/cdn) لتحميل المقاطع الصوتية للتلاوات
- استعنت ب [tafsir_api](https://github.com/spa5k/tafsir_api) لتنزيل تفسير الوسيط مقسم بالآيات وقمت بعد ذلك بمعالجة المحتوي النصي في التفسير لتيسير القرائة
- بالنسبة للتبويب الموضوعي للسور فقمت بعمل سكريب لفهرس كتاب التفسير المنير على [المكتبة الشاملة](https://shamela.ws/book/22915) وكتابة كود اختبار لتأكد من صحة ذلك
- بالنسبة لبطاقات السور فهي من [كتاب البطاقات](https://ia800503.us.archive.org/6/items/al-bitaqat-book/AlBitaqat-Book-ar.pdf) لدكتور ياسر بن إسماعيل راضي والتي وجدتها على هيئة جسون [هنا](https://github.com/rn0x/albitaqat_quran/tree/main)
- بعض الايقونات الموجودة مأخوذة من موقع [Flaticon](https://www.flaticon.com/)
                                                                                                                                                                                                                       

## 📖 الأفكار الأخري (Quran Summer of Code)
هل أنت ملم بتقنيات كتابة برامج الهواتف مثل (فلاتر ورياكت نيتف وغيرعهم) وتتطلع إلى استخدام تلك المهارات في إطار تعليم القرآن؟ إذا كانت اجابتك نعم، فربما تجد في الافكار [التالية](https://github.com/EssamWisam/Learn-Quran-App/blob/main/QSoC.md) ما يمكنك المساهمة أو البدء في بنائه.

شكراً لكم والسلام عليكم ورحمة الله.
