import { TouchableOpacity, Text, type TouchableOpacityProps, type TextStyle, type ViewStyle } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedButtonProps = TouchableOpacityProps & {
  title: string;
  lightColor?: string;
  darkColor?: string;
  lightTextColor?: string;
  darkTextColor?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
};

export function ThemedButton({ 
  title,
  style, 
  lightColor, 
  darkColor, 
  lightTextColor,
  darkTextColor,
  variant = 'primary',
  size = 'medium',
  disabled,
  ...otherProps 
}: ThemedButtonProps) {
  // Default colors based on variant
  const getDefaultColors = () => {
    switch (variant) {
      case 'primary':
        return {
          light: lightColor || '#285D34',
          dark: darkColor || '#3A7A47',
          lightText: lightTextColor || '#FFFFFF',
          darkText: darkTextColor || '#FFFFFF'
        };
      case 'secondary':
        return {
          light: lightColor || '#E8F5E8',
          dark: darkColor || '#1F4A25',
          lightText: lightTextColor || '#285D34',
          darkText: darkTextColor || '#A8D4B0'
        };
      case 'outline':
        return {
          light: lightColor || 'transparent',
          dark: darkColor || 'transparent',
          lightText: lightTextColor || '#285D34',
          darkText: darkTextColor || '#A8D4B0'
        };
      default:
        return {
          light: lightColor || '#285D34',
          dark: darkColor || '#3A7A47',
          lightText: lightTextColor || '#FFFFFF',
          darkText: darkTextColor || '#FFFFFF'
        };
    }
  };

  const colors = getDefaultColors();
  
  const backgroundColor = useThemeColor(
    { light: colors.light, dark: colors.dark }, 
    'background'
  );
  
  const textColor = useThemeColor(
    { light: colors.lightText, dark: colors.darkText }, 
    'text'
  );

  // Size configurations
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 14,
          minHeight: 36
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          fontSize: 18,
          minHeight: 56
        };
      default: // medium
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          fontSize: 16,
          minHeight: 44
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const buttonStyle: ViewStyle = {
    backgroundColor: disabled ? '#A0A0A0' : backgroundColor,
    paddingVertical: sizeStyles.paddingVertical,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    minHeight: sizeStyles.minHeight,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.6 : 1,
    ...(variant === 'outline' && {
      borderWidth: 1,
      borderColor: disabled ? '#A0A0A0' : textColor,
    }),
  };

  const textStyle: TextStyle = {
    color: disabled ? '#666666' : textColor,
    fontSize: sizeStyles.fontSize,
    fontWeight: '600',
    textAlign: 'center',
  };

  return (
    <TouchableOpacity 
      style={[buttonStyle, style]} 
      disabled={disabled}
      activeOpacity={0.7}
      {...otherProps}
    >
      <Text style={textStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}