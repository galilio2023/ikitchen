import mongoose, { Schema, model, models } from 'mongoose';

const CoordinateSchema = new Schema({
    x: { type: Number, required: true, min: 0 },
    y: { type: Number, required: true, min: 0 },
    z: { type: Number, default: 0 },
    width: { type: Number, required: true, min: 1 },
    height: { type: Number, required: true, min: 1 },
    depth: { type: Number, required: true, min: 0 }
}, { _id: false }); // Disable _id for sub-documents to keep the DB light

const KitchenSchema = new Schema({
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    clientName: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    address: { type: String },
    status: {
        type: String,
        enum: ['draft', 'measuring', 'designing', 'ordered', 'installed'],
        default: 'draft'
    },
    img: String,
    url: String,
    github: String,
    stars: {
        type: Number,
        default: 0
    },
    tags: [String],

    walls: [{
        label: { type: String, default: 'Wall' },
        length: { type: Number, required: true },
        height: { type: Number, default: 240 },
        thickness: { type: Number, default: 10 }
        // Note: MongoDB will automatically generate an _id for each wall here
    }],

    obstacles: [{
        type: {
            type: String,
            enum: ['window', 'door', 'socket', 'vent', 'pipe', 'pillar', 'radiator', 'clearance'],
            required: true
        },
        // We'll use the index for now as per your UI logic,
        // but store it as wallIndex for consistency
        wallIndex: { type: Number, required: true },
        position: CoordinateSchema
    }],

    appliances: [{
        name: { type: String, required: true },
        wallIndex: { type: Number, required: true },
        position: CoordinateSchema,
        isFixed: { type: Boolean, default: false },
        brandModel: { type: String } // Helpful for technical cut-outs
    }],

    standards: {
        baseCabinetDepth: { type: Number, default: 60 },
        wallCabinetDepth: { type: Number, default: 35 },
        countertopThickness: { type: Number, default: 4 },
        kickplateHeight: { type: Number, default: 10 }
    },

    totalPrice: { type: Number, default: 0 },
    material: { type: String },
    color: { type: String }

}, { timestamps: true });

const Kitchen = models.Kitchen || model('Kitchen', KitchenSchema);
export default Kitchen;