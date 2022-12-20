import React, { useEffect, useRef, useState } from 'react';
import { Box, Dialog, IconButton, ImageList, ImageListItem, TextField } from '@mui/material';
import styled from '@emotion/styled';

import { searchMemesWithTag, searchMostViewedMemes, updateMemeLastViewed } from '../services/elastic';

import { ReactComponent as Close } from './../assets/Icons/Close.svg';
import { ReactComponent as Search } from './../assets/Icons/Search.svg';
import { MEMES } from '../constants';

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
    padding: 16,
    backgroundColor: '#141539'
});

const MEMES_TO_FETCH = 100;

const MemeMediaSelectorDialog = ({ open, onClose, onMediaSelected }) => {
    const [memes, setMemes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const searchInput = useRef(null);
    let fetchTimeout = null;

    useEffect(() => {
        clearTimeout(fetchTimeout);

        if (searchTerm === '') {
            setMemes([]);
            fetchMemes(0, MEMES_TO_FETCH);
        } else {
            fetchTimeout = setTimeout(async () => {
                const searchResult = await searchMemesWithTag(searchTerm.trimEnd(), 0, MEMES_TO_FETCH);

                const suggestions = searchResult.hits.hits;
                const mappedResults = suggestions.map((suggestion) => ({
                    id: suggestion._id,
                    ...suggestion._source
                }));

                setMemes(mappedResults);
            }, 250);
        }

    }, [searchTerm]);

    const fetchMemes = async (from, size) => {
        if (searchTerm === '') {
            const media = await searchMostViewedMemes(from, size);

            const mappedResults = media.hits.hits.map((hit) => ({
                    id: hit._id,
                    ...hit._source
                }
            ));

            setMemes(mappedResults);
        } else {
            fetchMemesByTag(from, MEMES_TO_FETCH);
        }
    }

    const fetchMemesByTag = async (from, size) => {
        const searchResult = await searchMemesWithTag(searchTerm, from, size);

        const suggestions = searchResult.hits.hits;
        const mappedResults = suggestions.map((suggestion) => ({
            id: suggestion._id,
            ...suggestion._source
        }));

        setMemes(memes.concat(mappedResults));
    }

    const searchHandler = (searchTerm) => {
        clearTimeout(fetchTimeout);
        setSearchTerm(searchTerm);
    }

    const focusSearch = () => searchInput.current.focus();

    const memeSelected = async (meme) => {
        await updateMemeLastViewed(meme.id);
        onMediaSelected(meme);
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
                            value={searchTerm}
                            onChange={(e) => searchHandler(e.target.value)}
                            placeholder={'Search Memes'}
                            ref={searchInput}
                            id='searchInput' />
                        {searchTerm === '' &&
                            <img src={require('./../assets/Images/PoweredByGiphy.png')}
                                onClick={focusSearch} />
                        }
                    </SearchContainer>
                </HeaderContainer>
                <GridContainer>
                    {memes &&
                        <ImageList variant='masonry'
                            cols={2}
                            gap={8}>
                            {Object.keys(memes).map((memeKey) => (
                                <ImageListItem key={memes[memeKey].id} style={{ cursor: 'pointer' }}>
                                    <img src={`${memes[memeKey].url}?w=248&fit=crop&auto=format`}
                                        onClick={() => memeSelected({ type: MEMES, ...memes[memeKey] })}
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