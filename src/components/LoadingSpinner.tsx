import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
    <p className="text-muted-foreground text-sm font-medium">{text}</p>
  </div>
);

export default LoadingSpinner;
