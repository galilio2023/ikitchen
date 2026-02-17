"use client";

import React from "react";
import { Database, Package, Truck, ShieldCheck, AlertTriangle, ArrowUpRight, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/40">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-sm">
              <Database size={28} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Material Inventory
            </h1>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl">
            Real-time tracking of stock levels, supplier logistics, and resource allocation.
          </p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
                <Truck size={16} />
                Suppliers
            </Button>
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Package size={16} />
                Add Item
            </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Items",
            value: "1,248",
            icon: Package,
            color: "blue",
            trend: "+12%",
          },
          {
            label: "Low Stock Alerts",
            value: "3",
            icon: AlertTriangle,
            color: "amber",
            trend: "Action Needed",
          },
          {
            label: "Active Suppliers",
            value: "12",
            icon: Truck,
            color: "emerald",
            trend: "Stable",
          },
          {
            label: "Quality Score",
            value: "98.5%",
            icon: ShieldCheck,
            color: "purple",
            trend: "+0.5%",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl p-6 bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            <div className={cn(
                "absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                stat.color === 'blue' && "bg-blue-500",
                stat.color === 'amber' && "bg-amber-500",
                stat.color === 'emerald' && "bg-emerald-500",
                stat.color === 'purple' && "bg-purple-500",
            )} />
            
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</h3>
                <div className={cn(
                    "p-2 rounded-lg",
                    stat.color === 'blue' && "bg-blue-500/10 text-blue-600",
                    stat.color === 'amber' && "bg-amber-500/10 text-amber-600",
                    stat.color === 'emerald' && "bg-emerald-500/10 text-emerald-600",
                    stat.color === 'purple' && "bg-purple-500/10 text-purple-600",
                )}>
                    <stat.icon size={18} />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    stat.label === "Low Stock Alerts" 
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                )}>
                    {stat.trend}
                </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-6 border-b bg-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Stock Registry</h2>
          <div className="flex gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                    type="text" 
                    placeholder="Search inventory..." 
                    className="pl-9 pr-4 py-2 text-sm bg-background border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>
            <Button variant="outline" size="icon">
                <Filter size={16} />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 relative">
            {/* Mock Table Background */}
            <div className="absolute inset-0 opacity-30 pointer-events-none blur-[1px]">
                <div className="grid grid-cols-5 gap-4 p-6 border-b text-sm font-medium text-muted-foreground">
                    <div>Item Name</div>
                    <div>SKU</div>
                    <div>Category</div>
                    <div>Stock</div>
                    <div>Status</div>
                </div>
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="grid grid-cols-5 gap-4 p-6 border-b text-sm text-muted-foreground/50">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                    </div>
                ))}
            </div>

            {/* CTA Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-card via-card/80 to-transparent">
                <div className="p-8 rounded-2xl bg-background/80 backdrop-blur-xl border shadow-xl text-center max-w-md">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400">
                        <Database size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Connect Your Data Source</h3>
                    <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                        Sync your inventory from an external ERP system or upload a CSV file to populate the dashboard with real-time data.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                            <ArrowUpRight size={16} />
                            Connect ERP System
                        </Button>
                        <Button variant="outline" className="w-full">
                            Upload CSV
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
