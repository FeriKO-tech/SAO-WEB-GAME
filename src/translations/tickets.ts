/**
 * Translations for the ticket pages (my-tickets, ticket, admin-tickets).
 *
 * Shared across user and staff views. Keys are intentionally flat so
 * `t('ticketTitle')` works without nested lookups.
 */

import type { LanguageMap } from '@models/i18n';

export interface TicketsDict {
    // my-tickets page
    pageTitle: string;
    pageSubtitle: string;
    noTickets: string;
    newTicket: string;
    backToSupport: string;
    statusOpen: string;
    statusResolved: string;
    unreadBadge: string;
    msgCount: (n: number) => string;

    // ticket page
    chatTitle: string;
    chatBack: string;
    chatPlaceholder: string;
    chatSend: string;
    chatEmpty: string;
    chatClosed: string;
    chatReopen: string;
    chatResolve: string;
    chatLoading: string;
    chatNotFound: string;
    chatForbidden: string;
    chatSendError: string;
    chatNetworkError: string;

    // staff labels
    staffLabel: string;
    userLabel: string;

    // admin page
    adminTitle: string;
    adminSubtitle: string;
    filterAll: string;
    filterOpen: string;
    filterResolved: string;
    adminSearchPlaceholder: string;
    filterUnreadOnly: string;
    adminNoTickets: string;
    adminNoResults: string;
    adminEnableNotifications: string;
    adminNotificationNewTicket: string;
    adminNotificationNewMessage: string;
    priorityLabel: string;
    priorityLow: string;
    priorityNormal: string;
    priorityHigh: string;
    priorityUrgent: string;
    assignmentLabel: string;
    assignmentUnassigned: string;
    assignmentAssignToMe: string;
    assignmentTakeTicket: string;
    assignmentUnassign: string;
    statusUpdateError: string;
    priorityUpdateError: string;
    assignmentUpdateError: string;
    internalNotesTitle: string;
    internalNotesPlaceholder: string;
    internalNotesAdd: string;
    internalNotesEmpty: string;
    internalNotesSaveError: string;
    internalNotesNetworkError: string;
    deleteTicket: string;
    deleteConfirm: string;

    // shared
    categoryAccount: string;
    categoryBug: string;
    categoryPayment: string;
    categoryTech: string;
    categoryOther: string;
    timeAgo: (seconds: number) => string;
}

function makeTimeAgo(
    units: { now: string; m: string; h: string; d: string },
): (seconds: number) => string {
    return (s) => {
        if (s < 60) return units.now;
        if (s < 3600) return `${Math.floor(s / 60)}${units.m}`;
        if (s < 86400) return `${Math.floor(s / 3600)}${units.h}`;
        return `${Math.floor(s / 86400)}${units.d}`;
    };
}

export const ticketsTranslations: LanguageMap<TicketsDict> = {
    RU: {
        pageTitle: 'Мои тикеты',
        pageSubtitle: 'История ваших обращений в поддержку.',
        noTickets: 'У вас пока нет тикетов.',
        newTicket: 'Новый тикет',
        backToSupport: '← К поддержке',
        statusOpen: 'Открыт',
        statusResolved: 'Решен',
        unreadBadge: 'Новое',
        msgCount: (n) => `${n} сообщ.`,

        chatTitle: 'Тикет',
        chatBack: '← Назад',
        chatPlaceholder: 'Напишите сообщение...',
        chatSend: 'Отправить',
        chatEmpty: 'Сообщений пока нет.',
        chatClosed: 'Тикет закрыт.',
        chatReopen: 'Открыть снова',
        chatResolve: 'Закрыть тикет',
        chatLoading: 'Загрузка...',
        chatNotFound: 'Тикет не найден.',
        chatForbidden: 'У вас нет доступа к этому тикету.',
        chatSendError: 'Не удалось отправить сообщение.',
        chatNetworkError: 'Сеть недоступна. Попробуйте ещё раз через минуту.',

        staffLabel: 'Поддержка',
        userLabel: 'Вы',

        adminTitle: 'Тикеты поддержки',
        adminSubtitle: 'Управление обращениями пользователей.',
        filterAll: 'Все',
        filterOpen: 'Открытые',
        filterResolved: 'Решенные',
        adminSearchPlaceholder: 'Поиск по номеру, теме, @username, email',
        filterUnreadOnly: 'Только непрочитанные',
        adminNoTickets: 'Тикетов пока нет.',
        adminNoResults: 'Ничего не найдено по текущим фильтрам.',
        adminEnableNotifications: 'Включить уведомления',
        adminNotificationNewTicket: 'Новый тикет',
        adminNotificationNewMessage: 'Новое сообщение в тикете',
        priorityLabel: 'Приоритет',
        priorityLow: 'Низкий',
        priorityNormal: 'Обычный',
        priorityHigh: 'Высокий',
        priorityUrgent: 'Срочный',
        assignmentLabel: 'Назначение',
        assignmentUnassigned: 'Не назначен',
        assignmentAssignToMe: 'Назначить мне',
        assignmentTakeTicket: 'Взять тикет',
        assignmentUnassign: 'Снять назначение',
        statusUpdateError: 'Не удалось обновить статус тикета.',
        priorityUpdateError: 'Не удалось обновить приоритет.',
        assignmentUpdateError: 'Не удалось обновить назначение.',
        internalNotesTitle: 'Внутренние заметки',
        internalNotesPlaceholder: 'Добавьте заметку для команды...',
        internalNotesAdd: 'Добавить заметку',
        internalNotesEmpty: 'Внутренних заметок пока нет.',
        internalNotesSaveError: 'Не удалось сохранить заметку.',
        internalNotesNetworkError: 'Сеть недоступна. Не удалось сохранить заметку.',
        deleteTicket: 'Удалить тикет',
        deleteConfirm: 'Вы уверены, что хотите удалить этот тикет?',

        categoryAccount: 'Аккаунт',
        categoryBug: 'Баг',
        categoryPayment: 'Оплата',
        categoryTech: 'Технический',
        categoryOther: 'Другое',
        timeAgo: makeTimeAgo({ now: 'сейчас', m: 'м', h: 'ч', d: 'д' }),
    },

    EN: {
        pageTitle: 'My tickets',
        pageSubtitle: 'Your support request history.',
        noTickets: 'You have no tickets yet.',
        newTicket: 'New ticket',
        backToSupport: '← Back to support',
        statusOpen: 'Open',
        statusResolved: 'Resolved',
        unreadBadge: 'New',
        msgCount: (n) => `${n} msg`,

        chatTitle: 'Ticket',
        chatBack: '← Back',
        chatPlaceholder: 'Type a message...',
        chatSend: 'Send',
        chatEmpty: 'No messages yet.',
        chatClosed: 'This ticket is closed.',
        chatReopen: 'Reopen',
        chatResolve: 'Resolve ticket',
        chatLoading: 'Loading...',
        chatNotFound: 'Ticket not found.',
        chatForbidden: 'You do not have access to this ticket.',
        chatSendError: 'Failed to send message.',
        chatNetworkError: 'Network is unavailable. Please try again in a minute.',

        staffLabel: 'Support',
        userLabel: 'You',

        adminTitle: 'Support inbox',
        adminSubtitle: 'Manage user support requests.',
        filterAll: 'All',
        filterOpen: 'Open',
        filterResolved: 'Resolved',
        adminSearchPlaceholder: 'Search by number, subject, @username, email',
        filterUnreadOnly: 'Unread only',
        adminNoTickets: 'No tickets yet.',
        adminNoResults: 'No tickets match the current filters.',
        adminEnableNotifications: 'Enable notifications',
        adminNotificationNewTicket: 'New ticket',
        adminNotificationNewMessage: 'New message in ticket',
        priorityLabel: 'Priority',
        priorityLow: 'Low',
        priorityNormal: 'Normal',
        priorityHigh: 'High',
        priorityUrgent: 'Urgent',
        assignmentLabel: 'Assignment',
        assignmentUnassigned: 'Unassigned',
        assignmentAssignToMe: 'Assign to me',
        assignmentTakeTicket: 'Take ticket',
        assignmentUnassign: 'Unassign',
        statusUpdateError: 'Failed to update ticket status.',
        priorityUpdateError: 'Failed to update priority.',
        assignmentUpdateError: 'Failed to update assignment.',
        internalNotesTitle: 'Internal notes',
        internalNotesPlaceholder: 'Add a note for the team...',
        internalNotesAdd: 'Add note',
        internalNotesEmpty: 'No internal notes yet.',
        internalNotesSaveError: 'Failed to save note.',
        internalNotesNetworkError: 'Network is unavailable. Failed to save note.',
        deleteTicket: 'Delete ticket',
        deleteConfirm: 'Are you sure you want to delete this ticket?',

        categoryAccount: 'Account',
        categoryBug: 'Bug',
        categoryPayment: 'Payment',
        categoryTech: 'Technical',
        categoryOther: 'Other',
        timeAgo: makeTimeAgo({ now: 'now', m: 'm', h: 'h', d: 'd' }),
    },

    DE: {
        pageTitle: 'Meine Tickets',
        pageSubtitle: 'Verlauf Ihrer Support-Anfragen.',
        noTickets: 'Sie haben noch keine Tickets.',
        newTicket: 'Neues Ticket',
        backToSupport: '← Zum Support',
        statusOpen: 'Offen',
        statusResolved: 'Gelost',
        unreadBadge: 'Neu',
        msgCount: (n) => `${n} Nachr.`,

        chatTitle: 'Ticket',
        chatBack: '← Zuruck',
        chatPlaceholder: 'Nachricht schreiben...',
        chatSend: 'Senden',
        chatEmpty: 'Noch keine Nachrichten.',
        chatClosed: 'Dieses Ticket ist geschlossen.',
        chatReopen: 'Wiedereröffnen',
        chatResolve: 'Ticket schließen',
        chatLoading: 'Laden...',
        chatNotFound: 'Ticket nicht gefunden.',
        chatForbidden: 'Sie haben keinen Zugriff auf dieses Ticket.',
        chatSendError: 'Nachricht konnte nicht gesendet werden.',
        chatNetworkError: 'Netzwerk nicht verfugbar. Bitte versuchen Sie es in einer Minute erneut.',

        staffLabel: 'Support',
        userLabel: 'Sie',

        adminTitle: 'Support-Tickets',
        adminSubtitle: 'Benutzeranfragen verwalten.',
        filterAll: 'Alle',
        filterOpen: 'Offen',
        filterResolved: 'Gelost',
        adminSearchPlaceholder: 'Suche nach Nummer, Betreff, @Nutzername, E-Mail',
        filterUnreadOnly: 'Nur ungelesene',
        adminNoTickets: 'Noch keine Tickets.',
        adminNoResults: 'Keine Tickets entsprechen den aktuellen Filtern.',
        adminEnableNotifications: 'Benachrichtigungen aktivieren',
        adminNotificationNewTicket: 'Neues Ticket',
        adminNotificationNewMessage: 'Neue Nachricht im Ticket',
        priorityLabel: 'Prioritat',
        priorityLow: 'Niedrig',
        priorityNormal: 'Normal',
        priorityHigh: 'Hoch',
        priorityUrgent: 'Dringend',
        assignmentLabel: 'Zuweisung',
        assignmentUnassigned: 'Nicht zugewiesen',
        assignmentAssignToMe: 'Mir zuweisen',
        assignmentTakeTicket: 'Ticket ubernehmen',
        assignmentUnassign: 'Zuweisung entfernen',
        statusUpdateError: 'Ticketstatus konnte nicht aktualisiert werden.',
        priorityUpdateError: 'Prioritat konnte nicht aktualisiert werden.',
        assignmentUpdateError: 'Zuweisung konnte nicht aktualisiert werden.',
        internalNotesTitle: 'Interne Notizen',
        internalNotesPlaceholder: 'Interne Notiz fur das Team...',
        internalNotesAdd: 'Notiz hinzufugen',
        internalNotesEmpty: 'Noch keine internen Notizen.',
        internalNotesSaveError: 'Notiz konnte nicht gespeichert werden.',
        internalNotesNetworkError: 'Netzwerk nicht verfugbar. Notiz konnte nicht gespeichert werden.',
        deleteTicket: 'Ticket löschen',
        deleteConfirm: 'Möchten Sie dieses Ticket wirklich löschen?',

        categoryAccount: 'Konto',
        categoryBug: 'Bug',
        categoryPayment: 'Zahlung',
        categoryTech: 'Technik',
        categoryOther: 'Sonstiges',
        timeAgo: makeTimeAgo({ now: 'jetzt', m: 'min', h: 'h', d: 'T' }),
    },

    FR: {
        pageTitle: 'Mes tickets',
        pageSubtitle: 'Historique de vos demandes de support.',
        noTickets: "Vous n'avez pas encore de tickets.",
        newTicket: 'Nouveau ticket',
        backToSupport: '← Retour au support',
        statusOpen: 'Ouvert',
        statusResolved: 'Resolu',
        unreadBadge: 'Nouveau',
        msgCount: (n) => `${n} msg`,

        chatTitle: 'Ticket',
        chatBack: '← Retour',
        chatPlaceholder: 'Ecrire un message...',
        chatSend: 'Envoyer',
        chatEmpty: 'Aucun message pour le moment.',
        chatClosed: 'Ce ticket est ferme.',
        chatReopen: 'Rouvrir',
        chatResolve: 'Fermer le ticket',
        chatLoading: 'Chargement...',
        chatNotFound: 'Ticket introuvable.',
        chatForbidden: "Vous n'avez pas acces a ce ticket.",
        chatSendError: "Impossible d'envoyer le message.",
        chatNetworkError: 'Reseau indisponible. Veuillez reessayer dans une minute.',

        staffLabel: 'Support',
        userLabel: 'Vous',

        adminTitle: 'Boite support',
        adminSubtitle: 'Gestion des demandes utilisateurs.',
        filterAll: 'Tous',
        filterOpen: 'Ouverts',
        filterResolved: 'Resolus',
        adminSearchPlaceholder: 'Recherche par numero, sujet, @pseudo, email',
        filterUnreadOnly: 'Non lus seulement',
        adminNoTickets: 'Aucun ticket pour le moment.',
        adminNoResults: 'Aucun ticket ne correspond aux filtres.',
        adminEnableNotifications: 'Activer les notifications',
        adminNotificationNewTicket: 'Nouveau ticket',
        adminNotificationNewMessage: 'Nouveau message dans le ticket',
        priorityLabel: 'Priorite',
        priorityLow: 'Basse',
        priorityNormal: 'Normale',
        priorityHigh: 'Haute',
        priorityUrgent: 'Urgente',
        assignmentLabel: 'Attribution',
        assignmentUnassigned: 'Non attribue',
        assignmentAssignToMe: 'M\'assigner',
        assignmentTakeTicket: 'Prendre le ticket',
        assignmentUnassign: 'Retirer l\'attribution',
        statusUpdateError: 'Impossible de mettre a jour le statut du ticket.',
        priorityUpdateError: 'Impossible de mettre a jour la priorite.',
        assignmentUpdateError: 'Impossible de mettre a jour l\'attribution.',
        internalNotesTitle: 'Notes internes',
        internalNotesPlaceholder: 'Ajouter une note pour l\'equipe...',
        internalNotesAdd: 'Ajouter une note',
        internalNotesEmpty: 'Aucune note interne pour le moment.',
        internalNotesSaveError: 'Impossible d\'enregistrer la note.',
        internalNotesNetworkError: 'Reseau indisponible. Impossible d\'enregistrer la note.',
        deleteTicket: 'Supprimer le ticket',
        deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce ticket ?',

        categoryAccount: 'Compte',
        categoryBug: 'Bug',
        categoryPayment: 'Paiement',
        categoryTech: 'Technique',
        categoryOther: 'Autre',
        timeAgo: makeTimeAgo({ now: 'maintenant', m: 'min', h: 'h', d: 'j' }),
    },

    PL: {
        pageTitle: 'Moje zgloszenia',
        pageSubtitle: 'Historia Twoich zgloszen do wsparcia.',
        noTickets: 'Nie masz jeszcze zgloszen.',
        newTicket: 'Nowe zgloszenie',
        backToSupport: '← Do wsparcia',
        statusOpen: 'Otwarte',
        statusResolved: 'Rozwiazane',
        unreadBadge: 'Nowe',
        msgCount: (n) => `${n} wiad.`,

        chatTitle: 'Zgloszenie',
        chatBack: '← Wstecz',
        chatPlaceholder: 'Napisz wiadomosc...',
        chatSend: 'Wyslij',
        chatEmpty: 'Brak wiadomosci.',
        chatClosed: 'To zgloszenie jest zamkniete.',
        chatReopen: 'Otworz ponownie',
        chatResolve: 'Zamknij zgloszenie',
        chatLoading: 'Ladowanie...',
        chatNotFound: 'Zgloszenie nie znalezione.',
        chatForbidden: 'Nie masz dostepu do tego zgloszenia.',
        chatSendError: 'Nie udalo sie wyslac wiadomosci.',
        chatNetworkError: 'Siec niedostepna. Sprobuj ponownie za minute.',

        staffLabel: 'Wsparcie',
        userLabel: 'Ty',

        adminTitle: 'Skrzynka wsparcia',
        adminSubtitle: 'Zarzadzanie zgloszeniami uzytkownikow.',
        filterAll: 'Wszystkie',
        filterOpen: 'Otwarte',
        filterResolved: 'Rozwiazane',
        adminSearchPlaceholder: 'Szukaj po numerze, temacie, @uzytkowniku, email',
        filterUnreadOnly: 'Tylko nieprzeczytane',
        adminNoTickets: 'Brak zgloszen.',
        adminNoResults: 'Brak wynikow dla obecnych filtrow.',
        adminEnableNotifications: 'Wlacz powiadomienia',
        adminNotificationNewTicket: 'Nowe zgloszenie',
        adminNotificationNewMessage: 'Nowa wiadomosc w zgloszeniu',
        priorityLabel: 'Priorytet',
        priorityLow: 'Niski',
        priorityNormal: 'Normalny',
        priorityHigh: 'Wysoki',
        priorityUrgent: 'Pilny',
        assignmentLabel: 'Przypisanie',
        assignmentUnassigned: 'Nieprzypisane',
        assignmentAssignToMe: 'Przypisz do mnie',
        assignmentTakeTicket: 'Przejmij zgloszenie',
        assignmentUnassign: 'Usun przypisanie',
        statusUpdateError: 'Nie udalo sie zaktualizowac statusu zgloszenia.',
        priorityUpdateError: 'Nie udalo sie zaktualizowac priorytetu.',
        assignmentUpdateError: 'Nie udalo sie zaktualizowac przypisania.',
        internalNotesTitle: 'Notatki wewnetrzne',
        internalNotesPlaceholder: 'Dodaj notatke dla zespolu...',
        internalNotesAdd: 'Dodaj notatke',
        internalNotesEmpty: 'Brak notatek wewnetrznych.',
        internalNotesSaveError: 'Nie udalo sie zapisac notatki.',
        internalNotesNetworkError: 'Siec niedostepna. Nie udalo sie zapisac notatki.',
        deleteTicket: 'Usuń zgłoszenie',
        deleteConfirm: 'Czy na pewno chcesz usunąć to zgłoszenie?',

        categoryAccount: 'Konto',
        categoryBug: 'Bug',
        categoryPayment: 'Platnosc',
        categoryTech: 'Techniczny',
        categoryOther: 'Inne',
        timeAgo: makeTimeAgo({ now: 'teraz', m: 'min', h: 'godz', d: 'dn' }),
    },

    ES: {
        pageTitle: 'Mis tickets',
        pageSubtitle: 'Historial de solicitudes de soporte.',
        noTickets: 'Aun no tienes tickets.',
        newTicket: 'Nuevo ticket',
        backToSupport: '← Volver a soporte',
        statusOpen: 'Abierto',
        statusResolved: 'Resuelto',
        unreadBadge: 'Nuevo',
        msgCount: (n) => `${n} msg`,

        chatTitle: 'Ticket',
        chatBack: '← Volver',
        chatPlaceholder: 'Escribe un mensaje...',
        chatSend: 'Enviar',
        chatEmpty: 'Sin mensajes aun.',
        chatClosed: 'Este ticket esta cerrado.',
        chatReopen: 'Reabrir',
        chatResolve: 'Cerrar ticket',
        chatLoading: 'Cargando...',
        chatNotFound: 'Ticket no encontrado.',
        chatForbidden: 'No tienes acceso a este ticket.',
        chatSendError: 'No se pudo enviar el mensaje.',
        chatNetworkError: 'Sin conexion. Intentalo de nuevo en un minuto.',

        staffLabel: 'Soporte',
        userLabel: 'Tu',

        adminTitle: 'Bandeja de soporte',
        adminSubtitle: 'Gestionar solicitudes de usuarios.',
        filterAll: 'Todos',
        filterOpen: 'Abiertos',
        filterResolved: 'Resueltos',
        adminSearchPlaceholder: 'Buscar por numero, asunto, @usuario, email',
        filterUnreadOnly: 'Solo no leidos',
        adminNoTickets: 'Aun no hay tickets.',
        adminNoResults: 'No hay tickets que coincidan con los filtros.',
        adminEnableNotifications: 'Activar notificaciones',
        adminNotificationNewTicket: 'Nuevo ticket',
        adminNotificationNewMessage: 'Nuevo mensaje en el ticket',
        priorityLabel: 'Prioridad',
        priorityLow: 'Baja',
        priorityNormal: 'Normal',
        priorityHigh: 'Alta',
        priorityUrgent: 'Urgente',
        assignmentLabel: 'Asignacion',
        assignmentUnassigned: 'Sin asignar',
        assignmentAssignToMe: 'Asignarme',
        assignmentTakeTicket: 'Tomar ticket',
        assignmentUnassign: 'Quitar asignacion',
        statusUpdateError: 'No se pudo actualizar el estado del ticket.',
        priorityUpdateError: 'No se pudo actualizar la prioridad.',
        assignmentUpdateError: 'No se pudo actualizar la asignacion.',
        internalNotesTitle: 'Notas internas',
        internalNotesPlaceholder: 'Agrega una nota para el equipo...',
        internalNotesAdd: 'Agregar nota',
        internalNotesEmpty: 'No hay notas internas todavia.',
        internalNotesSaveError: 'No se pudo guardar la nota.',
        internalNotesNetworkError: 'Sin conexion. No se pudo guardar la nota.',
        deleteTicket: 'Eliminar ticket',
        deleteConfirm: '¿Estás seguro de que quieres eliminar este ticket?',

        categoryAccount: 'Cuenta',
        categoryBug: 'Bug',
        categoryPayment: 'Pago',
        categoryTech: 'Tecnico',
        categoryOther: 'Otro',
        timeAgo: makeTimeAgo({ now: 'ahora', m: 'min', h: 'h', d: 'd' }),
    },

    CZ: {
        pageTitle: 'Moje tikety',
        pageSubtitle: 'Historie vasich pozadavku na podporu.',
        noTickets: 'Zatim nemate zadne tikety.',
        newTicket: 'Novy tiket',
        backToSupport: '← Zpet na podporu',
        statusOpen: 'Otevreny',
        statusResolved: 'Vyreseny',
        unreadBadge: 'Nove',
        msgCount: (n) => `${n} zpr.`,

        chatTitle: 'Tiket',
        chatBack: '← Zpet',
        chatPlaceholder: 'Napiste zpravu...',
        chatSend: 'Odeslat',
        chatEmpty: 'Zatim zadne zpravy.',
        chatClosed: 'Tento tiket je uzavren.',
        chatReopen: 'Znovu otevrit',
        chatResolve: 'Uzavrit tiket',
        chatLoading: 'Nacitani...',
        chatNotFound: 'Tiket nenalezen.',
        chatForbidden: 'K tomuto tiketu nemate pristup.',
        chatSendError: 'Zpravu se nepodarilo odeslat.',
        chatNetworkError: 'Sit neni dostupna. Zkuste to znovu za chvili.',

        staffLabel: 'Podpora',
        userLabel: 'Vy',

        adminTitle: 'Podpora fronta',
        adminSubtitle: 'Sprava pozadavku uzivatelu.',
        filterAll: 'Vsechny',
        filterOpen: 'Otevrene',
        filterResolved: 'Vyresene',
        adminSearchPlaceholder: 'Hledat podle cisla, predmetu, @uzivatele, emailu',
        filterUnreadOnly: 'Jen neprectene',
        adminNoTickets: 'Zatim zadne tikety.',
        adminNoResults: 'Zadny tiket neodpovida aktualnim filtrum.',
        adminEnableNotifications: 'Zapnout oznameni',
        adminNotificationNewTicket: 'Novy tiket',
        adminNotificationNewMessage: 'Nova zprava v tiketu',
        priorityLabel: 'Priorita',
        priorityLow: 'Nizka',
        priorityNormal: 'Normalni',
        priorityHigh: 'Vysoka',
        priorityUrgent: 'Urgentni',
        assignmentLabel: 'Prirazeni',
        assignmentUnassigned: 'Neprirazeno',
        assignmentAssignToMe: 'Priradit mne',
        assignmentTakeTicket: 'Prevzit tiket',
        assignmentUnassign: 'Odebrat prirazeni',
        statusUpdateError: 'Nepodarilo se aktualizovat stav tiketu.',
        priorityUpdateError: 'Nepodarilo se aktualizovat prioritu.',
        assignmentUpdateError: 'Nepodarilo se aktualizovat prirazeni.',
        internalNotesTitle: 'Interni poznamky',
        internalNotesPlaceholder: 'Pridejte poznamku pro tym...',
        internalNotesAdd: 'Pridat poznamku',
        internalNotesEmpty: 'Zatim zadne interni poznamky.',
        internalNotesSaveError: 'Poznamku se nepodarilo ulozit.',
        internalNotesNetworkError: 'Sit neni dostupna. Poznamku se nepodarilo ulozit.',
        deleteTicket: 'Smazat tiket',
        deleteConfirm: 'Opravdu chcete tento tiket smazat?',

        categoryAccount: 'Ucet',
        categoryBug: 'Bug',
        categoryPayment: 'Platba',
        categoryTech: 'Technicky',
        categoryOther: 'Jine',
        timeAgo: makeTimeAgo({ now: 'nyni', m: 'min', h: 'hod', d: 'd' }),
    },

    IT: {
        pageTitle: 'I miei ticket',
        pageSubtitle: 'Cronologia delle richieste di supporto.',
        noTickets: 'Non hai ancora ticket.',
        newTicket: 'Nuovo ticket',
        backToSupport: '← Torna al supporto',
        statusOpen: 'Aperto',
        statusResolved: 'Risolto',
        unreadBadge: 'Nuovo',
        msgCount: (n) => `${n} msg`,

        chatTitle: 'Ticket',
        chatBack: '← Indietro',
        chatPlaceholder: 'Scrivi un messaggio...',
        chatSend: 'Invia',
        chatEmpty: 'Nessun messaggio.',
        chatClosed: 'Questo ticket e chiuso.',
        chatReopen: 'Riaprire',
        chatResolve: 'Chiudi ticket',
        chatLoading: 'Caricamento...',
        chatNotFound: 'Ticket non trovato.',
        chatForbidden: 'Non hai accesso a questo ticket.',
        chatSendError: 'Impossibile inviare il messaggio.',
        chatNetworkError: 'Rete non disponibile. Riprova tra un minuto.',

        staffLabel: 'Supporto',
        userLabel: 'Tu',

        adminTitle: 'Coda supporto',
        adminSubtitle: 'Gestione delle richieste utente.',
        filterAll: 'Tutti',
        filterOpen: 'Aperti',
        filterResolved: 'Risolti',
        adminSearchPlaceholder: 'Cerca per numero, oggetto, @username, email',
        filterUnreadOnly: 'Solo non letti',
        adminNoTickets: 'Nessun ticket al momento.',
        adminNoResults: 'Nessun ticket corrisponde ai filtri attuali.',
        adminEnableNotifications: 'Abilita notifiche',
        adminNotificationNewTicket: 'Nuovo ticket',
        adminNotificationNewMessage: 'Nuovo messaggio nel ticket',
        priorityLabel: 'Priorita',
        priorityLow: 'Bassa',
        priorityNormal: 'Normale',
        priorityHigh: 'Alta',
        priorityUrgent: 'Urgente',
        assignmentLabel: 'Assegnazione',
        assignmentUnassigned: 'Non assegnato',
        assignmentAssignToMe: 'Assegna a me',
        assignmentTakeTicket: 'Prendi ticket',
        assignmentUnassign: 'Rimuovi assegnazione',
        statusUpdateError: 'Impossibile aggiornare lo stato del ticket.',
        priorityUpdateError: 'Impossibile aggiornare la priorita.',
        assignmentUpdateError: 'Impossibile aggiornare l\'assegnazione.',
        internalNotesTitle: 'Note interne',
        internalNotesPlaceholder: 'Aggiungi una nota per il team...',
        internalNotesAdd: 'Aggiungi nota',
        internalNotesEmpty: 'Nessuna nota interna.',
        internalNotesSaveError: 'Impossibile salvare la nota.',
        internalNotesNetworkError: 'Rete non disponibile. Impossibile salvare la nota.',
        deleteTicket: 'Elimina ticket',
        deleteConfirm: 'Sei sicuro di voler eliminare questo ticket?',

        categoryAccount: 'Account',
        categoryBug: 'Bug',
        categoryPayment: 'Pagamento',
        categoryTech: 'Tecnico',
        categoryOther: 'Altro',
        timeAgo: makeTimeAgo({ now: 'ora', m: 'min', h: 'h', d: 'g' }),
    },
};
