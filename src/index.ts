import type {
  WriteProps,
  WriteWithExpProps,
  LocalStorageResponse,
} from './types';

export class LocalStorage {
  // read from local storage
  static write({ key, value }: WriteProps): void {
    if (typeof key !== 'string') {
      throw new Error('Key must be a string');
    }

    if (typeof value === 'object' && value !== null) {
      // JSON.stringify will throw if value contains circular references
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        throw new Error('Failed to serialize object for localStorage');
      }
    } else {
      localStorage.setItem(key, String(value)); // covers number, boolean, etc.
    }
  }

  // write to local storage
  static read(key: string): LocalStorageResponse {
    if (typeof key !== 'string') {
      return { status: 'error', value: 'key was not a valid string' };
    }

    const value = localStorage.getItem(key);

    if (value === null) {
      return { status: 'error', value: 'no value was found associated to key' };
    }

    try {
      const parsed = JSON.parse(value);

      return { status: 'success', value: parsed };
    } catch {
      // Not JSON, return the raw string
      return { status: 'success', value };
    }
  }

  // delete item in local storage
  static delete(key: string): LocalStorageResponse {
    if (typeof key !== 'string') {
      return { status: 'error', value: 'key was not a valid string' };
    }

    // read once
    const existing = this.read(key);
    if (existing.status === 'error') {
      return { status: 'error', value: existing.value };
    }

    // remove the item
    localStorage.removeItem(key);

    // verify it's gone
    if (localStorage.getItem(key) !== null) {
      return { status: 'error', value: 'error occurred deleting key' };
    }

    return { status: 'success', value: 'value of key is removed' };
  }

  // delete all items in local storage
  static clear(): LocalStorageResponse {
    try {
      localStorage.clear();

      if (localStorage.length > 0) {
        return { status: 'error', value: 'Error wiping localStorage' };
      }

      return { status: 'success', value: 'LocalStorage has been wiped' };
    } catch (error) {
      return {
        status: 'error',
        value: 'Exception while clearing localStorage',
      };
    }
  }

  // find and update a value in local storage
  static update({ key, value }: WriteProps): LocalStorageResponse {
    if (typeof key !== 'string') {
      return { status: 'error', value: 'Key must be a string' };
    }

    const existing = this.read(key);
    if (existing.status === 'error') {
      return { status: 'error', value: existing.value };
    }

    try {
      this.write({ key, value });
    } catch (error) {
      return { status: 'error', value: 'Failed to update localStorage' };
    }

    const confirm = this.read(key);
    if (confirm.status === 'error') {
      return { status: 'error', value: confirm.value };
    }

    return { status: 'success', value: `Key "${key}" was updated` };
  }

  // check and see if given key exists in local storage
  static has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // write to local storage with additional expiration time in payload
  static writeWithExpiry({ key, value, ttl }: WriteWithExpProps) {
    const expiresAt = Date.now() + ttl;
    const payload = { value, expiresAt };
    localStorage.setItem(key, JSON.stringify(payload));
  }

  // read from local storage detecting values that have expiration times
  static readWithExpiry(key: string): LocalStorageResponse {
    const raw = localStorage.getItem(key);
    if (!raw) return { status: 'error', value: 'Not found' };

    try {
      const { value, expiresAt } = JSON.parse(raw);
      if (Date.now() > expiresAt) {
        localStorage.removeItem(key);
        return { status: 'error', value: 'Expired' };
      }
      return { status: 'success', value };
    } catch {
      return { status: 'error', value: 'Invalid format' };
    }
  }

  // clear out all the expired values in local storage
  static cleanExpired() {
    Object.keys(localStorage).forEach((key) => {
      const item = localStorage.getItem(key);
      try {
        const parsed = JSON.parse(item || '{}');
        if (parsed?.expiresAt && Date.now() > parsed.expiresAt) {
          localStorage.removeItem(key);
        }
      } catch {
        /* Ignore */
      }
    });
  }
}
