import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { KeyboardAvoidingView, useKeyboardHandler } from 'react-native-keyboard-controller';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useDerivedValue,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Trash2, Sparkles, ArrowUp, Crown } from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/colors';
import { ChatMessage } from '@/lib/types';
import { sendMessageToGigi } from '@/lib/openai';
import { usePremium } from '@/lib/usePremium';

// Free users get 10 messages per day
const FREE_MESSAGE_LIMIT = 10;

const GIGI_INTRO = `Hey there, I'm Gigi 🦒

This is a judgment-free zone. Whatever you're feeling right now — the frustration, the anger, the messy thoughts — bring it all here. Your inner jackal is welcome.

**Let it out.** What's bothering you? Don't filter it, just say what's really on your mind.`;

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <Animated.View
      entering={FadeInDown.springify()}
      className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <View
        className={`max-w-[85%] rounded-2xl p-4 ${
          isUser ? 'rounded-br-md' : 'rounded-bl-md'
        }`}
        style={{
          backgroundColor: isUser ? colors.primary[500] : colors.cream[100],
        }}
      >
        {!isUser && (
          <View className="flex-row items-center mb-2">
            <Text className="text-xl mr-2">🦒</Text>
            <Text
              className="text-base"
              style={{
                fontFamily: 'Nunito_700Bold',
                color: colors.sage[600],
              }}
            >
              Gigi
            </Text>
          </View>
        )}
        <Text
          selectable
          className="text-[17px] leading-7"
          style={{
            fontFamily: 'Nunito_500Medium',
            color: isUser ? '#FFFFFF' : colors.jackal[700],
          }}
        >
          {message.content}
        </Text>
      </View>
    </Animated.View>
  );
}

function TypingIndicator() {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    dot1.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 300 }),
        withTiming(0, { duration: 300 })
      ),
      -1
    );
    dot2.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 150 }),
        withTiming(-4, { duration: 300 }),
        withTiming(0, { duration: 300 })
      ),
      -1
    );
    dot3.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 300 }),
        withTiming(-4, { duration: 300 }),
        withTiming(0, { duration: 300 })
      ),
      -1
    );
  }, [dot1, dot2, dot3]);

  const dot1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot1.value }],
  }));
  const dot2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot2.value }],
  }));
  const dot3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot3.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn}
      className="items-start mb-4"
    >
      <View
        className="rounded-2xl rounded-bl-md p-4 flex-row items-center"
        style={{ backgroundColor: colors.cream[100] }}
      >
        <Text className="text-xl mr-2">🦒</Text>
        <View className="flex-row gap-1.5">
          <Animated.View
            style={[dot1Style, { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.sage[400] }]}
          />
          <Animated.View
            style={[dot2Style, { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.sage[400] }]}
          />
          <Animated.View
            style={[dot3Style, { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.sage[400] }]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

function QuickPromptCard({ text, onPress }: { text: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="mr-3">
      <View
        className="px-5 py-3 rounded-2xl"
        style={{
          backgroundColor: colors.cream[100],
          borderWidth: 1.5,
          borderColor: colors.cream[200],
        }}
      >
        <Text
          className="text-[15px]"
          style={{
            fontFamily: 'Nunito_500Medium',
            color: colors.jackal[600],
          }}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  );
}

export default function ChatScreen() {
  const router = useRouter();
  const chatMessages = useAppStore(s => s.chatMessages);
  const addChatMessage = useAppStore(s => s.addChatMessage);
  const clearChat = useAppStore(s => s.clearChat);
  const user = useAppStore(s => s.user);
  const insets = useSafeAreaInsets();
  const { isPremium } = usePremium();

  // Get actual tab bar height
  const tabBarHeight = useBottomTabBarHeight();

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // Track keyboard height for dynamic bottom padding
  const keyboardHeight = useSharedValue(0);

  useKeyboardHandler({
    onMove: (e) => {
      'worklet';
      keyboardHeight.value = e.height;
    },
    onEnd: (e) => {
      'worklet';
      keyboardHeight.value = e.height;
    },
  });

  // Animated style for input container - reduce padding when keyboard is open
  const inputContainerAnimatedStyle = useAnimatedStyle(() => {
    // When keyboard is closed (height = 0), use full tabBarHeight + 8
    // When keyboard is open, use just 8px padding
    const bottomPadding = interpolate(
      keyboardHeight.value,
      [0, 100],
      [tabBarHeight + 8, 8],
      'clamp'
    );

    return {
      paddingBottom: bottomPadding,
    };
  });

  // Count user messages for free limit
  const userMessageCount = chatMessages.filter(m => m.role === 'user').length;
  const hasReachedLimit = !isPremium && userMessageCount >= FREE_MESSAGE_LIMIT;
  const remainingMessages = Math.max(0, FREE_MESSAGE_LIMIT - userMessageCount);

  const quickPrompts = [
    "I'm so annoyed because...",
    "Someone said something that hurt me",
    "I keep thinking about...",
    "I need to vent about...",
  ];

  useEffect(() => {
    // Add intro message if no messages
    if (chatMessages.length === 0) {
      addChatMessage({ role: 'assistant', content: GIGI_INTRO });
    }
  }, [chatMessages.length, addChatMessage]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');

    // Add user message
    addChatMessage({ role: 'user', content: userMessage });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Show typing indicator
    setIsTyping(true);

    try {
      // Convert chat messages to the format expected by OpenAI
      const messagesForAPI = chatMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      }));

      // Get AI response with user context (provide defaults if user is null)
      const response = await sendMessageToGigi(
        messagesForAPI,
        userMessage,
        user?.profile ?? undefined,
        user?.name ?? 'friend'
      );
      addChatMessage({ role: 'assistant', content: response });
    } catch (error) {
      console.error('Error getting response:', error);
      addChatMessage({
        role: 'assistant',
        content: "I'm having trouble connecting right now. Let me try again - what's on your mind?",
      });
    }

    setIsTyping(false);

    // Scroll to bottom again
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    clearChat();
    addChatMessage({ role: 'assistant', content: GIGI_INTRO });
  };

  const canSend = inputText.trim().length > 0 && !isTyping && !hasReachedLimit;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.cream[50] }}>
      {/* Header with safe area */}
      <View style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-5 pt-2 pb-3 border-b" style={{ borderColor: colors.cream[200] }}>
          <Animated.View entering={FadeIn} className="flex-row items-center">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: colors.primary[100] }}
            >
              <Text className="text-2xl">🦒</Text>
            </View>
            <View>
              <Text
                className="text-xl"
                style={{
                  fontFamily: 'Nunito_700Bold',
                  color: colors.jackal[800],
                }}
              >
                Gigi
              </Text>
              <View className="flex-row items-center">
                <Sparkles size={12} color={colors.sage[500]} />
                <Text
                  className="text-sm ml-1"
                  style={{
                    fontFamily: 'Nunito_500Medium',
                    color: colors.sage[500],
                  }}
                >
                  Your AI NVC Companion
                </Text>
              </View>
            </View>
          </Animated.View>

          <View className="flex-row items-center">
            {/* Show remaining messages for free users */}
            {!isPremium && (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/paywall');
                }}
                className="flex-row items-center mr-3 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: remainingMessages <= 2 ? colors.coral[100] : colors.cream[200] }}
              >
                <Text
                  className="text-sm"
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    color: remainingMessages <= 2 ? colors.coral[600] : colors.jackal[500],
                  }}
                >
                  {remainingMessages} left
                </Text>
              </Pressable>
            )}

            {chatMessages.length > 1 && (
              <Pressable
                onPress={handleClearChat}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.cream[200] }}
              >
                <Trash2 size={18} color={colors.jackal[400]} />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* KeyboardAvoidingView wraps everything below the header */}
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {chatMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Quick prompts - show only at start */}
        {chatMessages.length <= 1 && !hasReachedLimit && (
          <Animated.View
            entering={FadeInUp.delay(300).springify()}
            className="px-4 pb-3"
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
              style={{ flexGrow: 0 }}
            >
              {quickPrompts.map((prompt, index) => (
                <QuickPromptCard
                  key={index}
                  text={prompt}
                  onPress={() => handleQuickPrompt(prompt)}
                />
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Input Area */}
        <Animated.View
          className="px-4 pt-2"
          style={inputContainerAnimatedStyle}
        >
          {hasReachedLimit ? (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/paywall');
              }}
            >
              <LinearGradient
                colors={[colors.primary[400], colors.primary[500], colors.primary[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 20,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: colors.primary[600],
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  <Crown size={24} color="#FFFFFF" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-base"
                    style={{
                      fontFamily: 'Nunito_700Bold',
                      color: '#FFFFFF',
                    }}
                  >
                    Upgrade to Premium
                  </Text>
                  <Text
                    className="text-sm"
                    style={{
                      fontFamily: 'Nunito_500Medium',
                      color: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    Get unlimited chats with Gigi
                  </Text>
                </View>
                <View
                  className="px-4 py-2 rounded-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
                >
                  <Text
                    className="text-sm"
                    style={{
                      fontFamily: 'Nunito_700Bold',
                      color: '#FFFFFF',
                    }}
                  >
                    Subscribe
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          ) : (
            <View
              className="rounded-3xl overflow-hidden"
              style={{
                backgroundColor: colors.cream[100],
                borderWidth: 1.5,
                borderColor: colors.cream[300],
              }}
            >
              <TextInput
                ref={inputRef}
                className="px-5 pt-4 pb-3 text-[17px]"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.jackal[700],
                  minHeight: 52,
                  maxHeight: 120,
                }}
                placeholder="What's on your mind?"
                placeholderTextColor={colors.jackal[400]}
                value={inputText}
                onChangeText={setInputText}
                multiline
              />

              {/* Bottom row with hint and send button */}
              <View className="flex-row items-center justify-between px-4 pb-3">
                <Text
                  className="text-xs"
                  style={{
                    fontFamily: 'Nunito_400Regular',
                    color: colors.jackal[300],
                  }}
                >
                  Share freely — this is a safe space
                </Text>

                <Pressable
                  onPress={handleSend}
                  disabled={!canSend}
                >
                  <LinearGradient
                    colors={
                      canSend
                        ? [colors.primary[400], colors.primary[500]]
                        : [colors.cream[300], colors.cream[300]]
                    }
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ArrowUp
                      size={20}
                      color={canSend ? '#FFFFFF' : colors.jackal[300]}
                      strokeWidth={2.5}
                    />
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
