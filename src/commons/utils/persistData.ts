export const setLocalStorageData = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}": ${error}`);
  }
};

export const getLocalStorageData = <T = any>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error getting localStorage key "${key}": ${error}`);
    return null;
  }
};
