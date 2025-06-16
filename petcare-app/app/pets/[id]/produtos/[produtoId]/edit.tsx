import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Surface, SegmentedButtons } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '../../../../../lib/supabase';
import { styles as themeStyles, theme } from '../../../../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Produto } from '../../../../../types';

export default function EditProdutoScreen() {
  const { id: petId, produtoId } = useLocalSearchParams();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'alimenticio' | 'medicinal' | 'higiene' | 'alimentacao' | 'brinquedo' | 'outros' | ''>('');
  const [preco, setPreco] = useState('');
  const [dia, setDia] = useState<string>('');
  const [mes, setMes] = useState<string>('');
  const [ano, setAno] = useState<string>('');
  const [observacoes, setObservacoes] = useState('');
  const [quantidadeVezes, setQuantidadeVezes] = useState('');
  const [quandoConsumir, setQuandoConsumir] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDiaModal, setShowDiaModal] = useState(false);
  const [showMesModal, setShowMesModal] = useState(false);
  const [showAnoModal, setShowAnoModal] = useState(false);

  useEffect(() => {
    loadProduto();
  }, [produtoId]);

  const loadProduto = async () => {
    try {
      const { data, error } = await supabase
        .from('Produto')
        .select('*')
        .eq('id', produtoId)
        .single();

      if (error) throw error;
      if (data) {
        setNome(data.nome);
        setTipo(data.tipo as 'alimenticio' | 'medicinal' | 'higiene' | 'alimentacao' | 'brinquedo' | 'outros');
        setPreco(data.preco.toString());
        if (data.data_compra) {
          const [anoStr, mesStr, diaStr] = data.data_compra.split('-');
          setAno(anoStr);
          setMes(mesStr);
          setDia(diaStr);
        }
        setObservacoes(data.observacoes || '');
        setQuantidadeVezes(data.quantidade_vezes ? data.quantidade_vezes.toString() : '');
        setQuandoConsumir(data.quando_consumir || '');
      }
    } catch (error) {
      console.error('Erro ao carregar produto para edição:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do produto.');
    } finally {
      setLoading(false);
    }
  };

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
      setLoading(true);
      if (!nome || !tipo || !preco || !dia || !mes || !ano) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
        setLoading(false);
        return;
      }

      const precoNumero = parseFloat(preco.replace(',', '.'));
      if (isNaN(precoNumero)) {
        Alert.alert('Erro', 'Por favor, insira um preço válido');
        setLoading(false);
        return;
      }

      const dataCompra = formatDate();
      if (!dataCompra) {
        Alert.alert('Erro', 'Por favor, insira uma data válida');
        setLoading(false);
        return;
      }

      if (tipo === 'medicinal' && (!quantidadeVezes || !quandoConsumir)) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos para produtos medicinais');
        setLoading(false);
        return;
      }

      const updateData = {
        nome,
        tipo,
        preco: precoNumero,
        data_compra: dataCompra,
        observacoes: observacoes || null,
        ...(tipo === 'medicinal' && {
          quantidade_vezes: parseInt(quantidadeVezes, 10),
          quando_consumir: quandoConsumir,
        }),
      };

      console.log('Attempting to update product with ID:', produtoId);
      console.log('Data being sent for update:', updateData);

      const { error } = await supabase.from('Produto').update(updateData).eq('id', produtoId);

      if (error) {
        console.error('Erro ao atualizar produto (Supabase):', error);
        Alert.alert('Erro', 'Não foi possível atualizar o produto. Tente novamente. Detalhes: ' + error.message);
        setLoading(false);
        return;
      }

      Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      router.back();
    } catch (error) {
      console.error('Erro geral ao atualizar produto:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar o produto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este produto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              setLoading(true);
              const { error } = await supabase
                .from('Produto')
                .delete()
                .eq('id', produtoId);

              if (error) {
                console.error('Erro ao excluir produto:', error);
                Alert.alert('Erro', 'Não foi possível excluir o produto. Tente novamente.');
                setLoading(false);
                return;
              }

              Alert.alert('Sucesso', 'Produto excluído com sucesso!');
              router.back();
            } catch (error) {
              console.error('Erro geral ao excluir produto:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir o produto. Tente novamente.');
            } finally {
              setLoading(false);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
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
            Editar Produto
          </Text>

          <TextInput
            label="Nome do Produto"
            value={nome}
            onChangeText={setNome}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="tag" />}
          />

          <View style={styles.segmentedButtonContainer}>
            <Text style={styles.segmentedButtonLabel}>Tipo:</Text>
            <SegmentedButtons
              value={tipo}
              onValueChange={(value) => setTipo(value as 'alimenticio' | 'medicinal' | 'higiene' | 'alimentacao' | 'brinquedo' | 'outros')}
              buttons={[
                {
                  value: 'medicinal',
                  label: 'Medicinal',
                  icon: 'medical-bag',
                },
                {
                  value: 'higiene',
                  label: 'Higiene',
                  icon: 'shower',
                },
                {
                  value: 'alimentacao',
                  label: 'Alimentação',
                  icon: 'food-apple',
                },
                {
                  value: 'brinquedo',
                  label: 'Brinquedo',
                  icon: 'toy-brick',
                },
                {
                  value: 'outros',
                  label: 'Outros',
                  icon: 'dots-horizontal',
                },
              ]}
            />
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
            onChangeText={setPreco}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            left={<TextInput.Icon icon="currency-usd" />}
          />

          <View style={styles.dateInputContainer}>
            <TouchableOpacity onPress={() => setShowDiaModal(true)} style={styles.dateInputButton}>
              <TextInput
                label="Dia"
                value={dia}
                mode="outlined"
                style={styles.dateInput}
                editable={false}
                right={<TextInput.Icon icon="calendar" onPress={() => setShowDiaModal(true)} />}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowMesModal(true)} style={styles.dateInputButton}>
              <TextInput
                label="Mês"
                value={meses.find(m => m.value === mes)?.label || ''}
                mode="outlined"
                style={styles.dateInput}
                editable={false}
                right={<TextInput.Icon icon="calendar" onPress={() => setShowMesModal(true)} />}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAnoModal(true)} style={styles.dateInputButton}>
              <TextInput
                label="Ano"
                value={ano}
                mode="outlined"
                style={styles.dateInput}
                editable={false}
                right={<TextInput.Icon icon="calendar" onPress={() => setShowAnoModal(true)} />}
              />
            </TouchableOpacity>
          </View>

          <TextInput
            label="Observações (opcional)"
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
          >
            Salvar Alterações
          </Button>

          <Button
            mode="outlined"
            onPress={handleDelete}
            textColor={theme.colors.error}
            style={styles.deleteButton}
          >
            Excluir Produto
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.cancelButton}
          >
            Cancelar
          </Button>
        </Surface>
      </ScrollView>

      {renderDatePickerModal(
        showDiaModal,
        () => setShowDiaModal(false),
        getDiasNoMes(mes, ano),
        setDia,
        'Selecionar Dia'
      )}
      {renderDatePickerModal(
        showMesModal,
        () => setShowMesModal(false),
        meses,
        setMes,
        'Selecionar Mês'
      )}
      {renderDatePickerModal(
        showAnoModal,
        () => setShowAnoModal(false),
        getAnos(),
        setAno,
        'Selecionar Ano'
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    backgroundColor: theme.colors.surface,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
    backgroundColor: theme.colors.surface,
  },
  segmentedButtonContainer: {
    marginBottom: 15,
  },
  segmentedButtonLabel: {
    fontSize: 16,
    color: theme.colors.onSurface,
    marginBottom: 10,
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateInputButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateInput: {
    backgroundColor: theme.colors.surface,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderColor: theme.colors.error,
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderColor: theme.colors.primary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: theme.colors.primary,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
  },
  modalItemText: {
    fontSize: 18,
    color: theme.colors.onSurface,
  },
  modalButton: {
    marginTop: 20,
  },
});
