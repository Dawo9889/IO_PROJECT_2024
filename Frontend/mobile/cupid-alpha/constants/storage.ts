import AsyncStorage from '@react-native-async-storage/async-storage'

export const storePartyToken = async (token: string) => {
    try {
        await AsyncStorage.setItem('partyToken', token);
    } catch (error) {
        console.error('Failed to store party token: ', error);
    }
};

export const getPartyToken = async () => {
    try {
        await AsyncStorage.getItem('partyToken');
    } catch (error) {
        console.error('Failed to fetch party token: ', error);
        return null;
    }
};

export const removePartyToken = async () => {
    try {
        await AsyncStorage.removeItem('partyToken');
    } catch (error) {
        console.error('Failed to remove party token: ', error);
    }
};