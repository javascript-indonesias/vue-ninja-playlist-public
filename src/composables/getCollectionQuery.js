import { ref } from 'vue';
import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';
import { projectFirestore } from '../firebase/config';

function getCollectionQuery(collectionName, queryParam) {
    const documents = ref(null);
    const errorValue = ref(null);

    const getDataPlaylistUser = async () => {
        // https://firebase.google.com/docs/firestore/query-data/listen
        const collectionRef = collection(projectFirestore, collectionName);

        let queryRefs = null;
        if (queryParam && queryParam.length > 0) {
            queryRefs = query(collectionRef, orderBy('createdAt'), where(...queryParam));
        } else {
            queryRefs = query(collectionRef, orderBy('createdAt'));
        }

        const results = [];
        try {
            const querySnapshot = await getDocs(queryRefs);
            querySnapshot.forEach((doc) => {
                results.push({ ...doc.data(), id: doc.id });
            });

            documents.value = results;
            errorValue.value = null;

            return Promise.resolve(results);
        } catch (err) {
            console.log(err);
            documents.value = null;
            errorValue.value = `Gagal mengambil data dari server ${err.message}`;
            return Promise.reject(new Error(`Gagal mengambil data dari server ${err.message}`));
        }
    };

    return { documents, errorValue, getDataPlaylistUser };
}

export default getCollectionQuery;
