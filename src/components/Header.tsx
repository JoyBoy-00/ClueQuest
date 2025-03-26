
import { useState, useEffect } from 'react';
import { HuntProgress, formatTimeElapsed } from '../utils/apiHunt';

interface HeaderProps {
  progress: HuntProgress;
}

const Header = ({ progress }: HeaderProps) => {
  const [timeElapsed, setTimeElapsed] = useState('00:00');
  
  useEffect(() => {
    // Update the timer every second
    const interval = setInterval(() => {
      setTimeElapsed(formatTimeElapsed(progress.startTime, progress.endTime));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [progress.startTime, progress.endTime]);
  
  return (
    <header className="flex justify-between items-center py-6 px-8 w-full glassmorphism mb-8 rounded-xl">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold mr-2 tracking-tight">API Treasure Hunt</h1>
        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
          {progress.endTime ? 'Completed' : 'In Progress'}
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-end">
          <span className="text-sm text-muted-foreground">Time Elapsed</span>
          <span className="font-mono text-lg">{timeElapsed}</span>
        </div>
        
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="font-medium">{progress.completedClues.length}/{Object.keys(progress.completedClues).length + 1}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
