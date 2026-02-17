'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Hammer, Settings2, Info, Receipt, ChevronDown, ChevronUp } from 'lucide-react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { selectRenderableNodes } from '@/lib/store/kitchenStore';
import { cn } from '@/lib/utils';

import WallManager from './WallManager';
import SpatialRegistry from './SpatialRegistry';
import ObstacleToolbox from './ObstacleToolbox';
import AiDesignPanel from './AiDesignPanel';
import VisualizationPanel from './VisualizationPanel';
import SpatialInspector from './SpatialInspector';
import ProjectInfo from '../project-details/ProjectInfo';
import BomPanel from './BomPanel';

type Tab = 'scene' | 'add' | 'inspect' | 'info' | 'bom';

export default function UnifiedSidebar() {
    const { 
        currentKitchen, 
        currentProject, 
        selectedObstacleId, 
        activeWallIndex,
        setSelectedObstacle,
        activeTool
    } = useKitchenStore(state => state);
    
    const renderableNodes = useKitchenStore(selectRenderableNodes);
    
    const [activeTab, setActiveTab] = useState<Tab>('inspect');
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const selectedNode = renderableNodes.find(n => n.id === selectedObstacleId) || null;

    useEffect(() => {
        if (selectedObstacleId) {
            setActiveTab('inspect');
            setIsMobileOpen(true); // Auto-open on selection
        }
    }, [selectedObstacleId]);

    useEffect(() => {
        if (activeTool) {
            setActiveTab('add');
            setIsMobileOpen(true);
        }
    }, [activeTool]);

    const TabButton = ({ tab, icon, label }: { tab: Tab, icon: React.ReactNode, label: string }) => (
        <button
            onClick={() => {
                setActiveTab(tab);
                setIsMobileOpen(true);
            }}
            className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 p-3 text-xs font-bold uppercase tracking-wider transition-all duration-200",
                activeTab === tab 
                    ? "text-primary bg-primary/10 border-b-2 border-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground border-b-2 border-transparent"
            )}
        >
            {icon}
            {label}
        </button>
    );

    const hasAppliedLayout = currentKitchen && currentKitchen.appliances && currentKitchen.appliances.length > 0;

    return (
        <>
            {/* Mobile Toggle Handle */}
            <div 
                className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-background border-t flex flex-col shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
                style={{ height: isMobileOpen ? '50vh' : 'auto' }}
            >
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    <span className="text-xs font-bold uppercase text-muted-foreground">Editor Tools</span>
                    <button className="p-1">
                        {isMobileOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>
                </div>

                {/* Tabs are always visible on mobile bottom */}
                <div className="flex-none flex items-center border-b bg-background">
                    <TabButton tab="scene" icon={<Layers size={16} />} label="Scene" />
                    <TabButton tab="add" icon={<Hammer size={16} />} label="Add" />
                    <TabButton tab="inspect" icon={<Settings2 size={16} />} label="Inspect" />
                    <TabButton tab="bom" icon={<Receipt size={16} />} label="BOM" />
                    <TabButton tab="info" icon={<Info size={16} />} label="Info" />
                </div>

                {/* Content Area (only visible when open) */}
                {isMobileOpen && (
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-background">
                        {activeTab === 'scene' && (
                            <div className="space-y-6">
                                <WallManager />
                                <SpatialRegistry nodes={renderableNodes} selectedId={selectedObstacleId} onSelect={setSelectedObstacle} />
                            </div>
                        )}
                        {activeTab === 'add' && (
                            <ObstacleToolbox wallIndex={activeWallIndex} />
                        )}
                        {activeTab === 'inspect' && (
                            <div>
                                {selectedNode ? (
                                    <SpatialInspector selectedNode={selectedNode} />
                                ) : (
                                    <>
                                        <AiDesignPanel />
                                        {hasAppliedLayout && <VisualizationPanel />}
                                    </>
                                )}
                            </div>
                        )}
                        {activeTab === 'bom' && <BomPanel />}
                        {activeTab === 'info' && currentProject && (
                            <ProjectInfo project={currentProject} kitchen={currentKitchen} />
                        )}
                    </div>
                )}
            </div>

            {/* Desktop Sidebar (Unchanged) */}
            <aside className="hidden lg:flex w-96 flex-none border-l flex-col bg-background/80 backdrop-blur-md h-full overflow-hidden shadow-xl z-20">
                <div className="flex-none flex items-center border-b bg-background/50">
                    <TabButton tab="scene" icon={<Layers size={16} />} label="Scene" />
                    <TabButton tab="add" icon={<Hammer size={16} />} label="Add" />
                    <TabButton tab="inspect" icon={<Settings2 size={16} />} label="Inspect" />
                    <TabButton tab="bom" icon={<Receipt size={16} />} label="BOM" />
                    <TabButton tab="info" icon={<Info size={16} />} label="Info" />
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {activeTab === 'scene' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <WallManager />
                            <SpatialRegistry nodes={renderableNodes} selectedId={selectedObstacleId} onSelect={setSelectedObstacle} />
                        </div>
                    )}
                    {activeTab === 'add' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <ObstacleToolbox wallIndex={activeWallIndex} />
                        </div>
                    )}
                    {activeTab === 'inspect' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            {selectedNode ? (
                                <SpatialInspector selectedNode={selectedNode} />
                            ) : (
                                <>
                                    <AiDesignPanel />
                                    {hasAppliedLayout && <VisualizationPanel />}
                                </>
                            )}
                        </div>
                    )}
                    {activeTab === 'bom' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <BomPanel />
                        </div>
                    )}
                    {activeTab === 'info' && currentProject && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <ProjectInfo project={currentProject} kitchen={currentKitchen} />
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
