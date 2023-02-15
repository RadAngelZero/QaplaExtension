import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Dialog, Tooltip, Typography, tooltipClasses, ImageList } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import { isUserFollowing } from '../services/twitch';

import {
    emoteExplosion,
    emoteTunnel,
    generateDrop,
    manageWind,
    resetEngine,
    spawnFirework,
    startEmoteFireworks,
    startEmoteRain,
    startMatterEngine
} from '../utilities/OverlayEmotesAnimation';

import { ReactComponent as CloseIcon } from '../assets/Icons/Close.svg';
import { ReactComponent as ArrowDown } from '../assets/Icons/ArrowDown.svg';
import { ReactComponent as BackIcon } from '../assets/Icons/Back.svg';
import { ReactComponent as CheckCircle } from '../assets/Icons/CheckCircle.svg';
import { ReactComponent as Lock } from './../assets/Icons/Lock.svg';

import { useTwitch } from '../hooks/TwitchProvider';
import { useAuth } from '../hooks/AuthProvider';
import { EMOTE_EXPLOSION, EMOTE_FIREWORKS, EMOTE_RAIN, EMOTE_TUNNEL } from '../constants';

const emoteAnimationsData = [
    {
        id: EMOTE_RAIN,
        display: '💧 Rain'
    },
    {
        id: EMOTE_FIREWORKS,
        display: '🎆 Fireworks'
    },
    {
        id: EMOTE_EXPLOSION,
        display: '💣 Bomb'
    },
    {
        id: EMOTE_TUNNEL,
        display: '🌀 Warp'
    },
]

const emotesData = [
    {
        sectionHeader: 'Followers',
        emotes: [
            {
                id: 'furious-mustache',
                url: 'https://static-cdn.jtvnw.net/emoticons/v2/304489309/static/light/3.0'
            },
            {
                id: 'camping',
                url: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_291135bb36d24d33bf53860128b5095c/static/light/3.0'
            },
            {
                id: 'furious-mustache',
                url: 'https://static-cdn.jtvnw.net/emoticons/v2/304489309/static/light/3.0'
            },
            {
                id: 'camping',
                url: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_291135bb36d24d33bf53860128b5095c/static/light/3.0'
            },
            {
                id: 'furious-mustache',
                url: 'https://static-cdn.jtvnw.net/emoticons/v2/304489309/static/light/3.0'
            },
            {
                id: 'camping',
                url: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_291135bb36d24d33bf53860128b5095c/static/light/3.0'
            },
            {
                id: 'furious-mustache',
                url: 'https://static-cdn.jtvnw.net/emoticons/v2/304489309/static/light/3.0'
            },
            {
                id: 'camping',
                url: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_291135bb36d24d33bf53860128b5095c/static/light/3.0'
            },
            {
                id: 'furious-mustache',
                url: 'https://static-cdn.jtvnw.net/emoticons/v2/304489309/static/light/3.0'
            },
            {
                id: 'camping',
                url: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_291135bb36d24d33bf53860128b5095c/static/light/3.0'
            },
        ],
    },
    {
        sectionHeader: 'Tier 1',
        emotes: [
            {
                id: 'cool-cat',
                url: 'https://static-cdn.jtvnw.net/emoticons/v2/58127/default/dark/1.0'
            },
            {
                id: 'kappa',
                url: 'https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/1.0'
            },
        ],
    }
]

const BigDialog = styled(Dialog)({
    '.MuiDialog-root': {
        // width: '100%',
    },
    '.MuiDialog-container': {
        // width: '100%',
        // padding: '0',
    },
    '.MuiDialog-paper': {
        background: '#141539',
        width: '100vw',
        height: '100%',
        margin: 0,
        maxHeight: '100%',
        borderRadius: '0px',
        borderTopLeftRadius: '42px',
        borderTopRightRadius: '42px',
        marginTop: '18%',
        padding: '30px 24px',
        webkitBoxSizing: 'border-box',
        mozBoxSizing: 'border-box',
        boxSizing: 'border-box',
    },
});

const HeaderContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
});

const Title = styled(Typography)({
    color: '#fff',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '24px',
    textAlign: 'center',
    margin: '0px auto',
});

const DeqContainer = styled(Box)({
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    marginTop: '50px',
});

const DeqButton = styled(Box)({
    background: 'linear-gradient(135deg ,#3B4BF9, #8C46FF)',
    display: 'flex',
    flex: 1,
    flexBasis: '30%',
    aspectRatio: '1',
    borderRadius: '20px',
    justifyContent: 'center',
    alignItems: 'flex-end',
    webkitBoxSizing: 'border-box',
    mozBoxSizing: 'border-box',
    boxSizing: 'border-box',
    cursor: 'pointer',
    overflow: 'hidden',
});

const DeqText = styled(Typography)({
    color: '#fff',
    fontSize: '18px',
    fontWeight: '500',
    lineHeight: '22px',
    letterSpacing: '0px',
    textAlign: 'center',
    marginBottom: '15px',
});

const EmotePreview = styled(Box)({
    display: 'flex',
    marginTop: '44px',
    width: '100%',
    minHeight: '220px',
    borderRadius: '20px',
    backgroundColor: '#000',
});

const EmoteAnimationDropdownButton = styled(Box)({
    display: 'flex',
    gap: '4px',
    margin: 'auto 24px 24px auto',
    cursor: 'pointer',
    borderRadius: '8px',
    padding: '4px',
    webkitBoxSizing: 'border-box',
    mozBoxSizing: 'border-box',
    boxSizing: 'border-box',
    zIndex: '1000',
    '&:hover': {
        backgroundColor: '#fff4',
    }
});

const EmoteAnimationDropdownButtonText = styled(Typography)({
    color: '#fff',
    fontSize: '18px',
    fontWeight: '500',
    lineHeight: '24px',
});

const EmoteAnimationDropdown = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#1C1E64',
        padding: '24px',
        borderRadius: '20px',
        display: 'flex',
        transform: 'translate(0px, -60px) !important',
    },
}));

const EmoteAnimationList = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
});

const EmoteAnimationListOptionContainer = styled(Box)({
    display: 'flex',
    cursor: 'pointer',
});

const EmoteAnimationListOptionText = styled(Typography)({
    color: '#fff',
    fontSize: '18px',
    fontWeight: '500',
    lineHeight: '22px',
});

const EmotesScrollContainer = styled(Box)({
    marginTop: '44px',
    backgroundColor: '#141539',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
        display: 'none',
    }
});

const EmoteSection = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
});
const EmoteSectionHeader = styled(Typography)({
    color: '#fff',
    fontSize: '20px',
    fontWeight: '500',
    lineHeight: '24px',
    marginBottom: '22px',
});

const EmotesContainer = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '22px 0px'
});

const EmoteContainer = styled(Box)({
    display: 'flex',
    flexBasis: '16.66%',
    width: '56px',
    height: '56px',
});

const EmoteImg = styled('img')({
    width: '56px',
    height: '56px',
    cursor: 'pointer',
    backgroundColor: '#0000',
    borderRadius: '8px',
});

const ConfirmButton = styled(Button)({
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
    bottom: '64px',
    backgroundColor: '#00FFDD',
    textTransform: 'none',
    padding: '16px 24px',
    borderRadius: '100px',
    color: '#0D1022',
    boxShadow: '0px 8px 30px rgba(0, 255, 221, 0.25)',
    fontSize: '20px',
    fontWeight: '600',
    color: '#0D1022',
    '&:hover': {
        backgroundColor: '#00FFDD',
        opacity: 1,
    },
});

const LockedIcon = styled(Box)({
    position: 'absolute',
    bottom: '0px',
    right: '-3px'
});

const FullScreenEmoteAnimationDialog = ({ open, onClose, emotes, randomEmoteUrl, onEmoteAnimationSelected }) => {
    const [emoteExplosionInterval, setEmoteExplosionInterval] = useState(null);
    const [emoteTunnelInterval, setEmoteTunnelInterval] = useState(null);
    const [emoteAnimationPreviewInterval, setEmoteAnimationPreviewInterval] = useState(null);
    const [openEmoteAnimationList, setOpenEmoteAnimationList] = useState(false);
    const [isFollower, setIsFollower] = useState(false);
    const [selectedAnimation, setSelectedAnimation] = useState(null);
    const [selectedEmotes, setSelectedEmotes] = useState([]);
    const emoteExplosionContainer = useRef();
    const emoteTunelContainer = useRef();
    const matterjsContainerRain = useRef();
    const matterjsContainerFireworks = useRef();
    const matterjsEngineRain = useRef();
    const matterjsEngineFireworks = useRef();
    const emotePreviewContainer = useRef();
    const matterjsPreviewContainer = useRef();
    const matterjsPreviewEngine = useRef();
    const user = useAuth();
    const twitch = useTwitch();
    const { t } = useTranslation('translation', { keyPrefix: 'dialogs.FullScreenEmoteAnimationDialog' });

    useEffect(() => {
        async function checkFollowStatus() {
            const isFollower = await isUserFollowing(twitch.viewer.id, user.twitchExtensionData.channelId, user.twitchExtensionData.helixToken);

            setIsFollower(isFollower);
        }

        if (user && user.twitchExtensionData && user.twitchExtensionData.channelId && user.twitchExtensionData.helixToken) {
            checkFollowStatus();
        }
    }, [user]);

    useEffect(() => {
        if (!open) return;
        clearIntervals();
        clearPreviewIntervals();
        if (!selectedAnimation)
            startDeqButtons();
        if (selectedAnimation)
            startPreview();
    }, [open, selectedAnimation]);

    const startDeqButtons = () => {
        setTimeout(() => {
            startMatterEngine(matterjsContainerRain.current, matterjsEngineRain, 222, 222);
            startMatterEngine(matterjsContainerFireworks.current, matterjsEngineFireworks, 222, 222);
            startEmoteRain(matterjsEngineRain.current, [randomEmoteUrl], 9999, 222, 222, 0.4);
            startEmoteFireworks(matterjsEngineFireworks.current, [randomEmoteUrl], 9999, 222, 222, 0.2)
            emoteExplosion(emoteExplosionContainer.current, [randomEmoteUrl], 222, 222);
            emoteTunnel(emoteTunelContainer.current, [randomEmoteUrl], 10);
            setEmoteExplosionInterval(setInterval(() => {
                emoteExplosion(emoteExplosionContainer.current, [randomEmoteUrl], 222, 222);
            }, 3000))
            setEmoteTunnelInterval(setInterval(() => {
                emoteTunnel(emoteTunelContainer.current, [randomEmoteUrl], 10);
            }, 12000))
        }, 50);
    }

    const clearIntervals = () => {
        clearInterval(emoteExplosionInterval);
        clearInterval(emoteTunnelInterval);
    };

    const startPreview = () => {
        setTimeout(() => {
            startMatterEngine(matterjsPreviewContainer.current, matterjsPreviewEngine, 467, 220);
            if (selectedAnimation === EMOTE_RAIN) {
                startEmoteRain(matterjsPreviewEngine.current, selectedEmotes.length > 0 ? selectedEmotes : [randomEmoteUrl], 9999, 467, 220, 0.4);
            }
            if (selectedAnimation === EMOTE_FIREWORKS) {
                startEmoteFireworks(matterjsPreviewEngine.current, selectedEmotes.length > 0 ? selectedEmotes : [randomEmoteUrl], 9999, 467, 220, 0.2);
            }
            if (selectedAnimation === EMOTE_EXPLOSION) {
                emoteExplosion(emotePreviewContainer.current, selectedEmotes.length > 0 ? selectedEmotes : [randomEmoteUrl], 467, 220);
                setEmoteAnimationPreviewInterval(setInterval(() => {
                    emoteExplosion(emotePreviewContainer.current, selectedEmotes.length > 0 ? selectedEmotes : [randomEmoteUrl], 467, 220);
                }, 3000));
            }
            if (selectedAnimation === EMOTE_TUNNEL) {
                emoteTunnel(emotePreviewContainer.current, selectedEmotes.length > 0 ? selectedEmotes : [randomEmoteUrl], 3, 'emote-preview-container');
                setEmoteAnimationPreviewInterval(setInterval(() => {
                    emoteTunnel(emotePreviewContainer.current, selectedEmotes.length > 0 ? selectedEmotes : [randomEmoteUrl], 3, 'emote-preview-container');
                }, 5000));
            }
        }, 50);
    };

    const clearPreviewIntervals = () => {
        clearTimeout(window.timeouts.generateDrop);
        clearTimeout(window.timeouts.manageWind);
        clearTimeout(window.timeouts.clearRain);
        clearTimeout(window.timeouts.spawnFirework);
        clearInterval(emoteAnimationPreviewInterval);
    }

    const handleEmoteAnimationChange = (animationName) => {
        try {
            setOpenEmoteAnimationList(false);
            setSelectedAnimation(animationName);
            resetEngine(matterjsPreviewEngine);
            clearPreviewIntervals();
            setTimeout(() => {
                startPreview();
            }, 100);
        } catch (error) {
            // It is normal if matter.js always triggers an error here, does not affects functionality of the extension
            console.log(error);
        }
    };

    const handleEmoteAdded = (emoteURL) => {
        let tempEmoteArr = [...selectedEmotes];
        if (selectedEmotes.includes(emoteURL)) {
            tempEmoteArr.splice(tempEmoteArr.findIndex((element) => element === emoteURL), 1);
        } else {
            tempEmoteArr.push(emoteURL);
        }

        setSelectedEmotes(tempEmoteArr);
        clearPreviewIntervals();

        switch (selectedAnimation) {
            case EMOTE_RAIN:
                generateDrop(matterjsPreviewEngine.current, tempEmoteArr.length > 0 ? tempEmoteArr : [randomEmoteUrl], 9999, 0, 467, 0.4);
                manageWind(matterjsPreviewEngine.current, 9999, 0);
                break;
            case EMOTE_FIREWORKS:
                spawnFirework(matterjsPreviewEngine.current, tempEmoteArr.length > 0 ? tempEmoteArr : [randomEmoteUrl], 9999, 0, 467, 220, 0.2);
                break;
            case EMOTE_EXPLOSION:
                emoteExplosion(emotePreviewContainer.current, tempEmoteArr.length > 0 ? tempEmoteArr : [randomEmoteUrl], 467, 220);
                setEmoteAnimationPreviewInterval(setInterval(() => {
                    emoteExplosion(emotePreviewContainer.current, tempEmoteArr.length > 0 ? tempEmoteArr : [randomEmoteUrl], 467, 220);
                }, 3000));
                break;
            case EMOTE_TUNNEL:
                emoteTunnel(emotePreviewContainer.current, tempEmoteArr.length > 0 ? tempEmoteArr : [randomEmoteUrl], 3, 'emote-preview-container');
                setEmoteAnimationPreviewInterval(setInterval(() => {
                    emoteTunnel(emotePreviewContainer.current, tempEmoteArr.length > 0 ? tempEmoteArr : [randomEmoteUrl], 3, 'emote-preview-container');
                }, 5000));
                break;
            default:
                break;
        }
    };

    const backHandler = () => {
        clearPreviewIntervals();
        setSelectedEmotes([]);
        setSelectedAnimation(null);
    }

    const closeHandler = () => {
        clearIntervals();
        clearPreviewIntervals();
        onClose();
    }

    const confirmHandler = () => {
        onEmoteAnimationSelected(selectedEmotes, selectedAnimation);
        setSelectedEmotes([]);
        setSelectedAnimation(null);
        clearPreviewIntervals();
        onClose();
    }

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
                locked = !twitch.viewer.subscriptionStatus || twitch.viewer.subscriptionStatus.tier < 2000;
                break;
            case 'subTier3':
                locked = !twitch.viewer.subscriptionStatus || twitch.viewer.subscriptionStatus.tier < 3000;
                break;
            default:
                break;
        }

        return (emoteCategory.map((emote) => (
            <EmoteContainer>
                <EmoteImg src={emote.images.url_4x}
                    key={`emote-${emote.id}`}
                    onClick={(event) => {
                    if (!locked) {
                        if (selectedEmotes.length >= 3 && !selectedEmotes.includes(emote.images.url_4x))
                            return event.currentTarget.classList.add('negate-emote');
                        handleEmoteAdded(emote.images.url_4x);
                    }
                }}
                onAnimationEnd={(event) => {
                    event.currentTarget.classList.remove('negate-emote');
                }} />
                {locked &&
                    <LockedIcon>
                        <Lock />
                    </LockedIcon>
                }
                {selectedEmotes.includes(emote.images.url_4x) &&
                    <CheckCircle style={{
                        width: '22px',
                        height: '22px',
                        marginLeft: '-22px',
                    }} />
                }
            </EmoteContainer>
        )));
    }

    return (
        <BigDialog open={open}
            onClose={closeHandler}>
            <HeaderContainer>
                {selectedAnimation ?
                    <BackIcon style={{ marginRight: '-40px', cursor: 'pointer' }} onClick={backHandler} />
                    :
                    <CloseIcon style={{ marginRight: '-40px', cursor: 'pointer' }} onClick={closeHandler} />
                }
                <Title>{selectedAnimation ? t('chooseEmotes') : t('fullScreenAnimations')}</Title>
            </HeaderContainer>
            {selectedAnimation ?
                <>
                    <style>{`
                        .negate-emote{
                            animation-name: negate-background;
                            animation-duration: 0.5s;
                        }

                        @keyframes negate-background{
                            0% {
                                background-color: #0000;
                            }
                            50% {
                                background-color: #c00f;
                            }
                            100% {
                                background-color: #0000;
                            }
                        }
                    `}</style>
                    <EmotePreview>
                        <div ref={matterjsPreviewContainer}>
                            <canvas height={220} width={467} style={{ position: 'absolute', borderRadius: '20px', overflow: 'hidden' }}></canvas>
                        </div>
                        <div id='emote-preview-container' ref={emotePreviewContainer} style={{ overflow: 'hidden', width: '467px', height: '220px', position: 'absolute', borderRadius: '20px' }}></div>
                        <EmoteAnimationDropdown placement="bottom" open={openEmoteAnimationList} onClose={() => setOpenEmoteAnimationList(false)} title={
                            <React.Fragment>
                            <EmoteAnimationList>
                                <EmoteAnimationListOptionContainer onClick={() => setOpenEmoteAnimationList(false)}>
                                    <EmoteAnimationListOptionText>
                                        {emoteAnimationsData[emoteAnimationsData.findIndex((element) => element.id === selectedAnimation)].display}
                                    </EmoteAnimationListOptionText>
                                    <ArrowDown style={{ rotate: '180deg', marginLeft: '15px' }} />
                                </EmoteAnimationListOptionContainer>
                                {emoteAnimationsData.map((element) => (
                                    element.id !== selectedAnimation ?
                                        <EmoteAnimationListOptionContainer onClick={() => {
                                            handleEmoteAnimationChange(element.id);
                                        }}>
                                            <EmoteAnimationListOptionText>
                                                {element.display}
                                            </EmoteAnimationListOptionText>
                                        </EmoteAnimationListOptionContainer>
                                    :
                                        null
                                ))}
                            </EmoteAnimationList>
                            </React.Fragment>
                        }>
                            <EmoteAnimationDropdownButton onClick={() => setOpenEmoteAnimationList(true)}>
                                <EmoteAnimationDropdownButtonText>
                                    {emoteAnimationsData[emoteAnimationsData.findIndex((element) => element.id === selectedAnimation)].display}
                                </EmoteAnimationDropdownButtonText>
                                <ArrowDown />
                            </EmoteAnimationDropdownButton>
                        </EmoteAnimationDropdown>
                    </EmotePreview>
                    <EmotesScrollContainer>
                        {Object.keys(emotes)
                            .filter((emoteCategory) => emotes[emoteCategory].data[0].length > 0)
                            .map((emoteCategory) => (
                            <React.Fragment key={emoteCategory}>
                                <EmoteSectionHeader>
                                    {t(emotes[emoteCategory].key)}
                                </EmoteSectionHeader>
                                <ImageList cols={5} gap={32} style={{
                                    marginBottom: '32px'
                                }}>
                                    {renderEmoteSection(emotes[emoteCategory].data[0], emotes[emoteCategory].key)}
                                </ImageList>
                            </React.Fragment>
                        ))}
                        <div style={{ height: '18%' }} />
                    </EmotesScrollContainer>
                    {selectedEmotes.length > 0 &&
                        <ConfirmButton onClick={confirmHandler}>
                            {t('confirm')}
                        </ConfirmButton>
                    }
                </>
                :
                <DeqContainer>
                    <DeqButton id='matterjs-container-rain' ref={matterjsContainerRain} onClick={() => {
                        setSelectedAnimation(EMOTE_RAIN);
                        clearIntervals();
                        startPreview(EMOTE_RAIN);
                    }}>
                        <canvas width={222} height={222} id='matterjs-canvas-rain' style={{ position: 'absolute', borderRadius: '20px', overflow: 'hidden' }}>

                        </canvas>
                        <DeqText>💧 Rain</DeqText>
                    </DeqButton>
                    <DeqButton id='matterjs-container-fireworks' ref={matterjsContainerFireworks} onClick={() => {
                        setSelectedAnimation(EMOTE_FIREWORKS);
                        clearIntervals();
                        startPreview(EMOTE_FIREWORKS);
                    }}>
                        <canvas width={222} height={222} id='matterjs-canvas-fireworks' style={{ position: 'absolute', borderRadius: '20px', overflow: 'hidden' }}>

                        </canvas>
                        <DeqText>🎆 Fireworks</DeqText>
                    </DeqButton>
                    <DeqButton onClick={() => {
                        setSelectedAnimation(EMOTE_EXPLOSION);
                        clearIntervals();
                        startPreview(EMOTE_EXPLOSION);
                    }}>
                        <div id='emote-explosion-container' ref={emoteExplosionContainer} style={{ overflow: 'hidden', width: '222px', height: '222px', position: 'absolute', borderRadius: '20px' }}></div>
                        <DeqText>💣 Bomb</DeqText>
                    </DeqButton>
                    <DeqButton onClick={() => {
                        setSelectedAnimation(EMOTE_TUNNEL);
                        clearIntervals();
                        startPreview(EMOTE_TUNNEL);
                    }}>
                        <div id='emote-tunel-container' style={{ overflow: 'hidden', width: '222px', height: '222px', position: 'absolute', borderRadius: '20px' }} ref={emoteTunelContainer}></div>
                        <DeqText>🌀 Warp</DeqText>
                    </DeqButton>
                </DeqContainer>
            }
        </BigDialog>
    );
}

export default FullScreenEmoteAnimationDialog;