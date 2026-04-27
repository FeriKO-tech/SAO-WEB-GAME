/**
 * Home page translations (all 8 locales).
 *
 * Migrated verbatim from the inline dictionary in the legacy `sao.html`.
 * `nav`, `settings`, `logout` already live in `common.ts` - not duplicated here.
 */

import type { LanguageMap } from '@models/i18n';

export interface HomeDict {
    // Hero
    badge: string;
    title: string;
    /** Three hero action buttons: [play, news, forum]. */
    buttons: [string, string, string];
    scrollHint: string;

    // About section
    aboutTitle: string;
    aboutP1: string;
    aboutP2: string;
    aboutP3: string;
    aboutCard1: string;
    aboutCard2: string;

    // Features
    featuresTitle: string;
    f1Title: string; f1Desc: string;
    f2Title: string; f2Desc: string;
    f3Title: string; f3Desc: string;
    f4Title: string; f4Desc: string;
    f5Title: string; f5Desc: string;
    f6Title: string; f6Desc: string;

    // Footer
    /** Contains `&copy;` - safe to inject as text. */
    footerCopy: string;
    /** Four links: [terms, privacy, email, jobs]. Email is also the visible label. */
    footerLinks: [string, string, string, string];

    // Entry overlay
    entrySubtitle: string;
    entryBtn: string;
    entryHint: string;
    entrySkip: string;

    // Play Now -> waitlist modal
    waitlistTitle: string;
    /** Contains inline HTML (`<strong>`), rendered via innerHTML. */
    waitlistDesc: string;
    waitlistEmailLabel: string;
    waitlistEmailPh: string;
    waitlistNote: string;
    waitlistSubmit: string;
    waitlistSubmitting: string;
    waitlistCancel: string;
    waitlistClose: string;
    waitlistSuccessTitle: string;
    /** Template built with the email at runtime. */
    waitlistSuccessMsg: (email: string) => string;
    waitlistErrInvalid: string;
    waitlistErrAlready: string;
    waitlistErrNetwork: string;
    waitlistErrUnknown: string;
}

export const homeTranslations: LanguageMap<HomeDict> = {
    RU: {
        badge: 'Браузерная MMORPG',
        title: 'Мастера Меча Онлайн',
        buttons: ['Играть сейчас', 'Новости', 'Форум'],
        scrollHint: 'Узнать больше',

        aboutTitle: 'Об игре',
        aboutP1: 'Исследуйте живой виртуальный мир, населённый монстрами, загадками и тысячами других игроков. Создавайте героя, прокачивайте умения и находите свой путь в обширной вселенной.',
        aboutP2: 'Преодолевайте опасные подземелья, побеждайте могущественных боссов, собирайте редкое снаряжение и пробивайтесь на вершину мирового рейтинга!',
        aboutP3: 'Прокачивайтесь в любом месте и в любое время, ведь эта игра прекрасно работает и смотрится как на компьютере, так и на мобильном устройстве! Герой сам исследует мир и сражается, поэтому управление здесь очень удобное даже на экране смартфона!',
        aboutCard1: 'Живой открытый мир',
        aboutCard2: 'БЕСКОНЕЧНЫЙ ПРОГРЕСС',

        featuresTitle: 'Особенности игры',
        f1Title: 'Глубокий мир и сюжет',
        f1Desc: 'Обширные локации, тысячи квестов и многоуровневая сюжетная линия. Каждый выбор влияет на судьбу вашего героя и формирует уникальный игровой опыт.',
        f2Title: 'Кроссплатформенность',
        f2Desc: 'Играйте где угодно - проект прекрасно оптимизирован и одинаково хорошо смотрится как на большом экране ПК, так и на смартфоне!',
        f3Title: 'Взрывной геймплей',
        f3Desc: 'Динамичные бои с удобным автобоем. Повышайте мощь, меняйте экипировку и используйте мощные умения даже на ходу!',
        f4Title: 'Верные спутники',
        f4Desc: 'Собирайте команду из сильных напарников, прокачивайте их способности и создавайте непобедимые боевые составы.',
        f5Title: 'Эпические боссы',
        f5Desc: 'Бросайте вызов невероятно сильным противникам. Используйте тактику, плавку и ковку вещей, чтобы одержать победу!',
        f6Title: 'PvP и Кланы',
        f6Desc: 'Создавайте могущественные гильдии, объединяйтесь с друзьями и сражайтесь на аренах за звание сильнейшего бойца сервера!',

        footerCopy: 'Игровой портал Sword Art Online LLC © 2026 – 2026',
        footerLinks: ['Условия пользовательского соглашения', 'Политика конфиденциальности', 'saoweb.support@gmail.com', 'Вакансии'],

        entrySubtitle: 'Браузерная MMORPG - играйте прямо в браузере',
        entryBtn: 'Войти в игру',
        entryHint: 'Нажмите чтобы включить звук',
        entrySkip: 'Больше не показывать',

        waitlistTitle: 'Открытая бета скоро!',
        waitlistDesc: 'Игра пока в разработке. Оставьте email и мы <strong>первыми</strong> сообщим вам, как только сервер запустится.',
        waitlistEmailLabel: 'Ваш email',
        waitlistEmailPh: 'you@example.com',
        waitlistNote: 'Никакого спама. Только одно письмо: когда откроем серверы.',
        waitlistSubmit: 'Напишите мне когда запуститесь',
        waitlistSubmitting: 'Отправляем...',
        waitlistCancel: 'Позже',
        waitlistClose: 'Закрыть',
        waitlistSuccessTitle: 'Спасибо!',
        waitlistSuccessMsg: (email) => `Мы напишем на ${email} как только откроем серверы. А пока подпишитесь на наш Discord и форум, чтобы не пропустить новости.`,
        waitlistErrInvalid: 'Некорректный email',
        waitlistErrAlready: 'Вы уже в списке ожидания - мы точно не забудем!',
        waitlistErrNetwork: 'Ошибка сети - проверьте подключение',
        waitlistErrUnknown: 'Что-то пошло не так. Попробуйте позже.',
    },

    EN: {
        badge: 'Browser MMORPG',
        title: 'Sword Art Online',
        buttons: ['Play Now', 'News', 'Forum'],
        scrollHint: 'Learn More',

        aboutTitle: 'About Game',
        aboutP1: 'Explore a living virtual world filled with monsters, mysteries, and thousands of other players. Create your hero, develop your skills, and forge your own path across a vast universe.',
        aboutP2: 'Conquer dangerous dungeons, defeat powerful bosses, gather rare gear, and fight your way to the top of the global rankings!',
        aboutP3: 'Level up anywhere and anytime, because this game works perfectly and looks great on both a computer and a mobile device! The hero explores the world and fights on his own, so the controls are very convenient even on a smartphone screen!',
        aboutCard1: 'Vast Open World',
        aboutCard2: 'ENDLESS PROGRESSION',

        featuresTitle: 'Game Features',
        f1Title: 'Deep World & Story',
        f1Desc: 'Expansive regions, thousands of quests, and a branching storyline. Every choice shapes your hero’s fate and creates a unique experience.',
        f2Title: 'Cross-platform',
        f2Desc: 'Play anywhere - the project is perfectly optimized and looks equally good on a large PC screen and on a smartphone!',
        f3Title: 'Explosive Gameplay',
        f3Desc: 'Dynamic battles with convenient auto-combat. Increase power, change equipment, and use powerful skills even on the go!',
        f4Title: 'Loyal Companions',
        f4Desc: 'Recruit powerful allies, level up their abilities, and build unbeatable combat teams.',
        f5Title: 'Epic Bosses',
        f5Desc: 'Challenge incredibly strong opponents. Use tactics, smelting, and forging items to achieve victory!',
        f6Title: 'PvP and Clans',
        f6Desc: 'Create powerful guilds, team up with friends, and fight in arenas for the title of the strongest fighter on the server!',

        footerCopy: 'Gaming Portal Sword Art Online LLC © 2026 – 2026',
        footerLinks: ['Terms of Service', 'Privacy Policy', 'saoweb.support@gmail.com', 'Jobs'],

        entrySubtitle: 'Browser MMORPG - play right in your browser',
        entryBtn: 'Enter the game',
        entryHint: 'Click to enable sound',
        entrySkip: "Don't show this again",

        waitlistTitle: 'Open Beta coming soon!',
        waitlistDesc: 'The game is still in development. Drop your email and we will be the <strong>first</strong> to let you know when servers go live.',
        waitlistEmailLabel: 'Your email',
        waitlistEmailPh: 'you@example.com',
        waitlistNote: 'No spam. Just one email: when we launch.',
        waitlistSubmit: 'Notify me on launch',
        waitlistSubmitting: 'Submitting...',
        waitlistCancel: 'Later',
        waitlistClose: 'Close',
        waitlistSuccessTitle: 'Thank you!',
        waitlistSuccessMsg: (email) => `We will email ${email} as soon as servers open. Meanwhile, join our Discord and forum so you don't miss news.`,
        waitlistErrInvalid: 'Invalid email address',
        waitlistErrAlready: 'You are already on the waitlist - we will not forget!',
        waitlistErrNetwork: 'Network error - check your connection',
        waitlistErrUnknown: 'Something went wrong. Please try again later.',
    },

    DE: {
        badge: 'Browser-MMORPG',
        title: 'Sword Art Online',
        buttons: ['Jetzt spielen', 'Neuigkeiten', 'Forum'],
        scrollHint: 'Mehr erfahren',

        aboutTitle: 'Über das Spiel',
        aboutP1: 'Erkundet eine lebendige virtuelle Welt voller Monster, Geheimnisse und Tausender anderer Spieler. Erschafft euren Helden, entwickelt eure Fähigkeiten und findet euren eigenen Weg durch ein weitläufiges Universum.',
        aboutP2: 'Bezwingt gefährliche Dungeons, besiegt mächtige Bosse, sammelt seltene Ausrüstung und kämpft euch an die Spitze der globalen Rangliste!',
        aboutP3: 'Steigen Sie überall und jederzeit auf, denn dieses Spiel funktioniert perfekt und sieht sowohl auf dem Computer als auch auf dem Smartphone großartig aus! Der Held erkundet die Welt und kämpft selbständig, daher ist die Steuerung auch auf dem Smartphone-Bildschirm sehr bequem!',
        aboutCard1: 'Weite offene Welt',
        aboutCard2: 'ENDLOSER FORTSCHRITT',

        featuresTitle: 'Spielmerkmale',
        f1Title: 'Tiefgründige Welt und Story',
        f1Desc: 'Weitläufige Gebiete, Tausende Quests und eine verzweigte Handlung. Jede Wahl prägt das Schicksal eures Helden und schafft ein einzigartiges Spielerlebnis.',
        f2Title: 'Plattformübergreifend',
        f2Desc: 'Spielen Sie überall - das Projekt ist perfekt optimiert und sieht auf einem großen PC-Bildschirm genauso gut aus wie auf einem Smartphone!',
        f3Title: 'Explosives Gameplay',
        f3Desc: 'Dynamische Kämpfe mit bequemem Auto-Kampf. Erhöhen Sie die Macht, ändern Sie die Ausrüstung und verwenden Sie mächtige Fähigkeiten sogar unterwegs!',
        f4Title: 'Treue Begleiter',
        f4Desc: 'Rekrutiert mächtige Verbündete, steigert ihre Fähigkeiten und baut unschlagbare Kampfteams auf.',
        f5Title: 'Epische Bosse',
        f5Desc: 'Fordern Sie unglaublich starke Gegner heraus. Verwenden Sie Taktik, Schmelzen und Schmieden von Gegenständen, um den Sieg zu erringen!',
        f6Title: 'PvP und Clans',
        f6Desc: 'Erstellen Sie mächtige Gilden, schließen Sie sich mit Freunden zusammen und kämpfen Sie in Arenen um den Titel des stärksten Kämpfers auf dem Server!',

        footerCopy: 'Spielportal Sword Art Online LLC © 2026 – 2026',
        footerLinks: ['Nutzungsbedingungen', 'Datenschutzrichtlinie', 'saoweb.support@gmail.com', 'Stellenangebote'],

        entrySubtitle: 'Browser-MMORPG - spielt direkt im Browser',
        entryBtn: 'Ins Spiel',
        entryHint: 'Klicken Sie, um den Ton zu aktivieren',
        entrySkip: 'Nicht mehr anzeigen',

        waitlistTitle: 'Open Beta kommt bald!',
        waitlistDesc: 'Das Spiel ist noch in Entwicklung. Hinterlassen Sie Ihre Email und wir informieren Sie <strong>als Erstes</strong>, sobald die Server online sind.',
        waitlistEmailLabel: 'Ihre Email',
        waitlistEmailPh: 'you@example.com',
        waitlistNote: 'Kein Spam. Nur eine Email: beim Start.',
        waitlistSubmit: 'Beim Start benachrichtigen',
        waitlistSubmitting: 'Wird gesendet...',
        waitlistCancel: 'Später',
        waitlistClose: 'Schließen',
        waitlistSuccessTitle: 'Danke!',
        waitlistSuccessMsg: (email) => `Wir senden eine Email an ${email}, sobald die Server öffnen. Treten Sie in der Zwischenzeit unserem Discord und Forum bei, um keine Neuigkeiten zu verpassen.`,
        waitlistErrInvalid: 'Ungültige Email-Adresse',
        waitlistErrAlready: 'Sie stehen bereits auf der Warteliste - wir vergessen Sie nicht!',
        waitlistErrNetwork: 'Netzwerkfehler - Verbindung prüfen',
        waitlistErrUnknown: 'Etwas ist schiefgelaufen. Bitte später erneut versuchen.',
    },

    FR: {
        badge: 'MMORPG Navigateur',
        title: 'Sword Art Online',
        buttons: ['Jouer maintenant', 'Actualités', 'Forum'],
        scrollHint: 'En savoir plus',

        aboutTitle: 'À propos du jeu',
        aboutP1: "Explorez un monde virtuel vivant rempli de monstres, de mystères et de milliers d'autres joueurs. Créez votre héros, développez vos compétences et tracez votre propre voie dans un vaste univers.",
        aboutP2: "Conquérez des donjons dangereux, vaincez des boss puissants, récupérez de l'équipement rare et hissez-vous au sommet des classements mondiaux!",
        aboutP3: "Progressez n'importe où et à tout moment, car ce jeu fonctionne parfaitement et a fière allure aussi bien sur ordinateur que sur appareil mobile! Le héros explore le monde et combat seul, donc les commandes sont très pratiques même sur un écran de smartphone!",
        aboutCard1: 'Vaste monde ouvert',
        aboutCard2: 'PROGRESSION INFINIE',

        featuresTitle: 'Caractéristiques du jeu',
        f1Title: 'Un monde et une histoire profonds',
        f1Desc: "Des régions étendues, des milliers de quêtes et un scénario à embranchements. Chaque choix façonne le destin de votre héros et crée une expérience unique.",
        f2Title: 'Multiplateforme',
        f2Desc: "Jouez où vous voulez - le projet est parfaitement optimisé et fonctionne aussi bien sur un grand écran PC que sur un smartphone!",
        f3Title: 'Gameplay explosif',
        f3Desc: "Combats dynamiques avec auto-combat pratique. Augmentez la puissance, changez d'équipement et utilisez des compétences puissantes même en déplacement!",
        f4Title: 'Compagnons fidèles',
        f4Desc: 'Recrutez de puissants alliés, améliorez leurs capacités et construisez des équipes de combat imbattables.',
        f5Title: 'Boss épiques',
        f5Desc: 'Affrontez des adversaires incroyablement puissants. Utilisez la tactique, la fonte et la forge pour remporter la victoire!',
        f6Title: 'PvP et Clans',
        f6Desc: 'Créez des guildes puissantes, rejoignez des amis et combattez dans les arènes pour le titre de combattant le plus fort du serveur!',

        footerCopy: 'Portail de jeux Sword Art Online LLC © 2026 – 2026',
        footerLinks: ["Conditions d'utilisation", 'Politique de confidentialité', 'saoweb.support@gmail.com', 'Emplois'],

        entrySubtitle: 'MMORPG navigateur - jouez directement dans votre navigateur',
        entryBtn: 'Entrer dans le jeu',
        entryHint: 'Cliquez pour activer le son',
        entrySkip: 'Ne plus afficher',

        waitlistTitle: 'Open Beta bientôt !',
        waitlistDesc: "Le jeu est toujours en développement. Laissez votre email et nous serons les <strong>premiers</strong> à vous prévenir dès l'ouverture des serveurs.",
        waitlistEmailLabel: 'Votre email',
        waitlistEmailPh: 'you@example.com',
        waitlistNote: 'Pas de spam. Un seul email : au lancement.',
        waitlistSubmit: 'Me prévenir au lancement',
        waitlistSubmitting: 'Envoi...',
        waitlistCancel: 'Plus tard',
        waitlistClose: 'Fermer',
        waitlistSuccessTitle: 'Merci !',
        waitlistSuccessMsg: (email) => `Nous enverrons un email à ${email} dès l'ouverture des serveurs. En attendant, rejoignez notre Discord et notre forum pour ne rien manquer.`,
        waitlistErrInvalid: 'Adresse email invalide',
        waitlistErrAlready: "Vous êtes déjà sur la liste d'attente - on ne vous oubliera pas !",
        waitlistErrNetwork: 'Erreur réseau - vérifiez votre connexion',
        waitlistErrUnknown: "Une erreur est survenue. Veuillez réessayer plus tard.",
    },

    PL: {
        badge: 'Przeglądarkowe MMORPG',
        title: 'Sword Art Online',
        buttons: ['Graj teraz', 'Aktualności', 'Forum'],
        scrollHint: 'Dowiedz się więcej',

        aboutTitle: 'O grze',
        aboutP1: 'Odkryj żywy wirtualny świat pełen potworów, tajemnic i tysięcy innych graczy. Stwórz swojego bohatera, rozwijaj umiejętności i wykuwaj własną ścieżkę w rozległym uniwersum.',
        aboutP2: 'Pokonuj niebezpieczne lochy, pokonuj potężnych bossów, zdobywaj rzadki ekwipunek i walcz o szczyt globalnego rankingu!',
        aboutP3: 'Rozwijaj się gdziekolwiek i kiedykolwiek, bo ta gra działa doskonale i świetnie wygląda zarówno na komputerze, jak i na urządzeniu mobilnym! Bohater sam eksploruje świat i walczy, więc sterowanie jest wygodne nawet na ekranie smartfona!',
        aboutCard1: 'Ogromny otwarty świat',
        aboutCard2: 'NIEKOŃCZĄCY SIĘ POSTĘP',

        featuresTitle: 'Cechy gry',
        f1Title: 'Głęboki świat i fabuła',
        f1Desc: 'Rozległe regiony, tysiące zadań i rozgałęziona fabuła. Każdy wybór kształtuje losy twojego bohatera i tworzy unikalne doświadczenie.',
        f2Title: 'Wieloplatformowość',
        f2Desc: 'Graj gdziekolwiek - projekt jest doskonale zoptymalizowany i wygląda równie dobrze na dużym ekranie PC i na smartfonie!',
        f3Title: 'Wybuchowa rozgrywka',
        f3Desc: 'Dynamiczne walki z wygodnym auto-bojem. Zwiększaj moc, zmieniaj ekwipunek i używaj potężnych umiejętności nawet w drodze!',
        f4Title: 'Wierni towarzysze',
        f4Desc: 'Werbuj potężnych sojuszników, rozwijaj ich zdolności i twórz niepokonane drużyny bojowe.',
        f5Title: 'Epiccy bossowie',
        f5Desc: 'Zmierz się z niesamowicie silnymi przeciwnikami. Wykorzystaj taktykę, wytop i wykuj przedmioty, aby zwyciężyć!',
        f6Title: 'PvP i Klany',
        f6Desc: 'Twórz potężne gildie, łącz siły z przyjaciółmi i walcz na arenach o tytuł najsilniejszego bojownika na serwerze!',

        footerCopy: 'Portal gier Sword Art Online LLC © 2026 – 2026',
        footerLinks: ['Regulamin', 'Polityka prywatności', 'saoweb.support@gmail.com', 'Praca'],

        entrySubtitle: 'Przeglądarkowe MMORPG - graj od razu w przeglądarce',
        entryBtn: 'Wejdź do gry',
        entryHint: 'Kliknij, aby włączyć dźwięk',
        entrySkip: 'Nie pokazuj więcej',

        waitlistTitle: 'Otwarta beta już wkrótce!',
        waitlistDesc: 'Gra wciąż jest w trakcie tworzenia. Zostaw email, a <strong>jako pierwsi</strong> poinformujemy Cię, gdy serwery ruszą.',
        waitlistEmailLabel: 'Twój email',
        waitlistEmailPh: 'you@example.com',
        waitlistNote: 'Żadnego spamu. Tylko jeden email: przy starcie.',
        waitlistSubmit: 'Powiadom mnie o starcie',
        waitlistSubmitting: 'Wysyłanie...',
        waitlistCancel: 'Później',
        waitlistClose: 'Zamknij',
        waitlistSuccessTitle: 'Dziękujemy!',
        waitlistSuccessMsg: (email) => `Wyślemy email na ${email}, gdy tylko otworzymy serwery. W międzyczasie dołącz do naszego Discorda i forum, aby nie przegapić wiadomości.`,
        waitlistErrInvalid: 'Nieprawidłowy adres email',
        waitlistErrAlready: 'Jesteś już na liście - na pewno nie zapomnimy!',
        waitlistErrNetwork: 'Błąd sieci - sprawdź połączenie',
        waitlistErrUnknown: 'Coś poszło nie tak. Spróbuj później.',
    },

    ES: {
        badge: 'MMORPG de navegador',
        title: 'Sword Art Online',
        buttons: ['Jugar ahora', 'Noticias', 'Foro'],
        scrollHint: 'Saber más',

        aboutTitle: 'Sobre el juego',
        aboutP1: 'Explora un mundo virtual vivo lleno de monstruos, misterios y miles de otros jugadores. Crea tu héroe, desarrolla tus habilidades y forja tu propio camino en un vasto universo.',
        aboutP2: '¡Conquista mazmorras peligrosas, derrota a jefes poderosos, recoge equipo raro y lucha por llegar a la cima de las clasificaciones mundiales!',
        aboutP3: '¡Sube de nivel en cualquier lugar y en cualquier momento, porque este juego funciona perfectamente y tiene un aspecto fantástico tanto en computadora como en dispositivo móvil! El héroe explora el mundo y lucha por sí mismo, ¡así que los controles son muy cómodos incluso en la pantalla de un smartphone!',
        aboutCard1: 'Vasto mundo abierto',
        aboutCard2: 'PROGRESO SIN FIN',

        featuresTitle: 'Características del juego',
        f1Title: 'Mundo e historia profundos',
        f1Desc: 'Regiones extensas, miles de misiones y una trama ramificada. Cada decisión moldea el destino de tu héroe y crea una experiencia única.',
        f2Title: 'Multiplataforma',
        f2Desc: '¡Juega donde quieras - el proyecto está perfectamente optimizado y tiene el mismo aspecto en una pantalla grande de PC y en un smartphone!',
        f3Title: 'Jugabilidad explosiva',
        f3Desc: '¡Batallas dinámicas con auto-combate conveniente. Aumenta la potencia, cambia equipamiento y usa habilidades poderosas incluso en movimiento!',
        f4Title: 'Compañeros leales',
        f4Desc: 'Recluta poderosos aliados, mejora sus habilidades y construye equipos de combate imbatibles.',
        f5Title: 'Jefes épicos',
        f5Desc: '¡Desafía a oponentes increíblemente fuertes. Usa tácticas, fusión y forja para lograr la victoria!',
        f6Title: 'PvP y Clanes',
        f6Desc: '¡Crea gremios poderosos, únete con amigos y combate en arenas por el título de combatiente más fuerte del servidor!',

        footerCopy: 'Portal de juegos Sword Art Online LLC © 2026 – 2026',
        footerLinks: ['Términos de servicio', 'Política de privacidad', 'saoweb.support@gmail.com', 'Empleos'],

        entrySubtitle: 'MMORPG de navegador - juega directamente en tu navegador',
        entryBtn: 'Entrar al juego',
        entryHint: 'Haz clic para activar el sonido',
        entrySkip: 'No mostrar de nuevo',

        waitlistTitle: '¡Open Beta muy pronto!',
        waitlistDesc: 'El juego aún está en desarrollo. Deja tu email y serás el <strong>primero</strong> en saber cuándo abran los servidores.',
        waitlistEmailLabel: 'Tu email',
        waitlistEmailPh: 'you@example.com',
        waitlistNote: 'Sin spam. Solo un email: al lanzamiento.',
        waitlistSubmit: 'Avisarme al abrir',
        waitlistSubmitting: 'Enviando...',
        waitlistCancel: 'Más tarde',
        waitlistClose: 'Cerrar',
        waitlistSuccessTitle: '¡Gracias!',
        waitlistSuccessMsg: (email) => `Enviaremos un email a ${email} cuando abran los servidores. Mientras tanto, únete a nuestro Discord y foro para no perderte nada.`,
        waitlistErrInvalid: 'Dirección de email no válida',
        waitlistErrAlready: 'Ya estás en la lista de espera - ¡no te olvidaremos!',
        waitlistErrNetwork: 'Error de red - comprueba tu conexión',
        waitlistErrUnknown: 'Algo salió mal. Inténtalo más tarde.',
    },

    CZ: {
        badge: 'Prohlížečová MMORPG',
        title: 'Sword Art Online',
        buttons: ['Hrát nyní', 'Novinky', 'Fórum'],
        scrollHint: 'Zjistit více',

        aboutTitle: 'O hře',
        aboutP1: 'Prozkoumejte živý virtuální svět plný monster, tajemství a tisíců dalších hráčů. Vytvořte si hrdinu, rozvíjejte schopnosti a najděte si vlastní cestu v rozlehlém vesmíru.',
        aboutP2: 'Pokořte nebezpečné dungeony, porazte mocné bossy, získejte vzácné vybavení a probijte se na vrchol světových žebříčků!',
        aboutP3: 'Postupujte kamkoli a kdykoli, protože tato hra funguje perfektně a vypadá skvěle jak na počítači, tak na mobilním zařízení! Hrdina sám prozkoumává svět a bojuje, takže ovládání je pohodlné i na obrazovce smartphonu!',
        aboutCard1: 'Rozsáhlý otevřený svět',
        aboutCard2: 'NEKONEČNÝ POKROK',

        featuresTitle: 'Vlastnosti hry',
        f1Title: 'Hluboký svět a příběh',
        f1Desc: 'Rozlehlé oblasti, tisíce questů a rozvětvený příběh. Každá volba utváří osud vašeho hrdiny a vytváří jedinečný zážitek.',
        f2Title: 'Multiplatformní',
        f2Desc: 'Hrajte kdekoli - projekt je dokonale optimalizován a vypadá stejně dobře na velké obrazovce PC i na smartphonu!',
        f3Title: 'Výbušný gameplay',
        f3Desc: 'Dynamické souboje s pohodlným auto-bojem. Zvyšujte sílu, měňte vybavení a používejte mocné schopnosti i na cestách!',
        f4Title: 'Věrní společníci',
        f4Desc: 'Naverbujte mocné spojence, vylepšete jejich schopnosti a sestavte neporazitelné bojové týmy.',
        f5Title: 'Epičtí bossové',
        f5Desc: 'Postavte se neuvěřitelně silným protivníkům. Využijte taktiku, tavení a kování předmětů k dosažení vítězství!',
        f6Title: 'PvP a Klany',
        f6Desc: 'Zakládejte mocné gildy, spojte se s přáteli a bojujte v arénách o titul nejsilnějšího bojovníka na serveru!',

        footerCopy: 'Herní portál Sword Art Online LLC © 2026 – 2026',
        footerLinks: ['Podmínky služby', 'Zásady ochrany osobních údajů', 'saoweb.support@gmail.com', 'Kariéra'],

        entrySubtitle: 'Prohlížečová MMORPG - hrajte přímo v prohlížeči',
        entryBtn: 'Vstoupit do hry',
        entryHint: 'Kliknutím zapnete zvuk',
        entrySkip: 'Již nezobrazovat',

        waitlistTitle: 'Otevřená beta již brzy!',
        waitlistDesc: 'Hra je stále ve vývoji. Zanechte email a <strong>jako první</strong> vás upozorníme, až spustíme servery.',
        waitlistEmailLabel: 'Váš email',
        waitlistEmailPh: 'you@example.com',
        waitlistNote: 'Žádný spam. Pouze jeden email: při spuštění.',
        waitlistSubmit: 'Upozornit na spuštění',
        waitlistSubmitting: 'Odesílání...',
        waitlistCancel: 'Později',
        waitlistClose: 'Zavřít',
        waitlistSuccessTitle: 'Děkujeme!',
        waitlistSuccessMsg: (email) => `Pošleme email na ${email}, jakmile otevřeme servery. Mezitím se přidejte na náš Discord a fórum, abyste nic nezmeškali.`,
        waitlistErrInvalid: 'Neplatná emailová adresa',
        waitlistErrAlready: 'Již jste na pořadníku - nezapomeneme!',
        waitlistErrNetwork: 'Chyba sítě - zkontrolujte připojení',
        waitlistErrUnknown: 'Něco se pokazilo. Zkuste to později.',
    },

    IT: {
        badge: 'MMORPG Browser',
        title: 'Sword Art Online',
        buttons: ['Gioca ora', 'Notizie', 'Forum'],
        scrollHint: 'Scopri di più',

        aboutTitle: 'Informazioni sul gioco',
        aboutP1: "Esplora un mondo virtuale vivo pieno di mostri, misteri e migliaia di altri giocatori. Crea il tuo eroe, sviluppa le tue abilità e traccia il tuo percorso in un vasto universo.",
        aboutP2: 'Conquista dungeon pericolosi, sconfiggi boss potenti, raccogli equipaggiamento raro e lotta per raggiungere la vetta delle classifiche mondiali!',
        aboutP3: "Sali di livello ovunque e in qualsiasi momento, perché questo gioco funziona perfettamente e ha un aspetto fantastico sia su computer che su dispositivo mobile! L'eroe esplora il mondo e combatte da solo, quindi i comandi sono molto comodi anche sullo schermo di uno smartphone!",
        aboutCard1: 'Vasto mondo aperto',
        aboutCard2: 'PROGRESSIONE INFINITA',

        featuresTitle: 'Caratteristiche del gioco',
        f1Title: 'Mondo e storia profondi',
        f1Desc: "Regioni vaste, migliaia di missioni e una trama ramificata. Ogni scelta plasma il destino del tuo eroe e crea un'esperienza unica.",
        f2Title: 'Multipiattaforma',
        f2Desc: 'Gioca ovunque - il progetto è perfettamente ottimizzato e ha lo stesso aspetto su un grande schermo PC e su uno smartphone!',
        f3Title: 'Gameplay esplosivo',
        f3Desc: 'Battaglie dinamiche con pratico auto-combattimento. Aumenta la potenza, cambia equipaggiamento e usa abilità potenti anche in movimento!',
        f4Title: 'Compagni fedeli',
        f4Desc: 'Recluta alleati potenti, potenzia le loro abilità e costruisci squadre di combattimento imbattibili.',
        f5Title: 'Boss epici',
        f5Desc: 'Affronta avversari incredibilmente forti. Usa tattiche, fusione e forgiatura per ottenere la vittoria!',
        f6Title: 'PvP e Clan',
        f6Desc: 'Crea gilde potenti, unisciti con amici e combatti nelle arene per il titolo di combattente più forte del server!',

        footerCopy: 'Portale di gioco Sword Art Online LLC © 2026 – 2026',
        footerLinks: ['Termini di servizio', 'Informativa sulla privacy', 'saoweb.support@gmail.com', 'Lavora con noi'],

        entrySubtitle: 'MMORPG browser - gioca direttamente nel tuo browser',
        entryBtn: 'Entra nel gioco',
        entryHint: 'Clicca per attivare il suono',
        entrySkip: 'Non mostrare più',

        waitlistTitle: 'Open Beta in arrivo!',
        waitlistDesc: 'Il gioco è ancora in sviluppo. Lascia la tua email e sarai il <strong>primo</strong> a sapere quando apriranno i server.',
        waitlistEmailLabel: 'La tua email',
        waitlistEmailPh: 'you@example.com',
        waitlistNote: 'Niente spam. Solo una email: al lancio.',
        waitlistSubmit: 'Avvisami al lancio',
        waitlistSubmitting: 'Invio in corso...',
        waitlistCancel: 'Più tardi',
        waitlistClose: 'Chiudi',
        waitlistSuccessTitle: 'Grazie!',
        waitlistSuccessMsg: (email) => `Invieremo un'email a ${email} non appena apriranno i server. Nel frattempo unisciti al nostro Discord e forum per non perdere novità.`,
        waitlistErrInvalid: 'Indirizzo email non valido',
        waitlistErrAlready: 'Sei già nella lista d\'attesa - non ti dimenticheremo!',
        waitlistErrNetwork: 'Errore di rete - controlla la connessione',
        waitlistErrUnknown: 'Qualcosa è andato storto. Riprova più tardi.',
    },
};
