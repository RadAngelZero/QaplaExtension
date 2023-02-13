import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import styled from '@emotion/styled';
// import { useTranslation } from 'react-i18next';

import { emoteExplosion, emoteTunnel, startEmoteFireworks, startEmoteRain, startMatterEngine } from '../utilities/OverlayEmotesAnimation';

import { ReactComponent as CloseIcon } from '../assets/Icons/Close.svg';

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

const FullScreenEmoteAnimationDialog = ({ open, onClose }) => {

    const emoteExplosionContainer = useRef();
    const emoteTunelContainer = useRef();
    const matterjsContainerRain = useRef();
    const matterjsContainerFireworks = useRef();
    const matterjsEngineRain = useRef();
    const matterjsEngineFireworks = useRef();

    useEffect(() => {
        setTimeout(() => {
            startMatterEngine(matterjsContainerRain, matterjsEngineRain, 222, 222);
            startMatterEngine(matterjsContainerFireworks, matterjsEngineFireworks, 222, 222);
            startEmoteRain(matterjsEngineRain.current, ['https://static-cdn.jtvnw.net/emoticons/v2/304489309/static/light/3.0', 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_291135bb36d24d33bf53860128b5095c/static/light/3.0'], 9999, 222, 222, 0.4);
            startEmoteFireworks(matterjsEngineFireworks.current, ['https://static-cdn.jtvnw.net/emoticons/v2/304489309/static/light/3.0', 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_291135bb36d24d33bf53860128b5095c/static/light/3.0'], 9999, 222, 222, 0.2)
            emoteExplosion(emoteExplosionContainer.current, ['https://static-cdn.jtvnw.net/emoticons/v2/304489309/static/light/3.0', 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_291135bb36d24d33bf53860128b5095c/static/light/3.0'], 222, 222);
            emoteTunnel(emoteTunelContainer.current, ['https://static-cdn.jtvnw.net/emoticons/v2/304489309/static/light/3.0', 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_291135bb36d24d33bf53860128b5095c/static/light/3.0'], 10);
            setInterval(() => {
                emoteExplosion(emoteExplosionContainer.current, ['https://static-cdn.jtvnw.net/emoticons/v2/304489309/static/light/3.0', 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_291135bb36d24d33bf53860128b5095c/static/light/3.0'], 222, 222);
            }, 3000);
            setInterval(() => {
                emoteTunnel(emoteTunelContainer.current, ['https://static-cdn.jtvnw.net/emoticons/v2/304489309/static/light/3.0', 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_291135bb36d24d33bf53860128b5095c/static/light/3.0'], 10);
            }, 12000);

        }, 50);
    }, []);

    return (
        <BigDialog open={open}
            onClose={onClose}
        >
            <HeaderContainer>
                <CloseIcon style={{ marginRight: '-40px', cursor: 'pointer' }} onClick={onClose}/>
                <Title>Full Screen Emote Animations</Title>
            </HeaderContainer>
            <DeqContainer>
                <DeqButton id='matterjs-container-rain' ref={matterjsContainerRain}>
                    <canvas width={222} height={222} id='matterjs-canvas-rain' style={{ position: 'absolute', borderRadius: '20px', overflow: 'hidden' }}>

                    </canvas>
                    <DeqText>💧 Rain</DeqText>
                </DeqButton>
                <DeqButton id='matterjs-container-fireworks' ref={matterjsContainerFireworks}>
                    <canvas width={222} height={222} id='matterjs-canvas-fireworks' style={{ position: 'absolute', borderRadius: '20px', overflow: 'hidden' }}>

                    </canvas>
                    <DeqText>🎆 Fireworks</DeqText>
                </DeqButton>
                <DeqButton>
                    <div id='emote-explosion-container' ref={emoteExplosionContainer} style={{ overflow: 'hidden', width: '222px', height: '222px', position: 'absolute', borderRadius: '20px' }}></div>
                    <DeqText>💣 Bomb</DeqText>
                </DeqButton>
                <DeqButton>
                    <div id='emote-tunel-container' style={{ overflow: 'hidden', width: '222px', height: '222px', position: 'absolute', borderRadius: '20px' }} ref={emoteTunelContainer}></div>
                    <DeqText>🌀 Warp</DeqText>
                </DeqButton>
            </DeqContainer>
        </BigDialog>
    )
}

export default FullScreenEmoteAnimationDialog;