import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { colors } from '@/lib/colors';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.cream[50] }}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-3 border-b" style={{ borderColor: colors.cream[200] }}>
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.cream[200] }}
          >
            <X size={22} color={colors.jackal[500]} />
          </Pressable>

          <Text
            className="text-lg"
            style={{
              fontFamily: 'Nunito_700Bold',
              color: colors.jackal[800],
            }}
          >
            Privacy Policy
          </Text>

          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
        >
          <Text
            className="text-xs mb-6"
            style={{
              fontFamily: 'Nunito_400Regular',
              color: colors.jackal[400],
            }}
          >
            Last updated: January 2026
          </Text>

          <Section title="Introduction">
            Giraffe ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.
          </Section>

          <Section title="Information We Collect">
            <BulletPoint>Account Information: Name, email address, age range, and gender (optional)</BulletPoint>
            <BulletPoint>Usage Data: Your progress, completed exercises, streaks, and journal entries</BulletPoint>
            <BulletPoint>Chat Data: Conversations with Gigi, our AI assistant</BulletPoint>
          </Section>

          <Section title="How We Use Your Information">
            <BulletPoint>To provide and personalize the app experience</BulletPoint>
            <BulletPoint>To track your learning progress and streaks</BulletPoint>
            <BulletPoint>To enable AI-powered conversations with Gigi</BulletPoint>
            <BulletPoint>To improve our services</BulletPoint>
          </Section>

          <Section title="AI & Third-Party Services">
            Our AI assistant (Gigi) uses OpenAI's API to process your messages. When you chat with Gigi, your messages are sent to OpenAI for processing. Please review OpenAI's privacy policy for information about how they handle data.
          </Section>

          <Section title="Data Storage">
            Your account data is stored securely using Supabase. Journal entries and chat history are stored locally on your device and in your secure cloud account.
          </Section>

          <Section title="Data Retention">
            We retain your data for as long as your account is active. You can delete your account and all associated data at any time through the Settings menu.
          </Section>

          <Section title="Your Rights">
            <BulletPoint>Access your personal data</BulletPoint>
            <BulletPoint>Request correction of your data</BulletPoint>
            <BulletPoint>Request deletion of your data</BulletPoint>
            <BulletPoint>Export your data</BulletPoint>
          </Section>

          <Section title="Children's Privacy">
            This app is not intended for children under 18 years of age. We do not knowingly collect personal information from children.
          </Section>

          <Section title="Changes to This Policy">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy in the app.
          </Section>

          <Section title="Contact Us">
            If you have questions about this Privacy Policy, please contact us at giraffespaceapp@gmail.com
          </Section>

          <View
            className="p-4 rounded-xl mt-6"
            style={{ backgroundColor: colors.cream[100] }}
          >
            <Text
              className="text-xs text-center leading-5"
              style={{
                fontFamily: 'Nunito_400Regular',
                color: colors.jackal[400],
              }}
            >
              This app is for educational purposes and personal growth. It is not a substitute for professional mental health care or therapy.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      <Text
        className="text-base mb-2"
        style={{
          fontFamily: 'Nunito_700Bold',
          color: colors.jackal[800],
        }}
      >
        {title}
      </Text>
      <Text
        className="text-sm leading-6"
        style={{
          fontFamily: 'Nunito_400Regular',
          color: colors.jackal[600],
        }}
      >
        {children}
      </Text>
    </View>
  );
}

function BulletPoint({ children }: { children: React.ReactNode }) {
  return (
    <Text
      className="text-sm leading-6"
      style={{
        fontFamily: 'Nunito_400Regular',
        color: colors.jackal[600],
      }}
    >
      {'\n'}• {children}
    </Text>
  );
}
