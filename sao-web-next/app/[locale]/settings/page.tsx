"use client";

import { useState, useEffect, use } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

type Tab = "profile" | "security" | "prefs" | "account";

export default function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("Settings");
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);

  // Profile fields
  const [displayName, setDisplayName] = useState("");

  // Security fields
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // Preferences
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animEnabled, setAnimEnabled] = useState(true);

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deletePw, setDeletePw] = useState("");

  const isGoogleUser = user?.providerData?.[0]?.providerId === "google.com";

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, authLoading, router, locale]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
    }
  }, [user]);

  // Load preferences from localStorage
  useEffect(() => {
    setSoundEnabled(localStorage.getItem("pref-sound") !== "off");
    setAnimEnabled(localStorage.getItem("pref-anim") !== "off");
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await updateProfile(user, { displayName });
      toast.success(t("saveSuccess"));
    } catch (err) {
      console.error(err);
      toast.error(t("saveError"));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) return;
    if (newPw.length < 6) {
      toast.error(t("pwTooShort"));
      return;
    }
    if (newPw !== confirmPw) {
      toast.error(t("pwMismatch"));
      return;
    }
    try {
      setSaving(true);
      const credential = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPw);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      toast.success(t("pwChangeSuccess"));
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        toast.error(t("pwWrongCurrent"));
      } else {
        toast.error(t("pwChangeError"));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSound = (val: boolean) => {
    setSoundEnabled(val);
    localStorage.setItem("pref-sound", val ? "on" : "off");
  };

  const handleToggleAnim = (val: boolean) => {
    setAnimEnabled(val);
    localStorage.setItem("pref-anim", val ? "on" : "off");
    if (!val) {
      document.documentElement.classList.add("no-anim");
    } else {
      document.documentElement.classList.remove("no-anim");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const username = user.displayName || user.email?.split("@")[0] || "";
    if (deleteConfirm !== username) {
      toast.error(t("deleteNameMismatch"));
      return;
    }
    try {
      setSaving(true);
      if (!isGoogleUser && user.email) {
        const credential = EmailAuthProvider.credential(user.email, deletePw);
        await reauthenticateWithCredential(user, credential);
      }
      await deleteUser(user);
      toast.success(t("deleteSuccess"));
      router.push(`/${locale}`);
    } catch (err: any) {
      console.error(err);
      toast.error(t("deleteError"));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push(`/${locale}/login`);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const tabs: { id: Tab; icon: string; labelKey: string }[] = [
    { id: "profile", icon: "👤", labelKey: "tabProfile" },
    { id: "security", icon: "🔒", labelKey: "tabSecurity" },
    { id: "prefs", icon: "⚙️", labelKey: "tabPrefs" },
    { id: "account", icon: "🚪", labelKey: "tabAccount" },
  ];

  const avatarInitial = (user.displayName || user.email || "P").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="container max-w-4xl mx-auto pt-24 px-4 sm:px-6">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading mb-2">{t("title")}</h1>
        </header>

        <div className="grid md:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar */}
          <nav className="flex md:flex-col gap-1 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                type="button"
              >
                <span>{tab.icon}</span>
                <span>{t(tab.labelKey)}</span>
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{t("profileTitle")}</h2>
                  <p className="text-sm text-muted-foreground">{t("profileDesc")}</p>
                </div>

                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                    {avatarInitial}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{user.displayName || "—"}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 mt-1 inline-block">
                      {isGoogleUser ? "Google" : "Email"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">{t("usernameLabel")}</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("saveChanges")}
                </Button>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{t("securityTitle")}</h2>
                  <p className="text-sm text-muted-foreground">{t("securityDesc")}</p>
                </div>

                {isGoogleUser ? (
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                    <div className="text-4xl">🔐</div>
                    <div>
                      <h3 className="font-semibold">{t("googleAuthTitle")}</h3>
                      <p className="text-sm text-muted-foreground">{t("googleAuthDesc")}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPw">{t("currentPwLabel")}</Label>
                      <Input
                        id="currentPw"
                        type="password"
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPw">{t("newPwLabel")}</Label>
                      <Input
                        id="newPw"
                        type="password"
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        className="bg-background/50"
                      />
                      <p className="text-xs text-muted-foreground">{t("newPwHint")}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPw">{t("confirmPwLabel")}</Label>
                      <Input
                        id="confirmPw"
                        type="password"
                        value={confirmPw}
                        onChange={(e) => setConfirmPw(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <Button onClick={handleChangePassword} disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t("changePwBtn")}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === "prefs" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{t("prefsTitle")}</h2>
                  <p className="text-sm text-muted-foreground">{t("prefsDesc")}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div>
                      <div className="font-medium">{t("soundLabel")}</div>
                      <div className="text-sm text-muted-foreground">{t("soundSub")}</div>
                    </div>
                    <Switch checked={soundEnabled} onCheckedChange={handleToggleSound} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div>
                      <div className="font-medium">{t("animLabel")}</div>
                      <div className="text-sm text-muted-foreground">{t("animSub")}</div>
                    </div>
                    <Switch checked={animEnabled} onCheckedChange={handleToggleAnim} />
                  </div>
                </div>
              </div>
            )}

            {/* ACCOUNT TAB */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{t("accountTitle")}</h2>
                  <p className="text-sm text-muted-foreground">{t("accountDesc")}</p>
                </div>

                <Button variant="secondary" onClick={handleLogout}>
                  🚪 {t("logoutBtn")}
                </Button>

                <div className="border border-destructive/30 rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-destructive">{t("dangerTitle")}</h3>
                  <p className="text-sm text-muted-foreground">{t("dangerDesc")}</p>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="deleteConfirm">{t("deleteConfirmLabel")}</Label>
                      <Input
                        id="deleteConfirm"
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        placeholder={user.displayName || user.email?.split("@")[0] || ""}
                        className="bg-background/50"
                      />
                    </div>
                    {!isGoogleUser && (
                      <div className="space-y-2">
                        <Label htmlFor="deletePw">{t("currentPwLabel")}</Label>
                        <Input
                          id="deletePw"
                          type="password"
                          value={deletePw}
                          onChange={(e) => setDeletePw(e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={saving || deleteConfirm !== (user.displayName || user.email?.split("@")[0] || "")}
                    >
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      🗑 {t("deleteAccountBtn")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
