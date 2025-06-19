import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image, Platform } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Surface, SegmentedButtons, Switch } from 'react-native-paper';
import { router } from 'expo-router';
import { styles as themeStyles, theme } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';

export default function NewPetScreen() {
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
      
      // Criar FormData para enviar o arquivo
      const formData = new FormData();
      
      // Para web, converter base64 para blob
      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('image', blob, 'pet-photo.jpg');
      } else {
        // Para mobile, usar o URI diretamente
        formData.append('image', {
          uri: uri,
          type: 'image/jpeg',
          name: 'pet-photo.jpg',
        } as any);
      }

      const uploadResponse = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
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

  async function handleSubmit() {
    console.log('handleSubmit chamado');
    console.log('Valores dos campos:', { nome, raca, especie, idade, sexo, corPelagem, castrado });
    console.log('Usuário:', user);
    
    if (!nome || !raca || !especie || !idade || !sexo || !corPelagem) {
      console.log('Campos obrigatórios não preenchidos');
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (isNaN(Number(idade)) || Number(idade) <= 0) {
      console.log('Idade inválida:', idade);
      Alert.alert('Erro', 'Por favor, insira uma idade válida.');
      return;
    }

    if (!user) {
      console.log('Usuário não autenticado');
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    try {
      setLoading(true);
      console.log('Iniciando processo de adicionar pet...');
      console.log('User ID:', user.id);

      // Upload da imagem se foi selecionada
      let foto_url_final = null;
      if (foto) {
        try {
          console.log('Fazendo upload da foto...');
          foto_url_final = await uploadImage(foto);
          console.log('Upload da foto concluído:', foto_url_final);
        } catch (error: any) {
          console.log('Erro no upload da foto:', error);
          Alert.alert('Aviso', `Não foi possível fazer upload da foto: ${error.message}. O pet será cadastrado sem foto.`);
        }
      }

      console.log('Fazendo requisição para adicionar pet...');
      const response = await fetch('http://localhost:3000/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          nome,
          raca,
          especie,
          idade: parseInt(idade, 10),
          sexo,
          corPelagem,
          castrado,
          user_id: user.id,
          foto_url: foto_url_final,
        }),
      });

      console.log('Resposta do servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Erro do servidor:', errorData);
        throw new Error(errorData.message || 'Erro ao adicionar pet');
      }

      const result = await response.json();
      console.log('Pet adicionado com sucesso:', result);
      Alert.alert('Sucesso', 'Pet adicionado com sucesso');
      router.replace('/pets');
    } catch (error: any) {
      console.error('Erro ao adicionar pet:', error);
      Alert.alert('Erro', `Não foi possível adicionar o pet: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
            Novo Pet
          </Text>

          {/* Seção de Foto */}
          <View style={styles.fotoContainer}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.foto} />
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
              {foto ? 'Alterar Foto' : 'Adicionar Foto'}
            </Button>
            {foto && (
              <Button
                mode="text"
                onPress={() => setFoto(null)}
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
            Adicionar Pet
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