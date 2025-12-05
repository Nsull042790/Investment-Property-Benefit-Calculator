import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: 'default' | 'highlight' | 'success' | 'warning' | 'error';
}

export function SectionCard({ title, children, icon, variant = 'default' }: SectionCardProps) {
  const variantStyles = {
    default: 'bg-white border-gray-200',
    highlight: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
  };

  const titleStyles = {
    default: 'text-gray-800',
    highlight: 'text-blue-800',
    success: 'text-green-800',
    warning: 'text-yellow-800',
    error: 'text-red-800',
  };

  return (
    <div className={`rounded-xl border-2 shadow-sm ${variantStyles[variant]}`}>
      <div className={`px-6 py-4 border-b ${variant === 'default' ? 'border-gray-100' : 'border-inherit'}`}>
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${titleStyles[variant]}`}>
          {icon}
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
