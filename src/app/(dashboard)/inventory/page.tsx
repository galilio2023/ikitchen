"use client";

import React from "react";
import { Database, Package, Truck, ShieldCheck, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InventoryPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <Database size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Material Inventory
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            Track stock levels, suppliers, and resource allocation.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Items",
            count: 42,
            icon: Package,
            color: "text-blue-500 bg-blue-500/10",
          },
          {
            label: "Low Stock",
            count: 3,
            icon: AlertTriangle,
            color: "text-amber-500 bg-amber-500/10",
          },
          {
            label: "Active Suppliers",
            count: 12,
            icon: Truck,
            color: "text-emerald-500 bg-emerald-500/10",
          },
          {
            label: "Quality Score",
            count: "98%",
            icon: ShieldCheck,
            color: "text-purple-500 bg-purple-500/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-muted/30">
          <h2 className="font-semibold">Stock Registry</h2>
        </div>
        <div className="py-20 px-6 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Inventory Sync Required</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            Connect your ERP system or upload a CSV to populate the inventory database.
          </p>
          <Button variant="outline">
            Establish Supply Link
          </Button>
        </div>
      </div>
    </div>
  );
}
