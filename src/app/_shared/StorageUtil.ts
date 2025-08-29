export class StorageUtil {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  public static save<T>(key: string, data: T, storage: Storage = localStorage): void {
    if (!this.isBrowser()) return;
    try {
      storage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Could not save data for the key "${key}"`, e);
    }
  }

  public static load<T>(key: string, fallback: T, storage: Storage = localStorage): T {
    if (!this.isBrowser()) return fallback;
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch (e) {
      console.error(`Unable to read key data "${key}"`, e);
      return fallback;
    }
  }

  public static remove(key: string, storage: Storage = localStorage): void {
    if (!this.isBrowser()) return;
    try {
      storage.removeItem(key);
    } catch (e) {
      console.error(`Unable to delete key "${key}"`, e);
    }
  }
}
