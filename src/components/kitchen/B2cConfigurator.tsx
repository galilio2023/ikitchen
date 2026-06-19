'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { useUIStore } from '@/lib/store/uiStore';
import { updateKitchen } from '@/actions/projectActions';
import { generateAiLayout } from '@/actions/aiActions';
import { 
    Sparkles, 
    ArrowRight, 
    ArrowLeft, 
    MessageSquare, 
    Calendar, 
    Check, 
    Ruler, 
    Users, 
    Share2, 
    Home, 
    Info, 
    Globe 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Types & Configs
interface StyleCard {
    id: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    materialAr: string;
    materialEn: string;
    materialKey: string;
    countertopKey: string;
    priceTier: number;
    imageUrl: string;
}

const SHOW_STYLES: StyleCard[] = [
    {
        id: 'modern_minimal',
        titleAr: 'مودرن مينيمال',
        titleEn: 'Modern Minimal',
        descAr: 'تصميم عصري بسيط بألوان مطفية مسطحة وإضاءة خفية دافئة.',
        descEn: 'Sleek modern styling with flat matte surfaces and integrated lighting.',
        materialAr: 'أكريليك تركي مستورد / هاي جلوس',
        materialEn: 'Imported Acrylic Gloss',
        materialKey: 'Acrylic Turkish/Spanish',
        countertopKey: 'Premium Quartz',
        priceTier: 3,
        imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'classic_heritage',
        titleAr: 'كلاسيك فاخر',
        titleEn: 'Classic Heritage',
        descAr: 'فخامة كلاسيكية غنية مع مقابض عتيقة وتفاصيل خشبية عريقة.',
        descEn: 'Rich traditional cabinetry with vintage handles and profiling.',
        materialAr: 'خشب طبيعي ممتاز (أرو / زان)',
        materialEn: 'Solid Wood Premium (Oak/Beech)',
        materialKey: 'Solid Wood Premium',
        countertopKey: 'Imported Marble',
        priceTier: 4,
        imageUrl: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'industrial_bold',
        titleAr: 'إندستريال جريء',
        titleEn: 'Industrial Bold',
        descAr: 'طابع جريء يمزج بين الخامات المعدنية وتدرجات الألوان الداكنة.',
        descEn: 'Industrial aesthetic blending dark structural elements and metals.',
        materialAr: 'خشمونيوم ممتاز مطفي',
        materialEn: 'Premium Matte Khashamium',
        materialKey: 'Khashamium Premium',
        countertopKey: 'Local Granite',
        priceTier: 2,
        imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'coastal_light',
        titleAr: 'كوستال هادئ',
        titleEn: 'Coastal Light',
        descAr: 'درجات بحرية هادئة تعطي شعوراً بالاتساع والراحة العضوية.',
        descEn: 'Fresh oceanic hues creating airy, sunlit spatial sensations.',
        materialAr: 'أكريليك لامع ناصع',
        materialEn: 'Glossy White Acrylic',
        materialKey: 'Acrylic Turkish/Spanish',
        countertopKey: 'Premium Quartz',
        priceTier: 3,
        imageUrl: 'https://images.unsplash.com/photo-1556909212-d5b604d7c9f2?auto=format&fit=crop&w=600&q=80'
    }
];

const SERVICE_STYLES: StyleCard[] = [
    {
        id: 'standard_alumetal',
        titleAr: 'ألوميتال عملي',
        titleEn: 'Standard Alumetal',
        descAr: 'مقاومة تامة للدهون، الرطوبة، والحشرات. عملي وسهل الغسيل.',
        descEn: 'Full resistance to moisture, pests, and daily heavy cooking wear.',
        materialAr: 'ألوميتال قياسي متين',
        materialEn: 'Standard Heavy-Duty Alumetal',
        materialKey: 'Alumetal Standard',
        countertopKey: 'Local Granite',
        priceTier: 1,
        imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'modern_khashamium',
        titleAr: 'خشمونيوم عصري',
        titleEn: 'Modern Khashamium',
        descAr: 'يجمع بين متانة الألوميتال وجمال ونقوش الخشب الدافئة.',
        descEn: 'Combines full aluminum durability with authentic wood grain finishes.',
        materialAr: 'خشمونيوم بريميوم',
        materialEn: 'Premium Khashamium Box',
        materialKey: 'Khashamium Premium',
        countertopKey: 'Local Granite',
        priceTier: 2,
        imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'heavy_duty_acrylic',
        titleAr: 'أكريليك متين للخدمة',
        titleEn: 'Heavy Duty Acrylic',
        descAr: 'مظهر لامع فاخر ومضاد للخدوش والحرارة مع هيكل داخلي مدعم.',
        descEn: 'Scratch-resistant gloss panels with highly reinforced internal structures.',
        materialAr: 'أكريليك تركي مدعم',
        materialEn: 'Imported Reinforced Acrylic',
        materialKey: 'Acrylic Turkish/Spanish',
        countertopKey: 'Premium Quartz',
        priceTier: 3,
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'solid_wood_service',
        titleAr: 'خشب كلاسيكي معالج',
        titleEn: 'Sealed Traditional Wood',
        descAr: 'أناقة الخشب الكلاسيكي الطبيعي مع دهانات عازلة للرطوبة والحرارة.',
        descEn: 'Warm traditional solid wood cabinet panels.',
        materialAr: 'خشب طبيعي معالج بالكامل',
        materialEn: 'Fully Treated Solid Wood',
        materialKey: 'Solid Wood Premium',
        countertopKey: 'Imported Marble',
        priceTier: 4,
        imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80'
    }
];

const RATES = {
    Egypt: {
        currency: 'جنيه',
        cabinet: {
            'Alumetal Standard': 4500,
            'Khashamium Premium': 6500,
            'Acrylic Turkish/Spanish': 8000,
            'Solid Wood Premium': 12000
        } as Record<string, number>,
        countertop: {
            'Local Granite': 2000,
            'Premium Quartz': 6000,
            'Imported Marble': 8000
        } as Record<string, number>
    },
    Gulf: {
        currency: 'ريال',
        cabinet: {
            'Alumetal Standard': 1200,
            'Khashamium Premium': 1800,
            'Acrylic Turkish/Spanish': 2200,
            'Solid Wood Premium': 3200
        } as Record<string, number>,
        countertop: {
            'Local Granite': 500,
            'Premium Quartz': 1500,
            'Imported Marble': 2000
        } as Record<string, number>
    }
};

// Animated Number Counter Component for Premium feel
function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;

        const totalMiliseconds = duration;
        const incrementTime = Math.min(Math.abs(Math.floor(totalMiliseconds / end)), 30);
        const startTime = performance.now();

        const timer = setInterval(() => {
            const timePassed = performance.now() - startTime;
            const progress = Math.min(timePassed / totalMiliseconds, 1);
            
            // Easing function (outQuad)
            const easedProgress = progress * (2 - progress);
            const currentCount = Math.round(easedProgress * end);
            
            setCount(currentCount);

            if (progress === 1) {
                clearInterval(timer);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{count.toLocaleString()}</span>;
}

export default function B2cConfigurator() {
    const store = useKitchenStore((state) => state);
    const [isSaving, startSaveTransition] = useTransition();
    const [isAiGenerating, startAiTransition] = useTransition();

    // Configuration States
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const { language: lang, setLanguage: setLang } = useUIStore();
    const [tempRole, setTempRole] = useState<'show' | 'wet'>('show');
    const [selectedStyleId, setSelectedStyleId] = useState<string>('modern_minimal');
    
    // Step 3 Dimensions
    const [wallALength, setWallALength] = useState<number>(320); // cm
    const [hasWallB, setHasWallB] = useState<boolean>(false);
    const [wallBLength, setWallBLength] = useState<number>(240); // cm
    const [peopleCount, setPeopleCount] = useState<string>('4-6');
    const [targetRegion, setTargetRegion] = useState<'Egypt' | 'Gulf'>('Egypt');

    if (!store.currentKitchen) return null;

    const currentRoleStyles = tempRole === 'show' ? SHOW_STYLES : SERVICE_STYLES;
    const activeStyle = currentRoleStyles.find(s => s.id === selectedStyleId) || currentRoleStyles[0];

    // Calculate quote range
    const calculateEstimate = () => {
        const cabinetMaterial = activeStyle.materialKey;
        const countertopMaterial = activeStyle.countertopKey;

        const regionalRates = RATES[targetRegion];
        const cabRate = regionalRates.cabinet[cabinetMaterial] || 5000;
        const countRate = regionalRates.countertop[countertopMaterial] || 2500;

        const totalLengthCm = wallALength + (hasWallB ? wallBLength : 0);
        const overlapDeduction = hasWallB ? 60 : 0;
        const netLinearMeters = Math.max(1.5, (totalLengthCm - overlapDeduction) / 100);

        // Linear meters calculation
        const basePrice = netLinearMeters * cabRate;
        const upperPrice = (netLinearMeters * 0.7) * (cabRate * 0.8);
        const countertopPrice = netLinearMeters * countRate;

        const midpoint = basePrice + upperPrice + countertopPrice;

        return {
            min: Math.round((midpoint * 0.9) / 500) * 500,
            max: Math.round((midpoint * 1.15) / 500) * 500,
            currency: regionalRates.currency,
            netMeters: netLinearMeters
        };
    };

    const estimate = calculateEstimate();

    const handleNextStep = () => {
        if (step === 1) {
            const defaultId = tempRole === 'show' ? 'modern_minimal' : 'standard_alumetal';
            setSelectedStyleId(defaultId);
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else if (step === 3) {
            const currentKitchen = store.currentKitchen;
            if (!currentKitchen) return;

            const updatedWalls = [
                { id: 'wall-a', label: 'Wall A', length: wallALength, height: 240, thickness: 10 },
                ...(hasWallB ? [{ id: 'wall-b', label: 'Wall B', length: wallBLength, height: 240, thickness: 10 }] : [])
            ];

            const updatedKitchen = {
                ...currentKitchen,
                kitchenRole: (tempRole === 'show' ? 'show' : 'wet') as 'show' | 'wet',
                layoutShape: (hasWallB ? 'L' : 'I') as 'L' | 'I',
                region: targetRegion,
                cabinetMaterial: activeStyle.materialKey,
                countertopMaterial: activeStyle.countertopKey,
                walls: updatedWalls,
                totalPrice: estimate.min,
                standards: {
                    ...(currentKitchen.standards || {}),
                    householdSize: peopleCount,
                    styleId: selectedStyleId
                } as any
            };

            startSaveTransition(async () => {
                store.setKitchen(updatedKitchen);
                const res = await updateKitchen(updatedKitchen.projectId, updatedKitchen.id, updatedKitchen);
                if (!res.success) {
                    toast.error(res.error || "خطأ في الاتصال بقاعدة البيانات.");
                    return;
                }

                startAiTransition(async () => {
                    const aiRes = await generateAiLayout(updatedKitchen.id);
                    if (aiRes.success && aiRes.design) {
                        store.setKitchen({
                            ...updatedKitchen,
                            generatedDesign: aiRes.design
                        });
                        toast.success(lang === 'ar' ? "تم إعداد عرض السعر والتحليل الفني بنجاح!" : "Quotation & AI analysis generated successfully!");
                    }
                });

                setStep(4);
            });
        }
    };

    const handlePrevStep = () => {
        if (step > 1) setStep((step - 1) as any);
    };

    const triggerWhatsApp = () => {
        const whatsappMsg = store.currentKitchen?.generatedDesign?.instructions || 
            `السلام عليكم، قمت بتصميم مطبخ ${tempRole === 'show' ? 'شو' : 'خدمة'} على موقعكم بالخامات الآتية: ${activeStyle.materialAr} ورخام ${activeStyle.titleAr}. الأبعاد التقريبية للحوائط: حائط رئيسي ${wallALength / 100} متر ${hasWallB ? `وحائط ثاني ${wallBLength / 100} متر` : ''}. أود الاستفسار وحجز موعد لرفع المقاسات مجاناً. شكراً لك.`;
        
        const phoneNumber = targetRegion === 'Egypt' ? '+201000000000' : '+966500000000';
        const cleanPhone = phoneNumber.replace(/[+\s-]/g, '');
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
    };

    const triggerShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success(lang === 'ar' ? "تم نسخ الرابط! شاركه مع العائلة على واتساب." : "Link copied! Share it with family.");
    };

    // Animation presets
    const fadeSlideVariants = {
        hidden: { opacity: 0, x: lang === 'ar' ? -40 : 40 },
        visible: { opacity: 1, x: 0, transition: { type: 'spring' as any, stiffness: 350, damping: 28 } },
        exit: { opacity: 0, x: lang === 'ar' ? 40 : -40, transition: { duration: 0.15 } }
    };

    return (
        <div 
            className="kitchen-container"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
            {/* Header Controls */}
            <div className="max-w-xl mx-auto w-full flex justify-between items-center mb-6 border-b border-border/80 pb-4 print:hidden">
                <div className="flex gap-2">
                    <button
                        onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border hover:border-accent-foreground/20 text-xs font-bold transition-all text-muted-foreground hover:text-foreground shadow-sm cursor-pointer"
                    >
                        <Globe size={13} className="text-primary animate-pulse" />
                        <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
                    </button>
                </div>

                <div className="flex gap-1.5 bg-muted border border-border p-1 rounded-xl">
                    <button 
                        onClick={() => setTargetRegion('Egypt')}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer",
                            targetRegion === 'Egypt' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        🇪🇬 {lang === 'ar' ? 'مصر' : 'Egypt'}
                    </button>
                    <button 
                        onClick={() => setTargetRegion('Gulf')}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer",
                            targetRegion === 'Gulf' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        🇸🇦 {lang === 'ar' ? 'الخليج' : 'Gulf'}
                    </button>
                </div>
            </div>

            {/* Stepper Progress bar */}
            <div className="max-w-xl mx-auto w-full mb-8">
                <div className="flex justify-between items-center mb-4 text-right">
                    <div>
                        <span className="text-[9px] tracking-widest text-primary uppercase font-black font-mono">iKitchen Architect</span>
                        <h2 className="text-lg md:text-xl font-extrabold tracking-tight mt-0.5">
                            {step === 1 && (lang === 'ar' ? "١. حدد نوع المطبخ" : "1. Select Kitchen Role")}
                            {step === 2 && (lang === 'ar' ? "٢. اختار خامات الواجهة" : "2. Select Shutter Style & Finish")}
                            {step === 3 && (lang === 'ar' ? "٣. القياسات التقريبية" : "3. Approximate Dimensions")}
                            {step === 4 && (lang === 'ar' ? "٤. عرض السعر والتصميم" : "4. Design Proposal & Estimation")}
                        </h2>
                    </div>
                </div>

                {/* Progress bar lines */}
                <div className="kitchen-progress-bar">
                    {[1, 2, 3, 4].map((s) => (
                        <div 
                            key={s}
                            className={cn(
                                "h-full flex-1 transition-all duration-500",
                                step >= s ? "bg-primary" : "bg-muted"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Steps Container */}
            <div className="flex-1 max-w-xl mx-auto w-full flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step-1"
                            variants={fadeSlideVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-4"
                        >
                            <p className="text-muted-foreground text-xs font-semibold leading-relaxed mb-4">
                                {lang === 'ar' 
                                    ? "* ينقسم تخطيط المطابخ في البيت العربي الحديث لنوعين، اختر الاستخدام المناسب لمشروعك:"
                                    : "* Modern homes often separate kitchen functionalities. Select the primary role for your design:"
                                }
                            </p>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => {
                                        setTempRole('show');
                                        handleNextStep();
                                    }}
                                    className={cn(
                                        "kitchen-select-card group",
                                        tempRole === 'show' && "kitchen-select-card-active"
                                    )}
                                >
                                    <div className="space-y-1 z-10">
                                        <div className="font-bold text-base flex items-center gap-2">
                                            <span className="text-xl">🍽️</span>
                                            <span>{lang === 'ar' ? "مطبخ جمالي / شو (Show Kitchen)" : "Show / Prep Kitchen"}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {lang === 'ar' 
                                                ? "تحضيري ومفتوح على المعيشة. يركز على الفخامة، الكوفي كورنر والرخام المتناسق." 
                                                : "Open plan, design-first setup. Focuses on premium slabs, breakfast island, and coffee station."
                                            }
                                        </p>
                                    </div>
                                    <ArrowLeft size={16} className="text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all shrink-0 z-10" />
                                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
                                </button>

                                <button
                                    onClick={() => {
                                        setTempRole('wet');
                                        handleNextStep();
                                    }}
                                    className={cn(
                                        "kitchen-select-card group",
                                        tempRole === 'wet' && "kitchen-select-card-active"
                                    )}
                                >
                                    <div className="space-y-1 z-10">
                                        <div className="font-bold text-base flex items-center gap-2">
                                            <span className="text-xl">🔧</span>
                                            <span>{lang === 'ar' ? "مطبخ خدمة / عملي (Service Kitchen)" : "Wet / Service Kitchen"}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {lang === 'ar' 
                                                ? "مغلق للطهي الثقيل والقلي اليومي. يعتمد على سعة التخزين وخامات ألوميتال مقاومة للحرارة." 
                                                : "Closed setup optimized for intense daily cooking. Focuses on heavy ventilation, durability, and storage."
                                            }
                                        </p>
                                    </div>
                                    <ArrowLeft size={16} className="text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all shrink-0 z-10" />
                                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step-2"
                            variants={fadeSlideVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-4"
                        >
                            <p className="text-muted-foreground text-xs font-semibold leading-relaxed mb-2">
                                {lang === 'ar' ? "* اختر طابع الألوان والخامات المفضلة لديك لعلب وأبواب المطبخ:" : "* Choose the design archetype and shutters finish for your cabinetry:"}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {currentRoleStyles.map((style) => (
                                    <div
                                        key={style.id}
                                        onClick={() => setSelectedStyleId(style.id)}
                                        className={cn(
                                            "kitchen-style-card group",
                                            selectedStyleId === style.id && "kitchen-style-card-active"
                                        )}
                                    >
                                        <div className="h-28 relative overflow-hidden">
                                            <img 
                                                src={style.imageUrl} 
                                                alt={style.titleEn}
                                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                                            />
                                            {/* Price dots */}
                                            <div className="kitchen-price-dots">
                                                {Array.from({ length: 4 }).map((_, i) => (
                                                    <span 
                                                        key={i} 
                                                        className={cn(
                                                            "w-1.5 h-1.5 rounded-full mx-0.5 transition-colors",
                                                            i < style.priceTier ? "bg-rose-500" : "bg-muted-foreground/30"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-extrabold text-xs text-foreground">
                                                    {lang === 'ar' ? style.titleAr : style.titleEn} 
                                                    <span className="text-[9px] text-muted-foreground font-mono font-medium block mt-0.5">({style.titleEn})</span>
                                                </h4>
                                                <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed h-8 overflow-hidden">
                                                    {lang === 'ar' ? style.descAr : style.descEn}
                                                </p>
                                            </div>
                                            
                                            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                                                <span className="kitchen-material-badge">
                                                    {lang === 'ar' ? style.materialAr : style.materialEn}
                                                </span>
                                                {selectedStyleId === style.id && (
                                                    <span className="p-1 bg-primary rounded-full text-primary-foreground shadow shadow-primary"><Check size={9} /></span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Back and Next */}
                            <div className="flex justify-between items-center pt-6 border-t border-border/80">
                                <button 
                                    onClick={handlePrevStep}
                                    className="kitchen-button-secondary h-10 px-4 gap-1 cursor-pointer"
                                >
                                    <ArrowRight size={14} className={cn(lang === 'ar' ? '' : 'rotate-180')} />
                                    <span>{lang === 'ar' ? "السابق" : "Back"}</span>
                                </button>
                                <button 
                                    onClick={handleNextStep}
                                    className="bg-primary text-primary-foreground font-bold h-10 px-5 rounded-xl text-xs flex items-center gap-1 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                                >
                                    <span>{lang === 'ar' ? "التالي" : "Next"}</span>
                                    <ArrowLeft size={14} className={cn(lang === 'ar' ? '' : 'rotate-180')} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div 
                            key="step-3"
                            variants={fadeSlideVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-6"
                        >
                            {/* SVG Walls Live visualizer */}
                            <div className="kitchen-visualizer">
                                <span className="absolute top-2.5 right-2.5 text-[8px] uppercase tracking-wider text-muted-foreground font-black font-mono">Blueprint</span>
                                
                                <svg width="100%" height="110" viewBox="0 0 400 110" className="mt-4 transition-all duration-300">
                                    <g stroke="currentColor" className="text-border" strokeWidth="1" strokeDasharray="3 3">
                                        <line x1="20" y1="90" x2="380" y2="90" />
                                        <line x1="20" y1="10" x2="20" y2="90" />
                                    </g>

                                    {hasWallB ? (
                                        <g>
                                            <line 
                                                x1="60" y1="20" x2="340" y2="20" 
                                                className="stroke-primary" strokeWidth="4" strokeLinecap="round" 
                                            />
                                            <line 
                                                x1="340" y1="20" x2="340" y2="90" 
                                                className="stroke-primary" strokeWidth="4" strokeLinecap="round" 
                                            />
                                            <text x="200" y="14" className="fill-muted-foreground text-[10px] font-bold" textAnchor="middle">
                                                {lang === 'ar' ? 'الحائط الرئيسي:' : 'Main Wall:'} {wallALength / 100}م
                                            </text>
                                            <text x="350" y="58" className="fill-muted-foreground text-[10px] font-bold" textAnchor="start">
                                                {lang === 'ar' ? 'الجانبي:' : 'Side:'} {wallBLength / 100}م
                                            </text>
                                        </g>
                                    ) : (
                                        <g>
                                            <line 
                                                x1="60" y1="50" x2="340" y2="50" 
                                                className="stroke-primary" strokeWidth="4" strokeLinecap="round" 
                                            />
                                            <text x="200" y="40" className="fill-muted-foreground text-[10px] font-bold" textAnchor="middle">
                                                {lang === 'ar' ? 'الحائط الرئيسي:' : 'Main Wall:'} {wallALength / 100}م
                                            </text>
                                        </g>
                                    )}
                                </svg>
                            </div>

                            {/* Main wall slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                        <Ruler size={13} className="text-primary" />
                                        <span>{lang === 'ar' ? 'طول الحائط الرئيسي' : 'Main Wall Length'}</span>
                                    </label>
                                    <span className="kitchen-value-badge">
                                        {wallALength / 100} {lang === 'ar' ? 'متر' : 'meters'} ({wallALength} {lang === 'ar' ? 'سم' : 'cm'})
                                    </span>
                                </div>
                                <input 
                                    type="range"
                                    min="150"
                                    max="600"
                                    step="10"
                                    value={wallALength}
                                    onChange={(e) => setWallALength(Number(e.target.value))}
                                    className="kitchen-slider"
                                />
                            </div>

                            {/* Toggle Corner */}
                            <div className="kitchen-card">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-foreground">{lang === 'ar' ? 'هل المطبخ واجهتين حرف L؟' : 'Is it L-shaped corner layout?'}</span>
                                    <button
                                        onClick={() => setHasWallB(!hasWallB)}
                                        className={cn(
                                            "kitchen-switch",
                                            hasWallB && "kitchen-switch-active"
                                        )}
                                    >
                                        <span className={cn(
                                            "kitchen-switch-handle",
                                            hasWallB ? (lang === 'ar' ? '-translate-x-4' : 'translate-x-4') : 'translate-x-0'
                                        )} />
                                    </button>
                                </div>

                                {hasWallB && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-3 pt-3 border-t border-border"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-muted-foreground">{lang === 'ar' ? 'طول الحائط الجانبي' : 'Side Wall Length'}</span>
                                            <span className="kitchen-value-badge">
                                                {wallBLength / 100} {lang === 'ar' ? 'متر' : 'meters'} ({wallBLength} {lang === 'ar' ? 'سم' : 'cm'})
                                            </span>
                                        </div>
                                        <input 
                                            type="range"
                                            min="120"
                                            max="450"
                                            step="10"
                                            value={wallBLength}
                                            onChange={(e) => setWallBLength(Number(e.target.value))}
                                            className="kitchen-slider"
                                        />
                                    </motion.div>
                                )}
                            </div>

                            {/* Household size */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                    <Users size={13} className="text-primary" />
                                    <span>{lang === 'ar' ? 'عدد أفراد المنزل الرئيسي' : 'Main Household Count'}</span>
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[(lang === 'ar' ? '٢-٣ أفراد' : '2-3 Members'), (lang === 'ar' ? '٤-٦ أفراد' : '4-6 Members'), (lang === 'ar' ? 'أكثر من ٦' : 'More than 6')].map((choice, i) => {
                                        const valueKey = ['2-3', '4-6', '>6'][i];
                                        return (
                                            <button
                                                key={valueKey}
                                                onClick={() => setPeopleCount(valueKey)}
                                                className={cn(
                                                    "kitchen-choice-btn",
                                                    peopleCount === valueKey && "kitchen-choice-btn-active"
                                                )}
                                            >
                                                {choice}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="kitchen-info-banner">
                                <Info size={13} className="text-primary shrink-0 mt-0.5" />
                                <span>{lang === 'ar' ? 'الرفع الفعلي للمقاسات وتحديد مكان عواميد الخرسانة والصرف يتم مجاناً مع مهندس المبيعات.' : 'Official structural measurements, pillars placement, and gas pipes will be audited on-site for free by our engineer.'}</span>
                            </div>

                            {/* Back and Next */}
                            <div className="flex justify-between items-center pt-6 border-t border-border/80">
                                <button 
                                    onClick={handlePrevStep}
                                    className="kitchen-button-secondary h-10 px-4 gap-1 cursor-pointer"
                                    disabled={isSaving}
                                >
                                    <ArrowRight size={14} className={cn(lang === 'ar' ? '' : 'rotate-180')} />
                                    <span>{lang === 'ar' ? "السابق" : "Back"}</span>
                                </button>
                                <button 
                                    onClick={handleNextStep}
                                    className="bg-primary text-primary-foreground font-bold h-10 px-5 rounded-xl text-xs flex items-center gap-1 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                                    disabled={isSaving}
                                >
                                    <span>{isSaving ? (lang === 'ar' ? 'جاري الحساب...' : 'Calculating...') : (lang === 'ar' ? "حساب عرض السعر" : "Calculate Quotation")}</span>
                                    {!isSaving && <Sparkles size={13} className="fill-current" />}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div 
                            key="step-4"
                            variants={fadeSlideVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-6"
                        >
                            {/* Price range with ticking counter animation */}
                            <div className="kitchen-quote-box">
                                <span className="text-[10px] text-primary font-bold uppercase tracking-widest block font-mono">{lang === 'ar' ? 'عرض السعر المبدئي التقريبي' : 'Estimated Pricing Range'}</span>
                                
                                <div className="text-2xl md:text-3xl font-black tracking-tight flex items-center justify-center gap-2 font-mono">
                                    <span className="text-primary font-bold text-lg md:text-xl">{estimate.currency}</span>
                                    <span className="text-foreground"><AnimatedCounter value={estimate.min} /></span>
                                    <span className="text-muted-foreground text-sm font-light">—</span>
                                    <span className="text-foreground"><AnimatedCounter value={estimate.max} /></span>
                                </div>
                                <p className="text-[10px] text-muted-foreground font-semibold">{lang === 'ar' ? 'يشمل الوحدات السفلية والعلوية، المفصلات الهيدروليكية، والتركيب.' : 'Includes lower cabinetry, wall units, soft-close hardware, and full installation.'}</p>
                                
                                <div className="pt-2.5 flex justify-center">
                                    <span className="kitchen-pill">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        {lang === 'ar' ? `مقاسات صافي: ${estimate.netMeters.toFixed(2)} متر طولي` : `Net Run: ${estimate.netMeters.toFixed(2)} linear meters`}
                                    </span>
                                </div>
                            </div>

                            {/* Dynamic AI reasoning block */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-primary animate-pulse" />
                                    <span>{lang === 'ar' ? 'تحليل مهندس الديكور الاصطناعي' : 'AI Design Rationale'}</span>
                                </h3>
                                <div className="kitchen-ai-rationale" dir="rtl">
                                    {isAiGenerating ? (
                                        <div className="py-6 flex flex-col items-center justify-center gap-2 text-muted-foreground font-medium">
                                            <svg className="animate-spin h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            <span className="text-[11px]">{lang === 'ar' ? 'جاري دراسة المساحة وصياغة نصائح التوزيع...' : 'Analyzing layout bounds and spatial clearances...'}</span>
                                        </div>
                                    ) : (
                                        store.currentKitchen.generatedDesign?.aiReasoning || 
                                        (lang === 'ar' ? "تم احتساب السعر المبدئي بناءً على الأبعاد. نوصي بتوزيع الأجهزة لضمان سهولة التنقل." : "Initial calculation complete. We recommend a layout matching your workflow bounds.")
                                    )}
                                </div>
                            </div>

                            {/* Spec Details Card */}
                            <div className="kitchen-spec-box">
                                <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold block">{lang === 'ar' ? 'المواصفات المختارة' : 'Selected Specifications'}</span>
                                <div className="grid grid-cols-2 gap-3" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                                    <div className="flex justify-between border-b border-border/40 pb-1">
                                        <span className="text-muted-foreground">{lang === 'ar' ? 'الخامة:' : 'Material:'}</span>
                                        <span className="font-bold">{lang === 'ar' ? activeStyle.materialAr : activeStyle.materialEn}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-border/40 pb-1">
                                        <span className="text-muted-foreground">{lang === 'ar' ? 'الطابع:' : 'Style:'}</span>
                                        <span className="font-bold">{lang === 'ar' ? activeStyle.titleAr : activeStyle.titleEn}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Conversion CTAs */}
                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={triggerWhatsApp}
                                    disabled={isAiGenerating}
                                    className="kitchen-button-whatsapp"
                                >
                                    <MessageSquare size={18} />
                                    <span>{lang === 'ar' ? 'فتح محادثة واتساب وطلب معاينة مجانية' : 'Start WhatsApp Chat & Book Survey'}</span>
                                </button>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={triggerShare}
                                        className="kitchen-button-secondary cursor-pointer"
                                    >
                                        <Share2 size={13} />
                                        <span>{lang === 'ar' ? 'مشاركة رابط التصميم' : 'Share Configuration'}</span>
                                    </button>
                                    <button
                                        onClick={triggerWhatsApp}
                                        className="kitchen-button-secondary cursor-pointer"
                                    >
                                        <Calendar size={13} />
                                        <span>{lang === 'ar' ? 'حجز المعاينة الفنية' : 'Schedule Site Visit'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Restart */}
                            <div className="pt-4 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground">
                                <button 
                                    onClick={() => setStep(1)} 
                                    className="hover:text-foreground transition-colors flex items-center gap-1 font-bold cursor-pointer"
                                >
                                    <Home size={11} />
                                    {lang === 'ar' ? 'ابدأ من جديد' : 'Restart Configurator'}
                                </button>
                                <span className="font-mono">ID: {store.currentKitchen.projectId.substring(0, 8)}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
