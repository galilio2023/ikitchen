import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { ICoordinate } from '@/types/kitchen';
import { GeneratedDesign } from '@/lib/validations';

interface GhostUnitsRendererProps {
  wallIndex: number;
}

const GhostUnitsRenderer: React.FC<GhostUnitsRendererProps> = ({ wallIndex }) => {
  const { currentKitchen } = useSelector((state: RootState) => state.kitchen);
  const generatedDesign = currentKitchen?.generatedDesign as GeneratedDesign | null;

  if (!generatedDesign) {
    return null;
  }

  // Filter units for the current wall
  const wallUnits = generatedDesign.units.filter(unit => unit.wallIndex === wallIndex);

  return (
    <>
      {wallUnits.map((unit, index) => (
        <div
          key={`ghost-${unit.id}-${index}`}
          className="absolute border-2 border-dashed border-blue-400 bg-blue-100 bg-opacity-30 rounded pointer-events-none z-10"
          style={{
            left: `${unit.position.x}px`,
            top: `${unit.position.y}px`,
            width: `${unit.position.width}px`,
            height: `${unit.position.height}px`,
          }}
        >
          <div className="absolute -top-6 left-0 text-xs font-medium text-blue-600 bg-blue-100 bg-opacity-80 px-1 rounded">
            {unit.type}
          </div>
        </div>
      ))}
    </>
  );
};

export default GhostUnitsRenderer;