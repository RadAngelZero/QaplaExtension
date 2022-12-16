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
 * Returns the found uid´s linked to the given Twitch Id (it returns an object of objects but we know that
 * the relationship between uid and Twitch Id is 1:1)
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
// User Streamer
//////////////////////

/**
 * Returns the found streamers linked to the given Twitch Id (it returns an object of objects but we know that
 * the relationship between uid and Twitch Id is 1:1)
 * @param {string} streamerId Streamer Twitch Id
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
export async function getStreamerWithTwitchId(streamerId) {
    const userStreamer = createChild(`/UserStreamer`);

    return await get(query(userStreamer, orderByChild('id'), equalTo(streamerId)));
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

//////////////////////
// Gifs Libraries
//////////////////////

/**
 * Returns a random gif from the given library
 * @param {string} libraryName Name of the library
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
export async function getRandomGifByLibrary(libraryName) {
    const libraryLength = createChild(`/GifsLibraries/${libraryName}/length`);
    const length = await get(query(libraryLength));

    const index = Math.floor(Math.random() * length.val());
    const gif = createChild(`/GifsLibraries/${libraryName}/gifs/${index}`);

    return await get(query(gif));
}

//////////////////////
// Reactions Prices Bits
//////////////////////

/**
 * Gets the price in Bits of the given reaction level and their Sku on the Twitch catalog (this price
 * is always the one the streamer selected in their configuration)
 * @param {string} streamerUid Streamer identifier
 * @param {string} reactionLevel Reaction level name (e.g: level1)
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
export async function loadReactionPriceByLevel(streamerUid, reactionLevel) {
    const channelPrices = createChild(`/ReactionsPricesBits/${streamerUid}/${reactionLevel}`);

    return await get(query(channelPrices));
}

//////////////////////
// Reactions Prices Default
//////////////////////

/**
 * Gets the price in Bits of the given reaction level and their Sku on the Twitch catalog (this price will be
 * the default, used in cases where the streamer has not selected another price)
 * @param {string} reactionLevel Reaction level name (e.g: level1)
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
export async function getReactionPriceDefault(reactionLevel) {
    const defaultPrice = createChild(`/ReactionsPricesDefault/${reactionLevel}/bits`);

    return await get(query(defaultPrice));
}

//////////////////////
// Voice Bot Available Voices
//////////////////////

/**
 * Load all the available voices for the voice bot
 * @returns {Promise<DataSnapshot>} Resulting DataSnapshot of the query
 */
export async function getAvailableBotVoices() {
    const availableVoices = createChild('/VoiceBotAvailableVoices');

    return await get(query(availableVoices));
}