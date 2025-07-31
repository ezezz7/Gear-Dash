import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string>('user')
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUser(user)

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        setRole(profile?.role ?? 'user')
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      Alert.alert('Erro ao sair', error.message)
    } else {
      router.replace('/login')
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF7B00', '#FFB347']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Ionicons name="person-circle-outline" size={100} color="#fff" />
        <Text style={styles.headerText}>Perfil do Usuário</Text>
      </LinearGradient>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="mail" size={20} color="#FF7A00" style={styles.icon} />
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="person" size={20} color="#FF7A00" style={styles.icon} />
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value}>
            {role === 'admin' ? 'Administrador' : 'Usuário comum'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginTop: 27,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    margin: 24,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontWeight: '600',
    marginRight: 6,
    fontSize: 16,
    color: '#444',
  },
  value: {
    fontSize: 16,
    color: '#000',
    flexShrink: 1,
  },
  logoutButton: {
    backgroundColor: '#FF7A00',
    marginHorizontal: 74,
    paddingVertical: 14,
    borderRadius: 17,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 32,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
