import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Avatar, Box, Button, ClickAwayListener, IconButton, TextField, Typography } from '@mui/material';
import Tooltip from 'react-power-tooltip'

import { ReactComponent as Interactions } from './../../assets/Icons/Interactions.svg';
import { ReactComponent as Gif } from './../../assets/Icons/GIF.svg';
import { ReactComponent as Meme } from './../../assets/Icons/Memes.svg';
import { ReactComponent as Sticker } from './../../assets/Icons/Sticker.svg';
import { ReactComponent as PlusCircle } from './../../assets/Icons/PlusCircle.svg';
import { ReactComponent as Close } from './../../assets/Icons/Close.svg';
import { ReactComponent as CheckCircle } from './../../assets/Icons/CheckCircle.svg';
import { ReactComponent as GiphyText } from './../../assets/Icons/GiphyText.svg';
import { ReactComponent as TTSVoice } from './../../assets/Icons/VolumeUp.svg';
import { CUSTOM_TTS_VOICE, EMOTE, GIPHY_GIFS, GIPHY_STICKERS, GIPHY_TEXT, MEMES } from '../../constants';

const allMediaOptionsTypes = [
    GIPHY_GIFS,
    GIPHY_STICKERS,
    MEMES,
    EMOTE,
    GIPHY_TEXT,
    CUSTOM_TTS_VOICE
];

const mediaOptionsData = {
    [GIPHY_GIFS]: {
        Icon: Gif,
        label: 'gif',
        level: 1
    },
    [GIPHY_STICKERS]: {
        Icon: Sticker,
        label: 'sticker',
        level: 1
    },
    [MEMES]: {
        Icon: Meme,
        label: 'meme',
        level: 1
    },
    [EMOTE]: {
        label: 'emote',
        level: 3
    },
    [GIPHY_TEXT]: {
        Icon: GiphyText,
        label: '3D Text',
        level: 2
    },
    [CUSTOM_TTS_VOICE]: {
        Icon: TTSVoice,
        label: 'TTS Voice',
        level: 2
    }
};

const excludingOptions = {
    [GIPHY_GIFS]: {
        [GIPHY_STICKERS]: true,
        [MEMES]: true
    },
    [GIPHY_STICKERS]: {
        [GIPHY_GIFS]: true,
        [MEMES]: true
    },
    [MEMES]: {
        [GIPHY_GIFS]: true,
        [GIPHY_STICKERS]: true
    },
};

const Container = styled(Box)({
    paddingTop: '56px',
    height: '100vh',
    width: '100%',
    webkitBoxSizing: 'border-box',
    mozBoxSizing: 'border-box',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column'
});

const ContentContainer = styled(Box)({
    paddingLeft: '24px',
    paddingRight: '24px',
    display: 'flex',
    flexDirection: 'column',
    display: 'flex',
    flex: 1
});

const TTSContainer = styled(Box)({
    display: 'flex'
});

const AvatarImage = styled(Avatar)({
    height: '56px',
    width: '56px'
});

const MessageContainer = styled(Box)({
    marginLeft: '16px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
});

const MessageInput = styled(TextField)({
    padding: 0,
    border: 'none'
});

const OptionalLabel = styled(Typography)({
    marginTop: '4px',
    color: '#7BB0FF',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '19px'
});

const SelectedMediaContainer = styled(Box)({
    width: 'fit-content',
    paddingLeft: '72px',
    display: 'flex',
    flex: 1,
    position: 'relative'
});

const SelectedMediaImage = styled(Box)((props) => ({
    width: 'fit-content',
    height: 'fit-content',
    maxWidth: '100%',
    objectFit: 'contain',
    maxHeight: '250px',
    aspectRatio: `${props.aspectratio} / 1`,
    borderRadius: '20px'
}));

const CloseIconButton = styled(IconButton)({
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.253621)',
    padding: 0
});

const ActionsContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
});

const PricesButton = styled(Button)({
    background: '#1C1E64',
    padding: '12px 24px',
    borderRadius: '14px',
    fontSize: '20px',
    fontWeight: '800',
    color: '#FFF',
    '&:hover': {
        background: '#1C1E64',
        opacity: .8
    }
});

const SendButton = styled(Button)({
    background: '#00FFDD',
    padding: '12px 24px',
    borderRadius: '100px',
    boxShadow: '0px 5px 30px -12.4441px rgba(0, 255, 221, 0.2)',
    fontSize: '20px',
    fontWeight: '600',
    color: '#0D1021',
    '&:hover': {
        background: '#00FFDD',
        opacity: .8
    }
});

const MediaSelectionContainer = styled(Box)({
    marginTop: '16px',
    background: '#141539',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between'
});

const MediaOptionsContainer = styled(Box)({
    display: 'flex',
    gap: '16px',
    padding: '8px 0px'
});

const MediaOptionButton = styled(IconButton)({
    padding: 0,
    position: 'relative',
    '&:disabled': {
        opacity: .2
    }
});

const TooltipText = styled(Typography)({
    fontSize: '16px',
    fontWeight: '800',
    color: '#FFF'
});

const HighlightedText = styled('span')({
    color: '#00FFDD'
});

const TooltipButtonContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '0 !important',
    paddingBottom: '24px !important'
});

const TooltipButton = styled(Button)({
    alignSelf: 'flex-end',
    backgroundColor: '#141735 !important',
    padding: '12px 24px !important',
    color: '#FFF',
    fontSize: '16px',
    fontWeight: '700',
    borderRadius: '100px'
});

const TipButton = styled(Button)({
    background: '#3B4BF9',
    borderRadius: '100px',
    padding: '12px 24px',
    fontSize: '20px',
    fontWeight: '600',
    color: '#FFF',
    '&:hover': {
        background: '#3B4BF9',
        opacity: .8
    }
});

const MediaOptionSelectedIcon = () => {
    return (
        <CheckCircle style={{
            position: 'absolute',
            top: -4,
            right: -8
        }} />
    );
}

const MediaOption = ({ type, disabled = false, excluded = false, onClick, isSelected, emoteUrl = null, tooltipText, tooltipHighlightedText }) => {
    const mediaOptionData = mediaOptionsData[type];
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
            <MediaOptionButton onClick={() => !disabled && !excluded ? onClick(type) : setShowTooltip(true)}
                active={!disabled && !excluded}>
                <Tooltip show={showTooltip}
                    position='top center'
                    backgroundColor='#3B4BF9'
                    color='#FFF'
                    alert='rgb(0, 255, 221)'
                    padding='16px 24px 32px 16px'
                    textBoxWidth='314px'
                    borderRadius='15px'>
                    <TooltipText>
                        {tooltipText}
                        <HighlightedText>
                            {tooltipHighlightedText}
                        </HighlightedText>
                    </TooltipText>
                    <TooltipButtonContainer>
                        <TooltipButton>
                            Upgrade Reaction
                        </TooltipButton>
                    </TooltipButtonContainer>
                </Tooltip>
                {isSelected &&
                    <MediaOptionSelectedIcon />
                }
                {type === EMOTE ?
                    emoteUrl ?
                        <img source={emoteUrl ? { uri: emoteUrl } : null}
                            style={{ height: 24, width: 24 }} />
                        :
                        null
                    :
                    <mediaOptionData.Icon height={24} width={24} />
                }
            </MediaOptionButton>
        </ClickAwayListener>
    );
}

const TweetReactionView = ({
    onMediaOptionClick,
    selectedMedia,
    cleanSelectedMedia,
    mediaSelectorBarOptions,
    custom3DText,
    voiceBot,
    emoteRaid
}) => {
    const isMediaOptionSelected = (mediaType) => {
        switch (mediaType) {
            case GIPHY_GIFS:
            case GIPHY_STICKERS:
            case MEMES:
                return selectedMedia && selectedMedia.type === mediaType;
            case GIPHY_TEXT:
                return Boolean(custom3DText).valueOf();
            case CUSTOM_TTS_VOICE:
                return Boolean(voiceBot).valueOf();
            case EMOTE:
                return Boolean(emoteRaid).valueOf();
            default:
                return false;
        }
    }

    return (
        <Container>
            <ContentContainer>
                <TTSContainer>
                    <AvatarImage
                        src='https://static-cdn.jtvnw.net/jtv_user_pictures/ac4d7937-4dd8-47b8-8e15-d3226f1405b3-profile_image-300x300.png' />
                    <MessageContainer>
                        <MessageInput variant='standard'
                            InputProps={{
                                disableUnderline: true,
                                style: {
                                    color: '#FFF',
                                    "&::placeholder": {
                                       color: '#C2C2C2'
                                    },
                                    padding: 0
                                }
                            }}
                            inputProps={{ maxLength: 100 }}
                            multiline
                            placeholder='Type to create TTS'
                            fullWidth
                            autoFocus />
                        <OptionalLabel>
                            Optional
                        </OptionalLabel>
                    </MessageContainer>
                </TTSContainer>
                <SelectedMediaContainer>
                    {selectedMedia &&
                        <>
                        <SelectedMediaImage component='img'
                            src={selectedMedia.url}
                            aspectratio={selectedMedia.width / selectedMedia.height} />
                            <CloseIconButton onClick={cleanSelectedMedia}>
                                <Close style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px'
                                }} />
                            </CloseIconButton>
                        </>
                    }
                </SelectedMediaContainer>
                <ActionsContainer>
                    <PricesButton startIcon={<Interactions />}>
                        1
                    </PricesButton>
                    <SendButton>
                        Send
                    </SendButton>
                </ActionsContainer>
            </ContentContainer>
            <MediaSelectionContainer>
                <MediaOptionsContainer>
                    {mediaSelectorBarOptions.map((mediaType) => (
                        <MediaOption key={mediaType}
                            onClick={(type) => onMediaOptionClick(type)}
                            type={mediaType}
                            isSelected={isMediaOptionSelected(mediaType)}
                            excluded={selectedMedia && excludingOptions[selectedMedia.type] && excludingOptions[selectedMedia.type][mediaType]}
                            onOpenTooltip={(e) => console.log(e)}
                            tooltipText='👀 Upgrade your reaction to use'
                            tooltipHighlightedText='Animated Avatar, TTS Bot Voice & 3D Text' />
                    ))}
                </MediaOptionsContainer>
                <TipButton startIcon={<PlusCircle />}>
                    Tip
                </TipButton>
            </MediaSelectionContainer>
        </Container>
    );
}

export default TweetReactionView;