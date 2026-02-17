import Project from '../../src/models/Project';

export async function up() {
    console.log("Backfilling Project defaults...");
    
    const result = await Project.updateMany(
        { $or: [{ status: { $exists: false } }, { progress: { $exists: false } }] },
        { 
            $set: { 
                status: 'Draft',
                progress: 0
            } 
        }
    );

    console.log(`Updated ${result.modifiedCount} projects.`);
}
