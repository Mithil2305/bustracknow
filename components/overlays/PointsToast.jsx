import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { colors } from '../../design/tokens';

const PointsToast = ({ 
  visible, 
  points = 0, 
  message = '', 
  type = 'location_share',
  onClose 
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss after 3 seconds
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onClose?.());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const getTypeIcon = () => {
    switch (type) {
      case 'location_share':
        return 'location';
      case 'stop_confirm':
        return 'stop-circle';
      case 'alert_full':
      case 'alert_late':
      case 'alert_not_running':
        return 'alert-circle';
      case 'streak_3day':
      case 'streak_7day':
      case 'streak_30day':
        return 'ribbon';
      case 'referral':
        return 'people';
      default:
        return 'star';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'location_share':
        return colors.primary;
      case 'stop_confirm':
        return colors.success;
      case 'alert_full':
      case 'alert_late':
      case 'alert_not_running':
        return colors.warning;
      default:
        return colors.secondary;
    }
  };

  return (
    <Animated.View
      className="absolute top-20 left-0 right-0 items-center px-4 z-50"
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View className="bg-white rounded-2xl shadow-xl p-4 max-w-xs w-full border border-gray-100">
        <View className="flex-row items-center">
          {/* Icon Circle */}
          <View 
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${getTypeColor()}15` }}
          >
            <Ionicons name={getTypeIcon()} size={24} color={getTypeColor()} />
          </View>

          {/* Content */}
          <View className="flex-1">
            <View className="flex-row items-baseline">
              <Text className="text-3xl font-bold text-gray-900">+{points}</Text>
              <Text className="text-gray-500 text-sm ml-2">points</Text>
            </View>
            <Text className="text-gray-700 font-medium mt-1">
              {message || 'Points earned!'}
            </Text>
          </View>
        </View>

        {/* Progress Bar (Optional) */}
        {type === 'location_share' && (
          <View className="mt-3 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <Animated.View
              className="bg-teal-500 h-full rounded-full"
              style={{ width: `${Math.min(points / 30 * 100, 100)}%` }}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export default PointsToast;
