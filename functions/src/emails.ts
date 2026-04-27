/**
 * Localised email templates for support-ticket auto-replies.
 *
 * Short, plain-text-friendly bodies. The user just needs to know:
 *   - we got their ticket
 *   - its number
 *   - roughly when to expect a response
 *
 * HTML is kept minimal so the email passes spam filters and renders well
 * in every client (Gmail, Outlook, Thunderbird, Apple Mail).
 */

export type Lang = 'RU' | 'EN' | 'DE' | 'FR' | 'PL' | 'ES' | 'CZ' | 'IT';

export interface AutoReplyTemplate {
    subject: (ticketNumber: string) => string;
    /** Plain-text fallback body. */
    text: (name: string, ticketNumber: string) => string;
    /** Rich HTML body (wrapped by sendAutoReply). */
    html: (name: string, ticketNumber: string) => string;
}

const templates: Record<Lang, AutoReplyTemplate> = {
    RU: {
        subject: (n) => `[SAO Web] Мы получили ваше обращение ${n}`,
        text: (name, n) =>
            `Здравствуйте, ${name}!\n\n` +
            `Мы получили ваше обращение ${n}. Наша команда ответит в течение 24 часов.\n\n` +
            `Пожалуйста, сохраните этот номер - он пригодится, если захотите уточнить детали.\n\n` +
            `- Команда поддержки Sword Art Online Web`,
        html: (name, n) =>
            `<p>Здравствуйте, <strong>${name}</strong>!</p>` +
            `<p>Мы получили ваше обращение <strong>${n}</strong>. Наша команда ответит в течение 24&nbsp;часов.</p>` +
            `<p>Пожалуйста, сохраните этот номер - он пригодится, если захотите уточнить детали.</p>` +
            `<p style="color:#888">- Команда поддержки Sword Art Online Web</p>`,
    },
    EN: {
        subject: (n) => `[SAO Web] We have received your ticket ${n}`,
        text: (name, n) =>
            `Hi ${name},\n\n` +
            `We have received your ticket ${n}. Our team will reply within 24 hours.\n\n` +
            `Please keep this number for your records in case you want to follow up.\n\n` +
            `- Sword Art Online Web support team`,
        html: (name, n) =>
            `<p>Hi <strong>${name}</strong>,</p>` +
            `<p>We have received your ticket <strong>${n}</strong>. Our team will reply within 24&nbsp;hours.</p>` +
            `<p>Please keep this number for your records in case you want to follow up.</p>` +
            `<p style="color:#888">- Sword Art Online Web support team</p>`,
    },
    DE: {
        subject: (n) => `[SAO Web] Wir haben Ihre Anfrage ${n} erhalten`,
        text: (name, n) =>
            `Hallo ${name},\n\n` +
            `Wir haben Ihre Anfrage ${n} erhalten. Unser Team antwortet innerhalb von 24 Stunden.\n\n` +
            `Bitte bewahren Sie diese Nummer auf, falls Sie nachfragen möchten.\n\n` +
            `- Support-Team von Sword Art Online Web`,
        html: (name, n) =>
            `<p>Hallo <strong>${name}</strong>,</p>` +
            `<p>Wir haben Ihre Anfrage <strong>${n}</strong> erhalten. Unser Team antwortet innerhalb von 24&nbsp;Stunden.</p>` +
            `<p>Bitte bewahren Sie diese Nummer auf, falls Sie nachfragen möchten.</p>` +
            `<p style="color:#888">- Support-Team von Sword Art Online Web</p>`,
    },
    FR: {
        subject: (n) => `[SAO Web] Nous avons reçu votre demande ${n}`,
        text: (name, n) =>
            `Bonjour ${name},\n\n` +
            `Nous avons reçu votre demande ${n}. Notre équipe répondra sous 24 heures.\n\n` +
            `Veuillez conserver ce numéro pour pouvoir nous recontacter.\n\n` +
            `- L'équipe de support Sword Art Online Web`,
        html: (name, n) =>
            `<p>Bonjour <strong>${name}</strong>,</p>` +
            `<p>Nous avons reçu votre demande <strong>${n}</strong>. Notre équipe répondra sous 24&nbsp;heures.</p>` +
            `<p>Veuillez conserver ce numéro pour pouvoir nous recontacter.</p>` +
            `<p style="color:#888">- L'équipe de support Sword Art Online Web</p>`,
    },
    PL: {
        subject: (n) => `[SAO Web] Otrzymaliśmy Twoje zgłoszenie ${n}`,
        text: (name, n) =>
            `Witaj ${name},\n\n` +
            `Otrzymaliśmy Twoje zgłoszenie ${n}. Nasz zespół odpowie w ciągu 24 godzin.\n\n` +
            `Zachowaj ten numer na wypadek, gdybyś chciał sprawdzić status sprawy.\n\n` +
            `- Zespół wsparcia Sword Art Online Web`,
        html: (name, n) =>
            `<p>Witaj <strong>${name}</strong>,</p>` +
            `<p>Otrzymaliśmy Twoje zgłoszenie <strong>${n}</strong>. Nasz zespół odpowie w ciągu 24&nbsp;godzin.</p>` +
            `<p>Zachowaj ten numer na wypadek, gdybyś chciał sprawdzić status sprawy.</p>` +
            `<p style="color:#888">- Zespół wsparcia Sword Art Online Web</p>`,
    },
    ES: {
        subject: (n) => `[SAO Web] Hemos recibido tu ticket ${n}`,
        text: (name, n) =>
            `Hola ${name},\n\n` +
            `Hemos recibido tu ticket ${n}. Nuestro equipo responderá en 24 horas.\n\n` +
            `Por favor, guarda este número por si quieres darle seguimiento.\n\n` +
            `- Equipo de soporte de Sword Art Online Web`,
        html: (name, n) =>
            `<p>Hola <strong>${name}</strong>,</p>` +
            `<p>Hemos recibido tu ticket <strong>${n}</strong>. Nuestro equipo responderá en 24&nbsp;horas.</p>` +
            `<p>Por favor, guarda este número por si quieres darle seguimiento.</p>` +
            `<p style="color:#888">- Equipo de soporte de Sword Art Online Web</p>`,
    },
    CZ: {
        subject: (n) => `[SAO Web] Obdrželi jsme váš dotaz ${n}`,
        text: (name, n) =>
            `Dobrý den, ${name},\n\n` +
            `Obdrželi jsme váš dotaz ${n}. Náš tým odpoví do 24 hodin.\n\n` +
            `Uschovejte si prosím toto číslo pro případné další dotazy.\n\n` +
            `- Tým podpory Sword Art Online Web`,
        html: (name, n) =>
            `<p>Dobrý den, <strong>${name}</strong>,</p>` +
            `<p>Obdrželi jsme váš dotaz <strong>${n}</strong>. Náš tým odpoví do 24&nbsp;hodin.</p>` +
            `<p>Uschovejte si prosím toto číslo pro případné další dotazy.</p>` +
            `<p style="color:#888">- Tým podpory Sword Art Online Web</p>`,
    },
    IT: {
        subject: (n) => `[SAO Web] Abbiamo ricevuto la tua richiesta ${n}`,
        text: (name, n) =>
            `Ciao ${name},\n\n` +
            `Abbiamo ricevuto la tua richiesta ${n}. Il nostro team risponderà entro 24 ore.\n\n` +
            `Conserva questo numero per eventuali verifiche successive.\n\n` +
            `- Team di supporto di Sword Art Online Web`,
        html: (name, n) =>
            `<p>Ciao <strong>${name}</strong>,</p>` +
            `<p>Abbiamo ricevuto la tua richiesta <strong>${n}</strong>. Il nostro team risponderà entro 24&nbsp;ore.</p>` +
            `<p>Conserva questo numero per eventuali verifiche successive.</p>` +
            `<p style="color:#888">- Team di supporto di Sword Art Online Web</p>`,
    },
};

/**
 * Return the template for the given language. Falls back to EN if the code
 * is missing or unsupported - we never want to send an email in a random
 * language the user cannot read.
 */
export function templateFor(lang: string): AutoReplyTemplate {
    const up = (lang || '').toUpperCase();
    if (up in templates) return templates[up as Lang];
    return templates.EN;
}
