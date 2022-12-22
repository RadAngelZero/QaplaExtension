import React, { useEffect, useState } from 'react';
import { Box, Dialog, IconButton } from '@mui/material';
import styled from '@emotion/styled';

import { ReactComponent as Close } from './../assets/Icons/Close.svg';
import { ReactComponent as CheckCircleWhite } from './../assets/Icons/CheckCircleWhite.svg';
import { ReactComponent as TTSBot } from './../assets/Icons/TTSBot.svg';
import { getAvailableBotVoices } from '../services/database';

const VoiceSelectorContainer = styled(Box)({
    marginTop: 'auto',
    minHeight: '10vh',
    background: '#141539',
    borderTopLeftRadius: '30px',
    borderTopRightRadius: '30px',
    padding: '24px 26px',
});

const HeaderContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '16px'
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

const BotVoiceContainer = styled(Box)({
    display: 'flex',
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer'
});

const BotVoicePill = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10px',

    height: '56px',
    width: '248px',

    background: 'linear-gradient(93.1deg, #4301FF 0%, #9F01FA 100%)',
    borderRadius: '1000px',
});

const BotVoiceInnerContainer = styled(Box)({
    display: 'flex',
    flex: 1,
    margin: '3px',
    padding: '13px 21px',
    borderRadius: '1000px',
    alignItems: 'center',
    flexDirection: 'row',
});

const BotVoiceText = styled('p')({
    color: '#fff',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '24px',
    letterSpacing: '0px',
    textAlign: 'left',
    margin: '0'
});

const CheckCircleContainer = styled(Box)({
    display: 'flex',
    marginLeft: '32px',
});

const BotVoiceSideIconsContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '15px',
});

const BotVoice = ({ label, selected, onPress }) => {
    return (
        <BotVoiceContainer>
            <BotVoicePill onClick={onPress}>
                <BotVoiceInnerContainer style={{ backgroundColor: selected ? 'transparent' : '#141539' }}>
                    <BotVoiceText>
                        {label}
                    </BotVoiceText>
                    {selected &&
                        <CheckCircleContainer>
                            <CheckCircleWhite />
                        </CheckCircleContainer>
                    }
                </BotVoiceInnerContainer>
            </BotVoicePill>
            <BotVoiceSideIconsContainer>
                <BotVoiceText style={{ marginRight: '8px' }}>
                    <span role='img' aria-label='Bot icon'>
                        🤖
                    </span>
                </BotVoiceText>
                <TTSBot />
            </BotVoiceSideIconsContainer>
        </BotVoiceContainer>
    );
}

const ReactionTierSelectorDialog = ({ open, onClose, onVoiceSelected, currentVoice }) => {
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        async function fetchVoices() {
            const voices = await getAvailableBotVoices();
            const voicesArray = [];
            voices.forEach((voice) => {
                if (!voice.val().default) {
                    voicesArray.push({
                        ...voice.val(),
                        key: voice.key
                    });
                }
            });

            setVoices(voicesArray);
        }

        fetchVoices();
    }, []);

    const voiceSelected = (voiceData) => {
        onVoiceSelected(voiceData);
        onClose();
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
            <VoiceSelectorContainer>
                <HeaderContainer>
                    <CloseIconButton onClick={onClose}>
                        <Close />
                    </CloseIconButton>
                    <HeaderText>
                        {`Choose a TTS Bot Voice`}
                    </HeaderText>
                </HeaderContainer>
                <BotVoice label={'Google (Default)'}
                    selected={currentVoice === null}
                    onPress={() => voiceSelected(null)} />
                {voices.map((voice) => (
                    <BotVoice key={voice.key}
                        label={voice.key}
                        selected={currentVoice === voice.key}
                        onPress={() => voiceSelected(voice)} />
                ))}
            </VoiceSelectorContainer>
        </Dialog>);
}

export default ReactionTierSelectorDialog;