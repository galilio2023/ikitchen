'use client';

import React, { useMemo } from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { Receipt, Download, DollarSign } from 'lucide-react';

export default function BomPanel() {
    const { currentKitchen } = useKitchenStore(state => state);

    const bomData = useMemo(() => {
        if (!currentKitchen) return { items: [], total: 0 };

        const items: { name: string; type: string; count: number; unitPrice: number; total: number }[] = [];
        let grandTotal = 0;

        // Process Appliances
        const applianceMap = new Map<string, number>();
        currentKitchen.appliances?.forEach(app => {
            applianceMap.set(app.name, (applianceMap.get(app.name) || 0) + 1);
        });

        applianceMap.forEach((count, name) => {
            // Mock pricing logic - in a real app, this would come from a database
            const unitPrice = 500; 
            const total = count * unitPrice;
            items.push({ name, type: 'Appliance', count, unitPrice, total });
            grandTotal += total;
        });

        // Process Obstacles (e.g., windows, doors as cost items if needed, or just cabinets if we had them)
        // For this MVP, we'll assume obstacles don't have a direct cost in the BOM unless they are specific types
        // But let's add a base cost for "Cabinetry" based on wall length as a placeholder for generated cabinets
        
        const totalWallLength = currentKitchen.walls?.reduce((acc, wall) => acc + wall.length, 0) || 0;
        if (totalWallLength > 0) {
            const cabinetCostPerMeter = 300;
            const cabinetTotal = (totalWallLength / 100) * cabinetCostPerMeter;
            items.push({ 
                name: 'Base Cabinetry (Est.)', 
                type: 'Cabinet', 
                count: Math.round(totalWallLength / 60), // Approx 60cm units
                unitPrice: 180, // Approx per unit
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

    if (!currentKitchen) return <div className="p-4 text-muted-foreground">No kitchen data available.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <Receipt size={20} className="text-primary" />
                    Bill of Materials
                </h2>
                <button 
                    onClick={handleExport}
                    className="btn btn-sm btn-outline gap-2"
                    title="Export to CSV"
                >
                    <Download size={14} />
                    Export
                </button>
            </div>

            <div className="bg-card border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground font-medium">
                        <tr>
                            <th className="p-3">Item</th>
                            <th className="p-3 text-right">Qty</th>
                            <th className="p-3 text-right">Price</th>
                            <th className="p-3 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {bomData.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-muted/50">
                                <td className="p-3">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">{item.type}</div>
                                </td>
                                <td className="p-3 text-right">{item.count}</td>
                                <td className="p-3 text-right">${item.unitPrice}</td>
                                <td className="p-3 text-right font-medium">${item.total.toFixed(2)}</td>
                            </tr>
                        ))}
                        {bomData.items.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-6 text-center text-muted-foreground">
                                    No items in the design yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot className="bg-muted/50 font-bold">
                        <tr>
                            <td colSpan={3} className="p-3 text-right">Estimated Total</td>
                            <td className="p-3 text-right text-primary flex items-center justify-end gap-1">
                                <DollarSign size={14} />
                                {bomData.total.toFixed(2)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                <p><strong>Note:</strong> Prices are estimates based on standard market rates. Final costs may vary based on material selection, installation, and location.</p>
            </div>
        </div>
    );
}
