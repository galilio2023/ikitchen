'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Hammer, Settings2, Info, Receipt } from 'lucide-react';
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

    const selectedNode = renderableNodes.find(n => n.id === selectedObstacleId) || null;

    useEffect(() => {
        if (selectedObstacleId) {
            setActiveTab('inspect');
        }
    }, [selectedObstacleId]);

    // Automatically switch to 'add' tab if a tool is selected
    useEffect(() => {
        if (activeTool) {
            setActiveTab('add');
        }
    }, [activeTool]);

    const TabButton = ({ tab, icon, label }: { tab: Tab, icon: React.ReactNode, label: string }) => (
        <button
            onClick={() => setActiveTab(tab)}
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
        <aside className="w-full lg:w-96 flex-none border-l flex flex-col bg-background/80 backdrop-blur-md h-full overflow-hidden shadow-xl z-20">
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
    );
}
