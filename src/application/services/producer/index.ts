import { Farm, Producer } from '@entities';
import { DocumentType } from '@enums';
import { useFarmStore, useProducerStore } from '@storage';
import { formatDocument, validateDocument } from '@validations';

export class ProducerService {
  // ============= CRUD OPERATIONS =============

  static async createProducer(
    data: Omit<Producer, 'id' | 'createdAt' | 'updatedAt' | 'farmsIds'>,
  ): Promise<Producer | null> {
    try {
      // Validação de documento
      if (!this.validateProducerDocument(data.document, data.documentType)) {
        throw new Error('Documento inválido');
      }

      // Verificar se já existe
      if (this.checkDocumentExists(data.document)) {
        throw new Error('Já existe um produtor com este documento');
      }

      // Criar produtor
      const producerData = {
        ...data,
        document: data.document.replace(/\D/g, ''), // Limpar formatação
        farmsIds: [], // Inicializa sem fazendas
      };

      useProducerStore.getState().addProducer(producerData);

      // Buscar o produtor criado
      const producers = useProducerStore.getState().producers;
      return producers[producers.length - 1];
    } catch (error) {
      useProducerStore
        .getState()
        .setError(error instanceof Error ? error.message : 'Erro ao criar produtor');
      return null;
    }
  }

  static async updateProducer(id: string, updates: Partial<Producer>): Promise<boolean> {
    try {
      const producer = useProducerStore.getState().getProducerById(id);
      if (!producer) {
        throw new Error('Produtor não encontrado');
      }

      // Se alterando documento, validar
      if (updates.document && updates.documentType) {
        if (!this.validateProducerDocument(updates.document, updates.documentType)) {
          throw new Error('Documento inválido');
        }

        // Verificar se não existe outro com mesmo documento
        if (this.checkDocumentExists(updates.document, id)) {
          throw new Error('Já existe outro produtor com este documento');
        }

        updates.document = updates.document.replace(/\D/g, '');
      }

      useProducerStore.getState().updateProducer(id, updates);
      return true;
    } catch (error) {
      useProducerStore
        .getState()
        .setError(error instanceof Error ? error.message : 'Erro ao atualizar produtor');
      return false;
    }
  }

  static async deleteProducer(id: string): Promise<boolean> {
    try {
      const producer = useProducerStore.getState().getProducerById(id);
      if (!producer) {
        throw new Error('Produtor não encontrado');
      }

      // Verificar se tem fazendas associadas
      const farms = useFarmStore.getState().getFarmsByProducer(id);
      if (farms.length > 0) {
        throw new Error('Não é possível excluir produtor com fazendas associadas');
      }

      useProducerStore.getState().deleteProducer(id);
      return true;
    } catch (error) {
      useProducerStore
        .getState()
        .setError(error instanceof Error ? error.message : 'Erro ao excluir produtor');
      return false;
    }
  }

  // ============= VALIDAÇÕES =============

  static validateProducerDocument(document: string, type: DocumentType): boolean {
    return validateDocument(document, type);
  }

  static checkDocumentExists(document: string, excludeId?: string): boolean {
    const cleanDocument = document.replace(/\D/g, '');
    const producers = useProducerStore.getState().producers;

    return producers.some(
      (producer) =>
        producer.active && producer.document === cleanDocument && producer.id !== excludeId,
    );
  }

  // ============= BUSINESS LOGIC =============

  static getProducerWithFarms(id: string): (Producer & { farms: Farm[] }) | null {
    const producer = useProducerStore.getState().getProducerById(id);
    if (!producer) return null;

    const farms = useFarmStore.getState().getFarmsByProducer(id);
    return { ...producer, farms };
  }

  static getProducerSummary(id: string) {
    const producer = useProducerStore.getState().getProducerById(id);
    if (!producer) return null;

    const farms = useFarmStore.getState().getFarmsByProducer(id);
    const totalArea = farms.reduce((sum, farm) => sum + farm.totalArea, 0);
    const totalFarms = farms.length;

    return {
      ...producer,
      formattedDocument: formatDocument(producer.document, producer.documentType),
      totalFarms,
      totalArea,
      farms,
    };
  }

  static searchProducers(
    term: string,
    filters?: {
      documentType?: DocumentType;
      state?: string;
    },
  ) {
    let results = useProducerStore.getState().searchProducers(term);

    // Aplicar filtros
    if (filters?.documentType) {
      results = results.filter((p) => p.documentType === filters.documentType);
    }

    if (filters?.state) {
      const farms = useFarmStore.getState().farms;
      const producerIdsInState = farms
        .filter((f) => f.state === filters.state)
        .map((f) => f.producerId);

      results = results.filter((p) => producerIdsInState.includes(p.id));
    }

    return results.map((producer) => ({
      ...producer,
      formattedDocument: formatDocument(producer.document, producer.documentType),
    }));
  }

  // ============= STATISTICS =============

  static getProducerStats() {
    return useProducerStore.getState().getProducerStats();
  }

  static getProducersByRegion() {
    const farms = useFarmStore.getState().getActiveFarms();
    const producers = useProducerStore.getState().getActiveProducers();

    const regionStats: { [state: string]: number } = {};

    farms.forEach((farm) => {
      const producer = producers.find((p) => p.id === farm.producerId);
      if (producer) {
        regionStats[farm.state] = (regionStats[farm.state] || 0) + 1;
      }
    });

    return regionStats;
  }

  // ============= UTILITIES =============

  static getAllProducers() {
    return useProducerStore.getState().getActiveProducers();
  }

  static getProducerById(id: string) {
    return useProducerStore.getState().getProducerById(id);
  }

  static refreshProducers() {
    // Força refresh dos dados
    const producers = useProducerStore.getState().getActiveProducers();
    return producers;
  }
}
