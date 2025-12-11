import { useState, useEffect } from "react";

interface Props {
  targetDate: Date;
  callback: () => void;
}

export const CountdownTimer: React.FC<Props> = ({ targetDate, callback }) => {
  const calculateTimeRemaining = () => {
    const difference = targetDate.getTime() - new Date().getTime();
    return Math.max(0, Math.floor(difference / 1000)); // Ensure the timer doesn't go negative
  };

  const [time, setTime] = useState(calculateTimeRemaining());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [targetDate]); // Re-run effect whenever targetDate changes

  if (time === 0) {
    callback();
  }
  return <>{time}</>;
};
