import { useCallback, useEffect, useRef, useState } from 'react';

type Settings = {
  autoStart?: boolean;
  onTick?: (durationLeft: number) => void;
  onExpire?: () => void;
};

export function useCountdownTimer(
  duration: number,
  settings?: Settings
): {
  duration: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
} {
  const { autoStart, onTick, onExpire } = settings ?? {};

  const [durationLeft, setDurationLeft] = useState<number>(duration);
  const [isActive, setActive] = useState(autoStart ?? false);

  const timerInterval = useRef<NodeJS.Timeout | void>();

  useEffect(() => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    const INTERVAL_DURATION = 1000;

    timerInterval.current = setInterval(() => {
      if (isActive) {
        if (durationLeft > 0) {
          const newDuration = durationLeft - INTERVAL_DURATION;

          setDurationLeft(newDuration > 0 ? newDuration : 0);

          if (onTick) {
            onTick(newDuration);
          }

          if (newDuration <= 0 && onExpire) {
            setActive(false);

            onExpire();
          }
        }
      }
    }, INTERVAL_DURATION);

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [isActive, durationLeft, onTick, onExpire]);

  const start = useCallback(() => {
    setActive(true);
  }, []);

  const pause = useCallback(() => {
    setActive(false);
  }, []);

  const reset = useCallback(() => {
    setDurationLeft(duration);
  }, [duration]);

  return {
    duration: durationLeft,
    isRunning: isActive,
    start,
    pause,
    reset,
  };
}
