<template>
    <div class="add-song">
        <button v-if="!showForm" @click="handleShowForm()">Tambah Lagu</button>
        <form v-if="showForm" @submit.prevent="handleSubmitForm()">
            <h4>Tambah Lagu Baru</h4>
            <input
                type="text"
                name="titleSong"
                id="titleSong"
                v-model="stringTitleSong"
                placeholder="Song title"
                required
            />
            <input
                type="text"
                name="artistSong"
                id="artistSong"
                v-model="stringArtistSong"
                placeholder="Artist name"
                required
            />
            <button>Tambah</button>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import useDocument from '../composables/UseDocument';

export default {
    props: {
        playlistsong: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    setup(props) {
        const stringTitleSong = ref('');
        const stringArtistSong = ref('');
        const showForm = ref(false);
        const { updateDocument, isPendingLoad, errorValue } = useDocument(
            'playlists',
            props.playlistsong.id,
        );

        const handleShowForm = () => {
            showForm.value = !showForm.value;
        };

        const handleSubmitForm = async () => {
            const newSong = {
                title: stringTitleSong.value,
                artist: stringArtistSong.value,
                id: uuidv4(),
            };

            try {
                await updateDocument({ songs: [...props.playlistsong.songs, newSong] });

                stringTitleSong.value = '';
                stringArtistSong.value = '';
            } catch (err) {
                console.log(err);
            }
        };

        return {
            stringTitleSong,
            stringArtistSong,
            showForm,
            handleShowForm,
            handleSubmitForm,
            updateDocument,
            isPendingLoad,
            errorValue,
        };
    },
};
</script>

<style lang="scss" scoped>
.add-song {
    text-align: center;
    margin-top: 40px;
}
form {
    max-width: 100%;
    text-align: left;
}
</style>
