
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Console from '../components/Console';
import ResponseDisplay from '../components/ResponseDisplay';
import ClueTracker from '../components/ClueTracker';
import HuntIntro from '../components/HuntIntro';
import { 
  Clue, 
  HuntProgress, 
  initializeHunt, 
  getClue, 
  getAllClues, 
  updateProgress,
  formatTimeElapsed
} from '../utils/apiHunt';

const Index = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [huntProgress, setHuntProgress] = useState<HuntProgress>(initializeHunt());
  const [currentClue, setCurrentClue] = useState<Clue | null>(null);
  const [currentResponse, setCurrentResponse] = useState<any>(null);
  const [allClues, setAllClues] = useState<Clue[]>([]);
  
  // Initialize the hunt
  useEffect(() => {
    setAllClues(getAllClues());
    setCurrentClue(getClue(huntProgress.currentClueId));
  }, []);
  
  // Update current clue when progress changes
  useEffect(() => {
    setCurrentClue(getClue(huntProgress.currentClueId));
  }, [huntProgress.currentClueId]);
  
  const handleStartHunt = () => {
    setIsStarted(true);
  };
  
  const handleRequestComplete = (response: any) => {
    setCurrentResponse(response);
    
    if (currentClue) {
      const updatedProgress = updateProgress(
        huntProgress,
        currentClue.id,
        true
      );
      setHuntProgress(updatedProgress);
    }
  };
  
  const handleContinue = () => {
    setCurrentResponse(null);
  };
  
  if (!isStarted) {
    return <HuntIntro onStart={handleStartHunt} />;
  }
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 antialiased">
      <div className="max-w-6xl mx-auto">
        <Header progress={huntProgress} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {currentClue && (
              <Console 
                currentClue={currentClue} 
                onRequestComplete={handleRequestComplete} 
              />
            )}
            
            {currentResponse && (
              <ResponseDisplay 
                response={currentResponse} 
                onContinue={handleContinue} 
              />
            )}
          </div>
          
          <div className="space-y-6">
            <ClueTracker 
              clues={allClues} 
              progress={huntProgress} 
            />
            
            {huntProgress.endTime && (
              <div className="glassmorphism rounded-xl p-6 text-center animate-fade-in">
                <h2 className="text-xl font-bold mb-2">Treasure Hunt Complete!</h2>
                <p className="text-muted-foreground mb-4">
                  Congratulations! You've found the treasure and completed the hunt.
                </p>
                <div className="bg-primary/10 rounded-lg p-4">
                  <span className="block text-sm text-muted-foreground">Final Time</span>
                  <span className="text-3xl font-mono">
                    {formatTimeElapsed(huntProgress.startTime, huntProgress.endTime)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
