
'use client';

import React, { useState, useEffect } from 'react';

type TypewriterEffectProps = {
  text: string;
  speed?: number;
  onComplete?: () => void;
};

export const TypewriterEffect = ({ text, speed = 50, onComplete }: TypewriterEffectProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return <p className="text-lg font-medium">{displayedText}</p>;
};

export default TypewriterEffect;
