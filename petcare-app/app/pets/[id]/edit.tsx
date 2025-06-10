import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Surface, SegmentedButtons, Switch } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { styles as themeStyles, theme } from '../../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Pet } from '../../../types';

export default function EditPetScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [especie, setEspecie] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState('');
  const [corPelagem, setCorPelagem] = useState('');
  const [castrado, setCastrado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPet();
    }
  }, [id]);

  const loadPet = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Pet')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setPet(data);
      setNome(data.nome);
      setRaca(data.raca);
      setEspecie(data.especie);
      setIdade(data.idade.toString());
      setSexo(data.sexo);
      setCorPelagem(data.corPelagem);
      setCastrado(data.castrado);

    } catch (error: any) {
      console.error('Erro ao carregar pet para edição:', error);
      Alert.alert('Erro', `Não foi possível carregar o pet: ${error.message}`);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  async function handleSubmit() {
    if (!nome || !raca || !especie || !idade || !sexo || !corPelagem) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (isNaN(Number(idade))) {
      Alert.alert('Erro', 'Por favor, insira uma idade válida.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('Pet').update({
        nome,
        raca,
        especie,
        idade: parseInt(idade, 10),
        sexo,
        corPelagem,
        castrado,
      }).eq('id', id);

      if (error) throw error;
      Alert.alert('Sucesso', 'Pet atualizado com sucesso');
      router.replace(`/pets/${id}`); // Voltar para a tela de detalhes
    } catch (error: any) {
      console.error('Erro ao atualizar pet:', error);
      Alert.alert('Erro', `Não foi possível atualizar o pet: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text>Pet não encontrado para edição.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f6f6f6', '#ffffff']}
        style={styles.background}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={[styles.card, themeStyles.shadow]} elevation={2}>
          <Text variant="headlineMedium" style={styles.title}>
            Editar Pet
          </Text>

          <TextInput
            label="Nome do Pet"
            value={nome}
            onChangeText={setNome}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="paw" />}
          />

          <TextInput
            label="Espécie (Cachorro, Gato, etc.)"
            value={especie}
            onChangeText={setEspecie}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="cat" />}
          />

          <TextInput
            label="Raça"
            value={raca}
            onChangeText={setRaca}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="dog" />}
          />

          <TextInput
            label="Idade"
            value={idade}
            onChangeText={setIdade}
            mode="outlined"
            style={styles.input}
            keyboardType="number-pad"
            left={<TextInput.Icon icon="numeric" />}
          />

          <View style={styles.segmentedButtonContainer}>
            <Text style={styles.segmentedButtonLabel}>Sexo:</Text>
            <SegmentedButtons
              value={sexo}
              onValueChange={setSexo}
              buttons={[
                {
                  value: 'Macho',
                  label: 'Macho',
                  icon: 'gender-male',
                },
                {
                  value: 'Fêmea',
                  label: 'Fêmea',
                  icon: 'gender-female',
                },
              ]}
            />
          </View>

          <TextInput
            label="Cor/Pelagem"
            value={corPelagem}
            onChangeText={setCorPelagem}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="palette" />}
          />

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Castrado(a):</Text>
            <Switch
                value={castrado}
                onValueChange={setCastrado}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
            icon="check"
          >
            Atualizar Pet
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.button}
            icon="arrow-left"
          >
            Voltar
          </Button>
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  title: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  segmentedButtonContainer: {
    marginBottom: 16,
  },
  segmentedButtonLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
    marginLeft: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
   switchLabel: {
    fontSize: 16,
    color: theme.colors.onSurface,
   }
}); 