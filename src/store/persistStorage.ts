import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import type { WebStorage } from 'redux-persist/lib/types';

function createNoopStorage(): WebStorage {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
}

const persistStorage: WebStorage =
  typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

export default persistStorage;
