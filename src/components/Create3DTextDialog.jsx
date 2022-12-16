import React, { useState, useRef, useEffect } from 'react';
import { Box, Dialog, IconButton, ImageList, ImageListItem, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GiphyFetch } from '@giphy/js-fetch-api';

import { ReactComponent as Close } from './../assets/Icons/Close.svg';
import { ReactComponent as Search } from './../assets/Icons/Search.svg';
import { GIPHY_TEXT } from '../constants';

const gf = new GiphyFetch('Kb3qFoEloWmqsI3ViTJKGkQZjxICJ3bi');

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

const SearchContainer = styled(Box)({
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0D1021',
    height: '44px',
    padding: '0px 16px',
    borderRadius: '50px',
    width: '100%'
});

const SearchInput = styled(TextField)({
    padding: 0,
    border: 'none',
    width: '100%'
});

const GridContainer = styled(Box)({
    marginTop: '16px',
    padding: '0px !important',
    padding: 16,
    backgroundColor: '#141539'
});

const Create3DTextDialog = ({ open, onClose, defaultMessage, on3DTextSelected }) => {
    const [text, setText] = useState('');
    const [giphyText, setGiphyText] = useState([]);
    const searchInput = useRef(null);
    let timeout = null;

    useEffect(() => {
        if (open) {
            if (!defaultMessage) {
                loadGiphyText('sample');
            } else {
                setText(defaultMessage);
                loadGiphyText(defaultMessage);
            }
        }
    }, [open]);

    const loadGiphyText = async (text) => {
        const giphyText = await gf.animate(text, { limit: 50, type: GIPHY_TEXT });
        setGiphyText(giphyText.data);
    }

    const focusSearch = () => {
        searchInput.current.childNodes[0].focus();
    }

    const handleText = (text) => {
        clearTimeout(timeout);
        setText(text);
        timeout = setTimeout(() => {
            loadGiphyText(text);
        }, 250);
    }

    const onGiphyTextSelected = (giphyText) => {
        on3DTextSelected(text, giphyText)
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
            <MediaSelectorContainer>
                <HeaderContainer>
                    <CloseIconButton onClick={onClose}>
                        <Close />
                    </CloseIconButton>
                    <SearchContainer onClick={focusSearch}>
                        <Search style={{ opacity: 0.6 }} />
                        <SearchInput autoFocus
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
                            value={text}
                            onChange={(e) => handleText(e.target.value)}
                            placeholder={'Search Giphy'}
                            ref={searchInput}
                            id='searchInput' />
                        {text === '' &&
                            <img src={require('./../assets/Images/PoweredByGiphy.png')}
                                onClick={focusSearch} />
                        }
                    </SearchContainer>
                </HeaderContainer>
                <GridContainer>
                    {giphyText.length > 0 &&
                        <ImageList cols={window.innerWidth <= 320 ? 2 : 3} gap={8}>
                            {giphyText.map((giphyText) => (
                                <ImageListItem key={giphyText.id} style={{ cursor: text === '' ? 'auto' : 'pointer' }}>
                                    <img src={`${giphyText.images.fixed_width_small.url}?w=248&fit=crop&auto=format`}
                                        onClick={() => text === ''  ? onGiphyTextSelected(giphyText.images.original) : onGiphyTextSelected(giphyText.images.original)}
                                        height={giphyText.images.fixed_width_small.height}
                                        width={giphyText.images.fixed_width_small.width}
                                        style={{ color: 'transparent' }}
                                        alt='Giphy text'
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

export default Create3DTextDialog;