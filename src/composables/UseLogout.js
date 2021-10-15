import { ref } from 'vue';
import { signOut } from 'firebase/auth';
import { projectAuth } from '../firebase/config';
import { clearDataStorage } from './localstorages';

const errorValue = ref(null);
const isPendingLoad = ref(false);

async function logoutUser() {
    errorValue.value = null;
    isPendingLoad.value = true;

    try {
        await signOut(projectAuth);
        const result = await clearDataStorage();

        if (result) {
            errorValue.value = null;
            isPendingLoad.value = false;

            return Promise.resolve(true);
        }
        return Promise.reject(new Error('Gagal sign out'));
    } catch (err) {
        console.log(err.message);
        errorValue.value = err.message;
        isPendingLoad.value = false;
        return Promise.reject(err);
    }
}

function useLogout() {
    return { logoutUser, errorValue };
}

export default useLogout;
