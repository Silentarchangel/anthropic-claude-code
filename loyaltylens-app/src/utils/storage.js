// localStorage utility functions for managing loyalty program entries

const STORAGE_KEY = 'loyaltylens_entries';

export const getEntries = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const saveEntry = (entry) => {
  try {
    const entries = getEntries();
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      hidden: false,
    };
    entries.push(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return newEntry;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw error;
  }
};

export const updateEntry = (id, updatedData) => {
  try {
    const entries = getEntries();
    const index = entries.findIndex(entry => entry.id === id);
    if (index !== -1) {
      entries[index] = { ...entries[index], ...updatedData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      return entries[index];
    }
    throw new Error('Entry not found');
  } catch (error) {
    console.error('Error updating localStorage:', error);
    throw error;
  }
};

export const deleteEntry = (id) => {
  try {
    const entries = getEntries();
    const filtered = entries.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    throw error;
  }
};

export const toggleHidden = (id) => {
  try {
    const entries = getEntries();
    const entry = entries.find(entry => entry.id === id);
    if (entry) {
      entry.hidden = !entry.hidden;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      return entry;
    }
    throw new Error('Entry not found');
  } catch (error) {
    console.error('Error toggling hidden status:', error);
    throw error;
  }
};
