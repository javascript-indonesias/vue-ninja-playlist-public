<template>
    <form @submit.prevent="handleSubmitLogin">
        <h3>Login</h3>
        <input
            type="email"
            name="inputemail"
            id="inputemail"
            placeholder="Alamat Email"
            required
            v-model="stringEmail"
        />
        <input
            type="password"
            name="inputpassword"
            id="inputpasswrd"
            placeholder="Password"
            required
            v-model="stringPassword"
        />
        <div v-if="errorValue" class="error">{{ errorValue }}</div>
        <button v-if="!isPendingLoad">Log In</button>
        <button v-if="isPendingLoad" disabled>Loading...</button>
    </form>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useLogin from '../../composables/UseLogin';

export default {
    setup() {
        const stringEmail = ref('');
        const stringPassword = ref('');
        const router = useRouter();

        const { errorValue, loginUser, isPendingLoad } = useLogin();

        const handleSubmitLogin = async () => {
            try {
                const response = await loginUser(stringEmail.value, stringPassword.value);
                console.log(response);

                if (response && !errorValue.value) {
                    console.log('Pengguna berhasil login');
                    router.push({ name: 'UserPlaylist' });
                }
            } catch (err) {
                console.log(err);
            }
        };

        return { stringEmail, stringPassword, errorValue, handleSubmitLogin, isPendingLoad };
    },
};
</script>

<style lang="scss" scoped></style>
