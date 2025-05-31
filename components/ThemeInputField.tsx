import { useThemeColor } from '@/hooks/useThemeColor';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  lightTextColor?: string;
  darkTextColor?: string;
  variant?: 'default' | 'outline' | 'filled' | 'floating' | 'modern';
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  lightTextColor,
  darkTextColor,
  variant = 'modern',
  editable = true,
  label,
  error,
  icon,
  iconPosition = 'left',
  value,
  onFocus,
  onBlur,
  ...otherProps
}: ThemedTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const animatedLabelPosition = useRef(new Animated.Value(hasValue || isFocused ? 1 : 0)).current;
  const animatedBorderColor = useRef(new Animated.Value(0)).current;

  const backgroundColor = useThemeColor(
    { 
      light: lightColor || getBackgroundColor(variant, false), 
      dark: darkColor || getBackgroundColor(variant, true) 
    },
    'background'
  );

  const borderColor = useThemeColor(
    { light: error ? '#FF6B6B' : '#E1E5E9', dark: error ? '#FF8A8A' : '#404040' }, 
    'background'
  );

  const focusedBorderColor = useThemeColor(
    { light: error ? '#FF6B6B' : '#007AFF', dark: error ? '#FF8A8A' : '#0A84FF' }, 
    'tint'
  );

  const textColor = useThemeColor(
    { light: lightTextColor || '#1C1C1E', dark: darkTextColor || '#FFFFFF' },
    'text'
  );

  const labelColor = useThemeColor(
    { light: error ? '#FF6B6B' : '#8E8E93', dark: error ? '#FF8A8A' : '#98989D' },
    'text'
  );

  const placeholderColor = useThemeColor(
    { light: '#C7C7CC', dark: '#636366' },
    'text'
  );

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  useEffect(() => {
    Animated.timing(animatedLabelPosition, {
      toValue: hasValue || isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [hasValue, isFocused]);

  useEffect(() => {
    Animated.timing(animatedBorderColor, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const animatedBorderColorValue = animatedBorderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [borderColor, focusedBorderColor],
  });

  const labelStyle = variant === 'floating' ? {
    position: 'absolute' as const,
    left: icon && iconPosition === 'left' ? 44 : 16,
    color: labelColor,
    fontSize: animatedLabelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    transform: [{
      translateY: animatedLabelPosition.interpolate({
        inputRange: [0, 1],
        outputRange: [16, -8],
      }),
    }],
    backgroundColor: backgroundColor,
    paddingHorizontal: 4,
    zIndex: 1,
  } : null;

  // Move the error color hook call outside the render block
  const errorColor = useThemeColor({ light: '#FF6B6B', dark: '#FF8A8A' }, 'text');

  return (
    <View style={[styles.container]}>
      {label && variant !== 'floating' && (
        <Animated.Text style={[styles.label, { color: labelColor }]}>
          {label}
        </Animated.Text>
      )}
      
      <Animated.View
        style={[
          styles.inputContainer,
          getVariantStyles(variant),
          {
            backgroundColor,
            borderColor: animatedBorderColorValue,
            borderWidth: variant === 'outline' || variant === 'floating' || variant === 'modern' ? 1.5 : 0,
            opacity: editable ? 1 : 0.6,
            shadowColor: isFocused ? focusedBorderColor : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isFocused ? 0.15 : 0,
            shadowRadius: isFocused ? 8 : 0,
            elevation: isFocused ? 4 : 0,
          },
        ]}
      >
        {icon && iconPosition === 'left' && (
          <View style={styles.iconLeft}>{icon}</View>
        )}
        
        {label && variant === 'floating' && (
          <Animated.Text style={labelStyle}>
            {label}
          </Animated.Text>
        )}
        
        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
              paddingLeft: icon && iconPosition === 'left' ? 8 : 16,
              paddingRight: icon && iconPosition === 'right' ? 8 : 16,
              paddingTop: variant === 'floating' && (hasValue || isFocused) ? 20 : 16,
              paddingBottom: variant === 'floating' && (hasValue || isFocused) ? 8 : 16,
            },
          ]}
          placeholderTextColor={placeholderColor}
          editable={editable}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={variant === 'floating' ? '' : otherProps.placeholder}
          {...otherProps}
        />
        
        {icon && iconPosition === 'right' && (
          <View style={styles.iconRight}>{icon}</View>
        )}
      </Animated.View>
      
      {error && (
        <Animated.Text style={[styles.errorText, { color: errorColor }]}>
          {error}
        </Animated.Text>
      )}
    </View>
  );
}

function getBackgroundColor(variant: string, isDark: boolean) {
  switch (variant) {
    case 'filled':
      return isDark ? '#2C2C2E' : '#F2F2F7';
    case 'modern':
      return isDark ? '#1C1C1E' : '#FFFFFF';
    case 'floating':
      return isDark ? '#1C1C1E' : '#FFFFFF';
    case 'outline':
      return 'transparent';
    default:
      return 'transparent';
  }
}

function getVariantStyles(variant: string) {
  switch (variant) {
    case 'modern':
      return {
        borderRadius: 50,
        minHeight: 56,
      };
    case 'floating':
      return {
        borderRadius: 8,
        minHeight: 56,
      };
    case 'filled':
      return {
        borderRadius: 10,
        minHeight: 50,
      };
    case 'outline':
      return {
        borderRadius: 8,
        minHeight: 48,
      };
    default:
      return {
        borderRadius: 8,
        minHeight: 44,
      };
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
  },
  iconLeft: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  iconRight: {
    paddingLeft: 8,
    paddingRight: 16,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 4,
    marginLeft: 2,
  },
});