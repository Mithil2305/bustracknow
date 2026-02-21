import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../design/tokens';

const Badge = ({ 
  icon, 
  label, 
  value, 
  variant = 'default',
  size = 'medium',
  onPress,
  iconColor,
  textColor
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { padding: 8, fontSize: 10, iconSize: 14 };
      case 'large':
        return { padding: 16, fontSize: 16, iconSize: 24 };
      default:
        return { padding: 12, fontSize: 12, iconSize: 18 };
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return { bg: colors.primary, text: 'white', icon: 'white' };
      case 'success':
        return { bg: colors.success, text: 'white', icon: 'white' };
      case 'warning':
        return { bg: colors.warning, text: 'white', icon: 'white' };
      case 'danger':
        return { bg: colors.danger, text: 'white', icon: 'white' };
      case 'outline':
        return { bg: 'transparent', text: colors.primary, icon: colors.primary, border: colors.primary };
      default:
        return { bg: colors.gray100, text: colors.gray700, icon: colors.gray500 };
    }
  };

  const sizeStyle = getSize();
  const variantStyle = getVariantStyle();

  const BadgeContent = (
    <View 
      className={`flex-row items-center rounded-full ${variant === 'outline' ? 'border' : ''}`}
      style={{
        backgroundColor: variantStyle.bg,
        borderColor: variantStyle.border,
        paddingHorizontal: sizeStyle.padding,
        paddingVertical: sizeStyle.padding / 2,
      }}
    >
      {icon && (
        <Ionicons 
          name={icon} 
          size={sizeStyle.iconSize} 
          color={iconColor || variantStyle.icon} 
        />
      )}
      
      {(label || value) && (
        <View className="ml-2">
          {label && (
            <Text 
              style={{ 
                color: textColor || variantStyle.text,
                fontSize: sizeStyle.fontSize,
                fontWeight: '500'
              }}
            >
              {label}
            </Text>
          )}
          {value && (
            <Text 
              style={{ 
                color: textColor || variantStyle.text,
                fontSize: sizeStyle.fontSize - 2,
                fontWeight: '600',
                opacity: 0.9
              }}
            >
              {value}
            </Text>
          )}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {BadgeContent}
      </TouchableOpacity>
    );
  }

  return BadgeContent;
};

export default Badge;
