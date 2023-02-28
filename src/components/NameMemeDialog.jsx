import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Dialog, Tooltip, Typography, tooltipClasses, ImageList, Tabs, Tab } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import { ReactComponent as Close } from './../assets/Icons/Close.svg';

const BigDialog = styled(Dialog)({
    '.MuiDialog-root': {
        // width: '100%',
    },
    '.MuiDialog-container': {
        // width: '100%',
        // padding: '0',
    },
    '.MuiDialog-paper': {
        display: 'flex',
        background: '#0D1021',
        width: '100vw',
        height: '100%',
        margin: 0,
        maxHeight: '100%',
        borderRadius: '0px',
        webkitBoxSizing: 'border-box',
        mozBoxSizing: 'border-box',
        boxSizing: 'border-box',
        overflow: 'hidden',
    },
});

const BottomSheet = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    width: '100%',
    backgroundColor: '#141539',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    padding: '24px',
    bottom: '0px',
    height: '96%',
    webkitBoxSizing: 'border-box',
    mozBoxSizing: 'border-box',
    boxSizing: 'border-box',
});

const TopBarContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});

const HeaderText = styled(Typography)({
    color: '#fff',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '24px',
});

const SkipButton = styled(Button)({
    backgroundColor: '#4040FF4D',
    padding: '8px 16px',
    borderRadius: '20px',
    color: '#FFFFFFA6',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '22px',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#4040FF4D',
    },
});

const MediaContainer = styled(Box)({
    width: 'fit-content',
    maxWidth: '100%',
    maxHeight: '315px',
    borderRadius: '14px',
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: '26px',
});

const ImgGif = styled('img')({
    maxHeight: '315px',
    objectFit: 'contain',
});

const TextInput = styled('input')({
    backgroundColor: '#0D1021',
    color: '#fff',
    fontSize: '20px',
    fontWeight: '500',
    lineHeight: '24px',
    padding: '16px',
    border: 'none',
    caretColor: '#00FFDD',
    '&::placeholder': {
        color: '#FFFFFF99',
        fontSize: '20px',
        fontWeight: '400',
        lineHeight: '24px',
    },
    borderRadius: '100px',
    '&:focus': {
        outline: 'none',
    },
    marginTop: '25px',
});

const Subtitle = styled(Typography)({
    color: '#FFFFFF99',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '19px',
    marginTop: '24px',
    textAlign: 'center',
});

const SubtitleHighlight = styled('span')({
    color: '#fff',
    fontWeight: '600',
});

const ConfirmButton = styled(Button)({
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
    bottom: '24px',
    borderRadius: '100px',
    textTransform: 'none',
    color: '#0D1022',
    padding: '16px 32px',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '24px',
    backgroundColor: '#00FFDD',
    '&:hover': {
        backgroundColor: '#00FFDD',
    },
});

const NameMemeDialog = ({
    open,
    onClose,
    toDeck,
}) => {

    const [imgGif, setImgGif] = useState('https://media.giphy.com/media/TztOD2c0znrtm/giphy-downsized-large.gif');
    const [label, setLabel] = useState('');

    const handleClose = () => {
        onClose();
    }

    const handleSkip = () => {
        console.log('memeCreateNoName');
        toDeck();
    }

    const handleOnLabelChange = (e) => {
        setLabel(e.target.value);
    }

    const createMeme = () => {
        console.log('memeCreate');
        toDeck();
    }

    return (<BigDialog open={open}>
        <BottomSheet>
            <TopBarContainer>
                <Close style={{ cursor: 'pointer' }} onClick={handleClose} />
                <HeaderText>{`Name your Meme`}</HeaderText>
                <SkipButton onClick={handleSkip}>{`Skip`}</SkipButton>
            </TopBarContainer>
            <MediaContainer>
                <ImgGif src={imgGif} />
            </MediaContainer>
            <TextInput value={label} onChange={(e) => {handleOnLabelChange(e)}} />
            <Subtitle>{`Make it easier to spot your meme with a `}<SubtitleHighlight>{`short name`}</SubtitleHighlight></Subtitle>
            {label.length > 0 &&
            <ConfirmButton onClick={createMeme}>{`Confirm`}</ConfirmButton>}
        </BottomSheet>
    </BigDialog>)
}

export default NameMemeDialog;