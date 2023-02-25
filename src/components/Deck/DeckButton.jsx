import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Dialog, Tooltip, Typography, tooltipClasses, ImageList, Tabs, Tab } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import { ReactComponent as CheckDeck } from './../../assets/Icons/CheckDeck.svg';
import { ReactComponent as SelectDeck } from './../../assets/Icons/SelectDeck.svg';
import { ReactComponent as VolumeOff } from './../../assets/Icons/VolumeOff.svg';
import { ReactComponent as VolumeOn } from './../../assets/Icons/VolumeOn.svg';

const DeckButtonContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '48%',
    height: '156px',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    position: 'relative',
});

const DeckButtonMediaContainer = styled(Box)({
    display: 'flex',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
});

const DeckButtonImgGif = styled('img')({
    width: '100%',
    objectFit: 'cover',
});

const DeckButtonText = styled(Typography)({
    color: '#fff',
    fontFamily: 'Impact, Inter',
    textTransform: 'uppercase',
    fontSize: '22px',
    fontWeight: '500',
    lineHeight: '19px',
    margin: 'auto auto 12px auto',
    textShadow: '2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000, 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000',
    zIndex: 100,
});

const HideUntilHoverContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    padding: '12px',
    zIndex: 100,
});

const UserContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    opacity: 0,
});

const UserAvatar = styled('img')({
    display: 'flex',
    backgroundColor: '#f0f',
    width: '24px',
    height: '24px',
    borderRadius: '8px',
    overflow: 'hidden',
});

const UserName = styled(Typography)({
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '17px',
    letterSpacing: '-0.33764705061912537px',
    textShadow: '1px 0 #000, -1px 0 #000, 0 1px #000, 0 -1px #000, 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000',
    marginLeft: '4px',
});

const ButtonsContainer = styled(Box)({
    display: 'flex',
});

const DeckButton = ({
    data,
    volumeDeckButton,
    selectedDeckButtons,
    handleAudioActivation,
    onClick,
    hideInfo,
}) => {

    const [hovered, setHovered] = useState(false);

    return (<DeckButtonContainer id={`deck-button-${data.id}`}
        onMouseEnter={(event) => {
            setHovered(true);
            if (hideInfo) return;
            event.currentTarget.children[1].children[0].classList.add('show-on-hover');
            event.currentTarget.children[1].children[1].children[0].classList.add('show-on-hover');
            event.currentTarget.children[1].children[1].children[1].classList.add('show-on-hover');
        }}
        onMouseLeave={(event) => {
            setHovered(false);
            if (hideInfo) return;
            event.currentTarget.children[1].children[0].classList.remove('show-on-hover');
            event.currentTarget.children[1].children[1].children[0].classList.remove('show-on-hover');
            event.currentTarget.children[1].children[1].children[1].classList.remove('show-on-hover');
        }}
        onClick={(event) => {
            onClick(data);
            if (hideInfo) return;
        }}>
        <DeckButtonMediaContainer>
            <DeckButtonImgGif src={data.imgURL} />
        </DeckButtonMediaContainer>
        {!hideInfo &&
            <HideUntilHoverContainer>
                <UserContainer>
                    <UserAvatar src={data.uploader.avatarImg} />
                    <UserName>{data.uploader.username}</UserName>
                </UserContainer>
                <ButtonsContainer>
                    {volumeDeckButton === data ?
                        <VolumeOn style={{ opacity: '1 !important' }} onClick={(event) => handleAudioActivation(data, event)} />
                        :
                        <VolumeOff style={{
                            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                            opacity: 0,
                        }} onClick={(event) => handleAudioActivation(data, event)} />
                    }
                    {selectedDeckButtons.find((button) => button.id === data.id) ?
                        <CheckDeck style={{ opacity: 1 }} />
                        :
                        <SelectDeck style={{
                            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                            opacity: hovered ? 1 : 0,
                        }} />
                    }
                </ButtonsContainer>
            </HideUntilHoverContainer>
        }
        <DeckButtonText>{data.label}</DeckButtonText>
        <style>{`
        .show-on-hover {
            opacity: 1 !important;
        }
    `}</style>
    </DeckButtonContainer>)
}

export default DeckButton