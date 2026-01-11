'use client';

import React, { useEffect } from 'react'; // Added useEffect
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Share2, Save, Activity, Layers } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks'; // Added hooks
import { fetchProjects, setCurrentProject } from '@/lib/features/projects/projectSlice'; // Added actions

import ObstacleToolbox from '@/components/kitchen/ObstacleToolbox';
import SpatialEditor from '@/components/kitchen/SpatialEditor';

export default function ProjectEditorPage() {
    const params = useParams();
    const id = params.id as string;
    const dispatch = useAppDispatch();

    // 1. Get state from Redux
    const { items, currentProject, loading } = useAppSelector((state) => state.projects);

    // 2. Fetch data on mount
    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    // 3. Set the current project based on the URL ID
    useEffect(() => {
        if (items.length > 0 && id) {
            dispatch(setCurrentProject(id));
        }
    }, [items, id, dispatch]);

    return (
        <div className="p-6 lg:p-8 h-screen flex flex-col gap-6 overflow-hidden">
            {/* ... Your Header Code ... */}

            <header className="glass-brilliant px-8 py-5 rounded-[2.5rem] flex items-center justify-between border-white/5 relative z-20 shadow-2xl">
                {/* Keep your existing header content here */}
                {/* Tip: Use {currentProject?.clientName || 'Loading...'} in the title */}
            </header>

            <div className="flex-1 flex gap-6 min-h-0 relative">

                {/* 4. Pass the wallIndex to the toolbox (usually 0 for simple spatial edits) */}
                <ObstacleToolbox wallIndex={0} />

                <main className="flex-1 glass-brilliant rounded-[3rem] relative border border-white/5 flex flex-col overflow-hidden shadow-inner">
                    {/* SpatialEditor will now have access to currentProject via Redux */}
                    <SpatialEditor />
                </main>

                {/* ... Your Right Sidebar Code ... */}
            </div>
        </div>
    );
}