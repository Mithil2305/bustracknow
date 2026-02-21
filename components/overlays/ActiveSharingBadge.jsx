import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

const ActiveSharingBadge = ({ 
  tripMinutes = 0, 
  pointsEarned = 0, 
  onStopSharing, 
  batteryLevel 
}) => {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [showBatteryWarning, setShowBatteryWarning] = useState(false);

  useEffect(() => {
    // Pulse animation for the badge
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Show battery warning if low
    if (batteryLevel && batteryLevel < 15) {
      setShowBatteryWarning(true);
    }

    return () => {
      pulseAnim.setValue(1);
    };
  }, []);

  const pulseScale = {
    transform: [{ scale: pulseAnim }],
  };

  return (
    <View className="absolute top-4 left-0 right-0 px-4 z-50">
      <View className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-4 shadow-lg">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Animated.View style={pulseScale}>
              <Ionicons name="location" size={20} color="white" />
            </Animated.View>
            <Text className="text-white font-bold ml-2">Sharing Live Location</Text>
          </View>
          <TouchableOpacity onPress={onStopSharing}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="items-center">
            <Text className="text-white/80 text-xs">Trip Duration</Text>
            <Text className="text-white font-bold text-lg">{tripMinutes} min</Text>
          </View>
          <View className="w-px h-8 bg-white/20" />
          <View className="items-center">
            <Text className="text-white/80 text-xs">Points Earned</Text>
            <Text className="text-white font-bold text-lg">+{pointsEarned}</Text>
          </View>
        </View>

        {/* Battery Warning */}
        {showBatteryWarning && (
          <View className="bg-teal-700/30 border border-teal-300 rounded-lg p-3 mb-2">
            <View className="flex-row items-center">
              <Ionicons name="battery-half" size={18} color="white" />
              <Text className="text-white text-sm ml-2">
                Low battery ({batteryLevel}%). Sharing will stop automatically to save power.
              </Text>
            </View>
          </View>
        )}

        {/* Stop Sharing Button */}
        <TouchableOpacity
          onPress={onStopSharing}
          className="bg-white/20 backdrop-blur-sm rounded-lg py-3 items-center active:bg-white/30"
        >
          <Text className="text-white font-bold text-base">Stop Sharing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActiveSharingBadge;
