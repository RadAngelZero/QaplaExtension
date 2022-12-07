import { httpsCallable } from 'firebase/functions';

import { functions } from './firebase';

/**
 * Generate an auth token for the user to signIn with Twitch (custom auth)
 * @param {string} uid User uid (can be their Twitch Id or a firebase id as in the app we have other signup providers)
 * @param {string} displayName Twitch username of the user
 * @param {string} email Twitch email of the user
 */
 export async function generateAuthTokenForTwitchSignIn(uid, displayName, email) {
    const appTwitchSignin = httpsCallable(functions, 'appTwitchSignin');

    try {
        return await appTwitchSignin({ uid, displayName, email });
    } catch (error) {
        console.log(error);
    }
}