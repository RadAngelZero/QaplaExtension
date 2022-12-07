import {
    child,
    DataSnapshot,
    equalTo,
    get,
    orderByChild,
    push,
    query,
    runTransaction,
    ThenableReference,
    TransactionResult,
    update,
    onValue,
    set,
    orderByValue,
    remove
} from 'firebase/database';
import { getCurrentLanguage } from '../i18n';

import { database } from './firebase';

/**
 * Gets a reference for the specified locatoin on database
 * @param {string} databaseChild Child for reference
 * @returns The specified child location.
 */
function createChild(databaseChild) {
    return child(database, databaseChild);
}

//////////////////////
// Qapla Users
//////////////////////

/**
 * Returns the found uid´s linked to the given Twitch id (it returns an object of objects but we know that
 * the relationship between uid and Twitch id is 1:1)
 * @param {string} twitchId Twitch identifier
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
 export async function getUserProfileWithTwitchId(twitchId) {
    const usersChild = createChild('/Users');

    return await get(query(usersChild, orderByChild('twitchId'), equalTo(twitchId)));
}

/**
 * Creates the basic Qapla profile for the given user
 * @param {string} uid User identifier
 * @param {string} email Email
 * @param {string} userName Qapla username
 * @param {string} photoUrl Qapla photo url
 * @param {string} twitchId Twitch identifier
 * @param {string} twitchUsername Twitch username
 */
 export async function createUserProfile(uid, email, userName, photoUrl, twitchId, twitchUsername) {
    let city = userName.toUpperCase();

    const profileObj = {
        bio: '',
        city,
        credits: 0,
        email,
        id: uid,
        level: 0,
        status: false,
        token: '',
        userName,
        isUserLoggedOut: false,
        photoUrl,
        twitchId,
        twitchUsername,
        language: getCurrentLanguage()
    };

    const userChild = createChild(`/Users/${uid}`);

    await update(userChild, profileObj);
}

/**
 * Update the given fields on the user profile
 * @param {string} uid User identifier
 * @param {object} dateToUpdate Data to update
 * @param {object} dateToUpdate.email Email
 * @param {object} dateToUpdate.userName Qapla username
 * @param {object} dateToUpdate.photoUrl Qapla photo url
 * @param {object} dateToUpdate.twitchUsername Twitch username
 */
 export async function updateUserProfile(uid, dateToUpdate) {
    const userChild = createChild(`/Users/${uid}`);

    await update(userChild, dateToUpdate);
}

/**
 * Returns the profile of the given user
 * @param {string} uid User identifier
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
 export async function getUserProfile(uid) {
    const userChild = createChild(`/Users/${uid}`);

    return await get(query(userChild));
}

//////////////////////
// Qapla Memes
//////////////////////

/**
 * Returns the Qapla library of memes
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
 export async function getQaplaMemesLibrary() {
    const memesLibrary = createChild('/QaplaInteractions/Memes');

    return await get(query(memesLibrary));
}