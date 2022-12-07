import { onAuthStateChanged, signInWithCustomToken, User, UserCredential, NextOrObserver } from 'firebase/auth';

import { auth } from './firebase';
import { createUserProfile, getUserProfileWithTwitchId, updateUserProfile } from './database';
import { generateAuthTokenForTwitchSignIn } from './functions';

/**
 * Listen to changes on the firebase auth state
 * @param {NextOrObserver<User>} callback Handler of auth state changes
 */
 export function listenToAuthState(callback) {
    onAuthStateChanged(auth, callback);
}

/**
 * Sign a user and create/update their profile
 * @param {object} twitchUserData Object containing relevant Twitch user information
 * @param {object} twitchUserData.id Twitch user id
 * @param {object} twitchUserData.display_name Twitch user display name
 * @param {object} twitchUserData.email Twitch user email
 * @param {object} twitchUserData.profile_image_url Twitch user profile image
 */
export async function authWithTwitch(twitchUserData) {
    const user = await signTwitchUser(twitchUserData);

    if (user.isNewUser) {
        // For a new user their uid and userName are the same than their twitch id and twitch display name
        await createUserProfile(user.uid, user.email, user.displayName, user.photoURL, user.uid, user.displayName);
    } else {
        await updateUserProfile(user.uid, {
            email: user.email,
            userName: user.displayName,
            photoUrl: user.photoURL
        });
    }
}

/**
 * Sign a user on firebase with Twitch auth information
 * @param {object} twitchUserData Object coming from Twitch with auth data
 * @param {object} twitchUserData.id Twitch user id
 * @param {object} twitchUserData.display_name Twitch user display name
 * @param {object} twitchUserData.email Twitch user email
 * @param {object} twitchUserData.profile_image_url Twitch user profile image
 * @returns {Promise<UserCredential>} Firebase auth user credential
 */
 async function signTwitchUser(twitchUserData) {
    const userProfileSnapshot = await getUserProfileWithTwitchId(twitchUserData.id);
    let userProfile = null;

    userProfileSnapshot.forEach((profile) => userProfile = profile.val());

    // If there is a profile and have an id field use that field, otherwise (new user) use Twitch id
    const qaplaCustomAuthToken = await generateAuthTokenForTwitchSignIn(
        userProfile.id ? userProfile.id : twitchUserData.id,
        twitchUserData.display_name,
        twitchUserData.email || null
    );

    if (qaplaCustomAuthToken.data && qaplaCustomAuthToken.data.token) {
        const user = await signInWithCustomToken(auth, qaplaCustomAuthToken.data.token);

        // Overwrite of isNewUser and photoURL is necessary
        return { ...user.user, isNewUser: !userProfileSnapshot.exists(), photoURL: twitchUserData.profile_image_url };
    }
}