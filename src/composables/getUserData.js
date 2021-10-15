import { ref } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { projectAuth } from '../firebase/config';

const userData = ref(projectAuth.currentUser);

onAuthStateChanged(
    projectAuth,
    (user) => {
        console.log('user data berubah untuk', user);
        userData.value = user;
    },
    (error) => {
        console.log(error);
    },
);

function getUser() {
    return { userData };
}

export default getUser;
