import { ref } from 'vue';
import {
    ref as refstorage,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
import { projectStorage } from '../firebase/config';
import getUserData from './getUserData';

const { userData } = getUserData();

function useStorage() {
    const errorValue = ref(null);
    const urlUpload = ref(null);
    const filePathFirebase = ref(null);
    const progressUpload = ref(null);

    const uploadImages = async (filedata) => {
        filePathFirebase.value = `covers/${userData.value.uid}/${filedata.name}`;
        const storageRef = refstorage(projectStorage, filePathFirebase.value);

        const uploadTaskImage = uploadBytesResumable(storageRef, filedata);

        // Upload gambar dengan Progress
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        return new Promise((resolve, reject) => {
            uploadTaskImage.on(
                'state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                    progressUpload.value = progress;

                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                            console.log('Default action');
                            break;
                    }
                },
                (error) => {
                    // Handle unsuccessful uploads
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;
                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                        default:
                            console.log('Default action');
                            break;
                    }

                    console.log(error);
                    errorValue.value = `Gagal upload file ${error.message} ${error.code}`;
                    reject(new Error(error.message));
                },
                async () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    try {
                        const downloadUrls = await getDownloadURL(storageRef);
                        urlUpload.value = downloadUrls;
                        console.log('File available at', downloadUrls);
                        resolve(downloadUrls);
                    } catch (err) {
                        console.log(err);
                        reject(new Error(err.message));
                    }
                },
            );
        });
    };

    const deleteImage = async (path) => {
        const storageRef = refstorage(projectStorage, path);
        try {
            await deleteObject(storageRef);
            errorValue.value = null;
            return Promise.resolve(true);
        } catch (err) {
            console.log(err);
            errorValue.value = err.message;
            return Promise.reject(new Error(err.message));
        }
    };

    return { errorValue, urlUpload, filePathFirebase, uploadImages, progressUpload, deleteImage };
}

export default useStorage;
