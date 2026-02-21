import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../design/tokens';

const RouteCard = ({ route, onPress, variant = 'default' }) => {
  const isCompact = variant === 'compact';

  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`bg-white rounded-xl mb-3 ${isCompact ? 'mr-3 w-48' : ''}`}
      activeOpacity={0.7}
    >
      <View className={`flex-row items-center p-4 ${isCompact ? 'p-3' : ''}`}>
        {/* Route Icon */}
        <View className="w-12 h-12 bg-teal-100 rounded-lg items-center justify-center mr-3">
          <Text className="text-teal-700 font-bold text-lg">
            {route.routeNumber}
          </Text>
        </View>

        {/* Route Info */}
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="font-bold text-gray-800 text-base">
                {route.origin} → {route.destination}
              </Text>
              {route.averageTime && (
                <Text className="text-gray-500 text-sm mt-1">
                  ~{route.averageTime} mins
                </Text>
              )}
            </View>
            {route.isActive && (
              <View className="bg-green-100 px-2 py-1 rounded-full">
                <Text className="text-green-700 text-xs font-medium">Active</Text>
              </View>
            )}
          </View>

          {/* ETA Preview (if available) */}
          {route.nextBusEta && (
            <View className="flex-row items-center mt-2">
              <Ionicons name="time-outline" size={14} color={colors.gray500} />
              <Text className="text-gray-600 text-sm ml-1">
                Next bus in {route.nextBusEta} mins
              </Text>
            </View>
          )}
        </View>

        {/* Chevron */}
        <Ionicons name="chevron-forward" size={24} color={colors.gray400} />
      </View>
    </TouchableOpacity>
  );
};

export default RouteCard;
