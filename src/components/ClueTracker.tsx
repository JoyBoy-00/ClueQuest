
import { Clue, HuntProgress } from '../utils/apiHunt';
import { useInView } from '../utils/animations';

interface ClueTrackerProps {
  clues: Clue[];
  progress: HuntProgress;
}

const ClueTracker = ({ clues, progress }: ClueTrackerProps) => {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`glassmorphism rounded-xl p-6 transition-all-medium ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
      
      <div className="space-y-3">
        {clues.map((clue, index) => {
          const isCompleted = progress.completedClues.includes(clue.id);
          const isCurrent = progress.currentClueId === clue.id;
          
          return (
            <div 
              key={clue.id}
              className={`flex items-center p-3 rounded-lg transition-all-medium 
                ${isCompleted ? 'bg-primary/10' : 'bg-muted/50'}
                ${isCurrent && !isCompleted ? 'border-2 border-primary/50' : ''}`}
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                ${isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'} 
                mr-3 transition-all-medium`}
              >
                {isCompleted && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
                {!isCompleted && <span className="text-xs">{index + 1}</span>}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Clue {index + 1}: {clue.id}
                </p>
                <p className="text-xs truncate text-muted-foreground">
                  {isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Locked'}
                </p>
              </div>
              
              {isCurrent && !isCompleted && (
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse-subtle ml-2"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClueTracker;
