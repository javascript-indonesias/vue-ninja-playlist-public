import { ref, watchEffect } from 'vue';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { projectFirestore } from '../firebase/config';

function getCollection(collectionName) {
    const documents = ref(null);
    const errorValue = ref(null);

    // https://firebase.google.com/docs/firestore/query-data/listen
    const collectionRef = collection(projectFirestore, collectionName);

    const queryRefs = query(collectionRef, orderBy('createdAt'));

    const unsubscribes = onSnapshot(
        queryRefs,
        (querySnapshot) => {
            console.log('Snapshot Firebase berjalan');
            const results = [];
            querySnapshot.docs.forEach((doc) => {
                if (doc.data().createdAt) {
                    results.push({ ...doc.data(), id: doc.id });
                }
                documents.value = results;
                errorValue.value = null;
            });
        },
        (error) => {
            console.log(error);
            documents.value = null;
            errorValue.value = 'Gagal mengambil data dari server';
        },
    );

    watchEffect((onInvalidate) => {
        // lakukan unsubscribe data onSnapshot ketika component unmounted
        // Atau watcher stop watch component
        onInvalidate(() => {
            unsubscribes();
        });
    });

    return { documents, errorValue };
}

export default getCollection;
