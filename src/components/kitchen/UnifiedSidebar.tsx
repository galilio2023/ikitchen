'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Hammer, Settings2, Info } from 'lucide-react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { cn } from '@/lib/utils';

import WallManager from './WallManager';
import SpatialRegistry from './SpatialRegistry';
import ObstacleToolbox from './ObstacleToolbox';
import AiDesignPanel from './AiDesignPanel';
import VisualizationPanel from './VisualizationPanel';
import SpatialInspector from './SpatialInspector';
import ProjectInfo from '../project-details/ProjectInfo';

type Tab = 'scene' | 'add' | 'inspect' | 'info';

export default function UnifiedSidebar() {
    const { 
        currentKitchen, 
        currentProject, 
        selectedObstacleId, 
        activeWallIndex,
        setSelectedObstacle 
    } = useKitchenStore(state => state);
    
    const [activeTab, setActiveTab] = useState<Tab>('inspect');

    const renderableNodes = React.useMemo(() => {
        if (!currentKitchen) return [];
        const obstacles = (currentKitchen.obstacles ?? []).map((obs, index) => ({
            ...obs, isAppliance: false, id: obs.id || (obs as any)._id?.toString() || `obs-${index}`
        }));
        const appliances = (currentKitchen.appliances ?? []).map((app, index) => ({
            ...app, type: 'appliance' as const, isAppliance: true, id: (app as any)._id?.toString() || (app as any).id || `app-${index}`
        }));
        return [...obstacles, ...appliances];
    }, [currentKitchen]);

    const selectedNode = renderableNodes.find(n => n.id === selectedObstacleId) || null;

    useEffect(() => {
        if (selectedObstacleId) {
            setActiveTab('inspect');
        }
    }, [selectedObstacleId]);

    const TabButton = ({ tab, icon, label }: { tab: Tab, icon: React.ReactNode, label: string }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 p-3 text-xs font-bold uppercase tracking-wider transition-colors",
                activeTab === tab ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-accent"
            )}
        >
            {icon}
            {label}
        </button>
    );

    const hasAppliedLayout = currentKitchen && currentKitchen.appliances && currentKitchen.appliances.length > 0;

    return (
        <aside className="w-full lg:w-96 flex-none border-l flex flex-col bg-card h-full overflow-hidden">
            <div className="flex-none flex items-center border-b">
                <TabButton tab="scene" icon={<Layers size={16} />} label="Scene" />
                <TabButton tab="add" icon={<Hammer size={16} />} label="Add" />
                <TabButton tab="inspect" icon={<Settings2 size={16} />} label="Inspect" />
                <TabButton tab="info" icon={<Info size={16} />} label="Info" />
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
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
                    selectedNode ? (
                        <SpatialInspector selectedNode={selectedNode} />
                    ) : (
                        <>
                            <AiDesignPanel />
                            {hasAppliedLayout && <VisualizationPanel />}
                        </>
                    )
                )}
                {activeTab === 'info' && currentProject && (
                    <div className="space-y-6">
                        <ProjectInfo project={currentProject} kitchen={currentKitchen} />
                    </div>
                )}
            </div>
        </aside>
    );
}
