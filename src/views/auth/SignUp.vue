<template>
    <form @submit.prevent="handleSubmitSignUp">
        <h3>Sign Up</h3>
        <input
            type="text"
            name="inputdisplayname"
            id="inputdisplayname"
            placeholder="Display Name"
            required
            v-model="stringDisplayName"
        />
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
import useSignup from '../../composables/UseSignup';

export default {
    setup() {
        const stringEmail = ref('');
        const stringPassword = ref('');
        const stringDisplayName = ref('');
        const router = useRouter();

        const { errorValue, signUp, isPendingLoad } = useSignup();

        const handleSubmitSignUp = async () => {
            try {
                const response = await signUp(
                    stringEmail.value,
                    stringPassword.value,
                    stringDisplayName.value,
                );
                if (!errorValue.value && response) {
                    console.log('Pengguna berhasil mendaftar', response);
                    router.push({ name: 'UserPlaylist' });
                }
            } catch (err) {
                console.log(err);
            }
        };

        return {
            stringEmail,
            stringPassword,
            stringDisplayName,
            handleSubmitSignUp,
            isPendingLoad,
            errorValue,
        };
    },
};
</script>

<style lang="scss"></style>
