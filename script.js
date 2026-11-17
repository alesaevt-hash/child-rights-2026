const API_URL = "https://script.google.com/macros/s/AKfycbzi_0mF2WRkYwQDlZxmc-qVlfkNLPiCetrxegci-KE878_atUdykrUZzcyLHHoU_noEEw/exec";

let language = "ru";
let participant = {};
let questions = [];
let currentQuestion = 0;
let score = 0;
let selected = null;
let startedAt = 0;
let answersLog = [];

const translations = {
  ru: {
    date:"20 НОЯБРЯ · МЕЖДУНАРОДНЫЙ ДЕНЬ РЕБЁНКА",
    title:"Детство без неуважения и жестокости",
    subtitle:"Каждый ребёнок имеет право на счастливое, безопасное и достойное детство.",
    start:"Пройти тест →",
    right1:"Право на защиту",
    right1d:"Каждый ребёнок должен быть защищён от насилия.",
    right2:"Право на уважение",
    right2d:"Мнение и достоинство каждого ребёнка важны.",
    right3:"Право на образование",
    right3d:"Каждый ребёнок имеет право учиться и развиваться.",
    aboutTitle:"О нашей акции",
    aboutText:"20 ноября во всём мире отмечается Всемирный день ребёнка. Эта акция напоминает о важности защиты прав детей, взаимного уважения и недопустимости жестокого обращения.",
    step1:"ШАГ 1 · ДАННЫЕ УЧАСТНИКА",
    regTitle:"Регистрация участника",
    regDesc:"Заполни данные, чтобы начать тестирование.",
    surname:"Фамилия",firstname:"Имя",grade:"Класс",
    continue:"Продолжить →",back:"Назад",
    questionLabel:"ВОПРОС",
    finished:"Тест завершён!",home:"На главную",
    footer:"Вместе за детство без жестокости ❤️",
    question:"Вопрос",next:"Следующий вопрос →",
    finish:"Завершить тест",
    nameError:"Заполни фамилию, имя и выбери класс.",
    answerError:"Выбери один вариант ответа.",
    resultGood:"Отличный результат! Ты хорошо знаешь права ребёнка.",
    resultMid:"Хорошая работа! Продолжай узнавать о своих правах.",
    resultLow:"Продолжай изучать свои права. Каждый ребёнок достоин уважения.",
    sending:"Отправляем результат в Google Таблицу...",
    sent:"Результат успешно сохранён!",
    failed:"Не удалось сохранить результат. Сообщи организатору.",
    correct:"Правильно",wrong:"Неправильно"
  },
  kz: {
    date:"20 ҚАРАША · ДҮНИЕЖҮЗІЛІК БАЛАЛАР КҮНІ",
    title:"Құрметсіздік пен қатыгездіксіз балалық шақ",
    subtitle:"Әрбір бала бақытты, қауіпсіз әрі лайықты балалық шаққа құқылы.",
    start:"Тест тапсыру →",
    right1:"Қорғалуға құқылы",
    right1d:"Әрбір бала зорлық-зомбылықтан қорғалуы тиіс.",
    right2:"Құрметке құқылы",
    right2d:"Әрбір баланың пікірі мен қадір-қасиеті маңызды.",
    right3:"Білім алуға құқылы",
    right3d:"Әрбір бала білім алуға және дамуға құқылы.",
    aboutTitle:"Акция туралы",
    aboutText:"20 қарашада бүкіл әлемде Дүниежүзілік балалар күні атап өтіледі. Бұл акция балалардың құқықтарын қорғаудың, өзара құрмет пен қатыгездікке жол бермеудің маңыздылығын еске салады.",
    step1:"1-ҚАДАМ · ҚАТЫСУШЫ ТУРАЛЫ МӘЛІМЕТ",
    regTitle:"Қатысушыны тіркеу",
    regDesc:"Тестілеуді бастау үшін мәліметтерді толтыр.",
    surname:"Тегі",firstname:"Аты",grade:"Сыныбы",
    continue:"Жалғастыру →",back:"Артқа",
    questionLabel:"СҰРАҚ",
    finished:"Тест аяқталды!",home:"Басты бетке",
    footer:"Қатыгездіксіз балалық шақ үшін бірге болайық ❤️",
    question:"Сұрақ",next:"Келесі сұрақ →",
    finish:"Тестті аяқтау",
    nameError:"Тегіңді, атыңды және сыныбыңды көрсет.",
    answerError:"Жауап нұсқасын таңда.",
    resultGood:"Тамаша нәтиже! Сен бала құқықтарын жақсы білесің.",
    resultMid:"Жақсы нәтиже! Өз құқықтарыңды білуге ұмтыла бер.",
    resultLow:"Өз құқықтарыңды зерделеуді жалғастыр. Әрбір бала құрметке лайық.",
    sending:"Нәтиже Google кестесіне жіберілуде...",
    sent:"Нәтиже сәтті сақталды!",
    failed:"Нәтижені сақтау мүмкін болмады. Ұйымдастырушыға хабарла.",
    correct:"Дұрыс",wrong:"Қате"
  }
};

// Демонстрационные вопросы.
// Полные комплекты вопросов для 1–11 классов
// будут добавлены после согласования содержания.
const questionBank = {
  ru: [
    {q:"Какой международный документ закрепляет права детей?",a:["Устав школы","Конвенция о правах ребёнка","Правила дорожного движения","Трудовой кодекс"],c:1},
    {q:"Имеет ли каждый ребёнок право на образование?",a:["Да","Нет","Только отличники","Только взрослые"],c:0},
    {q:"Что нужно сделать, если ты стал свидетелем травли?",a:["Присоединиться","Смеяться","Обратиться к взрослому, которому доверяешь","Игнорировать"],c:2},
    {q:"Что означает уважение к другому человеку?",a:["Оскорблять","Учитывать его достоинство и мнение","Угрожать","Высмеивать"],c:1},
    {q:"Кто должен защищать права ребёнка?",a:["Только друзья","Только одноклассники","Государство, родители и ответственные взрослые","Никто"],c:2},
    {q:"Имеет ли ребёнок право выражать своё мнение?",a:["Да","Нет","Только дома","Только письменно"],c:0},
    {q:"Что такое буллинг?",a:["Дружба","Систематическая травля и унижение","Спортивная игра","Помощь другу"],c:1},
    {q:"Что следует делать при угрозах и насилии?",a:["Молчать","Скрывать","Обратиться за помощью к надёжному взрослому","Мстить"],c:2},
    {q:"Все ли дети имеют равные права?",a:["Только старшие","Только отличники","Да","Только взрослые"],c:2},
    {q:"Как следует относиться к личным границам другого человека?",a:["Уважать их","Игнорировать","Нарушать ради шутки","Высмеивать"],c:0}
  ],
  kz: [
    {q:"Балалардың құқықтарын бекітетін халықаралық құжат қалай аталады?",a:["Мектеп жарғысы","Бала құқықтары туралы конвенция","Жол қозғалысы ережелері","Еңбек кодексі"],c:1},
    {q:"Әрбір баланың білім алуға құқығы бар ма?",a:["Иә","Жоқ","Тек үздік оқушылардың","Тек ересектердің"],c:0},
    {q:"Егер сен қорлаудың куәсі болсаң, не істеу керек?",a:["Қосылу","Күлу","Сенетін ересек адамға хабарлау","Елемеу"],c:2},
    {q:"Басқа адамды құрметтеу дегеніміз не?",a:["Қорлау","Оның қадір-қасиеті мен пікірін ескеру","Қорқыту","Мазақ ету"],c:1},
    {q:"Баланың құқықтарын кім қорғауы тиіс?",a:["Тек достары","Тек сыныптастары","Мемлекет, ата-аналар және жауапты ересектер","Ешкім"],c:2},
    {q:"Баланың өз пікірін білдіруге құқығы бар ма?",a:["Иә","Жоқ","Тек үйде","Тек жазбаша түрде"],c:0},
    {q:"Буллинг дегеніміз не?",a:["Достық","Жүйелі түрде қудалау және қорлау","Спорттық ойын","Досқа көмектесу"],c:1},
    {q:"Қорқыту немесе зорлық-зомбылық жағдайында не істеу керек?",a:["Үндемеу","Жасыру","Сенімді ересек адамнан көмек сұрау","Кек алу"],c:2},
    {q:"Барлық балалардың құқықтары тең бе?",a:["Тек ересектерде","Тек үздік оқушыларда","Иә","Тек үлкендерде"],c:2},
    {q:"Басқа адамның жеке шекарасына қалай қарау керек?",a:["Құрметтеу","Елемеу","Әзіл үшін бұзу","Мазақ ету"],c:0}
  ]
};

function setLanguage(lang) {
  language = lang;
  document.documentElement.lang = lang;
  document.getElementById("ruBtn").classList.toggle("active",lang==="ru");
  document.getElementById("kzBtn").classList.toggle("active",lang==="kz");

  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key=el.dataset.i18n;
    el.textContent=translations[lang][key] || el.textContent;
  });

  document.getElementById("surname").placeholder=translations[lang].surname;
  document.getElementById("firstName").placeholder=translations[lang].firstname;
  if (questions.length && document.getElementById("quiz").classList.contains("active")) {
    questions=questionBank[lang];
    currentQuestion=0;
    score=0;
    answersLog=[];
    renderQuestion();
  }
}

function showPage(id) {
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}

function goHome() {
  showPage("home");
}

function startQuiz() {
  const surname=document.getElementById("surname").value.trim();
  const firstName=document.getElementById("firstName").value.trim();
  const grade=document.getElementById("grade").value;
  const section=document.getElementById("section").value;
  const error=document.getElementById("formError");

  if(!surname || !firstName || !grade || !section) {
    error.textContent=translations[language].nameError;
    return;
  }

  participant={surname,firstName,grade:Number(grade),section,language};
  questions=questionBank[language];
  currentQuestion=0;
  score=0;
  answersLog=[];
  startedAt=Date.now();

  document.getElementById("classDisplay").textContent=grade+" "+section;
  showPage("quiz");
  renderQuestion();
}

function renderQuestion() {
  const q=questions[currentQuestion];
  selected=null;

  document.getElementById("questionCount").textContent=
    `${translations[language].question} ${currentQuestion+1} / ${questions.length}`;

  document.getElementById("progressBar").style.width=
    ((currentQuestion+1)/questions.length*100)+"%";

  document.getElementById("questionText").textContent=q.q;
  document.getElementById("quizError").textContent="";

  const container=document.getElementById("answerOptions");
  container.innerHTML="";

  q.a.forEach((answer,i)=>{
    const btn=document.createElement("button");
    btn.className="answer-option";
    btn.textContent=String.fromCharCode(65+i)+". "+answer;

    btn.onclick=()=>{
      selected=i;
      container.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));
      btn.classList.add("selected");
    };

    container.appendChild(btn);
  });

  document.getElementById("nextBtn").textContent=
    currentQuestion===questions.length-1
    ? translations[language].finish
    : translations[language].next;
}

function nextQuestion() {
  if(selected===null) {
    document.getElementById("quizError").textContent=
      translations[language].answerError;
    return;
  }

  const q=questions[currentQuestion];
  const isCorrect=selected===q.c;

  if(isCorrect) score++;

  answersLog.push({
    question:q.q,
    selectedAnswer:q.a[selected],
    correctAnswer:q.a[q.c],
    isCorrect
  });

  if(currentQuestion<questions.length-1) {
    currentQuestion++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

async function finishQuiz() {
  showPage("result");

  const percent=Math.round(score/questions.length*100);
  const duration=Math.round((Date.now()-startedAt)/1000);
  const t=translations[language];

  document.getElementById("participantName").textContent=
    participant.surname+" "+participant.firstName+" · "+
    participant.grade+" "+participant.section;

  document.getElementById("scoreDisplay").textContent=
    score+" / "+questions.length;

  document.getElementById("resultMessage").textContent=
    percent>=80?t.resultGood:percent>=50?t.resultMid:t.resultLow;

  const status=document.getElementById("savingStatus");
  status.textContent=t.sending;

  const payload={
    action:"submit",
    surname:participant.surname,
    firstName:participant.firstName,
    grade:participant.grade,
    section:participant.section,
    language:participant.language,
    score,
    total:questions.length,
    durationSeconds:duration,
    answers:answersLog
  };

  try {
    const response=await fetch(API_URL,{
      method:"POST",
      body:JSON.stringify(payload)
    });

    const data=await response.json();

    if(!data.ok) throw new Error(data.message);

    status.textContent="✓ "+t.sent;
    status.style.color="#16834b";

  } catch(error) {
    console.error(error);
    status.textContent="⚠ "+t.failed;
    status.style.color="#c03945";
  }
}

setLanguage("ru");
