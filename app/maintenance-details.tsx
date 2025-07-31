import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'

export const options = {
  headerShown: false,
};

function formatDateBR(dateString: string): string {
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

export default function MaintenanceDetailsScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { title, date, km, description, location, cost, id } = useLocalSearchParams()

function handleDelete() {
  Alert.alert(
    'Confirmar exclusão',
    'Tem certeza que deseja excluir esta manutenção?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase
            .from('maintenances')
            .delete()
            .eq('id', id as string)

          if (error) {
            Alert.alert('Erro', 'Não foi possível excluir a manutenção.')
          } else {
            Alert.alert('Sucesso', 'Manutenção excluída com sucesso.')
            router.back()
          }
        },
      },
    ],
    { cancelable: true }
  )
}


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={['#FF7B00', '#FFB347']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <Ionicons name="construct" size={64} color="white" />
          <Text style={styles.headerTitle}>{title}</Text>
        </LinearGradient>

        <View style={styles.detailsContainer}>
          <DetailRow icon="calendar" label="Data" value={formatDateBR(date as string)} />
          <DetailRow icon="speedometer" label="Quilometragem" value={`${km} km`} />
          <DetailRow icon="document-text" label="Descrição" value={description as string || 'N/A'} />
          <DetailRow icon="location" label="Local" value={location as string || 'N/A'} />
          <DetailRow icon="cash" label="Custo" value={cost ? `R$ ${cost}` : 'N/A'} />
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.deleteButtonText}>Excluir manutenção</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

function DetailRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={24} color="#FF7B00" style={styles.icon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
    backgroundColor: '#F9FAFB',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  icon: {
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  deleteButton: {
    marginTop: 32,
    marginHorizontal: 20,
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
