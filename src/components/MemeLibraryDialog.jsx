import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Dialog, Tabs, Tab, ImageList, ImageListItem } from '@mui/material';
import styled from '@emotion/styled';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { useTranslation } from 'react-i18next';
import { VariableSizeGrid as Grid } from 'react-window';

import { ReactComponent as Close } from './../assets/Icons/Close.svg';
import { ReactComponent as Featured } from './../assets/Icons/Featured.svg';
import { ReactComponent as VideoLibrary } from './../assets/Icons/VideoLibrary.svg';
import DeckButton from './Deck/DeckButton';
import MemeLibraryItem from './MemeLibraryItem';
import { getDeckMemesFromLibrary } from '../services/elastic';
import { AutoSizer, CellMeasurer, CellMeasurerCache, createMasonryCellPositioner, InfiniteLoader, Masonry } from 'react-virtualized';

const gf = new GiphyFetch('Kb3qFoEloWmqsI3ViTJKGkQZjxICJ3bi');

const COLUMN_WIDTH = 230 - 18;

/* const cache = new CellMeasurerCache({
    defaultHeight: 250,
    defaultWidth: COLUMN_WIDTH,
    fixedWidth: true,
});

const cellPositioner = createMasonryCellPositioner({
    cellMeasurerCache: cache,
    columnCount: 2,
    columnWidth: COLUMN_WIDTH,
    spacer: 18
}); */

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
        boxSizing: 'border-box'
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
});

const TabsContainer = styled(Box)({
    alignItems: 'center',
    marginLeft: '16px',
});

const DeckButtonsContainer = styled(Box)({
    marginTop: '24px',
    maxHeight: '100%'
});

const ConfirmButton = styled(Button)({
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
    bottom: '24px',
    borderRadius: '100px',
    textTransform: 'none',
    color: '#0D1022',
    padding: '16px 24px',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '24px',
    backgroundColor: '#00FFDD',
    '&:hover': {
        backgroundColor: '#00FFDD',
    },
});

const StyledTabs = styled((props) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '&.MuiTabs-root': {
        minHeight: '35px',
    },
    '& .MuiTabs-indicator': {
        display: 'none',
    },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ background }) => ({
        textTransform: 'none',
        fontWeight: '600',
        fontSize: '16px',
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: '19px',
        letterSpacing: '-0.33764705061912537px',
        textAlign: 'center',
        height: '35px',
        minHeight: 'fit-content',
        webkitBoxSizing: 'border-box',
        mozBoxSizing: 'border-box',
        boxSizing: 'border-box',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        borderRadius: '6px',
        padding: '8px 12px',
        alignItems: 'center',
        '&.Mui-selected': {
            color: '#fff',
            backgroundColor: background || '#29326B',
        },
        '&.Mui-focusVisible': {
            backgroundColor: '#29326B',
        },
    }),
);

let loadedGalleryItemsIndexes = [];

const MemeLibraryDialog = ({
    open,
    onClose,
    toDeck,
    memeLibraryStartTab,
    replacing,
    handleDeckButtonReplace,
    streamerUid
}) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedDeckButtons, setSelectedDeckButtons] = useState([]);
    const [alreadyOpen, setAlreadyOpen] = useState(false);
    const [volumeDeckButton, setVolumeDeckButton] = useState({});
    const [subsLibraryClips, setSubsLibraryClips] = useState([]);
    const [totalResultsOnSubsLibrary, setTotalResultsOnSubsLibrary] = useState(0);
    const [giphyClips, setGiphyClips] = useState([]);
    const [totalResultsOnGiphyClips, setTotalResultsOnGiphyClips] = useState(0);
    const [clipsFetched, setClipsFetched] = useState(false);
    const [unmountList, setUnmountList] = useState(false);
    const [loadingMoreClips, setLoadingMoreClips] = useState(false);

    useEffect(() => {
        if (open === true && !alreadyOpen) {
            setSelectedTab(memeLibraryStartTab);
            setAlreadyOpen(true);
        }
    }, [selectedTab, open, memeLibraryStartTab]);

    useEffect(() => {
        async function loadLibraries() {
            const subsMemes = await getDeckMemesFromLibrary(0, 50, streamerUid);

            setTotalResultsOnSubsLibrary(subsMemes.hits.total.value);
            setSubsLibraryClips(
                subsMemes.hits.hits.map((meme) => ({
                    id: meme._id,
                    ...meme._source
                }))
            );

            const gifs = await gf.trending({ offset: 0, limit: 150, type: 'videos' });
            setTotalResultsOnGiphyClips(gifs.pagination.total_count);
            setGiphyClips(gifs.data);

            setClipsFetched(true);
        }

        if (open && !clipsFetched) {
            loadLibraries();
        }
    }, [open, clipsFetched]);

    useEffect(() => {
        if (unmountList) {
            setTimeout(() => {
                setUnmountList(false);
            }, 1000);
        }
    }, [unmountList]);

    const handleButtonSelection = (button) => {
        let tempDeckButtons = [...selectedDeckButtons];
        // what happens when the meme appears two times and they regreet, well it is another button so this comparation/find should solve it
        if (tempDeckButtons.find((element => button.id === element.id))) {
            let index = tempDeckButtons.findIndex((element) => button.id === element.id);
            tempDeckButtons.splice(index, 1);
            setSelectedDeckButtons(tempDeckButtons);
            return;
        }
        if (replacing !== null) {
            if (selectedDeckButtons.length > 0) {
                tempDeckButtons[0] = button;
                setSelectedDeckButtons(tempDeckButtons);
                return;
            }
        }
        tempDeckButtons.push(button);
        setSelectedDeckButtons(tempDeckButtons);
    }

    const handleTabChange = (event, newValue) => {
        setUnmountList(true);
        setSelectedTab(newValue);
    };

    const handleClose = () => {
        onClose();
        setAlreadyOpen(false);
    }

    const handleConfirm = () => {
        console.log(selectedDeckButtons);
        // on update user deck go to deck screen
        toDeck();
        if (replacing !== null) {
            handleDeckButtonReplace(replacing, selectedDeckButtons[0])
        }
    }

    return (
        <BigDialog open={open}>
            <BottomSheet>
                <TopBarContainer>
                    <Close style={{ cursor: 'pointer' }} onClick={handleClose} />
                    <TabsContainer>
                        <StyledTabs value={selectedTab} onChange={handleTabChange}>
                            <StyledTab icon={<Featured style={{ width: '16px', height: '16px' }} />} iconPosition="start" label="Subscribers" background='#7000FF' />
                            <StyledTab icon={<VideoLibrary style={{ width: '16px', height: '16px' }} />} iconPosition="start" label="General" />
                        </StyledTabs>
                    </TabsContainer>
                </TopBarContainer>
                <DeckButtonsContainer>
                    {selectedTab === 0 ?
                        null
                        :
                        giphyClips.length > 0 ?
                            <GiphyLibraryGrid giphyClips={giphyClips} />
                            :
                            null
                    }
                    {/* <ImageList variant='masonry'
                        cols={2}
                        gap={8}>
                        {selectedTab === 0 ?
                            subsLibraryClips.map((element, index) => (
                                <ImageListItem key={element.id} style={{ cursor: 'pointer' }}>
                                    <MemeLibraryItem data={element}
                                        id={element.id}
                                        index={index}
                                        onClick={handleButtonSelection}
                                        volumeDeckButton={volumeDeckButton}
                                        selectedDeckButtons={selectedDeckButtons} />
                                </ImageListItem>
                            ))
                            :
                            giphyClips.map((element, index) => (
                                <ImageListItem key={element.id} style={{ cursor: 'pointer' }}>
                                    <MemeLibraryItem data={element}
                                        isGiphyVideo
                                        id={element.id}
                                        index={index}
                                        onClick={handleButtonSelection}
                                        volumeDeckButton={volumeDeckButton}
                                        selectedDeckButtons={selectedDeckButtons} />
                                </ImageListItem>
                            ))
                        }
                    </ImageList> */}
                </DeckButtonsContainer>
            </BottomSheet>
            {selectedDeckButtons.length > 0 &&
                <ConfirmButton onClick={handleConfirm}>{`Confirm`}</ConfirmButton>
            }
        </BigDialog>
    );
}

export default MemeLibraryDialog;

const GiphyLibraryGrid = ({ giphyClips }) => {
    const gutterSize = 18;
    const containerWidth = window.innerWidth;

    const cellMeasurerCache = new CellMeasurerCache({
        defaultHeight: 250,
        defaultWidth: COLUMN_WIDTH,
        minHeight: 100,
        fixedWidth: true
    });

    // Render each item as a div with a background color
    const renderItem = ({ index, key, style, parent }) => {
        const element = giphyClips[index];

        const height = COLUMN_WIDTH * (element.images.original.height / element.images.original.width);

        return (
            <CellMeasurer
            cache={cellMeasurerCache}
            index={index}
            key={key}
            parent={parent}>
                <div key={key} style={{ ...style }}>
                    <MemeLibraryItem data={element.video.assets['360p']}
                        height={height}
                        isGiphyVideo
                        id={element.id}
                        index={index}
                        onClick={() => {}}
                        volumeDeckButton={() => {}}
                        selectedDeckButtons={([])} />
                </div>
            </CellMeasurer>
        );
    };

    return (
        <Masonry cellCount={giphyClips.length}
            cellMeasurerCache={cellMeasurerCache}
            cellPositioner={createMasonryCellPositioner({
                cellMeasurerCache: cellMeasurerCache,
                columnCount: 2,
                columnWidth: COLUMN_WIDTH,
                spacer: gutterSize
            })}
            cellRenderer={renderItem}
            height={window.innerHeight}
            width={containerWidth} />
    )
}

/* function giphyCellRenderer({ index, key, parent, style }) {
        const element = giphyClips[index];

        if (element && element.images && element.images.original && element.images.original.height) {
            const height = COLUMN_WIDTH * (element.images.original.height / element.images.original.width) || 250;

            if (isNaN(height)) {
                return null;
            }

            return (
                <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
                    <div style={{ ...style, height }}>
                        <MemeLibraryItem data={element}
                            height={height}
                            isGiphyVideo
                            id={element.id}
                            index={index}
                            onClick={() => {}}
                            volumeDeckButton={() => {}}
                            selectedDeckButtons={([])} />
                    </div>
                </CellMeasurer>
            );
        }

        return null;
    } */

    /* const maybeLoadMore = useInfiniteLoader(loadMoreGiphyClips, {
        isItemLoaded: (index, items) => { console.log(index, !!items[index]); return !!items[index]},
        totalItems: 50
    }); */

/* const SubsLibraryGrid = ({ subsLibraryClips, loadMoreSubsMemes, totalResultsOnSubsLibrary }) => {
    const maybeLoadMore = useInfiniteLoader(loadMoreSubsMemes, {
        isItemLoaded: (index, items) => !!items[index],
        threshold: 3,
        totalItems: totalResultsOnSubsLibrary
    });


    return (
        <Masonry onRender={maybeLoadMore}
            key='SubsMasonry'
          // Provides the data for our grid items
          items={subsLibraryClips}
          columnGutter={18}
          columnCount={2}
          overscanBy={20}
          // This is the grid item component
          render={({ index, data, width }) => (
            <MemeLibraryItem data={data}
                height={width * (data.height / data.width)}
                id={data.id}
                index={index}
                onClick={() => {}}
                volumeDeckButton={() => {}}
                selectedDeckButtons={([])} />
          )}
        />
    );
} */