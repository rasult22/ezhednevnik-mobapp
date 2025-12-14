import { View, ViewProps } from 'react-native';
import { ReactNode } from 'react';

interface CardProps extends ViewProps {
  children: ReactNode;
  variant?: 'default' | 'elevated';
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  className = '',
  ...props
}: CardProps) {
  const variantClasses = {
    default: 'bg-gray-900 border border-gray-800',
    elevated: 'bg-gray-900',
  };

  return (
    <View
      className={`
        rounded-xl p-4
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </View>
  );
}
