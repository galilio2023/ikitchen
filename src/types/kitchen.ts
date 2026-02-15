import { GeneratedDesign } from "@/lib/validations";

export interface IKitchen {
    id: string;
    userId?: string;
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
    generatedDesign?: GeneratedDesign;
}

export interface ICoordinate {
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    depth: number;
}

export interface IWall {
    id: string;
    label: string;
    length: number;
    height: number;
    thickness: number;
}

export type ObstacleType =
    | 'window'
    | 'door'
    | 'socket'
    | 'vent'
    | 'pipe'
    | 'pillar'
    | 'radiator'
    | 'clearance';

export type Obstacle = IObstacle;

export interface IObstacle {
    id: string;
    type: ObstacleType;
    wallIndex: number;
    position: ICoordinate;
}

export interface IAppliance {
    id: string;
    type: 'appliance';
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
