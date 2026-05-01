import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['ru', 'en', 'de', 'fr', 'pl', 'es', 'cz', 'it'],
  defaultLocale: 'ru'
});

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
