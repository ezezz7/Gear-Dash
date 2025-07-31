import { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
  TextInput,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'

function formatDateBR(dateString: string): string {
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

export default function MaintenanceList() {
  const router = useRouter()
  const [maintenances, setMaintenances] = useState<any[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const insets = useSafeAreaInsets()

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const { data: userData } = await supabase.auth.getUser()
        const userId = userData?.user?.id

        if (!userId) {
          Alert.alert('Erro', 'Usuário não autenticado.')
          return
        }

        // Verifica se o usuário é admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single()

        setIsAdmin(profile?.role === 'admin')

        // Carrega manutenções
        const { data: maints, error: maintError } = await supabase
          .from('maintenances')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })

        const { data: favs, error: favError } = await supabase
          .from('favorites')
          .select('maintenance_id')
          .eq('user_id', userId)

        if (maintError || favError) {
          Alert.alert('Erro', 'Erro ao carregar manutenções ou favoritos')
          return
        }

        setMaintenances(maints || [])
        setFavorites((favs || []).map(f => f.maintenance_id))
      }

      fetchData()
    }, [])
  )

  async function toggleFavorite(maintenanceId: string) {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id
    if (!userId) return

    const isFavorited = favorites.includes(maintenanceId)

    if (isFavorited) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('maintenance_id', maintenanceId)

      if (!error) {
        setFavorites(prev => prev.filter(id => id !== maintenanceId))
      }
    } else {
      const { error } = await supabase.from('favorites').insert({
        user_id: userId,
        maintenance_id: maintenanceId,
      })

      if (!error) {
        setFavorites(prev => [...prev, maintenanceId])
      }
    }
  }

  const filteredMaintenances = maintenances.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <LinearGradient colors={['#FF7B00', '#FFB347']} style={styles.gradient}>
      <SafeAreaView style={[styles.container, { paddingTop: insets.top + 36 }]}>
        <StatusBar barStyle="dark-content" />

        <Text style={styles.title}>Suas Manutenções</Text>

        {isAdmin && (
          <TouchableOpacity onPress={() => Alert.alert('Acesso Admin')}>
            <Text style={styles.adminLabel}>[Admin] Gerenciar sistema</Text>
          </TouchableOpacity>
        )}

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar manutenção..."
          placeholderTextColor="#fff"
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={filteredMaintenances}
          keyExtractor={item => item.id}
          contentContainerStyle={{ gap: 12, paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma manutenção encontrada.</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: '/maintenance-details',
                  params: {
                    id: item.id,
                    title: item.title,
                    date: item.date,
                    km: item.mileage.toString(),
                    description: item.description ?? 'Sem descrição',
                    cost: item.cost?.toString() ?? '0',
                    location: item.location ?? 'Não informado',
                  },
                })
              }
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>{formatDateBR(item.date)}</Text>
              </View>

              <View style={styles.cardBottom}>
                <Text style={styles.cardInfo}>{item.mileage} km</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <Ionicons
                    name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
                    size={22}
                    color="#f97316"
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity style={styles.fab} onPress={() => router.push('/create-maintenance')}>
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  adminLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 10,
    color: '#fff',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
  },
  cardInfo: {
    color: '#FF7B00',
    fontWeight: 'bold',
    marginTop: 2,
  },
  emptyText: {
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#FF7B00',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
})
