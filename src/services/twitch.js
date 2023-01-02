/**
 * Gets the data from the given user
 * @param {string} twitchId Twitch id
 * @param {string} token Extension Token
 * @returns User data
 */
export async function getUserData(twitchId, token) {
    const request = await fetch(`https://api.twitch.tv/helix/users?id=${twitchId}`, {
        method: 'GET',
        headers: {
            'Client-Id': '04ixhlbfcbpalxysybqrs4mjfbldhb',
            Authorization: `Extension ${token}`
        }
    });

    let user = null;
    const usersList = await request.json();

    if (usersList) {
        user = usersList.data[0];
    }

    return user;
}

/**
 * Gets following status of the given user
 * @param {string} userTwitchId User Twitch id
 * @param {string} channelId Channel (streamer) Twitch id
 * @param {string} token Extension Token
 * @returns {boolean} True if user is following the channel
 */
export async function isUserFollowing(userTwitchId, channelId, token) {
    const request = await fetch(`https://api.twitch.tv/helix/users/follows?from_id=${userTwitchId}&to_id=${channelId}`, {
        method: 'GET',
        headers: {
            'Client-Id': '04ixhlbfcbpalxysybqrs4mjfbldhb',
            Authorization: `Extension ${token}`
        }
    });

    let isFollowing = false;
    const followingData = await request.json();

    if (followingData) {
        // If the user is following total = 1 otherwise total = 0
        isFollowing = followingData.data.total ? true : false;
    }

    return isFollowing;
}