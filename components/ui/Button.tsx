import { Pressable, Text, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  className = '',
}: ButtonProps) {
  const baseClasses = 'rounded-lg items-center justify-center';

  const variantClasses = {
    primary: 'bg-white',
    secondary: 'bg-gray-700',
    outline: 'bg-transparent border-2 border-white',
  };

  const sizeClasses = {
    small: 'px-3 py-2',
    medium: 'px-6 py-3',
    large: 'px-8 py-4',
  };

  const textVariantClasses = {
    primary: 'text-black',
    secondary: 'text-white',
    outline: 'text-white',
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50' : 'active:opacity-70'}
        ${className}
      `}
    >
      <Text
        className={`
          font-semibold
          ${textVariantClasses[variant]}
          ${textSizeClasses[size]}
        `}
      >
        {title}
      </Text>
    </Pressable>
  );
}
