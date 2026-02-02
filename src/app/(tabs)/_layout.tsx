import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Dumbbell, BookHeart, MessageCircle, Settings } from 'lucide-react-native';
import { colors } from '@/lib/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

function TabBarIcon({
  icon: Icon,
  focused,
  label,
}: {
  icon: typeof Home;
  focused: boolean;
  label: string;
}) {
  return (
    <View className="items-center justify-center py-1" style={{ minWidth: 64 }}>
      <View
        className="rounded-full p-2 mb-0.5"
        style={{
          backgroundColor: focused ? colors.primary[100] : 'transparent',
        }}
      >
        <Icon
          size={22}
          color={focused ? colors.primary[600] : colors.jackal[400]}
          strokeWidth={focused ? 2.5 : 2}
        />
      </View>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: focused ? 'Nunito_700Bold' : 'Nunito_500Medium',
          color: focused ? colors.primary[600] : colors.jackal[400],
          fontSize: 11,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: colors.cream[50],
          borderTopWidth: 1,
          borderTopColor: colors.cream[200],
          elevation: 0,
          height: 70 + insets.bottom,
          paddingTop: 8,
          shadowColor: colors.jackal[300],
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarShowLabel: false,
        tabBarButton: (props) => (
          <Pressable
            {...props}
            onPressIn={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            android_ripple={{ color: colors.primary[100], borderless: true }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon={Home} focused={focused} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Practice',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon={Dumbbell} focused={focused} label="Practice" />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon={BookHeart} focused={focused} label="Journal" />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Gigi',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon={MessageCircle} focused={focused} label="Gigi" />
          ),
        }}
      />
    </Tabs>
  );
}
