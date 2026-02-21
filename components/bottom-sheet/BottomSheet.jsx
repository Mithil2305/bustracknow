import React, { useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, TextInput } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../design/tokens';
import RouteCard from './RouteCard';

const BottomSheet = ({ 
  routes = [], 
  recentRoutes = [], 
  onRouteSelect, 
  searchTerm = '',
  onSearchChange,
  isExpanded = false,
  onToggleExpand
}) => {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef(null);
  const snapPoints = ['30%', '85%'];

  const handleSheetChanges = useCallback((index) => {
    if (index === 0 && isExpanded) {
      onToggleExpand?.(false);
    } else if (index === 1 && !isExpanded) {
      onToggleExpand?.(true);
    }
  }, [isExpanded, onToggleExpand]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        {/* Map Area */}
        <View className="flex-1">
          {/* Your Map component goes here */}
        </View>

        {/* Bottom Sheet Handle */}
        <View 
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg"
          style={{ paddingBottom: insets.bottom }}
        >
          {/* Handle Bar */}
          <View className="flex-row items-center justify-center py-3 border-t border-gray-200">
            <View className="w-12 h-1 bg-gray-300 rounded-full" />
          </View>

          {/* Search Bar */}
          <View className="px-4 py-3">
            <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
              <Ionicons name="search" size={20} color={colors.secondary} />
              <TextInput
                className="flex-1 ml-3 text-gray-800"
                placeholder="Search route or destination..."
                placeholderTextColor={colors.gray400}
                value={searchTerm}
                onChangeText={onSearchChange}
              />
              {searchTerm ? (
                <TouchableOpacity onPress={() => onSearchChange('')}>
                  <Ionicons name="close-circle" size={20} color={colors.gray400} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Bottom Sheet Content */}
          <BottomSheetScrollView 
            className="px-4"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Recent Routes Section */}
            {recentRoutes.length > 0 && (
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-lg font-bold text-gray-800">Recent Routes</Text>
                  <TouchableOpacity onPress={onToggleExpand}>
                    <Text className="text-blue-600 font-medium">View All</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {recentRoutes.map((route) => (
                    <RouteCard 
                      key={route.id} 
                      route={route} 
                      onPress={() => onRouteSelect(route)}
                      variant="compact"
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* All Routes Section */}
            <View className="mb-4">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                {searchTerm ? 'Search Results' : 'All Routes'}
              </Text>
              {routes.length === 0 ? (
                <View className="py-12 items-center">
                  <Ionicons name="bus-outline" size={48} color={colors.gray300} />
                  <Text className="text-gray-500 mt-3">
                    {searchTerm ? 'No routes found' : 'No routes available'}
                  </Text>
                </View>
              ) : (
                routes.map((route) => (
                  <RouteCard 
                    key={route.id} 
                    route={route} 
                    onPress={() => onRouteSelect(route)}
                  />
                ))
              )}
            </View>
          </BottomSheetScrollView>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default BottomSheet;
