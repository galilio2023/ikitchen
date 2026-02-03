import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Kitchen from "@/models/Kitchen";
import { IObstacle, IAppliance } from "@/types/kitchen";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params; // This is the projectId (kitchenId in slice logic uses _id or id, but route is /projects/[id]/design)

    // Wait, the slice uses kitchenId.
    // const kitchenId = state.kitchen.currentKitchen?._id || state.kitchen.currentKitchen?.id;
    // fetch(`/api/projects/${kitchenId}/design`...
    
    // If the ID passed is the Kitchen ID (which is usually the Project ID in this app's logic, or linked), we need to be sure.
    // In Kitchen model: projectId is a ref.
    // In Project model: _id is the project ID.
    
    // The fetchKitchenById thunk uses /api/projects/${id}.
    // And returns { project, kitchen }.
    
    // If the slice passes kitchen._id, that's the Kitchen document ID.
    // But the route is /api/projects/[id]/design.
    // Usually [id] in /api/projects/[id] refers to Project ID.
    
    // Let's check if we can find the kitchen by _id OR projectId.
    
    const body = await request.json();
    const { generatedDesign, applyUnitsAsObstacles } = body;

    if (!generatedDesign) {
      return NextResponse.json(
        { error: "No design data provided" },
        { status: 400 },
      );
    }

    // Find kitchen by Project ID (assuming [id] is projectId) OR by _id if it matches
    let kitchen = await Kitchen.findOne({ projectId: id });
    if (!kitchen) {
        // Fallback: try to find by _id if the passed ID was actually the kitchen ID
        kitchen = await Kitchen.findById(id);
    }

    if (!kitchen) {
      return NextResponse.json({ error: "Kitchen not found" }, { status: 404 });
    }

    const updates: any = {
      generatedDesign: generatedDesign,
    };

    if (applyUnitsAsObstacles && generatedDesign.units) {
      // Convert AI units to obstacles/appliances
      // This is a simplified conversion. You might need more complex logic.
      
      const newObstacles: IObstacle[] = [];
      const newAppliances: IAppliance[] = [];

      generatedDesign.units.forEach((unit: any, index: number) => {
        // Basic mapping
        if (['window', 'door', 'socket', 'vent', 'pipe', 'pillar', 'radiator', 'clearance'].includes(unit.type)) {
             newObstacles.push({
                id: unit.id || `ai-obs-${index}-${Date.now()}`,
                type: unit.type,
                wallIndex: unit.wallIndex,
                position: unit.position
             });
        } else if (unit.type === 'cabinet') {
            // Treat cabinets as obstacles for now or ignore?
            // If we want to visualize them, maybe add them as 'clearance' or a new type if supported.
            // For now, let's assume they are not obstacles unless specified.
            // But the user might want to see them.
            // The prompt said "applyUnitsAsObstacles: true".
            
            // If the type is 'cabinet', we might not have a matching obstacle type.
            // But we can add it as 'clearance' or just skip if not supported.
            // Let's skip cabinets for obstacles array to avoid validation errors, 
            // unless we have a 'cabinet' type in ObstacleType (we don't).
        } else {
             // Assume appliance
             newAppliances.push({
                 name: unit.type,
                 wallIndex: unit.wallIndex,
                 position: unit.position,
                 isFixed: false
             });
        }
      });

      // Merge or replace? The requirement implies applying the design.
      // Usually this means adding to existing or replacing.
      // Let's append for now to avoid losing existing data, or maybe replace if it's a full layout generation.
      // Given "generateLayout", it likely proposes a full layout.
      // But let's be safe and just add them, or maybe the user clears first.
      // For this implementation, I will append.
      
      if (newObstacles.length > 0) {
          updates.obstacles = [...(kitchen.obstacles || []), ...newObstacles];
      }
      if (newAppliances.length > 0) {
          updates.appliances = [...(kitchen.appliances || []), ...newAppliances];
      }
    }

    const updatedKitchen = await Kitchen.findByIdAndUpdate(
      kitchen._id,
      { $set: updates },
      { new: true },
    );

    return NextResponse.json({ success: true, kitchen: updatedKitchen });
  } catch (error) {
    console.error("Design Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update design" },
      { status: 500 },
    );
  }
}
