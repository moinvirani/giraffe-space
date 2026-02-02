import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { colors } from '@/lib/colors';

export default function TermsScreen() {
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
            Terms of Use
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

          <Section title="Agreement to Terms">
            By downloading, installing, or using Giraffe ("the App"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the App.
          </Section>

          <Section title="Description of Service">
            Giraffe is a mobile application designed to help users learn and practice Nonviolent Communication (NVC) techniques. The App provides educational content, practice exercises, journaling features, and an AI-powered assistant to support your learning journey.
          </Section>

          <Section title="Subscription Terms">
            <BulletPoint>Giraffe Premium is available as an auto-renewable subscription</BulletPoint>
            <BulletPoint>Subscription options include Monthly ($4.99/month) and Annual ($29.99/year) plans</BulletPoint>
            <BulletPoint>Payment will be charged to your Apple ID account at confirmation of purchase</BulletPoint>
            <BulletPoint>Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period</BulletPoint>
            <BulletPoint>Your account will be charged for renewal within 24 hours prior to the end of the current period</BulletPoint>
            <BulletPoint>You can manage and cancel your subscriptions by going to your App Store account settings after purchase</BulletPoint>
            <BulletPoint>Any unused portion of a free trial period will be forfeited when you purchase a subscription</BulletPoint>
          </Section>

          <Section title="User Accounts">
            To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </Section>

          <Section title="User Content">
            Any content you create in the App, including journal entries and chat messages, remains your property. However, by using the App, you grant us a license to store and process this content to provide the service.
          </Section>

          <Section title="AI Assistant Disclaimer">
            Our AI assistant (Gigi) is designed to help you practice NVC concepts. It is not a substitute for professional mental health care, therapy, or counseling. If you are experiencing a mental health crisis, please contact a qualified professional or emergency services.
          </Section>

          <Section title="Acceptable Use">
            You agree not to:
            <BulletPoint>Use the App for any unlawful purpose</BulletPoint>
            <BulletPoint>Attempt to reverse engineer or compromise the App</BulletPoint>
            <BulletPoint>Share inappropriate or harmful content</BulletPoint>
            <BulletPoint>Violate the rights of others</BulletPoint>
          </Section>

          <Section title="Intellectual Property">
            All content, features, and functionality of the App are owned by Giraffe and are protected by copyright, trademark, and other intellectual property laws.
          </Section>

          <Section title="Limitation of Liability">
            The App is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the App.
          </Section>

          <Section title="Termination">
            We reserve the right to terminate or suspend your account and access to the App at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
          </Section>

          <Section title="Account Deletion">
            You can delete your account at any time through the Settings menu in the App. Upon deletion, all your personal data, including journal entries and chat history, will be permanently removed from our servers.
          </Section>

          <Section title="Changes to Terms">
            We may update these Terms from time to time. We will notify you of any changes by posting the new Terms in the App. Your continued use of the App after such changes constitutes your acceptance of the new Terms.
          </Section>

          <Section title="Governing Law">
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </Section>

          <Section title="Contact Us">
            If you have questions about these Terms of Use, please contact us at giraffespaceapp@gmail.com
          </Section>

          <View className="mt-6">
            <Pressable
              onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}
              className="p-4 rounded-xl"
              style={{ backgroundColor: colors.cream[100] }}
            >
              <Text
                className="text-sm text-center"
                style={{
                  fontFamily: 'Nunito_600SemiBold',
                  color: colors.primary[500],
                }}
              >
                View Apple's Standard EULA
              </Text>
            </Pressable>
          </View>

          <View
            className="p-4 rounded-xl mt-4"
            style={{ backgroundColor: colors.cream[100] }}
          >
            <Text
              className="text-xs text-center leading-5"
              style={{
                fontFamily: 'Nunito_400Regular',
                color: colors.jackal[400],
              }}
            >
              By using this App, you also agree to Apple's Standard End User License Agreement (EULA) available at apple.com/legal/internet-services/itunes/dev/stdeula/
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
