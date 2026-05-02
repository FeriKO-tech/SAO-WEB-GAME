"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { hasStaffRole } from "@/lib/tickets";
import { routing } from "@/i18n/routing";

const LANG_LABELS: Record<string, string> = {
  ru: "RU",
  en: "EN",
  de: "DE",
  fr: "FR",
  pl: "PL",
  es: "ES",
  cz: "CZ",
  it: "IT",
};

const LANG_FULL: Record<string, string> = {
  ru: "RU - Русский",
  en: "EN - English",
  de: "DE - Deutsch",
  fr: "FR - Français",
  pl: "PL - Polski",
  es: "ES - Español",
  cz: "CZ - Čeština",
  it: "IT - Italiano",
};

export function Navbar() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [isStaff, setIsStaff] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Current locale from pathname
  const locale = pathname.split("/")[1] || "ru";

  // Check staff role
  useEffect(() => {
    if (user) {
      hasStaffRole().then(setIsStaff);
    }
  }, [user]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUserMenuOpen(false);
    router.push(`/${locale}/login`);
  };

  const switchLocale = (newLocale: string) => {
    // Replace the locale segment in the current path
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setLangMenuOpen(false);
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Player";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link href={`/${locale}`} className="navbar-logo">
          <span className="navbar-logo-icon">SAO</span>
          <span className="navbar-logo-text">Sword Art Online</span>
        </Link>

        {/* Desktop nav */}
        <nav className="navbar-links">
          <a
            href="https://dsc.gg/sao-web"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-link"
          >
            {t("discord")}
          </a>
          <Link href={`/${locale}/forum`} className="navbar-link">
            {t("forum")}
          </Link>
          <Link href={`/${locale}/support`} className="navbar-link">
            {t("support")}
          </Link>

          {/* Auth state */}
          {!loading && !user && (
            <Link href={`/${locale}/login`} className="navbar-login-btn">
              {t("login")}
            </Link>
          )}

          {!loading && user && (
            <div className="navbar-user-menu" ref={userMenuRef}>
              <button
                className="navbar-user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                type="button"
              >
                <span className="navbar-user-avatar">{avatarInitial}</span>
                <span className="navbar-user-name">{displayName}</span>
              </button>

              {userMenuOpen && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown-header">
                    {user.email}
                  </div>
                  <Link
                    href={`/${locale}/my-tickets`}
                    className="navbar-dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <span>🎫</span> {t("myTickets")}
                  </Link>
                  {isStaff && (
                    <Link
                      href={`/${locale}/admin-tickets`}
                      className="navbar-dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <span>🛠️</span> {t("adminTickets")}
                    </Link>
                  )}
                  <Link
                    href={`/${locale}/settings`}
                    className="navbar-dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <span>⚙️</span> {t("settings")}
                  </Link>
                  <button
                    className="navbar-dropdown-item navbar-dropdown-logout"
                    onClick={handleLogout}
                    type="button"
                  >
                    <span>🚪</span> {t("logout")}
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Language switcher */}
        <div className="navbar-lang" ref={langMenuRef}>
          <button
            className="navbar-lang-btn"
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            type="button"
            aria-label="Switch language"
          >
            <span>{LANG_LABELS[locale] || "RU"}</span>
            <span className="navbar-lang-arrow">▼</span>
          </button>

          {langMenuOpen && (
            <div className="navbar-lang-dropdown">
              {routing.locales.map((loc) => (
                <button
                  key={loc}
                  className={`navbar-lang-option ${loc === locale ? "active" : ""}`}
                  onClick={() => switchLocale(loc)}
                  type="button"
                >
                  {LANG_FULL[loc] || loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar-mobile-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
          aria-label="Menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <a
            href="https://dsc.gg/sao-web"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("discord")}
          </a>
          <Link
            href={`/${locale}/forum`}
            className="navbar-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("forum")}
          </Link>
          <Link
            href={`/${locale}/support`}
            className="navbar-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("support")}
          </Link>
          {!loading && !user && (
            <Link
              href={`/${locale}/login`}
              className="navbar-mobile-link navbar-login-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("login")}
            </Link>
          )}
          {!loading && user && (
            <>
              <Link
                href={`/${locale}/my-tickets`}
                className="navbar-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                🎫 {t("myTickets")}
              </Link>
              {isStaff && (
                <Link
                  href={`/${locale}/admin-tickets`}
                  className="navbar-mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🛠️ {t("adminTickets")}
                </Link>
              )}
              <button
                className="navbar-mobile-link navbar-dropdown-logout"
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                type="button"
              >
                🚪 {t("logout")}
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
