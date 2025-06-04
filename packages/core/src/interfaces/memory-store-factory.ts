import { IMemoryStore } from '@garden-calm/types';

/**
 * Фабрика для создания экземпляра хранилища памяти
 * Используется для создания дефолтного хранилища без прямой зависимости от конкретной реализации
 */
export interface MemoryStoreFactory {
  createMemoryStore(): IMemoryStore;
}
