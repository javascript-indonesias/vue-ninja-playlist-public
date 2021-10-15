<template>
    <div class="navbar">
        <nav>
            <img src="@/assets/ninja.png" alt="ninja image" />
            <h1>
                <router-link :to="{ name: 'Home' }">Ninja Playlist</router-link>
            </h1>
            <div class="links">
                <div v-if="userData">
                    <router-link :to="{ name: 'CreatePlaylist' }">Create Playlists</router-link>
                    <router-link :to="{ name: 'UserPlaylist' }">My Playlist</router-link>
                    <span>Halo pengguna, {{ userData.displayName }}</span>
                    <button @click="handleClickLogout()">Logout</button>
                </div>
                <div v-else>
                    <router-link class="btn" :to="{ name: 'Signup' }">Sign Up</router-link>
                    <router-link class="btn" :to="{ name: 'Login' }">Login</router-link>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
// Menjalankan fungsi untuk logout dari Firebase account
// Redirect ke halaman sign in
// Aksi tombol logout keluar ketika pengguna telah login
// Menampilkan tombol sign in dan sign up jika pengguna tidak login
// Menggunakan composable getUser
import { useRouter } from 'vue-router';
import useLogout from '../composables/UseLogout';
import getUser from '../composables/getUserData';

export default {
    setup() {
        const { userData } = getUser();
        const { logoutUser, errorValue } = useLogout();
        const router = useRouter();

        const handleClickLogout = async () => {
            try {
                const response = await logoutUser();
                if (response === true) {
                    console.log('Pengguna berhasil keluar aplikasi', response);
                    router.replace({ name: 'Login' });
                }
            } catch (err) {
                console.log(err);
            }
        };

        return { errorValue, handleClickLogout, userData };
    },
};
</script>

<style lang="scss" scoped>
.navbar {
    padding: 16px 10px;
    margin-bottom: 60px;
    background: white;
}

nav {
    display: flex;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}

nav img {
    max-height: 60px;
}

nav h1 {
    margin-left: 20px;
}

nav .links {
    margin-left: auto;
}

nav .links a,
button {
    margin-left: 16px;
    font-size: 14px;
}

nav img {
    max-height: 60px;
}

span {
    font-size: 14px;
    display: inline-block;
    margin-left: 16px;
    padding-left: 16px;
    border-left: 1px solid #eee;
}
</style>
