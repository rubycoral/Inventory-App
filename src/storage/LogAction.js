import AsyncStorage from '@react-native-async-storage/async-storage';

export const LogAction = async (entry) => {
  try {
    const historyRaw = await AsyncStorage.getItem('history');
    const history = historyRaw ? JSON.parse(historyRaw) : [];

    let log;

    if (typeof entry === 'string') {
      const userData = await AsyncStorage.getItem('loggedInUser');
      let username = 'Unknown User';

      if (userData) {
        const parsed = JSON.parse(userData);
        username = parsed?.email || parsed?.name || 'Unknown User';
      }

      log = {
        user: username,
        action: entry,
        timestamp: new Date().toLocaleString(),
      };
    } else {
      log = entry;
    }

    history.unshift(log);
    await AsyncStorage.setItem('history', JSON.stringify(history));
  } catch (err) {
    console.error('Logging failed:', err);
  }
};
