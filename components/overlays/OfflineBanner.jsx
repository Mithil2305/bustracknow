import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../design/tokens';

const OfflineBanner = ({ 
  isOffline, 
  lastSyncTime, 
  onRetrySync,
  retrying = false
}) => {
  if (!isOffline) return null;

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Never';
    const diff = Date.now() - lastSyncTime;
    const mins = Math.floor(diff / 60000);
    
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
    const hours = Math.floor(mins / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  return (
    <View className="absolute top-4 left-0 right-0 px-4 z-50">
      <View className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 flex-row items-center">
        {/* Icon */}
        <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center mr-3">
          <Ionicons name="cloud-offline" size={20} color={colors.warning} />
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="font-bold text-gray-800">Offline Mode</Text>
          <Text className="text-gray-600 text-sm mt-1">
            Showing cached data. Last synced: {formatLastSync()}
          </Text>
        </View>

        {/* Retry Button */}
        <TouchableOpacity
          onPress={onRetrySync}
          disabled={retrying}
          className="ml-3"
        >
          {retrying ? (
            <ActivityIndicator size="small" color={colors.warning} />
          ) : (
            <Ionicons name="refresh" size={20} color={colors.warning} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OfflineBanner;
