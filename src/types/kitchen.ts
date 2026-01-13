export interface IKitchen {
    id: string;
    _id?: string;
    projectId: string;
    progress: number;
    clientName: string;
    phone: string;
    address?: string;
    status: 'draft' | 'measuring' | 'designing' | 'ordered' | 'installed';
    img?: string;
    url?: string;
    github?: string;
    stars?: number;
    tags?: string[];
    walls: IWall[];
    obstacles: IObstacle[];
    appliances: IAppliance[];
    standards: IKitchenStandards;
    totalPrice: number;
    material?: string;
    color?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export interface ICoordinate {
    x: number;      // Distance from the left corner of the wall (cm)
    y: number;      // Distance from the floor (cm)
    z: number;      // Depth offset from wall face (cm)
    width: number;
    height: number;
    depth: number;  // Physical thickness
}

export interface IWall {
    id:string
    label: string;
    length: number;    // Width in cm
    height: number;    // Standard height (e.g., 240)
    thickness: number;
}

/** * UPDATED: Included 'vent' to resolve TS2678 error.
 * Ensure these strings match the 'type' field sent from your Toolbox.
 */
export type ObstacleType =
    | 'window'
    | 'door'
    | 'socket'
    | 'vent' // FIXED: Added to match component usage
    | 'pipe'
    | 'pillar'
    | 'radiator'
    | 'clearance';

/** Alias for backward compatibility with existing components */
export interface Obstacle extends IObstacle {}

export interface IObstacle {
    id: string; // Unique ID for selection and drag-drop tracking
    _id?: string;
    type: ObstacleType;
    wallIndex: number;
    position: ICoordinate;
}

export interface IAppliance {
    name: string;
    wallIndex: number;
    position: ICoordinate;
    isFixed: boolean;
}

export interface IKitchenStandards {
    baseCabinetDepth: number;
    wallCabinetDepth: number;
    countertopThickness: number;
    kickplateHeight: number;
}