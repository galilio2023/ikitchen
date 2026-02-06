// scripts/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../src/models/Project';
import Kitchen from '../src/models/Kitchen';

dotenv.config({ path: '.env.local' });

async function seedDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    console.log("Clearing existing data...");
    await Project.deleteMany({});
    await Kitchen.deleteMany({});

    console.log("Creating seed project...");
    const project = await Project.create({
      name: "Demo Project",
      client: "John Doe",
      status: "designing",
      progress: 25,
    });

    await Kitchen.create({
      projectId: project._id,
      clientName: "John Doe",
      phone: "123-456-7890",
      walls: [
        { id: 'wall-1', label: 'Main Wall', length: 400, height: 240, thickness: 10 },
        { id: 'wall-2', label: 'Island Wall', length: 200, height: 90, thickness: 10 },
      ],
      obstacles: [
        { id: 'window-1', type: 'window', wallIndex: 0, position: { x: 100, y: 90, z: 0, width: 120, height: 100, depth: 20 } }
      ]
    });

    console.log("Database seeded successfully!");

  } catch (error) {
    console.error("Failed to seed database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedDatabase();
