export class StorageUtil {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  public static save<T>(key: string, data: T): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Could not save data for the key "${key}"`, e);
    }
  }

  public static load<T>(key: string): T | null {
    if (!this.isBrowser()) return null;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch (e) {
      console.error(`Unable to read key data "${key}"`, e);
      return null;
    }
  }

  public static remove(key: string): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Unable to delete key "${key}"`, e);
    }
  }
}
