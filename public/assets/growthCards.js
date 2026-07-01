(function () {
  const STORAGE_KEY = "kriauklyciu-growth-library-v1";
  const updated = "2026-06-29";

  const defaultCards = [
    {
      cardId: "MI-001-C01",
      missionId: "MI-001",
      category: "Miegas",
      title: "Pati užmigau be kitų",
      image: "/cards/mi-001-layered.png",
      shellIcon: "/icons/shell-growth-pearl.png",
      points: 3,
      layout: { variant: "layeredSleepCard" },
      version: "1.0",
      author: "Krabukų biblioteka",
      lastUpdated: updated,
      supportsPersonalization: true,
      supportsGender: true,
      archived: false,
      competencies: [
        "Savarankiškumas",
        "Pasitikėjimas savimi",
        "Drąsa"
      ],
      fixedText: {
        shortMessage: "Tu pasirūpinai savimi ir buvai labai drąsi.",
        whyImportant: "Kai vaikai patys užmiega, jie mokosi pasitikėti savimi, stiprina emocinį saugumą ir žengia mažą žingsnį į savarankiškumą."
      },
      dynamicScenarios: [
        {
          scenarioId: "FIRST_TIME",
          conditionLabel: "Pirmas kartas",
          childMessage: "Šiandien tau pavyko labai svarbus pirmas žingsnis. Tu pati užmigai ir parodei, kad tavo širdelėje auga drąsa.",
          parentMessage: "Pastebėkite ne tik rezultatą, bet ir vaiko pastangas nurimti pačiam.",
          eveningGift: "Pasakykite: „Labai didžiuojuosi tavimi, kad šiandien pati užmigai.“ Ir apkabinkite prieš miegą."
        },
        {
          scenarioId: "AFTER_FAILURE",
          conditionLabel: "Po sunkesnio vakaro",
          childMessage: "Kartais būna sunkesnių vakarų, bet šiandien tu vėl pabandei ir tau pavyko. Tai labai graži pergalė.",
          parentMessage: "Po nesėkmės vaikui ypač svarbu išgirsti, kad jis nėra vertinamas pagal vieną sunkų vakarą.",
          eveningGift: "Pasakykite: „Man patinka, kad tu bandai dar kartą. Aš matau tavo pastangas.“"
        },
        {
          scenarioId: "SUCCESS_STREAK_3",
          conditionLabel: "3 dienos iš eilės",
          childMessage: "Jau kelis vakarus iš eilės tau sekasi vis geriau. Tavo ramybės supergalia stiprėja.",
          parentMessage: "Trumpai įvardinkite nuoseklumą. Vaikui svarbu girdėti, kad jo pastangos pastebimos ne vieną kartą.",
          eveningGift: "Pasakykite: „Pastebiu, kad tau vis lengviau užmigti pačiai.“"
        },
        {
          scenarioId: "SUCCESS_STREAK_7",
          conditionLabel: "7 dienos iš eilės",
          childMessage: "Visa savaitė mažų vakaro pergalių! Tu augini labai gražų savarankiškumo įprotį.",
          parentMessage: "Kai įprotis kartojasi savaitę, verta jį paversti vaiko pasididžiavimo istorija.",
          eveningGift: "Pasakykite: „Šią savaitę tu labai paaugai. Aš tavimi didžiuojuosi.“"
        },
        {
          scenarioId: "SUCCESS_STREAK_14",
          conditionLabel: "14 dienų iš eilės",
          childMessage: "Jau dvi savaites tavo vakarai tampa ramesni. Tai ne atsitiktinumas – tai tavo auganti stiprybė.",
          parentMessage: "Ilgesnė sėkmės grandinė rodo, kad įgūdis tampa vaiko kasdienybės dalimi.",
          eveningGift: "Pasakykite: „Matau, kad tai jau tampa tavo stiprybe.“"
        },
        {
          scenarioId: "SUCCESS_STREAK_30",
          conditionLabel: "30 dienų iš eilės",
          childMessage: "Tai jau tikras didelis įprotis. Tu išmokai pasirūpinti savo vakaro ramybe.",
          parentMessage: "Po mėnesio sėkmės galima mažinti išorinį skatinimą ir daugiau remtis vidiniu vaiko pasididžiavimu.",
          eveningGift: "Paklauskite: „Kaip tu pati jautiesi, kai jau taip gerai moki užmigti?“"
        },
        {
          scenarioId: "BIG_PROGRESS",
          conditionLabel: "Didelė pažanga",
          childMessage: "Šiandien tu padarei didelį šuolį. Kartais vienas vakaras parodo, kiek daug jau išmokai.",
          parentMessage: "Didelės pažangos dieną svarbu sustiprinti vaiko tikėjimą savimi.",
          eveningGift: "Pasakykite: „Šiandien pamačiau, kiek daug tu gali.“"
        },
        {
          scenarioId: "SMALL_PROGRESS",
          conditionLabel: "Mažas žingsnis",
          childMessage: "Net mažas žingsnelis yra svarbus. Šiandien tavo širdelė paaugo truputį daugiau.",
          parentMessage: "Ne visos pažangos būna didelės. Maži žingsniai kuria ilgalaikius įpročius.",
          eveningGift: "Pasakykite: „Man patinka, kad tu stengeisi.“"
        },
        {
          scenarioId: "LONG_BREAK",
          conditionLabel: "Sugrįžimas po pertraukos",
          childMessage: "Po ilgesnės pertraukos vėl pavyko. Vėžliukas žino: svarbu ne skubėti, o grįžti prie gero kelio.",
          parentMessage: "Po pertraukos nereikia priminti, kiek laiko nepavyko. Geriau pažymėti sugrįžimą.",
          eveningGift: "Pasakykite: „Smagu matyti, kad šiandien vėl pabandei ir tau pavyko.“"
        },
        {
          scenarioId: "DEFAULT",
          conditionLabel: "Įprasta sėkmė",
          childMessage: "Šiandien tu pasirūpinai savimi ir buvai labai drąsi. Vėžliukas tavimi džiaugiasi.",
          parentMessage: "Trumpas, konkretus pagyrimas stiprina vaiko savarankiškumą.",
          eveningGift: "Pasakykite: „Labai džiaugiuosi, kad šiandien pati užmigai.“"
        }
      ]
    }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeLibrary(raw) {
    const cards = Array.isArray(raw?.cards) && raw.cards.length ? raw.cards : clone(defaultCards);
    const existingIds = new Set(cards.map(card => card.cardId));
    defaultCards.forEach(card => {
      if (!existingIds.has(card.cardId)) cards.unshift(clone(card));
    });
    return {
      schemaVersion: 1,
      updatedAt: raw?.updatedAt || new Date().toISOString(),
      cards
    };
  }

  function load() {
    try {
      return normalizeLibrary(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"));
    } catch {
      return normalizeLibrary(null);
    }
  }

  function save(library) {
    const next = normalizeLibrary(library);
    next.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  function getCard(cardId) {
    return load().cards.find(card => card.cardId === cardId) || null;
  }

  function activeCards() {
    return load().cards.filter(card => !card.archived);
  }

  window.KrabukaiGrowthLibrary = {
    STORAGE_KEY,
    defaultCards: clone(defaultCards),
    load,
    save,
    getCard,
    activeCards,
    clone
  };
})();
