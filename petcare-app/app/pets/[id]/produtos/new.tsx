import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Surface, SegmentedButtons } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { api } from '../../../../lib/api';
import { styles as themeStyles, theme } from '../../../../theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function NewProdutoScreen() {
  const { id: petId } = useLocalSearchParams();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'alimenticio' | 'medicinal' | 'higiene' | 'alimentacao' | 'brinquedo' | 'outros' | ''>('');
  const [preco, setPreco] = useState('');
  const [dia, setDia] = useState<string>('');
  const [mes, setMes] = useState<string>('');
  const [ano, setAno] = useState<string>('');
  const [observacoes, setObservacoes] = useState('');
  const [quantidadeVezes, setQuantidadeVezes] = useState('');
  const [quandoConsumir, setQuandoConsumir] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDiaModal, setShowDiaModal] = useState(false);
  const [showMesModal, setShowMesModal] = useState(false);
  const [showAnoModal, setShowAnoModal] = useState(false);
  const [showTipoModal, setShowTipoModal] = useState(false);

  const meses = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  const getDiasNoMes = (mes: string, ano: string) => {
    const diasNoMes = new Date(parseInt(ano), parseInt(mes), 0).getDate();
    return Array.from({ length: diasNoMes }, (_, i) => ({
      value: String(i + 1).padStart(2, '0'),
      label: String(i + 1),
    }));
  };

  const getAnos = () => {
    const anoAtual = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => ({
      value: String(anoAtual - i),
      label: String(anoAtual - i),
    }));
  };

  const formatDate = () => {
    if (!dia || !mes || !ano) return null;
    const diaStr = dia.toString().padStart(2, '0');
    const mesStr = mes.toString().padStart(2, '0');
    return `${ano}-${mesStr}-${diaStr}`;
  };

  const renderDatePickerModal = (
    visible: boolean,
    onDismiss: () => void,
    data: { value: string; label: string }[],
    onSelect: (value: string) => void,
    title: string
  ) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onDismiss={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <Surface style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  onSelect(item.value);
                  onDismiss();
                }}
              >
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={styles.modalButton}
          >
            Cancelar
          </Button>
        </Surface>
      </View>
    </Modal>
  );

  const handleSubmit = async () => {
    try {
      if (!nome || !tipo || !preco || !dia || !mes || !ano) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
        return;
      }

      const precoNumero = parseFloat(preco.replace(',', '.'));
      if (isNaN(precoNumero)) {
        Alert.alert('Erro', 'Por favor, insira um preço válido');
        return;
      }

      const dataCompra = formatDate();
      const dataCompraISO = dataCompra ? new Date(dataCompra).toISOString() : null;
      if (!dataCompraISO) {
        Alert.alert('Erro', 'Por favor, insira uma data válida');
        return;
      }

      if (tipo === 'medicinal' && (!quantidadeVezes || !quandoConsumir)) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos para produtos medicinais');
        return;
      }

      const newProduct: any = {
        nome,
        tipo,
        preco: precoNumero,
        data_compra: dataCompraISO,
        petId: String(petId),
      };
      if (observacoes) newProduct.observacoes = observacoes;
      if (tipo === 'medicinal') {
        if (quantidadeVezes) newProduct.quantidade_vezes = parseInt(quantidadeVezes, 10);
        if (quandoConsumir) newProduct.quando_consumir = quandoConsumir;
      }

      await api.createProduct(newProduct);
      Alert.alert('Sucesso', 'Produto adicionado com sucesso!');
      router.replace(`/pets/${petId}`);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar o produto. Tente novamente.');
    }
  };

  const tipos = [
    { value: 'medicinal', label: 'Medicinal' },
    { value: 'higiene', label: 'Higiene' },
    { value: 'alimentacao', label: 'Alimentação' },
    { value: 'brinquedo', label: 'Brinquedo' },
    { value: 'alimenticio', label: 'Alimentício' },
    { value: 'outros', label: 'Outros' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f6f6f6', '#ffffff']}
        style={styles.background}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={[styles.card, themeStyles.shadow]} elevation={2}>
          <Text variant="headlineMedium" style={styles.title}>
            Novo Produto
          </Text>

          <TextInput
            label="Nome do Produto"
            value={nome}
            onChangeText={setNome}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="tag" />}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.segmentedButtonLabel}>Tipo:</Text>
            <Button
              mode="outlined"
              onPress={() => setShowTipoModal(true)}
              style={styles.input}
              icon="chevron-down"
            >
              {tipo ? tipos.find(t => t.value === tipo)?.label : 'Selecione o tipo'}
            </Button>
          </View>

          {tipo === 'medicinal' && (
            <>
              <TextInput
                label="Quantidade de Vezes (por dia/semana)"
                value={quantidadeVezes}
                onChangeText={setQuantidadeVezes}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                left={<TextInput.Icon icon="numeric" />}
              />
              <TextInput
                label="Quando Consumir (Ex: Manhã, Noite, Após refeição)"
                value={quandoConsumir}
                onChangeText={setQuandoConsumir}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="clock-outline" />}
              />
            </>
          )}

          <TextInput
            label="Preço"
            value={preco}
            onChangeText={(text) => {
              // Remove any non-numeric characters except comma and dot
              const cleaned = text.replace(/[^0-9,.]/g, '');
              // Ensure only one decimal separator
              const parts = cleaned.split(/[,.]/);
              if (parts.length > 2) {
                setPreco(parts[0] + ',' + parts.slice(1).join(''));
              } else {
                setPreco(cleaned);
              }
            }}
            mode="outlined"
            style={styles.input}
            keyboardType="decimal-pad"
            left={<TextInput.Icon icon="currency-brl" />}
          />

          <Text style={styles.dateLabel}>Data da Compra:</Text>
          <View style={styles.dateContainer}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>Dia</Text>
              <Button
                mode="outlined"
                onPress={() => setShowDiaModal(true)}
                style={styles.dateButton}
              >
                {dia || 'DD'}
              </Button>
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>Mês</Text>
              <Button
                mode="outlined"
                onPress={() => setShowMesModal(true)}
                style={styles.dateButton}
              >
                {meses.find(m => m.value === mes)?.label || 'MM'}
              </Button>
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>Ano</Text>
              <Button
                mode="outlined"
                onPress={() => setShowAnoModal(true)}
                style={styles.dateButton}
              >
                {ano || 'AAAA'}
              </Button>
            </View>
          </View>

          {renderDatePickerModal(
            showDiaModal,
            () => setShowDiaModal(false),
            getDiasNoMes(mes || '01', ano || new Date().getFullYear().toString()),
            setDia,
            'Selecione o Dia'
          )}

          {renderDatePickerModal(
            showMesModal,
            () => setShowMesModal(false),
            meses,
            setMes,
            'Selecione o Mês'
          )}

          {renderDatePickerModal(
            showAnoModal,
            () => setShowAnoModal(false),
            getAnos(),
            setAno,
            'Selecione o Ano'
          )}

          {renderDatePickerModal(
            showTipoModal,
            () => setShowTipoModal(false),
            tipos,
            (value) => setTipo(value as any),
            'Selecione o tipo do produto'
          )}

          <TextInput
            label="Observações (Opcional)"
            value={observacoes}
            onChangeText={setObservacoes}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={4}
            left={<TextInput.Icon icon="note-text-outline" />}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
            icon="check"
          >
            Adicionar Produto
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
  inputContainer: {
    marginBottom: 16,
  },
  segmentedButtonLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
    marginLeft: 12,
  },
  dateLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
    marginLeft: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateInputLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
    marginLeft: 4,
  },
  dateButton: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
  },
  modalButton: {
    marginTop: 16,
  },
}); 