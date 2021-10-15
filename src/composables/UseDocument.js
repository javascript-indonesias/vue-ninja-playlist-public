import { ref } from 'vue';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { projectFirestore } from '../firebase/config';

function useDocument(collectionname, id) {
    const errorValue = ref(null);
    const isPendingLoad = ref(false);

    const deleteDocument = async () => {
        isPendingLoad.value = true;
        errorValue.value = null;
        const documentRef = doc(projectFirestore, collectionname, id);

        try {
            await deleteDoc(documentRef);
            isPendingLoad.value = false;
            return Promise.resolve(true);
        } catch (err) {
            console.log(err);
            errorValue.value = `Gagal menghapus dokumen ${err.message}`;
            isPendingLoad.value = false;
            return Promise.reject(new Error(errorValue.value));
        }
    };

    const updateDocument = async (updatedDoc) => {
        isPendingLoad.value = true;
        errorValue.value = null;
        const documentRef = doc(projectFirestore, collectionname, id);

        try {
            await updateDoc(documentRef, updatedDoc);
            isPendingLoad.value = false;
            return Promise.resolve(true);
        } catch (err) {
            console.log(err);
            errorValue.value = `Gagal menghapus dokumen ${err.message}`;
            isPendingLoad.value = false;
            return Promise.reject(new Error(errorValue.value));
        }
    };

    return { errorValue, isPendingLoad, deleteDocument, updateDocument };
}

export default useDocument;
