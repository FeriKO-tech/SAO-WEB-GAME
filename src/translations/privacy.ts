/**
 * Privacy Policy translations (all 8 locales).
 *
 * Migrated verbatim from the inline dictionary in the legacy `privacy.html`.
 * Some strings contain inline HTML (`<strong>`, `<a>`) - the corresponding
 * elements must use `data-i18n-html="true"` in the markup so the i18n runtime
 * uses `innerHTML` instead of `textContent`.
 */

import type { LanguageMap } from '@models/i18n';

export interface PrivacyDict {
    back: string;
    title: string;
    date: string;

    // Section 1
    s1t: string;
    s1b: string;

    // Section 2 - collected data (HTML: contains <strong>)
    s2t: string;
    s2l1: string;
    s2l2: string;
    s2l3: string;
    s2l4: string;
    s2l5: string;

    // Section 3 - how data is used
    s3t: string;
    s3l1: string;
    s3l2: string;
    s3l3: string;
    s3l4: string;
    s3l5: string;
    s3l6: string;

    // Section 4 - cookies
    s4t: string;
    s4b: string;

    // Section 5 - third parties
    s5t: string;
    s5b: string;
    s5l1: string;
    s5l2: string;
    s5l3: string;
    s5l4: string;

    // Section 6 - storage & security
    s6t: string;
    s6b: string;

    // Section 7 - user rights
    s7t: string;
    s7b: string;
    s7l1: string;
    s7l2: string;
    s7l3: string;
    s7l4: string;
    s7l5: string;

    // Section 8 - children
    s8t: string;
    s8b: string;

    // Section 9 - policy changes
    s9t: string;
    s9b: string;

    // Section 10 - contact (HTML: contains <a>)
    s10t: string;
    s10b: string;
}

export const privacyTranslations: LanguageMap<PrivacyDict> = {
    RU: {
        back: '← На главную',
        title: 'Политика конфиденциальности',
        date: 'Последнее обновление: 17 апреля 2026',

        s1t: '1. Введение',
        s1b: 'Мы уважаем вашу приватность. Эта Политика объясняет, какие данные мы собираем, как их используем и какие у вас есть права. Используя наш сервис, вы соглашаетесь с условиями Политики.',

        s2t: '2. Какие данные мы собираем',
        s2l1: '<strong>Регистрационные данные:</strong> логин, email, зашифрованный пароль',
        s2l2: '<strong>Данные профиля Google</strong> (при входе через Google): имя, email, фотография профиля',
        s2l3: '<strong>Игровые данные:</strong> статистика, прогресс, внутриигровые покупки',
        s2l4: '<strong>Технические данные:</strong> IP-адрес, тип браузера, операционная система, cookies',
        s2l5: '<strong>Логи активности:</strong> время входа, игровые сессии, действия в игре',

        s3t: '3. Как мы используем данные',
        s3l1: 'Создание и поддержка вашего аккаунта',
        s3l2: 'Обеспечение игрового процесса и сохранение прогресса',
        s3l3: 'Обработка внутриигровых покупок',
        s3l4: 'Связь с вами по важным вопросам (безопасность, обновления)',
        s3l5: 'Анализ активности для улучшения сервиса',
        s3l6: 'Борьба с мошенничеством и нарушителями правил',

        s4t: '4. Cookies и аналитика',
        s4b: 'Мы используем cookies для поддержания вашей сессии, сохранения настроек (язык, тема) и анализа посещаемости. Вы можете отключить cookies в настройках браузера, но некоторые функции сайта могут работать некорректно.',

        s5t: '5. Передача данных третьим лицам',
        s5b: 'Мы не продаём и не передаём ваши данные третьим лицам, за исключением:',
        s5l1: 'Платёжных систем (для обработки донатов)',
        s5l2: 'Провайдеров OAuth (Google) при авторизации через них',
        s5l3: 'Правоохранительных органов по официальному запросу',
        s5l4: 'Сервисов аналитики (в анонимизированном виде)',

        s6t: '6. Хранение и безопасность',
        s6b: 'Ваши данные хранятся на защищённых серверах. Пароли хешируются (никогда не хранятся в открытом виде). Мы применяем HTTPS, шифрование, системы защиты от несанкционированного доступа.',

        s7t: '7. Ваши права',
        s7b: 'Вы имеете право:',
        s7l1: 'Запросить копию ваших данных',
        s7l2: 'Исправить неточные данные',
        s7l3: 'Удалить аккаунт и связанные данные',
        s7l4: 'Ограничить обработку данных',
        s7l5: 'Отозвать согласие в любой момент',

        s8t: '8. Дети до 13 лет',
        s8b: 'Сервис не предназначен для детей младше 13 лет. Если нам станет известно, что мы собрали данные несовершеннолетнего без согласия родителей, мы незамедлительно удалим их.',

        s9t: '9. Изменения политики',
        s9b: 'Мы можем обновлять эту Политику. Существенные изменения будут анонсированы на сайте и по email. Продолжение использования сервиса означает согласие с новой версией.',

        s10t: '10. Контакты',
        s10b: 'По вопросам обработки данных обращайтесь: <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. Мы отвечаем в течение 24–48 часов.',
    },

    EN: {
        back: '← Back to home',
        title: 'Privacy Policy',
        date: 'Last updated: April 17, 2026',

        s1t: '1. Introduction',
        s1b: 'We respect your privacy. This Policy explains what data we collect, how we use it, and your rights. By using our service, you agree to the terms of this Policy.',

        s2t: '2. What data we collect',
        s2l1: '<strong>Registration data:</strong> username, email, hashed password',
        s2l2: '<strong>Google profile data</strong> (when signing in via Google): name, email, profile photo',
        s2l3: '<strong>Game data:</strong> statistics, progress, in-game purchases',
        s2l4: '<strong>Technical data:</strong> IP address, browser type, operating system, cookies',
        s2l5: '<strong>Activity logs:</strong> login times, game sessions, in-game actions',

        s3t: '3. How we use data',
        s3l1: 'Creating and maintaining your account',
        s3l2: 'Providing gameplay and preserving progress',
        s3l3: 'Processing in-game purchases',
        s3l4: 'Communicating on important matters (security, updates)',
        s3l5: 'Analyzing activity to improve the service',
        s3l6: 'Fighting fraud and rule violators',

        s4t: '4. Cookies and analytics',
        s4b: 'We use cookies to maintain your session, save settings (language, theme) and analyze traffic. You can disable cookies in your browser settings, but some site features may not work correctly.',

        s5t: '5. Third-party data sharing',
        s5b: 'We do not sell or share your data with third parties, except:',
        s5l1: 'Payment systems (for donation processing)',
        s5l2: 'OAuth providers (Google) when you sign in through them',
        s5l3: 'Law enforcement upon official request',
        s5l4: 'Analytics services (in anonymized form)',

        s6t: '6. Storage and security',
        s6b: 'Your data is stored on secure servers. Passwords are hashed (never stored in plain text). We use HTTPS, encryption, and systems to prevent unauthorized access.',

        s7t: '7. Your rights',
        s7b: 'You have the right to:',
        s7l1: 'Request a copy of your data',
        s7l2: 'Correct inaccurate data',
        s7l3: 'Delete your account and related data',
        s7l4: 'Restrict data processing',
        s7l5: 'Withdraw consent at any time',

        s8t: '8. Children under 13',
        s8b: "The service is not intended for children under 13. If we learn we collected a minor's data without parental consent, we will delete it immediately.",

        s9t: '9. Policy changes',
        s9b: 'We may update this Policy. Material changes will be announced on the site and by email. Continued use of the service implies acceptance of the new version.',

        s10t: '10. Contact',
        s10b: 'For data processing questions contact: <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. We respond within 24–48 hours.',
    },

    DE: {
        back: '← Zur Startseite',
        title: 'Datenschutzrichtlinie',
        date: 'Zuletzt aktualisiert: 17. April 2026',

        s1t: '1. Einführung',
        s1b: 'Wir respektieren Ihre Privatsphäre. Diese Richtlinie erklärt, welche Daten wir erheben, wie wir sie verwenden und welche Rechte Sie haben. Durch die Nutzung unseres Dienstes stimmen Sie dieser Richtlinie zu.',

        s2t: '2. Welche Daten wir sammeln',
        s2l1: '<strong>Registrierungsdaten:</strong> Benutzername, Email, gehashtes Passwort',
        s2l2: '<strong>Google-Profildaten</strong> (bei Google-Anmeldung): Name, Email, Profilfoto',
        s2l3: '<strong>Spieldaten:</strong> Statistiken, Fortschritt, In-Game-Käufe',
        s2l4: '<strong>Technische Daten:</strong> IP-Adresse, Browsertyp, Betriebssystem, Cookies',
        s2l5: '<strong>Aktivitätsprotokolle:</strong> Anmeldezeiten, Spielsitzungen, Aktionen im Spiel',

        s3t: '3. Wie wir Daten verwenden',
        s3l1: 'Erstellung und Pflege Ihres Kontos',
        s3l2: 'Bereitstellung des Spielablaufs und Speicherung des Fortschritts',
        s3l3: 'Verarbeitung von In-Game-Käufen',
        s3l4: 'Kommunikation zu wichtigen Themen (Sicherheit, Updates)',
        s3l5: 'Aktivitätsanalyse zur Verbesserung des Dienstes',
        s3l6: 'Betrugsbekämpfung und Umgang mit Regelverletzern',

        s4t: '4. Cookies und Analytik',
        s4b: 'Wir verwenden Cookies zur Aufrechterhaltung Ihrer Sitzung, zum Speichern von Einstellungen (Sprache, Theme) und zur Verkehrsanalyse. Sie können Cookies in den Browsereinstellungen deaktivieren, aber einige Funktionen funktionieren möglicherweise nicht richtig.',

        s5t: '5. Weitergabe an Dritte',
        s5b: 'Wir verkaufen oder geben Ihre Daten nicht an Dritte weiter, außer an:',
        s5l1: 'Zahlungssysteme (zur Spendenverarbeitung)',
        s5l2: 'OAuth-Anbieter (Google) bei der Anmeldung über sie',
        s5l3: 'Strafverfolgungsbehörden auf offizielle Anfrage',
        s5l4: 'Analysedienste (in anonymisierter Form)',

        s6t: '6. Speicherung und Sicherheit',
        s6b: 'Ihre Daten werden auf sicheren Servern gespeichert. Passwörter werden gehasht (niemals im Klartext gespeichert). Wir verwenden HTTPS, Verschlüsselung und Systeme gegen unbefugten Zugriff.',

        s7t: '7. Ihre Rechte',
        s7b: 'Sie haben das Recht:',
        s7l1: 'Eine Kopie Ihrer Daten anzufordern',
        s7l2: 'Ungenaue Daten zu korrigieren',
        s7l3: 'Konto und zugehörige Daten zu löschen',
        s7l4: 'Datenverarbeitung einzuschränken',
        s7l5: 'Einwilligung jederzeit zu widerrufen',

        s8t: '8. Kinder unter 13 Jahren',
        s8b: 'Der Dienst ist nicht für Kinder unter 13 Jahren bestimmt. Wenn wir feststellen, dass wir Daten eines Minderjährigen ohne elterliche Zustimmung erhoben haben, werden wir diese umgehend löschen.',

        s9t: '9. Änderungen',
        s9b: 'Wir können diese Richtlinie aktualisieren. Wesentliche Änderungen werden auf der Website und per Email angekündigt. Die weitere Nutzung nach Änderungen gilt als Zustimmung zur neuen Version.',

        s10t: '10. Kontakt',
        s10b: 'Bei Fragen zur Datenverarbeitung wenden Sie sich an: <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. Wir antworten innerhalb von 24–48 Stunden.',
    },

    FR: {
        back: "← Retour à l'accueil",
        title: 'Politique de confidentialité',
        date: 'Dernière mise à jour : 17 avril 2026',

        s1t: '1. Introduction',
        s1b: 'Nous respectons votre vie privée. Cette Politique explique quelles données nous collectons, comment nous les utilisons et vos droits. En utilisant notre service, vous acceptez les conditions de cette Politique.',

        s2t: '2. Données collectées',
        s2l1: "<strong>Données d'inscription :</strong> nom d'utilisateur, email, mot de passe haché",
        s2l2: '<strong>Données de profil Google</strong> (lors de la connexion via Google) : nom, email, photo de profil',
        s2l3: '<strong>Données de jeu :</strong> statistiques, progression, achats dans le jeu',
        s2l4: "<strong>Données techniques :</strong> adresse IP, type de navigateur, système d'exploitation, cookies",
        s2l5: "<strong>Journaux d'activité :</strong> heures de connexion, sessions de jeu, actions dans le jeu",

        s3t: '3. Utilisation des données',
        s3l1: 'Création et maintenance de votre compte',
        s3l2: 'Fourniture du gameplay et sauvegarde de la progression',
        s3l3: 'Traitement des achats dans le jeu',
        s3l4: 'Communication sur des sujets importants (sécurité, mises à jour)',
        s3l5: "Analyse de l'activité pour améliorer le service",
        s3l6: 'Lutte contre la fraude et les contrevenants',

        s4t: '4. Cookies et analyse',
        s4b: 'Nous utilisons des cookies pour maintenir votre session, sauvegarder les paramètres (langue, thème) et analyser le trafic. Vous pouvez désactiver les cookies dans votre navigateur, mais certaines fonctions peuvent ne pas fonctionner correctement.',

        s5t: '5. Partage avec des tiers',
        s5b: 'Nous ne vendons ni ne partageons vos données avec des tiers, sauf avec :',
        s5l1: 'Systèmes de paiement (pour le traitement des dons)',
        s5l2: 'Fournisseurs OAuth (Google) lors de la connexion',
        s5l3: 'Autorités sur demande officielle',
        s5l4: "Services d'analyse (sous forme anonymisée)",

        s6t: '6. Stockage et sécurité',
        s6b: 'Vos données sont stockées sur des serveurs sécurisés. Les mots de passe sont hachés (jamais stockés en clair). Nous utilisons HTTPS, chiffrement et systèmes contre les accès non autorisés.',

        s7t: '7. Vos droits',
        s7b: 'Vous avez le droit de :',
        s7l1: 'Demander une copie de vos données',
        s7l2: 'Corriger des données inexactes',
        s7l3: 'Supprimer votre compte et données associées',
        s7l4: 'Limiter le traitement des données',
        s7l5: 'Retirer votre consentement à tout moment',

        s8t: '8. Enfants de moins de 13 ans',
        s8b: "Le service n'est pas destiné aux enfants de moins de 13 ans. Si nous apprenons avoir collecté des données d'un mineur sans consentement parental, nous les supprimerons immédiatement.",

        s9t: '9. Modifications',
        s9b: "Nous pouvons mettre à jour cette Politique. Les changements importants seront annoncés sur le site et par email. L'utilisation continue implique l'acceptation de la nouvelle version.",

        s10t: '10. Contact',
        s10b: 'Pour toute question sur le traitement des données : <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. Nous répondons sous 24–48 heures.',
    },

    PL: {
        back: '← Na stronę główną',
        title: 'Polityka prywatności',
        date: 'Ostatnia aktualizacja: 17 kwietnia 2026',

        s1t: '1. Wprowadzenie',
        s1b: 'Szanujemy Twoją prywatność. Niniejsza Polityka wyjaśnia, jakie dane zbieramy, jak je wykorzystujemy i jakie masz prawa. Korzystając z naszej usługi, akceptujesz warunki Polityki.',

        s2t: '2. Jakie dane zbieramy',
        s2l1: '<strong>Dane rejestracyjne:</strong> login, email, zahaszowane hasło',
        s2l2: '<strong>Dane profilu Google</strong> (przy logowaniu przez Google): imię, email, zdjęcie profilowe',
        s2l3: '<strong>Dane gry:</strong> statystyki, postęp, zakupy w grze',
        s2l4: '<strong>Dane techniczne:</strong> adres IP, typ przeglądarki, system operacyjny, cookies',
        s2l5: '<strong>Dzienniki aktywności:</strong> czas logowania, sesje gry, działania w grze',

        s3t: '3. Jak wykorzystujemy dane',
        s3l1: 'Tworzenie i utrzymanie konta',
        s3l2: 'Zapewnienie rozgrywki i zapisywanie postępów',
        s3l3: 'Przetwarzanie zakupów w grze',
        s3l4: 'Komunikacja w ważnych sprawach (bezpieczeństwo, aktualizacje)',
        s3l5: 'Analiza aktywności w celu ulepszenia usługi',
        s3l6: 'Walka z oszustwami i łamaniem zasad',

        s4t: '4. Cookies i analityka',
        s4b: 'Używamy cookies do utrzymania sesji, zapisywania ustawień (język, motyw) i analizy ruchu. Możesz wyłączyć cookies w przeglądarce, ale niektóre funkcje mogą nie działać poprawnie.',

        s5t: '5. Udostępnianie stronom trzecim',
        s5b: 'Nie sprzedajemy ani nie udostępniamy danych stronom trzecim, z wyjątkiem:',
        s5l1: 'Systemów płatności (do przetwarzania donatów)',
        s5l2: 'Dostawców OAuth (Google) przy logowaniu',
        s5l3: 'Organów ścigania na oficjalne żądanie',
        s5l4: 'Usług analitycznych (w formie zanonimizowanej)',

        s6t: '6. Przechowywanie i bezpieczeństwo',
        s6b: 'Twoje dane są przechowywane na bezpiecznych serwerach. Hasła są hashowane (nigdy nie są przechowywane w postaci jawnej). Stosujemy HTTPS, szyfrowanie i systemy ochrony.',

        s7t: '7. Twoje prawa',
        s7b: 'Masz prawo do:',
        s7l1: 'Żądania kopii swoich danych',
        s7l2: 'Poprawienia nieprawdziwych danych',
        s7l3: 'Usunięcia konta i powiązanych danych',
        s7l4: 'Ograniczenia przetwarzania danych',
        s7l5: 'Wycofania zgody w dowolnym momencie',

        s8t: '8. Dzieci poniżej 13 lat',
        s8b: 'Usługa nie jest przeznaczona dla dzieci poniżej 13 lat. Jeśli dowiemy się, że zebraliśmy dane osoby niepełnoletniej bez zgody rodziców, niezwłocznie je usuniemy.',

        s9t: '9. Zmiany polityki',
        s9b: 'Możemy aktualizować tę Politykę. Istotne zmiany będą ogłaszane na stronie i przez email. Dalsze korzystanie oznacza akceptację nowej wersji.',

        s10t: '10. Kontakt',
        s10b: 'W sprawach dotyczących przetwarzania danych pisz na: <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. Odpowiadamy w ciągu 24–48 godzin.',
    },

    ES: {
        back: '← Volver al inicio',
        title: 'Política de privacidad',
        date: 'Última actualización: 17 de abril de 2026',

        s1t: '1. Introducción',
        s1b: 'Respetamos su privacidad. Esta Política explica qué datos recopilamos, cómo los usamos y sus derechos. Al utilizar nuestro servicio, acepta los términos de esta Política.',

        s2t: '2. Qué datos recopilamos',
        s2l1: '<strong>Datos de registro:</strong> usuario, email, contraseña hasheada',
        s2l2: '<strong>Datos del perfil de Google</strong> (al iniciar sesión con Google): nombre, email, foto',
        s2l3: '<strong>Datos del juego:</strong> estadísticas, progreso, compras en el juego',
        s2l4: '<strong>Datos técnicos:</strong> dirección IP, tipo de navegador, sistema operativo, cookies',
        s2l5: '<strong>Registros de actividad:</strong> horas de inicio de sesión, sesiones de juego, acciones en el juego',

        s3t: '3. Cómo usamos los datos',
        s3l1: 'Crear y mantener su cuenta',
        s3l2: 'Proporcionar el juego y guardar el progreso',
        s3l3: 'Procesar compras en el juego',
        s3l4: 'Comunicar asuntos importantes (seguridad, actualizaciones)',
        s3l5: 'Analizar la actividad para mejorar el servicio',
        s3l6: 'Combatir el fraude y los infractores',

        s4t: '4. Cookies y analítica',
        s4b: 'Usamos cookies para mantener su sesión, guardar configuraciones (idioma, tema) y analizar el tráfico. Puede desactivar las cookies en su navegador, pero algunas funciones pueden no funcionar correctamente.',

        s5t: '5. Compartir con terceros',
        s5b: 'No vendemos ni compartimos sus datos con terceros, excepto con:',
        s5l1: 'Sistemas de pago (para procesar donaciones)',
        s5l2: 'Proveedores OAuth (Google) al iniciar sesión',
        s5l3: 'Autoridades por solicitud oficial',
        s5l4: 'Servicios de análisis (en forma anonimizada)',

        s6t: '6. Almacenamiento y seguridad',
        s6b: 'Sus datos se almacenan en servidores seguros. Las contraseñas se hashean (nunca se almacenan en texto plano). Usamos HTTPS, cifrado y sistemas contra accesos no autorizados.',

        s7t: '7. Sus derechos',
        s7b: 'Tiene derecho a:',
        s7l1: 'Solicitar una copia de sus datos',
        s7l2: 'Corregir datos inexactos',
        s7l3: 'Eliminar su cuenta y datos asociados',
        s7l4: 'Restringir el procesamiento de datos',
        s7l5: 'Retirar el consentimiento en cualquier momento',

        s8t: '8. Niños menores de 13 años',
        s8b: 'El servicio no está destinado a menores de 13 años. Si nos enteramos de que recopilamos datos de un menor sin consentimiento parental, los eliminaremos de inmediato.',

        s9t: '9. Cambios en la política',
        s9b: 'Podemos actualizar esta Política. Los cambios importantes se anunciarán en el sitio y por email. El uso continuo implica aceptación de la nueva versión.',

        s10t: '10. Contacto',
        s10b: 'Para consultas sobre el tratamiento de datos: <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. Respondemos en 24–48 horas.',
    },

    CZ: {
        back: '← Na hlavní stránku',
        title: 'Zásady ochrany osobních údajů',
        date: 'Poslední aktualizace: 17. dubna 2026',

        s1t: '1. Úvod',
        s1b: 'Respektujeme vaše soukromí. Tyto Zásady vysvětlují, jaká data shromažďujeme, jak je používáme a jaká máte práva. Používáním služby souhlasíte s podmínkami Zásad.',

        s2t: '2. Jaká data shromažďujeme',
        s2l1: '<strong>Registrační údaje:</strong> přihlašovací jméno, email, hashované heslo',
        s2l2: '<strong>Data profilu Google</strong> (při přihlášení přes Google): jméno, email, profilová fotka',
        s2l3: '<strong>Herní data:</strong> statistiky, postup, herní nákupy',
        s2l4: '<strong>Technická data:</strong> IP adresa, typ prohlížeče, operační systém, cookies',
        s2l5: '<strong>Protokoly aktivity:</strong> časy přihlášení, herní seance, akce ve hře',

        s3t: '3. Jak data používáme',
        s3l1: 'Vytvoření a údržba vašeho účtu',
        s3l2: 'Zajištění hry a ukládání postupu',
        s3l3: 'Zpracování herních nákupů',
        s3l4: 'Komunikace o důležitých záležitostech (bezpečnost, aktualizace)',
        s3l5: 'Analýza aktivity pro zlepšení služby',
        s3l6: 'Boj proti podvodům a porušovatelům pravidel',

        s4t: '4. Cookies a analytika',
        s4b: 'Používáme cookies k udržení vaší seance, ukládání nastavení (jazyk, motiv) a analýze návštěvnosti. Můžete cookies vypnout v prohlížeči, ale některé funkce nemusí fungovat správně.',

        s5t: '5. Sdílení s třetími stranami',
        s5b: 'Vaše data neprodáváme ani nesdílíme se třetími stranami, s výjimkou:',
        s5l1: 'Platebních systémů (pro zpracování darů)',
        s5l2: 'Poskytovatelů OAuth (Google) při přihlašování přes ně',
        s5l3: 'Orgánů činných v trestním řízení na oficiální žádost',
        s5l4: 'Analytických služeb (v anonymizované formě)',

        s6t: '6. Uložení a zabezpečení',
        s6b: 'Vaše data jsou uložena na zabezpečených serverech. Hesla jsou hashována (nikdy neukládána v otevřené formě). Používáme HTTPS, šifrování a systémy proti neoprávněnému přístupu.',

        s7t: '7. Vaše práva',
        s7b: 'Máte právo:',
        s7l1: 'Požádat o kopii svých dat',
        s7l2: 'Opravit nepřesná data',
        s7l3: 'Smazat účet a související data',
        s7l4: 'Omezit zpracování dat',
        s7l5: 'Kdykoli odvolat souhlas',

        s8t: '8. Děti do 13 let',
        s8b: 'Služba není určena pro děti do 13 let. Pokud zjistíme, že jsme shromáždili data nezletilého bez souhlasu rodičů, okamžitě je smažeme.',

        s9t: '9. Změny zásad',
        s9b: 'Tyto Zásady můžeme aktualizovat. Podstatné změny budou oznámeny na webu a emailem. Další používání služby znamená souhlas s novou verzí.',

        s10t: '10. Kontakt',
        s10b: 'Pro otázky ohledně zpracování dat: <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. Odpovídáme do 24–48 hodin.',
    },

    IT: {
        back: '← Torna alla home',
        title: 'Informativa sulla privacy',
        date: 'Ultimo aggiornamento: 17 aprile 2026',

        s1t: '1. Introduzione',
        s1b: 'Rispettiamo la tua privacy. Questa Informativa spiega quali dati raccogliamo, come li utilizziamo e i tuoi diritti. Utilizzando il nostro servizio accetti i termini di questa Informativa.',

        s2t: '2. Quali dati raccogliamo',
        s2l1: '<strong>Dati di registrazione:</strong> nome utente, email, password hashata',
        s2l2: '<strong>Dati del profilo Google</strong> (con accesso tramite Google): nome, email, foto profilo',
        s2l3: '<strong>Dati di gioco:</strong> statistiche, progressi, acquisti in-game',
        s2l4: '<strong>Dati tecnici:</strong> indirizzo IP, tipo di browser, sistema operativo, cookies',
        s2l5: '<strong>Log di attività:</strong> orari di accesso, sessioni di gioco, azioni nel gioco',

        s3t: '3. Come usiamo i dati',
        s3l1: 'Creare e mantenere il tuo account',
        s3l2: 'Fornire il gameplay e salvare i progressi',
        s3l3: 'Elaborare gli acquisti in-game',
        s3l4: 'Comunicare su questioni importanti (sicurezza, aggiornamenti)',
        s3l5: "Analizzare l'attività per migliorare il servizio",
        s3l6: 'Contrastare frodi e trasgressori',

        s4t: '4. Cookies e analisi',
        s4b: 'Utilizziamo i cookies per mantenere la tua sessione, salvare le impostazioni (lingua, tema) e analizzare il traffico. Puoi disattivare i cookies nel browser, ma alcune funzionalità potrebbero non funzionare correttamente.',

        s5t: '5. Condivisione con terze parti',
        s5b: 'Non vendiamo né condividiamo i tuoi dati con terze parti, eccetto:',
        s5l1: 'Sistemi di pagamento (per le donazioni)',
        s5l2: "Provider OAuth (Google) durante l'accesso tramite loro",
        s5l3: 'Autorità su richiesta ufficiale',
        s5l4: 'Servizi di analisi (in forma anonimizzata)',

        s6t: '6. Conservazione e sicurezza',
        s6b: 'I tuoi dati sono conservati su server sicuri. Le password sono hashate (mai salvate in chiaro). Usiamo HTTPS, crittografia e sistemi contro accessi non autorizzati.',

        s7t: '7. I tuoi diritti',
        s7b: 'Hai il diritto di:',
        s7l1: 'Richiedere una copia dei tuoi dati',
        s7l2: 'Correggere dati inesatti',
        s7l3: 'Eliminare account e dati associati',
        s7l4: 'Limitare il trattamento dei dati',
        s7l5: 'Revocare il consenso in qualsiasi momento',

        s8t: '8. Bambini sotto i 13 anni',
        s8b: 'Il servizio non è destinato a bambini sotto i 13 anni. Se scopriamo di aver raccolto dati di un minore senza consenso genitoriale, li elimineremo immediatamente.',

        s9t: '9. Modifiche',
        s9b: "Possiamo aggiornare questa Informativa. Modifiche sostanziali saranno annunciate sul sito e via email. L'uso continuato implica l'accettazione della nuova versione.",

        s10t: '10. Contatti',
        s10b: 'Per domande sul trattamento dei dati: <a href="mailto:saoweb.support@gmail.com">saoweb.support@gmail.com</a>. Rispondiamo entro 24–48 ore.',
    },
};
