'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
}

function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="flex items-center gap-2 bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-r-lg mb-4 animate-fade">
      <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

export default ErrorAlert;