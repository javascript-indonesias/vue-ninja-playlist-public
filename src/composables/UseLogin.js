import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { projectAuth } from '../firebase/config';

const errorValue = ref(null);
const isPendingLoad = ref(false);

async function loginUser(email, password) {
    errorValue.value = null;
    isPendingLoad.value = true;

    try {
        const response = await signInWithEmailAndPassword(projectAuth, email, password);

        if (!response) {
            throw new Error(`Username dan password salah. ${email}`);
        }
        errorValue.value = null;
        isPendingLoad.value = false;

        return Promise.resolve(JSON.parse(JSON.stringify(response)));
    } catch (err) {
        console.log(err);
        errorValue.value = `Username dan password salah. ${err.message}`;
        isPendingLoad.value = false;
        return Promise.reject(err);
    }
}

function useLogin() {
    return { errorValue, loginUser, isPendingLoad };
}

export default useLogin;
