import { useThemeColor } from '@/hooks/useThemeColor';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View, type TextStyle, type TouchableOpacityProps, type ViewStyle } from 'react-native';

export type ThemedButtonProps = TouchableOpacityProps & {
  title: string;
  lightColor?: string;
  darkColor?: string;
  lightTextColor?: string;
  darkTextColor?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gradient';
  size?: 'small' | 'medium' | 'large' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
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
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onPressIn,
  onPressOut,
  ...otherProps 
}: ThemedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const loadingRotation = useRef(new Animated.Value(0)).current;

  // Loading animation
  useEffect(() => {
    if (loading) {
      const rotationAnimation = Animated.loop(
        Animated.timing(loadingRotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      rotationAnimation.start();
      return () => rotationAnimation.stop();
    }
  }, [loading, loadingRotation]);

  // Press animations
  const handlePressIn = (event: any) => {
    setIsPressed(true);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    setIsPressed(false);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPressOut?.(event);
  };

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
      case 'ghost':
        return {
          light: lightColor || 'transparent',
          dark: darkColor || 'transparent',
          lightText: lightTextColor || '#285D34',
          darkText: darkTextColor || '#A8D4B0'
        };
      case 'destructive':
        return {
          light: lightColor || '#FF3B30',
          dark: darkColor || '#FF453A',
          lightText: lightTextColor || '#FFFFFF',
          darkText: darkTextColor || '#FFFFFF'
        };
      case 'gradient':
        return {
          light: lightColor || '#285D34',
          dark: darkColor || '#3A7A47',
          lightText: lightTextColor || '#FFFFFF',
          darkText: darkTextColor || '#FFFFFF'
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

  const borderColor = useThemeColor(
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
          minHeight: 36,
          borderRadius: 8,
          iconSize: 16
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          fontSize: 18,
          minHeight: 56,
          borderRadius: 14,
          iconSize: 20
        };
      case 'xl':
        return {
          paddingVertical: 20,
          paddingHorizontal: 40,
          fontSize: 20,
          minHeight: 64,
          borderRadius: 16,
          iconSize: 24
        };
      default: // medium
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          fontSize: 16,
          minHeight: 48,
          borderRadius: 50,
          iconSize: 18
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: sizeStyles.paddingVertical,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      minHeight: sizeStyles.minHeight,
      borderRadius: sizeStyles.borderRadius,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: icon ? 8 : 0,
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    // Variant-specific styles
    switch (variant) {
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: isDisabled ? '#C7C7CC' : borderColor,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'gradient':
        return {
          ...baseStyle,
          backgroundColor: backgroundColor,
          shadowColor: backgroundColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: isDisabled ? '#C7C7CC' : backgroundColor,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: variant === 'secondary' ? 0.1 : 0.15,
          shadowRadius: 4,
          elevation: variant === 'secondary' ? 2 : 3,
        };
    }
  };

  const getTextStyle = (): TextStyle => ({
    color: isDisabled ? '#8E8E93' : textColor,
    fontSize: sizeStyles.fontSize,
    fontWeight: variant === 'ghost' ? '500' : '600',
    textAlign: 'center',
    includeFontPadding: false,
  });

  const LoadingSpinner = () => {
    const spin = loadingRotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        style={{
          width: sizeStyles.iconSize,
          height: sizeStyles.iconSize,
          borderWidth: 2,
          borderColor: textColor,
          borderTopColor: 'transparent',
          borderRadius: sizeStyles.iconSize / 2,
          transform: [{ rotate: spin }],
        }}
      />
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <LoadingSpinner />
          <Text style={getTextStyle()}>Loading...</Text>
        </>
      );
    }

    const iconElement = icon && (
      <View style={{ width: sizeStyles.iconSize, height: sizeStyles.iconSize }}>
        {icon}
      </View>
    );

    const textElement = <Text style={getTextStyle()}>{title}</Text>;

    if (iconPosition === 'right') {
      return (
        <>
          {textElement}
          {iconElement}
        </>
      );
    }

    return (
      <>
        {iconElement}
        {textElement}
      </>
    );
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      }}
    >
      <TouchableOpacity 
        style={[getButtonStyle(), style]} 
        disabled={isDisabled}
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...otherProps}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
}