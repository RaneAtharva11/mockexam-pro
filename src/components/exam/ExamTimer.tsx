import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface ExamTimerProps {
  remainingSeconds: number;
  onSync: () => void;
}

const ExamTimer = ({ remainingSeconds, onSync }: ExamTimerProps) => {
  const [seconds, setSeconds] = useState(remainingSeconds);

  useEffect(() => {
    setSeconds(remainingSeconds);
  }, [remainingSeconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    const syncInterval = setInterval(onSync, 5000);
    return () => { clearInterval(interval); clearInterval(syncInterval); };
  }, [onSync]);

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  const isWarning = seconds <= 600 && seconds > 300;
  const isDanger = seconds <= 300;

  return (
    <div className={`flex items-center gap-2 font-mono text-xl font-bold ${
      isDanger ? 'text-destructive timer-danger' : isWarning ? 'text-warning animate-pulse' : 'text-foreground'
    }`}>
      <Clock className="h-5 w-5" />
      {pad(hrs)}:{pad(mins)}:{pad(secs)}
    </div>
  );
};

export default ExamTimer;
