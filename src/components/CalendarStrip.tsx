import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { colors } from '@/lib/colors';
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  isToday,
  subWeeks,
  addWeeks,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  parseISO,
} from 'date-fns';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CalendarStripProps {
  entryDates: string[]; // ISO date strings of entries
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
}

const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function DayButton({
  date,
  isSelected,
  hasEntry,
  onPress,
}: {
  date: Date;
  isSelected: boolean;
  hasEntry: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dayOfWeek = format(date, 'EEEEE'); // Single letter
  const dayNumber = format(date, 'd');
  const isTodayDate = isToday(date);

  return (
    <AnimatedPressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      onPressIn={() => {
        scale.value = withSpring(0.9);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={animatedStyle}
      className="items-center mx-1.5"
    >
      <Text
        className="text-xs mb-1"
        style={{
          fontFamily: 'Nunito_600SemiBold',
          color: isSelected ? colors.primary[600] : colors.jackal[400],
        }}
      >
        {dayOfWeek}
      </Text>
      <View
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{
          backgroundColor: isSelected
            ? colors.primary[500]
            : isTodayDate
            ? colors.primary[100]
            : 'transparent',
        }}
      >
        <Text
          className="text-base"
          style={{
            fontFamily: isSelected || isTodayDate ? 'Nunito_700Bold' : 'Nunito_600SemiBold',
            color: isSelected
              ? '#FFFFFF'
              : isTodayDate
              ? colors.primary[600]
              : colors.jackal[700],
          }}
        >
          {dayNumber}
        </Text>
      </View>
      {hasEntry && (
        <View
          className="w-1.5 h-1.5 rounded-full mt-1"
          style={{ backgroundColor: colors.coral[500] }}
        />
      )}
      {!hasEntry && <View className="w-1.5 h-1.5 mt-1" />}
    </AnimatedPressable>
  );
}

function MonthCalendarModal({
  visible,
  onClose,
  currentMonth,
  onChangeMonth,
  entryDates,
  selectedDate,
  onSelectDate,
}: {
  visible: boolean;
  onClose: () => void;
  currentMonth: Date;
  onChangeMonth: (date: Date) => void;
  entryDates: string[];
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = addDays(startOfWeek(monthEnd, { weekStartsOn: 0 }), 6);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const hasEntryOnDate = (date: Date) => {
    return entryDates.some((d) => isSameDay(parseISO(d), date));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={onClose}
      >
        <Pressable
          className="rounded-3xl p-5 mx-5 w-80"
          style={{
            backgroundColor: colors.cream[50],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 8,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Pressable
              onPress={() => onChangeMonth(subWeeks(currentMonth, 4))}
              className="p-2"
            >
              <ChevronLeft size={24} color={colors.jackal[600]} />
            </Pressable>
            <Text
              className="text-lg"
              style={{
                fontFamily: 'Nunito_700Bold',
                color: colors.jackal[800],
              }}
            >
              {format(currentMonth, 'MMMM yyyy')}
            </Text>
            <Pressable
              onPress={() => onChangeMonth(addWeeks(currentMonth, 4))}
              className="p-2"
            >
              <ChevronRight size={24} color={colors.jackal[600]} />
            </Pressable>
          </View>

          {/* Day names */}
          <View className="flex-row mb-2">
            {DAY_NAMES.map((day, i) => (
              <View key={i} className="flex-1 items-center">
                <Text
                  className="text-xs"
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    color: colors.jackal[400],
                  }}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          <View className="flex-row flex-wrap">
            {days.map((day, i) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const hasEntry = hasEntryOnDate(day);
              const isTodayDate = isToday(day);

              return (
                <Pressable
                  key={i}
                  className="items-center justify-center"
                  style={{ width: '14.28%', height: 44 }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onSelectDate(isSelected ? null : day);
                    onClose();
                  }}
                >
                  <View
                    className="w-9 h-9 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: isSelected
                        ? colors.primary[500]
                        : isTodayDate
                        ? colors.primary[100]
                        : 'transparent',
                    }}
                  >
                    <Text
                      className="text-sm"
                      style={{
                        fontFamily: isSelected || isTodayDate ? 'Nunito_700Bold' : 'Nunito_500Medium',
                        color: isSelected
                          ? '#FFFFFF'
                          : !isCurrentMonth
                          ? colors.jackal[300]
                          : isTodayDate
                          ? colors.primary[600]
                          : colors.jackal[700],
                      }}
                    >
                      {format(day, 'd')}
                    </Text>
                  </View>
                  {hasEntry && (
                    <View
                      className="w-1 h-1 rounded-full absolute bottom-0.5"
                      style={{ backgroundColor: colors.coral[500] }}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Clear selection button */}
          {selectedDate && (
            <Pressable
              onPress={() => {
                onSelectDate(null);
                onClose();
              }}
              className="mt-4 py-2 items-center"
            >
              <Text
                className="text-sm"
                style={{
                  fontFamily: 'Nunito_600SemiBold',
                  color: colors.coral[500],
                }}
              >
                Clear Selection
              </Text>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function CalendarStrip({ entryDates, selectedDate, onSelectDate }: CalendarStripProps) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [showMonthModal, setShowMonthModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const hasEntryOnDate = (date: Date) => {
    return entryDates.some((d) => isSameDay(parseISO(d), date));
  };

  const goToPrevWeek = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWeekStart(subWeeks(weekStart, 1));
  };

  const goToNextWeek = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWeekStart(addWeeks(weekStart, 1));
  };

  const handleDayPress = (date: Date) => {
    if (selectedDate && isSameDay(date, selectedDate)) {
      onSelectDate(null); // Deselect if already selected
    } else {
      onSelectDate(date);
    }
  };

  return (
    <Animated.View
      entering={FadeIn.delay(50)}
      className="px-4 pb-3"
    >
      {/* Navigation row: arrows + month label + calendar icon */}
      <View className="flex-row items-center justify-between mb-2">
        <Pressable
          onPress={goToPrevWeek}
          className="p-1.5"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ChevronLeft size={18} color={colors.jackal[400]} />
        </Pressable>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowMonthModal(true);
          }}
          className="flex-row items-center gap-2"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text
            className="text-sm"
            style={{
              fontFamily: 'Nunito_600SemiBold',
              color: colors.jackal[600],
            }}
          >
            {format(weekStart, 'MMMM yyyy')}
          </Text>
          <Calendar size={16} color={colors.primary[500]} />
        </Pressable>

        <Pressable
          onPress={goToNextWeek}
          className="p-1.5"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ChevronRight size={18} color={colors.jackal[400]} />
        </Pressable>
      </View>

      {/* Week days - full width */}
      <View className="flex-row justify-around">
        {weekDays.map((date) => (
          <DayButton
            key={date.toISOString()}
            date={date}
            isSelected={selectedDate !== null && isSameDay(date, selectedDate)}
            hasEntry={hasEntryOnDate(date)}
            onPress={() => handleDayPress(date)}
          />
        ))}
      </View>

      {/* Month calendar modal */}
      <MonthCalendarModal
        visible={showMonthModal}
        onClose={() => setShowMonthModal(false)}
        currentMonth={weekStart}
        onChangeMonth={setWeekStart}
        entryDates={entryDates}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />
    </Animated.View>
  );
}
