import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

export const storePartyToken = async (token: string) => {
    try {
        await AsyncStorage.setItem('partyToken', token);
        console.log(`party token stored: ${token}`);
    } catch (error) {
        console.error('Failed to store party token: ', error);
    }
};

export const getPartyToken = async () => {
    try {
        const token = await AsyncStorage.getItem('partyToken');
        console.log(`party token retrieved: ${token}`);
        return token;
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

export const storeAccessToken = async (token: string) => {
    try {
        // await AsyncStorage.setItem('accessToken', token);
        await SecureStore.setItemAsync('accessToken', token);
    } catch (error) {
        console.error('Failed to store access token: ', error);
    }
};

export const getAccessToken = async () => {
    try {
        // const token = await AsyncStorage.getItem('accessToken');
        const token = await SecureStore.getItemAsync('accessToken');
        return token;
    } catch (error) {
        return null;
    }
};

export const removeAccessToken = async () => {
    try {
        // await AsyncStorage.removeItem('accessToken');
        await SecureStore.deleteItemAsync('accessToken');
    } catch (error) {
        console.error('Failed to remove access token: ', error);
    }
};

export const storeRefreshToken = async (token: string) => {
    try {
        // await AsyncStorage.setItem('refreshToken', token);
        await SecureStore.setItemAsync('refreshToken', token);
    } catch (error) {
        console.error('Failed to store refresh token: ', error);
    }
};

export const getRefreshToken = async () => {
    try {
        // const token = await AsyncStorage.getItem('refreshToken');
        const token = await SecureStore.getItemAsync('refreshToken');
        return token;
    } catch (error) {
        return null;
    }
};

export const removeRefreshToken = async () => {
    try {
        // await AsyncStorage.removeItem('refreshToken');
        await SecureStore.deleteItemAsync('refreshToken');
    } catch (error) {
        console.error('Failed to remove refresh token: ', error);
    }
};

export const storeNickname = async (nickname: string) => {
    try {
        await AsyncStorage.setItem('Nickname', nickname);
    } catch (error) {
        console.error('Failed to store Nickname: ', error);
    }
};

export const getNickname = async () => {
    try {
        const nickname = await AsyncStorage.getItem('Nickname');
        return nickname;
    } catch (error) {
        return null;
    }
};

export const removeNickname = async () => {
    try {
        await AsyncStorage.removeItem('Nickname');
    } catch (error) {
        console.error('Failed to remove Nickname: ', error);
    }
};

export const storeLoggedUsername = async (loggedUsername: string) => {
    try {
        await AsyncStorage.setItem('LoggedUsername', loggedUsername);
    } catch (error) {
        console.error('Failed to store LoggedUsername: ', error);
    }
};

export const getLoggedUsername = async () => {
    try {
        const loggedUsername = await AsyncStorage.getItem('LoggedUsername');
        return loggedUsername;
    } catch (error) {
        return null;
    }
};

export const removeLoggedUsername = async () => {
    try {
        await AsyncStorage.removeItem('LoggedUsername');
    } catch (error) {
        console.error('Failed to remove LoggedUsername: ', error);
    }
};
