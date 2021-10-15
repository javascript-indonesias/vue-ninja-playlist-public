import localforage from 'localforage';

const saveDataStorage = async (key, value) => {
    const dataresult = await localforage.setItem(key, value);
    return Promise.resolve(dataresult);
};

const getDataStorage = async (key) => {
    const dataresult = await localforage.getItem(key);
    return Promise.resolve(dataresult);
};

const deleteDataStorage = async (key) => {
    await localforage.removeItem(key);
    return Promise.resolve(true);
};

const clearDataStorage = async () => {
    await localforage.clear();
    return Promise.resolve(true);
};

export { saveDataStorage, getDataStorage, deleteDataStorage, clearDataStorage };
