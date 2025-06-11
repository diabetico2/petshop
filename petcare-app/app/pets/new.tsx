import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image, Platform } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Surface, SegmentedButtons, Switch } from 'react-native-paper';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { styles as themeStyles, theme } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

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

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Erro', 'Precisamos de permissão para acessar suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  }

  const uploadImage = async (uri: string, userId: string) => {
    try {
      let dataToUpload: Blob | Uint8Array;
      let mimeType: string;
      let fileExtension: string | undefined;

      if (Platform.OS === 'web') {
        const matches = uri.match(/^data:(.*?);base64,(.*)$/);
        if (!matches || matches.length < 3) {
          throw new Error('URI de imagem inválida ou formato inesperado.');
        }
        mimeType = matches[1].toLowerCase();
        const base64Data = matches[2];

        const decodedBytes = decodeBase64(base64Data);
        dataToUpload = decodedBytes;
        fileExtension = mimeType.split('/').pop();
      } else {
        // Determine mimeType based on uri extension
        fileExtension = uri.split('.').pop()?.toLowerCase();
        mimeType = 'application/octet-stream'; // Default
        if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
          mimeType = 'image/jpeg';
        } else if (fileExtension === 'png') {
          mimeType = 'image/png';
        } else if (fileExtension === 'gif') {
          mimeType = 'image/gif';
        }

        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        const decodedBytes = decodeBase64(base64);
        dataToUpload = new Blob([decodedBytes], { type: mimeType });
      }
      
      console.log('URI da imagem:', uri);
      console.log('Tipo MIME do Blob (inferido): ', mimeType);
      console.log('Tamanho do dado para upload (bytes):', dataToUpload instanceof Blob ? dataToUpload.size : dataToUpload.byteLength);

      // Validar o tipo MIME da imagem
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(mimeType)) {
        throw new Error('Formato de imagem não suportado. Use JPG, PNG ou GIF.');
      }

      if (!fileExtension) {
        throw new Error('Não foi possível determinar a extensão do arquivo.');
      }

      const filename = `pet-${Date.now()}.${fileExtension}`;
      const filePath = `${userId}/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from('pets')
        .upload(filePath, dataToUpload, {
          contentType: mimeType
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('pets')
        .getPublicUrl(filePath);
      
      console.log('URL Pública da Imagem no Supabase:', publicUrl);

      return publicUrl;
    } catch (error: any) {
      console.error('Erro detalhado ao fazer upload da imagem:', error);
      throw error;
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

    let foto_url: string | null = null;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('Erro: Usuário não autenticado no handleSubmit.');
        throw new Error('Usuário não autenticado');
      }
      console.log('User ID para upload:', user.id);
      console.log('Valor atual do estado foto (antes do upload): ', foto);

      if (foto) {
        try {
          foto_url = await uploadImage(foto, user.id);
          setFoto(foto_url);
        } catch (error: any) {
          Alert.alert('Aviso', `Não foi possível fazer upload da foto: ${error.message}. O pet será cadastrado sem foto.`);
        }
      }

      const { error } = await supabase.from('Pet').insert({
        nome,
        raca,
        especie,
        idade: parseInt(idade, 10),
        sexo,
        corPelagem,
        castrado,
        user_id: user.id,
        foto_url,
      });

      if (error) throw error;
      Alert.alert('Sucesso', 'Pet adicionado com sucesso');
      router.replace('/pets');
    } catch (error: any) {
      console.error('Erro ao adicionar pet:', error);
      if (!foto_url && foto) {
        console.error('Foto não foi carregada e foto_url é null, mas a foto estava presente no estado.');
      }
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
});

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
} 