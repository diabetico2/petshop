import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image, Platform } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Surface, SegmentedButtons, Switch } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { styles as themeStyles, theme } from '../../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Pet } from '../../../types';

export default function EditPetScreen() {
  const { id } = useLocalSearchParams();
  const [pet, setPet] = useState<Pet | null>(null);
  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [especie, setEspecie] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState('');
  const [corPelagem, setCorPelagem] = useState('');
  const [castrado, setCastrado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [foto, setFoto] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPet();
    }
  }, [id]);

  async function loadPet() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Pet')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setPet(data);
        setNome(data.nome);
        setRaca(data.raca);
        setEspecie(data.especie);
        setIdade(String(data.idade));
        setSexo(data.sexo);
        setCorPelagem(data.corPelagem);
        setCastrado(data.castrado);
        setFoto(data.foto_url); // Carrega a foto existente
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados do pet:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do pet.');
      router.back();
    } finally {
      setLoading(false);
    }
  }

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
        fileExtension = uri.split('.').pop()?.toLowerCase();
        mimeType = 'application/octet-stream'; 
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

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('Erro: Usuário não autenticado no handleSubmit.');
        throw new Error('Usuário não autenticado');
      }

      let foto_url = pet?.foto_url || null; // Manter a foto_url existente por padrão
      if (foto && foto !== pet?.foto_url) { // Se uma nova foto foi selecionada ou a foto existente foi alterada
        try {
          foto_url = await uploadImage(foto, user.id);
        } catch (error: any) {
          Alert.alert('Aviso', `Não foi possível fazer upload da nova foto: ${error.message}. O pet será salvo com a foto anterior ou sem foto.`);
          foto_url = pet?.foto_url || null; // Reverter para a foto anterior ou null em caso de falha
        }
      } else if (!foto) { // Se a foto foi removida
        foto_url = null;
      }

      const { error } = await supabase.from('Pet')
        .update({
          nome,
          raca,
          especie,
          idade: parseInt(idade, 10),
          sexo,
          corPelagem,
          castrado,
          foto_url, // Atualizar a foto_url no banco de dados
        })
        .eq('id', id);

      if (error) throw error;
      Alert.alert('Sucesso', 'Pet atualizado com sucesso');
      router.replace(`/pets/${id}`); // Volta para a tela de detalhes do pet
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
        <ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
        <Text>Carregando...</Text>
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

          <View style={styles.fotoContainer}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.foto} resizeMode="cover" />
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
                    style={{ marginTop: 8 }}
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
    justifyContent: 'center',
    alignItems: 'center',
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
});

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
} 