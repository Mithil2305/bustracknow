import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../design/tokens';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = ''
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: colors.primary,
          text: 'white',
          border: colors.primary,
          pressed: '#0a7a71',
        };
      case 'secondary':
        return {
          bg: colors.secondary,
          text: 'white',
          border: colors.secondary,
          pressed: '#1d4ed8',
        };
      case 'success':
        return {
          bg: colors.success,
          text: 'white',
          border: colors.success,
          pressed: '#0da275',
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: colors.primary,
          border: colors.primary,
          pressed: colors.gray100,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: colors.gray700,
          border: 'transparent',
          pressed: colors.gray100,
        };
      case 'danger':
        return {
          bg: colors.danger,
          text: 'white',
          border: colors.danger,
          pressed: '#dc2626',
        };
      default:
        return {
          bg: colors.gray300,
          text: colors.gray700,
          border: colors.gray300,
          pressed: colors.gray400,
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { height: 36, fontSize: 12, paddingHorizontal: 16 };
      case 'large':
        return { height: 52, fontSize: 16, paddingHorizontal: 24 };
      default:
        return { height: 44, fontSize: 14, paddingHorizontal: 20 };
    }
  };

  const variantStyle = getVariantStyle();
  const sizeStyle = getSizeStyle();

  const buttonStyle = {
    backgroundColor: disabled ? colors.gray200 : variantStyle.bg,
    height: sizeStyle.height,
    paddingHorizontal: sizeStyle.paddingHorizontal,
    borderRadius: 12,
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: disabled ? colors.gray200 : variantStyle.border,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: disabled ? 0.6 : 1,
  };

  const textStyle = {
    color: disabled ? colors.gray400 : variantStyle.text,
    fontSize: sizeStyle.fontSize,
    fontWeight: '600',
    textAlign: 'center',
  };

  return (
    <TouchableOpacity
      style={[buttonStyle, fullWidth && { width: '100%' }, styles.button, { backgroundColor: variantStyle.bg }]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      onPressIn={() => {}}
      onPressOut={() => {}}
    >
      <Text style={[textStyle, { color: variantStyle.text }]}>
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
