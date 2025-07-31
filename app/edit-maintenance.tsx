import { useLocalSearchParams, useRouter } from 'expo-router'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

function formatDateToISO(input: string): string {
  const [day, month, year] = input.split('/')
  return `${year}-${month}-${day}`
}

function formatDateToDisplay(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

export default function EditMaintenance() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const maintenanceId = params.id as string

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [km, setKm] = useState('')
  const [cost, setCost] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('maintenances')
        .select('*')
        .eq('id', maintenanceId)
        .single()

      if (error) {
        Alert.alert('Erro ao carregar manutenção', error.message)
      } else {
        setTitle(data.title)
        setDescription(data.description || '')
        setKm(data.mileage?.toString() || '')
        setCost(data.cost?.toString() || '')
        setLocation(data.location || '')
        setDate(formatDateToDisplay(data.date))
      }
    }

    if (maintenanceId) fetchData()
  }, [maintenanceId])

  async function handleUpdate() {
    if (!title || !km || !date) {
      Alert.alert('Preencha todos os campos obrigatórios.')
      return
    }

    const { error } = await supabase
      .from('maintenances')
      .update({
        title,
        description,
        mileage: Number(km),
        cost: Number(cost),
        location,
        date: formatDateToISO(date),
      })
      .eq('id', maintenanceId)

    if (error) {
      Alert.alert('Erro ao atualizar manutenção', error.message)
    } else {
      Alert.alert('Sucesso', 'Manutenção atualizada!')
      router.replace('/')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Manutenção</Text>

      <TextInput style={styles.input} placeholder="Título" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Descrição" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="KM" keyboardType="numeric" value={km} onChangeText={setKm} />
      <TextInput style={styles.input} placeholder="Custo" keyboardType="numeric" value={cost} onChangeText={setCost} />
      <TextInput style={styles.input} placeholder="Data (DD/MM/AAAA)" value={date} onChangeText={setDate} />
      <TextInput style={styles.input} placeholder="Local" value={location} onChangeText={setLocation} />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Atualizar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 50 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#FF7A00',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
