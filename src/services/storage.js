import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Gets a reference for the specified locatoin on database
 * @param {string} storageRef Child for reference
 * @returns The specified child location.
 */
function createRef(storageRef) {
    return ref(storage, storageRef);
}

/**
 * Upload a meme file to the storage bucket
 * @param {File} subMemeFile File to upload
 * @param {function} onProgress Function to track the progress of the upload (from 0% to 100%)
 * @param {function} onSuccess Function called after the file was successfully uploaded
 */
export function uploadSubMeme(subMemeFile, onProgress, onSuccess) {
    const filePath = `DecksMemes/${subMemeFile.name}`;
    const memeRef = createRef(filePath);
    const uploadTask = uploadBytesResumable(memeRef, subMemeFile);

    uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
        },
        (error) => {
            console.log(error.code);
        },
        async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            onSuccess(url, filePath);
        }
    );
}