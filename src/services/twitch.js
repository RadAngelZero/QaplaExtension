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