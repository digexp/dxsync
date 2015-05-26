Theme Modules Overview (English)
**********************

This 'contributions' folder within WebDAV is a well defined folder by WebSphere Portal to provide
theme modules to the resource aggregator framework. Within this folder is one .json file per module or set
of modules - create your own .json file for your own module or set of modules. You can copy, rename and
modify one of the existing .json files in order to see and learn the .json syntax that is required.

Theme modules are scoped to your one theme. If you want to use some of these same modules in different themes,
you have to copy these module definition .json files from one theme to the other.

Note that there is an even easier way to create modules, called simple modules, using the 'modules' folder.
Both are scoped to your one theme. The .json syntax of the theme modules allows for a few more advanced 
things that you cannot do with simple modules, such as:

- declaring a version number for your module
- using device class equations as opposed to just individual device classes
- declaring that a prereq is optional
- using sub-contribution types of config_static and config_dynamic.

But, if you do not need those more advanced things, in most cases you will probably prefer using simple
modules.

For further instructions on simple modules read the readme.txt file within the 'modules' folder.

(Also note that there is third way to create your own modules, referred to as global modules, via plugin.xml
files within the 'WEB-INF' folder within enterprise applications (.ear's). This way involves the most work, 
so you would not do it unless you have good reason, such as for a module that is reused across multiple 
themes and you don't want to duplicate the module definition in each of the themes. Global modules, as the 
name implies, are scoped across all themes.)
 
If theme modules is the right choice for your needs, a summary of the .json syntax is as follows:
(NOTE:  This description has a matching schema in the contributions/schema folder, which can be used
with a schema validation tool to verify a JSON-format contribution file).

- A single object with a modules array (required). (An object in .json notation is {} and an array in
  .json notation is []):

	{
		"modules": [
		]
	}
	
  - 1 to n objects within the modules array, each with an id string (required), a version string (optional),
    a capabilities array (optional), a prereqs array (optional), a contributions array (required*), 
    a titles array (optional) and a descriptions array (optional):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*NOTE:  It is also valid to have a module which consists only of an id and a prereqs array, plus the other 
		optional members, but no contributions.  This is a "meta-module" which can be used to abstract a dependency
		on some other concrete module.  A valid module must have one or both of prereqs and contributions.
		
     - a string value for id, such as "my_module", where the value is the unique id of your module. This value
       is what you will list in a profile to turn your module on.
       
     - a numeric string value for version, such as "1.0", where the value is the version number of your module.
       
     - 1 to n objects within the capabilities array, each with an id string (required)
       and a value string (required). Each id value indicates the id of the capability that this module
       exposes, and each value value indicates the version number of the capability:
       
				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 1 to n objects within the prereqs array, each with an id string (required). Each id value indicates the id
       of the module that your module pre-requires:
       
				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - 1 to n objects within the contributions array, each with a type string of "head", "config" or "menu"
       (required) and a sub-contributions array (required). "head" means the resource contribution will go
       in the head of the page. "config" means the resource contribution will go in the body of the page.
       "menu" menus the resource contribution will go as part of a context menu on the page:
       
				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 1 to n objects within the sub-contributions array, each with a type string (required)
         and a uris array (required). If contribution type is "head", sub-contribution type must be "css" or 
         "js". If contribution type is "config", sub-contribution type must be "js", "markup", "config_static"
         or "config_dynamic". If contribution type is "menu", sub-contribution type must be "json":
       
						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - 1 to n objects within the uris array, each with a value string (required), 
           a deviceClass string (optional), a type string (optional) and a lang string (optional).
           The value string is a path relative to your theme's main folder in WebDAV. deviceClass,
           if specified, means that the resource will only be included for certain devices that match.
           The value of deviceClass can be a single device class, such as "smartphone", or a device
           class equation, such as "smartphone+ios". type, if specified, is one of "debug", "rtl" or
           "debug,rtl". "debug" means the resource is only included if remote debugging is on, and its
           value path is usually to the uncompressed version of the resource. "rtl" means the resource
           is only included if the user's locale is a bi-directional one, such as Hebrew, where text
           on the page is presented from right-to-left. lang, if specified, means the resource is only
           included if the user's locale matches the lang specified:
       
								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - 1 to n objects within the titles array, each with a value string (required) and a lang string
       (required). These define the title or display name of your module as it will appear in certain
       parts of Portal such as in the Theme Analyzer portlet, in as many different languages as you
       need:
       
				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - 1 to n objects within the descriptions array, each with a value string (required) and a lang string
       (required). These define the description of your module as it will appear in certain
       parts of Portal such as in the Theme Analyzer portlet, in as many different languages as you
       need:
       
				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Any time that you add a file to this 'contributions' folder or make a change, you need to invalidate
the resource aggregator cache for WebSphere Portal to pick up the changes.
You can do this by going to Administration -> Theme Analyzer -> Utilities -> Control Center.
On the Control Center page click the link under 'Invalidate Cache'.

Once you define your new module, you need to add it to a profile to turn it on. 
For further instructions on profiles read the readme.txt file within the 'profiles' folder.

If you have any syntax errors in your .json or problems getting your new module to work, use the
Theme Analyzer portlet to narrow down the problem. Go to Administration -> Theme Analyzer -> Validation Report
and examine and take action on the error and warning messages.

Also, you can refer to the wiki documentation for even more information on the .json syntax, such as there is 
a .json schema file available that shows all of the possible syntaxes and that you can run with your .json
through an online .json validator to verify that it is syntactically correct. 



مقدمة لوحدات برامج النسق الرئيسي (العربية)
********************************

تعد حافظة 'contributions' التي توجد في WebDAV حافظة معرفة بواسطة WebSphere Portal لاتاحة وحدات برامج النسق الرئيسي لاطار عمل أداة تجميع المصادر.  في هذه الحافظة يوجد ملف .json واحد لكل وحدة برامج أو مجموعة وحدات برامج - قم بتكوين ملف .json الخاص بك لوحدة البرامج أو مجموعة وحدات البرامج الخاصة بك. يمكنك نسخ واعادة تسمية وتعديل أحد ملفات .json الموجودة حاليا حتى يمكن مشاهدة ومعرفة صيغة .json المطلوبة.

يتم تحديد نطاق وحدات برامج النسق الرئيسي الى النسق الرئيسي الخاص بك. اذا كنت تريد استخدام بعض وحدات البرامج هذه في نسق رئيسية مختلفة، يجب أن تقوم بنسخ ملفات .json لتعريف وحدة البرامج من نسق رئيسي الى آخر. 

يجب ملاحظة أنه توجد طريقة أسهل لتكوين وحدات البرامج، تسمى وحدات برامج بسيطة، باستخدام الحافظة 'modules'.
يتم تحديد نطاق كلاهما الى النسق الرئيسي الخاص بك. تسمح صيغة .json لوحدات برامج النسق الرئيسي بالقيام بعدة أشياء متقدمة لا يمكنك القيام بها باستخدام وحدات البرامج البسيطة، مثل:  

- توضيح رقم نسخة لوحدة البرامج الخاصة بك
- استخدام معادلات فئة الجهاز التي تتعامل مع فئات الجهاز المنفردة فقط- توضيح أن المتطلبات اختيارية
- استخدام أنواع المشاركات الفرعية مثل config_static و config_dynamic.

لكن، اذا كنت لا تحتاج هذه الأشياء المتقدمة، في معظم الحالات ستفضل غالبا استخدام وحدات البرامج البسيطة.  

لمزيد من التعليمات الخاصة بوحدات البرامج البسيطة، قم بقراءة الملف readme.txt في الحافظة 'modules'.

(كما يجب ملاحظة أنه توجد طريقة ثالثة لتكوين وحدات البرامج الخاصة بك، يتم الاشارة اليها بوحدات البرامج الشاملة، من خلال ملفات plugin.xml
في الحافظة 'WEB-INF' في تطبيقات المؤسسة (.ear). تتضمن هذه الطريقة معظم العمل، لذلك لن تقوم بذلك الا اذا كان لديك سبب جيد، مثل وحدة برامج تم اعادة استخدامها خلال نسق رئيسية متعددة ولا تريد تكرار تعريف وحدة البرامج في كل نسق رئيسي.  وحدات البرامج الشاملة، حيث يتضمن الاسم، يتم تحديدها خلال كل النسق الرئيسية.)
 
اذا كانت وحدات برامج النسق الرئيسي هي الاختيار الصحيح بالنسبة لمتطلباتك، يكون ملخص الصغية  .json كما يلي:
(ملحوظة:  هذا الوصف يوجد له وصف منطقي مطابق في حافظة contributions/schema، الذي يمكن استخدامه مع أداة التحقق من الوصف المنطقي للتحقق من ملف مشاركة نسق-JSON).

- عنصر واحد ذو متجه وحدات برامج (مطلوب). (العنصر في ترميز .json يكون {} والمتجه في ترميز
  .json يكون []):

	{
		"وحدات البرامج": [
		]
	}
	
  - 1 الى n عنصر في متجه وحدات البرامج، كل منها ذو كود تعريف (مطلوب)، مجموعة حروف النسخة (اختيارية)،
    متجه الامكانيات (اختياري)، متجه المتطلبات (اختياري)، متجه المشاركات (مطلوب*)،
    متجه العناوين (اختياري) ومتجه الوصف (اختياري):

        "وحدات البرامج": [
			{
				"id":"my_module",
				"النسخة":"1.0",
				"الامكانيات": [
				],
				"المتطلبات": [
				],
				"المشاركات": [
				],
				"العناوين": [
				],
				"الوصف": [
				]
			}
		]
		
		*ملحوظة:  يمكن أن يكون هناك وحدة برامج تتكون من كود تعريف ومتجه متطلبات فقط، بالاضافة الى العناصر الأخرى الاختيارية، لكن بدون مشاركات. يعد هذا "meta-module" يمكن استخدامه لتلخيص الارتباط على بعض وحدات البرامج الثابتة الأخرى. يجب أن يكون لوحدة البرامج الصحيحة أي من أو كلا من المتطلبات والمشاركات.
     - قيمة مجموعة الحروف لكود التعريف، مثل "my_module"، حيث تكون القيمة هي كود التعريف المتفرد لوحدة البرامج الخاصة بك. هذه القيمة هي ما سيتم عرضه في ملف مواصفات لتشغيل وحدة البرامج الخاصة بك.
     - قيمة مجموعة حروف رقمية للنسخة، مثل "1.0"، حيث تكون القيمة هي رقم النسخة لوحدة البرامج الخاصة بك.
     - 1 الى n عنصر في متجه الامكانيات، كلا منها بمجموعة حروف كود تعريف (مطلوب)
       ومجموعة حروف قيمة (مطلوبة). تشير كل قيمة كود الى كود الامكانية التي تعرضها وحدة البرامج هذه، وتشير ك ل قيمة الى رقم نسخة الامكانية:
				"الامكانيات": [
					{
						"الكود":"my_capability",
						"القيمة":"1.0"
					}
				],

     - 1 الى n عنصر في متجه المتطلبات، كلا منها بمجموعة حروف كود تعريف (مطلوب). تشير كل قيمة كود الى كود وحدة البرامج التي تتطلبها وحدة البرامج الخاصة بك:

				"المتطلبات": [
					{
						"الكود":"my_base_module"
					}
				],

     - 1 الى n عنصر في متجه المشاركات، كلا منها بالنوع "head" أو "config" أو "menu"
       (مطلوب) ومتجه المشاركات الفرعية (مطلوب). "head" تعني أن مشاركة المصادر ستكون في رأس الصفحة. "config" تعني أن مشاركة المصادر ستكون في نص الصفحة.
       "menu" تعني أن مشاركة المصادر ستكون كجزء من القائمة السياقية في الصفحة:
				"المشاركات": [
					{
						"النوع":"head",
						"المشاركات الفرعية": [
						]
					}
				],

       - 1 الى n عنصر في متجه المشاركات الفرعية، كلا منها بمجموعة حروف نوع (مطلوب)
         ومتجه uris (مطلوب). نوع التوصيف هو "head"، نوع المشاركة الفرعية يجب أن يكون "css" أو
         "js". اذا كان نوع التوصيف هو "config"، يجب أن يكون نوع المشاركة الفرعية "js" أو "markup" أو  "config_static" أو "config_dynamic". اذا كان نوع التوصيف هو "menu"، يجب أن يكون نوع المشاركة الفرعية هو "json":
						"المشاركات الفرعية": [
							{
								"النوع":"css",
								"uris":[
								]
							}
						]

         - 1 الى n عنصر في متجه uris، كلا منها بمجموعة حروف قيمة (مطلوبة)،
           مجموعة حروف deviceClass (اختيارية)، مجموعة حروف النوع (اختيارية) ومجموعة حروف اللغة (اختيارية).
           مجموعة حروف القيمة تكون مسار متعلق بالحافظة الرئيسية للنسق الرئيسي في WebDAV. deviceClass،
           تم تحديده، يعني أن المصدر سيتم تضمينه فقط لأجهزة مطابقة معينة.
           يمكن أن تكون قيمة deviceClass فئة جهاز واحدة، مثل "smartphone"، أو معادلة فئة جهاز، مثل "smartphone+ios". النوع، اذا تم تحديده،  يكون أي من "debug" أو "rtl" أو "debug,rtl". "debug" تعني أن المصدر يتم تضمينه فقط اذا كان تصحيح الأخطاء عن بعد فعال، ومسار القيمة الخاص به يكون عادة للنسخة غير المضغوطة للمصدر.  "rtl" تعني أن المصدر يتم تضمينه فقط اذا كانت محددات اللغة للمستخدم ثنائية الاتجاه، مثل العبرية، حيث يتم عرض النص بالصفحة من اليمين الى اليسار. lang، اذا تم تحديدها، تعني أن المصدر يتم تضمينه فقط اذا كانت محددات اللغة الخاصة بالمستخدم تطابق اللغة المحددة:

								"uris": [
									{
										"القيمة":"/css/my_css.css"
									},
									{
										"القيمة":"/css/my_css.css.uncompressed.css",
										"النوع":"debug"
									},
									{
										"القيمة":"/css/my_cssRTL.css",
										"النوع":"rtl"
									},
									{
										"القيمة":"/css/my_cssRTL.css.uncompressed.css",
										"النوع":"rtl,debug"
									},
									{
										"القيمة":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"القيمة":"/js/my_js_es.js",
										"اللغة":"es"
									}
								]
       
     - 1 الى n عنصر في متجه العناوين، كلا منها بمجموعة حروف قيمة (مطلوبة)
       ومجموعة حروف لغة (مطلوبة). يقوم هذا بتعريف العنوان أو اسم العرض لوحدة البرامج الخاصة بك حيث ستظهر في أجزاء معينة من Portal مثل Theme Analyzer portlet، في أي عدد من اللغات المختلفة وفقا لما يتطلبه الأمر:
				"العناوين": [
					{
						"القيمة":"My Module",
						"اللغة":"en"
					}
				],

     - 1 الى n عنصر في متجه الوصف، كلا منها بمجموعة حروف قيمة (مطلوبة)
       ومجموعة حروف لغة (مطلوبة). يقوم هذا بتعريف الوصف لوحدة البرامج الخاصة بك حيث سيظهر في أجزاء معينة من Portal مثل Theme Analyzer portlet، بأي عدد من اللغات المختلفة وفقا لما يتطلبه الأمر:
				"الوصف": [
					{
						"القيمة":"وحدة برامج تقدم الوظيفة xyz",
						"اللغة":"en"
					}
				]

في أي وقت تقوم باضافة ملف الى حافظة 'contributions' هذه أو اجراء تغيير، يجب أن تقوم بالغاء فاعلية الذاكرة الوسيطة لأداة تجميع المصادر الى WebSphere Portal لاحضار التغييرات.
يمكنك القيام بذلك من خلال الذهاب الى الادارة -> أداة تحليل النسق الرئيسي -> الوظائف -> مركز التحكم.
في صفحة مركز التحكم اضغط على الوصلة أسفل 'الغاء فعالية الذاكرة الوسيطة'.

بمجرد تعريف وحدة البرامج الجديدة الخاصة بك، يجب أن تقوم باضافتها الى ملف مواصفات لتشغيلها.
لمزيد من التعليمات الخاصة بملفات المواصفات، قم بقراءة الملف readme.txt في الحافظة 'profiles'.

اذا كان لديك أي أخطاء بالصيغة في ملف .json الخاص بك أو حدثت مشاكل أثناء الحصول على وحدة البرامج الجديدة الخاصة بك  للعمل، استخدم Theme Analyzer portlet لتقليل المشكلة. اذهب الى الادارة -> أداة تحليل النسق الرئيسي -> تقرير التحقق من الصلاحية وقم باجراء تصرف بالخطأ ورسائل التحذير.  

يمكنك أيضا الاشارة الى وثائق wiki الفنية للحصول على مزيد من المعلومات عن الصيغة .json، مثل أن يكون هناك  ملف وصف منطقي  .json متاحا ويعرض كل الصيغ المناسبة والتي يمكنك تشغيلها باستخدام .json مباشر للتحقق من صحتها.  



Visió general de mòduls de tema (anglès)
**********************

La carpeta "contributions" de WebDAV és una carpeta ben definida per WebSphere Portal per tal de proporcionar mòduls de tema a l'estructura de l'agregador de recursos.
Dins d'aquesta carpeta hi ha un fitxer .json per mòdul o conjunt de mòduls per crear el vostre propi fitxer .json per al mòdul o conjunt de mòduls. Podeu copiar, canviar el nom i modificar un dels fitxers .json existents per veure i aprendre la sintaxi de .json necessària.

Els mòduls de tema estan enfocats al vostre tema. Si voleu utilitzar alguns d'aquests mòduls en diferents temes, heu de copiar aquests fitxers .json de definició des d'un tema a l'altre.

Tingueu en compte que hi ha una manera encara més senzilla de crear mòduls, anomenada mòduls simples, utilitzant la carpeta "mòduls".
Ambdues estan enfocades al vostre tema. La sintaxi dels mòduls de tema permet realitzar algunes accions avançades que els mòduls simples no ofereixen, com ara:


- declarar un número de versió per al mòdul
- utilitzar les equacions de classe de dispositiu en lloc d'utilitzar només les classes de dispositiu individual - utilitzar tipus de subcontribució de config_static i config_dynamic.

No obstant això, si no necessiteu realitzar accions mes avançades, la majoria de vegades serà preferible que utilitzeu mòduls simples.


Per obtenir instruccions addicionals sobre mòduls simples, llegiu el fitxer readme.txt de la carpeta "mòduls".

(Tingueu en compte també que hi ha una tercera manera de crear mòduls, anomenada mòduls globals, a través de fitxers plugin.xml de la carpeta "WEB-INF" dins d'aplicacions d'empresa (.ear). Aquest mètode és el que comporta més feina; per tant, no compensa dur-lo a terme sense una bona raó, com ara quan un mòdul es reutilitza a diversos temes i no voleu duplicar la definició de mòdul a cada tema.
Els mòduls globals, com el seu nom indica, estan enfocats a tots els temes).

 
Si els mòduls de tema són l'opció correcta per a les ostres necessitats, a continuació es mostra un resum de la sintaxi de .json: (NOTA:  Aquesta descripció té un esquema coincident a la carpeta contribucions/esquema, que es pot  utilitzar amb una eina de validació d'esquema per verificar un fitxer de contribució de format JSON).

- Un objecte únic amb matriu de mòduls (necessari). (Un objecte a una anotació .json és {} i una matriu a una anotació .json és []):

	{
		"modules": [
		]
	}
	
  - D'un a n objectes de la matriu de mòduls, cadascun amb una sèrie d'ID (necessari), una sèrie de versió (opcional), una matriu de capacitats (opcional), una matriu de prerequisits (opcional), una matriu de contribucions (necessària*), una matriu de títols (opcional) i una matriu de descripcions (opcional):


        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*NOTA:  També és vàlid tenir un mòdul que consti només d'un ID i una matriu de prerequisits, a més de la resta de membres opcionals, però sense contribucions.
Es tracta d'un "metamòdul" que es pot utilitzar per resumir una dependència a un altre mòdul concret.
Un mòdul vàlid ha de tenir prerequisits i contribucions o ambdós.
     - un valor de sèrie de l'ID, com ara "my_module", on el valor és l'ID exclusiu del mòdul. Aquest valor és el que llistareu en un perfil per activar el mòdul.
     - un valor de sèrie numèrica de la versió, com ara "1.0", on el valor és el número de versió del mòdul.
     - D'un a n objectes de la matriu de capacitats, cadascun amb una sèrie d'ID (necessari) i una sèrie de valor (necessari).
Cada valor d'ID indica l'UD de la capacitat que exposa aquest mòdul i cada valor indica el número de versió de la capacitat:
				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - D'un a n objectes de la matriu de prerequisits, cadascun amb una sèrie d'ID (necessari). Els valors d'ID indiquen l'ID del mòdul que el mòdul requereix prèviament:
				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - D'un a n objectes de la matriu de contribucions, cadascun amb una sèrie de tipus de "head", "config" o "menu"
       (necessari) i una matriu de subcontribucions (necessari). "head" es refereix al fet que la contribució de recurs anirà a la capçalera de la pàgina.
"config" es refereix al fet que la contribució de recurs anirà al cos de la pàgina.
       "menu" es refereix al fet que la contribució de recurs formarà part del menú contextual de la pàgina:
				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - D'un a n objectes de la matriu de subcontribucions, cadascun amb una sèrie de tipus (necessari)
         i una matriu URI (necessari). Si el tipus de contribució és "head", el tipus de subcontribució ha de ser "css" o "js". Si el tipus de contribució és "config", el tipus de subcontribució ha de ser "js", "markup", "config_static"
         o "config_dynamic". Si el tipus de contribució és "menu", el tipus de subcontribució ha de ser "json":
						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - D'un a n objectes de la matriu URI, cadascun amb una sèrie de valor (necessari), una sèrie deviceClass (necessari), una sèrie de tipus (opcional) i una sèrie d'idioma (opcional).
           La sèrie de valor és un camí d'accés relatiu a la carpeta principal del tema de WebDAV. deviceClass,
           si s'ha especificat, vol dir que el recurs no s'inclourà per a determinats dispositius coincidents.
           El valor de deviceClass pot ser una classe de dispositiu únic, com ara "smartphone" o una equació de classe, com ara "smartphone+ios". El tipus, si s'ha especificat, és "debug", "rtl" o "debug,rtl". "debug" vol dir que el recurs només s'inclou si la depuració remota està activada i el camí d'accés del valor sol ser a la versió descomprimida del recurs.
"rtl" vol dir que el recurs només s'inclou si l'entorn local de l'usuari és bidireccional, com ara l'hebreu, on el text de la pàgina es presenta de dreta a esquerra.
lang, si s'ha especificat, vol dir que el recurs només s'inclou si l'entorn local de l'usuari coincideix amb l'idioma especificat:
								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
- D'1 a n objectes de la matriu de títols, cadascun amb una sèrie de valor (necessari) i una sèrie de llenguatge (necessari).
Defineixen el títol o el nom de la visualització del mòdul tal com apareixerà a determinades parts del Portal, com ara al portlet de l'analitzador de temes, i en tants idiomes com sigui necessari:
				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - D'un a n objectes de la matriu de descripcions, cadascun amb una sèrie de valor (necessari)  i una sèrie d'idioma (necessari).
Defineixen la descripció del mòdul tal com apareixerà a determinades parts del portal, com ara al portlet de l'analitzador de temes, i en tants idiomes com sigui necessari:
				"descriptions": [
					{
						"value":"Un mòdul que proporciona la funcionalitat xyz",
						"lang":"en"
					}
				]

Cada cop que s'afegeixi un fitxer a la carpeta 'contributions' o que es realitzi un canvi, és necessari invalidar la memòria cau de l'agregador de recursos del WebSphere Portal per obtenir els canvis.
Ho podeu fer a Administració -> Analitzador de temes -> Utilitats -> Centre de control.
A la pàgina Centre de control, feu clic a l'enllaç a sota de 'Invalida la memòria cau'.

Quan hàgiu definit el mòdul nou, haureu d'afegir-lo a un perfil per activar-lo.
Per obtenir instruccions addicionals sobre perfils, llegiu el fitxer readme.txt de la carpeta 'profiles'.

Si hi ha errors de sintaxi a .json o problemes al funcionament del mòdul nou, utilitzeu el portlet de l'analitzador de problemes per limitar el problema.
Aneu a Administració -> Analitzador de temes -> Informe de validació i examineu i realitzeu accions a l'error o als missatges d'advertiment.


També podeu fer referència a la documentació de la wiki per obtenir més informació sobre la sintaxi .json, com ara per saber si hi ha un fitxer d'esquema .json disponible que mostri totes les sintaxis possibles i que es pugui executar amb .json a través d'un validador .json en línia per verificar que sigui correcte sintàcticament.



Přehled modulů s motivy (anglicky)
**********************

Tato složka 'contributions' ve WebDAV je dobře definovaná složka portálu WebSphere Portal, která poskytuje
moduly s motivy pro rámec agregátoru prostředků. V této složce se nachází jeden soubor .json pro každý modul
nebo sadu modulů, pro vlastní modul nebo sadu moulů tedy vytvořte vlastní soubor .json. Chcete-li
si prohlédnout a pochopit požadovanou syntaxi souboru .json, můžete zkopírovat, přejmenovat a upravit některý
z existujících souborů .json.

Rozsah modulů s motivy je vymezen na jeden motiv. Chcete-li používat některé ze stejných modulů v jiných motivech,
musíte zkopírovat tyto soubory .json s definicí modulu z jednoho motivu do druhého.

Mějte na zřeteli, že existuje snazší způsob vytváření modulů, označovaných jako jednoduché moduly, a to pomocí složky 'modules'.
V obou případech je rozsah vymezen na jeden motiv. Syntaxe .json modulů s motivy umožňuje několik pokročilejších možností, které
nelze provádět s jednoduchými moduly, jako například:

- Deklarace čísla verze vašeho modulu
- Použití rovnic třídy zařízení namísto jednotlivých tříd zařízení
- Deklarace nezbytné součásti jako volitelné
- Použití typů dílčích příspěvků config_static a config_dynamic.

Pokud však tyto pokročilejší možnosti nepotřebujete, dáte zřejmě ve většině případů přednost použití
jednoduchých modulů.

Další pokyny k jednoduchým modulům naleznete v souboru readme.txt ve složce 'modules'.

(Mějte také na zřeteli, že existuje ještě třetí způsob vytváření vlastních modulů označovaných jako globální moduly,
a to prostřednictvím souborů plugin.xml ve složce 'WEB-INF' v rámci podnikových aplikací (.ear). Tento způsob
je nejpracnější, proto ho zřejmě nebudete používat, aniž byste k tomu měli dobrý důvod, jako např. modul používaný ve
více motivech, jehož definici nechcete v každém z motivů duplikovat. Rozsah globálních modulů, jak již naznačuje
jejich název, je vymezen na všechny motivy.)
 
Pokud představují moduly s motivy správnou volbu pro vaše potřeby, lze syntaxi .json shrnout takto:
(POZNÁMKA:  Tento popis má odpovídající schéma ve složce contributions/schema, které lze použít
s nástrojem ověření platnosti schématu k ověření platnosti souboru příspěvku ve formátu JSON).

- Jednotlivý objekt s polem modulů (modules, povinné). (Objekt v notaci .json je {} a pole
  v notaci .json je []):

	{
		"modules": [
		]
	}
	
  - 1 až n objektů v poli modulů (modules), každý s řetězcem ID (id, povinné), řetězcem verze (version, volitelné),
    polem schopností (capabilities, volitelné), polem nezbytných součástí (prereqs, volitelné), polem příspěvků
    (contributions, povinné*), polem titulků (titles, volitelné) a polem popisů (descriptions, volitelné):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*POZNÁMKA:  Platný je také modul, který obsahuje pouze ID a pole nezbytných součástí plus další
		volitelné členy, ale neobsahuje žádné příspěvky. Jedná se o "metamodul", pomocí kterého lze abstrahovat
		závislost na nějakém jiném konkrétním modulu. Platný modul musí obsahovat pole nezbytných součástí nebo
  pole příspěvků nebo obě tato pole.
		
     - Hodnota řetězce ID, např. "my_module", kde tato hodnota je jedinečným identifikátorem vašeho modulu. Uvedením
       této hodnoty v profilu modul zapnete.

     - Hodnota číselného řetězce verze, např. "1.0", kde tato hodnota je číslem verze vašeho modulu.

     - 1 až n objektů v poli schopností (capabilities), každý s řetězcem ID (id, povinné) a řetězcem hodnoty
       (value, povinné). Každá hodnota ID označuje identifikátor schopnosti, kterou tento modul vystavuje,
       a každá hodnota hodnoty označuje číslo verze této schopnosti:

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 1 až n objektů v poli nezbytných součástí (prereqs), každý s řetězcem ID (id, povinné). Každá hodnota ID
       označuje identifikátor modulu, který váš modul předpokládá:

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],

     - 1 až n objektů v poli příspěvků (contributions), každý s řetězcem typu "head", "config" nebo "menu"
       (type, povinné) a polem dílčích příspěvků (sub-contributions, povinné). Typ "head" znamená, že příspěvek prostředku přijde
       do záhlaví stránky. Typ "config" znamená, že příspěvek prostředku přijde do těla stránky.
       Typ "menu" znamená, že příspěvek prostředku bude tvořit součást kontextové nabídky na stránce:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 1 až n objektů v poli dílčích příspěvků (sub-contributions), každý s řetězcem typu (type, povinné)
         a polem identifikátorů URI (uris, povinné). Pokud je typ příspěvku "head", typ dílčího příspěvku musí být "css"
         nebo "js". Pokud je typ příspěvku "config", typ dílčího příspěvku musí být "js", "markup", "config_static"
         nebo "config_dynamic". Pokud je typ příspěvku "menu", typ dílčího příspěvku musí být "json":

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - 1 až n objektů v poli identifikátorů URI (uris), každý s řetězcem hodnoty (value, povinné),
           řetězcem třídy zařízení (deviceClass, volitelné), řetězcem typu (type, volitelné) a řetězcem
           jazyka (lang, volitelné). Řetězec hodnoty je cesta relativní vůči hlavní složce vašeho motivu ve
           WebDAV. Je-li zadána třída zařízení, znamená to, že prostředek bude obsažen pouze pro určité vyhovující
           typy zařízení. Hodnota třídy zařízení může být jednoduchá třída zařízení, např. "smartphone", nebo
           rovnice třídy zařízení, např. "smartphone+ios". Je-li zadán typ, má hodnotu "debug", "rtl" nebo
           "debug,rtl". Hodnota "debug" znamená, že prostředek bude obsažen pouze, pokud je zapnuto dálkové
           ladění a jeho cesta hodnoty obvykle vede k nekomprimované verzi prostředku. Hodnota "rtl" znamená, že
           prostředek bude obsažen pouze, pokud je národní prostředí uživatele obousměrné, jako např. hebrejština,
           ve kterém je text na stránce prezentován zprava doleva. Je-li zadán jazyk, znamená to, že bude
           prostředek obsažen pouze, pokud se národní prostředí uživatele shoduje se zadaným jazykem:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - 1 až n objektů v poli titulků (titles), každý s řetězcem hodnoty (value, povinné) a řetězcem jazyka
       (lang, povinné). Ty definují titulek nebo zobrazovaný název vašeho modulu, který se zobrazí v určitých
       částech portálu, jako např. v portletu Analyzátor motivů, v libovolném počtu jazyků:

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - 1 až n objektů v poli popisů (descriptions), každý s řetězcem hodnoty (value, povinné) a řetězcem jazyka
    (lang, povinné). Ty definují popis vašeho modulu, který se zobrazí v určitých částech portálu,
     jako např. v portletu Analyzátor motivů, v libovolném počtu jazyků:

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Kdykoli přidáte soubor do této složky 'contributions' nebo provedete změnu, musíte zrušit platnost
mezipaměti agregátoru prostředků, aby portál WebSphere Portal tyto změny načetl.
To provedete tak, že přejdete na volbu Administrace -> Analyzátor motivů -> Pomůcky -> Řídicí centrum.
Na stránce Řídicí centrum klepněte na odkaz v sekci 'Zrušit platnost mezipaměti'.

Po nadefinování nového modulu musíte tento modul zapnout přidáním do profilu.
Další pokyny k profilům naleznete v souboru readme.txt ve složce 'profiles'.

V případě chyb syntaxe v souboru .json nebo problémů s funkčností vašeho nového motivu použijte k zúžení
problému portlet Analyzátor motivů. Přejděte na volbu Administrace -> Analyzátor motivů -> Sestava ověření,
prověřte chybové a varovné zprávy a proveďte příslušná opatření.

Ještě více informací k syntaxi souboru .json naleznete také v dokumentaci na wikiwebu, kde je například k dispozici
soubor schématu .json, který ukazuje všechny možné syntaxe a který můžete spustit se svým souborem .json prostřednictvím
validátoru .json online k ověření správnosti syntaxe. 



Oversigt over temamoduler
*************************

Folderen 'contributions' i WebDAV kendes fra WebSphere Portal og bruges til at levere temamoduler
til ressourceaggregatorstrukturen. I denne folder er der en .json-fil pr. modul eller modulsæt.
Opret din egen .json-fil til dit eget modul eller modulsæt. Du kan kopiere, omdøbe og ændre en af
de eksisterende .json-filer for at se og lære den .json-syntaks, der kræves. 

Omfanget af temamoduler er begrænset til ét tema. Hvis du vil bruge nogle af de samme moduler i forskellige
temaer, skal du kopiere .json-filerne til moduldefinition fra det ene tema til det andet.

Bemærk, at der er en nemmere måde at oprette moduler på, nemlig vha. enkle moduler i folderen 'modules'.
Omfanget af begge er det ene tema. Syntaksen i .json for temamodulerne giver mulighed for at foretage mere
avancerede ting, end dem, du kan foretage med enkle moduler, f.eks.:

- erklæring af et versionsnummer for modulet
- brug af enhedsklasseligninger i modsætning til blot individuelle enhedsklasser
- erklæring af, at en prereq er valgfri
- brug af subbridragstyperne config_static og config_dynamic.

Men hvis du ikke har brug for de mere avancerede ting, vil du nok i de fleste tilfælde foretrække
at bruge enkle moduler. 

Der er flere oplysninger om enkle moduler i filen readme.txt i folderen 'modules'.

Bemærk også, at der er tredje metode til at oprette dine egne moduler, kaldet for globale moduler.
Her bruger du plugin.xml-filerne i folderen 'WEB-INF' i Enterprise-programmer (.ear-filer). Denne metode
er mest arbejdskrævende, så brug den kun, hvis du har gode grunde, f.eks. til et modul, der genbruges på
tværs af flere temaer, hvor du ikke vil duplikere moduldefinitionen i hvert af temaerne. Omfanget af globale
moduler, er, som navnet antyder, alle temaer. 
 
Hvis temamoduler er det rigtige valg til dine behov, følger her en oversigt over syntaksen i .json:
Bemærk: Denne beskrivelse har et matchende skema i bidrags/skemafolderen, som kan bruges med et værktøj
til skemavalidering til at kontrollere en bidragsfil i JSON-format.

- Et enkelt objekt med en modulmatrix (påkrævet). (Et objekt i .json-notation er {} og en matrix i
  .json-notation er []):

	{
		"modules": [
		]
	}
	
  - 1 til n objekter i modules-matrixen (moduler), hvert med en id-streng (påkrævet), en version-streng
    (valgfri), en capabilities-matrix (funktioner) (valgfri), en prereqs-matrix (forudsætninger) (valgfri),
    en contributions-matrix (bidrag) (påkrævet*), en titles-matrix (titler) (valgfri) og en descriptions-matrix
    (beskrivelser) (valgfri):

        "modules": [
			{
				"id":"mit_modul",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*Bemærk: Det er også gyldigt at have et modul, som kun består af en id og en prereqs-matrix plus de andre
		valgfrie medlemmer, men ingen bidrag. Det er et "metamodul", som kan bruges til at udtrække en afhængighed
		i et andet konkret modul. Et gyldigt modul skal have den ene eller begge forudsætninger og bidrag.
		
     - en strengværdi til id, f.eks. "mit_modul", hvor værdien er dit moduls entydige id. Denne værdi
       er det, der vises i en profil for at aktivere dit modul.

     - en numerisk strengværdi for version, f.eks. "1.0", hvor værdien er dit moduls versionsnummer.

     - 1 til n objekter i capabilities-matrixen (funktioner), hver med en id-streng (påkrævet)
       og en værdistreng (påkrævet). Hver id-værdi angiver id'en for den funktion, som modulet viser,
       og hver værdi angiver versionsnummeret for funktionen:
				"capabilities": [
					{
						"id":"min_funktion",
						"value":"1.0"
					}
				],

     - 1 til n objekter i prereqs-matrixen (forudsætninger), hver med en id-streng (påkrævet). Hver id-værdi angiver id'en
       for det modul, som dit modul kræver som forudsætning:

				"prereqs": [
					{
						"id":"mit_basismodul"
					}
				],

     - 1 til n objekter i contributions-matrixen (bidrag), hver med typestrengen "head", "config" eller "menu"
       (påkrævet) og en subbidragsmatrix (påkrævet). "head" betyder, at ressourcebidraget placeres i
       sidens toptekst. "config" betyder, at ressourcebidraget placeres i sideindholdet.
       "menu" betyder, at ressourcebidraget bliver en del af en kontekstmenu på siden:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 1 til n objekter i sub-contributions-matrixen (subbidrag), hver med en typestreng (påkrævet)
         og en uris-matrix array (påkrævet). Hvis bidragstypen er "head", skal subbidragstypen være "css" eller
         "js". Hvis bidragstypen er "config", skal subbidragstypen være "js", "markup", "config_static"
         eller "config_dynamic". Hvis bidragstypen er "menu", skal subbidragstypen være "json":

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - 1 til n objekter i uris-matrixen, hver med en værdistreng (påkrævet, en deviceClass-streng
           (valgfrit), en typestreng (valgfrit) og en lang-streng (valgfrit).
           Værdistrengen er en sti, der er relativ i forhold til temaets hovedfolder i WebDAV. Hvis
           deviceClass er angivet, betyder det, at ressourcen kun inkluderes ved visse enheder, der
           matcher. Værdien af deviceClass kan være en enkelt enhedsklasse, f.eks. "smartphone",
           eller en enhedsklasseligning, f.eks. "smartphone+ios". Hvis type er angivet, er det enten
           "debug", "rtl" eller "debug,rtl". "debug" betyder, at ressourcen kun inkluderes, hvis ekstern
           fejlfinding er aktiveret, og værdistien er normalt til den ukomprimerede version af
           ressourcen. "rtl" betyder, at ressourcen er kun inkluderet, hvis brugerens sprogkonvention er
           tovejs, f.eks. hebraisk, på den side, hvor teksten vises fra højre mod venstre. Hvis lang
           er angivet, betyder det, at ressourcen kun er inkluderet, hvis brugerens sprogkonvention
           matcher det angivne sprog:

								"uris": [
									{
										"value":"/css/min_css.css"
									},
									{
										"value":"/css/min_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/min_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/min_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/min_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/min_js_es.js",
										"lang":"es"
									}
								]
       
     - 1 til n objekter i titelmatrixen, hver med en værdistreng (påkrævet) og en sprogstreng
       (påkrævet). Disse strenge definerer titlen eller fremvisningsnavnet for dit modul, som det
       optræder i visse dele af Portal, f.eks. miniportalen Temaanalyse, på så mange forskellige
       sprog, som du har brug for:

				"titles": [
					{
						"value":"Mit_modul",
						"lang":"da"
					}
				],

     - 1 til n objekter i beskrivelsesmatrixen, hver med en værdistreng (påkrævet) og en sprogstreng
       (påkrævet). Disse definerer beskrivelsen af dit modul, som det bliver vist i visse dele af Portal
       f.eks. i miniportalen Temaanalyse, på så mange forskellige sprog, som du har brug for:
				"descriptions": [
					{
						"value":"Et modul, der leverer xyz-funktionalitet",
						"lang":"da"
					}
				]

Hver gang du tilføjer en fil til denne 'contributions'-folder eller foretager en ændring, skal du ugyldiggøre cachen til ressourceaggregatoren til WebSphere Portal for at hente ændringerne. Det kan du gøre ved at gå til Administration -> Temaanalyse -> Hjælpeprogrammer -> Kontrolcenter.
Klik på linket under 'Ugyldiggør cache' på siden i Kontrolcenter.

Når du har defineret det nye modul, skal du tilføje det til en profil for at aktivere det. Der er flere oplysninger om profiler i filen readme.txt i folderen 'profiles'. 

Hvis du har syntaksfejl i din. json-fil, eller du har problemer med at få dit nye modul til at fungere, skal du bruge miniportalen til Temaanalyse til at indsnævre problemet. Gå til Administration -> Temaanalyse -> Valideringsrapport, og undersøg og udfør handlinger på fejl- og advarselsmeddelelserne. 

Du kan også referere til wikidokumentationen for at få endnu flere oplysninger om .json-syntaksen. Der er f.eks. en .json-skemafil til rådighed, som viser alle de mulige syntakser, og du kan udføre din .json-fil online i en .json-valideringsfunktion for at kontrollere, at den er syntaktisk korrekt.



Überblick über Motivmodule (Deutsch)
**********************

Der Ordner "contributions" in WebDAV wurde von WebSphere Portal ordnungsgemäß definiert, um dem Ressourcen-Aggregator-Framework Motivmodule zur Verfügung zu stellen. In diesem Ordner befindet sich für jedes Modul oder jede Modulgruppe eine JSON-Datei - erstellen Sie für Ihr eigenes Modul oder Ihre eigene Modulgruppe eine gesonderte JSON-Datei. Sie können eine der bestehenden JSON-Dateien kopieren, umbenennen und ändern, um die erforderliche JSON-Syntax anzuzeigen und zu erlernen.

Motivmodule orientieren sich an einem bestimmten Motiv. Wenn Sie einige dieser Module in verschiedenen Motiven verwenden möchten, müssen Sie diese JSON-Dateien der Moduldefinition von einem Motiv in ein anderes kopieren.

Beachten Sie, dass es mithilfe des Ordners "modules" sogar noch einfacher ist, Module zu erstellen (so genannte einfache Module).
Beide orientieren sich an einem bestimmten Motiv. Die JSON-Syntax der Motivmodule ermöglicht einige erweiterte Funktionen, die mit einfachen Modulen nicht möglich sind. Beispiele:

- Angeben einer Versionsnummer für Ihr Modul
- Verwendung von Einheitenklassengleichungen im Gegensatz zu einzelnen Einheitenklassen
- Deklarieren einer optionalen Voraussetzung
- Verwendung der Unterbeitragstypen "config_static" und "config_dynamic".

Doch wenn Sie diese erweiterten Funktionen nicht benötigen, bevorzugen Sie möglicherweise die Verwendung einfacher Module.

Weitere Anweisungen zu einfachen Modulen finden Sie in der Datei readme.txt im Ordner "modules".

(Beachten Sie außerdem, dass es eine dritte Möglichkeit zum Erstellen Ihrer eigenen Module, so genannter globaler Module, gibt. Hierfür stehen Ihnen im Ordner "WEB-INF" innerhalb der Unternehmensanwendungen (EAR-Dateien) Dateien mit dem Namen plugin.xml zur Verfügung. Diese Methode ist mit dem größten Arbeitsaufwand verbunden, sodass Sie nur dann auf sie zurückgreifen werden, wenn Sie gute Gründe dafür haben. Beispielsweise bei einem Modul, das in vielen Motiven wiederverwendet wird und dessen Moduldefinition Sie nicht in jedem Motiv duplizieren möchten. Globale Module finden, wie der Name schon sagt, in allen Motiven Anwendung.)
 
Wenn Motivmodule die richtige Wahl für Ihre Anforderungen sind, finden Sie hier eine Zusammenfassung der JSON-Syntax:
(HINWEIS: Diese Beschreibung weist ein entsprechendes Schema im Ordner "contributions/schema" auf, das mithilfe eines Schemaprüfungstools zum Prüfen einer Beitragsdatei im JSON-Format verwendet werden kann).

- Ein einzelnes Objekt mit einer Feldgruppe "modules" (erforderlich). (In der JSON-Notation wird ein Objekt mit {} und eine Feldgruppe mit [] gekennzeichnet):

	{
		"modules": [
		]
	}
	
  - 1 bis n Objekte innerhalb der Feldgruppe "modules", jeweils mit der Zeichenfolge "id" (erforderlich), einer Feldgruppe "version" (optional), einer Feldgruppe "capabilities" (optional), einer Feldgruppe "prereqs" (optional), einer Feldgruppe "contributions" (erforderlich*), einer Feldgruppe "titles" (optional) und einer Feldgruppe "descriptions" (optional):

        "modules": [
			{
				"id":"mein_Modul",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*HINWEIS:  Es kann auch ein Modul vorliegen, das nur aus einer ID und einer Feldgruppe "prereqs" sowie weiteren optionalen Elementen besteht, doch keine Beiträge aufweist. Hierbei handelt es sich um ein "Metamodul", das zur Abstrahierung einer Abhängigkeit von einem anderen konkreten Modul verwendet wird. Ein gültiges Modul muss über Voraussetzungen (prereqs) und/oder Beiträge (contributions) verfügen. 		
     - Ein Zeichenfolgewert für "id" wie z. B. "mein_Modul", wobei der Wert der eindeutigen ID Ihres Moduls entsprechen muss. Diesen Wert listen Sie in einem Profil auf, um Ihr Modul einzuschalten.

     - Ein numerischer Zeichenfolgewert für die Version wie z. B. "1.0", wobei der Wert der Versionsnummer Ihres Moduls entspricht.
     - 1 bis n Objekte innerhalb der Feldgruppe "capabilities", jeweils mit der Zeichenfolge "id" (erforderlich) und der Zeichenfolge "value" (erforderlich). Jeder ID-Wert gibt die ID der Funktion an, die das Modul ausführt, und jeder Wert für die Zeichenfolge "value" gibt die Versionsnummer der Funktion an:

				"capabilities": [
					{
						"id":"meine_Funktion",
						"value":"1.0"
					}
				],

     - 1 bis n Objekte innerhalb der Feldgruppe "prereqs", jeweils mit der Zeichenfolge "id" (erforderlich). Jeder ID-Wert gibt die ID des Moduls an, das eine Voraussetzung für Ihr Modul ist:

				"prereqs": [
					{
						"id":"mein_Basismodul"
					}
				],

     - 1 bis n Objekte innerhalb der Feldgruppe "contributions", jeweils mit dem Wert "head", "config" oder "menu" (erforderlich) für die Zeichenfolge "type" und einer Feldgruppe "sub-contributions" (erforderlich). "head" bedeutet, dass der Ressourcenbeitrag in der Kopfzeile der Seite angezeigt wird. "config" bedeutet, dass der Ressourcenbeitrag im Hauptteil der Seite angezeigt wird.
       "menu" bedeutet, dass der Ressourcenbeitrag Teil eines Kontextmenüs auf der Seite ist:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],

       - 1 bis n Objekte innerhalb der Feldgruppe "sub-contributions", jeweils mit der Zeichenfolge "type" (erforderlich) und einer Feldgruppe "uris" (erforderlich). Wenn der Beitragstyp "head" lautet, muss der Unterbeitragstyp "css" oder "js" lauten. Wenn der Beitragstyp "config" lautet, muss der Unterbeitragstyp "js", "markup", "config_static" oder "config_dynamic" lauten. Wenn der Beitragstyp "menu" lautet, muss der Unterbeitragstyp "json" lauten:
						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]

         - 1 bis n Objekte innerhalb der Feldgruppe "uris", jeweils mit der Zeichenfolge "value" (erforderlich), der Zeichenfolge "deviceClass" (optional), der Zeichenfolge "type" (optional) und der Zeichenfolge "lang" (optional).
           Die Zeichenfolge "value" ist ein Pfad relativ zum Hauptordner Ihres Motivs in WebDAV. "deviceClass" bedeutet, sofern angegeben, dass die Ressource nur für bestimmte, übereinstimmende Einheiten berücksichtigt wird.
           Der Wert "deviceClass" kann eine einzelne Einheitenklasse sein wie "smartphone" oder eine Einheitenklassengleichung wie "smartphone+ios". Wenn "type" angegeben wurde, gilt einer der Werte "debug", "rtl" oder
           "debug,rtl". "debug" bedeutet, dass die Ressource nur berücksichtigt wird, wenn der ferne Fehlerbehebung aktiviert ist. Ihr Wertepfad zeigt in der Regel auf die dekomprimierte Version der Ressource. "rtl" bedeutet, dass die Ressource nur berücksichtigt wird, wenn die Ländereinstellung des Benutzers eine bidirektionale Eins ist, wie z. B. Hebräisch, und der Text auf der Seite von rechts nach links dargestellt wird. Wenn "lang" angegeben wurde, wird die Ressource nur berücksichtigt, wenn die Ländereinstellung des Benutzers mit der angegebenen Sprache übereinstimmt:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - 1 bis n Objekte innerhalb der Feldgruppe "titles", jeweils mit einer Wertzeichenfolge (erforderlich) und der Zeichenfolge "lang" (erforderlich). Diese definieren den Titel oder den Anzeigenamen Ihres Moduls wie er in bestimmten Teilen des Portals, z. B. im Portlet "Motivanalysefunktion", angezeigt wird - bei Bedarf auch in vielen verschiedenen Sprachen:
				"titles": [
					{
						"value":"Mein Modul",
						"lang":"en"
					}
				],

     - 1 bis n Objekte innerhalb der Feldgruppe "descriptions", jeweils mit der Zeichenfolge "value" (erforderlich) und der Zeichenfolge "lang" (erforderlich). Diese definieren die Beschreibung Ihres Moduls wie es in bestimmten Teilen des Portals z. B. im Portlet "Motivanalysefunktion" angezeigt wird - bei Bedarf auch in vielen verschiedenen Sprachen:

				"descriptions": [
					{
						"value":"Ein Modul, das die Funktion xyz bereitstellt",
						"lang":"en"
					}
				]

Immer wenn Sie eine Datei in den Ordner "contributions" einfügen oder eine Änderung vornehmen, müssen Sie den Cachespeicher des Ressourcenaggregators für WebSphere Portal inaktivieren, um die Änderungen zu übernehmen.
Wählen Sie hierfür "Verwaltung -> Motivanalysefunktion -> Dienstprogramme -> Steuerzentrale" aus.
Klicken Sie auf der Seite "Steuerzentrale" auf den Link unter "Cachespeicher inaktivieren".

Sobald Sie Ihr neues Modul definiert haben, müssen Sie es einem Profil hinzufügen, um es zu aktivieren.
Weitere Informationen zu Profilen finden Sie in der Datei readme.txt im Ordner "profiles".

Wenn Ihre JSON-Datei Syntaxfehler enthält oder wenn Sie Ihr neues Modul nicht aktivieren können, grenzen Sie das Problem mithilfe des Portlets "Motivanalysefunktion" ein. Wählen Sie "Verwaltung -> Motivanalysefunktion -> Prüfbericht" aus, um nach Fehlernachrichten und  Warnhinweisen zu suchen und entsprechende Maßnahmen zu ergreifen.

Die Wiki-Dokumentation enthält weiterführende Informationen zur JSON-Syntax. Beispielsweise gibt es eine JSON-Schemadatei, die jede mögliche Syntax enthält und die Sie mit Ihrer JSON-Datei über ein JSON-Prüfprogramm ausführen können, um sicherzustellen, dass die Syntax korrekt ist. 



Συνοπτική παρουσίαση λειτουργικών μονάδων θέματος (Ελληνικά)
*************************************************

Αυτός ο φάκελος 'contributions' στο WebDAV είναι ένας φάκελος που ορίζεται από το WebSphere Portal για
την παροχή λειτουργικών μονάδων θέματος στο πλαίσιο συγκρότησης πόρων (resource aggregator framework). Σε
αυτόν το φάκελο υπάρχει ένα  αρχείο .json για κάθε λειτουργική μονάδα ή σύνολο λειτουργικών μονάδων και
μπορείτε να δημιουργήσετε δικά σας αρχεία .json για τις δικές σας λειτουργικές μονάδες και τα δικά σας
σύνολα λειτουργικών μονάδων. Μπορείτε να αντιγράψετε, να μετονομάσετε και να τροποποιήσετε ένα από τα
υπάρχοντα αρχεία .json για να μάθετε την απαιτούμενη σύνταξη των αρχείων json.

Οι λειτουργικές μονάδες θέματος χρησιμοποιούνται μόνο σε ένα θέμα. Αν θέλετε να χρησιμοποιήσετε κάποιες από
αυτές σε διαφορετικά θέματα, πρέπει να αντιγράψετε τα αρχεία .json που περιέχουν τον ορισμό των λειτουργικών
μονάδων από το ένα θέμα στο άλλο.

Υπάρχει ένας ευκολότερος τρόπος για τη δημιουργία λειτουργικών μονάδων, που ονομάζονται απλές λειτουργικές
μονάδες, χρησιμοποιώντας το φάκελο 'modules'. Και τα δύο είδη χρησιμοποιούνται μόνο σε ένα θέμα. Η σύνταξη
json που χρησιμοποιείται στις λειτουργικές μονάδες θέματος παρέχει κάποιες πρόσθετες δυνατότητες που δεν
υπάρχουν στις απλές λειτουργικές μονάδες, όπως:

- δήλωση αριθμού εκδοχής για τη λειτουργική μονάδα
- χρήση συνδυασμών κλάσεων συσκευών αντί για μεμονωμένες κλάσεις συσκευών
- δήλωση ενός προαπαιτούμενου ως προαιρετικού
- χρήση των ειδών υποσυνεισφορών config_static και config_dynamic.

Ωστόσο, αν δεν χρειάζεστε αυτές τις πρόσθετες δυνατότητες, στις περισσότερες περιπτώσεις θα προτιμήσετε
να χρησιμοποιήσετε απλές λειτουργικές μονάδες.

Για περισσότερες οδηγίες σχετικά με τις απλές λειτουργικές μονάδες, διαβάστε το αρχείο readme.txt
στο φάκελο 'modules'.

(Υπάρχει επίσης ένας τρίτος τρόπος για τη δημιουργία δικών σας λειτουργικών μονάδων, που αναφέρονται ως
γενικές λειτουργικές μονάδες, μέσω αρχείων plugin.xml στο φάκελο 'WEB-INF' των επιχειρηματικών εφαρμογών
(.ear). Αυτός ο τρόπος είναι πιο πολύπλοκος, συνεπώς δεν χρειάζεται να τον χρησιμοποιήσετε εκτός αν υπάρχει
συγκεκριμένος λόγος, π.χ. αν κάποια λειτουργική μονάδα χρησιμοποιείται σε πολλά θέματα και δεν θέλετε να
αντιγράψετε τον ορισμό της σε κάθε ένα από τα θέματα. Οι γενικές λειτουργικές μονάδες, όπως φαίνεται από
το όνομά τους, χρησιμοποιούνται σε όλα τα θέματα.)
 
Αν οι λειτουργικές μονάδες είναι κατάλληλες για τις ανάγκες σας, διαβάστε την παρακάτω περίληψη της σύνταξης .json:
(ΣΗΜΕΙΩΣΗ: Αυτή η περιγραφή έχει ένα αντίστοιχο σχήμα στο φάκελο contributions/schema, το οποίο μπορεί να
χρησιμοποιηθεί με ένα εργαλείο επικύρωσης σχήματος για την επαλήθευση της μορφής JSON ενός αρχείου συνεισφοράς).

- Ένα μεμονωμένο αντικείμενο με έναν πίνακα modulesν (απαιτείται). (Το αντικείμενο στην json αναπαρίσταται
  με {} και ο πίνακας με []):

	{
		"modules": [
		]
	}
	
  - 1 έως n αντικείμενα στον πίνακα modules, κάθε ένα από τα οποία περιέχει μια σειρά χαρακτήρων
    id (απαιτείται), μια σειρά χαρακτήρων version (προαιρετικά), έναν πίνακα capabilities (προαιρετικά),
    έναν πίνακα prereqs (προαιρετικά), έναν πίνακα contributions (απαιτείται*), έναν πίνακα titles
    (προαιρετικά) και έναν πίνακα descriptions (προαιρετικά):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*ΣΗΜΕΙΩΣΗ: Μια λειτουργική μονάδα μπορεί επίσης να αποτελείται μόνο από μια ταυτότητα και έναν πίνακα
  prereqs, και από άλλα προαιρετικά μέλη, αλλά χωρίς πίνακα contributions. Αυτή είναι μια
  "μετα-λειτουργική μονάδα" που μπορεί να χρησιμοποιηθεί για την περιγραφή μιας εξάρτησης από μια άλλη
		συγκεκριμένη λειτουργική μονάδα. Μια έγκυρη λειτουργική μονάδα πρέπει να έχει έναν ή και τους δύο από
  τους πίνακες prereqs και contributions.
		
     - μια τιμή σειράς χαρακτήρων για το id, π.χ. "my_module", η οποία είναι η μοναδική ταυτότητα της
       λειτουργικής μονάδας σας. Αυτή η τιμή προστίθεται σε ένα προφίλ για την ενεργοποίηση της λειτουργικής
       μονάδας.

     - μια τιμή αριθμητικής σειράς χαρακτήρων για το version, π.χ. "1.0", η οποία είναι ο αριθμός εκδοχής
       της λειτουργικής μονάδας σας.

     - 1 έως n αντικείμενα στον πίνακα capabilities, κάθε ένα από τα οποία περιέχει μια σειρά χαρακτήρων
       id (απαιτείται) και μια σειρά χαρακτήρων value (απαιτείται). Κάθε τιμή id δηλώνει την ταυτότητα της
       δυνατότητας που εκθέτει αυτή η λειτουργική μονάδα, και κάθε τιμή value δηλώνει τον αριθμό εκδοχής
       της δυνατότητας:

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 1 έως n αντικείμενα στον πίνακα prereqs, κάθε ένα από τα οποία περιέχει μια σειρά χαρακτήρων
       id (απαιτείται). Κάθε τιμή id δηλώνει την ταυτότητα της λειτουργικής μονάδας που είναι προαπαιτούμενη
       για αυτή τη λειτουργική μονάδα:

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - 1 έως n αντικείμενα στον πίνακα contributions, κάθε ένα από τα οποία περιέχει μια σειρά χαρακτήρων
       type με τιμή "head", "config" ή "menu" (απαιτείται) και έναν πίνακα sub-contributions (απαιτείται). 
       Η τιμή "head" σημαίνει ότι η συνεισφορά πόρου θα τοποθετηθεί στην κορυφή της σελίδας. Η τιμή "config"
       σημαίνει ότι η συνεισφορά πόρου θα τοποθετηθεί στο κυρίως κείμενο της σελίδας. Η τιμή "menu" σημαίνει
       ότι η συνεισφορά πόρου θα τοποθετηθεί σε ένα μενού περιβάλλοντος στη σελίδα:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 1 έως n αντικείμενα στον πίνακα sub-contributions, κάθε ένα από τα οποία περιέχει μια σειρά χαρακτήρων
         type (απαιτείται) και έναν πίνακα uris (απαιτείται). Αν το είδος συνεισφοράς είναι "head", το
         είδος υπσυνεισφοράς πρέπει να είναι "css" ή "js". Αν το είδος συνεισφοράς είναι "config", το
         είδος υπσυνεισφοράς πρέπει να είναι "js", "markup", "config_static" ή "config_dynamic". Αν το
         είδος συνεισφοράς είναι "menu", το είδος υπσυνεισφοράς πρέπει να είναι "json":

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - 1 έως n αντικείμενα στον πίνακα uris, κάθε ένα από τα οποία περιέχει μια σειρά χαρακτήρων
           value (απαιτείται), μια σειρά χαρακτήρων deviceClass (προαιρετικά), μια σειρά χαρακτήρων
           type (προαιρετικά) και μια σειρά χαρακτήρων lang (προαιρετικά). Η σειρά χαρακτήρων value είναι
           μια διαδρομή σχετική με τον κύριο φάκελο του θέματος στο WebDAV. Η τιμή deviceClass, αν ορίζεται,
           σημαίνει ότι ο πόρος θα συμπεριλαμβάνεται μόνο για συγκεκριμένες συσκευές που συμφωνούν.
           Η τιμή deviceClass μπορεί να είναι μια συγκεκριμένη κλάση συσκευών, όπως "smartphone", ή ένας
           συνδυασμός κλάσεων συσκευών, όπως "smartphone+ios". Η τιμή type, αν ορίζεται, μπορεί να είναι
           "debug", "rtl" ή "debug,rtl". Η τιμή "debug" σημαίνει ότι ο πόρος συμπεριλαμβάνεται μόνο αν έχει
           ενεργοποιηθεί ο απομακρυσμένος εντοπισμός σφαλμάτων και η διαδρομή συνήθως παραπέμπει στη μη
           συμπιεσμένη εκδοχή του πόρου. Η τιμή "rtl" σημαίνει ότι ο πόρος συμπεριλαμβάνεται μόνο αν
           η γλώσσα που χρησιμοποιεί ο χρήστης είναι διπλής κατεύθυνσης, όπως τα Εβραϊκά, όπου το κείμενο
           εμφανίζεται στην οθόνη από τα δεξιά προς τα αριστερά. Η τιμή lang, αν ορίζεται, σημαίνει ότι ο
           πόρος συμπεριλαμβάνεται μόνο αν ο χρήστης χρησιμοποιεί την καθορισμένη γλώσσα:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - 1 έως n αντικείμενα στον πίνακα titles, κάθε ένα από τα οποία περιέχει μια σειρά χαρακτήρων value
       (απαιτείται) και μια σειρά χαρακτήρων lang (απαιτείται). Αυτές ορίζουν τον τίτλο ή το εμφανιζόμενο
       όνομα της λειτουργικής μονάδας σας όπως θα εμφανίζεται σε ορισμένα τμήματα του Portal, π.χ. στη
       μικροεφαρμογή πύλης Λειτουργία ανάλυσης θεμάτων, σε όσες γλώσσες απαιτείται:

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - 1 έως n αντικείμενα στον πίνακα descriptions, κάθε ένα από τα οποία περιέχει μια σειρά χαρακτήρων value
       (απαιτείται) και μια σειρά χαρακτήρων lang (απαιτείται). Αυτές ορίζουν την περιγραφή της λειτουργικής
       μονάδας σας όπως θα εμφανίζεται σε ορισμένα τμήματα του Portal, π.χ. στη μικροεφαρμογή πύλης Λειτουργία
       ανάλυσης θεμάτων, σε όσες γλώσσες απαιτείται:

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Κάθε φορά που προσθέτετε ένα αρχείο σε αυτόν το φάκελο 'contributions' ή κάνετε μια αλλαγή, θα πρέπει να
ακυρώνετε τη λανθάνουσα μνήμη της λειτουργίας συγκρότησης πόρων προκειμένου το WebSphere Portal να εφαρμόσει
τις αλλαγές. Για το σκοπό αυτό, επιλέξτε Διαχείριση -> Λειτουργία ανάλυσης θεμάτων -> Βοηθήματα -> Κέντρο ελέγχου.
Στη σελίδα Κέντρο ελέγχου, πατήστε στη διασύνδεση στην ενότητα 'Ακύρωση λανθάνουσας μνήμης'.

Αφού δημιουργήσετε τη νέα λειτουργική μονάδα, πρέπει να την προσθέσετε σε ένα προφίλ για να την ενεργοποιήσετε.
Για περισσότερες οδηγίες σχετικά με τα προφίλ, διαβάστε το αρχείο readme.txt στο φάκελο 'profiles'.

Αν υπάρχουν συντακτικά σφάλματα στο αρχείο .json ή προβλήματα με την ενεργοποίηση της λειτουργικής μονάδας,
χρησιμοποιήστε τη μικροεφαρμογή πύλης Λειτουργία ανάλυσης θεμάτων για να εντοπίσετε το πρόβλημα. Επιλέξτε
Διαχείριση -> Λειτουργία ανάλυσης θεμάτων -> Αναφορά επικύρωσης, εξετάστε τα μηνύματα σφάλματος και
προειδοποίησης και εκτελέστε τις προτεινόμενες ενέργειες.

Επίσης, μπορείτε να ανατρέξετε στην τεκμηρίωση wiki για περισσότερες πληροφορίες σχετικά με τη σύνταξη των
αρχείων .json. Υπάρχει διαθέσιμο ένα αρχείο .json σχήματος το οποίο εμφανίζει όλες τις πιθανές μορφές σύνταξης.
Μπορείτε επίσης να ελέγξετε το αρχείο .json σας με ένα ηλεκτρονικό εργαλείο επικύρωσης για να επαληθεύσετε
ότι η σύνταξή του είναι σωστή. 



Visión general de los módulos de tema
*************************************

Esta carpeta 'contributions' situada en WebDAV es una carpeta que establece WebSphere Portal para ofrecer módulos de tema a
la infraestructura del agregador de recursos. Dentro de esta carpeta hay un archivo .json por módulo o conjunto de módulos - cree su propio archivo .json para su propio módulo o conjunto de módulos. Puede copiar, cambiar el
nombre y modificar uno de los archivos .json existentes para ver la sintaxis de .json que hay que utilizar.

Estos módulos se limitan a un tema. Si desea utilizar algunos de estos mismos módulos en distintos temas, tiene que copiar estos
archivos .json de definición del módulo de un tema a otro.

Tenga en cuenta que hay un forma más fácil de crear módulos, denominados módulos simples, utilizando la carpeta 'modules'.
Ambos se limitan a un tema. La sintaxis de .json de los módulos permite utilizar algunas funciones más avanzadas que no puede
realizar con los módulos simples, como:

- declarar un número de versión para el módulo
- utilizar ecuaciones de clase de dispositivo en lugar de solo clases de dispositivo individuales
- declarar que un requisito previo es opcional
- utilizar los tipos de subcontribución config_static y config_dynamic.

Pero, si no necesita estas funciones más avanzadas, en la mayoría de los casos lo más probable es que prefiera utilizar módulos simples.

Para ver más instrucciones sobre los módulos simples, consulte el archivo readme.txt de la carpeta 'modules'.

(Tenga también en cuenta que hay una tercera forma de crear sus propios módulos, a los que se denomina módulos globales, mediante los archivos plugin.xml de la carpeta 'WEB-INF' de las aplicaciones empresariales (archivos .ear). Este sistema es el que requiere más trabajo, por lo que no deseará utilizarlo a no ser que tenga un buen motivo, como por ejemplo en el caso de un módulo que se reutiliza en varios temas y no desea duplicar la definición del módulo en cada uno de los temas. Los módulos globales, tal como sugiere el nombre, se adaptan a todos los temas.)
 
Si los módulos de tema es la opción adecuada para sus necesidades, consulte el resumen de la sintaxis de .json que se muestra a continuación: (NOTA: Esta descripción tiene un esquema correspondiente en la carpeta de contribuciones/esquema, que se puede utilizar como herramienta de validación de esquema para verificar el archivo de contribución con formato JSON).

- Un único objeto con una matriz de módulos (obligatorio). (Un objeto en notación .json es {} y una matriz en notación .json es []):

	{
		"modules": [
		]
	}
	
  - 1 a n objetos dentro de la matriz de módulos, cada uno con una serie de ID (obligatorio), una serie de versión (opcional), una matriz de posibilidades (opcional), un matriz de requisitos previos (opcional), una matriz de contribuciones (obligatorio*), una matriz de títulos (opcional) y una matriz de descripciones (opcional):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*NOTA: También es válido tener un módulo consistente únicamente en un ID y una matriz de requisitos previos, además de los otros miembros opcionales, pero sin contribuciones.  Esto se denomina un "metamódulo" y se puede utilizar para obtener una dependencia sobre algún otro módulo concreto.  Un módulo válida debe tener requisitos previos o contribuciones, o ambos.
		
     - un valor de serie para el ID, como por ejemplo "my_module", donde el valor es el ID exclusivo del módulo. Este valor es el que        aparecerá en un perfil para activar el módulo.
       
     - un valor de serie numérica para la versión, como por ejemplo "1.0", donde el valor es el número de versión del módulo.
       
     - 1 a n objetos dentro de la matriz de posibilidades, cada uno con una serie de ID (obligatorio) y una serie de valor (obligatorio). Cada valor        de ID indica el ID de la posibilidad que muestra este módulo, y cada valor de valor indica el número de versión de        esta posibilidad:
       
				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 1 a n objetos dentro de la matriz de requisitos previos, cada uno con una serie de ID (obligatorio). Cada valor de ID indica el ID del     módulo que constituye un requisito previo para el módulo:
       
				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - 1 a n objetos dentro de la matriz de contribuciones, cada uno con una serie de tipo que puede ser "head", "config" o "menu" (obligatorio)        y una matriz de subcontribuciones (obligatorio). "head" significa que la contribución del recurso irá en la cabecera de la        página. "config" significa que la contribución del recurso irá en el cuerpo de la página.
       "menu" indica que la contribución del recurso formará parte de un menú contextual en la página:
       
				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 1 a n objetos dentro de la matriz de subcontribuciones, cada uno con una serie de tipo (obligatorio) y una matriz de URI (obligatorio). Si el tipo de contribución "head", el tipo de subcontribución debe ser "css" o "js". Si el tipo de contribución es "config", el tipo de subcontribución debe ser "js", "markup", "config_static" o "config_dynamic". Si tipo de contribución es "menu", el tipo de subcontribución debe ser "json":
       
						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - 1 a n objetos dentro de la matriz de URI, cada uno con una serie de valor (obligatorio), una serie deviceClass (opcional), una serie de tipo (opcional) y una serie lang (opcional).
           La serie de valor es una vía de acceso relativa a la carpeta principal del tema en WebDAV. deviceClass, si se especifica, significa que el recurso sólo se incluirá para determinados dispositivos que coincidan.
           El valor de deviceClass puede ser una sola clase de dispositivo, como "smartphone", o una ecuación de clases de dispositivo, como "smartphone+ios". El tipo, si se especifica, puede ser "debug", "rtl" o
           "debug,rtl". "debug" significa que el recurso sólo se incluye si la depuración remota está activa, y el valor de vía de acceso suele ser a la versión no comprimida del recurso. "rtl" significa que el recurso sólo se incluye si el entorno local del usuario es bidireccional, como por ejemplo el hebreo, donde texto de la página se presenta de derecha a izquierda. lang, si se especifica, significa que el recurso sólo se incluye si el entorno local del usuario coincide con el valor lang especificado:
       
								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - 1 a n objetos dentro de la matriz de títulos, cada uno con una serie de valor (obligatorio) y una serie lang (obligatorio). Estos valores definen el título o nombre de visualización del módulo, tal y como aparecerá en determinadas partes del portal, como el portlet Analizador de temas, en todos los idiomas que necesite:
       
				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - 1 a n objetos dentro de la matriz de descripciones, cada uno con una serie de valor (obligatorio) y una serie lang (obligatorio). Estos valores definen la descripción del módulo, tal y como aparecerá en determinadas partes del portal, como el portlet Analizador de temas, en todos los idiomas que necesite:
       
				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Cada vez que añada un archivo a esta carpeta 'contributions' o realice un cambio, debe invalidar la memoria caché del agregador de recursos para que WebSphere Portal adopte los cambios.
Para ello vaya a Administración -> Analizador de temas -> Programas de utilidad -> Centro de control.
En la página Centro de control, pulse el enlace que hay bajo 'Invalidar memoria caché'.

Cuando haya definido el módulo nuevo, deberá añadirlo a un perfil para activarlo. 
Para ver más instrucciones sobre los perfiles, consulte el archivo readme.txt de la carpeta 'profiles'.

Si tiene algún error de sintaxis en el archivo .json o si tiene problemas para que el nuevo módulo funcione, utilice el portlet Analizador de temas para localizar el problema. Vaya a Administración -> Analizador de temas -> Informe de validación, examine los mensajes de error y de aviso y emprenda la acción adecuada.

También puede consultar la documentación de la wiki para obtener más información sobre la sintaxis del archivo .json; encontrará un archivo de esquema .json que muestra todas las sintaxis posibles y que puede ejecutar con el archivo .json mediante un validador de .json en línea para verificar que es sintácticamente correcto. 



Teemamoduulien yleiskuvaus
**********************

Tätä WebDAV-ohjelman Lisäykset-kansiota käytetään WebSphere-portaalissa määritettäessä
resurssikoostimessa käytettäviä teemamoduuleja. Tässä kansiossa on yksi .json-tiedosto jokaista moduulia tai moduulijoukkoa kohti.
Luo oma .json-tiedoston omalle moduulillesi tai moduulijoukolle.Voit kopioida,
nimetä uudelleen ja muokata aiemmin luotuja .json-tiedostoja ja niistä näet myös .json-tiedostojen syntaksin.

Teemamoduulit rajataan yhteen teemaasi. Jos haluat käyttää jotakin näistä moduuleista toisessa teemassa,
sinun täytyy kopioida moduulien .json-määritystiedostot toiseen teemaan.

Huomaa, että helpoin tapa luoda moduuleita on käyttää Moduulit-kansiota yksinkertaisten moduulien luomiseen.
Myös yksinkertaiset moduulit rajataan yhteen teemaasi. Teemamoduulien .json-syntaksi sallii teemamoduulien (mutta ei yksinkertaisten
moduulien) käyttämisen seuraavilla tavoilla:

- voit antaa moduulille versionumeron
- voit käyttää laiteluokkakaavoja yksittäisten laiteluokkien sijasta
- voit määrittää edellytyksen valinnaiseksi
- voit käyttää alilisäystyyppejä config_static ja onfig_dynamic.

Jos et tarvitse näitä lisätoimintoja, useimmissa tapauksissa yksinkertaiset moduulit ovat täysin
riittäviä.

Lisätietoja yksinkertaisista moduuleista on Moduulit-kansion readme-tiedostossa.

(Huomaa, että järjestelmässä on kolmaskin tapa luoda omia moduuleja: voit luoda yleisiä moduuleja plugin.xml-tiedostoilla
yrityssovelluksien (.ear) WEB-INF-kansiossa. Tämä tapa vaatii eniten toimenpiteitä, joten
sen käyttämistä suositellaan vain erityistapauksissa, kuten moduuleissa, joita käytetään useassa eri
teemassa ja jota ei haluta kopioida kaksoiskappaleena erikseen jokaisen teeman moduulimääritykseen. Yleisiä moduuleja voidaan
nimensä mukaisesti käyttää kaikissa teemoissa.)
 
Teemamoduulien .json-syntaksi on kuvattu alla:
(HUOMAUTUS:  vastaava skeema on myös Lisäykset/skeema-kansiossa, jota voidaan käyttää
skeematarkistustyökalussa tarkistettaessa JSON-muotoista lisäystiedostoa).

- yksittäinen objekti, jossa on moduulimatriisi (pakollinen). (Objekti .json-merkinnässä on {} ja matriisi
  .json-merkinnässä on []):

	{
		"modules": [
		]
	}
	
  - 1 - n objektia moduulimatriisissa; jokaisessa täytyy olla tunnusmerkkijono (pakollinen), versiomerkkijono (valinnainen),
    ominaisuusmatriisi (valinnainen), edellytysmatriisi (valinnainen), lisäysmatriisi (pakollinen*),
    otsikkomatriisi (valinnainen) ja kuvausmatriisi (valinnainen):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*HUOMAUTUS:  Kelvollinen moduuli voi koostua myös tunnus- ja edellytysmatriiseista sekä muista
		valinnaisista osista, mutta ei lisäyksistä.  Tällaista "metamoduulia" voidaan käyttää muissa moduuleissa
		riippuvuussuhteiden abstraktiona.  Kelvollisessa moduulissa täytyy olla vähintään edellytys- tai lisäysmatriisi tai molemmat.
		
     - tunnusmerkkijono, kuten "my_module", jonka arvo on moduulin yksilöllinen tunnus. Tämä arvo
       lisätään profiiliin ja sitä käytetään moduulin käynnistämiseen.

     - versiomerkkijono, kuten "1.0", jonka arvo on moduulin versionumero.

     - 1 - n objektia ominaisuusmatriisissa; jokaisella on tunnusmerkkijono (pakollinen)
       ja arvomerkkijono (pakollinen). Jokainen tunnusarvo ilmaisee tämän moduulin ominaisuuden tunnuksen
       ja ominaisuuden versionumeron:

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 1 - n objektia edellytysmatriisissa; jokaisessa täytyy olla tunnusmerkkijono (pakollinen). Jokainen tunnusarvo ilmaisee
       edellytyksenä olevan moduulin tunnuksen:

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - 1 - n objektia lisäysmatriisissa; jokaisessa täytyy olla tyyppimerkkijono "head", "config" tai "menu"
       (pakollinen) ja alilisäysmatriisi (pakollinen). "head" on sivun otsikkoon tuleva resurssilisäys.
       "config" on sivun tekstiosaan tuleva resurssilisäys.
       "menu" on resurssilisäys, joka näkyy sivun pikavalikossa:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 1 - n objektia alilisäysmatriisissa; jokaisessa täytyy olla tyyppimerkkijono (pakollinen)
         ja uris-matriisi (pakollinen). Jos lisäystyyppi on "head", alilisäyksen tyypin täytyy olla "css" tai
         "js". Jos lisäystyyppi on "config", alilisäyksen tyypin täytyy olla "js", "markup", "config_static"
         tai "config_dynamic". Jos lisäystyyppi on "menu", alilisäyksen tyypin täytyy olla "json":

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - 1 - n objektia uris-matriisissa; jokaisessa täytyy olla arvomerkkijono (pakollinen),
           laiteluokan merkkijono (valinnainen), tyyppimerkkijono (valinnainen) ja kielimerkkijono (valinnainen).
           Arvomerkkijonon polku on suhteessa teeman WebDAV-pääkansioon. Laiteluokka,
           jos määritetty, tarkoittaa, että resurssi sisältyy vain tiettyihin arvoa vastaaviin laitteisiin.
           Laiteluokka voi olla yksittäisen laitteen luokka, kuten "smartphone", tai laiteluokkakaava,
           kuten "smartphone+ios". Tyyppiarvo, jos määritetty, on "debug", "rtl" tai
           "debug,rtl". "debug" ilmaisee, että resurssi otetaan mukaan vain, jos etävianmääritys on käytössä, ja sen
           arvon polku viittaa yleensä resurssin tiivistämättömään versioon. "rtl" ilmaisee, että resurssi
           otetaan mukaan vain, jos käyttäjän kieli on kaksisuuntainen, kuten heprea, ts. sivun teksti
           luetaan oikealta vasemmalle. lang, jos määritetty, tarkoittaa, että resurssi otetaan mukaan
           vain, jos käyttäjän kieli vastaa määritettyä arvoa:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - 1 - n objektia otsikkomatriisissa; jokaisessa täytyy olla arvomerkkijono (pakollinen) ja kielimerkkijono
       (pakollinen). Nämä arvot määrittävät moduulin otsikon tai näyttönimen, joka näkyy tietyissä
       portaalin osissa, kuten teeman analysointitoimintojen portaalisovelmassa, määrittämilläsi
       kielillä:

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - 1 - n objektia kuvausmatriisissa; jokaisessa täytyy olla arvomerkkijono (pakollinen) ja kielimerkkijono
       (pakollinen). Nämä arvot määrittävät moduulin kuvauksen, joka näkyy tietyissä
       portaalin osissa, kuten teeman analysointitoimintojen portaalisovelmassa, määrittämilläsi
       kielillä:

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Muista, että aina kun lisäät tiedoston Lisäykset-kansioon tai teet muutoksia tietoihin, sinun täytyy mitätöidä
resurssikoostimen välimuisti, jotta WebSphere-portaali ottaa muutokset käyttöön.
Voit tehdä tämän valitsemalla Hallinta -> Teeman analysointitoiminnot -> Apuohjelmat -> Ohjaustoiminnot.
Valitse Ohjaustoiminnot-sivulla linkki kohdassa Mitätöi välimuisti.

Kun olet määrittänyt uuden moduulin, se on lisättävä profiilin, jotta se tulee käyttöön.
Lisätietoja profiileista on Profiilit-kansion readme-tiedostossa.

Jos .json-tiedostossa on syntaksivirheitä tai et saa uutta moduulia toimimaan, voit tehdä vianmäärityksen
teeman analysointitoimintojen portaalisovelmassa. Valitse Hallinta -> Teeman analysointitoiminto -> Tarkistusraportti.
Tarkista virhesanomat ja varoitukset. Suorita tarvittavat korjaukset.

Wikiohjeessa on lisätietoja .json-syntaksista, ja käytettävissä on muun muassa
.json-skeematiedosto, joka näyttää kaikki mahdolliset syntaksit ja jonka voi suorittaa .json-tiedostossa
.json-online-tarkistustyökalussa, kun haluat tarkistaa onko tiedoston syntaksi määritetty oikein. 



Présentation des modules de thème
**********************

Le dossier 'contributions' dans WebDAV est un dossier bien défini par WebSphere Portal pour fournir des modules de thème au framework de l'agrégateur de ressources. Ce dossier contient un fichier .json par module ou ensemble de modules - créez votre propre fichier .json pour votre module ou ensemble de modules. Vous pouvez copier, renommer et modifier l'un des fichiers .json existants pour connaître et apprendre la syntaxe .json nécessaire.

Ces modules sont uniquement utilisés avec votre thème. Si vous souhaitez utiliser certains de ces modules dans d'autres thèmes, vous devez copier ces fichiers .json de définition de module d'un thème à l'autre.

Notez qu'il existe une manière encore plus simple pour créer des modules, appelés modules simples, à l'aide du dossier 'modules'. Les deux types de module sont uniquement utilisés avec votre thème. La syntaxe .json des modules de thème permet des opérations plus avancées que vous ne pouvez pas exécuter avec des modules simples, telles que :

- déclarer un numéro de version pour votre module,
- utiliser des équations de classe d'appareil par opposition à de simples classes d'appareil individuelles,
- déclarer qu'un prérequis est facultatif,
- utiliser des types de sous-contribution config_static et config_dynamic.

Mais, si vous n'avez pas besoin de ces opérations plus avancées, dans la plupart des cas, vous utiliserez probablement des modules simples.

Pour des instructions complémentaires sur les modules simples, lisez le fichier readme.txt situé dans le dossier 'modules'.

(Notez également qu'il existe une troisième méthode pour créer vos propres modules, appelés modules globaux, via des fichiers plugin.xml du dossier 'WEB-INF', situé dans des applications d'entreprise (fichiers .ear). Cette méthode implique beaucoup de travail, de sorte qu'il est préférable de ne pas l'appliquer, excepté si vous avez une bonne raison pour cela, par exemple pour un module qui est réutilisé dans plusieurs thèmes et si vous ne voulez pas dupliquer la définition du module dans chacun des thèmes. Les modules globaux, comme leur nom l'indique, peuvent être utilisés sur tous les thèmes.)
 
Si les modules de thème constituent la meilleure solution pour vos besoins, un résumé de la syntaxe .json est le suivant : (REMARQUE : cette description possède un schéma correspondant dans le dossier 'contributions/schema', qui peut être utilisé avec un outil de validation de schéma pour vérifier un fichier de contribution de format JSON).

- Un seul objet avec un tableau de modules (obligatoire). (Un objet en notation .json est {} et un tableau en notation .json est []) :

	{
		"modules": [
		]
	}
	
  - 1 à n objets dans le tableau de modules, chacun avec une chaîne ID (obligatoire), une chaîne de version (facultative), un tableau de fonctions (facultatif), un tableau de prérequis (facultatif), un tableau de contributions (obligatoire*), un tableau de titres (facultatif) et un tableau de descriptions (facultatif) :

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		* REMARQUE : Il est également possible de disposer d'un module qui se compose uniquement d'un ID et d'un tableau de prérequis, plus des autres membres facultatifs, mais sans contribution. Il s'agit d'un "métamodule" qui peut être utilisé pour résumer une dépendance sur un autre module concret. Un module valide doit avoir des prérequis et/ou des contributions.
     - une valeur de chaîne pour ID, comme "my_module", où la valeur est l'ID unique de votre module. Vous répertoriez cette valeur dans un profil pour activer votre module.
     - une valeur de chaîne numérique pour la version, comme "1.0", où la valeur est le numéro de version de votre module.
     - 1 à n objets dans le tableau de fonctions, chacun avec une chaîne d'ID (obligatoire) et une chaîne de valeur (obligatoire).
Chaque valeur d'ID indique l'ID de la fonction exposée par ce module, et chaque valeur de chaîne indique le numéro de version de la fonction :
				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 1 à n objets dans le tableau de prérequis, chacun avec une chaîne d'ID (obligatoire).
Chaque valeur d'ID indique l'ID du module que votre module requiert en préalable :

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
    - 1 à n objets dans le tableau de contributions, chacun avec une valeur de type "head", "config" ou "menu"(obligatoire) et un tableau de sous-contributions (obligatoire).
"head" signifie que la contribution de ressource sera placée dans l'en-tête de la page. "config" signifie que la contribution de ressource sera placée dans le corps de la page.        "menu" signifie que la contribution de ressource fera partie d'un menu contextuel de la page :
				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
     1 à n objets dans le tableau de sous-contributions, chacun avec une chaîne de type (obligatoire) et un tableau d'URI (obligatoire).
Si le type de contribution est "head", le type de sous-contribution doit être "css" ou "js". Si le type de contribution est "config", le type de sous-contribution doit être "js", "markup", "config_static"
         ou "config_dynamic". Si le type de contribution est "menu", le type de sous-contribution doit être "json" :
						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
  - 1 à n objets dans le tableau des URI, chacun avec une chaîne de valeur (obligatoire), une chaîne deviceClass (facultative), une chaîne de type (facultative) et une chaîne lang (facultative).
           La chaîne de valeur est un chemin d'accès relatif au dossier principal de votre thème dans WebDAV. La chaîne deviceClass, si elle est spécifiée, signifie que la ressource sera incluse uniquement pour certains appareils correspondant.
           La valeur de deviceClass peut être une classe d'appareil unique, tel que "smartphone", ou une équation de classe d'appareil, tels que "smartphone+ios". Le type, s'il est spécifié, est "debug", "rtl" ou
           "debug,rtl". "debug" signifie que la ressource n'est incluse que si le débogage à distance est activé, et le chemin de sa valeur pointe généralement vers la version non compressée de la ressource. "rtl" signifie que la ressource n'est incluse que si la langue de l'utilisateur est bidirectionnelle, comme l'hébreu, où le texte sur la page s'affiche de droite à gauche. lang, si spécifié, signifie que la ressource n'est incluse que si les paramètres régionaux de l'utilisateur correspondent à la langue spécifiée :

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     1 à n objets dans le tableau titles, chacun avec une valeur chaîne (obligatoire) et une chaîne lang (obligatoire). Ils définissent le titre ou le nom d'affichage de votre module tel qu'il apparaît dans certaines parties de Portal, comme dans le portlet Analyseur de thème, dans autant de langues que vous le souhaitez :

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     1 à n objets dans le tableau descriptions, chacun avec une valeur chaîne (obligatoire) et une chaîne lang (obligatoire). Ils définissent la description de votre module tel qu'elle apparaît dans certaines parties de Portal, comme dans le portlet Analyseur de thème, dans autant de langues que vous le souhaitez :

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Chaque fois que vous ajoutez un fichier à ce dossier 'contributions' ou apportez une modification, vous devez invalider le cache de l'agrégateur de ressources afin que WebSphere Portal sélectionne vos modifications. Vous pouvez effectuer cette opération en cliquant sur Administration -> Analyseur de thème -> Utilitaires -> Centre de contrôle.
Dans la page du Centre de contrôle, cliquez sur le lien sous 'Invalider le cache'.

Une fois que vous avez défini votre nouveau module, vous devez l'ajouter à un profil l'activer. Pour des instructions complémentaires sur les profils, lisez le fichier readme.txt situé dans le dossier 'profiles'.

Si votre fichier .json contient des erreurs de syntaxe ou votre nouveau module ne fonctionne pas correctement, utilisez le portlet Analyseur de thème pour préciser le problème. Accédez à Administration -> Analyseur de thème -> Rapport de validation, puis consultez et corrigez les messages d'erreur et d'avertissement.

Vous pouvez également vous reporter à la documentation wiki pour plus d'informations sur la syntaxe .json ; il existe par exemple un fichier de schéma .json disponible qui montre toutes les syntaxes possibles et que vous pouvez exécuter avec votre fichier .json dans un valideur .json en ligne pour vérifier qu'il est syntaxiquement correct. 



Pregled modula teme (hrvatski)
**********************

Ovaj folder 'contributions' unutar WebDAV-a je dobro definirani folder WebSphere Portala koji pruža
module teme frameworku skupljača resursa. Unutar foldera se nalazi jedna .json datoteka po modulu ili skupu
modula - kreirajte vlastitu .json datoteku za svoj modul ili skup modula. Možete kopirati, preimenovati i
modificirati jednu od postojećih .json datoteka da biste mogli pregledati i doznati potrebnu .json sintaksu. 

Opseg modula teme obuhvaća jednu vašu temu. Ako želite koristiti neke od modula u različitim temama, morate kopirati
.json datoteke definicija tih modula iz jedne teme u drugu. 

Imajte na umu da postoji i jednostavniji način kreiranja modula, koji se nazivaju jednostavni moduli, koristeći folder 'modules'.
Opseg modula obuhvaća jednu temu. .json sintaksa modula teme omogućuje nekoliko naprednijih funkcija
koje ne možete izvesti pomoću jednostavnih modula, na primjer:

- deklariranje broja verzije vašeg modula
- korištenje jednadžbi klasa uređaja umjesto pojedinačnih klasa uređaja
- deklariranje opcijskog preduvjeta
- korištenje tipova config_static i config_dynamic za sub-contribution.

Ako vam nisu potrebne te naprednije stvari, u većini slučajeva ćete vjerojatno preferirati korištenje jednostavnih
modula.

Za dodatne upute o jednostavnim modulima pročitajte datoteku readme.txt u folderu 'modules'.

(Imajte na umu da postoji i treći način kreiranja modula, koji se nazivaju globalni moduli, koristeći datoteke plugin.xml
unutar foldera 'WEB-INF' u aplikacijama poduzeća (.ear-ima). Ovaj način zahtijeva najviše rada pa
ga koristite samo ako imate dobar razlog, na primjer ako imate modul koji se koristi u više tema, a ne želite duplicirati
definiciju modula u svakoj od tih tema. Globalni moduli, kao što njihovo ime govori,
obuhvaćaju sve teme.)
 
Ako su moduli teme pravi izbor za vaše potrebe, sažetak .json sintakse izgleda ovako:
(NAPOMENA:  Ovaj opis ima odgovarajuću shemu u folderu contributions/schema koja se može koristiti s
alatom za provjeru sheme da bi se provjerila datoteka doprinosa u JSON formatu).

- Jedan objekt s poljem modula (obavezno). (Objekt u .json notaciji je {}, a polje u
  .json notaciji je []):

	{
		"modules": [
		]
	}
	
  - 1 do n objekata unutar polja modules, svaki sadrži niz znakova id (obavezno), niz znakova version (opcijski),
    polje capabilities (opcijski), polje prereqs (opcijski), polje contributions (obavezno*),
    polje titles (opcijski) i polje descriptions (opcijski):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*NAPOMENA:  Modul se može sastojati samo polja id i prereqs i drugih opcijskih članova, bez polja
		contributions.  Ovo je "meta-module" koji se može koristiti kao sažetak zavisnosti
		na drugom konkretnom modulu.  Važeći modul mora imati prereqs ili contributions, ili oboje.
		
     - vrijednost niza znakova za id, kao što je "my_module", gdje je vrijednost jedinstveni id vašeg modula. Ova vrijednost se
       navodi u profilu za uključivanje modula.

     - numerička vrijednost za verziju, na primjer "1.0", gdje je vrijednost broj verzije vašeg modula.

     - 1 do n objekata unutar polja capabilities, svaki sadrži niz znakova id (obavezno)
       i niz znakova value (obavezno). Svaka vrijednost id-a označava id mogućnosti koju ovaj modul predstavlja i
       svaka vrijednost označava broj verzije mogućnosti:

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 1 do n objekata u polju prereqs, svaki sadrži niz znakova id (obavezno). Svaka vrijednost id-a označava
       id modula koji je preduvjet za vaš modul:

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - 1 do n objekata unutar polja contributions, svaki sadrži niz znakova type s vrijednošću "head", "config" ili "menu"
       (obavezno) i polje sub-contributions (obavezno). "head" označava da će doprinos resursa biti u
       zaglavlju stranice. "config" označava da će doprinos resursa biti u tijelu stranice.
       "menu" označava da će doprinos resursa biti dio kontekstnog izbornika na stranici:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 1 do n objekata unutar polja sub-contributions, svaki sadrži niz znakova type (obavezno)
         i polje uris (obavezno). Ako je za contribution naveden tip "head", za sub-contribution mora biti naveden tip "css" ili
         "js". Ako je za contribution naveden tip "config", za sub-contribution mora biti naveden tip "js", "markup", "config_static"
         ili "config_dynamic". Ako je za contribution naveden tip "menu", za sub-contribution mora biti naveden tip "json":

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - 1 do n objekata unutar polja uris, svaki sadrži niz znakova value (obavezno),
           niz znakova deviceClass (opcijski), niz znakova type (opcijski) i niz znakova lang (opcijski).
           Niz znakova value sadrži stazu koja je relativna u odnosu na glavni folder vaše teme u WebDAV-u. deviceClass,
           ako je naveden, označava da će se resurs uključiti samo za određene odgovarajuće uređaje.
           Vrijednost niza znakova deviceClass može biti jedna klasa uređaja, na primjer "smartphone", ili jednadžba
           klase uređaja, na primjer "smartphone+ios". type, ako je naveden, ima vrijednost "debug", "rtl" ili
           "debug,rtl". "debug" označava da se resurs uključuje samo ako je aktivirano udaljeno otkrivanje grešaka i
           njegova staza u value obično vodi do nekomprimirane verzije resursa. "rtl" označava da se resurs
           uključuje samo ako je korisnikova lokalizacija dvosmjerna, na primjer kao za hebrejski jezik, gdje se
           tekst na stranici prikazuje zdesna nalijevo. lang, ako je naveden, označava da će se resurs
           uključiti samo ako se korisnikova lokalizacija podudara sa svojstvom lang:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - 1 do n objekata unutar polja titles, svaki sadrži niz znakova value (obavezno) i niz znakova lang
       (obavezno). Oni definiraju naslov ili prikazani naziv vašeg modula koji će se pojavljivati u određenim
       dijelovima portala, na primjer u portletu analizatora teme, na svim jezicima koje
       navedete:

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - 1 do n objekata unutar polja descriptions, svaki sadrži niz znakova value (obavezno) i niz znakova lang
       (obavezno). Oni definiraju opis vašeg modula koji će se pojavljivati u određenim
       dijelovima portala, na primjer u portletu analizatora teme, na svim jezicima koje
       navedete:

				"descriptions": [
					{
						"value":"Modul koji omogućuje funkcionalnost xyz",
						"lang":"en"
					}
				]

Svaki puta kada dodate datoteku ovom folderu 'contributions' ili napravite promjenu u njemu, morat ćete poništiti
predmemoriju skupljača resursa da bi WebSphere Portal pokupio promjene.
To možete napraviti odlaskom u Administracija -> Analizator teme -> Pomoćni programi -> Kontrolni centar.
Na stranici Kontrolnog centra kliknite na vezu pod 'Poništi predmemoriju'.

Nakon definiranja novog modula, trebate ga dodati profilu i uključiti.
Za dodatne upute o profilima pročitajte datoteku readme.txt u folderu 'profiles'.

Ako postoje greške u .json sintaksi ili ako ne možete uspješno pokrenuti svoj novi modul, upotrijebite
portlet Analizator teme za dodatno utvrđivanje problema. Idite na Administracija -> Analizator teme -> Izvještaj za provjeru
i pregledajte poruke grešaka i upozorenja te poduzmite odgovarajuće akcije.

Možete pogledati i wiki dokumentaciju za više informacija o .json sintaksi, tamo je dostupna
.json datoteka sheme koja prikazuje sve moguće sintakse i možete provesti svoj json
kroz online .json validator koji će provjeriti ispravnost sintakse. 



Téma modulok bemutatása (magyar)
**********************

Ez a 'contributions' mappa a WebDAV mappán belül a WebSphere Portal által
jól meghatározott mappa, mely téma modulokat biztosít az
erőforrásösszesítő keretrendszer számára. A mappán belül modulonként vagy
modulkészletenként egy .json fájl található. A felhasználó létrehozhatja a
saját .json fájlját a saját moduljához vagy modulkészletéhez. Megteheti,
hogy lemásolja, átnevezi, majd módosítja valamelyik meglévő .json fájlt,
hogy lássa és megismerje a szükséges .json szintaxist. 

A téma modulok hatóköre egy téma. Ha különféle témákban akarja használni
ugyanazokat a modulokat, akkor át kell másolnia ezeket a modulmeghatározás
.json fájlokat az egyik témából a másikba. 

Modulok, úgynevezett egyszerű modulok létrehozásának még egyszerűbb módja
is van, a 'modules' mappa használatával. Mindkettőnek a hatóköre egy téma. 
A téma modulok .json szintaxisa lehetővé tesz néhány további speciális
dolgot, ami az egyszerű modulok esetében nem lehetséges; például: 

- verziószám deklarálása a modulhoz
- eszközosztály-kifejezések használata az egyedi eszközosztályok helyett
- annak megadása, hogy egy előfeltétel nem kötelező
- a config_static és a config_dynamic részhozzájárulás-típusok használata.

Ám ha nincs szüksége ezekre a további speciális dolgokra, akkor a legtöbb
esetben valószínűleg előnyben részesíti az egyszerű modulok használatát. 

Az egyszerű modulokkal kapcsolatos további útmutatást a 'modules' mappában
található readme.txt fájl tartalmaz. 

(A saját modulok, az úgynevezett globális modulok létrehozásának van egy
harmadik módja is, a nagyvállalati alkalmazások (.ear fájlok) 'WEB-INF'
mappájában található plugin.xml fájl útján. Ez a legmunkaigényesebb, ezért
csak akkor érdemes választani, ha jó oka van rá, például több témában
újrafelhasználja a modult és nem akarja minden egyes témában külön
szerepeltetni a modulmeghatározást. A globális modulok, mint nevükben is
benne van, az összes témára hatnak.)
 
Ha a téma modulok felelnek meg az igényeinek, akkor tekintse át a .json
szintaxis összefoglalását: (Megjegyzés: Ehhez a leíráshoz tartozik egy
megfelelő séma a contributions/schema mappában, melyet sémaérvényesítő
eszközzel együtt használhat a JSON formátumú hozzájárulásfájlok
ellenőrzésére.)

- Egyedülálló objektum egy modules tömbbel (kötelező). (Az objektum a
.json jelölésmódban {}, a tömb pedig []):

	{
		"modules": [
		]
	}
	
  - 1-n objektum a modules tömbön belül, melyek mindegyikéhez tartozik id
(azonosító) karaktersorozat (kötelező), version (verziószám)
karaktersorozat (kötelező), capabilities (képességek) tömb (nem kötelező),
prereqs (előfeltételek) tömb (nem kötelező), contributions
(hozzájárulások) tömb (kötelező*), titles (címek) tömb (nem kötelező) és
descriptions (leírások) tömb (nem kötelező): 

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*Megjegyzés: Az is érvényes, ha egy modul csak id és prereqs tömböt
tartalmaz, plusz a többi nem kötelező tagot, de hozzájárulásokat nem. Ez
egy "metamodul", melynek használatával megszüntetheti a függőséget
valamely más konkrét modultól. Az érvényes modulnak tartalmaznia kell a
prereqs és a contributions közül legalább az egyiket, de mindkettőt is
lehet.
     - Az id értéke egy karaktersorozat, például "my_module", ahol az
érték a modul egyedi azonosítója. Ezt az értéket kell felsorolni a
profilban a modul bekapcsolásához.
     - A version értéke egy numerikus karaktersorozat, például "1.0", ahol
az érték a modul verziószáma.
     - A capabilities tömbön belül 1-n objektum van, melyek mindegyikéhez
tartozik egy id (azonosító) karaktersorozat (kötelező) és egy value
(érték) karaktersorozat (kötelező). Az egyes id értékek a modul által
exponált képességek azonosítói, az egyes value értékek pedig a képességek
verziószámai:
				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - A prereqs tömbön belül 1-n objektum van, melyek mindegyikéhez
tartozik egy id (azonosító) karaktersorozat (kötelező). Az egyes id
értékek a modul által előfeltételként megkövetelt modulok azonosítói:
				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - A contributions tömbön belül 1-n objektum van, melyek mindegyikéhez
tartozik egy type (típus) karaktersorozat - "head", "config" vagy "menu" -
(kötelező) és egy sub-contributions (részhozzájárulások) tömb (kötelező). 
A "head" azt jelenti,hogy az erőforrás-hozzájárulás az oldal fej részébe
kerül. A "config" azt jelenti,hogy az erőforrás-hozzájárulás az oldal törzs
részébe kerül. A "menu" azt jelenti, hogy az erőforrás-hozzájárulás egy
előugró menü része lesz az oldalon:
				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
     - A sub-contributions tömbön belül 1-n objektum van, melyek
mindegyikéhez tartozik egy type (típus) karaktersorozat (kötelező) és egy
uris (URI-k) tömb (kötelező). Ha a hozzájárulás típusa "head", akkor a
részhozzájárulás típusa "css" vagy "js" kell, legyen. Ha a hozzájárulás
típusa "config", akkor a részhozzájárulás típusa "js", "markup",
"config_static" vagy "config_dynamic" kell, legyen. Ha a hozzájárulás
típusa "menu", akkor a részhozzájárulás típusa "json" kell, legyen:
						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
     - Az uris tömbön belül 1-n objektum van, melyek mindegyikéhez tartozik
egy value (érték) karaktersorozat (kötelező), egy deviceClass
(eszközosztály) karaktersorozat (nem kötelező), egy type (típus)
karaktersorozat (nem kötelező) és egy lang (nyelv) karaktersorozat (nem
kötelező). A value karaktersorozat a WebDAV mappában a téma fő mappájához
képest relatív elérési út. A deviceClass, ha meg van adva, azt jelenti,
hogy az erőforrás csak bizonyos, illeszkedő erőforrások esetén fog
szerepelni.
A deviceClass értéke lehet egyetlen eszközosztály, például "smartphone",
vagy eszközosztályokból álló kifejezés, például "smartphone+ios". A type,
ha meg van adva, "debug", "rtl" vagy "debug,rtl" lehet. A "debug" azt
jelenti,hogy az erőforrás csak akkor szerepel, ha a távoli hibakeresés be
van kapcsolva, a hozzá tartozó értékben megadott elérési út pedig
általában az erőforrás tömörítetlen változatának elérési útja. Az "rtl"
azt jelenti, hogy az erőforrás csak akkor szerepel, ha a felhasználó
területi beállítása két irányban írt nyelv, például héber, ahol a szöveg
jobbról balra van írva az oldalon. A lang, ha meg van adva, azt jelenti,
hogy az erőforrás csak akkor szerepel, ha a felhasználó területi
beállítása megegyezik a megadott nyelvvel:
								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - A titles tömbön belül 1-n objektum van, melyek mindegyikéhez
tartozik egy value (érték) karaktersorozat (kötelező) és egy lang (nyelv)
karaktersorozat (kötelező). Ezek határozzák meg a modul címét vagy
megjelenő nevét, ahogyan az a Portal bizonyos részeiben látszani fog -
például a Témaelemző portál kisalkalmazásban - igény szerint tetszőleges
számú nyelven:
				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - A descriptions tömbön belül 1-n objektum van, melyek mindegyikéhez
tartozik egy value (érték) karaktersorozat (kötelező) és egy lang (nyelv)
karaktersorozat (kötelező). Ezek határozzák meg a modul leírását, ahogyan
az a Portal bizonyos részeiben látszani fog - például a Témaelemző portál
kisalkalmazásban - igény szerint tetszőleges számú nyelven:
				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Valahányszor fájlt vesz fel ebbe a 'contributions' mappába vagy módosítást
végez, érvénytelenítenie kell az erőforrásösszesítő gyorsítótárat, hogy a
WebSphere Portal felvegye a módosításokat.
Ehhez kattintson az Adminisztráció -> Témaelemző -> Segédprogramok ->
Vezérlőközpont menüpontra.
A Vezérlőközpont oldalon kattintson a 'Gyorsítótár érvénytelenítése'
alatti hivatkozásra. 

Miután meghatározta az új modult, a bekapcsolásához fel kell vennie azt
egy profilba.
A profilokkal kapcsolatos további útmutatást a 'profiles' mappában
található readme.txt fájl tartalmaz. 

Ha szintaktikai hiba van a .json fájlban vagy problémába ütközik az új
modul beüzemelése során, akkor a Témaelemző portál kisalkalmazásban nézzen
utána, hogy mi okozza ezt. Kattintson az Adminisztráció -> Témaelemző ->
Érvényesítési jelentés menüpontra, és vizsgálja meg a hiba- és
figyelmeztetés üzeneteket, majd tegye meg a szükséges lépéseket. 

A wiki dokumentációból is tovább tájékozódhat a .json szintaxist illetően.
Például rendelkezésre áll egy .json sémafájl, amelyben szerepel az összes
lehetséges szintaxis. A belőle előállított .json fájlra futtathat egy
online .json érvényesítőt annak ellenőrzéséhez, hogy szintaktikailag
helyes. 



Panoramica Moduli tema
**********************

Questa cartella 'contributions' in WebDAV è una cartella ben definita da WebSphere Portal per fornire
moduli di tema al framework dell'aggregatore di risorse. In questa cartella è presente un file .json per modulo o insieme di
moduli - creare il proprio file .json per il modulo o la serie di moduli. È possibile copiare, ridenominare e modificare uno dei file
.json esistenti per visualizzare e conoscere la sintassi .json richiesta.

Questi moduli si trovano nell'ambito di un tema. Se si desidera utilizzare alcuni degli stessi moduli in diversi temi,
è necessario copiare questi file .json di definizione modulo da un tema a un altro.

Si noti che esiste un modo ancora più semplice per creare moduli, definiti moduli semplici, utilizzando la cartella 'modules'.
Entrambi si trovano nell'ambito di un tema. La sintassi .json dei moduli del tema consente elementi più avanzati che non è possibile
eseguire con moduli semplici, come ad esempio:

- dichiarazione di un numero di versione per il modulo
- utilizzo di equazioni della classe di dispositivi rispetto alle classi di dispositivi individuali
- dichiarazione che un prereq è facoltativo
- utilizzo di tipi con contributo secondario di config_static e config_dynamic.

Ma, se non sono necessari questi elementi più avanzati, nella maggior parte dei casi sarebbe preferibile utilizzare
i moduli semplici.

Per ulteriori informazioni sui moduli semplici leggere il file readme.txt nella cartella 'modules'.

(Si noti anche che esiste un terzo modo per creare i propri moduli, chiamati moduli globali, attraverso i file plugin.xml
nella cartella 'WEB-INF' nelle applicazioni enterprise (.ear's). Questo modo implica molto lavoro,
quindi si consiglia di utilizzarlo solo se ci sono buoni motivi, come ad esempio per un modulo riutilizzato in più
temi e non si desidera duplicare la definizione del modulo in ciascuno dei temi. I moduli globali, come indica il
nome, si trovano nell'ambito di tutti i temi.)
 
Se i moduli di tema sono la scelta giusta per le proprie esigenze, segue un riepilogo della sintassi .json:
(NOTA:  questa descrizione presenta uno schema di corrispondenza nella cartella contributions/schema, che può essere utilizzata
con uno strumento di convalida di schemi per verificare un file di contributo con formato JSON).

- Un oggetto singolo con un array dei moduli (obbligatorio). (Un oggetto nella notazione .json è {} e n array nella notazione
  .json è []):

	{
		"modules": [
		]
	}
	
  - 1 a n oggetti nell'array dei moduli, ciascuno con una stringa id (obbligatoria), una stringa versione (facoltativa),
    un array di capability (facoltativo), un array di prereq (facoltativo), un array di contributi (obbligatorio*),
    un array di titoli (facoltativo) e un array di descrizioni (facoltativo):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*NOTA:  è valido anche avere un modulo formato solo da un id e un array di prereq, più gli altri membri
		facoltativi, ma nessun contributo.  Si tratta di un "meta-modulo" che può essere utilizzato per astrarre una dipendenza
		in alcuni altri moduli concreti.  Un modulo valido deve avere uno o entrambi i prereq e i contributi.
		
     - un valore di stringa per l'id, come ad esempio "my_module", dove il valore è l'id univoco del modulo. Questo valore
       è ciò che verrà elencato in un profilo per attivare il modulo.
       
     - un valore di stringa per la versione, come ad esempio "1.0", in cui il valore è il numero di versione del modulo.
       
     - 1 a n oggetti nell'array delle capability, ciascuno con una stringa id (obbligatoria)
       e una stringa di valore (obbligatoria). Ciascun valore id indica l'id della capability che questo modulo
       espone e ciascun valore indica il numero di versione della capability:
       
				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 1 a n oggetti nell'array dei prereq, ciascun con una stringa id (obbligatoria). Ciascun valore id indica l'id
       del modulo che il modulo richiede in precedenza:
       
				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - 1 a n oggetti nell'array dei contributi, ciascun con una stringa tipo "head", "config" o "menu"
       (obbligatoria) e un array dei contributi secondari (obbligatorio). "head" significa che i contributo di risorsa andrà all'inizio della
       pagina. "config" significa che il contributo della risorsa andrà nel corpo della pagina.
       i contributo di risorsa menu "menu" andrà come parte del menu di contesto nella pagina:
       
				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 1 a n oggetti nell'array dei contributi secondari, ciascun con una stringa tipo (obbligatoria) e
         un array degli uri (obbligatorio). Se il tipo di contributo è "head", il tipo di contributo secondario deve essere "css" o
         "js". Se il tipo di contributo è "config", il tipo di contributo secondario deve essere "js", "markup", "config_static"
         o "config_dynamic". Se il tipo di contributo è "menu", il tipo di contributo secondario deve essere "json":
       
						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - 1 a n oggetti nell'array degli uri, ciascuno con una stringa di valore (obbligatoria), una
           stringa deviceClass (facoltativa) e una stringa tipo (facoltativa) e una stringa lang (facoltativa).
           La stringa del valore è un percorso relativo alla cartella principale del tema in WebDAV. deviceClass,
           se specificato, significa che la risorsa sarà inclusa solo per alcuni dispositivi che corrispondono.
           Il valore di deviceClass può essere una classe di dispositivi singola, come ad esempio "smartphone" o un'equazione
           della classe di dispositivi, come ad esempio "smartphone+ios". Se specificato, è di tipo "debug", "rtl" o
           "debug,rtl". "debug" significa che la risorsa è inclusa solo se il debug remoto è attivo e il percorso di valore in
           genere si trova nella versione decompressa della risorsa. "rtl" significa che la risorsa
           è inclusa solo se la locale dell'utente è bidirezionale, come ad esempio Hebrew, in cui il testo
           nella pagina è presentato da destra a sinistra. lang, se specificato, significa che la risorsa è inclusa solo
           se la locale dell'utente corrisponde alla lang specificata:
       
								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - 1 a n oggetti nell'array dei titoli, ciascuno con una stringa di valore (obbligatoria) e una stringa lang
       (obbligatoria). Questi definiscono il titolo o il nome di visualizzazione del modulo come verrà visualizzato
       in alcune parti del portale come ad esempio nel portlet Analizzatore temi, in tutte le lingue
       necessarie:
       
				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - 1 a n oggetti nell'array delle descrizioni, ciascuna con una stringa di valore (obbligatoria) e una stringa lang
       (obbligatoria). Queste definiscono la descrizione del modulo come verrà visualizzata
       in alcune parti del portale come ad esempio nel portlet Analizzatore temi, in tutte le lingue
       necessarie:
       
				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Ogni volta che viene aggiunto un file a questa cartella 'contributions' o si apporta una modifica, è necessario invalidare
la cache dell'aggregatore di risorse per WebSphere Portal per selezionare le modifiche.
È possibile eseguire ciò andando ad Gestione -> Analizzatore temi -> Utility -> Control Center.
Nella pagina Control Center fare clic sul link in 'Invalida Cache'.

Una volta definito il nuovo modulo, è necessario aggiungerlo al profilo per attivarlo. 
Per ulteriori istruzioni sui profili, leggere il file readme.txt nella cartella 'profiles'.

Se sono presenti errori di sintassi in .json o problemi nel funzionamento del nuovo modulo,
utilizzare il portlet Analizzatore temi per restringere il problema. Andare a Gestione -> Analizzatore temi -> Report di convalida
ed esaminare ed intraprendere un'azione per i messaggi di avvertenza ed errore.

Inoltre, è possibile fare riferimento alla documentazione wiki per ulteriori informazioni sulla sintassi .json, ad esempio esiste
un file di schema .json disponibile che mostra tutte le sintassi possibili e che è possibile eseguire con il .json
attraverso un programma di convalida .json in linea sintatticamente corretto. 



Theme Modules Overview (English)
**********************

This 'contributions' folder within WebDAV is a well defined folder by WebSphere Portal to provide
theme modules to the resource aggregator framework. Within this folder is one .json file per module or set
of modules - create your own .json file for your own module or set of modules. You can copy, rename and
modify one of the existing .json files in order to see and learn the .json syntax that is required.

Theme modules are scoped to your one theme. If you want to use some of these same modules in different themes,
you have to copy these module definition .json files from one theme to the other.

Note that there is an even easier way to create modules, called simple modules, using the 'modules' folder.
Both are scoped to your one theme. The .json syntax of the theme modules allows for a few more advanced 
things that you cannot do with simple modules, such as:

- declaring a version number for your module
- using device class equations as opposed to just individual device classes
- declaring that a prereq is optional
- using sub-contribution types of config_static and config_dynamic.

But, if you do not need those more advanced things, in most cases you will probably prefer using simple
modules.

For further instructions on simple modules read the readme.txt file within the 'modules' folder.

(Also note that there is third way to create your own modules, referred to as global modules, via plugin.xml
files within the 'WEB-INF' folder within enterprise applications (.ear's). This way involves the most work, 
so you would not do it unless you have good reason, such as for a module that is reused across multiple 
themes and you don't want to duplicate the module definition in each of the themes. Global modules, as the 
name implies, are scoped across all themes.)
 
If theme modules is the right choice for your needs, a summary of the .json syntax is as follows:
(NOTE:  This description has a matching schema in the contributions/schema folder, which can be used
with a schema validation tool to verify a JSON-format contribution file).

- A single object with a modules array (required). (An object in .json notation is {} and an array in
  .json notation is []):

	{
		"modules": [
		]
	}
	
  - 1 to n objects within the modules array, each with an id string (required), a version string (optional),
    a capabilities array (optional), a prereqs array (optional), a contributions array (required*), 
    a titles array (optional) and a descriptions array (optional):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*NOTE:  It is also valid to have a module which consists only of an id and a prereqs array, plus the other 
		optional members, but no contributions.  This is a "meta-module" which can be used to abstract a dependency
		on some other concrete module.  A valid module must have one or both of prereqs and contributions.
		
     - a string value for id, such as "my_module", where the value is the unique id of your module. This value
       is what you will list in a profile to turn your module on.
       
     - a numeric string value for version, such as "1.0", where the value is the version number of your module.
       
     - 1 to n objects within the capabilities array, each with an id string (required)
       and a value string (required). Each id value indicates the id of the capability that this module
       exposes, and each value value indicates the version number of the capability:
       
				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 1 to n objects within the prereqs array, each with an id string (required). Each id value indicates the id
       of the module that your module pre-requires:
       
				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - 1 to n objects within the contributions array, each with a type string of "head", "config" or "menu"
       (required) and a sub-contributions array (required). "head" means the resource contribution will go
       in the head of the page. "config" means the resource contribution will go in the body of the page.
       "menu" menus the resource contribution will go as part of a context menu on the page:
       
				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 1 to n objects within the sub-contributions array, each with a type string (required)
         and a uris array (required). If contribution type is "head", sub-contribution type must be "css" or 
         "js". If contribution type is "config", sub-contribution type must be "js", "markup", "config_static"
         or "config_dynamic". If contribution type is "menu", sub-contribution type must be "json":
       
						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - 1 to n objects within the uris array, each with a value string (required), 
           a deviceClass string (optional), a type string (optional) and a lang string (optional).
           The value string is a path relative to your theme's main folder in WebDAV. deviceClass,
           if specified, means that the resource will only be included for certain devices that match.
           The value of deviceClass can be a single device class, such as "smartphone", or a device
           class equation, such as "smartphone+ios". type, if specified, is one of "debug", "rtl" or
           "debug,rtl". "debug" means the resource is only included if remote debugging is on, and its
           value path is usually to the uncompressed version of the resource. "rtl" means the resource
           is only included if the user's locale is a bi-directional one, such as Hebrew, where text
           on the page is presented from right-to-left. lang, if specified, means the resource is only
           included if the user's locale matches the lang specified:
       
								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - 1 to n objects within the titles array, each with a value string (required) and a lang string
       (required). These define the title or display name of your module as it will appear in certain
       parts of Portal such as in the Theme Analyzer portlet, in as many different languages as you
       need:
       
				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - 1 to n objects within the descriptions array, each with a value string (required) and a lang string
       (required). These define the description of your module as it will appear in certain
       parts of Portal such as in the Theme Analyzer portlet, in as many different languages as you
       need:
       
				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Any time that you add a file to this 'contributions' folder or make a change, you need to invalidate
the resource aggregator cache for WebSphere Portal to pick up the changes.
You can do this by going to Administration -> Theme Analyzer -> Utilities -> Control Center.
On the Control Center page click the link under 'Invalidate Cache'.

Once you define your new module, you need to add it to a profile to turn it on. 
For further instructions on profiles read the readme.txt file within the 'profiles' folder.

If you have any syntax errors in your .json or problems getting your new module to work, use the
Theme Analyzer portlet to narrow down the problem. Go to Administration -> Theme Analyzer -> Validation Report
and examine and take action on the error and warning messages.

Also, you can refer to the wiki documentation for even more information on the .json syntax, such as there is 
a .json schema file available that shows all of the possible syntaxes and that you can run with your .json
through an online .json validator to verify that it is syntactically correct. 



テーマ・モジュールの概要 (日本語)
**********************

WebDAV 内のこの「contributions」フォルダーは、テーマ・モジュールをリソース統合機能フレームワークに提供するために WebSphere Portal によって明確に定義されたフォルダーです。このフォルダー内には、モジュールまたはモジュールのセットにつき 1 つの .json ファイルがあります。ユーザー独自のモジュールまたはモジュールのセットに対して独自の .json ファイルを作成します。既存の .json ファイルの 1 つをコピー、名前変更、変更して、必要な .json 構文を参照したり学習したりできます。

テーマ・モジュールは、ユーザーの 1 つのテーマにスコープ設定されます。これらの同じモジュールの一部を別のテーマで使用する場合、これらのモジュール定義 .json ファイルを 1 つのテーマから別のテーマにコピーする必要があります。

「modules」フォルダーを使用して、単純モジュールと呼ばれるモジュールを作成するためのより簡単な方法があります。
いずれも、ユーザーの 1 つのテーマにスコープ設定されます。テーマ・モジュールの .json 構文を使用すると、単純モジュールでは実現できない以下に示すいくつかの高度な操作が可能になります。

- モジュールのバージョン番号を宣言する
- 単なる個別デバイス・クラスではなくデバイス・クラス式を使用する
- 前提条件がオプションであることを宣言する
- config_static や config_dynamic というサブコントリビューション・タイプを使用する。

ただし、これらの高度な操作が必要なければ、単純モジュールを使用した方が好ましい場合がほとんどです。

単純モジュールの詳しい説明については、「modules」フォルダー内の readme.txt ファイルを参照してください。

(さらに、エンタープライズ・アプリケーション (.ear) 内の「WEB-INF」フォルダー内にある plugin.xml ファイルを使用して、グローバル・ファイルと呼ばれる独自のモジュールを作成する第 3 の方法もあります。この方法は作業量が最も多くなるため、モジュールが複数のテーマにわたって再使用され、モジュール定義をテーマごとに複製したくないなどの相当の理由がないかぎり、この方法を行うことはありません。グローバル・モジュールのスコープは、その名前が暗黙に示すように、すべてのテーマを含みます。)
 
テーマ・モジュールがニーズに合った正しい選択である場合、.json 構文の要約は以下のとおりです。
(注: この記述に一致するスキーマが contributions/schema フォルダー内にあり、これを
スキーマ検証ツールと一緒に使用して、JSON 形式のコントリビューション・ファイルを検証できます)。

- modules 配列を持つ単一オブジェクト (必須)。(オブジェクトは .json 表記では {} で、
  配列は .json 表記では [] です)。

	{
		"modules": [
		]
	}
	
  - modules 配列内の 1 個から n 個のオブジェクトで、それぞれに id ストリング (必須)、version ストリング (オプション)、
    capabilities 配列 (オプション)、prereqs 配列 (オプション)、contributions 配列 (必須*)、
    titles 配列 (オプション)、descriptions 配列 (オプション) があります。

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*注: id および prereqs 配列と、他のオプション・メンバーでのみ構成され、contributions を持たない
		モジュールを持つことも有効です。これは「メタモジュール」で、他の一部の具象モジュールへの依存関係を
		抽象化するために使用できます。有効なモジュールであるためには、prereqs と contributions のいずれか 1 つまたは両方が必要です。
		
     - id のストリング値 (「my_module」など)。この値はモジュールの固有 ID です。この値は、モジュールをオンに
       するためにプロファイル内にリストするものです。

     - バージョンの数値ストリング値 (「1.0」など)。この値はモジュールのバージョン番号です。

     - capabilities 配列内の 1 個から n 個のオブジェクトで、それぞれに id ストリング (必須)
       と value ストリング (必須) があります。各 id 値は、このモジュールが公開する機能の id を示し、
       各 value 値は機能のバージョン番号を示します。

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],

     - prereqs 配列内の 1 個から n 個のオブジェクトで、それぞれに id ストリング (必須) があります。各 id 値は、ユーザーのモジュールが
       前提条件として必要とするモジュールの id を示します。

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],

     - contributions 配列内の 1 個から n 個のオブジェクトで、それぞれに type ストリングの「head」、「config」、「menu」
       (必須) と sub-contributions 配列 (必須) があります。「head」は、リソース・コントリビューションがページの
       先頭に入ることを意味します。「config」は、リソース・コントリビューションがページの本文に入ることを意味します。
       「menu」は、リソース・コントリビューションがページのコンテキスト・メニューの一部として入ることを示します。

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],

       - sub-contributions 配列内の 1 個から n 個のオブジェクトで、それぞれに type ストリング (必須)
         と uris 配列 (必須) があります。コントリビューション・タイプが「head」の場合、サブコントリビューション・タイプは「css」または
         「js」でなければなりません。コントリビューション・タイプが「config」の場合、サブコントリビューション・タイプは「js」、「markup」、「config_static」、
         または「config_dynamic」でなければなりません。コントリビューション・タイプが「menu」の場合、サブコントリビューション・タイプは「json」でなければなりません。

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]

         - uris 配列内の 1 個から n 個のオブジェクトで、それぞれに value ストリング (必須)、
           deviceClass ストリング (オプション)、type ストリング (オプション)、lang ストリング (オプション) があります。
           value ストリングは、WebDAV 内のテーマのメイン・フォルダーからの相対パスです。deviceClass が指定された場合、
           一致する特定のデバイスに対してのみリソースが含まれることを意味します。
           deviceClass の値は、「smartphone」などの単一デバイス・クラスや、「smartphone+ios」などのデバイス・クラス式
           とすることができます。type が指定される場合、これは「debug」、「rtl」、
           「debug,rtl」のいずれかです。「debug」のときは、リモート・デバッグがオンの場合のみリソースが含まれることを意味し、
           value パスは通常、リソースの圧縮解除バージョンを示します。「rtl」は、ページのテキストが右から左に表示されるヘブライ語のように、
           ユーザーのロケールが双方向である場合にのみ リソースが含まれることを意味します。lang が指定される場合、
           指定された lang とユーザーのロケールが一致する場合にのみリソースが含まれることを意味します。

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - titles 配列内の 1 個から n 個のオブジェクトで、それぞれに value ストリング (必須) と lang ストリング
       (必須) があります。これらはテーマ・アナライザー・ポートレットなどのポータルの特定の一部として
       表示されるときのモジュールのタイトルまたは表示名を定義し、異なる言語を必要な数だけ
       使用できます。

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],

     - descriptions 配列内の 1 個から n 個のオブジェクトで、それぞれに value ストリング (必須) と lang ストリング
       (必須) があります。これらはテーマ・アナライザー・ポートレットなどのポータルの特定の一部として
       表示されるときのモジュールの説明を定義し、異なる言語を必要な数だけ
       使用できます。

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]

ファイルをこの「contributions」フォルダーに追加するか、変更を加えたときには常に、リソース統合機能キャッシュを無効化して、
WebSphere Portal が変更内容を取得するようにする必要があります。
これを実行するには、「管理」->「テーマ・アナライザー」->「ユーティリティー」->「コントロール・センター」に移動します。
その後、「コントロール・センター」ページで、「キャッシュの無効化」の下のリンクをクリックします。

新規モジュールを定義したら、これをプロファイルに追加して、オンにする必要があります。
プロファイルの詳しい説明については、「profiles」フォルダー内の readme.txt ファイルを参照してください。

.json に構文エラーが発生したり、新規モジュールを作動させる際に問題が発生した場合などは、テーマ・アナライザー・ポートレットを使用して、問題を絞り込んでください。「管理」->「テーマ・アナライザー」->「検証レポート」
に移動して、エラーおよび警告メッセージを調べてアクションを実行してください。

また、wiki 文書を参照して、.json 構文に関するさらに詳しい情報を取得することもできます。例えば、使用可能なすべての構文を示す .json スキーマ・ファイルがあり、このファイルをオンラインの .json バリデーターを使用してユーザーの .json と一緒に実行することで、構文が正しいことを検証することができます。



Тақырып Модульдерін Шолу (Ағылшын)
**********************

Бұл WebDAV ішіндегі 'үлестер' қалтасы ресурсты біріктіру құрылымына тақырып модульдерін қамтамасыз ететін WebSphere
порталы арқылы жақсы анықталған. Осы қалта арқылы бір .json файл бір модуль үшін немесе модульдер жинағы үшін жеке
.json файлын өзіңіздің модуліңіз немесе модуль жинағыңыз үшін құрыңыз. Талап етілетін .json синтаксисін білу және көрудің орнына
бар .json файлдарының біреуін көшіріп, атын өзгертіп және өңдей аласыз.

Тақырып модульдері сіздің бір тақырыбыңызға ауқымдалған. Егер осы модульдердің кейбірін әр түрлі тақырыптарда қолданғыңыз келсе,
осы модуль анықтамасының .json файлдарын бір тақырыптан басқасына көшіруіңіз керек.

Қарапайым модульдер деп аталатын 'модульдер' қалтасын қолдана отырып модульдерді құрудың жеңілірек түрі бар екенін ескеріңіз.
Екеуі де сіздің тақырыптарыңыздың біріне ауқымдалды. Тақырып модуьдерінің .json синтаксисі қарапайым модульдермен орындай алмайтын шамалы көбірек жетілдірілген заттар үшін рұқсат етеді, мысалы:

- модуліңіз үшін нұсқа санын жариялау
- құрал классы өрнектерін жеке құрал класстарына қарсы қолдану
- алдынала шарттардың міндетті емес екенін жариялау
- config_static және config_dynamic элементтерінің ішкі үлес түрлерін қолдану.

Бірақ, егер сол қосымша жетілдірілген заттарды қажет етпесеңіз, көп жағдайларда қарапайым модульдерді қолдануды қалайтын боласыз.

Қарапайым модульдерге байланысты келесі нұсқаулықтарда readme.txt файлын 'модульдер' қалтасынан қараңыз.

(Сонымен қатар деке модульдерді құрудың үшінші жолы бар, олар кәсіпорын бағдарламалары (.ear's) арқылы 'WEB-INF' қалтасындағы plugin.xml файлдарын жаһандық модульдері түріне жатады. Бұл жол көп жұмысты қамтиды, сондықтан сіз оны жақсы себепті иеленбейінше орындамайсыз, мысалы бірнеше тақырыптар ішінде қайта қолданылған модуль себебі үшін және әр бір тақырыптардағы модуль анықтамасын көшіргіңіз келмейді. Жаһандық модульдер көрсетілген ат сияқты барлық тақырыптар арқылы ауқымдалған.) 
 
Егер тақырып модульдері сіздің қажеттіліктеріңіз үшін арналған дұрыс таңдау болса, .json синтаксисінің қорытындысы келесідей: (Ескертпе: Бұл анықтама үлес/сызба қалтасында сәйкес сызбаны қамтиды, ол JSON-пішім үлесі файлын тексеру үшін сызба тексеру құралымен бірге қолданыла алады).

- Модульдер жолы бар жалғыз нысан (талап етіледі). (.json нұсқауындағы нысан мынадай {} және .json нұсқауындағы жол мынадай []):

	{
		"модульдер": [
		]
	}
	  - модульдер жолы ішіндегі 1 n нысандары үшін, әр бірі идентификатор жолын қамтиды (міндетті), нұсқа жолы (міндетті емес),   мүмкіндіктер жолы (міндетті емес), алғышарттар жолы (міндетті емес), үлестер жолы (міндетті*),   тақырыптар жолы (міндетті емес) және анықтамалар жолы (міндетті емес):

        "модульдер": [
			{
				"id":"my_module",
				"нұсқа":"1.0",
				"мүмкіндіктер": [
				],
				"алғышарттар": [
				],
				"үлестер": [
				],
				"тақырыптар": [
				],
				"анықтамалар": [
				]
			}
		]
		
		*Ескертпе: Сонымен қатар идентификатор және алғышарттар жолынан ғана тұратын модульді, сонымен үлестер емес басқа міндетті емес мүшелерді иелену жарамды. Бұл кейбір басқа нақты модульдегі тәуелділікті аңдатпа ету үшін қолданылатын "мета модуль". Жарамды модуль алғышарттар мен үлестердің бір немесе екеуін де иеленуі тиіс.
   - идентификаторға арналған жол мәні, мысалы "my_module", мұнда мән сіздің модуліңіздің бірегей идентификаторы. Бұл мән модуліңізді қосу үшін арналған профайлдағы тізім.    - нұсқаға арналған сандық жол мәні, мысалы "1.0", мұндағы мән сіздің модуліңіздің нұсқа саны.    - мүмкіндіктер жолы ішіндегі 1 n нысандары үшін, әр бірі идентификатор жолын қамтиды (міндетті) және мән жолы міндетті). Әр бір идентификатор мәні осы модуль шығаратын мүмкіндіктің идентификаторын көрсетеді және әр бір мән мүмкіндіктің нұсқа санын көрсетеді:
				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],    - алғышарттар жолы ішіндегі 1 n нысандары үшін, әр бірі идентификатор жолын қамтиды (міндетті). Әр бір идентификатор мәні сіздің модуліңіз алдын ала сұрайтын модульдің идентификаторын көрсетеді:
				"prereqs": [
					{
						"id":"my_base_module"
					}
				],    - үлестер жолы ішіндегі 1 n нысандары үшін, әр бірі "тақырып", "конфиг" немесе "мәзір" элементтерінің түр жолымен    (міндетті) және ішкі үлестер жолымен бірге (міндетті). "тақырып" ресурс үлесінің беттің бастапқы жағында болатынын білдіреді. "конфиг" ресурс үлесінің беттің негізгі жерінде болатынын білдіреді.
    "мәзір" ресурс үлесінің мәзірлері беттегі мазмұн мәзірінің бір бөлігі ретінде болатынын білдіреді:
				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],     - ішкі үлестер жолы ішіндегі 1 n нысандары үшін, әр бірі түр жолын қамтиды (міндетті) және uris жолы міндетті). Егер үлес түрі "тақырып" болса, онда ішкі үлес түрі "css" немесе "js" болуы тиіс. Егер үлес түрі "конфиг" болса, онда ішкі үлес түрі "js", "markup", "config_static"     немесе "config_dynamic" болуы тиіс. Егер үлес түрі "мәзір" болса, онда ішкі үлес "json" болуы тиіс: 						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]      - uris жолы ішіндегі 1 n нысандары үшін, әр бірі мән жолын қамтиды (міндетті), deviceClass жол (міндетті емес), түр жолы (міндетті емес) және тіл жолы (міндетті емес).
      Мән жолы WebDAV ішіндегі сіздің тақырыптар мәзірі қалтасына қатысты жол. deviceClass,      егер көрсетілсе, ол ресурстың сәйкес болатын кейбір құралдарға ғана қамтылатынын білдіреді.
     deviceClass мәні жалғыз құрал классы болады, мысалы "смартфон" немесе құрал класс теңдеуі, мысалы "smartphone+ios". түр, егер көрсетілсе, онда "debug", "rtl" немесе "debug,rtl" болады. "debug" дгеніміз ресурстың қашықтағы жөндеу іске қосылса ғана қамтиды және олардың мән жолы әдетте ресурстың қысылмаған нұсқасына қолданылады. "rtl" дегеніміз ресурс тк егер пайдаланушының тілі екі бағытты болса ғана қамтылады, мысалы Иврит тілі,      мұнда беттегі мәтін оңнан сол жаққа қарай болады. тіл, егер көрсетілсе, онда ресурстың егер пайдаланушының тілі көрсетілген тілге сәйкес болса ғана кірістіріледі: 								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
  - тақырыптар жолы ішіндегі 1 n нысандары үшін, әр бірі мән жолын (міндетті) және тіл жолын қамтиды (міндетті). Бұл тақырып анықтайды немесе сіздің модуліңіздің атын көрсетеді, ол сіз ге қажет көптеген бірнеше тілдердегі Тақырып талдаушы портлеті ретінде Порталдың нақты бөлігінде пайда болады: 			"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],    - анықтамалар жолы ішіндегі 1 n нысандары үшін, әр бірі мән жолын (міндетті) және тіл жолын қамтиды (міндетті). Бұл модуліңіздің анықтамасын анықтайды, ол сізге қажет көптеген бірнеше тілдердегі Тақырып талдаушы портлеті ретінде Порталдың нақты бөлігінде пайда болады:
				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				] Файлды осы 'үлестер' қалтасына қосқан кезде немесе өзгерістр енгізген кезде, ресурс біріктірушісінің кэшін WebSphere порталы үшін өзгерістерді таңдау үшін жарамсыз етуіңіз керек.
Мұны Әкімші -> Тақырыпты талдаушы -> Қызметтік бағдарламалар -> Басқару орталығына бару арқылы орындай аласыз.
Басқару орталығы бетінде 'Кэшті жарамсыз ету' астындағы байланысты басыңыз.

Жаңа модуліңізді анықтағаннан кейін, оны іске қосу үшін профайлға қосуыңыз керек.
Профайлдарға байланысты келесі нұсқаулықтарда readme.txt файлын 'профайлдар' қалтасынан қараңыз. 

.json файлында синтаксистік қателіктер болса немесе модуліңізге жұмыс істеуде кедергі тудыратын мәселелер болса, мәселені азайту үшін Тақырыпты талдаушы портлетін қолданыңыз. Әкімші -> Тақырып Талдаушы -> Тексеру есебі бетіне өтіп және қателіктер мен ескерту хабарламаларын анықтап, түзетіңіз.

Сонымен қатар, .json синтаксисінде қосымша ақпарат алу үшін вики құжатын қараңыз, мысалы қол жетімді .json сызба файлы барлық мүмкін болатын синтаксистерді көрсетеді, ол сіздің .json файлыңызбен желі ішінде дұрыс болатын .json тексеру құралын орындайды. 



테마 모듈 개요
**********************

WebDAV 내의 'contributions' 폴더는 자원 수집자 프레임워크에 테마 모듈을 제공하도록
WebSphere Portal에서 올바르게 정의된 폴더입니다. 이 폴더 내에 모듈 또는 모듈 세트당 하나의
.json 파일이 있습니다. 사용자 고유 모듈 또는 모듈 세트를 위한 고유 .json 파일을 작성합니다. 필요한
.json 구문을 보고 학습하기 위해 기존 .json 파일 중 하나를 복사하고, 이름을 바꾸고, 수정할 수 있습니다.

테마 모듈 범위가 하나의 테마로 지정됩니다. 여러 테마에서 동일한 모듈 중 일부를 사용하려면
하나의 테마에서 다른 테마로 이 모듈 정의 .json 파일을 복사해야 합니다.

'modules' 폴더를 사용하여 단순 모듈이라고 하는 모듈을 작성하는 보다 쉬운 방법이 있습니다.
두 모듈 모두 하나의 테마로 범위가 지정됩니다. 테마 모듈의 .json 구문에서는 다음과 같이
단순 모듈로 수행할 수 없는 고급 기능을 수행할 수 있습니다.

- 모듈의 버전 번호 선언
- 개별 디바이스 클래스와 달리 디바이스 클래스 등식 사용
- 전제조건이 선택사항임을 선언
- config_static 및 config_dynamic의 하위 기고 유형 사용

하지만, 고급 기능이 필요하지 않은 경우 대부분 단순 모듈
사용을 선호합니다.

단순 모듈에 대한 자세한 지침은 'modules' 폴더에 있는 readme.txt 파일을 참조하십시오.

(또한 엔터프라이즈 애플리케이션(.ear) 내 'WEB-INF' 폴더의 plugin.xml 파일을 통해
글로벌 모듈이라고 하는 사용자 고유 모듈을 작성하는 세 번째 방법이 있습니다.) 이 방법에서는
가장 어려운 작업을 수행해야 하므로 특별한 이유(예: 여러 테마에서 재사용되고 각 테마에서
모듈 정의가 중복되지 않도록 하려는 모듈의 경우)가 있지 않은 한 수행하지 않습니다. (이름이
내포한 대로 글로벌 모듈의 범위는 모든 테마로 지정됩니다.)
 
테마 모듈이 요구에 맞는 선택사항인 경우, .json 구문의 요약은 다음과 같습니다. (참고:
이 설명에는 contributions/schema 폴더의 일치하는 스키마가 있으며, 이 스키마를 스키마
유효성 검증 도구와 함께 사용하여 JSON 형식 기고 파일을 검증할 수 있습니다.)

- modules 배열이 있는 단일 오브젝트입니다(필수). (.json의 오브젝트 표기법은 {}이고 .json의
  배열 표기법은 []입니다.)

	{
		"modules": [
		]
	}
	
  - modules 배열 내의 1 - n개의 오브젝트. 각 오브젝트에는 id 문자열(필수), version 문자열(선택사항),
    capabilities 배열(선택사항), prereqs 배열(선택사항), contributions 배열(필수*), titles 배열(선택사항),
    descriptions 배열(선택사항)이 있습니다.

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*참고: id와 prereqs 배열 및 기타 선택적 멤버(contributions 제외)로 구성되는
  모듈도 있어야 합니다. 이는 다른 콘크리트 모듈에 대한 종속성을 요약하는 데
  사용할 수 있는 "메타 모듈"입니다. 올바른 모듈에는 prereqs와 contributions 중 하나 또는 둘 다 있어야 합니다.

     - "my_module"과 같은 ID의 문자열 값. 여기서 값은 모델의 고유 ID입니다. 이 값은
       모듈을 켜기 위해 프로파일에 나열할 값입니다.

     - "1.0"과 같은 버전의 숫자 문자열 값. 여기서 값은 모듈의 버전 번호입니다.

     - capabilities 배열 내의 1 - n개의 오브젝트. 각 오브젝트에는 id 문자열(필수)과
       value 문자열(필수)이 있습니다. 각 id 값은 이 모듈이 표시하는 기능의 ID를
       표시하고 각 value 값은 기능의 버전 번호를 표시합니다.

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - prereqs 배열 내의 1 - n개의 오브젝트. 각 오브젝트에는 id 문자열(필수)이 있습니다. 각 id 값은
       모듈이 전제조건으로 하는 모듈 ID를 표시합니다.

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - contributions 배열 내의 1 - n개의 오브젝트. 각 오브젝트에는 "head", "config" 또는 "menu"의
       type 문자열(필수)과 sub-contributions 배열(필수)이 있습니다. "head"를 사용하면 페이지 헤드에
       자원 기고가 위치합니다. "config"를 사용하면 페이지의 본문에 자원 기고가 위치합니다.
       "menu"를 사용하면 페이지의 컨텍스트 메뉴의 파트로 자원 기고가 위치합니다.

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - sub-contributions 배열 내의 1 - n개의 오브젝트. 각 오브젝트에는 type 문자열(필수)과
         uris 배열(필수)이 있습니다. 기고 유형이 "head"인 경우, 하위 기고 유형이 "css"
         또는 "js"이어야 합니다. 기고 유형이 "config"인 경우에는, 하위 기고 유형이 "js",
         "markup", "config_static" 또는 "config_dynamic"이어야 합니다. 기고 유형이 "menu"인
         경우에는, 하위 기고 유형이 "json"이어야 합니다.

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - uris 배열 내의 1 - n개의 오브젝트. 각 오브젝트에는 value 문자열(필수), deviceClass
           문자열(선택사항), type 문자열(선택사항), lang 문자열(선택사항)이 있습니다.
           value 문자열은 WebDAV에 있는 테마의 기본 폴더에 상대적인 경로입니다. deviceClass(지정된
           경우)를 사용하면 일치하는 특정 디바이스에만 자원을 포함시킬 수 있습니다.
           deviceClass 값은 "smartphone"과 같은 단일 디바이스 클래스나 "smartphone+ios"와
           같은 디바이스 클래스 등식입니다. type(지정된 경우)은 "debug", "rtl" 또는
           "debug,rtl" 중 하나입니다. "debug"를 사용하면 원격 디버깅이 작동되는 경우에만
           자원이 포함되고 해당 값 경로는 대개 자원의 압축 해제 버전에 대해 지정됩니다. "rtl"을
           사용하면 사용자 로케일이 양방향인 경우에만 자원이 포함되고, 여기서 페이지의 텍스트는
           오른쪽에서 왼쪽으로 표시됩니다. lang(지정된 경우)을 사용하면 사용자 로케일이 지정된
           lang과 일치하는 경우에만 자원이 포함됩니다.

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - titles 배열 내의 1 - n개의 오브젝트. 각 오브젝트에는 value 문자열(필수)과 lang
       문자열(필수)이 있습니다. 모듈의 제목이나 표시 이름이 테마 분석기 포틀릿과
       같은 포털의 특정 파트에 사용자가 요구하는 여러 언어로 표시되므로 이러한
       오브젝트가 해당 제목이나 표시 이름을 정의합니다.

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - descriptions 배열 내의 1 - n개의 오브젝트. 각 오브젝트에는 value 문자열(필수) 및
       lang 문자열(필수)이 있습니다. 모듈의 설명이 테마 분석기 포틀릿과 같은
       포털의 특정 파트에 사용자가 요구하는 여러 언어로 표시되므로 이러한
       오브젝트가 해당 설명을 정의합니다.

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
이 'contributions' 폴더에 파일을 추가하거나 변경할 때, 변경사항을 적용하려면
WebSphere Portal의 자원 수집자 캐시를 무효화해야 합니다.
이를 수행하기 위해 관리 -> 테마 분석기 -> 유틸리티 -> Control Center로 이동합니다.
Control Center 페이지에서 '캐시 무효화' 아래에 있는 링크를 클릭하십시오.

새 모듈을 정의한 후, 작동시키려면 프로파일에 이 모듈을 추가해야 합니다.
프로파일에 대한 자세한 지침은 'profiles' 폴더에 있는 readme.txt 파일을 참조하십시오.

.json에 구문 오류가 있거나 새 모듈을 작동시키는 중에 문제점이 발생한 경우, 테마 분석기
포틀릿을 사용하여 문제점의 범위를 좁히십시오. 관리 -> 테마 분석기 -> 유효성 검증 보고서로
이동하여 오류 및 경고 메시지를 검토하고 해당 조치를 수행하십시오.

.josn 구문에 대한 자세한 정보는 위키 문서를 참조할 수 있습니다. 정보에는, 가능한
구문을 모두 표시하는 .json 스키마 파일이 사용 가능하다는 내용과 온라인 .json 유효성
검증기를 통해 .json을 실행하여 구문적으로 올바른지 검증하는 내용 등이 있습니다. 



Themamodules - Overzicht
************************

De map 'contributions' binnen WebDAV is een goed gedefinieerde map van WebSphere Portal voor het leveren van themamodules aan het framework van de resourceaggregator. Deze map bevat één .json-bestand per module of set van modules - maak uw eigen .json-bestand voor uw eigen module of set modules. U kunt een van de bestaande .json-bestanden kopiëren, hernoemen en wijzigen, om te kunnen zien hoe de vereiste syntaxis in een .json-bestand werkt.

Themamodules worden gekoppeld aan een afzonderlijk thema. Als u dezelfde modules wilt gebruiken binnen verschillende thema's, moet u de .json-bestanden van deze moduledefinities kopiëren van het ene thema naar het andere. 

Merk op dat er nog een eenvoudigere methode is voor het maken van modules, de zogenaamde eenvoudige modules, met behulp van de map 'modules'.
Beide worden gekoppeld aan uw afzonderlijke thema. De .json-syntaxis voor de themamodules biedt enige geavanceerde functies die niet beschikbaar zijn voor simpele modules, zoals:

- declareren van een versienummer voor uw module
- gebruik van apparatuurcategorie-vergelijkingen in plaats van het gebruik van alleen afzonderlijke apparatuurcategorieën
- declareren dat een prereq optioneel is
- gebruik van de typen subaanleveringen config_static en config_dynamic.

Maar als u deze geavanceerde items niet nodig hebt, zult u in de meeste gevallen er waarschijnlijk de voorkeur aan geven om te werken met eenvoudige modules. 

Voor meer instructies voor eenvoudige modules raadpleegt u het bestand readme.txt binnen de map 'modules'.

(Er is ook nog een derde manier voor het maken van uw eigen modules, aangeduid als algemene modules, via plugin.xml-bestanden binnen de map 'WEB-INF' voor bedrijfstoepassingen (.ear's). Deze methode vereist het meeste werk, en dient u alleen te gebruiken als daar een goede reden voor is, bijvoorbeeld voor een module die wordt gebruikt voor meerdere thema's, waarvoor u niet de moduledefinitie wilt kopiëren naar elk van de thema's. Zoals de naam al aangeeft, hebben globale modules betrekking op alle thema's.)
 
Als het werken met themamodules voor u de juiste keuzen is, kunt u gebruikmaken van het onderstaande overzicht van de .json-syntaxis: (OPMERKING:  Voor deze beschrijving is een overeenkomstig schema beschikbaar in de map contributions/schema, dat u in hulpprogramma voor schemavalidatie kunt gebruiken voor het controleren van een aanleveringenbestand met een JSON-indeling).

- Een enkel object met een array van modules (verplicht). (Een object wordt in de .json-notatie aangegeven met {}, terwijl een array wordt aangegeven met []):

	{
		"modules": [
		]
	}
	
  - 1 tot n objecten de array van modules, elk met een ID-reeks (verplicht), een versieaanduiding (optioneel),
    een array van mogelijkheden (optioneel), een array van prereqs (optioneel), een array van aanleveringen (verplicht*),
    een array van titel (optioneel) en een array aan beschrijvingen (optioneel):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*OPMERKING:  Het is ook mogelijk een module te hebben die alleen bestaat uit een ID en een array van prereqs, plus de overige     optionele elementen, maar zonder aanleveringen. Dit is een "meta-module" die kan worden gebruikt voor een afhankelijkheid van
  een andere concrete module.  Een geldige module moet beschikken over prereqs en/of aanleveringen.
		
     - een tekenreekswaarde voor ID, zoals "my_module", waarbij de waarde het unieke ID van uw module is. Deze waarde
       is wat u in een profiel vermeldt om uw module in te schakelen.

     - een numerieke reekswaarde voor de versie, zoals "1.0", waarbij de waarde het versienummer van uw module is.
     - 1 tot n objecten binnen de array van mogelijkheden, elk met een ID-reeks (verplicht) en een waardereeks (verplicht).
       Elke ID-waarde geeft het ID aan van de mogelijkheid die met de module wordt weergegeven, waarbij elke waarde
       het versienummer van de mogelijkheid aangeeft:

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 1 tot n objecten binnen de array van prereqs, elk met een ID-reeks (verplicht). Elke ID-waarde geeft het ID aan
       van de module die vooraf vereist is voor uw module:

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - 1 tot n objecten binnen de array van aanleveringen, elk met een typereeks van "head", "config" of "menu"
       (verplicht) en een array van subaanleveringen (verplicht). "head" betekent dat de resourceaanlevering wordt
       verwerkt in de kop van de pagina. "config" betekent dat de resourceaanlevering wordt
       verwerkt in de corpus van de pagina. "menu" betekent dat de resourceaanlevering wordt aangebracht in een contextmenu
       op de pagina:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 1 tot n objecten binnen de array van subaanleveringen, elk met een typereeks (verplicht)
         en een array van URI's (verplicht). Als het type aanlevering "head" is, moet het type van
         de subaanleveringen "css" of "js" zijn. Als het type aanlevering "config" is, moet het type
         subaanlevering "js", "markup", "config_static" of "config_dynamic" zijn. Als het type aanlevering
         "menu" is, moet het type van de subaanleveringen "json" zijn:

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - 1 tot n objecten binnen een array van uris, elk met een waardereeks (vereist), een deviceClass-reeks            (optioneel), een typereeks (optioneel) en een lang-reeks (optioneel).
           De waardereeks is een pad onder de hoofdmap voor uw thema in WebDAV. deviceClass,
           indien opgegeven, betekent dat de resource alleen wordt opgenomen voor bepaalde overeenkomstige apparaten.
           De waarde van deviceClass kan bestaan uit een enkele apparatuurcategorie, zoals "smartphone", of uit
           een combinatie van apparatuurcategorieën, zoals "smartphone+ios". type, indien opgegeven, is gelijk aan "debug",
           "rtl" of "debug,rtl". "debug" betekent dat de resource alleen wordt opgenomen als foutopsporing op afstand            is ingeschakeld, waarbij het waardepad de meestal verwijst naar de niet-gecomprimeerde versie van de resource.
           "rtl" betekent dat de resource alleen wordt opgenomen als de locale van een gebruiker een bi-directionele locale is,            bijvoorbeeld Hebreeuws, waarvoor de tekst op de pagina wordt weergegeven van rechts naar links. lang, indien            opgegeven, betekent dat de resource alleen wordt opgenomen als de locale van de gebruiker overeenkomt met
           de opgegeven lang:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - 1 tot n objecten in de array van titels, elk met een waardereeks (verplicht) en lang-reeks (verplicht). Deze definiëren
       de titel of weergavenaam van uw module, aangezien deze voorkomen in bepaalde delen van de Portal, bijvoorbeeld in
       de portlet Thema-analyseprogramma, en in zo veel verschillende talen als u nodig hebt:

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - 1 tot n objecten in de array van beschrijvingen, elk met een waardereeks (verplicht) en lang-reeks (verplicht). Deze
       definiëren de beschrijving van uw module, aangezien deze voorkomen in bepaalde delen van de Portal, bijvoorbeeld in
       de portlet Thema-analyseprogramma, en in zo veel verschillende talen als u nodig hebt:

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Telkens wanneer u een bestand toevoegt aan deze map 'contributions' of wanneer u een wijziging aanbrengt, moet u de cache voor de resourceaggregator ongeldig maken, zodat WebSphere Portal de wijzigingen kan oppikken.
U kunt dit doen door het selecteren van Beheer -> Thema-analyseprogramma -> Hulpprogramma's -> Control Center.
Op de Control Center-pagina klikt u op de link onder 'Cache ongeldig maken'.

Nadat u uw nieuwe module hebt gedefinieerd, dient u deze voor activering toe te voegen aan een profiel.
Voor meer instructies voor profielen raadpleegt u het bestand readme.txt binnen de map 'profiles'.

Als er syntaxisfouten aanwezig zijn in uw json, of als er problemen zijn met het activeren van uw nieuwe module, kunt u de portlet Thema-analyseprogramma gebruiken om de oorzaak van het probleem op te sporen. Ga naar Beheer -> Thema-analyseprogramma -> Validatierapport en bestudeer de fout- en waarschuwingsberichten om er vervolgens actie voor te ondernemen. 

Daarnaast kunt u de wiki-documentatie raadplegen voor extra informatie over de .json-syntaxis, waarin bijvoorbeeld wordt aangegeven dat er een .json-schemabestand beschikbaar is, dat alle syntaxismogelijkheden aangeeft en dat u in een online .json-validatieprogramma kunt gebruiken om te controleren of uw json-syntaxis correct is. 



Oversikt over temamoduler (norsk)
**********************

Mappen 'contributions' i WebDAV er en WebSphere Portal-definert mappe for å levere
temamoduler til Resource Aggregator-rammeverket. I denne
mappen finnes det en .json-fil per modul eller sett med moduler - opprett din egen .json-fil for din modul eller sett med moduler. Du kan kopiere,
endre navn på og endre en av de eksisterende .json-filene for å se og lære den nødvendige .json-syntaksen.

Temamoduler er definert for ett tema. Hvis du vil bruke noen av de samme modulene i forskjellige temaer, må du kopiere
moduldefinisjonens .json-filer fra ett tema til et annet.

Merk at det finnes en enklere metode for å opprette moduler, kalt enkle moduler, ved hjelp av mappen 'modules'.
Begge er definert for ett tema. .json-syntaksen for temamoduler gir mulighet for å gjøre noen mer avanserte ting
enn du kan gjøre for enkle moduler, for eksempel:

- deklarere et versjonsnummer for modulen
- bruke enhetsklasseligninger i stedet for bare individuelle enhetsklasser
- deklarere at et forhåndskrav er valgfritt
- bruke underbidragstypene config_static og config_dynamic.

Men hvis du ikke trenger disse mer avanserte tingene, vil du sannsynligvis i de fleste tilfeller foretrekke å bruke enkle moduler.

For flere instruksjoner for enkle moduler kan du lese filen readme.txt i mappen 'modules'.

(Merk at det også er en tredje metode for å opprette dine egne moduler, kalt globale moduler, via plugin.xml-filer
i mappen 'WEB-INF' i bedriftsapplikasjoner (.ear-filer). Denne metoden innebærer mest arbeid,
så den vil du nok ikke velge med mindre du har en god årsak, for eksempel hvis en modul brukes om igjen på tvers av flere temaer og du ikke vil duplisere moduldefinisjonen i hvert av temaene. Globale moduler,
som navnet antyder, er definert for alle temaer.)
 
Hvis temamoduler er et riktig valg for dine behov, er dette et sammendrag av .json-syntaksen:
(MERK: Denne beskrivelse har et tilsvarende skjema i mappen contributions/schema, som kan brukes
sammen med et skjemavalideringsverktøy til å kontrollere en bidragsfil i JSON-format).

- Ett enkelt objekt i en modules-matrise (obligatorisk). (Et objekt i .json-notasjon er {}, og
  en matrise i .json-notasjon er []):

	{
		"modules": [
		]
	}
	
  - 1 til n objekter i modules-matrisen, hver med en id-streng (obligatorisk), en version-streng (valgfritt),
    en capabilities-matrise (valgfritt), en prereqs-matrise (valgfritt), en contributions-matrise (obligatorisk),
    en titles-matrise (valgfritt) og en descriptions-matrise (valgfritt):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*MERK: Det er også gyldig å ha en modul som bare består av en id og en prereqs-matrise, pluss de andre
		valgfrie medlemmene, men ingen contributions. Dette er en "metamodul" som kan brukes til å abstrahere en avhengighet
		av en annen konkret modul. En gyldig modul må ha en av eller både prereqs og contributions.
		
     - en strengverdi for id, som "my_module", der verdien er den unike IDen til modulen. Dette er verdien
       du tar med i en profil for å slå på modulen.

     - en numerisk strengverdi for version, som "1.0", der verdien er versjonsnummeret til modulen.

     - 1 til n objekter i capabilities-matrisen, som hver har en id-streng (obligatorisk) og en
       value-streng (obligatorisk). Hver id-verdi angir IDen til funksjonen som denne modulen
       eksponerer, og hver value-verdi angir versjonsnummeret til funksjonen:

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 1 til n objekter i prereqs-matrisen, som hver har en id-streng (obligatorisk). Hver
       id-verdi angir IDen til modulen som er et forhåndskrav for din modul:

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - 1 til n objekter i contributions-matrisen, som hver har type-strengen "head", "config" eller "menu"
       (obligatorisk) og en sub-contributions-matrise (obligatorisk). "head" betyr at ressursbidraget
       plasseres i sidehodet. "config" betyr at ressursbidraget plasseres i hoveddelen av siden.
       "menu" betyr at ressursbidraget plasseres i hurtigmenyen for siden:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 1 til n objekter i sub-contributions-matrisen, som hver har en type-streng (obligatorisk) og en
         uris-matrise (obligatorisk). Hvis contribution-typen er "head", må sub-contribution-typen være
         "css" eller "js". Hvis contribution-typen er "config", må sub-contribution-typen være "js", "markup",
         "config_static" eller "config_dynamic". Hvis contribution-typen er "menu", må sub-contribution-typen
         være "json":

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - 1 til n objekter i uris-matrisen, som hver har en value-streng (obligatorisk), en
           deviceClass-streng (valgfritt), en type-streng (valgfritt) og en lang-streng (valgfritt).
           Value-strengen er en bane som er relativ til temaets hovedmappe i WebDAV. deviceClass,
           hvis den er oppgitt, betyr at ressursen bare blir inkludert for bestemte samsvarende enheter.
           Verdien for deviceClass kan være en enkelt enhetsklasse, for eksempel "smartphone", eller en
           enhetsklasseligning, for eksempel "smartphone+ios". Hvis type er oppgitt, kan verdien være "debug",
           "rtl" eller "debug,rtl". "debug" betyr at ressursen bare blir inkludert hvis ekstern feilsøking er på,
           og verdibanen er vanligvis til den ukomprimerte versjonen av ressursen. "rtl" betyr at ressursen bare
           blir inkludert hvis brukerens språkmiljø er toveis, for eksempel hebraisk, der teksten på siden blir
           vist fra høyre til venstre. Hvis lang er oppgitt, betyr det at ressursen bare blir inkludert hvis
           brukerens språkmiljø samsvarer med lang-verdien som er oppgitt:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - 1 til n objekter i titles-matrisen, som hver har en value-streng (obligatorisk) og en lang-streng
       (obligatorisk). De definerer tittelen eller visningsnavnet for modulen som blir vist i bestemte deler
       av Portal, for eksempel i Temaanalysator-portletten, på så mange forskjellige språk som du har behov for.

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - 1 til n objekter i descriptions-matrisen, som hver har en value-streng (obligatorisk) og en
       lang-streng (obligatorisk). De definerer beskrivelsen av modulen som blir vist i bestemte deler av
       Portal, for eksempel i Temaanalysator-portletten, på så mange forskjellige språk som du har behov for.

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Hver gang du legger til en fil i mappen 'contributions' eller gjør en endring, må du ugyldiggjøre
Resource Aggregator-hurtigbufferen for at WebSphere Portal skal kunne plukke opp endringene.
Du kan gjøre dette ved å gå til Administrasjon -> Temaanalysator -> Funksjoner -> Kontrollsenter.
På siden Kontrollsenter klikker du på linken under 'Ugyldiggjør hurtigbuffer'.

Når du har definert den nye modulen, må du legge den til i en profil for å slå den på.
For flere instruksjoner for profiler kan du lese filen readme.txt i mappen 'profiles'.

Hvis du har noen syntaksfeil i din .json-fil eller problemer med å få den nye modulen til å fungere, kan du
bruke Temaanalysator-portletten til å finne problemet. Gå til Administrasjon -> Temaanalysator -> Valideringsrapport
og undersøk og utfør handlingene for feil- og advarselsmeldingene.

Du kan også se i wiki-dokumentasjonen hvis du ønsker mer informasjon om .json-syntaksen. Det finnes en
.json-skjemafil som viser alle mulige syntakser, som du kan kjøre sammen med din .json-fil gjennom
en online .json-validator for å kontrollere at den har riktig syntaks.



Przegląd modułów kompozycji (polski)
**********************

Folder contributions udostępniany przez protokół WebDAV jest zdefiniowany w
produkcie WebSphere Portal na potrzeby udostępniania modułów kompozycji dla środowiska agregatora zasobów. W
tym folderze znajduje się jeden plik .json dla każdego modułu lub zestawu modułów. Należy
utworzyć własny plik .json dla własnego modułu lub zestawu modułów. Istniejący plik .json można
skopiować, zmienić mu nazwę i zmodyfikować, aby poznać wymaganą składnię JSON. 

Zasięgiem modułów kompozycji jest jedna kompozycja. Aby użyć niektórych z tych modułów
w innych kompozycjach, należy skopiować ich pliki definicji .json między kompozycjami. 

Istnieje jeszcze łatwiejszy sposób tworzenia modułów, tak zwanych modułów
prostych, przy użyciu folderu modules. Zasięg ich obu do jedna kompozycja. Składnia JSON
modułów kompozycji umożliwia wykonanie kilku bardziej zaawansowanych czynności, które nie są
dostępne w przypadku modułów prostych, takich jak: 

- Zadeklarowanie numeru wersji dla modułu
- Użycie równań klas urządzeń w przeciwieństwie do klas pojedynczego urządzenia
- Zadeklarowanie wymagania wstępnego jako opcjonalnego
- Użycie typów podrzędnego elementu wnoszonego config_static i config_dynamic

Jeśli te zaawansowane funkcje nie są potrzebne, w większości przypadków preferowane jest raczej użycie
modułów prostych. 

Dalsze instrukcje dotyczące modułów prostych zawiera plik readme.txt w folderze modules. 

Istnieje trzeci sposób tworzenia własnych modułów, tak zwanych modułów
globalnych, przy użyciu plików plugin.xml w folderze WEB-INF w ramach aplikacji korporacyjnych
(plików .ear). Ta metoda wymaga najwięcej pracy, więc nie należy jej używać bez wyraźnej
potrzeby, takiej jak ponowne użycie modułu w wielu kompozycjach bez duplikowania
definicji modułu w każdej z tych kompozycji. Zasięgiem modułów globalnych są, jak wskazuje nazwa, wszystkie
kompozycje.
 
Poniżej przedstawiono podsumowanie składni JSON dla modułów kompozycji przydatne w przypadku ich
wybrania ze względu na potrzeby.
UWAGA: w folderze contributions/schema znajduje się schemat zgodny z tym
opisem, którego można użyć w narzędziu sprawdzania poprawności schematu w celu zweryfikowania pliku dostarczonego w
formacie JSON.

- Pojedynczy obiekt z tablicą modules (wymagany). (Obiekt w notacji JSON to {}, a tablica w notacji
JSON to []):

	{
		"modules": [
		]
	}
	
  - Od 1 do n obiektów w tablicy modules, z których każdy ma łańcuch
identyfikatora (wymagany), łańcuch wersji (opcjonalny), tablicę capabilities
(opcjonalną), tablicę prereqs (opcjonalną), tablicę contributions (wymaganą*),
tablicę titles (opcjonalną) i tablicę descriptions (opcjonalną): 

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*UWAGA: Poprawny jest również moduł, który składa się tylko z identyfikatora
i tablicy prereqs oraz innych opcjonalnych elementów, lecz bez tablicy contributions. Jest
to moduł nadrzędny, którego można użyć do utworzenia abstrakcji dla zależności
od innego konkretnego modułu. Poprawny moduł musi mieć jedną lub obie spośród tablic prereqs i contributions. 
 - Wartość łańcuchowa dla identyfikatora, np. my_module, która jest unikalnym identyfikatorem modułu. Ta
wartość jest określana w profilu, w celu włączenia modułu.
 - Łańcuch liczbowy dla wersji, np. 1.0, który określa numer wersji modułu.

 - Od 1 do n obiektów w tablicy capabilities, z których każdy ma łańcuch
identyfikatora (wymagany) i łańcuch wartości (wymagany). Każda wartość
identyfikatora wskazuje identyfikator możliwości prezentowany przez dany moduł,
a każda wartość wartości wskazuje numer wersji możliwości:

				"capabilities": [
					{
						"id":"my_module",
						"value":"1.0"
					}
				],

 - Od 1 do n obiektów w tablicy prereqs, z których każdy ma łańcuch identyfikatora (wymagany). Każda
wartość identyfikatora wskazuje identyfikator modułu stanowiącego wymaganie wstępne danego modułu:

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],

 - Od 1 do n obiektów w tablicy contributions, z których każdy ma łańcuch typu
head, config lub menu (wymagany) i tablicę sub-contributions (wymaganą). Typ
head oznacza, że element wnoszony zasobu znajdzie się w nagłówku strony. Typ
config oznacza, że element wnoszony zasobu znajdzie się w treści strony. Typ
menu oznacza, że element wnoszony zasobu zostanie przekazany do strony jako część
menu kontekstowego:
				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
 - Od 1 do n obiektów w tablicy sub-contributions, z których każdy ma łańcuch
typu (wymagany) i tablicę uris (wymaganą). Jeśli typ elementu wnoszonego to
head, typ dla tablicy sub-contribution musi mieć wartość css lub js. Jeśli typ
elementu wnoszonego to config, typ dla tablicy sub-contribution musi mieć wartość
js, markup lub config_static. Jeśli
typ elementu wnoszonego to menu, typ dla tablicy sub-contribution musi
mieć wartość json:
						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
 - Od 1 do n obiektów w tablicy uris, z których każdy ma łańcuch wartości
(wymagany), łańcuch deviceClass (opcjonalny), łańcuch typu (opcjonalny) i łańcuch języka (opcjonalny). Łańcuch
wartości jest ścieżką względną do głównego folderu kompozycji dostępnego przez
protokół WebDAV. Wartość deviceClass, jeśli jest określona, oznacza, że zasób
zostanie włączony dla zgodnych urządzeń. Wartość deviceClass może określać
pojedynczą klasę urządzeń, np. smartphone, lub równanie klas urządzeń, np smartphone+ios. Typ,
jeśli został określony, ma wartość debug, rtl lub debug.rtl. Wartość debug
oznacza, że zasób zostanie dołączony, tylko jeśli włączone jest zdalne
debugowanie, a jego ścieżka wartości wskazuje zwykle zdekompresowaną wersją zasobu. Wartość
rtl oznacza, że zasób zostanie dołączony, tylko jeśli w ustawieniach narodowych
użytkownika określono język dwukierunkowy, taki jak hebrajski, w przypadku
którego tekst jest wyświetlany od prawej do lewej. Wartość lang, jeśli została
określona, oznacza, że zasób zostanie dołączony, tylko jeśli ustawienia narodowe użytkownika są zgodne z określonym językiem:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
 - Od 1 do n obiektów w tablicy titles, z których każdy ma łańcuch wartości
(wymagany) i łańcuch języka (wymagany). Definiują one tytuł lub nazwę
wyświetlaną modułu (w dowolnej liczbie języków) w postaci wyświetlanej w
niektórych częściach portalu, takich jak portlet Analizator kompozycji:
				"titles": [
					{
						"value":"Mój moduł",
						"lang":"pl"
					}
				],

 - Od 1 do n obiektów w tablicy descriptions, z których każdy ma łańcuch
wartości (wymagany) i łańcuch języka (wymagany). Definiują one opis modułu (w
dowolnej liczbie języków) w postaci wyświetlanej w niektórych częściach portalu, takich jak portlet Analizator kompozycji:

				"descriptions": [
					{
						"value":"Moduł udostępniający funkcję xyz",
						"lang":"pl"
					}
				]

Za każdym razem, gdy do folderu contributions zostanie dodany plik lub zostanie w nim
wprowadzona zmiana, należy unieważnić pamięć podręczną agregatora zasobów produktu WebSphere
Portal, aby zmiany zostały uwzględnione. Czynność tę można wykonać na stronie Administrowanie ->
Analizator kompozycji -> Programy narzędziowe -> Centrum sterowania. Na stronie Centrum sterowania
należy kliknąć odsyłacz w sekcji Unieważnianie pamięci podręcznej. 

Po zdefiniowaniu nowego modułu należy dodać go do profilu, aby go włączyć. Dalsze instrukcje
dotyczące profili zawiera plik readme.txt w folderze profiles. 

Jeśli plik .json zawiera błędy składniowe lub nowy moduł nie działa poprawnie,
należy użyć portletu Analizator kompozycji, aby określić przyczynę problemu. Należy przejść na stronę
Administrowanie -> Analizator kompozycji -> Raport ze sprawdzania poprawności, a następnie
zapoznać się z raportem i wykonać czynności odpowiednie dla komunikatów o
błędzie lub ostrzegawczych. 

Ponadto można skorzystać z obszaru wiki z dokumentacją, aby uzyskać jeszcze więcej
informacji na temat składni JSON - na przykład o dostępności pliku schematu JSON zawierającego wszystkie możliwe
składnie lub możliwości sprawdzenia poprawności pliku .json za pomocą sieciowego analizatora
poprawności kodu JSON w celu zweryfikowania jego składniowej poprawności. 



Descrição geral de Módulos de temas (Português)
**********************

Esta pasta 'contributions' no WebDAV é uma pasta bem definida pelo WebSphere Portal para facultar
módulos de temas à estrutura do agregador de recursos. Dentro desta pasta existe um ficheiro .json por módulo ou conjunto
de módulos - crie o seu próprio ficheiro .json para o seu próprio módulo ou conjunto de módulos. Pode copiar, mudar o nome e
modificar um dos ficheiros .json existentes para consultar e aprender a sintaxe de .json necessária.

O âmbito destes módulos de temas abrange o seu tema. Se pretender utilizar alguns destes mesmos módulos em temas diferentes,
terá de copiar os ficheiros .json de definição destes módulos de um tema para o outro.

Existe uma forma ainda mais fácil de criar módulos, designada por módulos simples, utilizando a pasta 'modules'.
O âmbito de ambos abrange o seu tema. A sintaxe de .json dos módulos de temas possibilita algumas acções mais avançadas
que não pode executar com os módulos simples, como, por exemplo:

- declarar um número de versão para o módulo
- utilizar equações de classes de dispositivos em oposição a apenas classes de dispositivos individuais
- declarar um pré-requisito como opcional
- utilizar tipos de sub-contribuição de config_static e config_dynamic.

No entanto, se não necessitar destas acções mais avançadas, na maioria dos casos, é preferível utilizar módulos
simples.

Para obter mais instruções sobre módulos simples, leia o ficheiro readme.txt que se encontra na pasta 'modules'.

(Tenha também em atenção o facto de existir uma terceira forma de criar os seus próprios módulos, designada por módulos globais, através de ficheiros plugin.xml
na pasta 'WEB-INF' nas aplicações empresariais (.ear's). Este é o método que implica mais trabalho,
pelo que só o deve utilizar se tiver um bom motivo, como para um módulo que é reutilizado em vários
temas e não pretenda duplicar a definição do módulo em cada um dos temas. O âmbito dos módulos globais, como o
nome indica, abrange todos os temas.)
 
Se os módulos de temas são a escolha adequada às suas necessidades, segue-se um resumo da sintaxe de .json:
(NOTA: Esta descrição tem um esquema correspondente na pasta de contribuições/esquema, que pode ser utilizado
com uma ferramenta de validação de esquema para verificar um ficheiro de contribuição de formato JSON).

- Um objecto único com uma matriz modules (requerida). (Um objecto em notação .json é {} e uma matriz em
  notação .json é []):

	{
		"modules": [
		]
	}
	
  - De 1 a n objectos na matriz modules, cada um deles com uma cadeia id (requerida), uma cadeia version (opcional),
    uma matriz capabilities (opcional), uma matriz prereqs (opcional), uma matriz contributions (requerida*),
    uma matriz titles (opcional) e uma matriz descriptions (opcional):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*NOTA:  Também é válido ter um módulo constituído apenas por um id e uma matriz prereqs, além dos outros
		membros opcionais, mas sem contribuições.  Este é um "meta-module", que pode ser utilizado para abstrair uma dependência
		noutro módulo concreto.  Um módulo válido tem de ter pré-requisitos e/ou contribuições.
		
     - um valor de cadeia para id, tal como "my_module", em que o valor corresponde ao id exclusivo do módulo. Este valor
       é o que irá apresentar num perfil para activar o módulo.

     - um valor de cadeia numérica para a versão, tal como "1.0", em que o valor corresponde ao número da versão do módulo.

     - de 1 a n objectos na matriz capabilities, cada um deles com uma cadeia id (requerida)
       e uma cadeia value (requerida). Cada valor id indica o id da capacidade que este módulo
       expõe, e cada valor value indica o número da versão da capacidade:

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - de 1 a n objectos na matriz prereqs, cada um deles com uma cadeia id (requerida). Cada valor id indica o id
       do módulo que é pré-requisito para o seu módulo:

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - de 1 a n objectos na matriz contributions, cada um deles com uma cadeia type de "head", "config" ou "menu"
       (requerida) e uma matriz sub-contributions (requerida). "head" significa que a contribuição de recurso aparecerá
       na parte superior da página. "config" significa que a contribuição de recurso aparecerá no corpo da página.
       "menu" significa que a contribuição de recurso aparecerá como parte de um menu contextual na página:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - de 1 a n objectos na matriz sub-contributions, cada um deles com uma cadeia type (requerida)
         e uma matriz uris (requerida). Se o tipo de contribuição for "head", o tipo de sub-contribuição terá de ser "css" ou
         "js". Se o tipo de contribuição for "config", o tipo de sub-contribuição terá de ser "js", "markup", "config_static"
         ou "config_dynamic". Se o tipo de contribuição for "menu", o tipo de sub-contribuição terá de ser "json":

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - de 1 a n objectos na matriz uris, cada um deles com uma cadeia value (requerida),
           uma cadeia deviceClass (opcional), um cadeia type (opcional) e uma cadeia lang (opcional).
           A cadeia value corresponde a um caminho relativo à pasta principal do seu tema no WebDAV. deviceClass,
           se especificado, significa que o recurso será incluído apenas para determinado dispositivos que correspondam.
           O valor de deviceClass pode ser uma classe de dispositivo única, tal como "smartphone", ou uma equação de
           classes de dispositivos, tal como "smartphone+ios". type, se especificado, corresponde a "debug", "rtl" ou
           "debug,rtl". "debug" significa que o recurso é incluído apenas se a depuração remota estiver activada e o respectivo
           caminho de valor é, geralmente, para a versão descomprimida do recurso. "rtl" significa que o recurso
           é incluído apenas se a configuração regional do utilizador for bidireccional, tal como Hebraico, em que o texto
           na página é apresentado da direita para a esquerda. lang, se especificado, significa que o recurso é incluído
           apenas se a configuração regional do utilizador corresponder ao lang especificado:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - de 1 a n objectos na matriz titles, cada um deles com uma cadeia value (requerida) e uma cadeia lang
       (requerida). Estas definem o título ou o nome de apresentação do módulo, tal como irá aparecer em determinadas
       partes do Portal como, por exemplo, na portlet Analisador de temas, em todos os idiomas
       necessários:

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - de 1 a n objectos na matriz descriptions, cada um deles com uma cadeia value (requerida) e uma cadeia lang
       (requerida). Estas definem a descrição do módulo, tal como irá aparecer em determinadas
       partes do Portal como, por exemplo, na portlet Analisador de temas, em todos os idiomas
       necessários:

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Sempre que adicionar um ficheiro a esta pasta 'contributions' ou efectuar uma alteração, terá de invalidar
a cache do agregador de recursos para que o WebSphere Portal recolha as alterações.
Para tal, pode aceder a Administração -> Analisador de temas -> Utilitários -> Control Center.
Na página Control Center, faça clique na ligação sob 'Invalidar cache'.

Assim que definir o novo módulo, terá de adicioná-lo a um perfil para activá-lo.
Para obter mais instruções sobre perfis, leia o ficheiro readme.txt que se encontra na pasta 'profiles'.

Se tiver problemas de sintaxe no ficheiro .json ou problemas a colocar o novo módulo em funcionamento, utilize a
portlet Analisador de temas para limitar o problema. Aceda a Administração -> Analisador de temas -> Relatório de validação
e examine e tome medidas em relação às mensagens de erro e de aviso.

Além disso, pode consultar a documentação no wiki para obter ainda mais informações sobre a sintaxe de .json, uma vez que existe um
ficheiro de esquema .json disponível que mostra todas as sintaxes possíveis e o qual pode executar com o seu .json
através de um validador de .json online, para verificar se está sintacticamente correcto. 



Visão Geral Módulos Tema (Inglês) **********************

Esta pasta 'contributos' no WebDAV é uma pasta bem definido pelo WebSphere Portal para fornecer módulos de tema para a estrutura agregador de recursos. Dentro desta pasta é um arquivo .json por módulo ou conjunto de módulos, criar seu próprio arquivo .json para seu próprio módulo ou conjunto de módulos. Você pode copiar, renomear e modificar um dos arquivos .json existentes para ver e aprender a sintaxe .json que é necessário.

os módulos são com escopo definido para seu Tema um tema. Se você deseja utilizar alguns destes módulos mesmo em diferentes temas, você tem que copiar esses arquivos .json definição de módulo a partir de um tema para o outro.

Observe que há uma forma ainda mais fácil criar módulos, chamada módulos simples, utilizando o 'Módulos' da pasta.
Ambos são com escopo definido para seu um tema. A sintaxe .json do módulo de tema permite algumas coisas mais avançadas que você não pode fazer com módulos simples, tais como:

-declarando um número de versão para o seu módulo utilizando as equações, classe de dispositivo como oposição a apenas as classes de dispositivo individual, declarando que um pré-requisito – é opcional utilizando tipos de contribuição de config_static e config_dynamic.

Mas, se você não precisa dessas coisas mais avançada, na maioria dos casos, você provavelmente preferir utilizar módulos simples.

Para obter instruções adicionais sobre módulos simples ler o arquivo readme.txt dentro dos módulos' da pasta.

(Além disso, observe que há terceira forma de criar seus próprios módulos, referidos como módulos globais, através de arquivos plugin.xml na pasta ' ' WEB-INF dentro de aplicativos corporativos (da .ear). Dessa forma envolve o trabalho mais, portanto você não faria isso a menos que você tenha uma boa razão, como para um módulo que é reutilizada em vários temas e você não deseja duplicar a definição do módulo em cada um dos temas. módulos Global, como o nome implica, são com escopo em todos os temas.)
 
Se os módulos de tema é a escolha certa para suas necessidades, um resumo da sintaxe .json é o seguinte: (NOTA: Esta descrição possui um esquema correspondente no esquema contribuições/ pasta, que pode ser utilizado com uma ferramenta de validação de esquema para verificar um arquivo de contribuição do JSON-formato).

-Um único objeto com uma matriz de módulos (obrigatório). (Um objeto em notação .json é {} e uma matriz em notação .json é []):

	{ "Módulos": [ ] }
	
  -1 para n objetos dentro da matriz módulos, cada um com uma cadeia de id (requerido), uma cadeia de versão (opcional), uma matriz de recursos (opcional), uma matriz prereqs (opcional), uma matriz contribuições (requerido*), uma matriz títulos (opcional) e uma matriz de descrições (opcional):

        "Módulos": [ { "id":"my_module", "version":version=", "recursos": [ ], "prereqs": [ ], "contribuições": [ ], "títulos": [ ], "descrições": [ ] } ]
		
		*NOTA: Ele também é válido ter um módulo que consiste apenas de um id e uma matriz prereqs, além dos outros membros opcionais, mas não as contribuições.  Isso é um "meta-module" que podem ser utilizados para abstrair uma dependência em algum outro módulo concreto.  Um módulo válido deve ter um ou ambos os pré-requisitos e contribuições.
		
     -valor de uma cadeia para id, como "my_module", em que o valor é o id exclusivo do seu módulo. Este valor é o que você irá listar em um perfil para ativar o módulo no.
       
     -um valor numérico para cadeia de versão, como "1,0", em que o valor é o número da versão de seu módulo.
       
     -1 para n objetos dentro da matriz recursos, cada um com uma sequência de id (requerido) e uma cadeia de valor (obrigatório). Cada valor id indica o id do recurso que esse módulo expõe, e cada valor valor indica o número da versão do recurso:
       
				"recursos": [ { "id":"my_capability", "value":version=" } ],
       
     -1 para n objetos dentro da matriz prereqs, cada um com uma cadeia de id (requerido). Cada valor id indica o id do módulo que seu módulo pre-requires:
       
				"Pré-requisitos": [ { "id":"my_base_module" } ],
       
     -1 para n objetos dentro da matriz contribuições, cada um com uma cadeia de tipo "head", "config" ou "menu" (obrigatório) e uma matriz de contribuições (obrigatório). "head" significa que a contribuição de recurso vai na cabeça da página. "config" significa que a contribuição de recurso vai no corpo da página.
       menus de "menu", a contribuição de recursos irá como parte de um menu de contexto na página:

				"contribuições": [ { "type":"cabeça", "sub-contributions": [ ] } ],
       
       -1 para n objetos dentro da matriz de contribuições, cada um com um tipo de sequência (requerido) e uma matriz uris (obrigatório). Se o tipo de contribuição é "head", tipo de contribuição deve ser "css" ou "js". Se o tipo de contribuição é "config", tipo de contribuição deve ser "js", "markup", "config_static" ou "config_dynamic". Se o tipo de contribuição é "menu", tipo de contribuição deve ser "json":
       
						"sub-contributions": [ { "type":"css", "uris":[ ] } ]
       
         -1 para n objetos dentro da matriz uris, cada um com uma cadeia value (requerido), uma cadeia deviceClass (opcional), uma cadeia de tipo (opcional) e uma cadeia lang (opcional).
           A cadeia de valor é um caminho relativo para a pasta principal do tema no WebDAV. deviceClass, se especificado, significa que o recurso só será incluído para determinados dispositivos que correspondem.
           O valor de deviceClass pode ser uma classe de dispositivo único, como "smartphone" ou uma equação classe de dispositivo, como "smartphone ios". Tipo, se especificado, é um de "debug", "rtl" ou "debug,rtl". "depurar" significa que o recurso está incluído apenas se a depuração remota estiver em, e seu valor do caminho é geralmente para a versão descompactada do recurso. "rtl" significa que o recurso está incluída apenas se o código do idioma do usuário é um bidirecionais, como hebraico, onde o texto na página é apresentada da direita para a esquerda. lang, se especificado, significa que o recurso está incluída apenas se o código do idioma do usuário corresponde ao lang especificado:
       
								"uris": [ { "value":"/css/my_css.css" }, { "value":"/css/my_css.css.uncompressed.css", "type":"depurar" }, { "value":"/css/my_cssRTL.css", "type":"rtl" }, { "value":"/css/my_cssRTL.css.uncompressed.css", "type":"rtl,debug" }, { "value":"/css/my_css_smartphone.css", "deviceClass":"smartphone" }, { "value":"/js/my_js_es.js", "lang":"es" }
								]
       
     -1 para n objetos dentro da matriz títulos, cada um com um valor de sequência (obrigatório) e uma cadeia lang (obrigatório). Estes definem o título ou nome de exibição de seu módulo como ela aparecerá em certas partes do Portal como no portlet Theme Analyzer, em diferentes idiomas quantas você precisa:
       
				"títulos": [ { "valor":"Meu Módulo", "lang":"en" } ],
       
     -1 para n objetos dentro da matriz de descrições, cada um com um valor de cadeia (obrigatório) e uma cadeia lang (obrigatório). Estes definem a descrição de seu módulo como ela aparecerá em certas partes do Portal como no portlet Theme Analyzer, em diferentes idiomas quantas você precisa:
       
				"descrições": [ { "valor":"Um módulo que fornece funcionalidade xyz ", "lang":"en" } ]
       
Toda vez que você incluir um arquivo para essa pasta 'contributos' ou fazer uma alteração, você precisa invalidar a cache do agregador de recurso para o WebSphere Portal para assimilar as alterações.
Você pode fazer isso indo para Administração-> Theme Analyzer-> Utilitários-> Centro de Controle.
Na página centro de controle, clique no link sob 'Invalidar Cache'.

Depois de definir seu novo módulo, você precisará incluí-lo em um perfil para ativá-lo. 
Para obter instruções adicionais sobre perfis de ler o arquivo readme.txt no 'perfis' da pasta.

Se você tiver qualquer erro de sintaxe em seu .json ou problemas ao obter o novo módulo funcione, use o portlet Theme Analyzer para restringir o problema. Vá para Administração-> Theme Analyzer-> Validação de Relatório e analisar e tomar ações sobre o erro e mensagens de aviso.

Também é possível consultar a documentação do  wiki para ainda mais informações sobre a sintaxe .json, como a existência de um arquivo de esquema .json disponível que mostra todas as possíveis sintaxes e que você pode executar com o seu .json por meio de um validador .json online para verifica se está sintaticamente correto. 



Privire generală module temă (Engleză)
**********************

Acest folder al 'contribuţiilor' din WebDAV este un folder bine definit de WebSphere Portal pentru a furniza
module temă la cadrul de lucru agregator de resurse. În acest folder este câte un fişier .json pe modul sau set
de module - creaţi fişierul dumneavoastră propriu .json pentru propriul dumneavoastră modul sau set de module. Puteţi copia, redenumi şi modifica
unul dintre fişierele existente .json pentru a vedea şi învăţa sintaxa .json care este necesară.

Aceste module au ca domeniu doar o temă a dumneavoastră. Dacă doriţi să utilizaţi unele dintre aceleaşi module din teme diferite,
trebuie să copiaţi aceste fişiere .json de definiţie a modulului de la o temă la alta.

Notaţi că există un mod mai uşor de a crea module, denumite module simple, utilizând folderul 'module'.
Ambele au ca domeniu doar o temă a dumneavoastră. Sintaxa .json modulelor temă permit câteva lucruri mai avansate
pe care nu le puteţi face cu module simple, cum ar fi:

- declararea unui număr de versiune pentru modulul dumneavoastră
- utilizarea ecuaţiilor clasă dispozitiv ca opus la doar clase individuale dispozitiv
- declararea unui prereq că este opţional
- utilizarea tipurilor sub-contribuţie ale config_static şi config_dynamic.

Dar, dacă nu aveţi nevoie de aceste lucruri mai avansate, în cele mai multe cazuri veţi prefera utilizarea modulelor
simple.

Pentru alte instrucţiuni despre modulele simple citiţi fişierul readme.txt din folderul 'module'.

(Notaţi de asemenea că există un al treilea mod de a crea propriile dumneavoastră module, referite ca module globale, prin fişierele plugin.xml
din folderul 'WEB-INF' în aplicaţiile întreprindere (.ear's). Acest mod implică lucru cel mai mult,
deci să nu îl faceţi decât dacă aveţi un motiv bun, cum ar fi pentru un modul care este reutilizat în teme multiple
şi nu doriţi să duplicaţi definiţia modulului în fiecare dintre teme. Modulele globale, după cum le spune
numele, au ca domeniu toate temele.)
 
Dacă modulele temă sunt alegerea corectă pentru necesităţile dumneavoastră, un sumar al sintaxei .json este după cum urmează:
(NOTĂ:  Această descriere are o schemă de potrivire în folderul contribuţii/schemă, care poate fi utilizată
cu o unealtă de validare schemă pentru a verifica un fişier contribuţie JSON-format).

- Un obiect singur cu o matrice de module (necesar). (Un obiect în notaţia .json este {} şi o matrice în notaţia
  .json este []):

	{
		"modules": [
		]
	}
	
  - 1 la n obiecte din matricea de module, fiecare cu un şir ID (necesar), un şir versiune (opţional),
    o matrice capabilităţi (opţional), o matrice prereqs (opţional), o matrice contribuţii (necesar*),
    o matrice titluri (opţional) şi o matrice descrieri (opţional):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*NOTĂ:  Este de asemenea valid să aveţi un modul care constă doar într-un ID şi o matrice prereqs, plus alţi membrii
		opţionali , dar nicio contribuţie.  Acesta este un "meta-module" care poate fi utilizat pentru o prezentare pe scurt a unei dependenţe pe alte module concrete.  Un modul valid trebuie să aibă unul sau ambele dintre prereqs şi contribuţii. 		
     - o valoare şir pentru ID, cum ar fi "my_module", unde valoarea este ID-ul unic al modulului dumneavoastră. Această valoare este
       cea pe care o veţi menţiona într-un profil pentru a porni modulul dumneavoastră.

     - o valoare şir numerică pentru versiune, cum ar fi "1.0", unde valoarea este numărul versiunii modulului dumneavoastră.

     - 1 la n obiecte din matricea capabilităţi, fiecare cu un şir ID (necesar)
       şi un şir valoare (necesar). Fiecare valoare ID indică ID-ul capabilităţii pe care acest modul îl expune
       şi fiecare valoare indică numărul versiunii capabilităţii:

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 1 la n obiecte din matricea prereqs, fiecare cu un şir ID (necesar). Fiecare valoare ID indică ID-ul
       modulului pe care modulul dumneavoastră îl cere:

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - 1 la n obiecte din matricea contribuţii, fiecare cu un şir de tipul "head", "config" sau "menu"
       (necesar) şi o matrice subcontribuţii (necesar). "head" înseamnă că contribuţia resursă va trece
       în partea de sus a paginii. "config" înseamnă că contribuţia resursă va trece
       în corpul paginii. "menu" înseamnă că contribuţia resursă va merge ca parte componentă a meniului context al paginii:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 1 la n obiecte din matricea sub-contribuţii, fiecare cu un şir tip (necesar)
         şi o matrice uris (necesar). Dacă tipul contribuţiei este "head", tipul subcontribuţiei trebuie să fie "css" sau
         "js". Dacă tipul contribuţiei este "config", tipul subcontribuţiei trebuie să fie "js", "markup", "config_static"
         sau "config_dynamic". Dacă tipul contribuţiei este "menu", tipul subcontribuţiei trebuie să fie "json":

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - 1 la n obiecte din matricea uris, fiecare cu şir valoare (necesar),
           un şir deviceClass (opţional), un şir tip (opţional) şi un şir lang (opţional).
           Şirul valoare este o cale relativă la folderul principal temă  în WebDAV. deviceClass,
           dacă este specificat, înseamnă că resursa va fi inclusă doar pentru anumite dispozitive care se potrivesc.
           Valoarea deviceClass poate fi o clasă dispozitiv singură, cum ar fi "smartphone" sau o ecuaţie clasă
           dispozitiv, cum ar fi "smartphone+ios". Tipul, dacă este specificat, este unul dintr "debug", "rtl" sau
           "debug,rtl". "debug" înseamnă că resursa este inclusă doar dacă depanarea la distanţă este pornită şi valoarea căii
           sale este de obicei la versiunea necomprimată a resursei. "rtl" înseamnă că resursa este
           inclusă doar dacă locale-ul utilizatorului este unul bi-direcţional, cum ar fi Ebraică, unde textul
           pe pagină este prezentat de la dreapta la stânga. lang, dacă este specificat, însemană că resursa este inclusă doar
           dacă locale-ul utilizatorului se potriveşte lang-ului specificat:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - 1 la n obiecte din matricea titluri, fiecare cu un şir valoare (necesar) şi un şir lang
       (necesar). Acestea definesc titlul sau numele de afişare al modulului dumneavoastră aşa cum apare el în anumite părţi componente
       ale Portalului cum ar fi în portletul Analizor temă, în câte limbi diferite
       aveţi nevoie:

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - 1 la n obiecte din matricea descrieri, fiecare cu un şir valoare (necesar) şi un şir lang
       (necesar). Acestea definesc descrierea modulului dumneavoastră aşa cum apare el în anumite părţi componente
       ale Portalului cum ar fi în portletul Analizor temă, în câte limbi diferite
       aveţi nevoie:

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
De fiecare dată când adăugaţi un fişier la folderul 'contribuţii' sau faceţi o modificare, trebuie să invalidaţi
cache-ul agregator resursă pentru WebSphere Portal pentru a alege modificările.
Puteţi face aceasta prin deplasarea la Administrare -> Analizor temă -> Utilitare -> Centrul de control.
Pe pagina Centrul de control apăsaţi legătura de sub 'Invalidare cache'.

O dată c efinţi noul dumneavoastră modul, trebuie să-l adăugaţi la un profil pentru a îl porni.
Pentru alte instrucţiuni despre profiluri citiţi fişierul readme.txt din folderul 'profile'.

Dacă aveţi erori de sintaxă în .json-ul dumneavoastră sau probleme în a face să lucreze noul dumneavoastră modul, utilizaţi
portletul Analizor temă pentru a reduce problema. Deplasaţi-vă la Administrare -> Analizor temă -> Raport validare
şi examinaţi şi faceţi acţiuni pe eroare şi pe mesajele de avertisment.

De asemenea, vă puteţi referi la documentaţia wiki pentru chiar mai multe informaţii suplimentare despre sintaxa .json, cum ar fi există
un fişier schemă .json disponibil care afişează toate sintaxele posibile şi faptul că puteţi rula fişierul dumneavoastră .json
printr-un validator .json online pentru a verifica că este corect sintactic. 



Обзор модулей темы
**********************

Папка WebDAV 'contributions' предоставляет модули темы для среды
агрегатора ресурсов WebSphere Portal. В ней расположен один файл
.json для каждого модуля - создайте новый файл .json для
своего модуля или набора модулей. Можно скопировать,
переименовать и изменить один из существующих файлов .json, чтобы
получить общее представление о применяемом синтаксисе .json.

Эти модули относятся к одной теме. Для применения модулей в
других темах необходимо скопировать соответствующие файлы определений
.json из одной темы в другие. 

Обратите внимание, что предусмотрен более простой способ создания
модулей (простые модули) с помощью папки 'modules'.
Оба способа применяются на уровне одной темы. Синтаксис .json
модулей темы предлагает более широкие возможности по
сравнению с простыми модулями, например: 

- объявление номера версии модуля
- применение формул классов устройств в отличие от отдельных классов устройств
- объявление предварительных требований необязательными
- применение дочерних типов дополнений config_static и config_dynamic.

Если расширенные возможности не требуется, то рекомендуется
использовать простые модули. 

Дополнительные инструкции по работе с простыми модулями приведены в
файле readme.txt, расположенном в папке 'modules'.

(Кроме того, существует третий способ создания собственных (глобальных) модулей с
помощью файлов plugin.xml в папке 'WEB-INF' приложений Java EE
(.ear). Поскольку это самый трудоемкий способ, его рекомендуется
использовать только в исключительных случаях, например для
создания модуля, применяемого в нескольких темах, без дублирования
его определения в каждой теме. Глобальные модули доступны во
всех темах.) 
 
Если планируется использовать модули темы, ознакомьтесь с приведенным
ниже обзором синтаксиса .json:
(Примечание: это описание основано на схеме из папки contributions/schema,
которую можно использовать в инструменте проверки схемы для проверки
файла дополнений в формате JSON). 

- Отдельный объект с массивом modules (обязательный). (Объект в нотации .json обозначается с
помощью {}, массив в нотации .json - []):

	{
		"modules": [
		]
	}
	
  - Массив modules содержит 1 - n объектов, в каждом из которых
			 указана строка ИД (обязательная), строка версии, массив capabilities
			 (необязательный), массив prereqs (необязательный), массив
			 contributions (обязательный*), массив titles (необязательный) и
			 массив descriptions (optional): 

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*Примечание: можно создать модуль без дополнений, содержащий только
ИД и массив prereqs, а также другие необязательные элементы. Такой
модуль (метамодуль) описывает абстрактную зависимость от
другого фактического модуля. Допустимый модуль должен содержать
следующие предварительные требования и дополнения.

     - строка с уникальным ИД модуля, например "my_module". Это
       значение отображается в профайле при включении модуля.

     - строка с номером версии модуля, например "1.0".

     - массив capabilities содержит 1 - n объектов, в каждом из
       которых указана строка ИД (обязательная) и строка значения
       (обязательная). Каждый ИД представляет собой идентификатор
       функции, предоставляемой модулем, а значение - номер версии функции:


				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - массив prereqs содержит 1 - n объектов, в каждом из
       которых указана строка ИД (обязательная). Каждый ИД
       представляет собой идентификатор предварительно
       необходимого модуля:

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - Массив contributions содержит 1 - n объектов, в каждом из
       которых указана строка типа  "head", "config" или
       "menu" (обязательная) и массив sub-contributions (необязательный).
       Тип "head" указывает, что дополнение ресурса будет
       расположено в заголовке страницы. Тип "config" указывает,
       что дополнение ресурса будет расположено в теле страницы.
       Тип "menu" указывает, что дополнение ресурса будет добавлено в
       контекстное меню страницы:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - Массив sub-contributions содержит 1 - n объектов, в
         каждом из которых указана строка типа (обязательная) и строка массив
         uris (обязательный). Для типа дополнения
         "head" должен быть указан тип поддополнения "css" или "js". Для типа
         дополнения "config" должен быть указан тип поддополнения "js",
         "markup", "config_static" или "config_dynamic". Для типа дополнения
         "menu" должен быть указан тип поддополнения "json":

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - Массив titles содержит 1 - n объектов, в каждом из которых
           указана строка значения (обязательная), строка deviceClass (необязательная),
           строка типа (необязательная) и строка  языка (необязательная).
           Строка значения содержит относительный путь к основной
           папке темы в WebDAV. deviceClass позволяет ограничить набор
           устройств, к которым следует применять ресурс.
           В строке deviceClass можно указать отдельный класс (например
           "smartphone") или уравнение класса устройств (например
           "smartphone+ios"). В качестве типа можно указать значение "debug",
           "rtl" или "debug,rtl". Значение "debug" указывает, что ресурс
           добавляется только в том случае, если включена удаленная отладка;
           в этом случае, как правило, указывается путь к несжатой версии
           ресурса. Значение "rtl" указывает, что ресурс
           добавляется только в том случае, если применяется
           двунаправленная локаль с направлением текста справа налево
           (например Иврит). Строка языка позволяет добавить ресурс
           только для конкретной локали:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - Массив titles содержит 1 - n объектов, в каждом из которых
       указана строка значения (обязательная) и строка языка (обязательная).
       Они задают заголовок или отображаемое имя модуля для
       отдельных компонентов портала, таких как портлет
       Анализатор темы, на разных языках:

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - Массив descriptions содержит 1 - n объектов, в каждом из которых указана
       строка значения (обязательная) и строка языка (обязательная). 
       Они задают описание модуля для отдельных компонентов портала,
       таких как портлет Анализатор темы, на разных языках:

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Каждый раз после добавления файла в папку 'contributions' или внесения
изменений необходимо аннулировать кэш агрегатора ресурсов, чтобы применить
изменения в WebSphere Portal. Для этого выберите Администрирование ->
Анализатор темы -> Утилиты -> Центр управления.
На странице Центр
управления щелкните на ссылке 'Аннулировать кэш'.

После создания модуль необходимо добавить в профайл для активации.
Дополнительные инструкции по работе с профайлами приведены в
файле readme.txt, расположенном в папке 'profiles'.

Для исправления синтаксических ошибок .json или неполадок, связанных
с запуском модуля, следует использовать портлет Анализатор темы. Выберите
Администрирование -> Анализатор темы -> Отчет о проверке и
обработайте сообщения об ошибках и предупреждения.

В вики доступна дополнительная информация о синтаксисе
.json, например файл схемы .json со всеми возможными вариантами
синтаксиса. Кроме того, с помощью агента проверки .json
можно проверить правильность синтаксиса собственных файлов
.json. 



Prehľad modulov tém (slovenčina)
**********************

Táto zložka 'contributions' vo WebDAV je dobre definovaná zložka produktom WebSphere Portal na poskytnutie modulov témy pre kostru agregátora prostriedkov. V tejto zložke existuje jeden súbor .json pre každý modul alebo množinu modulov - vytvorte vlastný súbor .json pre svoj vlastný modul alebo množinu modulov. Ak si chcete pozrieť vyžadovanú syntax súboru .json a oboznámiť sa s ňou, môžete skopírovať, premenovať a upraviť jeden z existujúcich súborov .json. 

Moduly témy majú nastavený rozsah na vašu jednu tému. Ak chcete niektoré z týchto modulov použiť v iných témach, musíte skopírovať súbory .json s definíciou týchto modulov z jednej témy do druhej. 

Upozorňujeme, že existuje ešte jednoduchší spôsob vytvárania modulov pomocou zložky 'modules' a nazýva sa jednoduché moduly. V oboch prípadoch je rozsah nastavený na vašu jednu tému. Syntax .json modulov témy vám umožňuje vykonať niekoľko viac rozšírených akcií, ktoré nemôžete robiť pri jednoduchých moduloch. Príklad:

- deklarovanie čísla verzie pre váš modul,
- používanie rovníc triedy zariadenia namiesto samotných individuálnych tried zariadenia,
- deklarovanie, že požiadavka je voliteľná,
- používanie typov podkontribúcie config_static a config_dynamic.

Ak nepotrebujete tieto rozšírené voľby, vo väčšine prípadov zrejme uprednostníte jednoduché moduly.

Podrobný návod k jednoduchým modulom nájdete v súbore readme.txt v zložke 'modules'.

(Upozorňujeme tiež, že existuje tretí spôsob vytvárania vlastných modulov, ktorý sa nazýva globálne moduly. Využíva súbory plugin.xml v zložke 'WEB-INF' v podnikových aplikáciách (súbory .ear). Tento spôsob obnáša najviac práce a nemali by ste ho použiť, ak na to nemáte dobrý dôvod. Vhodný scenár použitia je ten, ak máte modul, ktorý sa opakovane používa vo viacerých témach a nechcete duplikovať definíciu modulu v každej z tém. Globálne moduly majú rozsah na všetky témy, ako implikuje ich názov.)
 
Ak sú moduly témy to, čo potrebujete, pozrite si súhrn syntaxe .json:
(POZNÁMKA: Tento opis má zodpovedajúcu schému v zložke contributions/schema, ktorú možno použiť v nástroji na validáciu schémy a skontrolovať súbor kontribúcie vo formáte JSON). 

- Jeden objekt s poľom modules (povinné). (Objekt v notácii .json je {} a pole v notácii .json je []):

	{
		"modules": [
		]
	}
	
  - 1 až n objektov v poli modulov, pričom každý má reťazec id (povinné), reťazec version (voliteľné), pole capabilities (voliteľné), pole prereqs (voliteľné), pole contributions (povinné*), pole titles (voliteľné) a pole descriptions (voliteľné):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*POZNÁMKA: Je tiež dovolené mať modul, ktorý obsahuje iba id a pole prereqs plus iné voliteľné členy, ale žiadne pole contributions.  Toto je "meta-modul", ktorý možno použiť na zhrnutie závislosti od iného konkrétneho modulu. Platný modul musí mať zadané jedno z polí
prereqs a contributions alebo obe. 		

     - reťazcová hodnota pre id, napríklad "my_module", kde hodnota je jedinečné ID vášho modulu. Toto je hodnota, ktorú uvediete v module kvôli jeho aktivácii.

     - číselná reťazcová hodnota pre version, napríklad "1.0", kde hodnota je číslo verzie vášho modulu.

     - 1 až n objektov v poli capabilities, pričom každý má reťazec id (povinné) a reťazec hodnoty (povinné). Každá hodnota id označuje ID schopnosti, ktorú zverejňuje tento modul, a každá hodnota value označuje číslo verzie schopnosti:

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 1 až n objektov v poli prereqs, pričom každý má reťazec id (povinné). Každá hodnota id označuje ID modulu, ktorý vyžaduje váš modul:

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - 1 až n objektov v poli contributions, pričom každý má reťazec type s hodnotou "head", "config" alebo "menu" (povinné) a pole sub-contributions (povinné). "head" znamená, že kontribúcia modulu pôjde do časti head strany. "config" znamená, že kontribúcia modulu pôjde do časti body strany. "menu" znamená, že kontribúcia modulu pôjde sa použije ako časť kontextovej ponuky na strane:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 1 až n objektov v poli sub-contributions, pričom každý má reťazec type (povinné) a pole uris (povinné). Ak je typ kontribúcie "head", typ podkontribúcie musí byť "css" alebo "js". Ak je typ kontribúcie "config", typ podkontribúcie musí byť "js", "markup", "config_static" alebo "config_dynamic". Ak je typ kontribúcie "menu", typ podkontribúcie musí byť "json":

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - 1 až n objektov v poli uris, pričom každý má reťazec value (povinné), reťazec deviceClass (voliteľné), reťazec type (voliteľné) a reťazec lang (voliteľné). Reťazec value je relatívna cesta k hlavnej zložke vašej témy vo WebDAV. Ak je zadané deviceClass, prostriedok sa zahrnie iba pre určité vyhovujúce zariadenia. Hodnota deviceClass môže byť jedna trieda zariadenia, napríklad "smartphone", alebo rovnica triedy zariadenia, napríklad "smartphone+ios". Ak je zadané type, môže mať hodnotu "debug", "rtl" alebo "debug,rtl". "debug" znamená, že prostriedok sa zahrnie, len ak je aktívne ladenie, a jeho hodnota cesty zvyčajne ukazuje na nekomprimovanú verziu prostriedku. "rtl" znamená, že prostriedok sa zahrnie, len ak sú miestne nastavenia užívateľa obojsmerné, napríklad hebrejčina, kedy sa text na strane zobrazuje sprava doľava. Ak je zadané lang, prostriedok sa zahrnie, len ak sa miestne nastavenia užívateľa zhodujú so zadaným lang:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_sk.js",
										"lang":"sk"
									}
								]
       
     - 1 až n objektov v poli titles, pričom každý má reťazec value (povinné) a reťazec lang (povinné). Tieto definujú nadpis alebo zobrazovaný názov vášho modulu, ako sa zobrazí v niektorých častiach Portal, napríklad v portlete Analyzátor tém, vo všetkých jazykoch, ktoré potrebujete:

				"titles": [
					{
						"value":"Môj modul",
						"lang":"sk"
					}
				],

     - 1 až n objektov v poli descriptions, pričom každý má reťazec value (povinné) a reťazec lang (povinné). Tieto definujú opis vášho modulu, ako sa zobrazí v niektorých častiach Portal, napríklad v portlete Analyzátor tém, vo všetkých jazykoch, ktoré potrebujete:

				"descriptions": [
					{
						"value":"Modul, ktorý poskytuje funkciu xyz",
						"lang":"sk"
					}
				]

Vždy, keď pridáte súbor do tejto zložky 'contributions' alebo spravíte zmenu, musíte anulovať pamäť cache agregátora prostriedkov pre WebSphere Portal, aby sa použili zmeny. Spravíte to výberom položky ponuky Administrácia -> Analyzátor tém -> Pomocné programy -> Riadiace centrum. Na strane Riadiace centrum kliknite na odkaz pod položkou Anulovať pamäť cache.

Po definovaní nového modulu ho musíte pridať do profilu, aby ste ho aktivovali. Podrobný návod k profilom nájdete v súbore readme.txt v zložke 'profiles'.

Ak máte vo svojom .json syntaktické chyby alebo váš nový modul neviete uviesť do činnosti, použite portlet Analyzátor tém a získajte viac informácií o probléme. Vyberte položku ponuky Administrácia -> Analyzátor tém ->
Prejsť do administrácie -> Analyzátor tém -> Hlásenie o validácii, preskúmajte chybové a varovné správy a vykonajte akciu. 

Pozrite si tiež dokumentáciu vo forme wiki, kde nájdete viac informácií o syntaxe .json. Dozviete sa, že je k dispozícii súbor schémy .json, ktorý uvádza všetky možné syntaxy a ktorý môžete spustiť so svojím súborom .json pomocou online validátora .json, aby ste spravili syntaktickú kontrolu. 



Pregled modulov teme (slovenščina)
**********************

Ta mapa 'contributions' v WebDAV je dobro definirana mapa izdelka WebSphere Portal, ki
ogrodju združevalnika virov zagotavlja module tem. V tej mapi je ena datoteka .json za vsak modul ali
nabor modulov – izdelajte svojo datoteko .json za lasten modul ali nabor modulov. Eno od obstoječih datotek .json lahko prekopirate,
preimenujete ali spremenite ter si tako ogledate in spoznate zahtevano skladnjo datoteke .json.

Obseg modulov tem je omejen na eno temo. Če želite nekaj teh istih modulov uporabiti v drugih temah,
morate definicijske datoteke .json za module prekopirati iz ene teme v drugo.

Upoštevajte, da je mogoče module izdelati na preprostejši način, imenovan preprosti moduli, in sicer z uporabo mape 'modules'.
Obseg obeh načinov je omejen na eno temo. Skladnja .json modulov tem omogoča nekatere napredne možnosti,
ki jih ni mogoče izvesti s preprostimi moduli, na primer:

- navedbo številke različice modula,
- uporabo enačb za razrede naprav in ne zgolj posameznih razredov naprav,
- navedbo izbirne predzahteve 'prereq',
- uporabo tipov nalog 'sub-conrubution' za config_static in config_dynamic.

Če ne potrebujete teh naprednih možnosti, boste v večini primerov verjetno raje uporabili preproste module.

Več navodil v zvezi s preprostimi moduli je na voljo v datoteki readme.txt v mapi 'modules'.

(Upoštevajte tudi, da lahko lastne module izdelate še na tretji način, imenovan globalni moduli, in sicer z datotekami plugin.xml
v mapi 'WEB-INF' v poslovnih aplikacijah (datoteke .ear). Ta način zahteva največ dela, zato ga boste verjetno uporabili le v primeru tehtnih razlogov,
npr. za modul, ki se uporablja v več različnih temah, pri čemer definicije modula ne
želite podvajati vsaki posamezni temi. Kot nakazuje ime, imajo globalni moduli
doseg čez vse teme.)
 
Če so za vaše potrebe prava izbira moduli tem, navajamo povzetek skladnje .json:
(OPOMBA: s tem opisom se ujema shema v mapi contributions/schema, ki jo je mogoče uporabljati
z orodjem za preverjanje shem, s katerim lahko preverite format .json datoteke prispevkov).

- En sam objekt z matriko modulov "modules" (obvezno). (V notaciji .json je objekt {} in matrika je []):

	{
		"modules": [
		]
	}
	
  - Od 1 do n objektov v matriki modulov, pri čemer ima vsak objekt niz za ID (obvezno), niz za različico (izbirno),
    matriko zmožnosti (izbirno), matriko predpogojev (izbirno), matriko prispevkov (obvezno*),
    matriko naslovov (izbirno) in matriko opisov (izbirno):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*OPOMBA: ustrezna je tudi uporaba modula, ki vsebuje le ID in matriko predpogojev ter druge izbirne člane,
		vendar ne vsebuje prispevkov. Gre za "meta-modul", s katerim povzamemo odvisnost od katerega drugega
		dejanskega modula. Veljaven modul mora imeti predpogoje ali prispevke oz. oboje.
		
     - Niz z vrednostjo za ID, npr. "my_module", kjer je vrednost unikatni ID modula. To je vrednost,
       ki jo navedete v profilu, da vklopite svoj modul.

     - Numerični niz z vrednostjo za različico, npr. "1.0", kjer je vrednost številka različice vašega modula.

     - Od 1 do n objektov v matriki zmožnosti, pri čemer ima vsak objekt niz za ID (obvezno) in niz za vrednost
       (obvezno). Vsaka vrednost ID-ja določa ID zmožnosti, ki jo razkrije ta
       modul, in vsaka vrednost za vrednost določa številko različice zmožnosti:

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],

     - Od 1 do n objektov v matriki predpogojev , pri čemer ima vsak objekt niz za ID (obvezno). Vsaka vrednost ID-ja določa ID
       modula, ki je predpogoj za vaš modul:

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],

     - Od 1 do n objektov v matriki prispevkov, pri čemer ima vsak objekt niz za tip, ki je lahko "head", "config" ali "menu"
       (obvezno) in matriko podprispevkov (obvezno). "head" pomeni, da bo prispevek vira umeščen v
       glavo strani. "config" pomeni, da bo prispevek vira umeščen v telo strani.
       "menu" pomeni, da bo prispevek vira umeščen kot del kontekstnega menija na strani:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - Od 1 do n objektov v matriki pod-prispevkov, pri čemer ima vsak objekt niz za tip (obvezno)
         in matriko uris (obvezno). Če je tip prispevka "head", mora biti tip podprispevka "css" ali
         "js". Če je tip prispevka "config", mora biti tip pod-prispevka "js", "markup", "config_static"
         ali "config_dynamic". Če je tip prispevka "menu", mora biti tip pod-prispevka "json":

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - Od 1 do n objektov v matriki uris, pri čemer ima vsak objekt niz za vrednost (obvezno),
           niz za razred naprave (izbirno), niz za tip (izbirno) in niz za jezik (izbirno).
           Niz za vrednost je je pot, ki je relativna glede na glavno mapo vaše teme v WebDAV.
           Če je podan razred naprave, to pomeni, da bo vir vključen le za določene ujemajoče se naprave.
           Vrednost za razred naprave je lahko en sam razred naprav, npr. "smartphone", lahko pa je enačba za
           razred naprav, npr. "smartphone+ios". Če je podan tip, je ena od vrednosti "debug", "rtl" ali
           "debug,rtl". "debug" pomeni, da je vir vključen le, če je vključeno oddaljeno razhroščevanje, njegova
           vrednost za pot pa običajno vodi do nestisnjene različice vira. "rtl" pomeni, da je vir vključen le, če je uporabniška
           področna nastavitev dvosmerna, npr. hebrejščina, kjer je besedilo na strani predstavljeno
           z desne proti levi. Če je podan jezik, to pomeni, da je vir vključen le, če je uporabnikova
           področna nastavitev enaka kot vrednost za jezik:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - Od 1 do n objektov v matriki naslovov, pri čemer ima vsak objekt niz za vrednost (obvezno) in
       niz za jezik (obvezno). Ti definirajo naslov ali ime za prikaz vašega modula, kot bo prikazan v določenih delih portala,
       npr. v portalskem programčku Analizator tem, in sicer v želenem številu različnih jezikov:

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],

     - Od 1 do n objektov v matriki opisov, pri čemer ima vsak objekt niz za vrednost (obvezno) in niz za jezik
       (obvezno). Ti definirajo opis vašega modula, kot bo prikazan v določenih delih portala, npr.
       v portalskem programčku Analizator tem, in sicer v želenem številu različnih jezikov:

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]

Vsakokrat, ko v mapo 'contributions' dodate datoteko oz. naredite spremembo, morate razveljaviti
predpomnilnik združevalnika virov, da bo WebSphere Portal upošteval spremembe.
To lahko storite tako, da se pomaknete do možnosti Skrbništvo -> Analizator tem -> Pripomočki -> Nadzorni center.
Na strani nadzornega centra kliknite povezavo pod 'Razveljavi predpomnilnik'.

Ko definirate nov modul, ga morate dodati profilu, če ga želite vklopiti.
Več navodil v zvezi s profili je na voljo v datoteki readme.txt v mapi 'profiles'.

Če so v datoteki .json skladenjske napake ali imate težave z delovanjem novega modula, uporabite portalski programček
Analizator tem, ki vam bo v pomoč pri določanju težave. Pojdite na Skrbništvo -> Analizator tem -> Poročilo o veljavnosti
in preučite ter ukrepajte v zvezi z napako in sporočili o napakah.

Poleg tega je v dokumentaciji wiki na voljo več informacij o skladnji .json, npr. datoteka .json s shemo,
ki prikazuje vse možne skladnje in ki jo lahko zaženete s svojo datoteko .json prek spletnega preverjevalnika
.json ter tako preverite, ali je skladenjsko pravilna.



Temamoduler - Översikt (svenska)
**********************

Mappen contributions i WebDAV är en WebSphere Portal-definierad mapp för temamoduler i ramverket för resursaggregering. I mappen finns en .json-fil per modul eller moduluppsättning. Skapa en egen .json-fil för din modul eller moduluppsättning. Du kan kopiera, byta namn på och ändra någon av de befintliga .json-filerna för att se och lära dig den .json-syntax som krävs. 

Temamoduler omfattar ett tema. Om du vill använda en del av dessa moduler i olika teman,
måste du kopiera .json-filerna med moduldefinitionen från ett tema till ett annat. 

Observera att det finns ett ännu enklare sätt att skapa moduler, som kallas enkla moduler, genom att använda modulmappen.
Båda har ett tema som omfattning. Med .json-syntaxen för temamoduler kan du göra en del mer avancerade saker som du inte kan göra med enkla moduler, exempelvis: 

- deklarera ett versionsnummer för din modul
- använda enhetsklassekvationer i stället för enbart enskilda enhetsklasser
- deklarera att en förutsättning är valfri
- använda delbidragstyperna config_static och config_dynamic.

Men om du inte behöver dessa mer avancerade objekt, föredrar du nog i de flesta fall att använda enkla moduler. 

Läs filen readme.txt i modulmappen om du vill ha ytterligare anvisningar för enkla moduler. 

(Observera också att det finns ett tredje sätt att skapa egna moduler, som kallas globala moduler, via plugin.xml-filer i mappen WEB-INF i företagsprogram (.ear-filer). Det här sättet är det mest arbetskrävande och är därför inget som du gör utan att ha ett bra skäl, t.ex. för en modul som återanvänds i flera teman och där du inte vill upprepa moduldefinitionen i vart och ett av dessa teman. Globala moduler omfattar som namnet antyder alla teman.
 
Om temamoduler är rätt val för dina behov, är .json-syntaxen i korthet följande:
(Anm.: Beskrivningen har ett motsvarande schema i mappen för bidrag/schema som kan användas med ett schemavalideringsverktyg för att kontrollera en JSON-formaterad bidragsfil.)

- Ett enda objekt med en modulmatris (obligatoriskt). (Ett objekt i .json-notation är {} och en matris i
  .json-notation är []):

	{
		"modules": [
		]
	}
	
  - 1-n objekt i modulmatrisen, som vardera har en ID-sträng (obligatoriskt), en versionssträng (valfritt),
    en funktionsmatris (valfritt), en förutsättningsmatris (valfritt), en bidragsmatris (obligatoriskt*),
    en namnmatris (valfritt) och en beskrivningsmatris (valfritt):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*Anm.:  Det är också giltigt att ha en modul som består av enbart ett ID och en förutsättningsmatris plus de övriga valfria medlemmarna, men inga bidrag.  Det här är en metamodul som kan användas för att abstrahera ett beroende på någon annan konkret modul. En giltig modul måste ha förutsättningar och/eller bidrag.
     - Ett strängvärde för ID, t.ex. "min_modul", där värdet är det unika IDt för din modul. Du anger
       det här värdet i en profil för att slå på modulen.

     - Ett numeriskt strängvärde för version, t.ex. "1.0", där värden är modulens versionsnummer.

     - 1-n objekt i funktionsmatrisen, som vardera har en ID-sträng (obligatoriskt)
       och en värdesträng (obligatoriskt). Varje ID-värde anger IDt för den funktion som modulen
       exponerar, och varje värde anger versionsnumret för funktionen:

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 1-n objekt i förutsättningsmatrisen, som vardera har en ID-sträng (obligatoriskt). Varje ID-värde anger IDt
       för den modul som din modul har som förutsättning:

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - 1-n objekt i bidragsmatrisen, som vardera har typsträngen "head", "config" eller "menu"
       (obligatoriskt) och en delbidragsmatris (obligatoriskt). "head" innebär att resursbidraget placeras
       i sidhuvudet. "config" innebär att resursbidraget placeras som brödtext på sidan.
       "menu" innebär att resursbidraget utgör en del av en snabbmeny på sidan:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 1-n objekt i en delbidragsmatris, som vardera har en typsträng (obligatoriskt) och en URI-matris (obligatoriskt). Om bidragstypen är "head", måste delbidragstypen vara "css" eller
         "js". Om bidragstypen är "config", måste delbidragstypen vara "js", "markup", "config_static"
         eller "config_dynamic". Om bidragstypen är "menu", måste delbidragstypen vara "json":

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - 1-n objekt i URI-matrisen, som vardera har en värdesträng (obligatoriskt),
           en deviceClass-sträng (valfritt), en typsträng (valfritt) och en språksträng (valfritt).
           Värdesträngen är en relativ sökväg till temats huvudmapp i WebDAV. deviceClass,
           Om den anges innebär det att resursen endast inkluderas för vissa enheter som matchar.
           Värdet för deviceClass kan vara en enkel enhetsklass, t.ex. "smartphone", eller en
           enhetsklassekvation, t.ex. "smartphone+ios". Om typ anges är det "debug", "rtl" eller
           "debug,rtl". "debug" innebär att resursen endast inkluderas om fjärrfelsökning är på, och dess
           värdesökväg brukar vara till den okomprimerade versionen av resursen. "rtl" innebär att resursen
           endast inkluderas om användarens språkmiljö är dubbelriktad, t.ex. hebreiska, där texten på sidan
           visas från höger till vänster. Om lang anges innebär det att resursen endast inkluderas om användarens
           språkmiljö matchar det angivna språket:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - 1-n objekt i namnmatrisen, som vardera har en värdesträng (obligatoriskt) och en språksträng
       (obligatoriskt). Dessa definierar titeln eller visningsnamnet på modulen så som det visas i vissa delar av portalen, t.ex. i portleten Temaanalys, på så många olika språk som du
       behöver:

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - 1-n objekt i beskrivningsmatrisen, som vardera har en värdesträng (obligatorisk) och en språksträng (obligatorisk). Dessa definierar beskrivningen av modulen så som den kommer att visas i vissa
       delar av portalen, exempelvis i portleten Temaanalys, på så många olika språk som du behöver:

				"descriptions": [
					{
						"value":"En modul som tillhandahåller xyz-funktioner",
						"lang":"en"
					}
				]

Varje gång du lägger till en fil i den här bidragsmappen eller gör en ändring, måste du ogiltigförklara resursaggregeringscachen för WebSphere Portal så att ändringarna plockas upp.
Du kan göra detta genom att gå till Administration -> Temaanalys -> Verktyg -> Kontrollcenter.
På sidan Kontrollcenter klickar du på länken under Ogiltigförklara cache.

När du har definierat en ny modul måste du lägga till den i en profil och slå på den.
Läs filen readme.txt i profilmappen om du behöver ytterligare anvisningar för profiler.

Om det finns några syntaxfel i din .json eller om du har problem med att få din nya modul att fungera, använder du portleten Temaanalys för att avgränsa problemet. Gå till Administration -> Temaanalys -> Valideringsrapport
och granska och vidta åtgärder för fel- och varningsmeddelanden. 

Du kan också använda wikidokumentation för att få ännu mer information om .json-syntaxen, exempelvis
att det finns en .json-schemafil som visar alla möjliga syntaxer, och du kan köra din egen .json
igenom en onlinefunktion för .json-validering för att verifiera att den har korrekt syntax. 



Theme Modules Overview (English)
**********************

This 'contributions' folder within WebDAV is a well defined folder by WebSphere Portal to provide
theme modules to the resource aggregator framework. Within this folder is one .json file per module or set
of modules - create your own .json file for your own module or set of modules. You can copy, rename and
modify one of the existing .json files in order to see and learn the .json syntax that is required.

Theme modules are scoped to your one theme. If you want to use some of these same modules in different themes,
you have to copy these module definition .json files from one theme to the other.

Note that there is an even easier way to create modules, called simple modules, using the 'modules' folder.
Both are scoped to your one theme. The .json syntax of the theme modules allows for a few more advanced 
things that you cannot do with simple modules, such as:

- declaring a version number for your module
- using device class equations as opposed to just individual device classes
- declaring that a prereq is optional
- using sub-contribution types of config_static and config_dynamic.

But, if you do not need those more advanced things, in most cases you will probably prefer using simple
modules.

For further instructions on simple modules read the readme.txt file within the 'modules' folder.

(Also note that there is third way to create your own modules, referred to as global modules, via plugin.xml
files within the 'WEB-INF' folder within enterprise applications (.ear's). This way involves the most work, 
so you would not do it unless you have good reason, such as for a module that is reused across multiple 
themes and you don't want to duplicate the module definition in each of the themes. Global modules, as the 
name implies, are scoped across all themes.)
 
If theme modules is the right choice for your needs, a summary of the .json syntax is as follows:
(NOTE:  This description has a matching schema in the contributions/schema folder, which can be used
with a schema validation tool to verify a JSON-format contribution file).

- A single object with a modules array (required). (An object in .json notation is {} and an array in
  .json notation is []):

	{
		"modules": [
		]
	}
	
  - 1 to n objects within the modules array, each with an id string (required), a version string (optional),
    a capabilities array (optional), a prereqs array (optional), a contributions array (required*), 
    a titles array (optional) and a descriptions array (optional):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*NOTE:  It is also valid to have a module which consists only of an id and a prereqs array, plus the other 
		optional members, but no contributions.  This is a "meta-module" which can be used to abstract a dependency
		on some other concrete module.  A valid module must have one or both of prereqs and contributions.
		
     - a string value for id, such as "my_module", where the value is the unique id of your module. This value
       is what you will list in a profile to turn your module on.
       
     - a numeric string value for version, such as "1.0", where the value is the version number of your module.
       
     - 1 to n objects within the capabilities array, each with an id string (required)
       and a value string (required). Each id value indicates the id of the capability that this module
       exposes, and each value value indicates the version number of the capability:
       
				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 1 to n objects within the prereqs array, each with an id string (required). Each id value indicates the id
       of the module that your module pre-requires:
       
				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - 1 to n objects within the contributions array, each with a type string of "head", "config" or "menu"
       (required) and a sub-contributions array (required). "head" means the resource contribution will go
       in the head of the page. "config" means the resource contribution will go in the body of the page.
       "menu" menus the resource contribution will go as part of a context menu on the page:
       
				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 1 to n objects within the sub-contributions array, each with a type string (required)
         and a uris array (required). If contribution type is "head", sub-contribution type must be "css" or 
         "js". If contribution type is "config", sub-contribution type must be "js", "markup", "config_static"
         or "config_dynamic". If contribution type is "menu", sub-contribution type must be "json":
       
						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - 1 to n objects within the uris array, each with a value string (required), 
           a deviceClass string (optional), a type string (optional) and a lang string (optional).
           The value string is a path relative to your theme's main folder in WebDAV. deviceClass,
           if specified, means that the resource will only be included for certain devices that match.
           The value of deviceClass can be a single device class, such as "smartphone", or a device
           class equation, such as "smartphone+ios". type, if specified, is one of "debug", "rtl" or
           "debug,rtl". "debug" means the resource is only included if remote debugging is on, and its
           value path is usually to the uncompressed version of the resource. "rtl" means the resource
           is only included if the user's locale is a bi-directional one, such as Hebrew, where text
           on the page is presented from right-to-left. lang, if specified, means the resource is only
           included if the user's locale matches the lang specified:
       
								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - 1 to n objects within the titles array, each with a value string (required) and a lang string
       (required). These define the title or display name of your module as it will appear in certain
       parts of Portal such as in the Theme Analyzer portlet, in as many different languages as you
       need:
       
				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - 1 to n objects within the descriptions array, each with a value string (required) and a lang string
       (required). These define the description of your module as it will appear in certain
       parts of Portal such as in the Theme Analyzer portlet, in as many different languages as you
       need:
       
				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Any time that you add a file to this 'contributions' folder or make a change, you need to invalidate
the resource aggregator cache for WebSphere Portal to pick up the changes.
You can do this by going to Administration -> Theme Analyzer -> Utilities -> Control Center.
On the Control Center page click the link under 'Invalidate Cache'.

Once you define your new module, you need to add it to a profile to turn it on. 
For further instructions on profiles read the readme.txt file within the 'profiles' folder.

If you have any syntax errors in your .json or problems getting your new module to work, use the
Theme Analyzer portlet to narrow down the problem. Go to Administration -> Theme Analyzer -> Validation Report
and examine and take action on the error and warning messages.

Also, you can refer to the wiki documentation for even more information on the .json syntax, such as there is 
a .json schema file available that shows all of the possible syntaxes and that you can run with your .json
through an online .json validator to verify that it is syntactically correct. 



Tema Modüllerine Genel Bakış (Türkçe)
*************************************

WebDAV içindeki bu 'contributions' klasörü, kaynak toplayıcı çerçevesine tema modülleri
sağlamak için WebSphere Portal tarafından 'iyi' tanımlanmış bir klasördür. Bu klasörde modül
başına ya da bir modül kümesi başına tek bir .json dosyası vardır; kendi modülünüz ya da
modül kümeniz için kendi .json dosyanızı yaratın. Gereken .json sözdizimini görmek ve öğrenmek için,
var olan .json dosyalarından birini kopyalayabilir, yeniden adlandırabilir ve değiştirebilirsiniz.

Tema modülleri tek temanızı kapsar. Bu modüllerden bazılarını farklı temalarda kullanmak
isterseniz, bu modül tanımlaması .json dosyalarını bir temadan diğerine kopyalamalısınız.

Modül yaratmak için, 'modules' klasörünün kullanıldığı, yalın modüller adı verilen daha kolay
bir yol da vardır.  Her iki yol da tek temanızı kapsar. Tema modüllerinin .json sözdizimi,
yalın modüllerin sağlamadığı, ileri düzey birkaç olanak sağlar, örneğin: 

- modülünüz için bir sürüm numarası bildirme
- tekli aygıt sınıflarının tersine, aygıt sınıfı eşitliklerini kullanma
- bir önkoşulu isteğe bağlı olarak bildirme
- config_static ve config_dynamic alt katkı tiplerini bildirme 

Ancak, bu ileri düzey özelliklere gereksiniminiz yoksa, çoğu zaman yalın modülleri tercih
edersiniz. 

Yalın modüllerle ilgili ek yönergeler için 'modules' klasöründeki readme.txt dosyasını okuyun.

Kendi modüllerinizi yaratmanın, genel modüller adı verilen üçüncü bir yolu da vardır;
bu yolda, kurumsal uygulamalar (.ear'ler) içindeki 'WEB-INF' klasöründe
bulunan plugin.xml dosyaları kullanılır. En fazla çabayı gerektiren yol bu olduğundan,
iyi bir nedeniniz olmadıkça (örneğin, birden çok temada kullanılan bir modül söz
konusuysa ve modül tanımlamasını temaların her birinde yinelemek istemiyorsanız),
bu yolu kullanmazsınız. Adından da anlaşılacağı gibi, genel modüller tüm temaları kapsar. 
 
Tema modülleri gereksinimleriniz için doğru seçimse, .json sözdizimi aşağıdaki gibidir:
(NOT: Bu açıklamada, JSON biçimli bir katkı dosyasını doğrulamak için şema geçerlilik
denetimi araçlarıyla kullanılabilecek, contributions/schema klasöründe eşleşen bir şema
vardır.) 

- 'modules' dizisini içeren tek bir nesne (gereklidir). (.json gösteriminde bir nesne {} ve
  bir dizi [] olarak tanımlanır):

	{
		"modules": [
		]
	}
	
  - 'modules' dizisi içinde 1 - n nesne; her birinin bir id dizgisi (gerekli), version dizgisi
    (isteğe bağlı), capabilities dizisi (isteğe bağlı), prereqs dizisi (isteğe bağlı, contributions
    dizisi (gerekli*), titles dizisi (isteğe bağlı) ve descriptions dizisi (isteğe bağlı) olur:

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*NOT: Yalnızca bir id ve bir prereqs dizisi artı isteğe bağlı diğer üyelerden oluşan, ancak
  herhangi bir katkı içermeyen bir modül de geçerlidir. Böyle bir modül, diğer bir somut modüle
  bağımlılığı soyutlamak için kullanılabilecek bir "meta modül"dür. Geçerli bir modülün hem
		önkoşulları (prereqs) hem de katkıları (contributions) olmalıdır.

     - id için bir dizgi değeri (örneğin, "my_module"); burada değer, modülünüzün benzersiz
       tanıtıcısıdır. Modülünüzü açmak için bir profilde bu değeri listelersiniz.

     - version için, "1.0" gibi sayısal bir dizgi değeri; burada değer, modülünüzün
       sürüm numarasıdır.

     - capabilities dizisi içinde 1 - n nesne; bunların her birinin bir id dizgisi (gerekli)
       ve bir value dizgisi (gerekli) vardır. Her id değeri, bu modülün ortaya koyduğu yeteneğin
       tanıtıcısıdır ve her value, yeteneğin sürüm numarasını gösterir:

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - prereqs dizisi içinde 1 - n nesne; bunların her birinin bir id dizgisi (gerekli) vardır.
       Her id değeri, modülünüz için önkoşul olan modülün tanıtıcısını gösterir:

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - contributions dizisi içinde 1 - n nesne; her birinin "head", "config" ya da "menu"
       olan bir tip dizgisi (gerekli) ve bir sub-contributions dizisi (gerekli) vardır. "head",
       kaynak katkısının sayfanın başına yerleşeceğini gösterir. "config", kaynak katkısının
       sayfanın gövde kısmına yerleşeceğini gösterir. "menu" ise, kaynak katkısının sayfadaki
       bir bağlam menüsünün bir parçası olarak yerleşeceğini gösterir:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - sub-contributions dizisi içinde 1 - n nesne; her birinin bir tip dizgisi (gerekli) ve
         bir uris dizisi (gerekli) vardır. Katkı (contribution) tipi "head" ise, alt katkı
         (sub-contribution) tipi "css" ya da "js" olmalıdır. Katkı tipi "config" ise, alt katkı
         tipi "js", "markup", "config_static" ya da "config_dynamic" olmalıdır. Katkı tipi "menu"
         ise, alt katkı tipi "json" olmalıdır:

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - uris dizisi içinde 1 - n nesne; her birinin bir value dizgisi (gerekli), deviceClass
           dizgisi (isteğe bağlı), type dizgisi (isteğe bağlı) ve lang dizgisi (isteğe bağlı) vardır.
           value dizgisi, temanızın WebDAV'daki ana klasörüyle göreli yoldur. deviceClass,
           belirtilirse, kaynağın ancak eşleşen belirli aygıtlar için içerileceği anlamına gelir.
           deviceClass değeri "smartphone" gibi tek bir aygıt sınıfı ya da "smartphone+ios" gibi
           bir aygıt sınıfı eşitliği olabilir. type, belirtilirse, "debug", "rtl" ya da "debug,rtl"
           değerlerinden biridir. "debug", aygıtın ancak uzaktan hata ayıklama açıksa içerileceğini
           gösterir ve değer yolu genellikle, kaynağın sıkıştırılmamış sürümüdür. "rtl", kaynağın
           ancak, kullanıcının ülke değeri iki yönlü ise (örneğin, sayfadaki metnin sağdan sola
           gösterildiği İbranice) içerileceği anlamına gelir. lang belirtilirse, kaynağın ancak,
           kullanıcının ülke değeri belirtilen dil ile eşleşirse içerileceği anlamına gelir:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - titles dizisi içinde 1 - n nesne; her birinin bir value dizgisi (gerekli) ve bir lang
       dizgisi (gerekli) vardır. Bunlar, Portal'ın Tema Analizci gibi belirli bazı kısımlarında
       gösterileceği şekilde ve gerek duyduğunuz sayıdaki farklı dillerde, modülünüzün başlığını
       ya da görüntü adını belirler:

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - descriptions dizisi içinde 1 - n nesne; her birinin bir value dizgisi (gerekli) ve bir lang
       dizgisi (gerekli) vardır. Bunlar, Portal'ın Tema Analizci gibi belirli bazı kısımlarında
       gösterileceği şekilde ve gerek duyduğunuz sayıdaki farklı dillerde, modülünüzün tanımını
       belirler:

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Bu 'contributions' klasörüne dosya eklediğinizde ya da bir değişiklik yaptığınızda, WebSphere
Portal'ın değişiklikleri alması için kaynak toplayıcı önbelleğini geçersiz kılmalısınız.
Bunu yapmak için Denetim -> Tema Analizci -> Yardımcı Programlar -> Denetim Merkezi'ne gidin.
Denetim Merkezi sayfasında 'Önbelleği Geçersiz Kıl' altındaki bağlantıyı tıklatın.

Yeni modülünüzü tanımladıktan sonra, modülü açmak için bir profile eklemeniz gerekir.
Profillerle ilgili ek yönergeler için 'profiles' klasöründeki readme.txt dosyasını okuyun.

.json dosyasında sözdizimi hataları ya da yeni modülünüzün çalışmasını engelleyen sorunlar varsa,
sorunu yalıtmak için Tema Analizci portal uygulamacığını kullanın. Denetim -> Tema Analizci ->
Geçerlilik Denetimi Raporu kısmına gidip hata ve uyarı iletilerini inceleyerek gerekenleri yapın. 

.json sözdizimiyle ilgili daha fazla bilgi için viki belgelerine de bakabilirsiniz; olabilecek
tüm sözdizimlerini gösteren bir .json şema dosyası vardır. Bu dosyayı, çevrimiçi bir .json
geçerlilik denetleyicisini kullanarak .json dosyanızla birlikte çalıştırabilir ve dosyanızın
sözdizimini doğrulayabilirsiniz. 



Огляд модулів теми (українська)
**********************

Папка contributions у WebDAV, чітко визначена у WebSphere Portal, надає модулі теми для
середовища агрегатора ресурсів. У цій папці для кожного модуля або набору модулів є окремий
файл .json. Вам потрібно створити власний файл .json для свого модуля або набору модулів. Для цього
змініть один із існуючих файлів .json, щоб дізнатися, яким має бути формат файлу .json, і навчитися
правильно форматувати його.

Ці модулі призначено лише для однієї теми. Якщо деякі з них будуть потрібні також в інших темах,
необхідно скопіювати файл .json визначення відповідного модуля з однієї теми в іншу.

До речі, створювати модулі можна навіть ще простіше - за допомогою папки modules. У цей спосіб створюються
так звані "прості модулі".
Обидва способи призначено лише для однієї теми. Формат файлу .json модулів теми, на відміну від
простих модулів, дозволяє виконувати додаткові дії:

- оголошувати номер версії модуля;
- працювати з рівняннями класів пристроїв, а не просто з окремими класами пристроїв;
- оголошувати попередню умову необов'язковою;
- працювати з типами вкладених доповнень config_static і config_dynamic.

Але якщо в таких діях немає потреби, то майже завжди краще користуватися простими модулями.

Додаткові інструкції для роботи з простими модулями наведено у файлі readme.txt, що знаходиться в папці
modules.

(Слід зауважити на те, що створювати власні модулі можна ще одним способом - за допомогою файлів
plugin.xml, що знаходяться в папці WEB-INF прикладних програм J2EE (.ear). Третім способом
створюються "глобальні модулі". Це найбільш трудомісткий спосіб, тому користуватися ним
слід лише тоді, коли існує реальна потреба в цьому. Наприклад, щоб не копіювати визначення
модуля в кількох темах, якщо модуль використовуватиметься в кожному з них. Глобальні модулі,
як випливає з їхньої назви, діють в усіх темах.)
 
Якщо вам потрібні саме модулі теми, то узагальнену інформацію про формат файлу .json наведено нижче.
(ПРИМІТКА. Цей опис має відповідну схему в папці contributions/schema, за якою можна
перевіряти формат JSON файлу доповнень в інструменті перевірки схем).

- Один об'єкт із масивом модулів (є обов'язковим). (Об'єктом у форматі .json є {}, масивом у
  форматі .json є []):

	{
		"modules": [
		]
	}
	
  - Від 1 до n об'єктів у масиві модулів, кожен із рядком ідентифікатора (обов'язковий),
    рядком версії (необов'язковий), масивом функцій (необов'язковий), масивом попередніх вимог
    (необов'язковий), масивом доповнень (обов'язковий*), масивом заголовків (необов'язковий)
    і масивом описів (необов'язковий):

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*ПРИМІТКА. Модуль може складатися лише з ідентифікатора та масиву попередніх вимог,
		а також інших необов'язкових елементів, і не містити доповнень.  Це буде так званий "метамодуль",
		яким можна користуватися для абстракції залежності для будь-якого іншого окремого модуля.  Вірний модуль
		повинен мати одну або обидві попередні умови і доповнення.
		
     - Значення рядка id, наприклад "my_module", де значенням є унікальний ідентифікатор вашого
       модуля. Це значення буде вказано в профайлі для увімкнення модуля.

     - Значення числового рядка version, наприклад "1.0", де значенням є номер версії модуля.

     - Від 1 до n об'єктів у масиві функцій, кожен із рядком id (обов'язковий) і рядком
       value (обов'язковий). Кожне значення id визначає ідентифікатор функції, що надається
       цим модулем, а кожне значення value визначає номер версії функції:

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - Від 1 до n об'єктів у масиві попередніх вимог, кожен із рядком id (обов'язковий). Кожне
       значення id визначає ідентифікатор модуля, який є обов'язковим для нього відповідно до
       попередніх вимог:

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - Від 1 до n об'єктів у масиві доповнень, кожен із рядком типу "head", "config" або "menu"
       (обов'язковий) і масивом вкладених доповнень (обов'язковий). "head" означає, що доповнення
       ресурсу знаходитиметься в заголовку сторінки. "config" означає, що доповнення ресурсу
       знаходитиметься в заголовку сторінки.
       "menu" означає, що доповнення ресурсу знаходитиметься в складі контекстного меню на сторінці:

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - Від 1 до n об'єктів у масиві вкладених доповнень, кожен із рядком type (обов'язковий)
         і масивом uri (обов'язковий). Для типу доповнень "head" вкладені доповнення мають бути типу "css"
         або "js". Для типу доповнень "config" вкладені доповнення мають бути типу "js", "markup", "config_static"
         або "config_dynamic". Для типу доповнень "menu" вкладені доповнення мають бути типу "json":

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - Від 1 до n об'єктів у масиві uri, кожен із рядком value (обов'язковий), рядком
           deviceClass (необов'язковий), рядком type (необов'язковий) і рядком lang (необов'язковий).
           Рядком value є шлях відносно головної папки теми WebDAV. deviceClass, якщо вказано,
           означає, що ресурс буде включено лише для окремих відповідних пристроїв.
           Значенням deviceClass може бути окремий клас пристроїв, наприклад "smartphone", або
           рівняння класу пристроїв, наприклад "smartphone+ios". Значенням type, якщо вказано, є "debug",
           "rtl" або "debug,rtl". "debug" означає, що ресурс буде включено лише за умови, що
           увімкнено віддалене відлагодження; в шляху value зазвичай вказують нестиснуту версію ресурсу.           "rtl" означає, що ресурс буде включено лише за умови, що користувачем вибрано
           двонапрямну локаль, наприклад іврит, в якій текст на сторінці представлено справа
           наліво. lang, якщо вказано, означає, що ресурс буде включено лише за умови, що локаль
           користувача відповідає вказаній lang:

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - Від 1 до n об'єктів у масиві заголовків, кожен із рядком value (обов'язковий) і рядком
       lang (обов'язковий). Вони визначають заголовок або відображуване ім'я модуля, яке
       буде показано в певних частинах порталу, наприклад у портлеті Аналізатор тем, без обмеження
       кількості мов:

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - Від 1 до n об'єктів у масиві описів, кожен із рядком value (обов'язковий) і рядком
       lang (обов'язковий). Вони визначають опис модуля, який буде показано в певних частинах порталу,
       наприклад у портлеті Аналізатор тем, без обмеження кількості мов:

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
Під час кожного додавання файлу або внесення змін у папку contributions необхідно анулювати кеш
агрегатора ресурсів WebSphere Portal, щоб зміни набрали чинності.
Для цього виберіть Адміністрування -> Аналізатор тем -> Службові програми -> Центр керування.
На сторінці Центру керування перейдіть за посиланням "Анулювати кеш". 

Після визначення нового модуля його необхідно додати в профайл для увімкнення.
Додаткові інструкції для роботи з профайлами наведено у файлі readme.txt, що знаходиться в папці
profiles.

Якщо у файлі .json є синтаксичні помилки або створений модуль не працює, скористайтеся портлетом
Аналізатор тем, щоб звузити неполадку. Виберіть Адміністрування -> Аналізатор тем -> Звіт про
перевірку, перегляньте наведену інформацію і виконайте відповідні дії для усунення причини
помилки або попереджувального повідомлення.

У документації вікі наведено ще детальнішу інформацію про формат файлу .json. Наприклад, у ній знаходиться файл схеми .json, в якому представлено всі можливі формати і який можна запустити з файлом .json через мережевий модуль перевірки .json, щоб перевірити вірність формату. 



主题模块概述（简体中文）
**********************

WebDAV 中的该“contributions”文件夹是由 WebSphere Portal 明确定义的文件夹，可向资源聚集器框架提供各种主题模块。在此文件夹中，每个模块或每个模块集有一个 .json 文件 - 为自己的模块或模块集创建 .json 文件。您可以对其中某个现有 .json 文件进行复制、重命名和修改，以便查看并了解所需的 .json 语法。

主题模块限于一个主题。如果要在其他主题中使用部分相同的模块，必须将这些模块定义 .json 文件从一个主题复制到另一个主题。

注意，有一个更加简单的创建模块的方法，这种模块称为简单模块，并使用“modules”文件夹。
上述两种模块都限于一个主题。主题模块的 .json 语法允许使用更多高级功能，而简单模块无法使用这些高级功能，例如：

- 声明模块的版本号
- 使用与单个设备类相反的设备类公式
- 声明先决条件是可选的
- 使用 config_static 和 config_dynamic 的子添加项类型。

但是，如果您不需要这些高级功能，那么在多数情况下，您可能更愿意使用简单模块。

有关简单模块的更多指示信息，请阅读“modules”文件夹中的 readme.txt 文件。

（另请注意，还有第三种方法可创建您自己的模块，这种模块称为全局模块，通过企业应用程序 (.ear) 的“WEB-INF”文件夹中的 plugin.xml 文件创建。此方法涉及的操作最多，因此，仅当有必要时才使用此方法（例如，多个主题中需要一个可复用的模块，而您又不想在每个主题中复制该模块定义）。顾名思义，全局模块适用于所有主题。）
 
如果主题模块适合您的需求，那么 .json 语法摘要如下所示：
（注意：此描述在添加项/模式文件夹中有相匹配的模式，该模式可与模式验证工具一起使用以验证 JSON 格式的添加项文件）。

- 具有模块数组（必需）的单个对象。（.json 注释中的对象为 {}，而 .json 注释中的数组为 []）：

	{
		"modules": [
		]
	}
	
  - 模块数组中 1 至 N 个对象，每个对象有一个标识字符串（必需）、一个版本字符串（可选）、一个功能数组（可选）、一个先决条件数组（可选）、一个添加项数组（必需 *）、一个标题数组（可选）以及一个描述数组（可选）：

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*注意：如果模块仅由一个标识和一个先决条件数组，以及其他可选内容组成而不包括添加项，那么该模块也是有效的。这是“元模块”，可用于提取部分其他具体模块中的依赖关系。有效的模块必须有先决条件和/或添加项。
     - 标识的字符串值，例如“my_module”，其中的值是模块的唯一标识。该值将列示在可启用模块的概要文件中。

     - 版本的数字字符串值，例如“1.0”，其中的值是模块的版本号。

     - 功能数组中 1 至 N 个对象，每个对象有一个标识字符串（必需）以及一个值字符串（必需）。每个标识值表示该模块显示的功能标识，每个值值表示功能的版本号：

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - 先决条件数组中 1 至 N 个对象，每个对象有一个标识字符串（必需）。每个标识值表示模块必备的模块标识：

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - 添加项数组中 1 至 N 个对象，每个对象有类型为“head”、“config”或“menu”的字符串（必需）以及一个子添加项数组（必需）。“head”表示资源添加项将位于页首。“config”表示资源添加项将位于页面的正文中。
       “menu”表示资源添加项将位于页面的上下文菜单中：

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
       - 子添加项数组中 1 至 N 个对象，每个对象有一个类型字符串（必需）以及一个 URI 数组（必需）。如果添加项类型为“head”，那么子添加项类型必须为“css”或“js”。如果添加项类型为“config”，那么子添加项类型必须为“js”、“markup”、“config_static”或“config_dynamic”。如果添加项类型为“menu”，那么子添加项类型必须为“json”：

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - URI 数组中 1 至 N 个对象，每个对象有一个值字符串（必需）、一个 deviceClass 字符串（可选）、一个类型字符串（可选）以及一个语言字符串（可选）。
           值字符串是与 WebDAV 中主题的主文件夹相关的路径。 deviceClass（如果已指定）表示只有相匹配的特定设备才包含该资源。
           deviceClass 值可以是单个的设备类，例如“smartphone”，也可以是设备类公式，例如“smartphone+ios”。类型（如果已指定）可以是以下任何一个：“debug”、“rtl”或“debug,rtl”。“debug”表示仅当启用远程调试，并且值路径通常指向资源的未压缩版本时才包含该资源。“rtl”表示仅当用户的语言环境为双向时（例如，希伯来语，该语言文本在页面上从右至左显示）才包含该资源。语言（如果已指定）标识仅当用户的语言环境与指定的语言相匹配时才包含该资源：

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - 标题数组中 1 至 N 个对象，每个对象有一个值字符串（必需）以及一个语言字符串（必需）。这些字符串定义了模块在门户网站的特定部分中（例如，主题分析器 portlet）以各种所需的语言显示时的标题或显示名称：

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
     - 在描述数组中 1 至 N 个对象，每个对象有一个值字符串（必需）以及一个语言字符串（必需）。这些字符串定义了模块在门户网站的特定部分中（例如，主题分析器 portlet）以各种所需的语言显示时的描述：

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
每当向该“contributions”文件夹添加文件或进行更改时，您需要将 WebSphere Portal 的资源聚集器高速缓存设定为无效才能使更改生效。
您可以通过转至管理 -> 主题分析器 -> 实用程序 -> 控制中心来执行上述操作。
在“控制中心”页面上单击“将高速缓存设定为无效”下的链接。

定义了新的模块之后，您需要将其添加到概要文件才能开启。
有关概要文件的更多指示信息，请阅读“profiles”文件夹中的 readme.txt 文件。

如果您的 .json 中存在任何语法错误或者您对使用新的模块有任何问题，请使用主题分析器 portlet 来缩小问题所在的范围。转至管理 -> 主题分析器 -> 验证报告，然后查看错误和警告消息并执行相应操作。

另外，您可以参考 Wiki 文档，以获取有关 .json 语法的更多信息（例如，有一个 .json 模式文件，该文件显示了所有可能使用的语法，并可通过在线 .json 验证程序与 .json 一起运行以验证语法是否正确）。



佈景主題模組概觀（繁體中文）
****************************

WebDAV 中的此 'contributions' 資料夾是 WebSphere Portal 定義良好的資料夾，
用於為資源聚集器架構提供佈景主題模組。在此資料夾中，包含每個模組或模組集的一個
.json 檔案 - 建立用於您的專屬模組或模組集的專屬 .json 檔案。您可以複製、重新命名和修改
現有 .json 檔案之一，以便查看並瞭解所需的 .json 語法。

佈景主題模組的範圍限定為您的一個佈景主題。如果您要在不同的佈景主題中
使用這些相同模組中的某些模組，則必須將這些模組定義
.json 檔案從該佈景主題複製到其他佈景主題。

請注意，還有一個更輕鬆的建立成為簡式模組之模組的方法，那就是使用 'modules' 資料夾進行。
這兩種模組的範圍都限制為您的一個佈景主題。佈景主題模組的 .json 語法
可讓您執行使用簡式模組無法實現的較進階功能，例如：

- 宣告模組的版本號碼
- 使用裝置類別方程式，而不僅僅是個別裝置類別
- 宣告某必備項目是選用的
- 使用子要素項類型 config_static 和 config_dynamic。

不過，如果您不需要這些較進階功能，則在大多數情況下，您可能喜好使用簡式模組。

如需簡式模組的進一步指示，請閱讀 'modules' 資料夾中的 readme.txt 檔案。

（另請注意，還有另一種建立您的專屬模組（稱為廣域模組）的方法，
其透過企業應用程式 (.ear) 內 'WEB-INF' 資料夾中的 plugin.xml
檔進行。此方法的工作量最大，因此，除非您有充分的理由
（例如對於要在多個佈景主題中重複使用的模組，您不想在每個佈景主題中複製模組定義），
否則您不會採用該方法。顧名思義，廣域模組的範圍設定為所有G佈景主題之間。）
 
如果佈景主題模組最適合您的需要，.json 語法的摘要如下所示：
（附註：此說明在 contributions/schema 資料夾下有相符的綱目，
這些綱目可與綱目驗證工具一起使用來驗證 JSON 格式的要素項檔案）。

- 具有模組陣列的單一物件（必要）。（在 .json 表示法中，物件是 {}，
 在 .json 表示法中，陣列是 []）：

	{
		"modules": [
		]
	}
	
  - modules 陣列中的 1 到 n 個物件，每個物件都有一個 ID 字串（必要）、一個版本字串（選用）、
    一個 capabilities 陣列（選用）、一個 prereqs 陣列（選用）、一個 contributions 陣列（必要*）、
    一個 titles 陣列（選用）和一個 descriptions 陣列（選用）：

        "modules": [
			{
				"id":"my_module",
				"version":"1.0",
				"capabilities": [
				],
				"prereqs": [
				],
				"contributions": [
				],
				"titles": [
				],
				"descriptions": [
				]
			}
		]
		
		*附註：具有僅包含一個 id 陣列和一個 prereqs 陣列、加上其他參數但是沒有 contributions 的模組也是有效的。
		這種模組是「meta 模組」，可用來抽象對某些其他具體模組的相依關係。 有效的模組必須具有 prereqs 及/或 contributions。
		
     - id 的字串值，例如 "my_module"，該值是您的模組的唯一 ID。
       您將在設定檔中列出此值以開啟您的模組。

     - 版本的數值字串值，例如 "1.0"，該值是您的模組的版本號碼。

     - modules 陣列中的 1 到 n 個物件，每個物件都有一個 id 字串（必要）
       和一個值字串（必要）。每個 ID 值指出此模組實現的功能，
       每個值指出功能的版本號碼：

				"capabilities": [
					{
						"id":"my_capability",
						"value":"1.0"
					}
				],
       
     - prereqs 陣列中的 1 到 n 個物件，每個物件都有一個 id 字串（必要）。每個 ID 值指出作為模組必備項目之模組的 ID：

				"prereqs": [
					{
						"id":"my_base_module"
					}
				],
       
     - contributions 陣列中的 1 到 n 個物件，每個物件都具有 type 字串 "head"、"config" 或 "menu"
       （必要）以及一個 sub-contributions 陣列（必要）。"head" 表示資源要素項將進入
       頁面的標頭。"config" 表示資源要素項將進入頁面的主體。
       "menu" 表示資源要素項將進入頁面上的快速功能表：

				"contributions": [
					{
						"type":"head",
						"sub-contributions": [
						]
					}
				],
       
     - sub-contributions 陣列中的 1 到 n 個物件，每個物件都有一個 type 字串（必要）
       和一個 uris 陣列（必要）。如果要素項類型是 "head"，則子要素項類型必須是 "css" 或
         "js"。如果要素項類型是 "config"，則子要素項類型必須是 "js"、"markup"、"config_static"
         或 "config_dynamic"。如果要素項類型是 "menu"，則子要素項類型必須是 "json"：

						"sub-contributions": [
							{
								"type":"css",
								"uris":[
								]
							}
						]
       
         - uris 陣列中的 1 到 n 個物件，每個物件都有一個 value 字串（必要）、
           一個 deviceClass 字串（選用）、一個 type 字串（選用）和一個 lang 字串（選用）。
           value 字串是相對於佈景主題主要資料夾的路徑。deviceClass
           如果指定，則表示將僅對某些相符的裝置包括該資源。
           deviceClass 的值可以是裝置類別（例如 "smartphone"），,
           也可以是類別方程式（例如 "smartphone+ios"）。type 如果指定，
           則是 "debug"、"rtl" 或 "debug,rtl" 之一。"debug" 表示僅當已開啟遠端除錯時，
           才包括該資源，並且其值路徑一般指向資源的已解壓縮版本。"rtl" 表示
           僅當使用者的語言環境是雙向語言環境（例如希伯來文，其頁面上的文字從右向左表示）時，
           才包括該資源。lang 如果指定，則表示僅當使用者的語言環境與指定的語言環境相符時，
           才包括該資源：

								"uris": [
									{
										"value":"/css/my_css.css"
									},
									{
										"value":"/css/my_css.css.uncompressed.css",
										"type":"debug"
									},
									{
										"value":"/css/my_cssRTL.css",
										"type":"rtl"
									},
									{
										"value":"/css/my_cssRTL.css.uncompressed.css",
										"type":"rtl,debug"
									},
									{
										"value":"/css/my_css_smartphone.css",
										"deviceClass":"smartphone"
									},
									{
										"value":"/js/my_js_es.js",
										"lang":"es"
									}
								]
       
     - titles 陣列中的 1 到 n 個物件，每個物件都有一個 value 字串（必要）和一個 lang 字串
       （必要）。這些物件定義模組在入口網站的特定組件中（例如在佈景主題分析器 Portlet 中）採用所需數目的不同語言顯示的標題或顯示名稱：

				"titles": [
					{
						"value":"My Module",
						"lang":"en"
					}
				],
       
    - descriptions 陣列中的 1 到 n 個物件，每個物件都有一個 value 字串（必要）和一個 lang 字串
       （必要）。這些物件定義模組在入口網站的特定組件中（例如在佈景主題分析器 Portlet 中）採用所需數目的不同語言顯示的說明：

				"descriptions": [
					{
						"value":"A module that provides xyz functionality",
						"lang":"en"
					}
				]
       
當您將檔案新增至此 'contributions' 資料夾或進行變更時，您需要使
WebSphere Portal 的資源聚集器快取失效才用套用變更。
為此，請執行以下動作：
移至「管理」->「佈景主題分析器」->「公用程式」->「控制中心」。
在「控制中心」頁面上，按一下「使快取失效」鏈結。

定義新模組之後，您需要將它新增至設定檔以將其開啟。
如需設定檔的進一步指示，請閱讀 'profiles' 資料夾中的 readme.txt 檔案。

如果您的 .json 中有任何語法錯誤或讓新模組工作時發生問題，
請使用佈景主題分析器 Portlet 來縮小問題的範圍。跳至「管理」->「佈景主題分析器」->「驗證報告」，
然後檢查錯誤和警告訊息並採取動作。

此外，您可以參閱 Wiki 文件來取得有關 .json 語法的更多資訊，例如有一個
.json 綱目檔會顯示所有可能的語法，您可以透過線上 .json 驗證器與您的
.json 一起執行它，以驗證您的 .json 的語法正確。



