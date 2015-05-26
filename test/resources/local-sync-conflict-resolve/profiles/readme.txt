Profiles Overview (English)
*****************

This 'profiles' folder within WebDAV is a well defined folder by WebSphere Portal to define which set of 
modules should get loaded by the resource aggregator framework for particular themes and pages. Within this 
folder is one .json file per profile - create your own .json file for your own profile. You can copy, rename
and modify one of the existing .json files in order to see and learn the .json syntax that is required.

Once you define your profiles, you can assign one to be the default profile for the entire theme.
Refer to "Changing the theme default profile" in the wiki documentation for the ways to do this. 
And/or, you can also override the default profile for certain pages by assigning a different profile 
for certain pages. Do this through the page's Page Properties -> Advanced -> Theme Settings -> Profile
setting, or refer to "Setting a profile override on a page" in the wiki documentation for additional ways
to do this.

A summary of the .json syntax is as follows:

- A single object with a moduleIDs array (required), a deferredModuleIDs array (required),
  a titles array (optional) and a descriptions array (optional). (An object in .json notation is {} and 
  an array in .json notation is []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 to n strings within the moduleIDs array, where each string is a module id, representing those modules
    that the system should load in all page modes including view mode:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 to n strings within the deferredModuleIDs array, where each string is a module id, representing those 
    modules that the system should defer loading until only certain pages modes such as edit mode:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - 1 to n objects within the titles array, each with a value string (required) and a lang string
    (required). These define the title or display name of your profile as it will appear in certain
    parts of Portal such as in the Page Properties dialog and Theme Analyzer portlet, in as many different 
    languages as you need:
       
		"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
  - 1 to n objects within the descriptions array, each with a value string (required) and a lang string
    (required). These define the description of your profile as it will appear in certain
    parts of Portal such as in the Page Properties dialog and Theme Analyzer portlet, in as many different 
    languages as you need:
       
		"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
Any time that you modify a .json file in this 'profiles' folder, you need to invalidate
the resource aggregator cache for WebSphere Portal to pick up the changes.
You can do this by going to Administration -> Theme Analyzer -> Utilities -> Control Center.
On the Control Center page click the link under 'Invalidate Cache'.

If you have any syntax errors in your .json or problems getting your profiles to work, use the
Theme Analyzer portlet to narrow down the problem. Go to Administration -> Theme Analyzer -> Validation Report
and examine and take action on the error and warning messages. You can also analyze details of what is going on 
with the profile of any page by going to Administration -> Theme Analyzer -> Examine page profile information,
and details of what is going on with the modules of any profile by going to 
Administration -> Theme Analyzer -> Examine modules by profile.



مقدمة عن ملفات المواصفات (العربية)
************************

تعد حافظة 'profiles' التي توجد في WebDAV حافظة معرفة بواسطة WebSphere Portal لتعريف مجموعة وحدات البرامج التي يجب تحميلها بواسطة اطار عمل أداة تجميع المصادر لنسق رئيسية وصفحات معينة. في هذه الحافظة يوجد ملف .json واحد لكل ملف مواصفات - قم بتكوين ملف .json الخاص بك لملف المواصفات الخاص بك. يمكنك نسخ واعادة تسمية وتعديل أحد ملفات .json الموجودة حاليا حتى يمكن مشاهدة ومعرفة صيغة .json المطلوبة.

بمجرد القيام بتعريف ملفات المواصفات، يمكنك تخصيص أي منها لكي يكون ملفات المواصفات المفترض للنسق الرئيسي بالكامل.
ارجع الى "تغيير ملف المواصفات المفترض للنسق الرئيسي" في وثيقة wiki لمعرفة الطرق الخاصة بالقيام بذلك.
كما يمكنك احلال ملف المواصفات المفترض لصفحات معينة من خلال تخصيص ملف مواصفات مختلف لصفحات معينة. يمكن القيام بذلك من خلال خصائص الصفحة -> متقدم -> محددات النسق الرئيسي -> محددات ملف المواصفات، أو ارجع الى
"تحديد احلال ملف مواصفات في صفحة" في وثيقة wiki لمعرفة طرق اضافية للقيام بذلك.  

ملخص صيغة .json يكون كما يلي:

- عنصر واحد ذو متجه moduleIDs (مطلوب)، متجه deferredModuleIDs (مطلوب)،
  متجه عناوين (اختياري) ومتجه وصف (اختياري). (العنصر في ترميز .json يكون {} والمتجه في ترميز
  .json يكون []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 الى n مجموعات حروف في متجه moduleIDs، حيث تكون كل مجموعة حروف عبارة عن كود وحدة برامج، تمثل وحدات  البرامج التي يجب أن يقوم النظام بتحميلها في كل أنماط الصفحات متضمنا نمط المشاهدة:  

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 الى n مجموعات حروف في متجه deferredModuleIDs، حيث تكون كل مجموعة حروف عبارة عن كود وحدة برامج، تمثل وحدات البرامج هذه التي يجب أن يقوم النظام بتأجيل تحميلها حتى يكون في نمط معين للصفحات مثل نمط التحرير:


        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - 1 الى n عنصر في متجه العناوين، كلا منها بمجموعة حروف قيمة (مطلوبة)
       ومجموعة حروف لغة (مطلوبة). يقوم ذلك بتعريف العنوان أو اسم العرض لملف المواصفات الخاص بك حيث سيظهر في أجزاء معينة من Portal مثل في مربع حوار خصائص الصفحة وأداة تحليل النسق الرئيسي، بأي عدد من اللغات وفقا لما يتطلبه الأمر:
		"العناوين": [
			{
				"القيمة":"ملف المواصفات الخاص بي",
				"اللغة":"en"
			}
		],

  - 1 الى n عنصر في متجه الوصف، كلا منها بمجموعة حروف قيمة (مطلوبة)
       ومجموعة حروف لغة (مطلوبة). يقوم ذلك بتعريف الوصف لملف المواصفات الخاص بك حيث سيظهر في أجزاء معينة من Portal مثل مربع حوار خصائص الصفحة و portlet أداة تحليل النسق الرئيسي، بأي عدد من اللغات وفقا لما يتطلبه الأمر:

		"الوصف": [
					{
						"القيمة":"ملف مواصفات يقدم الوظيفة xyz",
						"اللغة":"en"
					}
				]

في أي وقت تقوم بتعديل ملف .json في حافظة 'profiles' هذه، يجب أن تقوم بالغاء فاعلية الذاكرة الوسيطة لأداة تجميع المصادر الى WebSphere Portal لاحضار التغييرات.
يمكنك القيام بذلك من خلال الذهاب الى الادارة -> أداة تحليل النسق الرئيسي -> الوظائف -> مركز التحكم.
في صفحة مركز التحكم اضغط على الوصلة أسفل 'الغاء فعالية الذاكرة الوسيطة'.

اذا كان لديك أي أخطاء بالصيغة في ملف .json الخاص بك أو مشاكل بتشغيل ملفات المواصفات الخاصة بك،  استخدم portlet لأداة تحليل النسق الرئيسي لتقليل المشكلة. اذهب الى الادارة -> أداة تحليل النسق الرئيسي -> تقرير التحقق من الصلاحية وقم باجراء تصرف بالخطأ ورسائل التحذير. يمكنك تحليل التفاصيل لما يجري باستخدام ملف المواصفات لأي صفحة بالذهاب الى الادارة -> أداة تحليل النسق الرئيسي -> فحص معلومات ملف مواصفات الصفحة، وتفاصيل ما يتم بوحدات البرامج لأي ملف مواصفات من خلال الذهاب الى
الادارة -> أداة تحليل النسق الرئيسي -> فحص وحدات البرامج بواسطة ملف المواصفات. 



Visió general de perfils (Anglès)
*****************

Aquesta carpeta 'profiles' de WebDAV és una carpeta definida pel WebSphere Portal per definir el conjunt de mòduls que cal carregar per l'estructura d'agregador de recursos per a temes i pàgines determinats.
A dins d'aquesta carpeta hi ha un fitxer .json per perfil - creeu el fitxer .json per al vostre perfil. Podeu copiar, canviar el nom i modificar un dels fitxers .json existents per veure i aprendre la sintaxi de .json necessària.

Quan definiu els perfils, podeu assignar-ne com a perfil per defecte per a tot el tema.
Consulteu "Changing the theme default profile" a la documentació de la wiki per consultar com es pot fer.
També podeu alterar temporalment el perfil per defecte per a determinades pàgines assignant un perfil diferent.
Podeu fer-ho a Propietats de la pàgina -> Opcions avançades -> Paràmetres del tema -> Perfil o podeu consultar "Setting a profile override on a page" a la documentació de la wiki per consultar com es pot fer.


A continuació, es mostra un resum de la sintaxi .json:

- Un objecte únic amb matriu moduleIDs (necessari), una matriu deferredModuleIDs (necessari),
  una matriu de títols (opcional) i una matriu de descripcions (opcional). (Un objecte a una anotació .json és {} i una matriu a una anotació .json és []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - D'1 a n sèries de la matriu moduleIDs, on cada sèrie és un ID de mòdul que representa els mòduls que ha de carregar el sistema a tots els modes de pàgina, inclòs el mode de visualització:


        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - D'1 a n sèries de la matriu deferredModuleIDs, on cada sèrie és un ID de mòdul que representa els mòduls la càrrega dels quals el sistema ha de retardar fins que determinades pàgines estiguin en un mode concret, com ara mode d'edició:


        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - D'1 a n objectes de la matriu de títols, cadascun amb una sèrie de valor (necessari) i una sèrie de llenguatge (necessari).
Aquests elements defineixen el títol o el nom de visualització del perfil tal com apareixerà a determinades parts del Portal, com al diàleg Propietats de la pàgina i al portlet de l'analitzador de temes, en tants idiomes com sigui necessari:
"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
       - D'un a n objectes de la matriu de descripcions, cadascun amb una sèrie de valor (necessari)  i una sèrie d'idioma (necessari).
Aquests elements defineixen la descripció del perfil tal com apareixerà a determinades parts del Portal, com al diàleg Propietats de la pàgina i al portlet de l'analitzador de temes, en tants idiomes com sigui necessari:
"descriptions": [
			{
				"value":"Un perfil que proporciona la funcionalitat xyz",
				"lang":"en"
			}
		]

Cada cop que modifiqueu un fitxer .json a la carpeta 'profiles', heu d'invalidar la memòria cau de l'agregador de  recursos del WebSphere Portal per obtenir els canvis.
Ho podeu fer a Administració -> Analitzador de temes -> Utilitats -> Centre de control.
A la pàgina Centre de control, feu clic a l'enllaç a sota de 'Invalida la memòria cau'.

Si hi ha errors de sintaxi a .json o problemes per obtenir perfils que funcionin, utilitzeu el portlet de l'analitzador de temes per limitar el problema.
Aneu a Administració -> Analitzador de temes -> Informe de validació i examineu i realitzeu accions a l'error o als missatges d'advertiment.
Altrament, podeu analitzar la informació del que ha passat amb el perfil de qualsevol pàgina des d'Administració -> Analitzador de temes -> Examina la informació de perfil de pàgina i els detalls del que ha passat amb els mòduls de qualsevol perfil des d'Administració -> Analitzador de temes -> Examina els mòduls per perfil.



Přehled profilů (anglicky)
*****************

Tato složka 'profiles' ve WebDAV je dobře definovaná složka portálu WebSphere Portal, která definuje, jaká sada
modulů má být načtena rámcem agregátoru prostředků pro konkrétní motivy a stránky. V této složce
se nachází jeden soubor .json pro každý profil, pro vlastní profil tedy vytvořte vlastní soubor .json. Chcete-li
si prohlédnout a pochopit požadovanou syntaxi souboru .json, můžete zkopírovat, přejmenovat a upravit některý
z existujících souborů .json.

Po nadefinování vlastních profilů můžete jeden z nich přiřadit jako výchozí profil pro celý motiv.
Způsoby, jak to provést, naleznete v tématu "Změna výchozího profilu motivu" v dokumentaci na wikiwebu.
Případně můžete také přepsat výchozí profil pro některé stránky tím, že těmto stránkám přiřadíte jiný
profil. Provedete to pomocí volby Vlastnosti stránky -> Upřesnit -> Nastavení motivu -> Profil
dané stránky, případně některým z dalších postupů uvedených v tématu "Nastavení potlačení profilu na stránce"
v dokumentaci na wikiwebu.

Souhrn syntaxe souboru .json:

- Jednotlivý objekt s polem ID modulů (moduleIDs, povinné), polem ID odložených modulů (deferredModuleIDs, povinné),
  polem titulků (titles, volitelné) a polem popisů (descriptions, volitelné). (Objekt v notaci .json je {} a pole
  v notaci .json je []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 až n řetězců v poli ID modulů (moduleIDs), kde každý řetězec je ID modulu, představujících ty moduly, které
    by měl systém načíst ve všech režimech stránky včetně režimu zobrazení:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 až n řetězců v poli ID odložených modulů (deferredModuleIDs), kde každý řetězec je ID modulu, představujících ty moduly,
    jejichž načtení by měl systém odložit až na určité režimy stránky, např. režim úprav:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - 1 až n objektů v poli titulků (titles), každý s řetězcem hodnoty (value, povinné) a řetězcem jazyka
    (lang, povinné). Ty definují titulek nebo zobrazovaný název vašeho profilu, který se zobrazí v určitých
    částech portálu, jako např. v dialogovém okně Vlastnosti stránky a portletu Analyzátor motivů, v libovolném
    počtu jazyků:

		"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
  - 1 až n objektů v poli popisů (descriptions), každý s řetězcem hodnoty (value, povinné) a řetězcem jazyka
    (lang, povinné). Ty definují popis vašeho profilu, který se zobrazí v určitých částech portálu,
    jako např. v dialogovém okně Vlastnosti stránky a portletu Analyzátor motivů, v libovolném
    počtu jazyků:

		"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
Kdykoli upravíte soubor .json v této složce 'profiles', musíte zrušit platnost
mezipaměti agregátoru prostředků, aby portál WebSphere Portal načetl změny.
To provedete tak, že přejdete na volbu Administrace -> Analyzátor motivů -> Pomůcky -> Řídicí centrum.
Na stránce Řídicí centrum klepněte na odkaz v sekci 'Zrušit platnost mezipaměti'.

V případě chyb syntaxe v souboru .json nebo problémů s funkčností vašich profilů použijte k zúžení problému
portlet Analyzátor motivů. Přejděte na volbu Administrace -> Analyzátor motivů -> Sestava ověření,
prověřte chybové a varovné zprávy a proveďte příslušná opatření. Můžete také podrobně analyzovat, co se děje
s profilem libovolné stránky, a to pomocí volby Administrace -> Analyzátor motivů -> Prozkoumat informace
o profilu stránky, a co se děje s moduly libovolného profilu, a to pomocí volby
Administrace -> Analyzátor motivů -> Prozkoumat moduly podle profilu.



Oversigt over profiler
**********************

Folderen 'profiles' i WebDAV kendes fra WebSphere Portal og bruges til at definere, hvilket sæt moduler
der skal indlæses af strukturen i ressourceaggregatoren for bestemte temaer og sider. I denne folder er der en .json-fil
pr. profil - opret din egen.json fil til din egen profil. Du kan kopiere, omdøbe og ændre en af
de eksisterende .json-filer for at se og lære den .json-syntaks, der kræves. 

Når du har defineret dine profiler, kan du tildele én, der skal være standardprofil for hele temaet.
Du kan finde flere oplysninger om de forskellige metoder til at gøre det i wikidokumentationen om
ændring af temaers standardprofil.
Du kan også tilsidesætte standardprofilen for bestemte sider ved at tildele en anden profil til
disse sider. Det gør du via sidens Sideegenskaber -> Udvidet -> Temaindstillinger -> Profil. Du
kan også læse mere om andre metoder til at gøre dette i wikidokumentationens beskrivelse
af, hvordan man tilsidesætter en profil for en side. 

Kort fortalt er syntaksen i .json som følger:

- Et enkelt objekt med en moduleIDs-matrix (påkrævet), en deferredModuleIDs-matrix (påkrævet),
  en titles-matrix (valgfrit) og en descriptions-matrix (valgfrit). (Et objekt i .json-notation er {}, og en
  matrix i .json-notation er []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 til n strenge i moduleIDs-matrixen, hvor hver streng er en modul-id, der repræsenterer de moduler,
    som systemet skal indlæse i alle sidetilstande, herunder visningstilstand:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 til n strenge i deferredModuleIDs-matrixen, hvor hver streng er en modul-id, der repræsenterer de
    moduler, som systemet skal udskyde indlæsning af indtil bestemte sidetilstande, f.eks. redigeringstilstand:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - 1 til n objekter i titelmatrixen, hver med en værdistreng (påkrævet) og en sprogstreng
    (påkrævet). Disse strenge definerer titlen eller fremvisningsnavnet for din profil, som det optræder i
    visse dele af Portal, f.eks. dialogboksen Sideegenskaber og miniportalen Temaanalyse, på så mange forskellige
    sprog, som du har brug for:

		"titles": [
			{
				"value":"Min profil",
				"lang":"en"
			}
		],

  - 1 til n objekter i beskrivelsesmatrixen, hver med en værdistreng (påkrævet) og en sprogstreng
    (påkrævet). Disse strenge definerer beskrivelsen af din profil, som den optræder i
    visse dele af Portal, f.eks. dialogboksen Sideegenskaber og miniportalen Temaanalyse, på så mange forskellige
    sprog, som du har brug for:

		"descriptions": [
			{
				"value":"En profil, der leverer xyz-funktionalitet",
				"lang":"da"
			}
		]

Hver gang du ændrer en .json-fil i denne 'profiles'-folder, skal du ugyldiggøre
cachen til ressourceaggregatoren til WebSphere Portal for at hente ændringerne.
Det kan du gøre ved at gå til Administration -> Temaanalyse -> Hjælpeprogrammer -> Kontrolcenter.
Klik på linket under 'Ugyldiggør cache' på siden i Kontrolcenter.

Hvis du har syntaksfejl i din. json-fil, eller du har problemer med at få dine profiler til at fungere, skal du
bruge miniportalen til Temaanalyse til at indsnævre problemet. Gå til Administration -> Temaanalyse -> Valideringsrapport,
og undersøg og udfør handlinger på fejl- og advarselsmeddelelserne. Du kan også analysere oplysninger om, hvad der sker
med profilen for en side, ved at gå til Administration -> Temaanalyse -> Undersøg oplysninger om sideprofil. Og du kan
finde oplysninger om, hvad der sker med modulerne i en profil, ved at gå til Administration -> Temaanalyse -> Undersøg
moduler efter profil.



Überblick über Profile (Deutsch)
*****************

Der Ordner "profiles" in WebDAV wurde von WebSphere Portal ordnungsgemäß definiert, um festzulegen, welcher Modulsatz vom Ressourcenaggregatorframework für bestimmte Motive und Seiten geladen werden soll. In diesem Ordner befindet sich eine JSON-Datei pro Profil - erstellen Sie Ihre eigene JSON-Datei für Ihr eigenes Profil. Sie können eine der bestehenden JSON-Dateien kopieren, umbenennen und ändern, um die erforderliche JSON-Syntax anzuzeigen und zu erlernen.

Wenn Sie Ihre Profile definieren, können Sie eines der Profile als Standardprofil für das gesamte Motiv festlegen.
Anweisungen dazu finden Sie im Abschnitt zum Ändern des Standardprofils für ein Motiv in der Wiki-Dokumentation.
Alternativ oder zusätzlich können Sie das Standardprofil für bestimmte Seiten außer Kraft setzen, indem Sie bestimmten Seiten ein anderes Profil zuordnen. Wählen Sie dazu die Einstellungen "Seiteneigenschaften -> Erweitert -> Motiveinstellungen -> Profil" der Seite aus oder lesen Sie den Abschnitt zum Außerkraftsetzen eines Profils auf einer Seite in der Wiki-Dokumentation, in dem alternative Möglichkeiten beschrieben sind.

Im Folgenden finden Sie eine Zusammenfassung der JSON-Syntax:

- Ein einzelnes Objekt mit einer Feldgruppe "moduleIDs" (erforderlich), einer Feldgruppe "deferredModuleIDs" (erforderlich), einer Feldgruppe "titles" (optional) und einer Feldgruppe "descriptions" (optional). (In der JSON-Notation wird ein Objekt mit {} und eine Feldgruppe mit [] gekennzeichnet):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 bis n Zeichenfolgen innerhalb der Feldgruppe "moduleIDs", wobei jede Zeichenfolge eine Modul-ID ist, die die Module darstellt, die das System in allen Seitenmodi laden sollte (auch im Anzeigemodus):

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 bis n Zeichenfolgen innerhalb der Feldgruppe "deferredModuleIDs", wobei jede Zeichenfolge eine Modul-ID ist, die die Module darstellt, die das System in bestimmten Seitenmodi, z. B. im Bearbeitungsmodus, verzögert laden sollte:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
       - 1 bis n Objekte innerhalb der Feldgruppe "titles", jeweils mit einer Wertzeichenfolge (erforderlich) und der Zeichenfolge "lang" (erforderlich). Diese definieren den Titel oder den Anzeigenamen Ihres Profils wie er in bestimmten Teilen des Portals, z. B. im Dialog "Seiteneigenschaften" und im Portlet "Motivanalysefunktion" angezeigt wird - bei Bedarf auch in vielen verschiedenen Sprachen:

		"titles": [
			{
				"value":"Mein Profil",
				"lang":"en"
			}
		],

       - 1 bis n Objekte innerhalb der Feldgruppe "descriptions", jeweils mit der Zeichenfolge "value" (erforderlich) und der Zeichenfolge "lang" (erforderlich). Diese definieren die Beschreibung Ihres Profils wie sie in bestimmten Teilen des Portals z. B. im Dialog "Seiteneigenschaften" und im Portlet "Motivanalysefunktion" angezeigt wird - bei Bedarf auch in vielen verschiedenen Sprachen:

		"descriptions": [
			{
				"value":"Ein Profil, das die Funktion xyz bereitstellt",
				"lang":"en"
			}
		]

Immer wenn Sie eine JSON-Datei im Ordner "profiles" ändern, müssen Sie den Cachespeicher des Ressourcenaggregators für WebSphere Portal inaktivieren, um die Änderungen zu übernehmen.
Wählen Sie hierfür "Verwaltung -> Motivanalysefunktion -> Dienstprogramme -> Steuerzentrale" aus.
Klicken Sie auf der Seite "Steuerzentrale" auf den Link unter "Cachespeicher inaktivieren".

Wenn Ihre JSON-Datei Syntaxfehler enthält oder Ihre Profile nicht funktionieren, grenzen Sie das Problem mithilfe des Portlets "Motivanalysefunktion" ein. Wählen Sie "Verwaltung -> Motivanalysefunktion -> Prüfbericht" aus, um nach Fehlernachrichten und Warnhinweisen zu suchen und entsprechende Maßnahmen zu ergreifen. Sie können auch Details dazu analysieren, was mit Ihrem Profil auf einer beliebigen Seite geschieht. Rufen Sie dazu "Verwaltung -> Motivanalysefunktion -> Seitenprofilinformationen prüfen" auf. Informationen zu den Modulen eines beliebigen Profils können Sie über "Verwaltung -> Motivanalysefunktion -> Module nach Profil prüfen" abrufen.



Συνοπτική παρουσίαση προφίλ (Ελληνικά)
***************************

Αυτός ο φάκελος 'profiles' στο WebDAV είναι ένας φάκελος που ορίζεται από το WebSphere Portal και καθορίζει
ποιο σύνολο λειτουργικών μονάδων θα πρέπει να φορτώνεται από το πλαίσιο συγκρότησης πόρων (resource aggregator
framework) για συγκεκριμένα θέματα και σελίδες. Σε αυτόν το φάκελο υπάρχει ένα  αρχείο .json για κάθε
προφίλ και μπορείτε να δημιουργήσετε δικά σας αρχεία .json για τα δικά σας προφίλ. Μπορείτε
να αντιγράψετε, να μετονομάσετε και να τροποποιήσετε ένα από τα υπάρχοντα αρχεία .json για να μάθετε
την απαιτούμενη σύνταξη των αρχείων json. 

Αφού ορίσετε τα προφίλ σας, μπορείτε να ορίσετε ένα από αυτά ως προεπιλεγμένο για το θέμα.
Ανατρέξτε στο θέμα "Αλλαγή του προεπιλεγμένου προφίλ θέματος" στην τεκμηρίωση wiki για οδηγίες σχετικά με
αυτή την εργασία. Μπορείτε επίσης να ορίσετε ένα προφίλ διαφορετικό από το προεπιλεγμένο για συγκεκριμένες
σελίδες. Για να το ορίσετε, από τη σελίδα επιλέξτε Ιδιότητες σελίδας -> Πρόσθετες επιλογές -> Ρυθμίσεις θέματος
-> Προφίλ, ή ανατρέξτε στο θέμα "Ορισμός αντικατάστασης προφίλ σε σελίδα" για οδηγίες.

Ακολουθεί μια σύνοψη της σύνταξης ενός αρχείου .json:

- Ένα μεμονωμένο αντικείμενο με έναν πίνακα moduleIDs (απαιτείται), έναν πίνακα deferredModuleIDs (απαιτείται),
  έναν πίνακα titles (προαιρετικά) και έναν πίνακα descriptions (προαιρετικά). (Το αντικείμενο στην json αναπαρίσταται
  με {} και ο πίνακας με []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 έως n σειρές χαρακτήρων στον πίνακα moduleIDs, όπου κάθε σειρά χαρακτήρων είναι μια ταυτότητα
    που αναπαριστά μια λειτουργική μονάδα που το σύστημα θα πρέπει φορτώσει σε όλες τις καταστάσεις
    λειτουργίας της σελίδας, συμπεριλαμβανομένης της κατάστασης προβολής:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 έως n σειρές χαρακτήρων στον πίνακα deferredModuleIDs, όπου κάθε σειρά χαρακτήρων είναι μια ταυτότητα
    που αναπαριστά μια λειτουργική μονάδα που το σύστημα θα πρέπει να αναβάλλει να φορτώσει μέχρι να ζητηθεί
    μια συγκεκριμένη κατάσταση λειτουργίας της σελίδας, όπως η κατάσταση τροποποίησης:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - 1 έως n αντικείμενα στον πίνακα titles, κάθε ένα από τα οποία περιέχει μια σειρά χαρακτήρων value
    (απαιτείται) και μια σειρά χαρακτήρων lang (απαιτείται). Αυτές ορίζουν τον τίτλο ή το εμφανιζόμενο
    όνομα του προφίλ σας όπως θα εμφανίζεται σε ορισμένα τμήματα του Portal, π.χ. στο πλαίσιο διαλόγου
    Ιδιότητες σελίδας ή στη μικροεφαρμογή πύλης Λειτουργία ανάλυσης θεμάτων, σε όσες γλώσσες απαιτείται:

  "titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
  - 1 έως n αντικείμενα στον πίνακα descriptions, κάθε ένα από τα οποία περιέχει μια σειρά χαρακτήρων value
    (απαιτείται) και μια σειρά χαρακτήρων lang (απαιτείται). Αυτές ορίζουν την περιγραφή του προφίλ σας
    όπως θα εμφανίζεται σε ορισμένα τμήματα του Portal, π.χ. στο πλαίσιο διαλόγου Ιδιότητες σελίδας ή στη
    μικροεφαρμογή πύλης Λειτουργία ανάλυσης θεμάτων, σε όσες γλώσσες απαιτείται:

  "descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
Κάθε φορά που τροποποιείτε ένα αρχείο σε αυτόν το φάκελο 'profiles', θα πρέπει να ακυρώνετε τη λανθάνουσα
μνήμη της λειτουργίας συγκρότησης πόρων προκειμένου το WebSphere Portal να εφαρμόσει τις αλλαγές.
Για το σκοπό αυτό, επιλέξτε Διαχείριση -> Λειτουργία ανάλυσης θεμάτων -> Βοηθήματα -> Κέντρο ελέγχου.
Στη σελίδα Κέντρο ελέγχου, πατήστε στη διασύνδεση στην ενότητα 'Ακύρωση λανθάνουσας μνήμης'.

Αν υπάρχουν συντακτικά σφάλματα στο αρχείο .json ή προβλήματα με την ενεργοποίηση του προφίλ, χρησιμοποιήστε
τη μικροεφαρμογή πύλης Λειτουργία ανάλυσης θεμάτων για να εντοπίσετε το πρόβλημα. Επιλέξτε
Διαχείριση -> Λειτουργία ανάλυσης θεμάτων -> Αναφορά επικύρωσης, εξετάστε τα μηνύματα σφάλματος και
προειδοποίησης και εκτελέστε τις προτεινόμενες ενέργειες. Μπορείτε επίσης να αναλύσετε τις πληροφορίες του
προφίλ οποιασδήποτε σελίδας επιλέγοντας Διαχείριση -> Λειτουργία ανάλυσης θεμάτων -> Εξέταση πληροφοριών
προφίλ σελίδας, και τις πληροφορίες των λειτουργικών μονάδων οποιουδήποτε προφίλ επιλέγοντας Διαχείριση ->
Λειτουργία ανάλυσης θεμάτων -> Εξέταση λειτουργικών μονάδων κατά προφίλ.



Visión general de los perfiles
******************************

Esta carpeta 'profiles' de WebDAV es una carpeta que establece WebSphere Portal para definir el conjunto de módulos que
debe cargar la infraestructura del agregador de recursos para temas y páginas determinados. Dentro de esta carpeta hay un archivo .json por perfil; cree su propio archivo .json para su propio perfil. Puede copiar, cambiar el
nombre y modificar uno de los archivos .json existentes para ver la sintaxis de .json que hay que utilizar.

Cuando haya definido los perfiles, puede asignar uno para sea el perfil predeterminado de todo el tema.
Consulte el tema sobre "Cambio del perfil predeterminado de un tema" en la documentación de wiki para ver cómo hacerlo. 
También puede alterar temporalmente el perfil predeterminado para ciertas páginas asignando a dichas páginas otro perfil. Para ello vaya a Propiedades de página -> Avanzadas -> Valores de tema -> Valor de perfil o consulte el tema
sobre "Establecimiento de una alteración temporal de perfil en una página" en la documentación de wiki para ver otras formas de hacerlo.

A continuación se muestra un resumen de la sintaxis de .json:

- Un solo objeto con una matriz de moduleIDs (obligatorio), una matriz de deferredModuleIDs (obligatorio),
  una matriz de títulos (opcional) y una matriz de descripciones (opcional). (Un objeto en notación .json es {} y una matriz en notación .json es []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 a n series en la matriz de moduleIDs, donde cada serie es un ID de módulo, que representa los módulos que debe cargar el sistema en todas las páginas incluida la modalidad de vista:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 a n series en la matriz de deferredModuleIDs, donde cada serie es un ID de módulo, que representa los módulos cuya carga el sistema debe aplazar sólo hasta ciertas modalidades de página como la modalidad de edición:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - 1 a n objetos dentro de la matriz de títulos, cada uno con una serie de valor (obligatorio) y una serie lang (obligatorio). Estos valores definen el título o nombre de visualización del perfil, tal y como aparecerá en determinadas partes del portal, como el diálogo Propiedades de página y el portlet Analizador de temas, en todos los idiomas que necesite:
       
		"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
  - 1 a n objetos dentro de la matriz de descripciones, cada uno con una serie de valor (obligatorio) y una serie lang (obligatorio). Estos valores definen la descripción del perfil, tal y como aparecerá en determinadas partes del portal, como el diálogo Propiedades de página y el portlet Analizador de temas, en todos los idiomas que necesite:
       
		"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
Cada vez que modifique un archivo .json en la carpeta 'profiles', debe invalidar la memoria caché del agregador de recursos para que WebSphere Portal adopte los cambios.
Para ello vaya a Administración -> Analizador de temas -> Programas de utilidad -> Centro de control.
En la página Centro de control, pulse el enlace que hay bajo 'Invalidar memoria caché'.

Si tiene algún error de sintaxis en el archivo .json o si tiene problemas para que los perfiles funcionen, utilice el portlet Analizador de temas para localizar el problema. Vaya a Administración -> Analizador de temas -> Informe de validación, examine los mensajes de error y de aviso y emprenda la acción adecuada. También puede analizar los detalles de lo que está sucediendo con el perfil
de cualquier página accediendo a Administración -> Analizador de temas -> Examinar información de perfil de página, y los detalles sobre lo que sucede con l os módulos de cualquier perfil accediendo a Administración -> Analizador de temas -> Examinar módulos por perfil.



Profiilien yleiskuvaus
*****************

Tätä WebDAV-ohjelman Profiilit-kansiota käytetään WebSphere-portaalissa määritettäessä
mitkä moduulit ladataan resurssikoostimesta tiettyihin teemoihin ja tietyille sivuille. Tässä kansiossa
on yksi .json-tiedosto jokaista profiilia kohti. Luo oma .json-tiedosto omalle profiilillesi. Voit kopioida,
nimetä uudelleen ja muokata aiemmin luotuja .json-tiedostoja ja niistä näet myös .json-tiedostojen syntaksin.

Kun olet määrittänyt omat profiilisi, voit määrittää yhden niistä koko teeman oletusprofiiliksi.
Lisätietoja tästä on wikiohjeen kohdassa Teeman oletusprofiilin muuttaminen.
Voit myös kumota tiettyjen sivujen oletusprofiilin liittämällä niihin eri
profiilin. Voit tehdä tämän valitsemalla sivulla Sivun ominaisuudet -> Lisäasetukset -> Teeman asetukset -> Profiiliasetus.
Lisätietoja asiasta on wikiohjeen kohdassa Sivun profiilin
kumoaminen.

Yhteenveto .json-tiedoston syntaksista:

- yksittäinen objekti moduulitunnusmatriisissa (pakollinen), lykättyjen moduulien matriisi (pakollinen),
  otsikkomatriisi (valinnainen) ja kuvausmatriisi (valinnainen). (Objekti .json-merkinnässä on {} ja matriisi
  .json-merkinnässä on []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 - n merkkijonoa moduulitunnusmatriisissa; jokaisessa täytyy olla moduulitunnusmerkkijono; edustaa moduuleja, jotka
    järjestelmä lataa kaikissa sivutiloissa, mukaan lukien näyttötila:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 - n merkkijonoa lykättyjen moduulien matriisissa; jokaisessa täytyy olla moduulitunnusmerkkijono; edustaa moduuleja, jotka
    järjestelmä voi ladata vain tietyissä sivutiloissa, kuten muokkaustilassa:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
       - 1 - n objektia otsikkomatriisissa; jokaisessa täytyy olla arvomerkkijono (pakollinen) ja kielimerkkijono
       (pakollinen). Nämä arvot määrittävät profiilin otsikon tai näyttönimen, joka näkyy tietyissä
       portaalin osissa, kuten Sivun ominaisuudet -valintaikkunassa tai teeman analysointitoiminnon portaalisovelmassa, määrittämilläsi
       kielillä:

"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
       - 1 - n objektia kuvausmatriisissa; jokaisessa täytyy olla arvomerkkijono (pakollinen) ja kielimerkkijono
       (pakollinen). Nämä arvot määrittävät profiilin kuvauksen, joka näkyy tietyissä
       portaalin osissa, kuten Sivun ominaisuudet -valintaikkunassa tai teeman analysointitoiminnon portaalisovelmassa, määrittämilläsi
       kielillä:

"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
Muista, että aina kun muokkaat tiedostoa Profiilit-kansiossa, sinun täytyy mitätöidä
resurssikoostimen välimuisti, jotta WebSphere-portaali ottaa muutokset käyttöön.
Voit tehdä tämän valitsemalla Hallinta -> Teeman analysointitoiminnot -> Apuohjelmat -> Ohjaustoiminnot.
Valitse Ohjaustoiminnot-sivulla linkki kohdassa Mitätöi välimuisti.

Jos .json-tiedostossa on syntaksivirheitä tai et saa profiileja toimimaan, voit tehdä vianmäärityksen
teeman analysointitoimintojen portaalisovelmassa. Valitse Hallinta -> Teeman analysointitoiminto -> Tarkistusraportti.
Tarkista virhesanomat ja varoitukset. Suorita tarvittavat korjaukset. Voit analysoida profiilien käyttötietoja eri sivuilla
valitsemalla Hallinta -> Teeman analysointitoiminto -> Tarkista sivun profiilitiedot.
Näet moduulien käyttötiedot eri profiileissa valitsemalla
Hallinta -> Teeman analysointitoiminto -> Tarkista moduulit profiilin mukaan.



Présentation des profils
*****************

Le dossier 'profiles' dans WebDAV est un dossier bien défini par WebSphere Portal pour déterminer quel ensemble de modules doit être chargé par le framework de l'agrégateur de ressources pour obtenir des thèmes et des pages particulières. Ce dossier contient un fichier .json pour chaque profil - créez votre propre fichier .json pour votre profil. Vous pouvez copier, renommer et modifier l'un des fichiers .json existants pour connaître et apprendre la syntaxe .json nécessaire.

Une fois que vous avez défini vos profils, vous pouvez en affecter un en tant que profil par défaut pour l'ensemble du thème. Reportez-vous à la rubrique relative à la "modification du profil de thème par défaut" dans la documentation wiki pour savoir comment effectuer ces opérations. Vous pouvez également remplacer le profil par défaut pour certaines pages en affectant un autre profil à ces pages. Pour ce faire, utilisez Propriétés de la page -> Avancé -> Paramètres du thème -> Paramètre de profil de la page, ou reportez-vous à la rubrique sur la "définition d'un remplacement de profil dans une page" dans la documentation wiki pour connaître d'autres façons de procéder.

Un résumé de la syntaxe .json se présente comme suit :

- Un seul objet avec un tableau moduleIDs (obligatoire), un tableau deferredModuleIDs (obligatoire), un tableau titles (facultatif) et un tableau descriptions (facultatif). (Un objet en notation .json est {} et un tableau en notation .json est []) :

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 à n chaînes dans le tableau moduleIDs, où chaque chaîne est un ID de module, représentant les modules que le système doit charger dans tous les modes de page y compris le mode d'affichage :

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 à n chaînes dans le tableau deferredModuleIDs, où chaque chaîne est un ID de module, représentant les modules dont le système doit différer le chargement jusqu'à certains modes de page uniquement, tel que le mode Edition :

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
       1 à n objets dans le tableau titles, chacun avec une valeur chaîne (obligatoire) et une chaîne lang (obligatoire).
Ils définissent le titre ou le nom d'affichage de votre profil tel qu'il apparaît dans certaines parties du portail, comme dans la boîte de dialogue Propriétés de la page et le portlet Analyseur de thème, dans autant de langues que vous le souhaitez :

"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
       1 à n objets dans le tableau descriptions, chacun avec une valeur chaîne (obligatoire) et une chaîne lang (obligatoire).
Ils définissent la description de votre profil tel qu'elle apparaît dans certaines parties du portail, comme dans la boîte de dialogue Propriétés de la page et le portlet Analyseur de thème, dans autant de langues que vous le souhaitez :

"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
Chaque fois que vous modifiez un fichier .json dans le dossier 'profils', vous devez invalider le cache de l'agrégateur de ressources afin que WebSphere Portal sélectionne vos modifications. Vous pouvez effectuer cette opération en cliquant sur Administration -> Analyseur de thème -> Utilitaires -> Centre de contrôle. Dans la page du Centre de contrôle, cliquez sur le lien sous 'Invalider le cache'.

Si votre fichier .json contient des erreurs de syntaxe ou vos profils ne fonctionnent pas correctement, utilisez le portlet Analyseur de thème pour préciser le problème. Accédez à Administration -> Analyseur de thème -> Rapport de validation, puis consultez et corrigez les messages d'erreur et d'avertissement. Vous pouvez aussi analyser les détails des problèmes liés au profil d'une page en cliquant sur Administration -> Analyseur de thème -> Examiner les informations du profil de page, et les détails des problèmes liés aux modules d'un profil en cliquant sur Administration -> Analyseur de thème -> Examiner les modules par profil.



Pregled profila (hrvatski)
*****************

Ovaj folder 'profiles' unutar WebDAV-a je dobro definirani folder WebSphere Portala za definiranje skupa modula koji
će se učitavati u frameworku skupljača resursa za određene teme i stranice. U ovom folderu nalazi
se jedna .json datoteka po profilu - kreirajte .json datoteku za svoj profil. Možete kopirati, preimenovati i
modificirati jednu od postojećih .json datoteka da biste mogli pregledati i doznati potrebnu .json sintaksu. 

Nakon definiranja profila, možete odrediti profil koji će biti default za čitavu temu.
Načini na koje to možete napraviti opisani su u "Promjena default profila teme" u wiki dokumentaciji.
Možete i zamijeniti default profil za određene stranice tako da im dodijelite drugi
profil. To možete napraviti pomoću postavke Svojstva stranice -> Napredno -> Postavke teme -> Profil
ili pogledajte "Postavljanje zamjene profila na stranici" u wiki dokumentaciji da biste doznali druge
načine.

Sažetak .json sintakse:

- Jedan objekt s poljem moduleIDs (obavezno), polje deferredModuleIDs (obavezno),
  polje titles (opcijski) i polje descriptions (opcijski). (Objekt u .json notaciji je {}, a polje u
  .json notaciji je []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 do n nizova znakova u polju moduleIDs, gdje je svaki niz znakova id modula, koji predstavljaju module
    koje sistem treba učitavati u svim načinima stranice, uključujući način pregleda:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 do n nizova znakova u polju deferredModuleIDs, gdje je svaki niz znakova id modula, koji predstavljaju module
    čije učitavanje sistem treba odgoditi dok se ne pojave određeni načini stranice, uključujući način uređivanja:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
    - 1 do n objekata unutar polja titles, svaki sadrži niz znakova value (obavezno) i niz znakova lang
    (obavezno). Oni definiraju naslov ili prikazani naziv vašeg profila koji će se pojavljivati u određenim
    dijelovima portala, na primjer u dijalogu Svojstva stranice portleta analizatora teme, na svim jezicima koje
    navedete:

  "titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],

    - 1 do n objekata unutar polja descriptions, svaki sadrži niz znakova value (obavezno) i niz znakova lang
    (obavezno). Oni definiraju opis vašeg profila koji će se pojavljivati u određenim
    dijelovima portala, na primjer u dijalogu Svojstva stranice portleta analizatora teme, na svim jezicima koje
    navedete:

  "descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]

Svaki puta kada modificirate .json datoteku u ovom folderu 'profiles', morat ćete poništiti
predmemoriju skupljača resursa da bi WebSphere Portal pokupio promjene.
To možete napraviti odlaskom u Administracija -> Analizator teme -> Pomoćni programi -> Kontrolni centar.
Na stranici Kontrolnog centra kliknite na vezu pod 'Poništi predmemoriju'.

Ako postoje greške u .json sintaksi ili ako vaši profili ne rade na željeni način, upotrijebite
portlet Analizator teme za dodatno utvrđivanje problema. Idite na Administracija -> Analizator teme -> Izvještaj za provjeru
i pregledajte poruke grešaka i upozorenja te poduzmite odgovarajuće akcije. Detalje stanja profila za bilo koju stranicu
možete analizirati pomoću Administracija -> Analizator teme -> Ispitivanje informacija profila,
a stanje modula bilo kojeg profila pomoću
Administracija -> Analizator teme -> Ispitivanje modula po profilu.



Profilok bemutatása (magyar)
*****************

Ez a 'profiles' mappa a WebDAV mappán belül a WebSphere Portal által jól
meghatározott mappa, amely megadja, hogy az erőforrásösszesítő
keretrendszer a modulok mely készletét töltse be bizonyos témákhoz és
oldalakhoz. A mappán belül profilonként egy .json fájl található. A
felhasználó létrehozhatja a saját .json fájlját a saját profiljához. 
Megteheti, hogy lemásolja, átnevezi, majd módosítja valamelyik meglévő
.json fájlt, hogy lássa és megismerje a szükséges .json szintaxist. 

A profilok meghatározása után kijelölhet egyet, hogy az legyen az
alapértelmezett profil az egész témához.
Azzal kapcsolatos információkért, hogy hogyan teheti ezt meg, nézze meg a
wiki dokumentáció "Téma alapértelmezett profiljának módosítása" című
részét.
Azt is megteheti, hogy felülbírálja az alapértelmezett profilt bizonyos
oldalak esetén úgy, hogy másik profilt rendel hozzájuk. Ezt az oldal
Oldaltulajdonságok -> Speciális -> Témabeállítások -> Profil beállításán
keresztül hajthatja végre, illetve további módszerekért nézze meg a wiki
dokumentáció "Profil felülbírálásának beállítása egy oldalon" című részét.


A .json szintaxis összefoglalása: 

- Egyetlen objektum, mely moduleIDs (modulazonosítók) tömbbel (kötelező),
deferredModuleIDs (késleltetett modulok azonosítója) tömbbel (kötelező),
titles (címek) tömbbel (nem kötelező) és descriptions (leírások) tömbbel
(nem kötelező) rendelkezik. (Az objektum a .json jelölésmódban {}, a tömb
pedig []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - A moduleIDs tömbön belül 1-n karaktersorozat van. Minden egyes
karaktersorozat egy-egy modulazonosító, melyek mindazokat a modulokat
képviselik, amelyeket a rendszernek be kell töltenie az összes oldal
üzemmódban, a megjelenítés üzemmódot is beleértve: 

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - A deferredModuleIDs tömbön belül 1-n karaktersorozat van. Minden egyes
karaktersorozat egy-egy modulazonosító, melyek mindazokat a modulokat
képviselik, amelyeket a rendszernek csak bizonyos oldal üzemmódokba
kapcsoláskor kell betöltenie; ilyen például a szerkesztés üzemmód: 

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
       - A titles tömbön belül 1-n objektum van, melyek mindegyikéhez
tartozik egy value (érték) karaktersorozat (kötelező) és egy lang (nyelv)
karaktersorozat (kötelező). Ezek határozzák meg a profil címét vagy
megjelenő nevét, ahogyan az a Portal bizonyos részeiben látszani fog -
például az Oldaltulajdonságok párbeszédablakban vagy a Témaelemző portál
kisalkalmazásban - igény szerint tetszőleges számú nyelven:
"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
       - A descriptions tömbön belül 1-n objektum van, melyek
mindegyikéhez tartozik egy value (érték) karaktersorozat (kötelező) és egy
lang (nyelv) karaktersorozat (kötelező). Ezek határozzák meg a profil
leírását, ahogyan az a Portal bizonyos részeiben látszani fog - például az
Oldaltulajdonságok párbeszédablakban vagy a Témaelemző portál
kisalkalmazásban - igény szerint tetszőleges számú nyelven:
"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
Valahányszor módosít egy .json fájlt ebben a 'profiles' mappában,
érvénytelenítenie kell az erőforrásösszesítő gyorsítótárat, hogy a
WebSphere Portal felvegye a módosításokat.
Ehhez kattintson az Adminisztráció -> Témaelemző -> Segédprogramok ->
Vezérlőközpont menüpontra.
A Vezérlőközpont oldalon kattintson a 'Gyorsítótár érvénytelenítése'
alatti hivatkozásra. 

Ha szintaktikai hiba van a .json fájlban vagy problémába ütközik a
profilok beüzemelése során, akkor a Témaelemző portál kisalkalmazásban
nézzen utána, hogy mi okozza ezt. Kattintson az Adminisztráció ->
Témaelemző -> Érvényesítési jelentés menüpontra, és vizsgálja meg a hiba-
és figyelmeztetés üzeneteket, majd tegye meg a szükséges lépéseket. Úgy is
elemezheti annak részleteit, hogy mi történik valamely oldal profiljával,
hogy az Adminisztráció -> Témaelemző -> Oldal profilinformációinak
vizsgálata menüpontra kattint. Ha pedig annak részleteire kíváncsi, hogy
mi történik valamely profil moduljaival, akkor kattintson az
Adminisztráció -> Témaelemző -> Modulok vizsgálata profilok alapján
menüpontra. 



Panoramica profili
*****************

Questa cartella 'profiles' in WebDAV è una cartella ben definita da WebSphere Portal per definire quale insieme di
moduli deve essere caricato dal framework dell'aggregatore di risorse per temi e pagine particolari. In questa
cartella è presente un file .json per profilo - creare il proprio file .json per il proprio profilo. È possibile copiare, ridenominare e modificare uno dei file
.json esistenti per visualizzare e conoscere la sintassi .json richiesta.

Una volta definiti i profili, è possibile assegnarne uno come profilo predefinito per l'intero tema.
Fare riferimento a "Changing the theme default profile" nella documentazione wiki per informazioni sulla modalità di esecuzione. 
Inoltre, è anche possibile sovrascrivere il profilo predefinito per alcune pagine assegnando un profilo diverso per
alcune pagine. Effettuare ciò attraverso Proprietà della pagina -> Avanzate -> Impostazioni del tema -> Impostazione del
profilo oppure fare riferimento a "Setting a profile override on a page" nella documentazione wiki per avere altre modalità di
esecuzione.

Segue un riepilogo della sintassi di .json:

- Un oggetto singolo con un array moduleIDs (obbligatorio), un array deferredModuleIDs (obbligatorio),
  un array titles (facoltativo) e un array descriptions (facoltativo). (Un oggetto nella notazione .json è {} e n array nella notazione
  .json è []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 a n stringhe nell'array moduleIDs, dove ciascuna stringa è un id modulo, che rappresenta quei moduli che il sistema
    dovrebbe caricare in tutte le modalità pagina inclusa la modalità di visualizzazione:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 a n stringhe nell'array deferredModuleIDs, dove ciascuna stringa è un id modulo, che rappresenta quei moduli per cui il sistema deve
    deferire il caricamento fino a solo alcune modalità pagina inclusa la modalità di modifica:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - 1 a n oggetti nell'array dei titoli, ciascuno con una stringa di valore (obbligatoria) e una stringa lang
       (obbligatoria). Questi definiscono il titolo o il nome di visualizzazione del profilo come visualizzato in alcune parti
    del portale come ad esempio nella finestra di dialogo Proprietà della pagina e nel portlet Analizzatore temi, in tutte le diverse
    lingue necessarie:
       
		"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
  - 1 a n oggetti nell'array delle descrizioni, ciascuna con una stringa di valore (obbligatoria) e una stringa lang
       (obbligatoria). Questi definiscono la descrizione del profilo come visualizzato in alcune parti
    del portale come ad esempio nella finestra di dialogo Proprietà della pagina e nel portlet Analizzatore temi, in tutte le diverse
    lingue necessarie:
       
		"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
Ogni volta che viene modificato un file .json in questa cartella 'profiles', è necessario invalidare
la cache dell'aggregatore di risorse per WebSphere Portal per selezionare le modifiche.
È possibile eseguire ciò andando ad Gestione -> Analizzatore temi -> Utility -> Control Center.
Nella pagina Control Center fare clic sul link in 'Invalida Cache'.

Se sono presenti errori di sintassi in .json o problemi nel funzionamento dei profili,
utilizzare il portlet Analizzatore temi per restringere il problema. Andare a Gestione -> Analizzatore temi -> Report di convalida
ed esaminare ed intraprendere un'azione per i messaggi di avvertenza ed errore. È anche possibile analizzare i dettagli di cosa succede
con il profilo delle pagine andando a Gestione -> Analizzatore temi -> Esamina le informazioni del profilo della pagina,
e i dettagli di cosa accade con i moduli dei profili andando a
Gestione -> Analizzatore temi -> Esamina moduli per profilo.



Profiles Overview (English)
*****************

This 'profiles' folder within WebDAV is a well defined folder by WebSphere Portal to define which set of 
modules should get loaded by the resource aggregator framework for particular themes and pages. Within this 
folder is one .json file per profile - create your own .json file for your own profile. You can copy, rename
and modify one of the existing .json files in order to see and learn the .json syntax that is required.

Once you define your profiles, you can assign one to be the default profile for the entire theme.
Refer to "Changing the theme default profile" in the wiki documentation for the ways to do this. 
And/or, you can also override the default profile for certain pages by assigning a different profile 
for certain pages. Do this through the page's Page Properties -> Advanced -> Theme Settings -> Profile
setting, or refer to "Setting a profile override on a page" in the wiki documentation for additional ways
to do this.

A summary of the .json syntax is as follows:

- A single object with a moduleIDs array (required), a deferredModuleIDs array (required),
  a titles array (optional) and a descriptions array (optional). (An object in .json notation is {} and 
  an array in .json notation is []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 to n strings within the moduleIDs array, where each string is a module id, representing those modules
    that the system should load in all page modes including view mode:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 to n strings within the deferredModuleIDs array, where each string is a module id, representing those 
    modules that the system should defer loading until only certain pages modes such as edit mode:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - 1 to n objects within the titles array, each with a value string (required) and a lang string
    (required). These define the title or display name of your profile as it will appear in certain
    parts of Portal such as in the Page Properties dialog and Theme Analyzer portlet, in as many different 
    languages as you need:
       
		"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
  - 1 to n objects within the descriptions array, each with a value string (required) and a lang string
    (required). These define the description of your profile as it will appear in certain
    parts of Portal such as in the Page Properties dialog and Theme Analyzer portlet, in as many different 
    languages as you need:
       
		"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
Any time that you modify a .json file in this 'profiles' folder, you need to invalidate
the resource aggregator cache for WebSphere Portal to pick up the changes.
You can do this by going to Administration -> Theme Analyzer -> Utilities -> Control Center.
On the Control Center page click the link under 'Invalidate Cache'.

If you have any syntax errors in your .json or problems getting your profiles to work, use the
Theme Analyzer portlet to narrow down the problem. Go to Administration -> Theme Analyzer -> Validation Report
and examine and take action on the error and warning messages. You can also analyze details of what is going on 
with the profile of any page by going to Administration -> Theme Analyzer -> Examine page profile information,
and details of what is going on with the modules of any profile by going to 
Administration -> Theme Analyzer -> Examine modules by profile.



プロファイルの概要 (日本語)
*****************

WebDAV 内のこの「profiles」フォルダーは、特定のテーマとページのためにリソース統合機能フレームワークによって
ロードする必要のあるモジュールのセットを定義するための、WebSphere Portal によって明確に定義されたフォルダーです。このフォルダー
内には、プロファイルにつき 1 つの .json ファイルがあります。ユーザー独自のプロファイルに対して独自の .json ファイルを作成します。既存の .json ファイルの 1 つをコピー、名前変更、変更して、必要な .json 構文を参照したり学習したりできます。

プロファイルを定義したら、テーマ全体のデフォルト・プロファイルとしてプロファイルを割り当てることができます。
これを行う方法については、Wiki の資料の「Changing the theme default profile」を参照してください。
または、特定のページ向けの別のプロファイルを割り当てることによって、特定のページのデフォルト・プロファイルを上書きする
こともできます。この操作は、ページの「ページ・プロパティー」->「拡張」->「テーマ設定」->「プロファイル」設定を使用して行うか、
Wiki の資料の「Setting a profile override on a page」を参照して、これを行う別の方法を調べて
ください。

.json 構文の要約は、以下のとおりです。

- 単一オブジェクトで、moduleIDs 配列 (必須)、deferredModuleIDs 配列 (必須)、
  titles 配列 (オプション)、descriptions 配列 (オプション) があります。(オブジェクトは .json 表記では {} で、
  配列は .json 表記では [] です)。

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - moduleIDs 配列内の 1 個から n 個のストリングで、各ストリングはモジュール ID であり、
    表示モードを含むすべてのページ・モードでシステムがロードするモジュールを表します。

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - deferredModuleIDs 配列内の 1 個から n 個のストリングで、各ストリングはモジュール ID であり、
    編集モードなどの特定のページ・モードになるまでにシステムがロードを据え置くモジュールを表します。

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - titles 配列内の 1 個から n 個のオブジェクトで、それぞれに value ストリング (必須) と lang ストリング
    (必須) があります。これらは「ページ・プロパティー」ダイアログやテーマ・アナライザー・ポートレットなどのポータルの特定の一部として
    表示されるときのプロファイルのタイトルまたは表示名を定義し、異なる言語を必要な数だけ
    使用できます。

		"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],

  - descriptions 配列内の 1 個から n 個のオブジェクトで、それぞれに value ストリング (必須) と lang ストリング
    (必須) があります。これらは「ページ・プロパティー」ダイアログやテーマ・アナライザー・ポートレットなどのポータルの特定の一部として
    表示されるときのプロファイルの説明を定義し、異なる言語を必要な数だけ
    使用できます。

		"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]

この「profiles」フォルダーの .json ファイルを変更したときは常に、リソース統合機能キャッシュを無効化して、
WebSphere Portal が変更内容を取得するようにする必要があります。
これを実行するには、「管理」->「テーマ・アナライザー」->「ユーティリティー」->「コントロール・センター」に移動します。
その後、「コントロール・センター」ページで、「キャッシュの無効化」の下のリンクをクリックします。

.json に構文エラーが発生したり、プロファイルを作動させる際に問題が発生した場合などは、テーマ・アナライザー・ポートレットを使用して、問題を絞り込んでください。「管理」->「テーマ・アナライザー」->「検証レポート」
に移動して、エラーと警告メッセージを調べてアクションを実行してください。また、任意のページのプロファイルの状態について、
「管理」->「テーマ・アナライザー」->「ページ・プロファイル情報の調査」を使用して詳細を分析したり、
プロファイルのモジュールの状態について、
「管理」->「テーマ・アナライザー」->「プロファイル別のモジュールの調査」を使用して詳細を分析したりできます。



Профайлдарды шолу (Ағылшын)
*****************

Бұл WebDAV ішіндегі 'профайлдар' арнайы тақырыптар мен беттер үшін ресурсты біріктіру құрылымы арқылы жүктелуі тиіс модульдердің жинағын анықтайтын WebSphere порталы арқылы жақсы анықталған қалта. Осы қалта арқылы бір .json файл бір профайл үшін өзіңіздің жеке .json файлыңызды құрыңыз. Талап етілетін .json синтаксисін білу және көрудің орнына
бар .json файлдарының біреуін көшіріп, атын өзгертіп және өңдей аласыз.

Профайлдарыңызды бір анықтағаннан кейін біреуін барлық тақырып үшін әдепкі профайл болуын тағайындай аласыз.
Осыны орындау жолдары үшін вики құжатындағы "Тақырыптың әдепкі профайлын өзгерту" тақырыбын көріңіз.
Және/немесе, сіз сонымен қатар әдепкі профайлды ағымдағы беттер үшін әр түрлі профайлдарды тағайындау арқылы қайта жаза аласыз. Мұны Парақ сипаттары -> Жетілдірілген -> Тақырып параметрлері -> Профайл параметрі арқылы немесе осыны орындаудағы қосымша жолдар үшін вики құжатындағы "Парақтағы профайлды алдын ала анықтау параметрі" бөлімін қараңыз.

.json синтаксисінің қорытындысы келесідей:

- moduleIDs жолы жалғыз нысанмен бірге (міндетті), deferredModuleIDs жолы (міндетті),
  тақырыптар жолы (міндетті емес) және анықтамалар жолы (міндетті емес). (.json нұсқауындағы нысан мынадай {} және .json нұсқауындағы жол мынадай []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"тақырыптар": [
		],
		"анықтамалар": [
		]
	}
	
  - moduleIDs жолы арқылы 1 саны n жолдарына, мұндағы әр бір жол жүйе көрініс күйін қамтитын барлық бетке жүктеп алатын сол модульдерді көрсететін модуль идентификаторы:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - deferredModuleIDs жолы арқылы 1 саны n жолдарына, мұндағы әр бір жол жүйе өңдеу күйі ретіндегі тек парақтар күйлерін жүктегенге дейін кейінге қалдыруы тиіс модуль идентификаторы: 

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
      - тақырыптар жолы ішіндегі 1 n нысандары үшін, әр бірі мән жолын (міндетті) және тіл жолын қамтиды (міндетті). Бұл тақырып анықтайды немесе сіздің профайлыңыздың атын көрсетеді, ол сізге қажет көптеген бірнеше тілдердегі Бет сипаттары тілқатысуы және Тақырып талдаушы портлеті ретінде Порталдың нақты бөлігінде пайда болады:
"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
       - анықтамалар жолы ішіндегі 1 n нысандары үшін, әр бірі мән жолын (міндетті) және тіл жолын қамтиды (міндетті). Бұл сіздің профайлыңыздың сипаттамасын анықтайды, ол сізге қажет көптеген бірнеше тілдердегі Бет сипаттары тілқатысуы және Тақырып талдаушы портлеті ретінде Порталдың нақты бөлігінде пайда болады:
 "descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]

Файлды осы 'профайлдар' қалтасындағы .json файлына өзгерткен кезде, ресурс біріктірушісінің кэшін WebSphere порталы үшін өзгерістерді таңдау үшін жарамсыз етуіңіз керек. Мұны Әкімші -> Тақырыпты талдаушы -> Қызметтік бағдарламалар -> Басқару орталығына бару арқылы орындай аласыз.
Басқару орталығы бетінде 'Кэшті жарамсыз ету' астындағы байланысты басыңыз.

.json файлында синтаксистік қателіктер болса немесе профайлдарыңызға жұмыс істеуде кедергі тудыратын мәселелер болса, мәселені азайту үшін Тақырыпты талдаушы портлетін қолданыңыз. Әкімші -> Тақырып Талдаушы -> Тексеру есебі бетіне өтіп және қателіктер мен ескерту хабарламаларын анықтап, түзетіңіз.Кез келген беттегі профайлмен не болып жатқаны туралы мәліметтреді Әкімші -> Тақырып талдаушы -> Бет профайл ақпаратын зерттеуге өту арқылы талдап және кез келген профайлдың модульдеріне не болып жатқанын Әкімші -> Тақырып талдаушы -> Модульдерді профайл арқылы зерттеу бетіне өту арқылы анықтай аласыз.



프로파일 개요
*****************

WebDAV 내의 'profiles' 폴더는 자원 수집자 프레임워크에서 특정 테마와 페이지를 위해 로드해야 하는
모듈 세트를 정의하도록 WebSphere Portal에서 올바르게 정의된 폴더입니다. 해당 폴더 내에 프로파일당 하나의
.json 파일이 있습니다. 사용자 고유 프로파일을 위한 고유 .json 파일을 작성합니다. 필요한 .json 구문을
보고 학습하기 위해 기존 .json 파일 중 하나를 복사하고, 이름을 바꾸고, 수정할 수 있습니다.

프로파일을 정의한 후 이 중 전체 테마에 대한 하나의 기본 프로파일을 지정할 수 있습니다.
이를 수행하는 방법은 위키 문서의 "테마 기본 프로파일 변경"을 참조하십시오.
그리고/또는 특정 페이지에 다른 프로파일을 지정하여 특정 페이지의 기본 프로파일을
대체할 수도 있습니다. 페이지의 페이지 특성 -> 고급 -> 테마 설정 -> 프로파일
설정을 통해 수행하십시오. 다른 수행 방법은 위키 문서의 "페이지에 프로파일 대체
설정"을 참조하십시오.

.json 구문의 요약은 다음과 같습니다.

- moduleIDs 배열(필수), deferredModuleIDs 배열(필수), titles 배열(선택사항), descriptions
  배열(선택사항)이 있는 단일 오브젝트입니다. (.json의 오브젝트 표기법은 {}이고 .json의
  배열 표기법은 []입니다.)

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - moduleIDs 배열 내의 1 - n개의 문자열. 여기서 각 문자열은 보기 모드를 포함한 모든
    페이지 모드에서 시스템이 로드해야 하는 해당 모듈을 나타내는 모듈 ID입니다.

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - deferredModuleIDs 배열 내의 1 - n개의 문자열. 여기서 각 문자열은 시스템이 편집 모드와 같은
    특정 페이지 모드까지만 로딩을 지연시켜야 하는 해당 모듈을 나타내는 모듈 ID입니다.

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - titles 배열 내의 1 - n개의 오브젝트. 각 오브젝트에는 value 문자열(필수)과 lang
    문자열(필수)이 있습니다. 프로파일의 제목이나 표시 이름이 페이지 특성 대화 상자와
    테마 분석기 포틀릿과 같은 포털의 특정 파트에 사용자가 요구하는 여러 언어로 표시되므로
    이러한 오브젝트가 해당 제목이나 표시 이름을 정의합니다.

  "titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
  - 설명 배열 내의 1 - n개의 오브젝트. 각 오브젝트에는 value 문자열(필수) 및
    lang 문자열(필수)이 있습니다. 프로파일의 설명이 페이지 특성 대화 상자와
    테마 분석기 포틀릿과 같은 포털의 특정 파트에 사용자가 요구하는 여러 언어로
    표시되므로 이러한 오브젝트가 해당 설명을 정의합니다.

  "descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
이 'profiles' 폴더에서 .json 파일을 수정할 때, 변경사항을 적용하려면
WebSphere Portal의 자원 수집자 캐시를 무효화해야 합니다.
이를 수행하기 위해 관리 -> 테마 분석기 -> 유틸리티 -> Control Center로 이동합니다.
Control Center 페이지에서 '캐시 무효화' 아래에 있는 링크를 클릭하십시오.

.json에 구문 오류가 있거나 사용자 프로파일을 작동시키는 중에 문제점이 발생한 경우, 테마 분석기
포틀릿을 사용하여 문제점의 범위를 좁히십시오. 관리 -> 테마 분석기 -> 유효성 검증 보고서로
이동하여 오류 및 경고 메시지를 검토하고 해당 조치를 수행하십시오. 관리 -> 테마 분석기 -> 페이지
프로파일 정보 검토로 이동하여 페이지의 프로파일에 대한 세부사항을 분석하고 관리 -> 테마 분석기
-> 프로파일별 모듈 검토로 이동하여 프로파일의 모듈에 대한 세부사항을 분석하십시오.



Profielen - Overzicht
*********************

De map 'profiles' binnen WebDAV is een voor WebSphere Portal gedefinieerde map voor het definiëren van de set modules die voor bepaalde thema's en pagina's moet worden geladen door het framework van de resourceaggregator. Deze map bevat één .json-bestand per profiel - maak uw eigen .json-bestand voor uw eigen profiel. U kunt een van de bestaande .json-bestanden kopiëren, hernoemen en wijzigen, om te kunnen zien hoe de vereiste syntaxis in een .json-bestand werkt.

Na het definiëren van uw profielen kunt u één ervan instellen als het standaardprofiel voor het gehele thema.
Raadpleeg "Standaardprofiel van thema wijzigen" in de wiki-documentatie voor informatie over hoe u dit kunt doen.
U kunt desgewenst het standaardprofiel voor bepaalde pagina's vervangen door een ander profiel toe te wijzen aan die pagina's. Dit doet u via de instelling Paginainstelling -> Geavanceerd -> Thema-instellingen -> Profiel van de pagina. Voor andere manieren waarop u dit kunt doen, raadpleegt u "Setting a profile override on a page" in de wiki. 

Een overzicht van de .json-syntaxis:

- Een enkel object met een array moduleIDs (verplicht), een array deferredModuleIDs (verplicht),
  een array titles (optioneel) en een array descriptions (optioneel). (Een object wordt in de
  .json-notatie aangegeven met {}, terwijl een array wordt aangegeven met []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 tot n tekenreeksen binnen de array moduleIDs, waarbij elke tekenreeks een module-ID is dat die modules aangeeft
    die het systeem moet laden in alle paginawerkstanden die deel uitmaken van de viewwerkstand:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 tot n tekenreeksen binnen de array deferredModuleIDs, waarbij elke tekenreeks een module-ID is dat die modules
    aangeeft die het systeem pas moet laden als er sprake is van een bepaalde paginawerkstand (zoals bewerken):

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - 1 tot n objecten in de array van titels, elk met een waardereeks (verplicht) en lang-reeks (verplicht). Deze
    definiëren de titel of weergavenaam van uw profiel, aangezien deze voorkomen in bepaalde delen van de Portal,
    bijvoorbeeld in het venster Paginaeigenschappen en de portlet Thema-analyseprogramma, en in zo veel verschillende
    talen als u nodig hebt:

"titles": [
			{
				"value":"Mijn profiel",
				"lang":"en"
			}
		],

  - 1 tot n objecten in de array van beschrijvingen, elk met een waardereeks (verplicht) en lang-reeks (verplicht). 
    Deze definiëren de beschrijving van uw profiel, aangezien deze voorkomen in bepaalde delen van de Portal,
    bijvoorbeeld in het venster Paginaeigenschappen en de portlet Thema-analyseprogramma, en in zo veel verschillende
    talen als u nodig hebt:

"descriptions": [
			{
				"value":"Een profiel dat fantastische functies biedt",
				"lang":"en"
			}
		]

Telkens wanneer u een json-bestand in deze map 'profiles' wijzigt, moet u de cache voor de resourceaggregator
ongeldig maken, zodat WebSphere Portal de wijzigingen kan oppikken.
U kunt dit doen door het selecteren van Beheer -> Thema-analyseprogramma -> Hulpprogramma's -> Control Center.
Op de Control Center-pagina klikt u op de link onder 'Cache ongeldig maken'.

Als er syntaxisfouten aanwezig zijn in uw json, of als er problemen zijn met het activeren van uw profielen, kunt u de
portlet Thema-analyseprogramma gebruiken om de oorzaak van het probleem op te sporen. Ga naar Beheer ->
Thema-analyseprogramma -> Validatierapport en bestudeer de fout- en waarschuwingsberichten om er vervolgens
actie voor te ondernemen. Het is ook mogelijk om de details van hetgeen er gaande is te analyseren met het
profiel van een willekeurige pagina. Ga daartoe naar Beheer -> Thema-analyseprogramma -> Pagina-profielgegevens
onderzoeken. De details van wat er gaande is met de modules van elk profiel analyseert u met Beheer ->
Thema-analyseprogramma -> Modules onderzoeken per profiel.



Oversikt over profiler (norsk)
*****************

Mappen 'profiles' i WebDAV er en WebSphere Portal-definert mappe for å definere hvilket sett av
moduler som skal lastes inn av Resource Aggregator-rammeverket for bestemte temaer og sider. I denne
mappen finnes det en .json-fil per profil - opprett din egen .json-fil for din profil. Du kan kopiere,
endre navn på og endre en av de eksisterende .json-filene for å se og lære den nødvendige .json-syntaksen.

Når du definerer dine profiler, kan du tildele en profil som skal være standardprofil for hele temaet.
"Changing the theme default profile" i wiki-dokumentasjonen beskriver hvordan du kan gjøre dette.
Og/eller du kan også overstyre standardprofilen for bestemte sider ved å tildele en annen profil
til bestemte sider. Gjør dette gjennom sidens Sideegenskaper -> Avansert -> Temainnstillinger -> Profilinnstillinger,
eller se "Setting a profile override on a page" i wiki-dokumentasjonen som beskriver flere måter du kan
gjøre dette på.

Sammendrag av .json-syntaksen:

- Ett enkelt objekt med en moduleIDs-matrise (obligatorisk), en deferredModuleIDs-matrise (obligatorisk),
  en titles-matrise (valgfritt) og en descriptions-matrise (valgfritt). (Et objekt i .json-notasjon er {}, og
  en matrise i .json-notasjon er []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 til n strenger i moduleIDs-matrisen, der hver streng er en modul-ID, som representerer modulene
    som systemet skal laste inn i alle sidemoduser, inkludert visningsmodus:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 til n strenger i deferredModuleIDs-matrisen, der hver streng er en modul-ID, som representerer modulene
    som systemet skal utsette innlastingen av til bestemte sidemoduser, for eksempel redigeringsmodus:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - 1 til n objekter i titles-matrisen, som hver har en value-streng (obligatorisk) og en lang-streng
    (obligatorisk). De definerer tittelen eller visningsnavnet for profilen som blir vist i bestemte
    deler av Portal, for eksempel i dialogboksen Sideegenskaper og i Temaanalysator-portletten, på så mange
    forskjellige språk som du har behov for.

		"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
  - 1 til n objekter i descriptions-matrisen, som hver har en value-streng (obligatorisk) og en lang-streng
    (obligatorisk). De definerer beskrivelsen av profilen som blir vist i bestemte
    deler av Portal, for eksempel i dialogboksen Sideegenskaper og i Temaanalysator-portletten, på så mange
    forskjellige språk som du har behov for.

		"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
Hver gang du endrer en .json-fil i mappen 'profiles', må du ugyldiggjøre Resource
Aggregator-hurtigbufferen for at WebSphere Portal skal kunne plukke opp endringene.
Du kan gjøre dette ved å gå til Administrasjon -> Temaanalysator -> Funksjoner -> Kontrollsenter.
På siden Kontrollsenter klikker du på linken under 'Ugyldiggjør hurtigbuffer'.

Hvis du har noen syntaksfeil i din .json-fil eller problemer med å få profilene til å fungere,
kan du bruke Temaanalysator-portletten til å finne problemet. Gå til Administrasjon -> Temaanalysator -> Valideringsrapport
og undersøk og utfør handlingene for feil- og advarselsmeldingene. Du kan også analysere detaljer for hva som skjer med
profilen for en av sidene, ved å gå til Administrasjon -> Temaanalysator -> Undersøk sideprofilinformasjon,
og detaljer for hva som skjer med modulene for en profil, ved å gå til
Administrasjon -> Temaanalysator -> Undersøk moduler etter profil.



Przegląd profili (polski)
*****************

Folder profiles udostępniany przez protokół WebDAV to folder zdefiniowany w produkcie WebSphere
Portal na potrzeby określania zbioru modułów, które mają być ładowane przez środowisko
agregatora zasobów dla konkretnych kompozycji i stron. W tym folderze znajduje się jeden plik .json
dla każdego profilu. Należy utworzyć własny plik .json dla własnego profilu. Istniejący plik .json
można skopiować, zmienić mu nazwę i zmodyfikować, aby poznać wymaganą składnię JSON. 

Po zdefiniowaniu profili można przypisać jeden z nich jako profil domyślny dla
całej kompozycji. Sekcja Changing the theme default profile (Zmienianie domyślnego profilu kompozycji) w dokumentacji wiki
opisuje, jak należy wykonać tę czynność. Istnieje również możliwość przesłonięcia profilu domyślnego
dla określonych stron przez przypisanie do nich innego profilu. W tym celu należy użyć
ustawienia Właściwości strony -> Zaawansowane -> Ustawienia kompozycji -> Profil dla danej strony
lub zapoznać się z sekcją Setting a profile override on a page (Ustawianie przesłaniania profilu
dla strony) w dokumentacji wiki, która opisuje inne sposoby wykonania tej czynności. 

Podsumowanie składni JSON:

- Pojedynczy obiekt z tablicą moduleIDs (wymagany), tablica deferredModuleIDs
(wymagana), tablica titles (opcjonalna) i tablica descriptions (opcjonalna). (Obiekt
w notacji JSON to {}, a tablica w notacji JSON to []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
- Od 1 do n łańcuchów w tablicy moduleIDs, gdzie każdy łańcuch jest
identyfikatorem modułu reprezentującym moduł, który ma być ładowany przez
system we wszystkich trybach strony, w tym w trybie wyświetlania: 

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
- Od 1 do n łańcuchów w tablicy deferredModuleIDs, gdzie każdy łańcuch jest
identyfikatorem modułu reprezentującym moduł, którego ładowanie ma być
odroczone przez system do momentu zastosowania konkretnych trybów strony, takich jak tryb edycji: 

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
- Od 1 do n obiektów w tablicy titles, z których każdy ma łańcuch wartości
(wymagany) i łańcuch języka (wymagany). Definiują one tytuł lub nazwę
wyświetlaną profilu (w dowolnej liczbie języków) w postaci wyświetlanej w
niektórych częściach portalu, takich jak okno dialogowe Właściwości strony i portlet Analizator kompozycji:

"titles": [
			{
				"value":"Mój profil",
				"lang":"pl"
			}
		],

- Od 1 do n obiektów w tablicy descriptions, z których każdy ma łańcuch
wartości (wymagany) i łańcuch języka (wymagany). Definiują one opis profilu (w
dowolnej liczbie języków) w postaci wyświetlanej w niektórych częściach
portalu, takich jak okno dialogowe Właściwości strony i portlet Analizator kompozycji:

"descriptions": [
			{
				"value":"Profil udostępniający funkcjonalność xyz",
				"lang":"pl"
			}
		]

Za każdym razem, gdy plik .json w folderze profiles zostanie zmodyfikowany, należy unieważnić
pamięć podręczną agregatora zasobów produktu WebSphere Portal, aby zmiany zostały uwzględnione. 
Czynność tę można wykonać na stronie Administrowanie -> Analizator kompozycji -> Programy
narzędziowe -> Centrum sterowania. Na stronie Centrum sterowania należy kliknąć odsyłacz w sekcji
Unieważnianie pamięci podręcznej. 

Jeśli plik .json zawiera błędy składniowe lub nowe profile nie pracują poprawnie, należy
użyć portletu Analizator kompozycji, aby określić przyczynę problemu. Należy
przejść na stronę Administrowanie -> Analizator kompozycji -> Raport ze
sprawdzania poprawności, a następnie zapoznać się z raportem i wykonać
czynności odpowiednie dla komunikatów o błędzie lub ostrzegawczych. Szczegóły
działań dotyczących profilu można analizować na dowolnej stronie za pomocą opcji Administrowanie ->
Analizator kompozycji -> Badanie informacji o profilu strony. Szczegóły działań dotyczących modułów
dowolnego profilu można analizować za pomocą opcji Administrowanie -> Analizator kompozycji ->
Badanie modułów wg profilu. 



Descrição geral de Perfis (Português)
*****************

Esta pasta 'profiles' no WebDAV é uma pasta bem definida pelo WebSphere Portal para definir qual dos conjuntos de
módulos deve ser carregado pela estrutura do agregador de recursos para temas e páginas específicos. Dentro desta
pasta existe um ficheiro .json por perfil - crie o seu próprio ficheiro .json para o seu próprio perfil. Pode copiar, mudar o nome e
modificar um dos ficheiros .json existentes para consultar e aprender a sintaxe de .json necessária.

Após definir os perfis, pode atribuir um ao perfil predefinido para o tema completo.
Consulte o tópico "Changing the theme default profile" na documentação no wiki para obter informações sobre as formas de o fazer.
E/ou, também pode substituir o perfil predefinido para determinadas páginas, atribuindo um perfil diferente
a essas páginas. Efectue este procedimento através das Propriedades da página da página em questão -> Avançadas -> Definições de tema -> definição Perfil
ou consulte o tópico "Setting a profile override on a page" na documentação no wiki para saber outras formas de efectuar
este procedimento.

Segue-se um resumo da sintaxe de .json:

- Um único objecto com uma matriz moduleIDs (requerida), uma matriz deferredModuleIDs (requerida),
  uma matriz titles (opcional) e uma matriz descriptions (opcional). (Um objecto em notação .json é {} e uma matriz em
  notação .json é []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - de 1 a n cadeias na matriz moduleIDs, sendo que cada cadeia corresponde a um id de módulo, que representa os módulos
    que o sistema deve carregar em todos os modos de página, incluindo o modo de visualização:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - de 1 a n cadeias na matriz deferredModuleIDs, sendo que cada cadeia corresponde a um id de módulo, que representa os módulos
    que o sistema deve diferir apenas até determinados modos de página, como o modo de edição:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
       - de 1 a n objectos na matriz titles, cada um deles com uma cadeia value (requerida) e uma cadeia lang
       (requerida). Estas definem o título ou o nome de apresentação do perfil, tal como irá aparecer em determinadas
    partes do Portal como, por exemplo, na caixa de diálogo Propriedades da página e na portlet Analisador de temas, em todos os idiomas
    necessários:

		"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
       - de 1 a n objectos na matriz descriptions, cada um deles com uma cadeia value (requerida) e uma cadeia lang
       (requerida). Estas definem a descrição do perfil, tal como irá aparecer em determinadas
    partes do Portal como, por exemplo, na caixa de diálogo Propriedades da página e na portlet Analisador de temas, em todos os idiomas
    necessários:

		"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
Sempre que modificar um ficheiro .json nesta pasta 'profiles', terá de invalidar
a cache do agregador de recursos para que o WebSphere Portal recolha as alterações.
Para tal, pode aceder a Administração -> Analisador de temas -> Utilitários -> Control Center.
Na página Control Center, faça clique na ligação sob 'Invalidar cache'.

Se tiver problemas de sintaxe no ficheiro .json ou problemas ao colocar os perfis em funcionamento, utilize a
portlet Analisador de temas para limitar o problema. Aceda a Administração -> Analisador de temas -> Relatório de validação
e examine e tome medidas em relação às mensagens de erro e de aviso. Também pode analisar detalhes do que se está a passar com o perfil de qualquer página, acedendo a Administração -> Analisador de temas -> Examinar informações de perfil da página,
bem como detalhes do que se está a passar com os módulos de qualquer perfil, acedendo a
Administração -> Analisador de temas -> Examinar módulos por perfil.



***************** Visão Geral Perfis (Inglês)

Esta pasta 'perfis' no WebDAV é uma pasta bem definida pelo WebSphere Portal para definir qual conjunto de módulos deve ser carregado pela estrutura do agregador de recursos para temas e páginas particulares. Dentro desta pasta é um arquivo .json por perfil de criar seu próprio arquivo .json para seu próprio perfil. Você pode copiar, renomear e modificar um dos arquivos .json existentes para ver e aprender a sintaxe .json que é necessário.

Depois de definir seus perfis, você pode designar um para ser o perfil padrão para o tema inteira.
Consulte "Alterando o tema padrão do perfil" na documentação wiki para as maneiras de fazer isso. 
E/ou, você também pode substituir o perfil padrão para determinadas páginas, atribuindo um perfil diferente para determinadas páginas. Faça isso por meio da página Propriedades da Página-> Avançado-> Definições de Tema-> Perfil de configuração ou consulte "Configurando uma Substituição de Perfil em uma página" na documentação wiki para formas adicionais para fazer isso.

Um resumo da sintaxe .json é o seguinte:

-Um único objeto com uma matriz moduleIDs (obrigatório), uma matriz deferredModuleIDs (obrigatório), uma matriz títulos (opcional) e uma matriz de descrições (opcional). (Um objeto em notação .json é {} e uma matriz em notação .json é []):

	{ "moduleIDs": [ ], "deferredModuleIDs": [ ], "títulos": [ ], "descrições": [ ] }
	
  -1 a n cadeias na matriz moduleIDs, onde cada cadeia é um id de módulo, que representa os módulos que o sistema deve carregar em todos os modos de página, incluindo modo de visualização :

        "moduleIDs": [ "wp_theme_portal_85", "wp_dynamicContentSpots_85", "wp_toolbar_host", "wp_portlet_css", "wp_one_ui" ],
		
  -1 a n cadeias na matriz deferredModuleIDs, onde cada cadeia é um id de módulo, que representa os módulos que o sistema deve adiar o carregamento até que apenas determinadas páginas modos como modo de edição :

        "deferredModuleIDs": [ "wp_theme_widget", "wp_toolbar", "wp_project_menu_edit", "wp_preview_menu" ],
		
  -1 para n objetos dentro da matriz títulos, cada um com um valor de sequência (obrigatório) e uma cadeia lang (obrigatório). Estes definem o título ou nome de exibição de seu perfil como ela aparecerá em certas partes do Portal como no diálogo Propriedades da Página e o portlet Theme Analyzer, em diferentes idiomas quantas você precisa:
       
		"títulos": [ { "valor":"Meu Perfil ", "lang":"en" } ],
       
  -1 para n objetos dentro da matriz de descrições, cada um com um valor de cadeia (obrigatório) e uma cadeia lang (obrigatório). Estes definem a descrição de seu perfil como ela aparecerá em certas partes do Portal como no diálogo Propriedades da Página e o portlet Theme Analyzer, em diferentes idiomas quantas você precisa:
       
		"descrições": [ { "valor":"Um perfil que fornece funcionalidade xyz ", "lang":"en" } ]
       
Toda vez que você modificar um arquivo .json nesse 'perfis de pasta, você precisa invalidar a cache do agregador de recurso para o WebSphere Portal para assimilar as alterações.
Você pode fazer isso indo para Administração-> Theme Analyzer-> Utilitários-> Centro de Controle.
Na página centro de controle, clique no link sob 'Invalidar Cache'.

Se você tiver qualquer erro de sintaxe em seu .json ou problemas ao obter os seus perfis do para trabalharem, utilize o portlet Theme Analyzer para restringir o problema. Vá para Administração-> Theme Analyzer-> Validação de Relatório e analisar e tomar ações sobre o erro e mensagens de aviso. Você também pode analisar detalhes do que está acontecendo com o perfil de qualquer página indo para Administração-> Theme Analyzer-> Examine página do perfil de informações e detalhes do que está acontecendo com os módulos de qualquer perfil indo para Administração-> Theme Analyzer-> Examinar Módulos por Perfil.



Privire generală profil (English)
*****************

Acest folder 'profiles' din WebDAV este un folder bine definit de WebSphere Portal pentru a defini ce set de
module trebuie încărcat de cadrul de lucru agregator de resurse pentru teme şi pagini particulare. În acest folder este câte un fişier .json pe
profil - creaţi fişierul dumneavoastră propriu .json pentru propriul dumneavoastră profil. Puteţi copia, redenumi şi modifica
unul dintre fişierele existente .json pentru a vedea şi învăţa sintaxa .json care este necesară.

O dată ce definiţi profilurile dumneavoastră, puteţi aloca unul pentru a fi profilul implicit pentru toată tema.
Referiţi-vă la "Modificarea profilului implicit al temei" din documentaţia wiki pentru moduri în care să faceţi aceasta.
Şi/sau, puteţi de asemenea suprascrie profilul implicit pentru anumite pagini prin alocarea unui profil diferit
pentru anumite pagini. Faceţi aceasta prin setarea paginii Proprietăţi pagină -> Avansat -> Setări temă -> Profil
sau referiţi-vă la "Setarea înlocuirii profilului pe o pagină" din documentaţia wiki pentru moduri suplimentare
de a face aceasta.

Un sumar al sintaxei .json este după cum urmează:

- Un singur obiect cu o matrice moduleIDs (necesar), o matrice deferredModuleIDs (necesar),
  o matrice titluri (opţional) şi o matrice descrieri (opţional). (Un obiect în notaţia .json este {} şi o matrice în notaţia
  .json este []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 la n şiruri cu matricea moduleIDs, unde fiecare şir este un ID modul, reprezentând acele module pe care sistemul trebuie să le încarce în toate modurile pagină inclusiv modul vizualizare:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 la n şiruri cu matricea deferredModuleIDs, unde fiecare şir este un ID modul, reprezentând acele module pe care sistemul trebuie să le încarce doar în anumite moduri pagină cum ar fi modul editare:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
       - 1 la n obiecte din matricea titluri, fiecare cu un şir valoare (necesar) şi un şir lang
       (necesar). Acestea definesc titlul sau numele de afişare al profilului dumneavoastră aşa cum apare el în anumite părţi componente
       ale Portalului cum ar fi în dialogul Proprietăţi pagină şi în portletul Analizor temă, în câte limbi diferite
       aveţi nevoie:

"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
       - 1 la n obiecte din matricea descrieri, fiecare cu un şir valoare (necesar) şi un şir lang
       (necesar). Acestea definesc descrierea profilului dumneavoastră aşa cum apare el în anumite părţi componente
       ale Portalului cum ar fi în dialogul Proprietăţi pagină şi în portletul Analizor temă, în câte limbi diferite
       aveţi nevoie:

"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
De fiecare dată când modificaţi un fişier .json din folderul 'profiles', trebuie să invalidaţi
cache-ul agregator resursă pentru WebSphere Portal pentru a alege modificările.
Puteţi face aceasta prin deplasarea la Administrare -> Analizor temă -> Utilitare -> Centrul de control.
Pe pagina Centrul de control apăsaţi legătura de sub 'Invalidare cache'.

Dacă aveţi erori de sintaxă în .json-ul dumneavoastră sau probleme în a face să lucreze profilurile dumneavoastră, utilizaţi
portletul Analizor temă pentru a reduce problema. Deplasaţi-vă la Administrare -> Analizor temă -> Raport validare
şi examinaţi şi faceţi acţiuni pe eroare şi pe mesajele de avertisment. Puteţi de asemenea să analizaţi detaliile a ceea ce se întâmplă
cu profilul pe orice pagină prin deplasarea la Administrare -> Analizor temă  -> Examinare informaţii profil pagină,
şi detalii despre ce se întâmplă cu modulele oricărui profil prin deplasarea la
Administrare -> Analizor temă -> Examinare module prin profil.



Обзор профайлов
*****************

Папка WebDAV 'profiles' описывает набор модулей, загружаемых
средой агрегатора ресурсов WebSphere Portal для конкретных тем и
страниц. В ней расположен один файл .json для каждого профайла -
создайте новый файл .json для своего профайла. Можно скопировать,
переименовать и изменить один из существующих файлов .json, чтобы
получить общее представление о применяемом синтаксисе .json. 

После настройки профайлов можно выбрать профайл по умолчанию для
всей темы. Соответствующие инструкции приведены в разделе вики
"Изменение профайла по умолчанию темы". Кроме того, при
необходимости для отдельных страниц можно переопределить профайл по
умолчанию. Для этого выберите Свойства страницы ->
Дополнительно -> Параметры темы -> Профайл или обратитесь к
разделу вики "Переопределение профайла страницы". 

Ниже приведен обзор синтаксиса .json: 

- Отдельный объект с массивами moduleIDs (обязательный),
deferredModuleIDs (обязательны), titles (необязательный) и
descriptions (необязательный). (Объект в нотации .json обозначается с
помощью {}, массив в нотации .json - []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - Массив moduleIDs содержит 1 - n строк, каждая из которых
представляет собой ИД модуля, загружаемого системой во всех режимах
страниц, включая режим просмотра: 

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - Массив deferredModuleIDs содержит 1 - n строк, каждая из которых
представляет собой ИД модуля, загрузка которого может быть
отложена до перехода в конкретные режимы страницы, такие как режим
редактирования: 

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - Массив titles содержит 1 - n объектов, в каждом из которых
указана строка значения (обязательная) и строка языка (обязательная).
Они задают заголовок или отображаемое имя профайла для отдельных
компонентов портала, таких как окно Свойства страницы и портлет
Анализатор темы, на разных языках:

"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
  - Массив descriptions содержит 1 - n объектов, в каждом из которых указана
строка значения (обязательная) и строка языка (обязательная). Они
задают описание профайла для отдельных
компонентов портала, таких как окно Свойства страницы и портлет
Анализатор темы, на разных языках:

 		"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
Каждый раз после изменения файла .json в папке 'profiles'
необходимо аннулировать кэш агрегатора ресурсов, чтобы применить
изменения в WebSphere Portal. Для этого выберите Администрирование ->
Анализатор темы -> Утилиты -> Центр управления. На странице Центр
управления щелкните на ссылке 'Аннулировать кэш'.

Для исправления синтаксических ошибок .json или неполадок, связанных
с запуском профайлов, следует использовать портлет Анализатор темы.
Выберите Администрирование -> Анализатор темы -> Отчет о проверке и
обработайте сообщения об ошибках и предупреждения. Кроме того,
для анализа профайла любой страницы выберите Администрирование
-> Анализатор темы -> Проверить информацию о профайле страницы, а для
анализа модулей профайла выберите Администрирование -> Анализатор
темы -> Проверить модули по профайлам. 



Prehľad profilov (slovenčina)
*****************

Táto zložka 'profiles' vo WebDAV je dobre definovaná zložka produktom WebSphere Portal na definovanie, ktorú množina modulov má načítať kostra agregátora prostriedkov pre konkrétne témy a strany. V tejto zložke existuje jeden súbor .json pre každý profil - vytvorte vlastný súbor .json pre svoj vlastný profil. Ak si chcete pozrieť vyžadovanú syntax súboru .json a oboznámiť sa s ňou, môžete skopírovať, premenovať a upraviť jeden z existujúcich súborov .json.

Keď definujete svoje profily, jeden môžete určiť ako predvolený profil pre celú tému. Pozrite si časť Zmena predvoleného profilu témy v dokumentácii wiki, kde sa dozviete o rôznych spôsoboch, ako to spraviť. Môžete tiež nahradiť predvolený profil pre určité strany tak, že niektorým stranám priradíte iný profil. Môžete to spraviť výberom položky ponuky Vlastnosti strany -> Rozšírené -> Nastavenia témy -> Nastavenia profilu pre požadovanú stranu. O ďalších spôsoboch, ako to vykonať, sa dozviete v časti Nastavenie nahradenia profilu na strane v dokumentácii wiki.

Súhrn syntaxe súboru .json: 

- Jeden objekt s poľom moduleIDs (povinné), poľom deferredModuleIDs (povinné), poľom titles (voliteľné) a poľom descriptions (voliteľné). (Objekt v notácii .json je {} a pole v notácii .json je []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 až n reťazcov v poli moduleIDs, pričom každý reťazec má ID modulu, ktoré reprezentuje moduly, ktoré má systém načítať vo všetkých režimoch strán vrátane režimu zobrazenia:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 až n reťazcov v poli deferredModuleIDs, pričom každý reťazec má ID modulu, ktoré reprezentuje moduly, ktorých načítanie má systém oneskoriť do doby aktivácie určitých režimov strany, napríklad režimu úprav:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - 1 až n objektov v poli titles, pričom každý má reťazec value (povinné) a reťazec lang (povinné). Tieto definujú zobrazovaný názov vášho modulu, ako sa zobrazí v niektorých častiach Portal, napríklad v dialógovom okne Vlastnosti strany a portlete Analyzátor tém, vo všetkých jazykoch, ktoré potrebujete:

		"titles": [
			{
				"value":"Môj profil",
				"lang":"sk"
			}
		],

  - 1 až n objektov v poli descriptions, pričom každý má reťazec value (povinné) a reťazec lang (povinné). Tieto definujú opis vášho modulu, ako sa zobrazí v niektorých častiach Portal, napríklad v dialógovom okne Vlastnosti strany a portlete Analyzátor tém, vo všetkých jazykoch, ktoré potrebujete:

		"descriptions": [
					{
						"value":"Profil, ktorý poskytuje funkciu xyz",
						"lang":"sk"
					}
				]

Vždy, keď upravíte súbor .json v tejto zložke 'profiles', musíte anulovať pamäť cache agregátora prostriedkov pre WebSphere Portal, aby sa použili zmeny. Spravíte to výberom položky ponuky Administrácia -> Analyzátor tém -> Pomocné programy -> Riadiace centrum.
Na strane Riadiace centrum kliknite na odkaz pod položkou Anulovať pamäť cache.

Ak máte vo svojom .json syntaktické chyby alebo vaše nové profily neviete uviesť do činnosti, použite portlet Analyzátor tém a získajte viac informácií o probléme. Vyberte položku ponuky Administrácia -> Analyzátor tém ->
Prejsť do administrácie -> Analyzátor tém -> Hlásenie o validácii, preskúmajte chybové a varovné správy a vykonajte akciu. Môžete tiež analyzovať podrobnosti o tom, čo sa deje v profile ľubovoľnej strany - vyberte ponuku položky Administrácia -> Analyzátor tém -> Preskúmať informácie o profile strany, alebo analyzovať podrobnosti o tom, čo sa deje v moduloch ľubovoľného profilu - vyberte položku ponuky Administrácia -> Analyzátor tém -> Preskúmať moduly podľa profilu. 



Pregled profilov (slovenščina)
*****************

Mapa 'profiles' v WebDAV je dobro definirana mapa izdelka WebSphere Portal, ki definira, kateri
nabor modulov mora naložiti ogrodje združevalnika virov za posamezne teme in strani. V tej mapi obstaja
ena datoteka .json za vsak profil – za svoj profil izdelajte svojo datoteko .json. Eno od obstoječih datotek .json lahko prekopirate,
preimenujete in spremenite ter si tako ogledate in spoznate zahtevano skladnjo datotek .json. 

Ko definirate svoje profile, lahko enega določite kot privzeti profil za celotno temo.
Če si želite ogledati, kako to storite, glejte razdelek "Spreminjanje privzetega profila teme" v dokumentaciji wiki.
Lahko tudi preglasite privzeti profil za določene strani, tako da jim dodelite drug profil.
To storite tako, da se pomaknete do možnosti Lastnosti strani -> Napredno -> Natavitve tem -> Nastavitve profilov,
ali pa glejte razdelek "Nastavitev preglasitve profila na strani" v dokumentaciji wiki, v kateri
so opisani drugi načini, kako to storite.

Povzetek skladnje datoteke .json:

- En sam objekt z matriko "moduleIDs" (obvezno), matriko "deferredModuleIDs" (obvezno),
  matriko z naslovi "titles" (izbirno) in matriko z opisi "descriptions" (izbirno). (V notaciji .json je objekt {} in
  matrika je []): 

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - Od 1 do n nizov v matriki "moduleIDs", pri čemer je vsak niz ID modula, in predstavljajo module,
    ki jih mora naložiti sistem v vseh načinih strani, vključno z načinom ogleda:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - Od 1 do n nizov v matriki "deferredModuleIDs" pri čemer je vsak niz ID modula, in predstavljajo module,
    za katere mora sistem odložiti nalaganje do zgolj nekaterih načinov strani, kot je npr. način urejanja:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - Od 1 do n objektov v matriki naslovov "titles", pri čemer ima vsak objekt niz za vrednost "value" (obvezno)
    in niz za jezik "lang" (obvezno). Ti definirajo naslov ali ime za prikaz vašega profila, tako kot se prikaže v določenih
    delih portala kot je na primer pogovorno okno Lastnosti strani ali portalski programček Analizator tem, in sicer
    v takšem številu različnih jezikov, kot je potrebno:

		"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],

  - Od 1 do n objektov v matriki opisov "descriptions", pri čemer ima vsak objekt niz za vrednost
    "value" (obvezno) in niz za jezik "lang" (obvezno). Ti definirajo opis vašega profila, tako kot se prikaže v določenih
    delih portala kot je na primer pogovorno okno Lastnosti strani ali portalski programček Analizator tem, in sicer
    v takšem številu različnih jezikov, kot je potrebno:

		"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]

Vsakokrat, ko spremenite datoteko .json v tej mapi 'profiles', morate razveljaviti
predpomnilnik združevalnika virov, da bo portal WebSphere Portal upošteval spremembe.
To lahko storite tako, da se pomaknete do možnosti Skrbništvo -> Analizator tem -> Pripomočki -> Nadzorni center.
Na strani nadzornega centra kliknite povezavo pod 'Razveljavi predpomnilnik'.

Če so v datoteki .json sintaktične napake ali če so težave pri zagonu profilov, uporabite portalski programček
Analizator tem, da boste ugotovili težavo. Pojdite na Skrbništvo -> Analizator tem -> Poročilo o veljavnosti
in preučite ter ukrepajte v zvezi z napako in opozorilnimi sporočili. Podrobnosti o tem, kaj je narobe s profilom
katere koli strani analizirate tako, da se pomaknete do možnosti Skrbništvo -> Analizator tem -> Razišči informacije o profilu strani,
podrobnosti o tem, kaj je narobe z moduli katerega koli profila, pa analizirate tako, da se pomaknete do možnosti
Skrbništvo -> Analizator tem -> Razišči module glede na profile.



Profiler - Översikt (svenska)
*****************

Mappen profiles i WebDAV är en WebSphere Portal-definierad portal för att definiera en uppsättning moduler som läses in av aggregeringsramverket för vissa teman och sidor. I mappen finns en .json-fil per profil - skapa en egen .json-fil för din egen profil. Du kan kopiera, byta namn på och ändra någon av de befintliga .json-filerna för att se och lära dig den .json-syntax som krävs. 

När du definierat dina profiler kan du tilldela en profil som ska vara standardprofil för hela temat.
Läs anvisningarna "Changing the theme default profile" i wikidokumentationen om hur du gör detta.
Du kan också åsidosätta standardprofilen för vissa sidor genom att tilldela en annan profil för vissa sidor. Det gör du genom att välja Egenskaper -> Avancerade -> Temainställningar -> Profilinställningar för sidan. I avsnittet "Setting a profile override on a page" i wikidokumentation finns anvisningar för fler sätt att utföra detta. 

En sammanfattning av .json-syntaxen:

- Ett enstaka objekt med en moduleIDs-matris (obligatoriskt), en deferredModuleIDs-matris (obligatoriskt),
  en namnmatris (valfritt) och en beskrivningsmatris (valfritt). (Ett objekt i .json-notation är {} och en matris i
  .json-notation är []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1-n-strängar i moduleIDs-matrisen, där varje sträng är ett modul-ID, som representerar de moduler som systemet kan läsa in i alla modullägen, inklusive visningsläge:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1-n-strängar i deferredModuleIDs-matrisen, där varje sträng är är ett modul-ID som representerar de moduler som systemet kan fördröja  inläsningen av till vissa sidlägen som redigeringsläge:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
       - 1-n objekt i namnmatrisen, som vardera har en värdesträng (obligatoriskt) och en språksträng
       (obligatoriskt). Dessa definierar namnet- eller visningsnamnet för din profil och visas i vissa delar av portalen, t.ex. i dialogrutan Sidegenskaper och portleten Temaanalys på så många språk som du behöver: "titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
       - 1-n objekt i beskrivningsmatrisen, som vardera har en värdesträng (obligatorisk) och en språksträng (obligatorisk). De definierar beskrivningen av din profil och visas i vissa delar av portalen, t.ex. dialogrutan för sidegenskaper och portleten Temaanalys, på så många språk som du behöver: "descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
Varje gång som du ändrar en .json-fil i mappen profiles måste du ogiltigförklara cachen för resursaggregering så att WebSphere Portal plockar upp ändringarna.
Du kan göra detta genom att gå till Administration -> Temaanalys -> Verktyg -> Kontrollcenter.
På sidan Kontrollcenter klickar du på länken under Ogiltigförklara cache.

Använd portleten Temaanalys för att avgränsa problemet, om det finns syntaxfel i .json eller om du har problemet med att få profilerna att fungera. Gå till Administration -> Temaanalys -> Valideringsrapport
och granska och vidta åtgärder för fel- och varningsmeddelanden. Du kan också analysera detaljerna för vad som pågår i profilen eller på en sida genom att gå till Administration -> Temaanalys -> Granska sidprofilinformation.



Profiles Overview (English)
*****************

This 'profiles' folder within WebDAV is a well defined folder by WebSphere Portal to define which set of 
modules should get loaded by the resource aggregator framework for particular themes and pages. Within this 
folder is one .json file per profile - create your own .json file for your own profile. You can copy, rename
and modify one of the existing .json files in order to see and learn the .json syntax that is required.

Once you define your profiles, you can assign one to be the default profile for the entire theme.
Refer to "Changing the theme default profile" in the wiki documentation for the ways to do this. 
And/or, you can also override the default profile for certain pages by assigning a different profile 
for certain pages. Do this through the page's Page Properties -> Advanced -> Theme Settings -> Profile
setting, or refer to "Setting a profile override on a page" in the wiki documentation for additional ways
to do this.

A summary of the .json syntax is as follows:

- A single object with a moduleIDs array (required), a deferredModuleIDs array (required),
  a titles array (optional) and a descriptions array (optional). (An object in .json notation is {} and 
  an array in .json notation is []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - 1 to n strings within the moduleIDs array, where each string is a module id, representing those modules
    that the system should load in all page modes including view mode:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - 1 to n strings within the deferredModuleIDs array, where each string is a module id, representing those 
    modules that the system should defer loading until only certain pages modes such as edit mode:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - 1 to n objects within the titles array, each with a value string (required) and a lang string
    (required). These define the title or display name of your profile as it will appear in certain
    parts of Portal such as in the Page Properties dialog and Theme Analyzer portlet, in as many different 
    languages as you need:
       
		"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
  - 1 to n objects within the descriptions array, each with a value string (required) and a lang string
    (required). These define the description of your profile as it will appear in certain
    parts of Portal such as in the Page Properties dialog and Theme Analyzer portlet, in as many different 
    languages as you need:
       
		"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
Any time that you modify a .json file in this 'profiles' folder, you need to invalidate
the resource aggregator cache for WebSphere Portal to pick up the changes.
You can do this by going to Administration -> Theme Analyzer -> Utilities -> Control Center.
On the Control Center page click the link under 'Invalidate Cache'.

If you have any syntax errors in your .json or problems getting your profiles to work, use the
Theme Analyzer portlet to narrow down the problem. Go to Administration -> Theme Analyzer -> Validation Report
and examine and take action on the error and warning messages. You can also analyze details of what is going on 
with the profile of any page by going to Administration -> Theme Analyzer -> Examine page profile information,
and details of what is going on with the modules of any profile by going to 
Administration -> Theme Analyzer -> Examine modules by profile.



Profillere Genel Bakış (Türkçe)
*******************************

WebDAV içindeki bu 'profiles' klasörü, belirli temalar ve sayfalar için kaynak toplayıcı çerçevesi
tarafından hangi modüllerin yüklenmesi gerektiğini belirlemek için WebSphere Portal tarafından
'iyi' tanımlanmış bir klasördür. Bu klasörde profil başına tek bir .json dosyası vardır; kendi
profiliniz için kendi .json dosyanızı yaratın. Gereken .json sözdizimini görmek ve öğrenmek için,
var olan .json dosyalarından birini kopyalayabilir, yeniden adlandırabilir ve değiştirebilirsiniz.

Profillerinizi tanımladıktan sonra, birini tüm temanın varsayılan profili olarak atayabilirsiniz.
Bu yapmanın yolları için, viki belgelerinde "Changing the theme default profile" belgesine bakın.
Ve/ya da belirli sayfalar için farklı bir profil atayarak, o sayfaların varsayılan profilini
geçersiz kılabilirsiniz. Bunu yapmak için sayfanın Sayfa Özellikleri -> İleri Düzey -> Tema
Ayarları -> Profil ayarlarına gidin ya da ek yöntemler için viki belgelerinde "Setting a profile
override on a page" başlıklı belgeye bakın. 

.json sözdizimine ilişkin bir özet:

- moduleIDs dizisi içinde tek bir nesne (gerekli), bir deferredModuleIDs dizisi (gerekli),
  titles dizisi (isteğe bağlı) ve descriptions dizisi (isteğe bağlı). (.json gösteriminde
  bir nesne {} ve bir dizi [] olarak tanımlanır):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - moduleIDs dizisi içinde 1 - n nesne; burada her bir dizgi bir modül tanıtıcısıdır ve
    görüntüleme kipi de içinde olmak üzere tüm sayfa kiplerinde yüklenmesi gereken modülleri
    temsil eder: 

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - deferredModuleIDs dizisi içinde 1 - n dizgi; burada her bir dizgi bir modül tanıtıcısıdır ve
    yüklenmesinin, düzenleme kipi gibi belirli sayfa kiplerine girilinceye kadar ertelenmesi gereken
    modülleri temsil eder:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - titles dizisi içinde 1 - n nesne; her birinin bir value dizgisi (gerekli) ve bir lang
    dizgisi (gerekli) vardır. Bunlar, Portal'ın Sayfa Özellikleri iletişim kutusu ve Tema Analizci
    portal uygulamacığı gibi belirli bazı kısımlarında gösterileceği şekilde ve gerek duyduğunuz
    sayıdaki farklı dillerde, modülünüzün başlığını ya da görüntü adını belirler:

		"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
  - descriptions dizisi içinde 1 - n nesne; her birinin bir value dizgisi (gerekli) ve bir lang
    dizgisi (gerekli) vardır. Bunlar, Portal'ın Sayfa Özellikleri iletişim kutusu ve Tema Analizci
    portal uygulamacığı gibi belirli bazı kısımlarında gösterileceği şekilde ve gerek duyduğunuz
    sayıdaki farklı dillerde, modülünüzün tanımını belirler:

		"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
Bu 'profiles' klasöründeki bir .json dosyasında değişiklik yaptığınızda, WebSphere Portal'ın
değişiklikleri alması için kaynak toplayıcı önbelleğini geçersiz kılmalısınız.
Bunu yapmak için Denetim -> Tema Analizci -> Yardımcı Programlar -> Denetim Merkezi'ne gidin.
Denetim Merkezi sayfasında 'Önbelleği Geçersiz Kıl' altındaki bağlantıyı tıklatın.

.json dosyasında sözdizimi hataları ya da profillerinizin çalışmasını engelleyen sorunlar
varsa, sorunu yalıtmak için Tema Analizci portal uygulamacığını kullanın. Denetim -> Tema Analizci
-> Geçerlilik Denetimi Raporu kısmına gidip hata ve uyarı iletilerini inceleyerek gerekenleri yapın.
Ayrıca, bir sayfanın profiliyle ilgili ayrıntıları analiz etmek için Denetim -> Tema Analizci ->
Sayfa Profili Bilgilerini İncele seçeneğini kullanabilirsiniz; bir profilin modülleriyle ilgili
ayrıntıları analiz etmek için de Denetim -> Tema Analizci -> Modülleri Profil Temelinde İncele
seçeneğini kullanabilirsiniz. 



Огляд профайлів (українська)
*****************

Папка profiles у WebDAV, чітко визначена у WebSphere Portal, визначає, який набір модулів має бути
завантажено середовищем агрегатора ресурсів для окремих тем і сторінок. У цій папці для кожного профайлу
є окремий файл .json. Вам потрібно створити власний файл .json для свого профайлу. Для цього
змініть один із існуючих файлів .json, щоб дізнатися, яким має бути формат файлу .json, і навчитися
правильно форматувати його.

Коли профайли буде визначено, ви можете призначити один із них стандартним профайлом усієї теми.
Порядок дій для цього описано в розділі "Зміна стандартного профайлу теми" в документації вікі.
Крім того, стандартний профайл може бути змінено для окремих сторінок. Для таких сторінок необхідно
буде призначити інший профайл. Для цього виберіть Властивості сторінки Properties -> Розширені -> Параметри
теми -> Параметри профайлу. Інщі способи описано в розділі "Налаштування заміни профайлу на сторінці"
документації вікі.

Узагальнену інформацію про формат файлу .json наведено нижче.

- Один об'єкт із масивом moduleIDs (обов'язковий), масивом deferredModuleIDs (обов'язковий),
  масивом titles (необов'язковий) і масивом descriptions (необов'язковий). (Об'єктом у форматі .json є {},
  масивом у форматі .json є []):

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - Від 1 до n рядків у масиві moduleIDs, де кожен рядок є ідентифікатором модуля, який представляє ті
    модулі, що їх система має завантажувати в усіх режимах сторінок, включаючи режим перегляду:

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - Від 1 до n рядків у масиві deferredModuleIDs, де кожен рядок є ідентифікатором модуля, який представляє
    ті модулі, завантаження яких система має відкладати до увімкнення лише окремих режимів сторінок, наприклад
    режиму редагування:

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - Від 1 до n об'єктів у масиві titles , кожен із рядком value (обов'язковий) і рядком
    lang (обов'язковий). Вони визначають заголовок або відображуване ім'я профайлу, яке буде показано
    в певних частинах порталу, наприклад у вікні Властивості сторінки та портлеті Аналізатор тем,
    без обмеження кількості мов:

		"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
  - Від 1 до n об'єктів у масиві описів, кожен із рядком value (обов'язковий) і рядком lang
    (обов'язковий). Вони визначають опис профайлу, який буде показано в певних частинах порталу,
    наприклад у вікні Властивості сторінки та портлеті Аналізатор тем, без обмеження кількості мов:

		"descriptions": [
			{
				"value":"Профайл, що надає функції xyz",
				"lang":"en"
			}
		]

Під час кожної зміни файлу .json у цій папці profiles необхідно анулювати кеш агрегатора ресурсів WebSphere
Portal, щоб зміни набрали чинності.
Для цього виберіть Адміністрування -> Аналізатор тем -> Службові програми -> Центр керування.
На сторінці Центру керування перейдіть за посиланням "Invalidate Cache" (Анулювати кеш).

Якщо у файлі .json є синтаксичні помилки або профайли не працюють, скористайтеся портлетом
Аналізатор тем, щоб звузити неполадку. Виберіть Адміністрування -> Аналізатор тем -> Звіт про
перевірку, перегляньте наведену інформацію і виконайте відповідні дії для усунення причини
помилки або попереджувального повідомлення. Можна також проаналізувати, що відбувається з
профайлом будь-якої сторінки, якщо вибрати Адміністрування -> Аналізатор тем -> Перегляд інформації
про профайл сторінки, і що відбувається з модулями будь-якого профайлу, якщо вибрати Адміністрування
-> Аналізатор тем -> Перегляд модулів по профайлах.



概要文件概述（中文版）
*****************

WebDAV 中的该“profiles”文件夹是由 WebSphere Portal 明确定义的文件夹，可定义资源聚集器框架应该为特定主题和页面装入哪个模块集。在此文件夹中，每个概要文件有一个 .json 文件 - 为自己的概要文件创建 .json 文件。您可以对其中某个现有 .json 文件进行复制、重命名和修改，以便查看并了解所需的 .json 语法。

一旦定义了概要文件，您可以指定一个将作为整个主题的缺省概要文件。
请参阅 Wiki 文档中的“更改主题缺省概要文件”，以获取执行此操作的方法。
另外，您也可以通过为特定页面指定其他概要文件来覆盖特定页面的缺省概要文件。您可通过页面上的页面属性 -> 高级 -> 主题设置 -> 概要文件设置来实现此操作，或者请参阅 Wiki 文档中的“在页面上设置概要文件覆盖”，以获取实现此操作的其他方法。

.json 语法摘要如下所示：

- 含有一个 moduleID 数组（必需）、一个 deferredModuleID 数组（必需）、一个标题数组（可选）以及一个描述数组（可选）的单个对象。（.json 注释中的对象为 {}，而 .json 注释中的数组为 []）：

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - moduleID 数组中 1 至 N 个字符串，其中每个字符串都是一个模块标识，用于表示系统应该以所有页面方式（包括视图方式）装入的模块：

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - deferredModuleID 数组中的 1 至 N 个字符串，其中每个字符串都是一个模块标识，用于表示系统应该延迟装入的模块，直至以特定页面方式（例如，编辑方式）装入为止：

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
  - 标题数组中 1 至 N 个对象，每个对象有一个值字符串（必需）以及一个语言字符串（必需）。这些字符串定义了概要文件在门户网站的特定部分中（例如，在“页面属性”对话框和主题分析器 portlet 中）以各种所需的语言显示时的标题或显示名称：

"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
  - 在描述数组中 1 至 N 个对象，每个对象有一个值字符串（必需）以及一个语言字符串（必需）。这些字符串定义了概要文件在门户网站的特定部分中（例如，在“页面属性”对话框和主题分析器 portlet 中）以各种所需的语言显示时的描述：

"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
每当在该“profiles”文件夹中修改 .json 文件时，您需要将 WebSphere Portal 的资源聚集器高速缓存设定为无效才能使更改生效。
您可以通过转至管理 -> 主题分析器 -> 实用程序 -> 控制中心来执行上述操作。
在“控制中心”页面上单击“将高速缓存设定为无效”下的链接。

如果您的 .json 中存在任何语法错误或者您对使用概要文件有任何问题，请使用主题分析器 portlet 来缩小问题所在的范围。转至管理 -> 主题分析器 -> 验证报告，然后查看错误和警告消息并执行相应操作。您也可以通过转至管理 -> 主题分析器 -> 查看页面概要文件信息来分析任何页面中概要文件的详细情况，并可通过转至管理 -> 主题分析器 -> 按概要文件查看模块来分析任何概要文件中各个模块的详细情况。



設定檔概觀（繁體中文）
***********************

WebDAV 中的此 'profiles' 資料夾是
WebSphere Portal 定義良好的資料夾，用於定義資源聚集器架構應該針對特定佈景主題和頁面載入哪個模組集。
在此資料夾中，包含每個設定檔的一個
.json 檔案 - 建立用於您的專屬設定檔的專屬 .json 檔案。 您可以複製、重新命名和修改
現有 .json 檔案之一，以便查看並瞭解所需的 .json 語法。

定義設定檔之後，您可以將其中一個設定檔指派為整個佈景主題的預設設定檔。
如需執行指派方法，請參閱 Wiki 文件中的「變更佈景主題預設設定檔」。
此外，您還可以透過為某些頁面指派不同的設定檔，置換這些頁面的預設設定檔。
為此，請造訪頁面的「頁面內容」->「進階」->「佈景主題設定」->「設定檔」設定，
或者如需執行此動作的其他方法，請參閱 Wiki 文件中的「設定頁面的設定檔置換」。

.json 語法的摘要如下所示：

- 具有 moduleIDs 陣列的單一物件（必要）、一個 deferredModuleIDs 陣列（必要）、
  一個 titles 陣列（選用）和一個 descriptions 陣列（選用）。（在 .json 表示法中，物件是 {}，
 在 .json 表示法中，陣列是 []）：

	{
		"moduleIDs": [
		],
		"deferredModuleIDs": [
		],
		"titles": [
		],
		"descriptions": [
		]
	}
	
  - moduleIDs 陣列中的 1 至 n 個字串，其中每個字串都是一個模組 ID，
    表示系統應該在所有頁面模式（包括檢視模式）中載入的那些模組：

        "moduleIDs": [
	      "wp_theme_portal_85",
    	  "wp_dynamicContentSpots_85",
	      "wp_toolbar_host",
    	  "wp_portlet_css",
	      "wp_one_ui"
		],
		
  - deferredModuleIDs 陣列中的 1 到 n 個字串，其中每個字串都是一個模組 ID，
    表示系統應該延遲到僅存在某些頁面模式（例如編輯模式）才載入的那些模組：

        "deferredModuleIDs": [
	      "wp_theme_widget",
    	  "wp_toolbar",
	      "wp_project_menu_edit",
    	  "wp_preview_menu"
		],
		
      - titles 陣列中的 1 到 n 個物件，每個物件都有一個 value 字串（必要）和一個 lang 字串
       （必要）。這些物件定義設定檔在入口網站的特定組件中（例如在頁面內容對話框和佈景主題分析器 Portlet 中）採用所需數目的不同語言顯示的標題或顯示名稱：

"titles": [
			{
				"value":"My Profile",
				"lang":"en"
			}
		],
       
      - descriptions 陣列中的 1 到 n 個物件，每個物件都有一個 value 字串（必要）和一個 lang 字串
       （必要）。這些物件定義設定檔在入口網站的特定組件中（例如在頁面內容對話框和佈景主題分析器 Portlet 中）採用所需數目的不同語言顯示的說明：

"descriptions": [
			{
				"value":"A profile that provides xyz functionality",
				"lang":"en"
			}
		]
       
當您修改此 'profiles' 資料夾中的 .json 檔案時，您需要使
WebSphere Portal 的資源聚集器快取失效才用套用變更。
為此，請執行以下動作：
移至「管理」->「佈景主題分析器」->「公用程式」->「控制中心」。
在「控制中心」頁面上，按一下「使快取失效」鏈結。

如果您的 .json 中有任何語法錯誤或讓設定檔工作時發生問題，
請使用佈景主題分析器 Portlet 來縮小問題的範圍。跳至「管理」->「佈景主題分析器」->「驗證報告」，
然後檢查錯誤和警告訊息並採取動作。您也可以分析透過任何頁面的設定檔將顯示哪些內容，
方法是跳至「管理」->「佈景主題分析器」->「檢查頁面設定檔資訊」，
分析透過任何設定檔的模組將顯示哪些內容，
方法是跳至「管理」->「佈景主題分析器」->「依設定檔檢查模組」。



