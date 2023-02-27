import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Dialog, Tooltip, Typography, tooltipClasses, ImageList } from '@mui/material';
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

const InfoContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: '66%',
    alignItems: 'center',
});

const Header = styled(Typography)({
    color: '#fff',
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '29px',
    textAlign: 'center',
});

const Subtitle = styled(Typography)({
    color: '#fff',
    fontSize: '20px',
    fontWeight: '400',
    lineHeight: '24px',
    whiteSpace: 'pre-wrap',
    textAlign: 'center',
    justifyContent: 'center',
    margin: '56px auto 0px 5px'
});

const SubtitleHighlight = styled('span')({
    color: '#00FFDD',
});

const SubscribeButton = styled(Button)({
    backgroundColor: '#7000FF',
    padding: '24px 48px',
    borderRadius: '1000px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    lineHeight: '19px',
    letterSpacing: '0.492000013589859px',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#7000FF',
    },
    marginTop: '56px',
});

const LibraryButton = styled(Button)({
    backgroundColor: '#0000',
    color: '#FFFFFFCC',
    fontSize: '16px',
    fontWeight: '700',
    lineHeight: '19px',
    letterSpacing: '0.492000013589859px',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#0000',
    },
    marginTop: '24px',
});

const OnlySubDialog = ({
    open,
    onClose,
}) => {

    const handleClose = () => {
        onClose();
    }

    const handleSubscribe = () => {

    }
    const handleGeneralLib = () => {

    }

    return (<BigDialog open={open}>
        <BottomSheet>
            <Close style={{ cursor: 'pointer' }} onClick={handleClose} />
            <InfoContainer>
                <Header>{`🫣 Twitch Subscribers Only`}</Header>
                <Subtitle>{`Subscribe to `}<SubtitleHighlight>{`Streamer’s`}</SubtitleHighlight>{` channel to upload dank memes.\n\nAs regular viewer you can add memes from the general library`}</Subtitle>
                <SubscribeButton onClick={handleSubscribe}>{`Subscribe to Channel`}</SubscribeButton>
                <LibraryButton disableRipple onClick={handleGeneralLib} >{`Add from General Library`}</LibraryButton>
            </InfoContainer>
        </BottomSheet>
    </BigDialog>)
}

export default OnlySubDialog;