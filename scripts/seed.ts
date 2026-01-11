import mongoose from 'mongoose';
// ADD THE .ts EXTENSION HERE
import Project from '../src/models/Project';
import Kitchen from '../src/models/Kitchen';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local in the root
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

const PROJECT_ID = new mongoose.Types.ObjectId();

const SEED_PROJECT = {
    _id: PROJECT_ID,
    name: "Residence Al Maadi - Unit 402",
    client: "Ahmed Mansour",
    status: "Designing",
    progress: 45,
};

const SEED_KITCHEN = {
    projectId: PROJECT_ID,
    clientName: "Ahmed Mansour",
    phone: "+20123456789",
    status: 'designing',
    walls: [
        { id: "wall_a", label: 'Wall A', length: 350, height: 240, thickness: 10 },
        { id: "wall_b", label: 'Wall B', length: 400, height: 240, thickness: 10 },
        { id: "wall_c", label: 'Wall C', length: 350, height: 240, thickness: 10 },
        { id: "wall_d", label: 'Wall D', length: 400, height: 240, thickness: 10 }
    ],
    obstacles: [
        {
            id: "obs_window_1",
            type: 'window',
            wallIndex: 0,
            position: { x: 100, y: 110, z: 0, width: 120, height: 100, depth: 10 }
        }
    ],
    appliances: [],
    standards: {
        baseCabinetDepth: 60,
        wallCabinetDepth: 35,
        countertopThickness: 4,
        kickplateHeight: 10
    },
    totalPrice: 150000
};

async function seed() {
    try {
        console.log('⏳ [SYSTEM]: Connecting to Cluster...');
        await mongoose.connect(MONGODB_URI!);

        console.log('🧹 [SYSTEM]: Purging existing Nodes...');
        await Project.deleteMany({});
        await Kitchen.deleteMany({});

        console.log('📡 [SYSTEM]: Injecting Project Registry...');
        await Project.create(SEED_PROJECT);

        console.log('📐 [SYSTEM]: Constructing Kitchen Spatial Data...');
        await Kitchen.create(SEED_KITCHEN);

        console.log('\n🎉 [SUCCESS]: Database Seeded Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ [CRITICAL ERROR]: Seed Failure:');
        console.error(error);
        process.exit(1);
    }
}

seed();