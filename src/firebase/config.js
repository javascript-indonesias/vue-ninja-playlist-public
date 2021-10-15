/* eslint-disable import/no-extraneous-dependencies */
// https://console.cloud.google.com/apis/credentials?folder=&organizationId=&project=ninjablogfirebase
import { initializeApp } from 'firebase/app';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Buat Firebase Config di halaman ini
// https://console.firebase.google.com/project/ninja-playlists/settings/general/
const firebaseConfig = {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
};

// Init firebase instance
const app = initializeApp(firebaseConfig);

// Init firebase service
const projectAuth = getAuth(app);
const projectFirestore = getFirestore(app);
const projectStorage = getStorage(app);

// https://cloud.google.com/firestore/docs/manage-data/add-data#server_timestamp
const getTimestamp = serverTimestamp;

export { projectFirestore, getTimestamp, projectAuth, projectStorage };
