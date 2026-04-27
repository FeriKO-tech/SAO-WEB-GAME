/**
 * Terms of Service translations (all 8 locales).
 *
 * Migrated verbatim from the inline dictionary in the legacy `terms.html`.
 * Section 9 (`s9b`) contains inline HTML (`<a>`); the corresponding element
 * must use `data-i18n-html="true"` in the markup.
 */

import type { LanguageMap } from '@models/i18n';

export interface TermsDict {
    back: string;
    title: string;
    date: string;

    // Section 1
    s1t: string;
    s1b: string;

    // Section 2
    s2t: string;
    s2b: string;

    // Section 3 - forbidden behaviour
    s3t: string;
    s3b: string;
    s3l1: string;
    s3l2: string;
    s3l3: string;
    s3l4: string;
    s3l5: string;

    // Section 4
    s4t: string;
    s4b: string;

    // Section 5
    s5t: string;
    s5b: string;

    // Section 6
    s6t: string;
    s6b: string;

    // Section 7
    s7t: string;
    s7b: string;

    // Section 8
    s8t: string;
    s8b: string;

    // Section 9 - contact (HTML: contains <a>)
    s9t: string;
    s9b: string;
}

export const termsTranslations: LanguageMap<TermsDict> = {
    RU: {
        back: '← На главную',
        title: 'Условия соглашения',
        date: 'Последнее обновление: 17 апреля 2026',

        s1t: '1. Общие положения',
        s1b: 'Добро пожаловать в Sword Art Online - браузерную MMORPG. Регистрируясь и используя сервис, вы соглашаетесь с настоящими Условиями. Если вы не согласны с какими-либо пунктами, пожалуйста, не используйте сервис.',

        s2t: '2. Регистрация аккаунта',
        s2b: 'Для доступа к игре необходимо создать аккаунт. Вы обязуетесь предоставить достоверную информацию и нести ответственность за сохранность учётных данных. Один игрок может иметь только один аккаунт.',

        s3t: '3. Правила поведения',
        s3b: 'В игре запрещено:',
        s3l1: 'Использование читов, ботов, эксплойтов и сторонних программ',
        s3l2: 'Оскорбление других игроков, дискриминация, угрозы',
        s3l3: 'Продажа/передача аккаунтов и внутриигровых предметов за реальные деньги вне официальной платформы',
        s3l4: 'Распространение спама, рекламы сторонних сервисов',
        s3l5: 'Обход систем модерации и блокировок',

        s4t: '4. Внутриигровые покупки',
        s4b: 'Игра поддерживает донат. Все покупки виртуальных предметов являются окончательными и возврату не подлежат, за исключением случаев, предусмотренных законодательством. Валюта внутри игры не имеет реальной денежной стоимости.',

        s5t: '5. Интеллектуальная собственность',
        s5b: 'Все права на игру, графику, музыку и другие материалы принадлежат правообладателям. Копирование, распространение и модификация без письменного разрешения запрещены.',

        s6t: '6. Ограничение ответственности',
        s6b: 'Сервис предоставляется «как есть». Мы не гарантируем бесперебойной работы, отсутствия ошибок или потери внутриигровых данных. Администрация не несёт ответственности за любые убытки, возникшие в результате использования сервиса.',

        s7t: '7. Блокировка аккаунта',
        s7b: 'Мы оставляем за собой право заблокировать аккаунт без предупреждения в случае нарушения настоящих Условий. Заблокированные аккаунты и связанная с ними внутриигровая собственность не подлежат восстановлению и компенсации.',

        s8t: '8. Изменения условий',
        s8b: 'Администрация имеет право изменять настоящие Условия в любое время. Продолжение использования сервиса после изменений означает согласие с новой редакцией.',

        s9t: '9. Контакты',
        s9b: 'По всем вопросам пишите на <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. Мы стараемся отвечать в течение 24–48 часов.',
    },

    EN: {
        back: '← Back to home',
        title: 'Terms of Service',
        date: 'Last updated: April 17, 2026',

        s1t: '1. General Provisions',
        s1b: 'Welcome to Sword Art Online - a browser MMORPG. By registering and using the service, you agree to these Terms. If you do not agree with any provisions, please do not use the service.',

        s2t: '2. Account Registration',
        s2b: 'To access the game, you must create an account. You agree to provide accurate information and are responsible for keeping your credentials safe. A player may have only one account.',

        s3t: '3. Code of Conduct',
        s3b: 'The following is prohibited in the game:',
        s3l1: 'Using cheats, bots, exploits, or third-party programs',
        s3l2: 'Insulting other players, discrimination, threats',
        s3l3: 'Selling/transferring accounts and in-game items for real money outside the official platform',
        s3l4: 'Spam distribution, advertising third-party services',
        s3l5: 'Circumventing moderation and ban systems',

        s4t: '4. In-Game Purchases',
        s4b: 'The game supports donations. All virtual item purchases are final and non-refundable, except as required by law. In-game currency has no real monetary value.',

        s5t: '5. Intellectual Property',
        s5b: 'All rights to the game, graphics, music and other materials belong to their respective owners. Copying, distribution, and modification without written permission are prohibited.',

        s6t: '6. Limitation of Liability',
        s6b: 'The service is provided "as is". We do not guarantee uninterrupted operation, absence of errors, or preservation of in-game data. The administration is not liable for any losses arising from the use of the service.',

        s7t: '7. Account Suspension',
        s7b: 'We reserve the right to suspend any account without prior notice in case of violation of these Terms. Suspended accounts and related in-game property are non-restorable and non-refundable.',

        s8t: '8. Changes to Terms',
        s8b: 'The administration may modify these Terms at any time. Continued use of the service after changes implies acceptance of the new version.',

        s9t: '9. Contact',
        s9b: 'For any questions, contact <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. We try to respond within 24–48 hours.',
    },

    DE: {
        back: '← Zur Startseite',
        title: 'Nutzungsbedingungen',
        date: 'Zuletzt aktualisiert: 17. April 2026',

        s1t: '1. Allgemeine Bestimmungen',
        s1b: 'Willkommen bei Sword Art Online - einem Browser-MMORPG. Durch die Registrierung und Nutzung stimmen Sie diesen Bedingungen zu. Wenn Sie nicht einverstanden sind, nutzen Sie den Dienst bitte nicht.',

        s2t: '2. Kontoregistrierung',
        s2b: 'Für den Zugriff auf das Spiel müssen Sie ein Konto erstellen. Sie verpflichten sich, wahrheitsgemäße Informationen anzugeben und sind für die Sicherheit Ihrer Zugangsdaten verantwortlich. Ein Spieler darf nur ein Konto haben.',

        s3t: '3. Verhaltensregeln',
        s3b: 'Im Spiel ist verboten:',
        s3l1: 'Verwendung von Cheats, Bots, Exploits oder Drittanbieter-Programmen',
        s3l2: 'Beleidigung anderer Spieler, Diskriminierung, Drohungen',
        s3l3: 'Verkauf/Übertragung von Konten und In-Game-Items für echtes Geld außerhalb der offiziellen Plattform',
        s3l4: 'Verbreitung von Spam und Werbung für Drittanbieter',
        s3l5: 'Umgehung von Moderations- und Sperrsystemen',

        s4t: '4. In-Game-Käufe',
        s4b: 'Das Spiel unterstützt Spenden. Alle Käufe virtueller Gegenstände sind endgültig und nicht erstattungsfähig, außer gesetzlich vorgeschrieben. Die Spielwährung hat keinen realen Geldwert.',

        s5t: '5. Geistiges Eigentum',
        s5b: 'Alle Rechte am Spiel, Grafiken, Musik und anderen Materialien gehören den jeweiligen Eigentümern. Kopieren, Verbreiten und Modifizieren ohne schriftliche Genehmigung ist verboten.',

        s6t: '6. Haftungsbeschränkung',
        s6b: 'Der Dienst wird „wie besehen" bereitgestellt. Wir garantieren keinen unterbrechungsfreien Betrieb, keine Fehlerfreiheit und keine Erhaltung von Spieldaten. Die Administration haftet nicht für Schäden aus der Nutzung des Dienstes.',

        s7t: '7. Kontosperrung',
        s7b: 'Wir behalten uns das Recht vor, Konten ohne Vorankündigung zu sperren, wenn diese Bedingungen verletzt werden. Gesperrte Konten und damit verbundenes Eigentum sind nicht wiederherstellbar oder erstattungsfähig.',

        s8t: '8. Änderungen',
        s8b: 'Die Administration kann diese Bedingungen jederzeit ändern. Die weitere Nutzung nach Änderungen gilt als Zustimmung zur neuen Version.',

        s9t: '9. Kontakt',
        s9b: 'Bei Fragen wenden Sie sich an <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. Wir antworten innerhalb von 24–48 Stunden.',
    },

    FR: {
        back: "← Retour à l'accueil",
        title: "Conditions d'utilisation",
        date: 'Dernière mise à jour : 17 avril 2026',

        s1t: '1. Dispositions générales',
        s1b: "Bienvenue sur Sword Art Online - un MMORPG navigateur. En vous inscrivant et en utilisant le service, vous acceptez ces Conditions. Si vous n'êtes pas d'accord, veuillez ne pas utiliser le service.",

        s2t: '2. Inscription du compte',
        s2b: "Pour accéder au jeu, vous devez créer un compte. Vous vous engagez à fournir des informations exactes et êtes responsable de la sécurité de vos identifiants. Un joueur ne peut avoir qu'un seul compte.",

        s3t: '3. Règles de conduite',
        s3b: 'Dans le jeu, il est interdit de :',
        s3l1: 'Utiliser des cheats, bots, exploits ou programmes tiers',
        s3l2: "Insulter d'autres joueurs, discrimination, menaces",
        s3l3: "Vendre/transférer des comptes et objets pour de l'argent réel hors de la plateforme officielle",
        s3l4: 'Diffuser du spam et des publicités de services tiers',
        s3l5: 'Contourner les systèmes de modération et de blocage',

        s4t: '4. Achats dans le jeu',
        s4b: "Le jeu prend en charge les dons. Tous les achats d'objets virtuels sont définitifs et non remboursables, sauf dispositions légales. La monnaie du jeu n'a aucune valeur monétaire réelle.",

        s5t: '5. Propriété intellectuelle',
        s5b: 'Tous les droits sur le jeu, graphiques, musique et autres matériaux appartiennent à leurs propriétaires respectifs. La copie, distribution et modification sans autorisation écrite sont interdites.',

        s6t: '6. Limitation de responsabilité',
        s6b: "Le service est fourni « tel quel ». Nous ne garantissons pas un fonctionnement ininterrompu, l'absence d'erreurs ou la préservation des données. L'administration n'est pas responsable des pertes liées à l'utilisation du service.",

        s7t: '7. Suspension du compte',
        s7b: 'Nous nous réservons le droit de suspendre un compte sans préavis en cas de violation de ces Conditions. Les comptes suspendus et les biens associés ne sont pas récupérables ni remboursables.',

        s8t: '8. Modifications',
        s8b: "L'administration peut modifier ces Conditions à tout moment. L'utilisation continue après modifications implique l'acceptation de la nouvelle version.",

        s9t: '9. Contact',
        s9b: 'Pour toute question, écrivez à <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. Nous répondons sous 24–48 heures.',
    },

    PL: {
        back: '← Na stronę główną',
        title: 'Regulamin',
        date: 'Ostatnia aktualizacja: 17 kwietnia 2026',

        s1t: '1. Postanowienia ogólne',
        s1b: 'Witaj w Sword Art Online - przeglądarkowym MMORPG. Rejestrując się i korzystając z serwisu, akceptujesz niniejszy Regulamin. Jeśli nie zgadzasz się z jakimkolwiek punktem, prosimy nie korzystać z serwisu.',

        s2t: '2. Rejestracja konta',
        s2b: 'Aby uzyskać dostęp do gry, musisz utworzyć konto. Zobowiązujesz się podawać prawdziwe informacje i ponosisz odpowiedzialność za bezpieczeństwo danych logowania. Gracz może posiadać tylko jedno konto.',

        s3t: '3. Zasady zachowania',
        s3b: 'W grze zabronione jest:',
        s3l1: 'Używanie cheatów, botów, exploitów lub programów firm trzecich',
        s3l2: 'Obrażanie innych graczy, dyskryminacja, groźby',
        s3l3: 'Sprzedaż/przekazywanie kont i przedmiotów za prawdziwe pieniądze poza oficjalną platformą',
        s3l4: 'Rozpowszechnianie spamu, reklam usług zewnętrznych',
        s3l5: 'Obchodzenie systemów moderacji i blokad',

        s4t: '4. Zakupy w grze',
        s4b: 'Gra obsługuje donaty. Wszystkie zakupy wirtualnych przedmiotów są ostateczne i niepodlegające zwrotowi, z wyjątkiem przypadków przewidzianych prawem. Waluta w grze nie ma rzeczywistej wartości pieniężnej.',

        s5t: '5. Własność intelektualna',
        s5b: 'Wszelkie prawa do gry, grafiki, muzyki i innych materiałów należą do właścicieli. Kopiowanie, rozpowszechnianie i modyfikowanie bez pisemnej zgody jest zabronione.',

        s6t: '6. Ograniczenie odpowiedzialności',
        s6b: 'Usługa jest świadczona "tak jak jest". Nie gwarantujemy nieprzerwanej pracy, braku błędów ani zachowania danych w grze. Administracja nie ponosi odpowiedzialności za straty wynikające z korzystania z usługi.',

        s7t: '7. Blokada konta',
        s7b: 'Zastrzegamy sobie prawo do zablokowania konta bez uprzedzenia w przypadku naruszenia niniejszego Regulaminu. Zablokowane konta i powiązany majątek w grze nie podlegają przywróceniu ani zwrotowi.',

        s8t: '8. Zmiany regulaminu',
        s8b: 'Administracja ma prawo zmieniać niniejszy Regulamin w dowolnym momencie. Dalsze korzystanie z serwisu po zmianach oznacza akceptację nowej wersji.',

        s9t: '9. Kontakt',
        s9b: 'W razie pytań pisz na <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. Staramy się odpowiadać w ciągu 24–48 godzin.',
    },

    ES: {
        back: '← Volver al inicio',
        title: 'Términos del servicio',
        date: 'Última actualización: 17 de abril de 2026',

        s1t: '1. Disposiciones generales',
        s1b: 'Bienvenido a Sword Art Online - un MMORPG de navegador. Al registrarse y utilizar el servicio, acepta estos Términos. Si no está de acuerdo con alguna cláusula, por favor no utilice el servicio.',

        s2t: '2. Registro de cuenta',
        s2b: 'Para acceder al juego, debe crear una cuenta. Se compromete a proporcionar información veraz y es responsable de la seguridad de sus credenciales. Un jugador solo puede tener una cuenta.',

        s3t: '3. Reglas de conducta',
        s3b: 'En el juego está prohibido:',
        s3l1: 'Usar cheats, bots, exploits o programas de terceros',
        s3l2: 'Insultar a otros jugadores, discriminación, amenazas',
        s3l3: 'Vender/transferir cuentas y objetos por dinero real fuera de la plataforma oficial',
        s3l4: 'Distribuir spam o publicidad de servicios externos',
        s3l5: 'Evadir sistemas de moderación y bloqueo',

        s4t: '4. Compras dentro del juego',
        s4b: 'El juego admite donaciones. Todas las compras de objetos virtuales son finales y no reembolsables, salvo lo exigido por la ley. La moneda del juego no tiene valor monetario real.',

        s5t: '5. Propiedad intelectual',
        s5b: 'Todos los derechos del juego, gráficos, música y otros materiales pertenecen a sus respectivos propietarios. Queda prohibida la copia, distribución y modificación sin permiso escrito.',

        s6t: '6. Limitación de responsabilidad',
        s6b: 'El servicio se proporciona "tal cual". No garantizamos funcionamiento ininterrumpido, ausencia de errores ni conservación de datos. La administración no es responsable de pérdidas derivadas del uso del servicio.',

        s7t: '7. Suspensión de cuenta',
        s7b: 'Nos reservamos el derecho de suspender una cuenta sin aviso previo en caso de violación de estos Términos. Las cuentas suspendidas y bienes asociados no son recuperables ni reembolsables.',

        s8t: '8. Cambios',
        s8b: 'La administración puede modificar estos Términos en cualquier momento. El uso continuado después de los cambios implica aceptación de la nueva versión.',

        s9t: '9. Contacto',
        s9b: 'Para cualquier consulta, escriba a <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. Intentamos responder en 24–48 horas.',
    },

    CZ: {
        back: '← Na hlavní stránku',
        title: 'Podmínky služby',
        date: 'Poslední aktualizace: 17. dubna 2026',

        s1t: '1. Obecná ustanovení',
        s1b: 'Vítejte v Sword Art Online - prohlížečové MMORPG. Registrací a používáním služby souhlasíte s těmito Podmínkami. Pokud s některými body nesouhlasíte, službu nepoužívejte.',

        s2t: '2. Registrace účtu',
        s2b: 'Pro přístup ke hře musíte vytvořit účet. Zavazujete se poskytnout pravdivé informace a jste zodpovědní za bezpečnost přihlašovacích údajů. Jeden hráč může mít pouze jeden účet.',

        s3t: '3. Pravidla chování',
        s3b: 'Ve hře je zakázáno:',
        s3l1: 'Používání cheatů, botů, exploitů nebo programů třetích stran',
        s3l2: 'Urážky jiných hráčů, diskriminace, vyhrožování',
        s3l3: 'Prodej/převod účtů a herních předmětů za skutečné peníze mimo oficiální platformu',
        s3l4: 'Šíření spamu, reklamy na služby třetích stran',
        s3l5: 'Obcházení systémů moderování a blokace',

        s4t: '4. Herní nákupy',
        s4b: 'Hra podporuje dary. Všechny nákupy virtuálních předmětů jsou konečné a nevratné, s výjimkou případů stanovených zákonem. Herní měna nemá skutečnou peněžní hodnotu.',

        s5t: '5. Duševní vlastnictví',
        s5b: 'Všechna práva ke hře, grafice, hudbě a dalším materiálům patří příslušným vlastníkům. Kopírování, šíření a úpravy bez písemného souhlasu jsou zakázány.',

        s6t: '6. Omezení odpovědnosti',
        s6b: 'Služba je poskytována "tak jak je". Nezaručujeme nepřerušovaný provoz, absenci chyb ani zachování herních dat. Administrace nenese odpovědnost za ztráty vyplývající z používání služby.',

        s7t: '7. Blokace účtu',
        s7b: 'Vyhrazujeme si právo zablokovat účet bez předchozího upozornění v případě porušení těchto Podmínek. Zablokované účty a související majetek nejsou obnovitelné ani refundovatelné.',

        s8t: '8. Změny podmínek',
        s8b: 'Administrace má právo měnit tyto Podmínky kdykoli. Pokračování v používání služby po změnách znamená souhlas s novou verzí.',

        s9t: '9. Kontakt',
        s9b: 'Se všemi dotazy se obracejte na <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. Snažíme se odpovídat do 24–48 hodin.',
    },

    IT: {
        back: '← Torna alla home',
        title: 'Termini di servizio',
        date: 'Ultimo aggiornamento: 17 aprile 2026',

        s1t: '1. Disposizioni generali',
        s1b: "Benvenuto su Sword Art Online - un MMORPG browser. Registrandoti e utilizzando il servizio accetti questi Termini. Se non sei d'accordo con qualche clausola, ti preghiamo di non utilizzare il servizio.",

        s2t: '2. Registrazione account',
        s2b: 'Per accedere al gioco devi creare un account. Ti impegni a fornire informazioni veritiere e sei responsabile della sicurezza delle tue credenziali. Un giocatore può avere un solo account.',

        s3t: '3. Regole di condotta',
        s3b: 'Nel gioco è vietato:',
        s3l1: 'Usare cheat, bot, exploit o programmi di terze parti',
        s3l2: 'Insultare altri giocatori, discriminazione, minacce',
        s3l3: 'Vendere/trasferire account e oggetti per denaro reale al di fuori della piattaforma ufficiale',
        s3l4: 'Diffondere spam o pubblicità di servizi esterni',
        s3l5: 'Eludere i sistemi di moderazione e blocco',

        s4t: '4. Acquisti in-game',
        s4b: 'Il gioco supporta le donazioni. Tutti gli acquisti di oggetti virtuali sono definitivi e non rimborsabili, salvo quanto previsto dalla legge. La valuta di gioco non ha valore monetario reale.',

        s5t: '5. Proprietà intellettuale',
        s5b: 'Tutti i diritti sul gioco, grafica, musica e altri materiali appartengono ai rispettivi proprietari. Copia, distribuzione e modifica senza autorizzazione scritta sono vietate.',

        s6t: '6. Limitazione di responsabilità',
        s6b: "Il servizio è fornito \"così com'è\". Non garantiamo funzionamento ininterrotto, assenza di errori o conservazione dei dati di gioco. L'amministrazione non è responsabile per perdite derivanti dall'uso del servizio.",

        s7t: '7. Sospensione account',
        s7b: "Ci riserviamo il diritto di sospendere l'account senza preavviso in caso di violazione dei Termini. Gli account sospesi e i beni associati non sono recuperabili né rimborsabili.",

        s8t: '8. Modifiche',
        s8b: "L'amministrazione può modificare questi Termini in qualsiasi momento. L'uso continuato del servizio dopo le modifiche implica l'accettazione della nuova versione.",

        s9t: '9. Contatti',
        s9b: 'Per qualsiasi domanda scrivi a <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. Cerchiamo di rispondere entro 24–48 ore.',
    },
};
