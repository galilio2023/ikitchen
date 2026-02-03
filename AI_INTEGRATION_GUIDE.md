# AI Kitchen Design Integration Guide

This guide explains how to integrate AI-generated kitchen designs into your application.

## 1. Components

### AiDesignPanel Component
Located at `src/components/kitchen/AiDesignPanel.tsx`

Features:
- Prominent "Generate Design" button with neural gradient
- Loading state with "Consulting AI..." message
- Preview card showing:
  - Layout type as a badge
  - AI reasoning in a blockquote
  - Unit count summary
- Action buttons: "Apply Design" and "Discard"

### GhostUnitsRenderer Component
Located at `src/components/kitchen/GhostUnitsRenderer.tsx`

Purpose:
- Renders "ghost" units when AI-generated design is present
- Allows users to preview layout before applying
- Shows translucent overlays of proposed units

## 2. Redux Integration

### Actions Added:
- `generateAiLayout(projectId)` - Triggers AI design generation
- `acceptAiLayout(generatedDesign)` - Applies the AI design
- `discardAiLayout()` - Discards the AI design

### State Changes:
- `state.kitchen.currentKitchen.generatedDesign` - Stores the AI-generated design
- `state.kitchen.loading` - Indicates when AI is processing

## 3. API Routes

### AI Generation Endpoint:
- `POST /api/generate/kitchen` - Generates AI kitchen designs
- Validates output against `GeneratedDesign` schema
- Returns structured design data

## 4. Conditional Rendering of Ghost Units

To conditionally render ghost units in your main canvas when `generatedDesign` is present:

1. Import the `GhostUnitsRenderer` component:
```tsx
import GhostUnitsRenderer from '@/components/kitchen/GhostUnitsRenderer';
```

2. In your spatial editor canvas, conditionally render ghost units:
```tsx
{currentKitchen?.generatedDesign && (
  <div className="absolute inset-0">
    <GhostUnitsRenderer wallIndex={activeWallIndex} />
  </div>
)}
```

This will overlay translucent representations of the proposed units on the current wall, allowing users to visualize the AI design before committing to it.

## 5. Type Safety

- All components use strict TypeScript typing
- `GeneratedDesign` type imported from `@/lib/validations`
- Compatible with `IKitchen` interface from `@/types/kitchen`

## 6. Usage Flow

1. User clicks "Generate Design" button
2. System calls AI generation API
3. Generated design is stored in Redux state
4. Preview card appears showing the design
5. Ghost units appear in the spatial editor
6. User can either "Apply Design" or "Discard"
7. If applied, units are merged into the current kitchen layout