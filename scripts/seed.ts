import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log("Connected to database.");

    console.log("Clearing existing data...");
    await prisma.kitchen.deleteMany({});
    await prisma.project.deleteMany({});

    console.log("Creating seed project...");
    const project = await prisma.project.create({
      data: {
        name: "Demo Project",
        client: "John Doe",
        status: "designing",
        progress: 25,
      }
    });

    await prisma.kitchen.create({
      data: {
        projectId: project.id,
        clientName: "John Doe",
        phone: "123-456-7890",
        walls: [
          { id: 'wall-1', label: 'Main Wall', length: 400, height: 240, thickness: 10 },
          { id: 'wall-2', label: 'Island Wall', length: 200, height: 90, thickness: 10 },
        ],
        obstacles: [
          { id: 'window-1', type: 'window', wallIndex: 0, position: { x: 100, y: 90, z: 0, width: 120, height: 100, depth: 20 } }
        ]
      }
    });

    console.log("Database seeded successfully!");

  } catch (error) {
    console.error("Failed to seed database:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from database.");
  }
}

seedDatabase();
