import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image, Platform } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Surface, SegmentedButtons, Switch } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { styles as themeStyles, theme } from '../../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from '../../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditPetScreen() {
  const { id } = useLocalSearchParams();
  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [especie, setEspecie] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState('');
  const [corPelagem, setCorPelagem] = useState('');
  const [castrado, setCastrado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);
  const [foto_url, setFotoUrl] = useState<string | null>(null);
  const { user } = useAuth();

  // Função para validar se o texto contém apenas números
  const handleIdadeChange = (text: string) => {
    // Remove todos os caracteres que não são números
    const numericValue = text.replace(/[^0-9]/g, '');
    setIdade(numericValue);
  };

  // Função para selecionar imagem
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Erro', 'Precisamos de permissão para acessar suas fotos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  // Função para fazer upload da imagem
  const uploadImage = async (uri: string): Promise<string> => {
    try {
      console.log('Iniciando upload da imagem...');
      const formData = new FormData();
      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('image', blob, 'pet-photo.jpg');
      } else {
        formData.append('image', {
          uri: uri,
          type: 'image/jpeg',
          name: 'pet-photo.jpg',
        } as any);
      }
      const token = await AsyncStorage.getItem('access_token');
      const uploadResponse = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Erro no upload da imagem');
      }
      const uploadResult = await uploadResponse.json();
      console.log('Upload concluído:', uploadResult);
      return uploadResult.url;
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (id) {
      loadPet();
    }
  }, [id]);

  async function loadPet() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/pets/${id}`);
      if (!response.ok) throw new Error('Erro ao carregar pet');
      const pet = await response.json();

      setNome(pet.nome || '');
      setRaca(pet.raca || '');
      setEspecie(pet.especie || '');
      setIdade(pet.idade?.toString() || '');
      setSexo(pet.sexo || '');
      setCorPelagem(pet.corPelagem || '');
      setCastrado(pet.castrado || false);
      setFotoUrl(pet.foto_url || null);
    } catch (error) {
      console.error('Erro ao carregar pet:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do pet');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!nome || !raca || !especie || !idade || !sexo || !corPelagem) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (isNaN(Number(idade)) || Number(idade) <= 0) {
      Alert.alert('Erro', 'Por favor, insira uma idade válida.');
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    try {
      setLoading(true);

      // Upload da nova imagem se foi selecionada
      let foto_url_final = foto_url; // Manter a foto existente por padrão
      if (foto && foto !== foto_url) {
        try {
          console.log('Fazendo upload da nova foto...');
          foto_url_final = await uploadImage(foto);
          console.log('Upload da nova foto concluído:', foto_url_final);
        } catch (error: any) {
          console.log('Erro no upload da nova foto:', error);
          Alert.alert('Aviso', `Não foi possível fazer upload da nova foto: ${error.message}. O pet será salvo com a foto anterior.`);
          foto_url_final = foto_url; // Manter a foto anterior
        }
      }

      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/pets/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome,
          raca,
          especie,
          idade: parseInt(idade, 10),
          sexo,
          corPelagem,
          castrado,
          foto_url: foto_url_final,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar pet');
      }

      Alert.alert('Sucesso', 'Pet atualizado com sucesso');
      router.replace(`/pets/${id}`);
    } catch (error: any) {
      console.error('Erro ao atualizar pet:', error);
      Alert.alert('Erro', `Não foi possível atualizar o pet: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
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

          {/* Seção de Foto */}
          <View style={styles.fotoContainer}>
            {(foto || foto_url) ? (
              <Image source={{ uri: foto || foto_url || '' }} style={styles.foto} />
            ) : (
              <View style={styles.fotoPlaceholder}>
                <Text style={styles.fotoPlaceholderText}>Sem foto</Text>
              </View>
            )}
            <Button
              mode="outlined"
              onPress={pickImage}
              style={styles.fotoButton}
              icon="camera"
            >
              {(foto || foto_url) ? 'Alterar Foto' : 'Adicionar Foto'}
            </Button>
            {(foto || foto_url) && (
              <Button
                mode="text"
                onPress={() => {
                  setFoto(null);
                  setFotoUrl(null);
                }}
                style={styles.removeFotoButton}
                textColor={theme.colors.error}
                icon="trash-can-outline"
              >
                Remover Foto
              </Button>
            )}
          </View>

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
            onChangeText={handleIdadeChange}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
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
            Salvar Alterações
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
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '100%',
    maxWidth: 600,
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
  },
  fotoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  foto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 8,
  },
  fotoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  fotoPlaceholderText: {
    color: theme.colors.onSurfaceVariant,
  },
  fotoButton: {
    marginTop: 8,
  },
  removeFotoButton: {
    marginTop: 4,
  },
}); 