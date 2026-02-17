'use client';

import React, { useMemo } from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { Receipt, Download, DollarSign, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BomPanel() {
    const { currentKitchen } = useKitchenStore(state => state);

    const bomData = useMemo(() => {
        if (!currentKitchen) return { items: [], total: 0 };

        const items: { name: string; type: string; count: number; unitPrice: number; total: number }[] = [];
        let grandTotal = 0;

        const applianceMap = new Map<string, number>();
        currentKitchen.appliances?.forEach(app => {
            applianceMap.set(app.name, (applianceMap.get(app.name) || 0) + 1);
        });

        applianceMap.forEach((count, name) => {
            const unitPrice = 500; 
            const total = count * unitPrice;
            items.push({ name, type: 'Appliance', count, unitPrice, total });
            grandTotal += total;
        });

        const totalWallLength = currentKitchen.walls?.reduce((acc, wall) => acc + wall.length, 0) || 0;
        if (totalWallLength > 0) {
            const cabinetCostPerMeter = 300;
            const cabinetTotal = (totalWallLength / 100) * cabinetCostPerMeter;
            items.push({ 
                name: 'Base Cabinetry (Est.)', 
                type: 'Cabinet', 
                count: Math.round(totalWallLength / 60), 
                unitPrice: 180, 
                total: cabinetTotal 
            });
            grandTotal += cabinetTotal;
        }

        return { items, total: grandTotal };
    }, [currentKitchen]);

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Item,Type,Quantity,Unit Price,Total Price\n"
            + bomData.items.map(e => `${e.name},${e.type},${e.count},${e.unitPrice},${e.total}`).join("\n")
            + `\n,,,Grand Total,${bomData.total}`;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "kitchen_bom.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!currentKitchen) return <div className="p-4 text-muted-foreground text-sm">No kitchen data available.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Receipt size={20} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold">Bill of Materials</h2>
                        <p className="text-xs text-muted-foreground">Estimated costs & quantities</p>
                    </div>
                </div>
                <button 
                    onClick={handleExport}
                    className="btn btn-sm btn-outline gap-2 h-8 text-xs"
                    title="Export to CSV"
                >
                    <Download size={14} />
                    Export
                </button>
            </div>

            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-semibold">Item</th>
                                <th className="p-4 text-right font-semibold">Qty</th>
                                <th className="p-4 text-right font-semibold">Price</th>
                                <th className="p-4 text-right font-semibold">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {bomData.items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-foreground">{item.name}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <Package size={10} />
                                            {item.type}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-mono text-muted-foreground">{item.count}</td>
                                    <td className="p-4 text-right font-mono text-muted-foreground">${item.unitPrice}</td>
                                    <td className="p-4 text-right font-mono font-medium text-foreground">${item.total.toFixed(2)}</td>
                                    </tr>
                            ))}
                            {bomData.items.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                        No items in the design yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="bg-muted/30 p-4 border-t flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Estimated Total</span>
                    <div className="text-xl font-bold text-primary flex items-center gap-1">
                        <DollarSign size={18} className="text-primary/70" />
                        {bomData.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            <div className="text-[10px] text-muted-foreground bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 p-3 rounded-lg">
                <p><strong>Note:</strong> Prices are estimates based on standard market rates. Final costs may vary based on material selection, installation complexity, and location.</p>
            </div>
        </div>
    );
}
