import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'expo-router'



function formatDateToISO(input: string): string {
  const [day, month, year] = input.split('/')
  return `${year}-${month}-${day}`
}

export default function CreateMaintenance() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [km, setKm] = useState('')
  const [cost, setCost] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')

  async function handleSubmit() {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id

    if (!userId) {
      Alert.alert('Erro', 'Usuário não autenticado.')
      return
    }

    if (!title || !km || !date) {
      Alert.alert('Preencha todos os campos obrigatórios.')
      return
    }

    const { error } = await supabase.from('maintenances').insert({
      user_id: userId,
      vehicle_id: null,
      title,
      description,
      mileage: Number(km),
      cost: Number(cost),
      location,
      date: formatDateToISO(date),
    })

    if (error) {
      Alert.alert('Erro ao salvar manutenção', error.message)
    } else {
      Alert.alert('Sucesso', 'Manutenção cadastrada com sucesso!')
      router.replace('/') 
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Manutenção</Text>

      <TextInput style={styles.input} placeholder="Título" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Descrição" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="KM" keyboardType="numeric" value={km} onChangeText={setKm} />
      <TextInput style={styles.input} placeholder="Custo" keyboardType="numeric" value={cost} onChangeText={setCost} />
      <TextInput style={styles.input} placeholder="Data (DD/MM/AAAA)" value={date} onChangeText={setDate} />
      <TextInput style={styles.input} placeholder="Local" value={location} onChangeText={setLocation} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar</Text>
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
