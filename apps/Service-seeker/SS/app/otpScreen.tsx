import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function OtpScreen() {
  const router = useRouter();
  const { email, name, phone, type } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    try {
      const response = await fetch('http://192.168.18.75:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.success) {
        if (type === 'registration') {
          Alert.alert('Success', 'OTP verified successfully', [
            {
              text: 'OK',
              onPress: () =>
                router.push({
                  pathname: '/set-password',
                  params: { email, name, phone },
                }),
            },
          ]);
        } else if (type === 'forgot-password') {
          Alert.alert('Success', 'OTP verified successfully', [
            {
              text: 'OK',
              onPress: () =>
                router.push({
                  pathname: '/changepassword',
                  params: { email },
                }),
            },
          ]);
        }
      } else {
        Alert.alert('Error', data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Unable to verify OTP. Check your connection.');
    }
  };

  const handleResend = async () => {
    try {
      const response = await fetch('http://192.168.18.75:5000/api/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'OTP resent to your email');
        setTimer(60);
      } else {
        Alert.alert('Error', data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert('Error', 'Unable to resend OTP. Check your connection.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#19034d" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            Verification code sent to <Text style={{ color: '#05f51d' }}>{email}</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            placeholderTextColor="#999"
            maxLength={6}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleVerify}>
          <Text style={styles.submitButtonText}>Verify OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resendButton, { opacity: timer > 0 ? 0.5 : 1 }]}
          onPress={handleResend}
          disabled={timer > 0}
        >
          <Text style={styles.resendButtonText}>
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#19034d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    letterSpacing: 8,
  },
  submitButton: {
    backgroundColor: '#05f51d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19034d',
  },
  resendButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#05f51d',
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#05f51d',
  },
});
