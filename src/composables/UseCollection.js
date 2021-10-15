import { ref } from 'vue';
import { collection, addDoc } from 'firebase/firestore';
import { projectFirestore } from '../firebase/config';

function useCollection(collectionname) {
    const errorValue = ref(null);
    const isPendingLoad = ref(false);

    const addDataDoc = async (docdata) => {
        errorValue.value = null;
        isPendingLoad.value = true;

        try {
            const response = await addDoc(collection(projectFirestore, collectionname), docdata);

            isPendingLoad.value = false;
            return Promise.resolve(response);
        } catch (err) {
            console.log(err);
            errorValue.value = `Tidak dapat mengirim pesan. ${err.message}`;
            isPendingLoad.value = false;
            return Promise.reject(new Error(errorValue.value));
        }
    };

    return { errorValue, addDataDoc, isPendingLoad };
}

export default useCollection;
