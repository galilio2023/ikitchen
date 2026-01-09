import mongoose from 'mongoose';
import Project from '../src/models/Project';
import Kitchen from '../src/models/Kitchen';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SEED_DATA = {
    name: "Residence Al Maadi - Unit 402",
    client: "Ahmed Mansour",
    status: "Designing" as const,
    progress: 45,
};

async function seed() {
    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected.');

        // 1. Clear existing data (Smoke test)
        await Project.deleteMany({});
        await Kitchen.deleteMany({});

        // 2. Create the Project
        const newProject = await Project.create(SEED_DATA);
        console.log(`🚀 Project Created: ${newProject._id}`);

        // 3. Create the Kitchen design linked to Project
        await Kitchen.create({
            projectId: newProject._id,
            clientName: newProject.client,
            phone: "+20123456789",
            status: 'designing',
            walls: [
                { label: 'Wall A', length: 350, height: 240, thickness: 10 },
                { label: 'Wall B', length: 400, height: 240, thickness: 10 }
            ],
            obstacles: [{
                type: 'window',
                wallIndex: 0,
                position: { x: 100, y: 110, z: 0, width: 120, height: 100, depth: 10 }
            }],
            appliances: [{
                name: 'Fridge',
                wallIndex: 1,
                position: { x: 20, y: 0, z: 0, width: 70, height: 190, depth: 70 },
                isFixed: false
            }],
            standards: {
                baseCabinetDepth: 60,
                wallCabinetDepth: 35,
                countertopThickness: 4,
                kickplateHeight: 10
            },
            totalPrice: 150000
        });

        console.log('🎉 Database Seeded Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed Error:', error);
        process.exit(1);
    }
}

seed();