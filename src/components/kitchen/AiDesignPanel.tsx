import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import {
  generateAiLayout,
  acceptAiLayout,
  discardAiLayout
} from '@/lib/features/kitchens/kitchenSlice';
import { GeneratedDesign } from '@/lib/validations';

interface AiDesignPanelProps {
  projectId: string;
}

const AiDesignPanel: React.FC<AiDesignPanelProps> = ({ projectId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentKitchen, loading } = useSelector((state: RootState) => state.kitchen);
  const generatedDesign = currentKitchen?.generatedDesign as GeneratedDesign | null;

  const handleGenerateClick = () => {
    dispatch(generateAiLayout(projectId));
  };

  const handleAcceptClick = () => {
    if (generatedDesign) {
      dispatch(acceptAiLayout(generatedDesign));
    }
  };

  const handleDiscardClick = () => {
    dispatch(discardAiLayout());
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
      <h2 className="text-xl font-bold mb-4">AI Design Assistant</h2>

      <div className="mb-6">
        <button
          onClick={handleGenerateClick}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-primary-foreground transition-all duration-300 ${
            loading
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Consulting AI...
            </div>
          ) : (
            'Generate Design'
          )}
        </button>
      </div>

      {generatedDesign && (
        <div className="bg-muted/50 border border-border rounded-xl p-4 mb-4 transition-all duration-300">
          <div className="flex justify-between items-start mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent text-accent-foreground">
              {generatedDesign.layoutType}
            </span>
          </div>

          <blockquote className="text-muted-foreground italic border-l-4 border-primary pl-4 mb-3">
            {'"' + generatedDesign.aiReasoning + '"'}
          </blockquote>

          <div className="text-sm text-muted-foreground mb-4">
            {generatedDesign.units.length} units suggested
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleAcceptClick}
              className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-primary-foreground font-medium rounded-lg transition-colors duration-200"
            >
              Apply Design
            </button>
            <button
              onClick={handleDiscardClick}
              className="flex-1 py-2 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-lg transition-colors duration-200"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {!generatedDesign && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No AI design suggestions yet.</p>
          <p className="text-sm mt-2">Generate a design to get started.</p>
        </div>
      )}
    </div>
  );
};

export default AiDesignPanel;