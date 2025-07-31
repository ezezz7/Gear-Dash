import { View, Text, FlatList, Alert, ActivityIndicator, StyleSheet, SafeAreaView, StatusBar } from 'react-native'
import { useEffect, useState, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '@/lib/supabase'
import { useFocusEffect } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const insets = useSafeAreaInsets()

  useFocusEffect(
    useCallback(() => {
      fetchFavorites()
    }, [])
  )

  async function fetchFavorites() {
    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id

    if (!userId) {
      Alert.alert('Erro', 'Usuário não autenticado.')
      setLoading(false)
      return
    }

    const { data: favs, error: favError } = await supabase
      .from('favorites')
      .select('maintenance_id')
      .eq('user_id', userId)

    if (favError) {
      Alert.alert('Erro ao buscar favoritos', favError.message)
      setLoading(false)
      return
    }

    const maintenanceIds = favs?.map((fav) => fav.maintenance_id) || []

    if (maintenanceIds.length === 0) {
      setFavorites([])
      setLoading(false)
      return
    }

    const { data: maints, error: maintError } = await supabase
      .from('maintenances')
      .select('id, title, date, mileage')
      .in('id', maintenanceIds)

    if (maintError) {
      Alert.alert('Erro ao buscar manutenções favoritas', maintError.message)
      setLoading(false)
      return
    }

    setFavorites(maints || [])
    setLoading(false)
  }

  return (
    <LinearGradient colors={['#FF7B00', '#FFB347']} style={styles.gradient}>
      <SafeAreaView style={[styles.container, { paddingTop: insets.top + 36 }]}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.title}>Favoritos</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>
                    {formatDate(item.date)} • {item.mileage} km
                  </Text>
                </View>
                <Ionicons name="heart" size={24} color="#f97316" />
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Nenhuma manutenção favorita encontrada.
                </Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  )
}

function formatDate(isoDate: string) {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
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
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
  },
})
