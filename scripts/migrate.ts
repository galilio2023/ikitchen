import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Migration from '../src/models/Migration';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

async function runMigrations() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        console.error("Missing MONGODB_URI");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for migrations.");

        const migrationsDir = path.join(__dirname, 'migrations');
        if (!fs.existsSync(migrationsDir)) {
            fs.mkdirSync(migrationsDir);
        }

        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.ts') || f.endsWith('.js')).sort();
        
        for (const file of files) {
            const migrationName = file;
            const alreadyRun = await Migration.findOne({ name: migrationName });

            if (alreadyRun) {
                console.log(`Skipping ${migrationName} (already executed)`);
                continue;
            }

            console.log(`Executing migration: ${migrationName}...`);
            const migration = require(path.join(migrationsDir, file));
            
            if (typeof migration.up !== 'function') {
                throw new Error(`Migration ${migrationName} does not export an 'up' function.`);
            }

            await migration.up();
            await Migration.create({ name: migrationName });
            console.log(`Successfully executed ${migrationName}`);
        }

        console.log("All migrations completed.");

    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

runMigrations();
