import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, palette, spacing } from "../../../design/tokens";

const notifications = [
  {
    id: "1",
    title: "Bus 43A Approaching",
    body: "Your bus will arrive at City Center in 3 minutes",
    time: "2 min ago",
    icon: "time-outline",
    iconColor: palette.primary,
    iconBg: "#E0F7F1",
    unread: true,
  },
  {
    id: "2",
    title: "Route 12B Delayed",
    body: "Expected delay of 10 minutes due to traffic",
    time: "15 min ago",
    icon: "alert-circle-outline",
    iconColor: "#D97706",
    iconBg: "#FEF3C7",
    unread: true,
  },
  {
    id: "3",
    title: "Route Update",
    body: "Bus 8C now has live tracking available",
    time: "1 hour ago",
    icon: "trending-up-outline",
    iconColor: palette.primary,
    iconBg: "#DBEAFE",
    unread: false,
  },
  {
    id: "4",
    title: "Service Change",
    body: "Route 21 will have modified timings from tomorrow",
    time: "3 hours ago",
    icon: "notifications-outline",
    iconColor: "#64748B",
    iconBg: "#F1F5F9",
    unread: false,
  },
];

function Separator() {
  return <View style={separatorStyle.line} />;
}
const separatorStyle = StyleSheet.create({
  line: { height: 1, backgroundColor: "#D6EEF3", marginLeft: 76 },
});

export default function AlertsScreen() {
  const router = useRouter();
  const [items, setItems] = useState(notifications);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.unread && styles.cardUnread]}>
      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.icon} size={22} color={item.iconColor} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardBody}>{item.body}</Text>
        <Text style={styles.cardTime}>{item.time}</Text>
      </View>

      {/* Unread dot */}
      {item.unread && <View style={styles.unreadDot} />}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markRead}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={Separator}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.gray300} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#EDF7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: "#EDF7FA",
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.gray900,
  },
  markRead: {
    fontSize: 13,
    fontWeight: "600",
    color: palette.primary,
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: "transparent",
  },
  cardUnread: {
    backgroundColor: "#E0F4F8",
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    marginTop: 2,
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.gray900,
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 14,
    color: colors.gray600,
    lineHeight: 20,
    marginBottom: 6,
  },
  cardTime: {
    fontSize: 12,
    color: colors.gray400,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.primary,
    marginTop: 8,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 15,
    color: colors.gray400,
    marginTop: spacing.md,
  },
});
