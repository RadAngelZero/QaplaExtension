import React, { useEffect, useState } from 'react';
import { Box, Dialog, IconButton, ImageList, ImageListItem } from '@mui/material';
import styled from '@emotion/styled';

import { ReactComponent as Close } from './../assets/Icons/Close.svg';
import { MEMES } from '../constants';
import { getQaplaMemesLibrary } from '../services/database';

const MediaSelectorContainer = styled(Box)({
    marginTop: 'auto',
    minHeight: '92vh',
    background: '#141539',
    borderTopLeftRadius: '30px',
    borderTopRightRadius: '30px',
    paddingTop: '16px'
});

const HeaderContainer = styled(Box)({
    display: 'flex',
    padding: '0px 16px',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '16px'
});

const CloseIconButton = styled(IconButton)({
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.253621)',
    padding: 0
});

const GridContainer = styled(Box)({
    marginTop: '16px',
    padding: '0px !important',
    padding: 16,
    backgroundColor: '#141539'
});

const MemeMediaSelectorDialog = ({ open, onClose, onMediaSelected }) => {
    const [memes, setMemes] = useState(null);

    useEffect(() => {
        async function getMemes() {
            const memes = await getQaplaMemesLibrary();

            if (memes.exists()) {
                setMemes(memes.val());
            }
        }

        if (!memes) {
            getMemes();
        }
    }, [memes]);

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
            <MediaSelectorContainer>
                <HeaderContainer>
                    <CloseIconButton onClick={onClose}>
                        <Close />
                    </CloseIconButton>
                </HeaderContainer>
                <GridContainer>
                    {memes &&
                        <ImageList variant='masonry' cols={2} gap={8}>
                            {Object.keys(memes).map((memeKey) => (
                                <ImageListItem key={memes[memeKey].url} style={{ cursor: 'pointer' }}>
                                    <img src={`${memes[memeKey].url}?w=248&fit=crop&auto=format`}
                                        onClick={() => onMediaSelected({ type: MEMES, ...memes[memeKey] })}
                                        alt='Qapla Meme'
                                        loading='lazy' />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    }
                </GridContainer>
            </MediaSelectorContainer>
        </Dialog>
    );
}

export default MemeMediaSelectorDialog;