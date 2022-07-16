export interface IndexedDBColumn {
  name: string;
  keyPath: string;
  options?: IDBIndexParameters;
}

export interface IndexedDBStore {
  name: string;
  id: IDBObjectStoreParameters;
  indices: IndexedDBColumn[];
}

export interface IndexedDBConfig {
  databaseName: string;
  version: number;
  stores: IndexedDBStore[];
}

export interface TransactionOptions {
  storeName: string;
  dbMode: IDBTransactionMode;
  error: (e: Event) => any;
  complete: (e: Event) => any;
  abort?: any;
}

function validateStore(db: IDBDatabase, storeName: string) {
  return db.objectStoreNames.contains(storeName);
}

export function validateBeforeTransaction(
  db,
  storeName: string,
  reject: Function
) {
  if (!db) {
    reject("Queried before opening connection");
  }
  if (!validateStore(db, storeName)) {
    reject(`Store ${storeName} not found`);
  }
}

export function createTransaction(
  db: IDBDatabase,
  dbMode: IDBTransactionMode,
  currentStore: string,
  resolve,
  reject?,
  abort?
): IDBTransaction {
  let tx: IDBTransaction = db.transaction(currentStore, dbMode);
  tx.onerror = reject;
  tx.oncomplete = resolve;
  tx.onabort = abort;
  return tx;
}

/**
 * Create or Get Connection to IndexedDB from config, and store the config to localStorage as reference
 */
export async function getConnection(
  config?: IndexedDBConfig
): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const idbInstance = typeof window !== "undefined" ? window.indexedDB : null;
    if (idbInstance) {
      const clientKeyStore = "client_db_config";

      if (config) {
        window.localStorage.setItem(clientKeyStore, JSON.stringify(config));
      }

      const dbConfig: IndexedDBConfig =
        JSON.parse(window.localStorage.getItem(clientKeyStore) as string) ||
        config;

      const request: IDBOpenDBRequest = idbInstance.open(
        dbConfig.databaseName,
        dbConfig.version
      );

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (e: any) => {
        reject(e.target.error.name);
      };

      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        dbConfig.stores.forEach((s) => {
          if (!db.objectStoreNames.contains(s.name)) {
            const store = db.createObjectStore(s.name, s.id);
            s.indices.forEach((c) => {
              store.createIndex(c.name, c.keyPath, c.options);
            });
          }
        });
        db.close();
        reject(undefined);
      };
    } else {
      reject("Failed to connect");
    }
  });
}

/**
 * Async IndexedDB API wrapper
 */
export function getActions<T>(currentStore, config?) {
  return {
    getByID(id: string | number) {
      return new Promise<T>((resolve, reject) => {
        getConnection(config)
          .then((db) => {
            validateBeforeTransaction(db, currentStore, reject);
            let tx = createTransaction(
              db,
              "readonly",
              currentStore,
              resolve,
              reject
            );
            let objectStore = tx.objectStore(currentStore);
            let request = objectStore.get(id);
            request.onsuccess = (e: any) => {
              resolve(e.target.result as T);
            };
          })
          .catch(reject);
      });
    },
    getOneByIndex(keyPath: string, value: string | number) {
      return new Promise<T | undefined>((resolve, reject) => {
        getConnection(config)
          .then((db) => {
            validateBeforeTransaction(db, currentStore, reject);
            let tx = createTransaction(
              db,
              "readonly",
              currentStore,
              resolve,
              reject
            );
            let objectStore = tx.objectStore(currentStore);
            let index = objectStore.index(keyPath);
            let request = index.get(value);
            request.onsuccess = (e: any) => {
              resolve(e.target.result);
            };
          })
          .catch(reject);
      });
    },
    getManyByIndex(keyPath: string, value: string | number) {
      return new Promise<T[]>((resolve, reject) => {
        getConnection(config)
          .then((db) => {
            validateBeforeTransaction(db, currentStore, reject);
            let tx = createTransaction(
              db,
              "readonly",
              currentStore,
              resolve,
              reject
            );
            let objectStore = tx.objectStore(currentStore);
            let index = objectStore.index(keyPath);
            let request = index.getAll(value);
            request.onsuccess = (e: any) => {
              resolve(e.target.result);
            };
          })
          .catch(reject);
      });
    },
    getAll() {
      return new Promise<T[]>((resolve, reject) => {
        getConnection(config)
          .then((db) => {
            validateBeforeTransaction(db, currentStore, reject);
            let tx = createTransaction(
              db,
              "readonly",
              currentStore,
              resolve,
              reject
            );
            let objectStore = tx.objectStore(currentStore);
            let request = objectStore.getAll();
            request.onsuccess = (e: any) => {
              resolve(e.target.result as T[]);
            };
          })
          .catch(reject);
      });
    },

    add(value: T, key?: any) {
      return new Promise<number>((resolve, reject) => {
        getConnection(config)
          .then((db) => {
            validateBeforeTransaction(db, currentStore, reject);
            let tx = createTransaction(
              db,
              "readwrite",
              currentStore,
              resolve,
              reject
            );
            let objectStore = tx.objectStore(currentStore);
            let request = objectStore.add(value, key);
            request.onsuccess = (e: any) => {
              (tx as any)?.commit?.();
              resolve(e.target.result);
            };
          })
          .catch(reject);
      });
    },
    update(value: T, key?: any) {
      return new Promise<any>((resolve, reject) => {
        getConnection(config)
          .then((db) => {
            validateBeforeTransaction(db, currentStore, reject);
            let tx = createTransaction(
              db,
              "readwrite",
              currentStore,
              resolve,
              reject
            );
            let objectStore = tx.objectStore(currentStore);
            let request = objectStore.put(value, key);
            request.onsuccess = (e: any) => {
              (tx as any)?.commit?.();
              resolve(e.target.result);
            };
          })
          .catch(reject);
      });
    },

    deleteByID(id: any) {
      return new Promise<any>((resolve, reject) => {
        getConnection(config)
          .then((db) => {
            validateBeforeTransaction(db, currentStore, reject);
            let tx = createTransaction(
              db,
              "readwrite",
              currentStore,
              resolve,
              reject
            );
            let objectStore = tx.objectStore(currentStore);
            let request = objectStore.delete(id);
            request.onsuccess = (e: any) => {
              (tx as any)?.commit?.();
              resolve(e);
            };
          })
          .catch(reject);
      });
    },
    deleteAll() {
      return new Promise<any>((resolve, reject) => {
        getConnection(config)
          .then((db) => {
            validateBeforeTransaction(db, currentStore, reject);
            let tx = createTransaction(
              db,
              "readwrite",
              currentStore,
              resolve,
              reject
            );
            let objectStore = tx.objectStore(currentStore);
            objectStore.clear();
            tx.oncomplete = (e: any) => {
              (tx as any)?.commit?.();
              resolve(e);
            };
          })
          .catch(reject);
      });
    },

    openCursor(cursorCallback, keyRange?: IDBKeyRange) {
      return new Promise<IDBCursorWithValue | void>((resolve, reject) => {
        getConnection(config)
          .then((db) => {
            validateBeforeTransaction(db, currentStore, reject);
            let tx = createTransaction(
              db,
              "readonly",
              currentStore,
              resolve,
              reject
            );
            let objectStore = tx.objectStore(currentStore);
            let request = objectStore.openCursor(keyRange);
            request.onsuccess = (e) => {
              cursorCallback(e);
              resolve();
            };
          })
          .catch(reject);
      });
    },
  };
}
