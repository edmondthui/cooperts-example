import { mapMaybe } from '@execonline-inc/collections';
import { noop } from '@kofno/piper';
import { fromNullable } from 'maybeasy';
import Task from 'taskarian';

export interface StorageError {
  kind: 'storage-error';
  error: string;
}

const storageError = (error: string): StorageError => ({
  kind: 'storage-error',
  error,
});

export const clear = new Task<StorageError, void>((reject, resolve) => {
  try {
    localStorage.clear();
    resolve();
  } catch (error) {
    reject(
      storageError(`could not clear local storage: ${JSON.stringify(error)}`)
    );
  }
  return noop;
});

export function setItem(
  key: string
): (value: string) => Task<StorageError, string>;
export function setItem(key: string, value: string): Task<StorageError, string>;
export function setItem(key: string, value?: string) {
  const doit = (value: string) =>
    new Task<StorageError, string>((reject, resolve) => {
      try {
        localStorage.setItem(key, value);
        resolve(value);
      } catch (error) {
        reject(storageError(`could not save value: ${JSON.stringify(value)}`));
      }
      return noop;
    });

  return typeof value === 'undefined' ? doit : doit(value);
}

export const getItem = (key: string) =>
  new Task<StorageError, string>((reject, resolve) => {
    try {
      const value = localStorage.getItem(key);
      fromNullable(value).cata({
        Nothing: () => reject(storageError(`Card ${key} is not available`)),
        Just: resolve,
      });
    } catch (error) {
      reject(
        storageError(
          `failed getting from localStorage: ${JSON.stringify(error)}`
        )
      );
    }
    return noop;
  });

export const removeItem = (key: string): Task<StorageError, string> =>
  new Task((reject, resolve) => {
    try {
      localStorage.removeItem(key);
      resolve(key);
    } catch (error) {
      reject(storageError(`could not remove ${key}: ${JSON.stringify(error)}`));
    }
    return noop;
  });

export const allItems = (byPredicate: (key: string) => boolean) =>
  new Task<StorageError, ReadonlyArray<string>>((reject, resolve) => {
    try {
      const everything = mapMaybe(
        fromNullable,
        Object.keys(localStorage)
          .filter(byPredicate)
          .map((k) => localStorage.getItem(k))
      );
      resolve(everything);
    } catch (error) {
      reject(
        storageError(`could not access localStorage: ${JSON.stringify(error)}`)
      );
    }

    return noop;
  });
