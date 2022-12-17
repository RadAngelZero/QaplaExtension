import React, { useEffect, useState } from 'react';
import { Box, Dialog, IconButton, ImageList, ImageListItem, Typography } from '@mui/material';
import styled from '@emotion/styled';

import { getRandomGifByLibrary } from '../services/database';
import { ReactComponent as Close } from './../assets/Icons/Close.svg';

const EmoteRainContainer = styled(Box)({
    marginTop: '56px',
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

const EmoteRainDialog = ({ open, onClose, emotes, onEmoteSelected }) => {
    const [gif, setGif] = useState(null);

    useEffect(() => {
        async function loadGif() {
            const gif = await getRandomGifByLibrary('level3Reactions');

            setGif(gif.val());
        }

        loadGif();
    }, []);

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
                        {`Let it rain 👇`}
                    </HeaderText>
                </HeaderContainer>
                <GifContainer>
                    <img src={gif} style={{
                        width: '100%',
                        borderRadius: '25px'
                    }} />
                </GifContainer>
                <EmotesListContainer>
                    {Object.keys(emotes)
                        .filter((emoteCategory) => emotes[emoteCategory].data[0].length > 0)
                        .map((emoteCategory) => (
                        <React.Fragment key={emoteCategory}>
                            <EmoteCategoryTitle>
                                {emotes[emoteCategory].key}
                            </EmoteCategoryTitle>
                            <ImageList cols={5} gap={32}>
                                {emotes[emoteCategory].data[0].map((emote) => (
                                    <ImageListItem key={emote.id} style={{
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => onEmoteSelected(emote.images.url_4x)}>
                                        <img src={`${emote.images.url_2x}?w=56&h=56&fit=crop&auto=format`}
                                            alt='Giphy text'
                                            loading='lazy' />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </React.Fragment>
                    ))}
                </EmotesListContainer>
            </EmoteRainContainer>
        </Dialog>
    );
}

export default EmoteRainDialog;