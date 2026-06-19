"use client";

import React from "react";
import { Settings, User, Cpu, Database, Save, RotateCcw, Moon, Sun, Bell, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store/uiStore";

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full cursor-pointer"
    >
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
    </Button>
  );
}

export default function SettingsPage() {
  const { language } = useUIStore();
  const isAr = language === 'ar';

  return (
    <div 
        className="max-w-[1600px] mx-auto space-y-8" 
        dir={isAr ? "rtl" : "ltr"}
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
        <div className={cn("space-y-1", isAr ? "text-right" : "text-left")}>
          <div className={cn("flex items-center gap-3", isAr ? "justify-start" : "justify-start")}>
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm">
              <Settings size={28} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              {isAr ? "إعدادات النظام والتهيئة (Settings)" : "System Settings"}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mt-1">
            {isAr
                ? "إدارة تفضيلات حساب المعرض، تهيئة أسعار الخامات، ومتابعة حالة اتصال خوادم iKitchen."
                : "Manage account preferences, configure materials price calculations, and audit system status."
            }
          </p>
        </div>
        <div className="flex gap-3 justify-start">
            <Button variant="outline" className="gap-2 cursor-pointer text-xs">
                <RotateCcw size={14} />
                {isAr ? "إعادة تعيين" : "Reset"}
            </Button>
            <Button className="gap-2 cursor-pointer text-xs">
                <Save size={14} />
                {isAr ? "حفظ التغييرات" : "Save Changes"}
            </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Navigation/Summary */}
        <div className="space-y-6">
            <div className="kitchen-card bg-card/55 backdrop-blur-md p-6">
                <div className={cn("flex items-center gap-4 mb-6 justify-start", isAr ? "text-right" : "text-left")}>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        IK
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">
                            {isAr ? "مدير المعرض" : "Showroom Manager"}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono">admin@ikitchen.com</p>
                    </div>
                </div>
                <div className="space-y-1 text-right">
                    <button className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-bold text-xs cursor-pointer", isAr ? "text-right" : "text-left")}>
                        <User size={15} /> 
                        <span>{isAr ? "الملف الشخصي للمستخدم" : "User Profile Settings"}</span>
                    </button>
                    <button className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-bold text-xs transition-colors cursor-pointer", isAr ? "text-right" : "text-left")}>
                        <Cpu size={15} /> 
                        <span>{isAr ? "تهيئة النظام والأسعار" : "Material Pricing Index"}</span>
                    </button>
                    <button className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-bold text-xs transition-colors cursor-pointer", isAr ? "text-right" : "text-left")}>
                        <Bell size={15} /> 
                        <span>{isAr ? "إعدادات التنبيهات" : "Notification Preferences"}</span>
                    </button>
                    <button className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-bold text-xs transition-colors cursor-pointer", isAr ? "text-right" : "text-left")}>
                        <Shield size={15} /> 
                        <span>{isAr ? "صلاحيات الأمان والخصوصية" : "Security & Roles"}</span>
                    </button>
                </div>
            </div>

            <div className={cn("bg-blue-500/5 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-800/40 rounded-2xl p-6", isAr ? "text-right" : "text-left")}>
                <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2 justify-start text-xs">
                    <Database size={15} />
                    <span>{isAr ? "حالة اتصال النظام (System Status)" : "System Logs & Connection"}</span>
                </h4>
                <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{isAr ? "قاعدة البيانات" : "Database Server"}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {isAr ? "متصل (أوفلاين نشط)" : "Offline (Fast Cache Active)"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{isAr ? "سرعة الاستجابة" : "Server Latency"}</span>
                        <span className="text-foreground font-bold font-mono">1.2ms (Mock Mode)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{isAr ? "سعة التخزين المحلي" : "Browser Storage"}</span>
                        <span className="text-foreground font-bold font-mono">2.4MB / 10MB</span>
                    </div>
                    <div className="w-full bg-blue-100 dark:bg-blue-950 h-1.5 rounded-full overflow-hidden mt-3">
                        <div className="bg-blue-500 h-full w-[24%]" />
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
            {/* Profile Section */}
            <section className="kitchen-card bg-card/55 backdrop-blur-md p-6 md:p-8">
                <div className={cn("flex items-center gap-3 mb-6 pb-6 border-b border-border/60 justify-start", isAr ? "text-right" : "text-left")}>
                    <div className="p-2 bg-muted rounded-lg text-primary">
                        <User size={20} />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-foreground">
                            {isAr ? "بيانات الحساب الشخصي" : "Profile Details"}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {isAr ? "تحديث المعلومات الشخصية لمدير النظام بالمعرض" : "Update display configurations and contact emails."}
                        </p>
                    </div>
                </div>

                <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", isAr ? "text-right" : "text-left")}>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground">{isAr ? "الاسم المعروض" : "Display Name"}</label>
                        <input
                            type="text"
                            defaultValue={isAr ? "مدير المعرض" : "Showroom Manager"}
                            className={cn("w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:border-primary", isAr ? "text-right" : "text-left")}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground">{isAr ? "البريد الإلكتروني" : "Email Address"}</label>
                        <input
                            type="email"
                            defaultValue="admin@ikitchen.com"
                            className={cn("w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:border-primary font-mono", isAr ? "text-right" : "text-left")}
                        />
                    </div>
                    <div className="col-span-full space-y-2">
                        <label className="text-xs font-bold text-muted-foreground">{isAr ? "ملاحظات إضافية عن المعرض" : "Quotation Invoice Notes"}</label>
                        <textarea
                            rows={3}
                            className={cn("w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs focus:outline-none focus:border-primary resize-none", isAr ? "text-right" : "text-left")}
                            placeholder={isAr ? "اكتب تفاصيل إضافية أو مواصفات العناوين الرئيسية للفواتير هنا..." : "Input extra details or showroom footer notes..."}
                        />
                    </div>
                </div>
            </section>

            {/* Preferences Section */}
            <section className="kitchen-card bg-card/55 backdrop-blur-md p-6 md:p-8">
                <div className={cn("flex items-center gap-3 mb-6 pb-6 border-b border-border/60 justify-start", isAr ? "text-right" : "text-left")}>
                    <div className="p-2 bg-muted rounded-lg text-primary">
                        <Cpu size={20} />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-foreground">
                            {isAr ? "تفضيلات واجهة المستخدم" : "System Workspace Preferences"}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {isAr ? "تخصيص تجربة التصفح والمظهر والتنبيهات" : "Customize appearance themes, notifications, and backups."}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={cn("flex items-center justify-between gap-4", isAr ? "flex-row" : "flex-row-reverse")}>
                        <div className={isAr ? "text-right" : "text-left"}>
                            <p className="text-xs font-bold text-foreground">{isAr ? "المظهر العام (Appearance)" : "Appearance Theme"}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                {isAr ? "التبديل الفوري بين المظهر الداكن والمظهر المضيء" : "Toggle interface between dark mode and light mode"}
                            </p>
                        </div>
                        <ThemeToggleButton />
                    </div>
                    
                    <div className={cn("flex items-center justify-between gap-4", isAr ? "flex-row" : "flex-row-reverse")}>
                        <div className={isAr ? "text-right" : "text-left"}>
                            <p className="text-xs font-bold text-foreground">{isAr ? "المزامنة التلقائية والنسخ الاحتياطي" : "Real-time Backups"}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                {isAr ? "حفظ وتحديث بيانات التصاميم والمسودات تلقائياً أثناء التعديل" : "Automatically save configuration parameters and drafts in background"}
                            </p>
                        </div>
                        <div className={cn("w-10 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer bg-primary", isAr ? "justify-start" : "justify-end")}>
                            <div className="h-5 w-5 bg-background rounded-full shadow-md" />
                        </div>
                    </div>

                    <div className={cn("flex items-center justify-between gap-4", isAr ? "flex-row" : "flex-row-reverse")}>
                        <div className={isAr ? "text-right" : "text-left"}>
                            <p className="text-xs font-bold text-foreground">{isAr ? "إشعارات سطح المكتب (Alerts)" : "Desktop Notifications"}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                {isAr ? "إرسال تنبيهات فورية عند قيام عميل بطلب معاينة فنية مجانية" : "Receive instant dashboard alerts when customer books site survey"}
                            </p>
                        </div>
                        <div className={cn("w-10 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer bg-muted", isAr ? "justify-end" : "justify-start")}>
                            <div className="h-5 w-5 bg-background rounded-full shadow-md" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
}
