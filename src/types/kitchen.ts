export interface ICoordinate {
    x: number;      // Distance from the left corner of the wall
    y: number;      // Distance from the floor
    z: number;      // Depth offset (distance from wall face)
    width: number;
    height: number;
    depth: number;  // The volume thickness of the object
}

export interface IWall {
    label: string;
    length: number;    // Width of the wall in cm
    height: number;    // Usually 240cm standard
    thickness: number; // Wall thickness (usually 10-20cm)
}

export type ObstacleType =
    | 'window'
    | 'door'
    | 'socket'
    | 'pipe'
    | 'pillar'
    | 'radiator'
    | 'clearance'; // 'clearance' marks space that must stay empty

export interface IObstacle {
    type: ObstacleType;
    wallIndex: number; // Links this obstacle to a specific wall in the array
    position: ICoordinate;
}

export interface IAppliance {
    name: string;
    wallIndex: number;
    position: ICoordinate;
    isFixed: boolean; // True if the kitchen man says this cannot move
}

export interface IKitchenStandards {
    baseCabinetDepth: number;
    wallCabinetDepth: number;
    countertopThickness: number;
    kickplateHeight: number;
}

export interface IKitchen {
    _id?: string; // MongoDB Document ID
    clientName: string;
    phone: string;
    address?: string;
    status: 'draft' | 'measuring' | 'designing' | 'ordered' | 'installed';

    // The 3D Structure
    walls: IWall[];
    obstacles: IObstacle[];
    appliances: IAppliance[];

    // Custom "Rules" for this specific kitchen
    standards: IKitchenStandards;

    // Project Metadata
    totalPrice: number;
    material?: string;
    color?: string;

    // Serialized dates for Next.js 16 Server-to-Client communication
    createdAt?: string | Date;
    updatedAt?: string | Date;
}