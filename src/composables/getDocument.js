import { ref, watchEffect } from 'vue';
import { onSnapshot, doc } from 'firebase/firestore';
import { projectFirestore } from '../firebase/config';

function getDocument(collectionName, id, snapshotCallback) {
    const singleDocument = ref(null);
    const errorValue = ref(null);

    // https://firebase.google.com/docs/firestore/query-data/listen
    const documentRef = doc(projectFirestore, collectionName, id);

    const unsubscribes = onSnapshot(
        documentRef,
        (docitem) => {
            console.log('Snapshot Firebase berjalan');
            if (docitem.data()) {
                singleDocument.value = {
                    ...JSON.parse(JSON.stringify(docitem.data())),
                    id: docitem.id,
                };
                errorValue.value = null;

                // menggunakan callback
                snapshotCallback({ ...JSON.parse(JSON.stringify(docitem.data())), id: docitem.id });
            } else {
                errorValue.value = 'Document tidak ditemukan';
            }
        },
        (error) => {
            console.log(error);
            errorValue.value = 'Gagal mengambil document dari server';
        },
    );

    watchEffect((onInvalidate) => {
        // lakukan unsubscribe data onSnapshot ketika component unmounted
        // Atau watcher stop watch component
        onInvalidate(() => {
            unsubscribes();
        });
    });

    return { singleDocument, errorValue };
}

export default getDocument;
