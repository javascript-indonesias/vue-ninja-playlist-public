<template>
    <form @submit.prevent="handleSubmitPlaylist()">
        <h4>Create New Playlist</h4>
        <input type="text" placeholder="Playlist title" v-model="stringTitle" required />

        <textarea
            name="textareaDesc"
            id="textareaDesc"
            v-model="stringDesc"
            placeholder="Playlist description..."
            required
        ></textarea>

        <!-- Unggah file cover playlist -->
        <label for="inputUpload">Upload playlist cover image</label>
        <input type="file" name="inputUpload" id="inputUpload" @change="handleInputFileChange" />
        <div class="error" v-if="fileError">{{ fileError }}</div>

        <!-- Data error yang keluar -->
        <div class="error"></div>
        <button v-if="!isLoading">Create Playlist</button>
        <button v-else disabled>Menyimpan data...</button>
    </form>
</template>

<script>
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'vue-router';
import useStorage from '../../composables/UseStorage';
import useCollection from '../../composables/UseCollection';
import getUser from '../../composables/getUserData';
import { getTimestamp } from '../../firebase/config';

export default {
    setup() {
        const stringTitle = ref('');
        const stringDesc = ref('');
        const fileSelected = ref(null);
        const fileError = ref(null);
        const isLoading = ref(false);

        const router = useRouter();

        const { filePathFirebase, urlUpload, uploadImages } = useStorage();
        const { errorValue: errorAddData, addDataDoc } = useCollection('playlists');
        const { userData } = getUser();

        const allowedFileType = ['image/png', 'image/jpg', 'image/jpeg'];

        // Menambahkan data playlist ke dalam firebase docs
        const addDataToDocument = async () => {
            try {
                const response = await addDataDoc({
                    uuids: uuidv4(),
                    title: stringTitle.value,
                    description: stringDesc.value,
                    userId: userData.value.uid,
                    userName: userData.value.displayName,
                    coverUrl: urlUpload.value,
                    filePath: filePathFirebase.value,
                    songs: [],
                    createdAt: getTimestamp(),
                });

                isLoading.value = false;
                if (!errorAddData.value && response) {
                    console.log('Sukses tambahkan ke dokumen playlist');
                    // navigasi ke halaman daftar playlist
                    router.push({ name: 'PlaylistDetail', params: { id: response.id } });
                }
            } catch (err) {
                console.log(err);
                isLoading.value = false;
            }
        };

        const handleSubmitPlaylist = async () => {
            if (fileSelected.value) {
                isLoading.value = true;
                console.log(stringTitle.value, stringDesc.value, fileSelected.value);

                // Unggah data gambar
                try {
                    await uploadImages(fileSelected.value);

                    console.log(
                        'Data gambar berhasil diunggah',
                        filePathFirebase.value,
                        'File di Firebase ',
                        urlUpload.value,
                    );

                    // Simpan data ke firebase document
                    await addDataToDocument();
                } catch (err) {
                    console.log(err);
                    isLoading.value = false;
                }
            }
        };

        const handleInputFileChange = (event) => {
            const selectedFile = event.target.files[0];
            console.log(selectedFile);

            const isMatchedType = allowedFileType.includes(selectedFile.type);

            if (selectedFile && isMatchedType) {
                fileSelected.value = selectedFile;
                fileError.value = null;
            } else {
                fileSelected.value = null;
                fileError.value = 'Pilih data gambar PNG/JPEG dengan benar';
            }
        };

        return {
            stringTitle,
            stringDesc,
            handleSubmitPlaylist,
            handleInputFileChange,
            fileSelected,
            fileError,
            filePathFirebase,
            urlUpload,
            isLoading,
        };
    },
};
</script>

<style lang="scss" scoped>
form {
    background: white;
}
input[type='file'] {
    border: 0;
    padding: 0;
}
label {
    font-size: 12px;
    display: block;
    margin-top: 30px;
}
button {
    margin-top: 20px;
}
</style>
