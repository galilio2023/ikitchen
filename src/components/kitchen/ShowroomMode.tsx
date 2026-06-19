'use client';

import React, { useState, useTransition } from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { updateKitchen } from '@/actions/projectActions';
import { 
    Printer, 
    Save, 
    User, 
    Phone, 
    Layers 
} from 'lucide-react';
import { toast } from 'sonner';

const CABINET_MATERIALS = [
    { key: 'Alumetal Standard', labelAr: 'ألوميتال قياسي', labelEn: 'Standard Alumetal', priceEgypt: 4500, priceGulf: 1200 },
    { key: 'Khashamium Premium', labelAr: 'خشمونيوم بريميوم', labelEn: 'Premium Khashamium', priceEgypt: 6500, priceGulf: 1800 },
    { key: 'Acrylic Turkish/Spanish', labelAr: 'أكريليك تركي مستورد', labelEn: 'Imported Acrylic Gloss', priceEgypt: 8000, priceGulf: 2200 },
    { key: 'Solid Wood Premium', labelAr: 'خشب طبيعي فاخر', labelEn: 'Luxury Solid Wood', priceEgypt: 12000, priceGulf: 3200 }
];

const COUNTERTOP_MATERIALS = [
    { key: 'Local Granite', labelAr: 'جرانيت محلي (حلايب)', labelEn: 'Local Granite (Halayeb)', priceEgypt: 2000, priceGulf: 500 },
    { key: 'Premium Quartz', labelAr: 'كوارتز بريميوم', labelEn: 'Premium Quartz Slabs', priceEgypt: 6000, priceGulf: 1500 },
    { key: 'Imported Marble', labelAr: 'رخام مستورد فاخر', labelEn: 'Luxury Imported Marble', priceEgypt: 8000, priceGulf: 2000 }
];

const HARDWARE_TIERS = [
    { key: 'Standard', labelAr: 'مفصلات إغلاق ناعم قياسية', labelEn: 'Standard Soft-Close', priceEgypt: 0, priceGulf: 0 },
    { key: 'Premium (Blum/Hettich)', labelAr: 'مفصلات بلوم النمساوية', labelEn: 'Premium Austrian Blum', priceEgypt: 1500, priceGulf: 400 }
];

export default function ShowroomMode() {
    const store = useKitchenStore((state) => state);
    const [isSaving, startSaveTransition] = useTransition();

    // Client metadata states
    const [clientName, setClientName] = useState(store.currentKitchen?.clientName || '');
    const [phone, setPhone] = useState(store.currentKitchen?.phone || '');
    const [address, setAddress] = useState(store.currentKitchen?.address || '');

    // Layout configuration states
    const [kitchenRole, setKitchenRole] = useState<'show' | 'wet' | 'standard'>(
        (store.currentKitchen?.kitchenRole as any) || 'standard'
    );
    const [region, setRegion] = useState<'Egypt' | 'Gulf'>(
        (store.currentKitchen?.region as any) || 'Egypt'
    );
    const [cabinetMaterial, setCabinetMaterial] = useState(
        store.currentKitchen?.cabinetMaterial || CABINET_MATERIALS[0].key
    );
    const [countertopMaterial, setCountertopMaterial] = useState(
        store.currentKitchen?.countertopMaterial || COUNTERTOP_MATERIALS[0].key
    );
    const [hardwareTier, setHardwareTier] = useState(
        store.currentKitchen?.hardwareTier || HARDWARE_TIERS[0].key
    );

    // Wall measurements
    const [wallALength, setWallALength] = useState(
        store.currentKitchen?.walls?.[0]?.length || 300
    );
    const [wallBLength, setWallBLength] = useState(
        store.currentKitchen?.walls?.[1]?.length || 0
    );

    // Custom pricing adjustments
    const [customDiscount, setCustomDiscount] = useState<number>(0);
    const [additionalFees, setAdditionalFees] = useState<number>(0);

    if (!store.currentKitchen) return null;

    // Local constants fallback
    const selectedCabinet = CABINET_MATERIALS.find(c => c.key === cabinetMaterial) || CABINET_MATERIALS[0];
    const selectedCountertop = COUNTERTOP_MATERIALS.find(c => c.key === countertopMaterial) || COUNTERTOP_MATERIALS[0];
    const selectedHardware = HARDWARE_TIERS.find(h => h.key === hardwareTier) || HARDWARE_TIERS[0];

    const currency = region === 'Egypt' ? 'EGP' : 'SAR';

    // Quote calculation formula
    const totalLength = wallALength + (wallBLength > 0 ? wallBLength : 0);
    const overlapDeduction = wallBLength > 0 ? 60 : 0;
    const netMeters = Math.max(1.5, (totalLength - overlapDeduction) / 100);

    const cabRate = region === 'Egypt' ? selectedCabinet.priceEgypt : selectedCabinet.priceGulf;
    const countertopRate = region === 'Egypt' ? selectedCountertop.priceEgypt : selectedCountertop.priceGulf;
    const hwRate = region === 'Egypt' ? selectedHardware.priceEgypt : selectedHardware.priceGulf;

    const baseCabinetsCost = netMeters * cabRate;
    const upperCabinetsCost = (netMeters * 0.7) * (cabRate * 0.8);
    const countertopCost = netMeters * countertopRate;
    const hardwareCost = netMeters * hwRate;

    const subtotal = baseCabinetsCost + upperCabinetsCost + countertopCost + hardwareCost;
    const discountAmount = subtotal * (customDiscount / 100);
    const grandTotal = Math.max(0, subtotal - discountAmount + additionalFees);

    const handleSave = () => {
        const currentKitchen = store.currentKitchen;
        if (!currentKitchen) return;

        if (!clientName || !phone) {
            toast.error("يرجى إدخال اسم العميل ورقم الهاتف للتسجيل.");
            return;
        }

        const updatedWalls = [
            { id: 'wall-a', label: 'Wall A (Main)', length: wallALength, height: 240, thickness: 10 },
            ...(wallBLength > 0 ? [{ id: 'wall-b', label: 'Wall B (Side)', length: wallBLength, height: 240, thickness: 10 }] : [])
        ];

        const updatedKitchen = {
            ...currentKitchen,
            clientName,
            phone,
            address,
            kitchenRole,
            region,
            cabinetMaterial,
            countertopMaterial,
            hardwareTier,
            walls: updatedWalls,
            totalPrice: grandTotal,
            status: 'designing' as const
        };

        startSaveTransition(async () => {
            store.setKitchen(updatedKitchen);
            const res = await updateKitchen(updatedKitchen.projectId, updatedKitchen.id, updatedKitchen);
            if (res.success) {
                toast.success("تم حفظ عرض السعر وسجل العميل بنجاح!");
            } else {
                toast.error(res.error || "خطأ أثناء الحفظ.");
            }
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="kitchen-container flex xl:flex-row gap-6 print:bg-white print:text-black print:p-0 print:m-0">
            
            {/* Left side: Sales Rep Form Controls (Hidden during print) */}
            <div className="flex-1 space-y-6 print:hidden">
                <div>
                    <span className="text-[10px] tracking-widest text-primary uppercase font-black font-mono">B2B Showroom Mode</span>
                    <h2 className="text-xl font-bold mt-0.5">لوحة تسجيل المبيعات وتقديم عروض الأسعار</h2>
                </div>

                {/* 1. Client Info Card */}
                <div className="kitchen-card">
                    <h3 className="kitchen-card-header">
                        <User size={14} className="text-primary" />
                        <span>بيانات العميل (Customer Details)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="kitchen-field" dir="rtl">
                            <label className="kitchen-label">اسم العميل بالكامل *</label>
                            <input 
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                className="kitchen-input"
                                placeholder="محمد أحمد"
                            />
                        </div>
                        <div className="kitchen-field" dir="rtl">
                            <label className="kitchen-label">رقم الهاتف / الواتساب *</label>
                            <input 
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="kitchen-input"
                                placeholder="+20 100 000 0000"
                            />
                        </div>
                    </div>
                    <div className="kitchen-field" dir="rtl">
                        <label className="kitchen-label">العنوان / المدينة</label>
                        <input 
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="kitchen-input"
                            placeholder="القاهرة الجديدة، التجمع الخامس"
                        />
                    </div>
                </div>

                {/* 2. Specs and Setup */}
                <div className="kitchen-card">
                    <h3 className="kitchen-card-header">
                        <Layers size={14} className="text-primary" />
                        <span>مواصفات وخامات المطبخ (Kitchen Specifications)</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Region */}
                        <div className="kitchen-field" dir="rtl">
                            <label className="kitchen-label">بلد المشروع / العملة</label>
                            <select 
                                value={region} 
                                onChange={(e) => setRegion(e.target.value as any)}
                                className="kitchen-select"
                            >
                                <option value="Egypt">جمهورية مصر العربية (EGP)</option>
                                <option value="Gulf">المملكة العربية السعودية / الخليج (SAR)</option>
                            </select>
                        </div>
                        {/* Role */}
                        <div className="kitchen-field" dir="rtl">
                            <label className="kitchen-label">استخدام المطبخ</label>
                            <select 
                                value={kitchenRole} 
                                onChange={(e) => setKitchenRole(e.target.value as any)}
                                className="kitchen-select"
                            >
                                <option value="standard">مطبخ عائلي قياسي (Standard)</option>
                                <option value="show">مطبخ تحضيري جمالي (Show)</option>
                                <option value="wet">مطبخ قلي شاق (Wet/Dirty)</option>
                            </select>
                        </div>
                        {/* Hardware */}
                        <div className="kitchen-field" dir="rtl">
                            <label className="kitchen-label">نوع المفصلات والاكسسوار</label>
                            <select 
                                value={hardwareTier} 
                                onChange={(e) => setHardwareTier(e.target.value)}
                                className="kitchen-select"
                            >
                                {HARDWARE_TIERS.map(h => (
                                    <option key={h.key} value={h.key}>{h.labelAr}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Cabinet box & door material */}
                        <div className="kitchen-field" dir="rtl">
                            <label className="kitchen-label">خامة العلب والضلف (Cabinets)</label>
                            <select 
                                value={cabinetMaterial} 
                                onChange={(e) => setCabinetMaterial(e.target.value)}
                                className="kitchen-select"
                            >
                                {CABINET_MATERIALS.map(c => (
                                    <option key={c.key} value={c.key}>{c.labelAr}</option>
                                ))}
                            </select>
                        </div>
                        {/* Countertop */}
                        <div className="kitchen-field" dir="rtl">
                            <label className="kitchen-label">خامة القرصة / الرخام (Countertop)</label>
                            <select 
                                value={countertopMaterial} 
                                onChange={(e) => setCountertopMaterial(e.target.value)}
                                className="kitchen-select"
                            >
                                {COUNTERTOP_MATERIALS.map(co => (
                                    <option key={co.key} value={co.key}>{co.labelAr}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 3. Measurements & Adjustments */}
                <div className="kitchen-card">
                    <h3 className="kitchen-card-header">
                        <Printer size={14} className="text-primary" />
                        <span>الأبعاد والتسويات المالية (Dimensions & Finance Adjustments)</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="kitchen-field" dir="rtl">
                            <label className="kitchen-label">طول الحائط الرئيسي (سم) *</label>
                            <input 
                                type="number"
                                value={wallALength}
                                onChange={(e) => setWallALength(Number(e.target.value))}
                                className="kitchen-input"
                            />
                        </div>
                        <div className="kitchen-field" dir="rtl">
                            <label className="kitchen-label">طول الحائط الجانبي (سم) - اكتب 0 إذا مستقيم</label>
                            <input 
                                type="number"
                                value={wallBLength}
                                onChange={(e) => setWallBLength(Number(e.target.value))}
                                className="kitchen-input"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="kitchen-field" dir="rtl">
                            <label className="kitchen-label">نسبة الخصم التجاري للعميل (%)</label>
                            <input 
                                type="number"
                                value={customDiscount}
                                onChange={(e) => setCustomDiscount(Number(e.target.value))}
                                className="kitchen-input"
                                min="0"
                                max="100"
                            />
                        </div>
                        <div className="kitchen-field" dir="rtl">
                            <label className="kitchen-label">رسوم إضافية يدوية (نقل / اكسسوار إضافي)</label>
                            <input 
                                type="number"
                                value={additionalFees}
                                onChange={(e) => setAdditionalFees(Number(e.target.value))}
                                className="kitchen-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Save action buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="kitchen-button-primary flex-1"
                    >
                        <Save size={16} />
                        {isSaving ? "جاري تسجيل البيانات..." : "حفظ وحساب عرض السعر"}
                    </button>
                    <button
                        onClick={handlePrint}
                        className="kitchen-button-secondary h-12 text-xs px-6 gap-2"
                    >
                        <Printer size={16} />
                        طباعة كعرض رسمي
                    </button>
                </div>
            </div>

            {/* Right side: Showroom Printable PDF/Quote Mockup */}
            <div className="kitchen-quotation-letterhead">
                
                {/* Invoice Letterhead */}
                <div className="space-y-4">
                    <div className="kitchen-invoice-header">
                        <div>
                            <h1 className="text-lg font-black tracking-tight text-zinc-950">IKITCHEN CO.</h1>
                            <p className="text-[8px] text-zinc-500 font-bold uppercase">Intelligent Kitchen Configurator</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold bg-zinc-100 text-zinc-800 px-2.5 py-0.5 rounded uppercase">Quotation</span>
                            <p className="text-[9px] text-zinc-400 font-mono mt-1">Date: {new Date().toLocaleDateString('en-US')}</p>
                        </div>
                    </div>

                    {/* Client info in PDF */}
                    <div className="kitchen-invoice-client-info" dir="rtl">
                        <div className="text-right space-y-1">
                            <p className="text-zinc-400 text-[9px] font-bold">العميل الكريم:</p>
                            <p className="font-bold text-zinc-900">{clientName || "—"}</p>
                            <p className="text-zinc-600 font-mono text-[10px]">{phone || "—"}</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-zinc-400 text-[9px] font-bold">موقع التوصيل:</p>
                            <p className="text-zinc-700">{address || "معرض الشركة الرئيسي"}</p>
                        </div>
                    </div>

                    {/* BOM Table */}
                    <div className="space-y-2 pt-2">
                        <h4 className="kitchen-invoice-table-header">تفاصيل التسعير والبنود (BOM)</h4>
                        
                        <div className="space-y-1.5 text-[11px]" dir="rtl">
                            <div className="kitchen-invoice-table-row">
                                <span>علب مطبخ سفلية ({selectedCabinet.labelAr})</span>
                                <span className="font-mono font-medium">{netMeters.toFixed(2)} م طولي</span>
                            </div>
                            <div className="kitchen-invoice-table-row">
                                <span>علب مطبخ علوية (عمق 35سم)</span>
                                <span className="font-mono font-medium">{(netMeters * 0.7).toFixed(2)} م طولي</span>
                            </div>
                            <div className="kitchen-invoice-table-row">
                                <span>رخام / جرانيت للقرصة ({selectedCountertop.labelAr})</span>
                                <span className="font-mono font-medium">{netMeters.toFixed(2)} م طولي</span>
                            </div>
                            {selectedHardware.priceEgypt > 0 && (
                                <div className="kitchen-invoice-table-row">
                                    <span>إكسسوار مفصلات وتروليات ترقية ({selectedHardware.labelAr})</span>
                                    <span className="font-mono font-medium">مشمول</span>
                                </div>
                            )}
                            {additionalFees > 0 && (
                                <div className="kitchen-invoice-table-row">
                                    <span>رسوم فنية إضافية يدوية</span>
                                    <span className="font-mono text-zinc-900">{additionalFees.toLocaleString()} {currency}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Final sum invoice total */}
                <div className="kitchen-invoice-total">
                    <div className="flex justify-between items-center text-xs text-zinc-500" dir="rtl">
                        <span>المجموع الفرعي (Subtotal):</span>
                        <span className="font-mono">{subtotal.toLocaleString()} {currency}</span>
                    </div>
                    {customDiscount > 0 && (
                        <div className="flex justify-between items-center text-xs text-emerald-600 font-bold" dir="rtl">
                            <span>خصم المعرض الخاص ({customDiscount}%):</span>
                            <span className="font-mono">-{discountAmount.toLocaleString()} {currency}</span>
                        </div>
                    )}
                    <div className="bg-zinc-100 p-3 rounded-lg flex justify-between items-center" dir="rtl">
                        <span className="text-xs font-black text-zinc-900">إجمالي عرض السعر النهائي:</span>
                        <span className="text-base font-black text-zinc-950 font-mono">{grandTotal.toLocaleString()} {currency}</span>
                    </div>

                    <div className="text-[9px] text-zinc-400 text-center leading-relaxed" dir="rtl">
                        * يسري هذا العرض لمدة 14 يوماً من تاريخ الإصدار. السعر المذكور تقديري ومبني على القياسات المدخلة. يتم تأكيد السعر النهائي بعد رفع مهندسينا للمقاسات الفعلية للموقع مجاناً.
                    </div>
                </div>
            </div>
        </div>
    );
}
