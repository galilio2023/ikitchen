// src/app/api/projects/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Kitchen from '@/models/Kitchen';
import Project from '@/models/Project';

const SEED_DATA = [
    {
        name: "NEURAL_KITCHEN_ALPHA",
        client: "ALPHA_CORP",
        status: "designing",
        progress: 85,
        img: "https://images.unsplash.com/photo-1556911220-e15224bbafb0",
        url: "https://example.com/alpha",
        github: "https://github.com/alpha",
        stars: 12,
        tags: ["featured", "neural", "obsidian"]
    },
    {
        name: "OBSIDIAN_CORE_BETA",
        client: "BETA_SYSTEMS",
        status: "measuring",
        progress: 40,
        img: "https://images.unsplash.com/photo-1556909212-d5b604ad0567",
        url: "https://example.com/beta",
        github: "https://github.com/beta",
        stars: 8,
        tags: ["standard", "compact", "glass"]
    },
    {
        name: "VOYAGER_NODE_GAMMA",
        client: "GAMMA_LABS",
        status: "installed",
        progress: 100,
        img: "https://images.unsplash.com/photo-1484154218962-a197022b5858",
        url: "https://example.com/gamma",
        github: "https://github.com/gamma",
        stars: 25,
        tags: ["standard", "minimalist", "high-spec"]
    }
];

export async function GET() {
    try {
        if (!process.env.MONGODB_URI) {
            return NextResponse.json([], { status: 200 });
        }

        const connectionTimeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('DATABASE_HANDSHAKE_TIMEOUT')), 10000)
        );

        const fetchData = async () => {
            await dbConnect();
            
            // 1. Check if we need to seed
            const count = await Project.countDocuments();
            if (count === 0) {
                console.log('🌱 [SYSTEM]: Clusters Empty. Initiating Auto-Seed...');
                for (const seed of SEED_DATA) {
                    const project = await Project.create(seed);
                    await Kitchen.create({
                        ...seed,
                        clientName: seed.client,
                        phone: "555-NODE-SYNC",
                        projectId: project._id,
                        walls: [{ label: 'Wall 1', length: 400, height: 240, thickness: 10 }],
                        standards: { baseCabinetDepth: 60, wallCabinetDepth: 35, countertopThickness: 4, kickplateHeight: 10 }
                    });
                }
            }

            return await Project.find({}).sort({ updatedAt: -1 }).lean();
        };

        const projects = await Promise.race([fetchData(), connectionTimeout]);
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();

        // 1. Create Project
        const project = await Project.create({
            name: data.clientName,
            client: data.clientName,
            status: data.status || 'draft',
            progress: data.progress || 0,
            img: data.img,
            tags: data.tags
        });

        // 2. Create Kitchen
        const kitchen = await Kitchen.create({
            ...data,
            projectId: project._id,
            walls: data.walls || [{ label: 'Wall 1', length: 300, height: 240, thickness: 10 }],
            standards: data.standards || { baseCabinetDepth: 60, wallCabinetDepth: 35, countertopThickness: 4, kickplateHeight: 10 }
        });

        return NextResponse.json({ ...kitchen.toObject(), id: project._id.toString() });
    } catch (error) {
        return NextResponse.json({ error: "INITIALIZATION_FAILED" }, { status: 500 });
    }
}