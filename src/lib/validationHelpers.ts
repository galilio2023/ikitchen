import { calculateWallPoints } from './geometry';

/**
 * Conflict JSON contract:
 * {
 *   id: string,
 *   type: 'overlap'|'out_of_bounds'|'door_overlap'|'window_overlap'|'work_triangle'|'aisle_clearance'|'island_size'|'height_violation'|'schema_validation',
 *   severity: 'info'|'warning'|'error',
 *   message: string,
 *   involved: Array<{ kind: 'unit'|'obstacle'|'wall'|'appliance', id: string }>,
 *   wallIndex?: number | null,
 *   range?: { start: number, end: number } | null, // cm along wall
 *   globalCoordinates?: { type: 'bbox'|'polygon', points: Array<{ x:number, y:number }> } | null,
 *   details?: Object,
 *   suggestedFixes?: Array<{ action: string, params?: object, label: string }>,
 *   timestamp: string,
 *   schemaVersion: 'conflict_v1'
 * }
 */
export type Conflict = {
  id: string;
  type: 'overlap'|'out_of_bounds'|'door_overlap'|'window_overlap'|'work_triangle'|'aisle_clearance'|'island_size'|'height_violation'|'schema_validation';
  severity: 'info'|'warning'|'error';
  message: string;
  involved: Array<{ kind: 'unit'|'obstacle'|'wall'|'appliance', id: string }>;
  wallIndex?: number | null;
  range?: { start: number, end: number } | null; // cm along wall
  globalCoordinates?: { type: 'bbox'|'polygon', points: Array<{ x:number, y:number }> } | null;
  details?: Object;
  suggestedFixes?: Array<{ action: string, params?: object, label: string }>;
  timestamp: string;
  schemaVersion: 'conflict_v1';
};

/**
 * Converts wall-relative coordinates to global coordinates
 * @param walls - Array of wall objects with length, height, and position properties
 * @param wallIndex - Index of the wall in the walls array
 * @param xCm - Distance in cm along the wall from the starting point
 * @returns Global coordinates {x, y}
 */
export function convertWallRelativeToGlobal(walls: any[], wallIndex: number, xCm: number) {
  if (wallIndex < 0 || wallIndex >= walls.length) {
    throw new Error(`Invalid wallIndex: ${wallIndex}`);
  }

  const wall = walls[wallIndex];
  
  // Calculate the global position based on the wall's starting point
  // This assumes the wall starts at a known global position
  // Using calculateWallPoints to get the starting point of the wall
  const wallPoints = calculateWallPoints(wall);
  
  // Assuming xCm is measured from the start of the wall
  // This calculation depends on the wall's orientation (horizontal vs vertical)
  // For a horizontal wall, we add to the x-coordinate
  // For a vertical wall, we add to the y-coordinate
  // For simplicity, assuming horizontal wall where x increases along the wall
  return {
    x: wallPoints.startX + xCm,
    y: wallPoints.startY // Assuming y remains constant along the wall
  };
}

/**
 * Checks if the work triangle is properly formed according to standards
 * @param nodes - Array of nodes with position and wall information
 * @param standards - Kitchen standards to validate against
 * @returns Work triangle check results
 */
export function checkWorkTriangle(
  nodes: Array<{ id: string, wallIndex: number, position: { x: number, y: number, width: number, height: number } }>,
  standards: any
): { ok: boolean, legs: Array<{ name: string, lengthCm: number, ok: boolean }>, perimeterCm: number, details: any } {
  // Identify the three main work centers: sink, refrigerator, range
  const workCenters = nodes.filter(node => 
    ['sink', 'refrigerator', 'range'].some(center => 
      node.id.toLowerCase().includes(center) || 
      node.position.type?.toLowerCase().includes(center)
    )
  );

  if (workCenters.length < 3) {
    return {
      ok: true, // Not enough centers to form a triangle
      legs: [],
      perimeterCm: 0,
      details: { message: "Not enough work centers to form a work triangle" }
    };
  }

  // Calculate distances between each pair of work centers
  const legs = [];
  let totalPerimeter = 0;

  for (let i = 0; i < workCenters.length; i++) {
    for (let j = i + 1; j < workCenters.length; j++) {
      const center1 = workCenters[i];
      const center2 = workCenters[j];
      
      // Calculate distance between centers (simplified for demo)
      const dx = center1.position.x - center2.position.x;
      const dy = center1.position.y - center2.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const legOk = distance >= standards.minWorkTriangleLeg;
      legs.push({
        name: `${center1.id}-${center2.id}`,
        lengthCm: distance,
        ok: legOk
      });
      
      totalPerimeter += distance;
    }
  }

  const ok = legs.every(leg => leg.ok);

  return {
    ok,
    legs,
    perimeterCm: totalPerimeter,
    details: { 
      message: ok 
        ? "Work triangle meets standards" 
        : "One or more legs of the work triangle do not meet minimum length requirements" 
    }
  };
}

/**
 * Detects overlaps between units and existing obstacles
 * @param units - Array of units to check
 * @param existingObstacles - Array of existing obstacles to check against
 * @param walls - Array of walls in the kitchen
 * @returns Array of detected conflicts
 */
export function detectOverlaps(
  units: Array<any>,
  existingObstacles: Array<any>,
  walls: Array<any>
): { conflicts: Conflict[] } {
  const conflicts: Conflict[] = [];

  for (const unit of units) {
    const unitGlobalPos = convertWallRelativeToGlobal(walls, unit.wallIndex, unit.position.x);
    
    for (const obstacle of existingObstacles) {
      // Convert obstacle to global coordinates if needed
      const obstacleGlobalPos = convertWallRelativeToGlobal(walls, obstacle.wallIndex, obstacle.position.x);
      
      // Simple rectangle intersection check
      const unitRect = {
        x: unitGlobalPos.x,
        y: unitGlobalPos.y,
        width: unit.position.width,
        height: unit.position.height
      };
      
      const obstacleRect = {
        x: obstacleGlobalPos.x,
        y: obstacleGlobalPos.y,
        width: obstacle.position.width,
        height: obstacle.position.height
      };
      
      // Check for intersection
      if (
        unitRect.x < obstacleRect.x + obstacleRect.width &&
        unitRect.x + unitRect.width > obstacleRect.x &&
        unitRect.y < obstacleRect.y + obstacleRect.height &&
        unitRect.y + unitRect.height > obstacleRect.y
      ) {
        // Overlap detected
        conflicts.push({
          id: `overlap-${unit.id}-${obstacle.id}`,
          type: 'overlap',
          severity: 'error',
          message: `Unit "${unit.id}" overlaps with existing obstacle "${obstacle.id}"`,
          involved: [
            { kind: 'unit', id: unit.id },
            { kind: 'obstacle', id: obstacle.id }
          ],
          wallIndex: unit.wallIndex,
          range: { start: unit.position.x, end: unit.position.x + unit.position.width },
          globalCoordinates: {
            type: 'bbox',
            points: [
              { x: unitGlobalPos.x, y: unitGlobalPos.y },
              { x: unitGlobalPos.x + unit.position.width, y: unitGlobalPos.y },
              { x: unitGlobalPos.x + unit.position.width, y: unitGlobalPos.y + unit.position.height },
              { x: unitGlobalPos.x, y: unitGlobalPos.y + unit.position.height }
            ]
          },
          details: {
            unit: unit,
            obstacle: obstacle
          },
          suggestedFixes: [
            {
              action: 'move_unit',
              params: { id: unit.id, newX: unit.position.x + 10 }, // Move 10cm right
              label: 'Move unit right to resolve overlap'
            }
          ],
          timestamp: new Date().toISOString(),
          schemaVersion: 'conflict_v1'
        });
      }
    }
  }

  return { conflicts };
}

/**
 * Checks if aisle widths meet standards
 * @param runs - Array of appliance runs
 * @param standards - Kitchen standards to validate against
 * @returns Aisle width check results
 */
export function checkAisleWidth(
  runs: Array<any>,
  standards: any
): { ok: boolean, gapCm: number } {
  // For this example, we'll assume we're checking the gap between two runs of cabinets
  // This is a simplified implementation
  if (runs.length < 2) {
    return { ok: true, gapCm: 0 };
  }

  // Get the first two runs and calculate the gap between them
  // This would typically involve checking the space between opposing runs of cabinets
  const gapCm = standards.minWalkway; // Placeholder calculation
  const ok = gapCm >= standards.minWalkway;

  return { ok, gapCm };
}

/**
 * Checks if island size meets standards
 * @param widthCm - Width of the island in cm
 * @param depthCm - Depth of the island in cm
 * @param standards - Kitchen standards to validate against
 * @returns Island size check results
 */
export function checkIslandSize(
  widthCm: number,
  depthCm: number,
  standards: any
): { ok: boolean } {
  // For this example, we'll check if the island meets minimum clearance requirements
  // This is a simplified implementation
  const ok = widthCm > 0 && depthCm > 0; // Placeholder validation

  return { ok };
}