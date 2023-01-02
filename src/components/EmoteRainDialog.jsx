import React, { useEffect, useState } from 'react';
import { Box, Dialog, IconButton, ImageList, ImageListItem, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import { useTwitch } from '../hooks/TwitchProvider';
import { useAuth } from '../hooks/AuthProvider';

import { getRandomGifByLibrary } from '../services/database';
import { ReactComponent as Close } from './../assets/Icons/Close.svg';
import { ReactComponent as Lock } from './../assets/Icons/Lock.svg';
import { isUserFollowing } from '../services/twitch';

const EmoteRainContainer = styled(Box)({
    marginTop: '56px',
    minHeight: '92vh',
    background: '#141539',
    borderTopLeftRadius: '30px',
    borderTopRightRadius: '30px',
});

const HeaderContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '16px',
    marginTop: '32px',
    padding: '0px 24px'
});

const CloseIconButton = styled(IconButton)({
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.253621)',
    padding: 0,
    marginRight: '-40px',
});

const HeaderText = styled('p')({
    width: '100%',
    margin: 0,
    fontWeight: '900',
    fontSize: '20px',
    lineHeight: '24px',
    textAlign: 'center',
    color: '#fff'
});

const GifContainer = styled(Box)({
    marginTop: '32px',
    padding: '0px 24px'
});

const EmotesListContainer = styled(Box)({
    marginTop: '44px',
    backgroundColor: '#141539',
    padding: '0px 24px'
});

const EmoteCategoryTitle = styled(Typography)({
    fontSize: '20px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)'
});

const LockedIcon = styled(Box)({
    position: 'absolute',
    bottom: '-8px',
    right: '-3px'
});

const EmoteRainDialog = ({ open, onClose, emotes, onEmoteSelected }) => {
    const [gif, setGif] = useState(null);
    const [isFollower, setIsFollower] = useState(false);
    const { t } = useTranslation('translation', { keyPrefix: 'dialogs.EmoteRainDialog' });
    const twitch = useTwitch();
    const user = useAuth();

    useEffect(() => {
        async function loadGif() {
            const gif = await getRandomGifByLibrary('level3Reactions');

            setGif(gif.val());
        }

        async function checkFollowStatus() {
            const isFollower = await isUserFollowing(twitch.viewer.id, user.twitchExtensionData.channelId, user.twitchExtensionData.helixToken);

            setIsFollower(isFollower);
        }

        if (user && user.twitchExtensionData && user.twitchExtensionData.channelId && user.twitchExtensionData.helixToken) {
            loadGif();
            checkFollowStatus();
        }
    }, [user]);

    const renderEmoteSection = (emoteCategory, key) => {
        let locked = false;

        /* Only allow user to user emotes who have unlocked on the channel (by follow or subscriptions)
         * Bits are unlocked by default because the user sending the reaction is sending it with bits
         */
        switch (key) {
            case 'follower':
                locked = !isFollower;
                break;
            case 'subTier1':
                locked = !twitch.viewer.subscriptionStatus;
                break;
            case 'subTier2':
                locked = !twitch.viewer.subscriptionStatus || twitch.viewer.subscriptionStatus < 2000;
                break;
            case 'subTier3':
                locked = !twitch.viewer.subscriptionStatus || twitch.viewer.subscriptionStatus < 3000;
                break;
            default:
                break;
        }

        return (emoteCategory.map((emote) => (
            <ImageListItem key={emote.id} style={{
                    cursor: 'pointer',
                    opacity: locked ? .4 : 1
                }}
                onClick={() => locked ? null : onEmoteSelected(emote.images.url_4x)}>
                <img src={`${emote.images.url_2x}?w=56&h=56&fit=crop&auto=format`}
                    alt='Giphy text'
                    loading='lazy' />
                {locked &&
                    <LockedIcon>
                        <Lock />
                    </LockedIcon>
                }
            </ImageListItem>
        )));
    }

    return (
        <Dialog open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent'
                }
            }}
            fullWidth
            fullScreen>
            <EmoteRainContainer>
                <HeaderContainer>
                    <CloseIconButton onClick={onClose}>
                        <Close />
                    </CloseIconButton>
                    <HeaderText>
                        <span role='img' aria-label='Title'>
                            Let it rain 👇
                        </span>
                    </HeaderText>
                </HeaderContainer>
                <GifContainer>
                    <img src={gif} style={{
                        width: '100%',
                        borderRadius: '25px'
                    }} alt='Streamer Emote' />
                </GifContainer>
                <EmotesListContainer>
                    {Object.keys(emotes)
                        .filter((emoteCategory) => emotes[emoteCategory].data[0].length > 0)
                        .map((emoteCategory) => (
                        <React.Fragment key={emoteCategory}>
                            <EmoteCategoryTitle>
                                {t(emotes[emoteCategory].key)}
                            </EmoteCategoryTitle>
                            <ImageList cols={5} gap={32}>
                                {renderEmoteSection(emotes[emoteCategory].data[0], emotes[emoteCategory].key)}
                            </ImageList>
                        </React.Fragment>
                    ))}
                </EmotesListContainer>
            </EmoteRainContainer>
        </Dialog>
    );
}

export default EmoteRainDialog;