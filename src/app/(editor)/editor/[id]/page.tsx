import React from "react";
import { ChevronLeft, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { getProjectWithKitchen } from "@/services/projectService";

import KitchenEditor from "@/components/kitchen/KitchenEditor";
import SignalLost from "@/components/ui/SignalLost";
import { KitchenStoreProvider } from "@/providers/KitchenStoreProvider";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(`[EditorPage] Loading project: ${id}`);

  if (!id) {
    console.error("[EditorPage] No ID provided");
    return <SignalLost error="Project ID not found in URL." />;
  }

  try {
    const data = await getProjectWithKitchen(id);
    
    if (!data) {
      console.error(`[EditorPage] Project ${id} not found in DB`);
      return <SignalLost error={`Project with ID "${id}" could not be found.`} />;
    }

    console.log(`[EditorPage] Loaded project: ${data.project.client}`);

    return (
      <div className="h-full flex flex-col overflow-hidden bg-background">
        <header className="flex-none flex items-center justify-between px-6 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
          <div className="flex items-center gap-4">
            <Link
              href="/projects"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} />
              Back
            </Link>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <LayoutTemplate size={16} className="text-primary" />
              <h1 className="text-sm font-bold text-foreground">
                {data.project.client || "Untitled Project"}
              </h1>
              <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                {data.project.status || "Draft"}
              </span>
            </div>
          </div>
        </header>

        <KitchenStoreProvider
          initialState={{
            currentProject: data.project,
            currentKitchen: data.kitchen,
          }}
        >
          <KitchenEditor />
        </KitchenStoreProvider>
      </div>
    );
  } catch (error) {
    console.error("[EditorPage] Error loading project:", error);
    return <SignalLost error="An unexpected error occurred while loading the project." />;
  }
}
