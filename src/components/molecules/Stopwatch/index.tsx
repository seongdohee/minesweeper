import Status from 'src/components/atoms/Status';
import {useEffect, useState} from 'react';

interface Props {
  isRunning: boolean;
}

const Stopwatch = ({ isRunning }: Props) => {
  const [second, setSecond] = useState<number>(0);

  useEffect(() => {
    let intervalId: number;
    if (isRunning) {
      intervalId = window.setInterval(() => {
        setSecond(prevState => ++ prevState);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
  }, [isRunning]);

  return (
    <Status value={second}/>
  )
}

export default Stopwatch;
