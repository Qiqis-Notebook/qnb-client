import { useEffect, useState } from "react";

export default function Timer({ start = false }: { start: boolean }) {
  const [currentTimer, setCurrentTimer] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const startTimer = () => {
      intervalId = setInterval(() => {
        setCurrentTimer((prevTimer) => {
          let newSeconds = prevTimer.seconds + 1;
          let newMinutes = prevTimer.minutes;
          let newHours = prevTimer.hours;

          if (newSeconds === 60) {
            newMinutes += 1;
            newSeconds = 0;
          }

          if (newMinutes === 60) {
            newHours += 1;
            newMinutes = 0;
          }

          return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);
    };

    if (start) {
      setCurrentTimer({
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      startTimer();
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [start]);

  return (
    <span className="countdown">
      <span
        style={
          // @ts-ignore
          { "--value": currentTimer.hours }
        }
      />
      :
      <span
        style={
          // @ts-ignore
          { "--value": currentTimer.minutes }
        }
      />
      :
      <span
        style={
          // @ts-ignore
          { "--value": currentTimer.seconds }
        }
      />
    </span>
  );
}
