import { useState, useEffect } from 'react';
import { formatCountdown } from '../lib/utils';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ seconds, label = 'Ends in' }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => { setRemaining(seconds); }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [remaining]);

  if (remaining <= 0) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
      <Clock size={12} />
      <span>{label}</span>
      <span className="font-semibold text-text-primary">
        {formatCountdown(remaining)}
      </span>
    </div>
  );
}
