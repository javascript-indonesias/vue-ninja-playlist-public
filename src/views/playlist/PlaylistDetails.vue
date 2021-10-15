<template>
    <div class="error" v-if="errorValue">{{ errorValue }}</div>
    <div class="error" v-if="errorDeleteImage">{{ errorDeleteImage }}</div>
    <div class="playlist-details" v-if="playlist">
        <!-- Informasi playlist -->
        <div class="playlist-info">
            <div class="cover">
                <img :src="playlist.coverUrl" alt="" />
            </div>
            <h2>{{ playlist.title }}</h2>
            <p class="username">Created by {{ playlist.userName }}</p>
            <p class="description">{{ playlist.description }}</p>
            <button v-if="ownerShip" @click="handleDeleteDocument()">Hapus playlist</button>
        </div>

        <!-- Daftar musik playlist  -->
        <div class="song-list">
            <div v-if="!playlistData.songs.length">Daftar lagu belum tersedia disini</div>
            <div class="single-song" v-for="song in playlistData.songs" :key="song.id">
                <div class="details">
                    <h3>{{ song.title }}</h3>
                    <p>{{ song.artist }}</p>
                </div>
                <button v-if="ownerShip" @click="handleClickDelete(song.id)">Hapus</button>
            </div>
            <add-song v-if="ownerShip" :playlistsong="playlistData"></add-song>
        </div>
    </div>
</template>

<script>
import { watch, ref, computed, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import getDocument from '../../composables/getDocument';
import getUser from '../../composables/getUserData';
import useDocument from '../../composables/UseDocument';
import useStorage from '../../composables/UseStorage';

const AddSong = defineAsyncComponent(() => import('../../components/AddSong.vue'));

export default {
    props: {
        id: {
            type: String,
            default() {
                return '';
            },
        },
    },
    components: {
        'add-song': AddSong,
    },
    setup(props) {
        const playlistData = ref(null);
        const { userData } = getUser();
        const {
            errorValue: errorDelete,
            isPendingLoad,
            deleteDocument,
            updateDocument,
        } = useDocument('playlists', props.id);
        const { deleteImage, errorValue: errorDeleteImage } = useStorage();

        const router = useRouter();

        const snapshotDocCalback = (data) => {
            console.log('Callback snapshot', data);
            if (data) {
                playlistData.value = data;
            }
        };

        const { errorValue, singleDocument: playlist } = getDocument(
            'playlists',
            props.id,
            snapshotDocCalback,
        );

        // MEMPERBAIKI WATCH DOCUMENT PENGGANTI COMPUTED PROPERTY
        watch(playlist, (newplaylist) => {
            if (newplaylist) {
                console.log('Dari watcher ', newplaylist);
                playlistData.value = newplaylist;
            }
        });

        const ownerShip = computed(() => {
            const isOwned =
                playlistData.value &&
                userData.value &&
                userData.value.uid === playlistData.value.userId;

            console.log('Status ownership berubah ', isOwned);
            return isOwned;
        });

        const handleDeleteDocument = async () => {
            try {
                const isSukses = await deleteDocument();
                await deleteImage(playlistData.value.filePath);
                if (isSukses) {
                    console.log(`Sukses hapus document ${props.id}`);
                    router.push({ name: 'Home' });
                }
            } catch (err) {
                console.log(err);
            }
        };

        const handleClickDelete = async (songid) => {
            try {
                const songs = playlistData.value.songs.filter((song) => {
                    return song.id !== songid;
                });

                await updateDocument({ songs });
            } catch (err) {
                console.log(err);
            }
        };

        return {
            playlist,
            playlistData,
            errorValue,
            ownerShip,
            userData,
            handleDeleteDocument,
            errorDelete,
            isPendingLoad,
            errorDeleteImage,
            deleteImage,
            handleClickDelete,
        };
    },
};
</script>

<style lang="scss">
.playlist-details {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 80px;
}
.cover {
    overflow: hidden;
    border-radius: 20px;
    position: relative;
    padding: 160px;
}
.cover img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
    max-width: 200%;
    max-height: 200%;
}
.playlist-info {
    text-align: center;
}
.playlist-info h2 {
    text-transform: capitalize;
    font-size: 28px;
    margin-top: 20px;
}
.playlist-info p {
    margin-bottom: 20px;
}
.username {
    color: #999;
}
.description {
    text-align: left;
}
.single-song {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed var(--secondary);
    margin-bottom: 20px;
}
</style>
