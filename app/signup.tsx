import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter, Stack } from 'expo-router'
import { supabase } from '@/lib/supabase'

export default function SignUpScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  async function handleSignUp() {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos.')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.')
      return
    }

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      Alert.alert('Erro ao cadastrar', error.message)
    } else {
      Alert.alert(
    'Verifique seu e-mail',
    'Enviamos um link de confirmação para seu e-mail. Confirme antes de fazer login.'
    )
    router.replace('/login')

    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient colors={['#FF7B00', '#FFB347']} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'android' ? 80 : 64}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Criar conta</Text>

            <View style={styles.form}>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#888"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                placeholder="Senha"
                placeholderTextColor="#888"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TextInput
                placeholder="Confirmar senha"
                placeholderTextColor="#888"
                style={styles.input}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Cadastrar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.replace('/login')} style={{ marginTop: 12 }}>
                <Text style={styles.link}>
                  Já tem conta? <Text style={styles.linkBold}>Faça login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  form: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 16,
  },
  input: {
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#FF7B00',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  linkBold: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
})
