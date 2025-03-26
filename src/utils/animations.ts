
import { useEffect, useState, useRef } from 'react';

// Utility for staggered children animation
export const useStaggeredChildren = (childCount: number, delay = 100) => {
  const [visibleChildren, setVisibleChildren] = useState<boolean[]>([]);
  
  useEffect(() => {
    const newVisible: boolean[] = Array(childCount).fill(false);
    
    // Stagger the animation of each child
    for (let i = 0; i < childCount; i++) {
      setTimeout(() => {
        setVisibleChildren(prev => {
          const updated = [...prev];
          updated[i] = true;
          return updated;
        });
      }, delay * i);
    }
    
    return () => {
      setVisibleChildren([]);
    };
  }, [childCount, delay]);
  
  return visibleChildren;
};

// Intersection observer hook for elements entering viewport
export const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);
  
  return { ref, isInView };
};

// Typing animation hook
export const useTypingEffect = (text: string, speed = 50) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed]);
  
  return { displayedText, isComplete };
};

// For code highlighting animation
export const useCodeHighlight = (codeLength: number, delay = 800) => {
  const [highlightPosition, setHighlightPosition] = useState(-1);
  
  useEffect(() => {
    if (codeLength <= 0) return;
    
    const timer = setInterval(() => {
      setHighlightPosition(prev => {
        if (prev >= codeLength - 1) return -1;
        return prev + 1;
      });
    }, delay);
    
    return () => clearInterval(timer);
  }, [codeLength, delay]);
  
  return highlightPosition;
};
