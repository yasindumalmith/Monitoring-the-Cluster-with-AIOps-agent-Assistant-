import { Loader2 } from 'lucide-react';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Loader({ message = "Loading...", fullScreen = false, size = 'md' }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  // Small size is inline (e.g., for buttons)
  if (size === 'sm') {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className={`${sizeClasses[size]} text-purple-100 animate-spin mr-2`} />
        {message && <span>{message}</span>}
      </div>
    );
  }

  // Medium and Large sizes are stacked blocks
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className={`${sizeClasses[size]} text-purple-500 animate-spin`} />
      {message && <p className="text-purple-300 font-medium animate-pulse">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#1a0b2e]/80 backdrop-blur-sm z-[100] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      {content}
    </div>
  );
}
