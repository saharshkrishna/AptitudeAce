import React, { useEffect, useRef, useState } from 'react';

interface TimerProps {
  durationSeconds: number;
  onExpire: () => void;
  running: boolean;
}

const Timer: React.FC<TimerProps> = ({ durationSeconds, onExpire, running }) => {
  const [remaining, setRemaining] = useState(durationSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
  const secs = (remaining % 60).toString().padStart(2, '0');
  const isWarning = remaining <= 60;

  return (
    <span className={`timer ${isWarning ? 'warning' : ''}`}>
      {mins}:{secs}
    </span>
  );
};

export default Timer;
