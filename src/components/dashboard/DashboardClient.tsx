'use client';

import React, { useState } from "react";
import { 
    MessageSquare, 
    Calendar, 
    TrendingUp, 
    Layers, 
    ArrowUpRight, 
    MapPin, 
    Sparkles, 
    DollarSign,
    Monitor,
    Users,
    Plus,
    Compass,
    BookOpen,
    Trash2,
    Clock,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store/uiStore";
import ProjectGrid from "@/components/dashboard/ProjectGrid";

// Technical specs translation dictionary
const MATERIAL_LABELS: Record<string, string> = {
    'Alumetal Standard': 'ألوميتال قياسي',
    'Khashamium Premium': 'خشمونيوم بريميوم',
    'Acrylic Turkish/Spanish': 'أكريليك مستورد',
    'Solid Wood Premium': 'خشب طبيعي فاخر',
    'Local Granite': 'جرانيت محلي',
    'Premium Quartz': 'كوارتز بريميوم',
    'Imported Marble': 'رخام مستورد'
};

const MATERIAL_LABELS_EN: Record<string, string> = {
    'Alumetal Standard': 'Alumetal Standard',
    'Khashamium Premium': 'Khashamium Premium',
    'Acrylic Turkish/Spanish': 'Imported Acrylic',
    'Solid Wood Premium': 'Premium Solid Wood',
    'Local Granite': 'Local Granite',
    'Premium Quartz': 'Premium Quartz',
    'Imported Marble': 'Imported Marble'
};

interface Project {
  id: string;
  clientName: string;
  status: string;
  progress: number;
  updatedAt: any;
  kitchen?: {
    id: string;
    phone: string;
    address: string | null;
    totalPrice: number;
    layoutShape: string;
    kitchenRole: string;
    region: string;
    cabinetMaterial: string;
    countertopMaterial: string;
    hardwareTier: string;
  } | null;
}

interface DashboardClientProps {
  projects: Project[];
}

export default function DashboardClient({ projects }: DashboardClientProps) {
    const [viewMode, setViewMode] = useState<"b2c" | "b2b">("b2c");
    const { openModal, language } = useUIStore();
    const isAr = language === 'ar';

    // CRM statistics calculation
    const totalLeads = projects.length;
    const egyptProjects = projects.filter(p => p.kitchen?.region === 'Egypt');
    const gulfProjects = projects.filter(p => p.kitchen?.region === 'Gulf');

    const pipelineEgp = egyptProjects.reduce((acc, p) => acc + (p.kitchen?.totalPrice || 0), 0);
    const pipelineSar = gulfProjects.reduce((acc, p) => acc + (p.kitchen?.totalPrice || 0), 0);

    const activeLeads = projects.filter(p => p.status !== 'Completed').length;
    const completedSurveys = projects.filter(p => p.status === 'Completed').length;
    const surveyBookingRate = totalLeads > 0 ? Math.round((completedSurveys / totalLeads) * 100) : 0;

    // Upcoming mock site measurements
    const upcomingSurveys = [
        {
            id: 's-1',
            client: 'أحمد بن عبد العزيز',
            clientEn: 'Ahmad Bin Abdulaziz',
            addressAr: 'الرياض، حي الياسمين',
            addressEn: 'Riyadh, Al-Yasmin District',
            date: '22 June 2026',
            time: '11:00 AM',
            engineerAr: 'م. خالد عبد الرحمن',
            engineerEn: 'Eng. Khaled Abdulrahman',
            region: 'Gulf'
        },
        {
            id: 's-2',
            client: 'أ. كريم عبد الهادي',
            clientEn: 'Mr. Kareem Abdelhady',
            addressAr: 'الإسكندرية، سموحة',
            addressEn: 'Alexandria, Smouha',
            date: '24 June 2026',
            time: '04:30 PM',
            engineerAr: 'م. يوسف النجار',
            engineerEn: 'Eng. Youssef El-Najjar',
            region: 'Egypt'
        }
    ];

    return (
        <div 
            className="space-y-8 max-w-[1600px] mx-auto text-right" 
            dir={isAr ? "rtl" : "ltr"}
        >
            {/* Header with Mode Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
                <div className={cn("space-y-1", isAr ? "text-right" : "text-left")}>
                    <span className="text-[10px] tracking-widest text-primary uppercase font-black font-mono">
                        {isAr
                            ? (viewMode === "b2c" ? "بوابة العميل B2C" : "بوابة المبيعات B2B")
                            : (viewMode === "b2c" ? "B2C Consumer Hub" : "Showroom Operations Center")
                        }
                    </span>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-1">
                        {isAr 
                            ? (viewMode === "b2c" ? "بوابة التصميم والتقدير الذكي من iKitchen" : "لوحة تحكم مبيعات المعارض (Showroom CRM)") 
                            : (viewMode === "b2c" ? "iKitchen Smart Design Portal" : "CRM Showroom Sales Dashboard")
                        }
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isAr
                            ? (viewMode === "b2c"
                                ? "خطط لمطبخك الفخم، احصل على تقدير أسعار فوري، وتواصل مباشرة معنا لرفع المقاسات مجاناً."
                                : "إدارة طلبات المعاينة مجانية، خطوط مبيعات B2C/B2B وكتالوج الخامات والأسعار.")
                            : (viewMode === "b2c"
                                ? "Configure your luxury kitchen, get instant estimations, and coordinate with us directly for free site measurements."
                                : "Manage free site surveys requests, B2C/B2B client pipelines, material pricing, and regional showroom sales.")
                        }
                    </p>
                </div>

                {/* View Mode Toggle Switch */}
                <div className="flex bg-card border border-border p-1 rounded-xl shrink-0 w-fit self-start md:self-auto">
                    <button
                        onClick={() => setViewMode("b2c")}
                        className={cn(
                            "px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                            viewMode === "b2c" 
                                ? "bg-primary text-primary-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                    >
                        <Monitor size={14} />
                        <span>{isAr ? "بوابة العميل B2C" : "Consumer View"}</span>
                    </button>
                    <button
                        onClick={() => setViewMode("b2b")}
                        className={cn(
                            "px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                            viewMode === "b2b" 
                                ? "bg-primary text-primary-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                    >
                        <Users size={14} />
                        <span>{isAr ? "إدارة المعرض B2B" : "Showroom CRM"}</span>
                    </button>
                </div>
            </div>

            {/* Render dynamic screens based on active toggle */}
            {viewMode === "b2c" ? (
                /* B2C Consumer portal screen */
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Massive Action Card (Span 2) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Blueprint Quick Start Card */}
                            <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-8 flex flex-col justify-between min-h-[220px] transition-all hover:border-primary/30">
                                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl bg-primary/10 group-hover:bg-primary/20 transition-all pointer-events-none" />
                                
                                <div className={cn("space-y-2 relative z-10", isAr ? "text-right" : "text-left")}>
                                    <div className="p-2 bg-primary/10 text-primary w-fit rounded-lg mb-2">
                                        <Compass size={24} className="animate-pulse" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">
                                        {isAr ? "صمم مطبخ أحلامك في 3 خطوات بسيطة" : "Configure Your Dream Kitchen in 3 Easy Steps"}
                                    </h3>
                                    <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                                        {isAr
                                            ? "نظام تهيئة تفاعلي بالكامل مصمم ليتناسب مع الطبيعة المعمارية للشقق المصرية والفلل الخليجية. حدد نوع الاستخدام (شو / مطبخ قلي)، اختر الستايل والخرسانة، وسيقوم نظامنا الذكي بحساب مقايسة الأسعار التقريبية فوراً وإعداد رسالة تفصيلية لتأكيد رفع المقاسات الفعلي مجاناً."
                                            : "A fully guided configuration system optimized for Egyptian apartments and Gulf villas. Specify your kitchen role (Show vs. Service), select design styles, and let our smart engine calculate instant price ranges and write a structured WhatsApp request to schedule a free site survey."
                                        }
                                    </p>
                                </div>
                                
                                <button
                                    onClick={openModal}
                                    className="mt-6 flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-xs w-fit cursor-pointer hover:shadow-lg hover:shadow-primary/15 hover:-translate-y-0.5 active:scale-[0.98] transition-all relative z-10"
                                >
                                    <Plus size={16} />
                                    <span>{isAr ? "ابدأ تصميم مطبخك الآن" : "Configure New Kitchen"}</span>
                                </button>
                            </div>

                            {/* Saved designs summary grid */}
                            <div className="kitchen-card bg-card/55 backdrop-blur-md overflow-hidden p-6 space-y-6">
                                <div className={isAr ? "text-right" : "text-left"}>
                                    <h3 className="font-extrabold text-base text-foreground flex items-center gap-2 justify-start">
                                        <Layers size={18} className="text-primary" />
                                        <span>{isAr ? "تصاميمك المحفوظة ومسوداتك" : "Your Saved Designs & Quotes"}</span>
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {isAr 
                                            ? "افتح أي تصميم لمتابعة تفاصيل المقايسة والمواد ومراجعة عروض الأسعار." 
                                            : "Open any design project to edit parameters, inspect dimensions, and update budget configurations."
                                        }
                                    </p>
                                </div>
                                <ProjectGrid projects={projects} showSearch={false} limit={4} />
                            </div>
                        </div>

                        {/* Right Sidebar: Guide & Features Card */}
                        <div className="space-y-6">
                            {/* Detailed Steps Guidelines Card */}
                            <div className="kitchen-card bg-card/55 backdrop-blur-md p-6 text-right">
                                <h3 className="kitchen-card-header justify-start text-xs font-bold text-foreground mb-4">
                                    <BookOpen size={15} className="text-primary" />
                                    <span>{isAr ? "كيف تسير رحلتك معنا؟" : "How It Works"}</span>
                                </h3>
                                <div className="space-y-5 pt-1">
                                    <div className="flex gap-3 justify-start items-start text-right">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                            ١
                                        </div>
                                        <div className={isAr ? "text-right" : "text-left"}>
                                            <h4 className="text-xs font-bold text-foreground">{isAr ? "نوع المطبخ والوظيفة" : "Kitchen Type & Use"}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                                {isAr ? "حدد هل هو مطبخ شو (تحضيري مفتوح) أم مطبخ خدمة (شاق ومغلق)" : "Choose a dry aesthetic show kitchen vs. a heavy-duty closed service wet kitchen."}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 justify-start items-start text-right">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                            ٢
                                        </div>
                                        <div className={isAr ? "text-right" : "text-left"}>
                                            <h4 className="text-xs font-bold text-foreground">{isAr ? "اختيار الستايل والخامات" : "Design & Cabinet Materials"}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                                {isAr ? "تصفح لوحة تصاميم الأكريليك والجرانيت المحلي والكوارتز الفخم" : "Select modern gloss acrylic, rust-proof alumetal, local granite, or quartz."}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 justify-start items-start text-right">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                            ٣
                                        </div>
                                        <div className={isAr ? "text-right" : "text-left"}>
                                            <h4 className="text-xs font-bold text-foreground">{isAr ? "المقاسات وتقدير السعر" : "Runs & Instant Quote Range"}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                                {isAr ? "ادخل أبعاد الحوائط تقريبياً لتحصل على تقدير التكلفة الفورية" : "Enter approximate wall run dimensions to display transparent linear rates."}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 justify-start items-start text-right">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                            ٤
                                        </div>
                                        <div className={isAr ? "text-right" : "text-left"}>
                                            <h4 className="text-xs font-bold text-foreground">{isAr ? "تأكيد واتساب ورفع المقاسات" : "WhatsApp Survey Booking"}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                                {isAr ? "تواصل معنا بتاب واحدة لتأكيد موعد مهندس المعاينة مجاناً تماماً" : "Send your config to our line and request a free on-site physical check."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust banner */}
                            <div className="kitchen-card bg-emerald-500/5 border-emerald-500/10 p-6 relative overflow-hidden text-right">
                                <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 border-b border-emerald-500/10 pb-2 justify-start">
                                    <CheckCircle2 size={14} />
                                    <span>{isAr ? "الضمان والخدمة الممتازة" : "10-Year Cabinet Warranty"}</span>
                                </h3>
                                <p className={cn("text-[11px] leading-relaxed text-foreground/80 pt-2 font-medium", isAr ? "text-right" : "text-left")}>
                                    {isAr
                                        ? "جميع مطابخ iKitchen مصنعة من أجود قطاعات الألومنيوم والخامات التركية والإسبانية المقاومة للمياه والآفات تماماً، مع ضمان حقيقي يصل إلى 10 سنوات على مفصلات وإكسسوارات بلوم وهيتش الألمانية الأصلية."
                                        : "All iKitchen components are fabricated with first-grade rust/insect-proof aluminum frameworks or imported gloss panels, accompanied by a 10-year warranty on original Blum or Hettich German soft-close fittings."
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* B2B CRM Operations Hub screen */
                <div className="space-y-8 animate-in fade-in duration-300">
                    {/* CRM Statistics row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Pipeline Egypt */}
                        <div className="group relative overflow-hidden rounded-2xl p-5 bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-emerald-500/10 group-hover:opacity-30 transition-opacity" />
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                                    {isAr ? "قيمة مبيعات مصر (EGP)" : "Egypt Pipeline (EGP)"}
                                </span>
                                <div className="p-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg text-xs"><DollarSign size={14} /></div>
                            </div>
                            <div className="flex items-baseline gap-1.5 justify-start">
                                <span className="text-2xl font-black text-foreground font-mono">{pipelineEgp.toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground font-bold">{isAr ? "جنيه" : "EGP"}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2">
                                {isAr ? "مجموع مقايسات B2C/B2B النشطة بمصر" : "Sum of active B2C/B2B deals in Egypt"}
                            </p>
                        </div>

                        {/* Pipeline Gulf */}
                        <div className="group relative overflow-hidden rounded-2xl p-5 bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-blue-500/10 group-hover:opacity-30 transition-opacity" />
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                                    {isAr ? "قيمة مبيعات الخليج (SAR)" : "Gulf Pipeline (SAR)"}
                                </span>
                                <div className="p-1.5 bg-blue-500/10 text-blue-600 rounded-lg text-xs"><DollarSign size={14} /></div>
                            </div>
                            <div className="flex items-baseline gap-1.5 justify-start">
                                <span className="text-2xl font-black text-foreground font-mono">{pipelineSar.toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground font-bold">{isAr ? "ريال" : "SAR"}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2">
                                {isAr ? "المملكة العربية السعودية والإمارات" : "KSA and UAE regional showroom pipelines"}
                            </p>
                        </div>

                        {/* Active Leads */}
                        <div className="group relative overflow-hidden rounded-2xl p-5 bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-amber-500/10 group-hover:opacity-30 transition-opacity" />
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                                    {isAr ? "الطلبات النشطة (Active leads)" : "Active Lead Pool"}
                                </span>
                                <div className="p-1.5 bg-amber-500/10 text-amber-600 rounded-lg text-xs"><Layers size={14} /></div>
                            </div>
                            <div className="flex items-baseline gap-1.5 justify-start">
                                <span className="text-2xl font-black text-foreground font-mono">{activeLeads}</span>
                                <span className="text-xs text-muted-foreground font-bold">{isAr ? "عملاء" : "Clients"}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2">
                                {isAr ? "طلبات قيد مراجعة عروض الأسعار" : "Designs undergoing pricing review"}
                            </p>
                        </div>

                        {/* Survey Conversion Rate */}
                        <div className="group relative overflow-hidden rounded-2xl p-5 bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl bg-violet-500/10 group-hover:opacity-30 transition-opacity" />
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                                    {isAr ? "معدل تحويل المعاينات" : "Audit Conversion Rate"}
                                </span>
                                <div className="p-1.5 bg-violet-500/10 text-violet-600 rounded-lg text-xs"><TrendingUp size={14} /></div>
                            </div>
                            <div className="flex items-baseline gap-1.5 justify-start">
                                <span className="text-2xl font-black text-foreground font-mono">%{surveyBookingRate}</span>
                                <span className="text-xs text-muted-foreground font-bold">{isAr ? "تحويل" : "Ratio"}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2">
                                {isAr ? "نسبة نجاح حجز رفع المقاسات الفعلي" : "Percentage converting to site survey appointments"}
                            </p>
                        </div>
                    </div>

                    {/* Split CRM Dashboard sections */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* 1. Leads Table Panel (Span 2) */}
                        <div className="xl:col-span-2 space-y-6">
                            <div className="kitchen-card !p-0 overflow-hidden bg-card/55 backdrop-blur-md">
                                <div className={cn("p-5 border-b border-border bg-muted/10 flex justify-between items-center", isAr ? "flex-row" : "flex-row-reverse")}>
                                    <div className={isAr ? "text-right" : "text-left"}>
                                        <h3 className="font-extrabold text-base text-foreground">
                                            {isAr ? "سجل المقايسات وعقود العملاء (CRM Live Stream)" : "Sales Pipeline & Quotation Registry (CRM)"}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                                            {isAr 
                                                ? "اضغط على العميل لعرض تعديلات التصميم أو فتح المحادثة على واتساب." 
                                                : "Click any deal row to launch the configuration editor or chat with leads on WhatsApp."
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* CRM Leads Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs text-right border-collapse" dir={isAr ? "rtl" : "ltr"}>
                                        <thead>
                                            <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground uppercase text-[10px] font-bold">
                                                <th className={cn("p-4", isAr ? "text-right" : "text-left")}>{isAr ? "العميل والموقع" : "Client & Info"}</th>
                                                <th className={cn("p-4", isAr ? "text-right" : "text-left")}>{isAr ? "خطة التصميم والتخطيط" : "Layout & Materials Plan"}</th>
                                                <th className={cn("p-4", isAr ? "text-right" : "text-left")}>{isAr ? "عرض السعر المقدر" : "Estimated Value"}</th>
                                                <th className="p-4 text-center">{isAr ? "المرحلة" : "Pipeline Stage"}</th>
                                                <th className={cn("p-4", isAr ? "text-left" : "text-right")}>{isAr ? "الإجراءات والسجل" : "Actions"}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                             {projects.map((project) => {
                                                const k = project.kitchen;
                                                const regionFlag = k?.region === 'Gulf' ? '🇸🇦' : '🇪🇬';
                                                const currency = k?.region === 'Gulf' 
                                                    ? (isAr ? 'ريال' : 'SAR') 
                                                    : (isAr ? 'جنيه' : 'EGP');
                                                
                                                const shapeLabel = k?.layoutShape === 'L' 
                                                    ? (isAr ? 'حرف L' : 'L-Shape') 
                                                    : k?.layoutShape === 'U' 
                                                        ? (isAr ? 'حرف U' : 'U-Shape') 
                                                        : (isAr ? 'مستقيم I' : 'Straight-I');

                                                const cabinetText = isAr 
                                                    ? (MATERIAL_LABELS[k?.cabinetMaterial || ''] || k?.cabinetMaterial || '—')
                                                    : (MATERIAL_LABELS_EN[k?.cabinetMaterial || ''] || k?.cabinetMaterial || '—');
                                                const countertopText = isAr 
                                                    ? (MATERIAL_LABELS[k?.countertopMaterial || ''] || k?.countertopMaterial || '—')
                                                    : (MATERIAL_LABELS_EN[k?.countertopMaterial || ''] || k?.countertopMaterial || '—');

                                                const cleanPhone = k?.phone.replace(/[+\s-]/g, '') || '';
                                                const msg = isAr 
                                                    ? `السلام عليكم أ. ${project.clientName}، معك مهندس التصميم من معرض iKitchen. نقوم الآن بمراجعة تخطيط مطبخكم الـ ${shapeLabel} بخامة ${cabinetText}. هل تود تأكيد موعد المعاينة الفنية المجانية لرفع المقاسات؟`
                                                    : `Hello ${project.clientName}, this is the design engineer from iKitchen. We are auditing your ${shapeLabel} config utilizing ${cabinetText} cabinets. Would you like to confirm the date for your free site survey?`;
                                                const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

                                                return (
                                                    <tr key={project.id} className="border-b border-border/40 hover:bg-muted/25 transition-colors group/row">
                                                        {/* Client Info */}
                                                        <td className="p-4">
                                                            <div className={cn("font-extrabold text-foreground flex items-center gap-1.5", isAr ? "justify-start" : "justify-start flex-row-reverse")}>
                                                                <span>{regionFlag}</span>
                                                                <span>{project.clientName}</span>
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground block font-mono mt-0.5">{k?.phone || "—"}</span>
                                                            {k?.address && (
                                                                <span className={cn("text-[9px] text-muted-foreground/80 flex items-center gap-1 mt-1", isAr ? "justify-start" : "justify-start flex-row-reverse")}>
                                                                    <MapPin size={9} />
                                                                    {k.address}
                                                                </span>
                                                            )}
                                                        </td>
                                                        {/* Layout Config specs summary */}
                                                        <td className="p-4">
                                                            <div className="font-bold text-foreground">
                                                                {shapeLabel} ({k?.kitchenRole === 'show' ? (isAr ? 'مطبخ شو' : 'Show') : k?.kitchenRole === 'wet' ? (isAr ? 'خدمة قلي' : 'Wet') : (isAr ? 'عائلي قياسي' : 'Standard')})
                                                            </div>
                                                            <div className={cn("text-[10px] text-muted-foreground mt-1 flex items-center gap-1", isAr ? "justify-start" : "justify-start")}>
                                                                <span>{isAr ? "العلب" : "Doors"}: {cabinetText}</span>
                                                                <span className="text-border/80">|</span>
                                                                <span>{isAr ? "الرخام" : "Top"}: {countertopText}</span>
                                                            </div>
                                                        </td>
                                                        {/* Price Estimation */}
                                                        <td className="p-4 font-mono font-bold text-foreground">
                                                            {k?.totalPrice ? (
                                                                <div className="flex items-baseline gap-1">
                                                                    <span>{k.totalPrice.toLocaleString()}</span>
                                                                    <span className="text-[10px] text-muted-foreground font-sans font-medium">{currency}</span>
                                                                </div>
                                                            ) : "—"}
                                                        </td>
                                                        {/* CRM Status badges */}
                                                        <td className="p-4 text-center">
                                                            <span className={cn(
                                                                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border",
                                                                project.status === 'Completed' && "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800/40",
                                                                project.status === 'Designing' && "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800/40",
                                                                project.status === 'Draft' && "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800/40",
                                                            )}>
                                                                <span className={cn(
                                                                    "w-1 h-1 rounded-full",
                                                                    project.status === 'Completed' && "bg-emerald-500",
                                                                    project.status === 'Designing' && "bg-blue-500",
                                                                    project.status === 'Draft' && "bg-amber-500",
                                                                )} />
                                                                {project.status === 'Completed' 
                                                                    ? (isAr ? 'تمت المعاينة' : 'Survey Done') 
                                                                    : project.status === 'Designing' 
                                                                        ? (isAr ? 'قيد التصميم' : 'Designing') 
                                                                        : (isAr ? 'مسودة' : 'Draft')
                                                                }
                                                            </span>
                                                        </td>
                                                        {/* Action panel triggers */}
                                                        <td className="p-4">
                                                            <div className={cn("flex items-center gap-2", isAr ? "justify-end" : "justify-start")}>
                                                                {/* WhatsApp Trigger */}
                                                                {k?.phone && (
                                                                    <a 
                                                                        href={whatsappUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="p-1.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center animate-pulse"
                                                                        title={isAr ? "تواصل واتساب" : "Chat on WhatsApp"}
                                                                    >
                                                                        <MessageSquare size={13} />
                                                                    </a>
                                                                )}
                                                                {/* Open Configurator */}
                                                                <Link 
                                                                    href={`/editor/${project.id}`}
                                                                    className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                                                                    title={isAr ? "فتح محرر المطبخ" : "Launch Configurator"}
                                                                >
                                                                    <ArrowUpRight size={13} />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                             })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* 2. Site Survey Coordinator & AI Assistant Widgets */}
                        <div className="space-y-6">
                            {/* Free Site Audits visits */}
                            <div className="kitchen-card bg-card/55 backdrop-blur-md text-right">
                                <h3 className="kitchen-card-header justify-start">
                                    <Calendar size={14} className="text-primary" />
                                    <span>{isAr ? "جدول زيارات رفع المقاسات (Upcoming)" : "Upcoming Surveys Calendar"}</span>
                                </h3>
                                
                                <div className="space-y-3 pt-2">
                                    {upcomingSurveys.map((survey) => (
                                        <div key={survey.id} className="p-3 bg-muted/30 border border-border rounded-xl space-y-2 text-right" dir={isAr ? "rtl" : "ltr"}>
                                            <div className="flex justify-between items-start gap-2">
                                                <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black font-mono">
                                                    {survey.region === 'Gulf' 
                                                        ? (isAr ? '🇸🇦 الرياض' : '🇸🇦 Riyadh') 
                                                        : (isAr ? '🇪🇬 الإسكندرية' : '🇪🇬 Alexandria')
                                                    }
                                                </span>
                                                <h4 className="font-bold text-xs text-foreground">{isAr ? survey.client : survey.clientEn}</h4>
                                            </div>
                                            <p className={cn("text-[10px] text-muted-foreground flex items-center gap-1", isAr ? "justify-end" : "justify-start")}>
                                                <span>{isAr ? survey.addressAr : survey.addressEn}</span>
                                                <MapPin size={10} className="text-primary shrink-0" />
                                            </p>
                                            <div className="pt-2 border-t border-border flex justify-between items-center text-[9px] text-muted-foreground">
                                                <span className="font-bold text-foreground/80">{isAr ? survey.engineerAr : survey.engineerEn}</span>
                                                <span className="font-mono">{survey.date} • {survey.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* AI Design Guide Advisor */}
                            <div className="kitchen-card bg-primary/5 border border-primary/20 relative overflow-hidden text-right">
                                <h3 className="text-xs font-bold text-primary flex items-center gap-1.5 border-b border-primary/10 pb-2 justify-start">
                                    <Sparkles size={13} className="text-primary animate-pulse" />
                                    <span>{isAr ? "نصائح مهندس الديكور الذكي (AI Guide)" : "AI Architect Guidelines"}</span>
                                </h3>
                                <div className={cn("text-[11px] leading-relaxed space-y-2 pt-2 text-foreground/90 font-medium", isAr ? "text-right" : "text-left")} dir={isAr ? "rtl" : "ltr"}>
                                    {isAr ? (
                                        <>
                                            <p>💡 <b>مطبخ الخدمة (Wet Kitchen):</b> يفضل اعتماد أجهزة شفط دهون عالية التدفق (لا تقل عن 800 CFM) مع خامات ألوميتال أو خشمونيوم لسهولة الغسيل ومقاومة الحشرات والرطوبة العالية.</p>
                                            <p>🍽️ <b>مطبخ شو (Show Kitchen):</b> احرص على مسافة خلوص لا تقل عن 120سم حول الجزيرة الوسطية (Island) وتوزيع الإضاءة الدافئة المخفية لإبراز عروق أسطح الكوارتز أو الرخام.</p>
                                        </>
                                    ) : (
                                        <>
                                            <p>💡 <b>Wet Kitchen:</b> Prefer mounting heavy-duty hoods (minimum 800 CFM) accompanied by insect-proof Alumetal/Khashamium structures to withstand frying oils and high moisture.</p>
                                            <p>🍽️ <b>Show Kitchen:</b> Maintain a minimum clearance of 120cm around islands, and use indirect ambient warm lighting to highlight premium Quartz/Marble grains.</p>
                                        </>
                                    )}
                                </div>
                                <div className="absolute right-0 bottom-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
