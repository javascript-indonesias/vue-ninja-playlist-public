import { ref } from 'vue';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { projectAuth } from '../firebase/config';

const errorValue = ref(null);
const isPendingLoad = ref(false);

async function signUp(email, password, displayname) {
    errorValue.value = null;
    isPendingLoad.value = true;

    try {
        const response = await createUserWithEmailAndPassword(projectAuth, email, password);
        if (!response) {
            throw new Error(`Tidak bisa melakukan registrasi ${email} dengan nama ${displayname}`);
        }

        // update data pengguna
        await updateProfile(response.user, { displayName: displayname });

        // Jika berhasil reset error
        errorValue.value = null;
        isPendingLoad.value = false;
        return Promise.resolve(JSON.parse(JSON.stringify(response)));
    } catch (err) {
        errorValue.value = err.message;
        isPendingLoad.value = false;
        return Promise.reject(err);
    }
}

function useSignup() {
    return { errorValue, signUp, isPendingLoad };
}

export default useSignup;
