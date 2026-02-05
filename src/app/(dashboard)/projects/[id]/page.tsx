import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import Kitchen from '@/models/Kitchen';
import Project from '@/models/Project';

import KitchenEditor from '@/components/kitchen/KitchenEditor';
import SignalLost from '@/components/ui/SignalLost';
import { KitchenStoreProvider } from '@/providers/KitchenStoreProvider';

async function getProjectData(projectId: string) {
    await dbConnect();
    const project = await Project.findById(projectId).lean();
    const kitchen = await Kitchen.findOne({ projectId: projectId }).lean();

    if (!project || !kitchen) {
        return null;
    }

    return {
        project: JSON.parse(JSON.stringify(project)),
        kitchen: JSON.parse(JSON.stringify(kitchen)),
    };
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!id) {
        return <SignalLost error="Project ID not found in URL." />;
    }

    const data = await getProjectData(id);

    if (!data) {
        return <SignalLost error={`Project with ID "${id}" could not be found.`} />;
    }
    
    return (
        <div className="h-full flex flex-col overflow-hidden bg-background">
            <header className="flex-none flex items-center justify-between px-6 h-16 border-b">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft size={16} />
                    Back to Dashboard
                </Link>
            </header>
            
            <KitchenStoreProvider 
                initialState={{ 
                    currentProject: data.project, 
                    currentKitchen: data.kitchen 
                }}
            >
                <KitchenEditor />
            </KitchenStoreProvider>
        </div>
    );
}
