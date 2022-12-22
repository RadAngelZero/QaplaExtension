import React, { useRef, useState } from 'react';
import { Box, Dialog, IconButton, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';

import { ReactComponent as Close } from './../assets/Icons/Close.svg';
import { ReactComponent as Search } from './../assets/Icons/Search.svg';
import { GIPHY_GIFS } from '../constants';

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
    padding: 16,
    backgroundColor: '#141539'
});

const GiphyMediaSelectorDialog = ({ open, onClose, mediaType, onMediaSelected }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const searchInput = useRef(null);

    const fetchTrending = (offset) => gf.trending({ offset, type: mediaType, limit: 20, rating: 'pg-13' });

    const fetchSearch = (offset) => gf.search(searchTerm, { offset, limit: 50, type: mediaType, rating: 'pg-13' });

    const focusSearch = () => searchInput.current.focus();

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
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={'Search Giphy'}
                            ref={searchInput}
                            id='searchInput' />
                        {searchTerm === '' &&
                            <img src={require('./../assets/Images/PoweredByGiphy.png')}
                                onClick={focusSearch}
                                alt='Powered by Giphy' />
                        }
                    </SearchContainer>
                </HeaderContainer>
                <GridContainer>
                    <Grid width={window.innerWidth - 32}
                        columns={mediaType === GIPHY_GIFS ? 2 : 3}
                        gutter={8}
                        fetchGifs={searchTerm === '' ? fetchTrending : fetchSearch}
                        key={searchTerm}
                        onGifClick={(media) => onMediaSelected({ ...media.images.original, type: mediaType })}
                        hideAttribution
                        noLink />
                </GridContainer>
            </MediaSelectorContainer>
        </Dialog>
    );
}

export default GiphyMediaSelectorDialog;