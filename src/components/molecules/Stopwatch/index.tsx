import Status from 'src/components/atoms/Status';
import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';

export interface StopwatchRef {
  start: () => void;
  stop: () => void;
  reset: () => void;
}

const Stopwatch = forwardRef((_, ref) => {
  const [second, setSecond] = useState<number>(0);
  const intervalRef = useRef<number>();

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    start: () => {
      if (!intervalRef.current) {
        intervalRef.current = window.setInterval(() => {
          setSecond(prevState => ++ prevState);
        }, 1000);
      }
    },
    stop: () => {
      clearInterval(intervalRef.current);
    },
    reset: () => {
      setSecond(0);
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    },
  }), []);

  return (
    <Status value={second}/>
  )
});

export default Stopwatch;
