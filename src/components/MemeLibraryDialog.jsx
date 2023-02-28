import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Dialog, Tooltip, Typography, tooltipClasses, ImageList, Tabs, Tab } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import { ReactComponent as Close } from './../assets/Icons/Close.svg';
import { ReactComponent as Featured } from './../assets/Icons/Featured.svg';
import { ReactComponent as VideoLibrary } from './../assets/Icons/VideoLibrary.svg';
import DeckButton from './Deck/DeckButton';

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
});

const TabsContainer = styled(Box)({
    alignItems: 'center',
    marginLeft: '16px',
});

const DeckButtonsContainer = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '18px',
    justifyContent: 'space-between',
    marginTop: '32px',
    overflowY: 'scroll',
    paddingBottom: '100px',
    '&::-webkit-scrollbar': {
        display: 'none',
    }
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



const MemeLibraryDialog = ({
    open,
    onClose,
    toDeck,
    startTab,
    replacing,
    handleDeckButtonReplace,
}) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedDeckButtons, setSelectedDeckButtons] = useState([

    ]);
    const [alreadyOpen, setAlreadyOpen] = useState(false);
    const [volumeDeckButton, setVolumeDeckButton] = useState({});
    const [deckButtonsData, setDeckButtonsData] = useState([
        {
            id: 'heart-parrot',
            imgURL: 'https://media.giphy.com/media/S9oNGC1E42VT2JRysv/giphy.gif',
            label: 'Love',
            uploader: {
                username: 'juansguarnizo',
                avatarImg: 'https://static-cdn.jtvnw.net/jtv_user_pictures/74586414-e27b-4347-89c5-109e42ac3e1d-profile_image-70x70.png'
            },
        },
        {
            id: 'wow-sloth',
            imgURL: 'https://media.giphy.com/media/3NtY188QaxDdC/giphy.gif',
            label: 'WOW',
            uploader: {
                username: 'juansguarnizo',
                avatarImg: 'https://static-cdn.jtvnw.net/jtv_user_pictures/74586414-e27b-4347-89c5-109e42ac3e1d-profile_image-70x70.png'
            },
        },

    ]);

    useEffect(() => {
        if (open === true && !alreadyOpen) {
            setSelectedTab(startTab);
            setAlreadyOpen(true);
        }

        if (selectedTab === 1) {
            setDeckButtonsData([
                {
                    id: 'cry-pikachu',
                    imgURL: 'https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif',
                    label: 'Cry',
                    uploader: {
                        username: 'juansguarnizo',
                        avatarImg: 'https://static-cdn.jtvnw.net/jtv_user_pictures/74586414-e27b-4347-89c5-109e42ac3e1d-profile_image-70x70.png'
                    },
                },
                {
                    id: 'wooo-homer',
                    imgURL: 'https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif',
                    label: 'Woooo',
                    uploader: {
                        username: 'juansguarnizo',
                        avatarImg: 'https://static-cdn.jtvnw.net/jtv_user_pictures/74586414-e27b-4347-89c5-109e42ac3e1d-profile_image-70x70.png'
                    },
                },
            ])
        }

        if (selectedTab === 0) {
            setDeckButtonsData([
                {
                    id: 'heart-parrot',
                    imgURL: 'https://media.giphy.com/media/S9oNGC1E42VT2JRysv/giphy.gif',
                    label: 'Love',
                    uploader: {
                        username: 'juansguarnizo',
                        avatarImg: 'https://static-cdn.jtvnw.net/jtv_user_pictures/74586414-e27b-4347-89c5-109e42ac3e1d-profile_image-70x70.png'
                    },
                },
                {
                    id: 'wow-sloth',
                    imgURL: 'https://media.giphy.com/media/3NtY188QaxDdC/giphy.gif',
                    label: 'WOW',
                    uploader: {
                        username: 'juansguarnizo',
                        avatarImg: 'https://static-cdn.jtvnw.net/jtv_user_pictures/74586414-e27b-4347-89c5-109e42ac3e1d-profile_image-70x70.png'
                    },
                },
            ])
        }
    }, [selectedTab, open, startTab])

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

    const handleAudioActivation = (button, event) => {
        event.stopPropagation();
        if (button === volumeDeckButton) {
            return setVolumeDeckButton({});
        }
        setVolumeDeckButton(button);
    }

    const handleTabChange = (event, newValue) => {
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
                    {deckButtonsData.map((element) => {
                        return (<DeckButton
                            data={element}
                            index={index}
                            handleAudioActivation={handleAudioActivation}
                            //onCLick returns all the data
                            onClick={handleButtonSelection}
                            volumeDeckButton={volumeDeckButton}
                            selectedDeckButtons={selectedDeckButtons}
                        />);
                    })}
                </DeckButtonsContainer>
            </BottomSheet>
            {selectedDeckButtons.length > 0 &&
                <ConfirmButton onClick={handleConfirm}>{`Confirm`}</ConfirmButton>
            }
        </BigDialog>
    );
}

export default MemeLibraryDialog;