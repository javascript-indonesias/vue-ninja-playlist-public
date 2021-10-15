<template>
    <div class="user-playlists">
        <h2>My Playlist</h2>
        <div v-if="playlistDoc">
            <list-view :playlists="playlistDoc"></list-view>
        </div>
        <router-link :to="{ name: 'CreatePlaylist' }" class="btn"
            >Create A New Playlist</router-link
        >
    </div>
</template>

<script>
import { onMounted } from 'vue';
import ListView from '../../components/ListView.vue';
import getUser from '../../composables/getUserData';
import getCollectionQuery from '../../composables/getCollectionQuery';

export default {
    components: {
        'list-view': ListView,
    },
    setup() {
        const { userData } = getUser();

        const queryParam = ['userId', '==', userData.value.uid];
        const {
            documents: playlistDoc,
            getDataPlaylistUser,
            errorValue,
        } = getCollectionQuery('playlists', queryParam);

        onMounted(async () => {
            try {
                const result = await getDataPlaylistUser();
                playlistDoc.value = result;
            } catch (err) {
                console.log(err);
            }
        });

        return { playlistDoc, errorValue };
    },
};
</script>

<style lang="scss" scoped></style>
