import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Dialog, Tooltip, Typography, tooltipClasses, ImageList } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import { ReactComponent as Menu } from './../assets/Icons/Menu.svg';
import { ReactComponent as CloseMenu } from './../assets/Icons/CloseMenu.svg';
import { ReactComponent as ExternalLinkWhite } from './../assets/Icons/ExternalLinkWhite.svg';
import { ReactComponent as Bits } from './../assets/Icons/Bits.svg';
import { ReactComponent as VideoIcon } from './../assets/Icons/VideoIcon.svg';
window.scrolls = {};
window.scrolls.DeckChips = { x: 0, scroll: 0 };

const BigDialog = styled(Dialog)({
    '.MuiDialog-root': {
        // width: '100%',
    },
    '.MuiDialog-container': {
        // width: '100%',
        // padding: '0',
    },
    '.MuiDialog-paper': {
        background: '#0D1021',
        width: '100vw',
        height: '100%',
        margin: 0,
        maxHeight: '100%',
        borderRadius: '0px',
        padding: '30px 24px',
        webkitBoxSizing: 'border-box',
        mozBoxSizing: 'border-box',
        boxSizing: 'border-box',
        overflow: 'hidden',
    },
});

const MenuButtonContainer = styled(Box)({
    display: 'flex',
    alignSelf: 'flex-start',
    height: '24px',
    // marginLeft: 'auto',
    marginLeft: '-30px',
});

const MenuPopUp = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#141539',
        padding: '24px',
        borderRadius: '20px',
        display: 'flex',
        top: '0px',
        minWidth: '150px',
    },
}));

const MenuHintText = styled('p')({
    color: '#fff',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '19px',
    margin: '0px',
    marginRight: '8px',
    marginLeft: '-5ch',
});

const MenuOptionsContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
});

const MenuOption = styled(Box)({
    display: 'flex',
    cursor: 'pointer',
    width: '100%',
});

const HeaderContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
});

const MenuOptionEmoji = styled('p')({
    color: '#fff',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '19px',
    margin: '0px',
    marginRight: '8px',
});

const MenuOptionText = styled('p')({
    color: '#fff',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '19px',
    margin: '0px',
});

const HeaderTitleContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    margin: '0px auto',
});

const HeaderText = styled(Typography)({
    color: '#FFFFFF99',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '19px',
});

const HeaderBitsText = styled(Typography)({
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '800',
    lineHeight: '19px',
});

const Subtitle = styled(Typography)({
    color: '#fff',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '19px',
    textAlign: 'center',
    margin: '20px auto 0px auto',
});

const DeckButtonsContainer = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '18px',
    justifyContent: 'space-between',
    marginTop: '30px',
    overflowY: 'scroll',
    paddingBottom: '100px',
    '&::-webkit-scrollbar': {
        display: 'none',
    }
});

const DeckButton = styled(Box)({
    display: 'flex',
    flexBasis: '48%',
    height: '156px',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
});

const DeckButtonAvailable = styled(Box)({
    display: 'flex',
    flexBasis: '48%',
    height: '156px',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: '#3B4BF973',
    padding: '2.5px',
    webkitBoxSizing: 'border-box',
    mozBoxSizing: 'border-box',
    boxSizing: 'border-box',
});

const DeckButtonAvailableInnerContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    height: '100%',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: '#0D1021',
});

const DeckButtonAvailableAddButton = styled(Button)({
    backgroundColor: '#3B4BF9',
    borderRadius: '100px',
    padding: '10px 21px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    lineHeight: '19px',
    textAlign: 'center',
    '&:hover': {
        backgroundColor: '#3B4BF9',
    },
    textTransform: 'none',
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
});

const BottomSheet = styled(Box)({
    display: 'flex',
    position: 'absolute',
    height: '90px',
    width: '100vw',
    backgroundColor: '#141539',
    bottom: '0px',
    left: '0px',
    padding: '16px 24px',
    webkitBoxSizing: 'border-box',
    mozBoxSizing: 'border-box',
    boxSizing: 'border-box',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'nowrap',
    overflowX: 'scroll',
    cursor: 'grab',
    '&::-webkit-scrollbar': {
        display: 'none',
    }
});

const BottomSheetChip = styled(Box)({
    display: 'flex',
    padding: '16px',
    background: 'linear-gradient(94.8deg, rgba(86, 44, 255, 0.2) 0%, rgba(173, 0, 255, 0.2) 100%)',
    borderRadius: '100px',
    alignItems: 'center',
    cursor: 'pointer',
    webkitUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
});
const BottomSheetChipAvatar = styled(Box)({
    width: '24px',
    height: '24px',
    backgroundColor: '#f0f',
    borderRadius: '100px',
    marginRight: '8px',
    overflow: 'hidden',
});

const BottomSheetChipEmoji = styled(Typography)({
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '19px',
    marginRight: '4px',
});

const BottomSheetChipText = styled(Typography)({
    color: '#fff',
    background: 'linear-gradient(227.05deg, #FFD3FB 9.95%, #F5FFCB 48.86%, #9FFFDD 90.28%)',
    fontSize: '18px',
    fontWeight: '600',
    lineHeight: '19px',
    webkitBackgroundClip: 'text',
    webkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    whiteSpace: 'nowrap',
});

const ReactionsDeckDialog = ({
    open,
    onClose,
    emotes,
    randomEmoteUrl,
    onEmoteAnimationSelected,
    userTwitchId,
}) => {

    const [hoverMenu, setHoverMenu] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [maxDeckButtons, setMaxDeckButtons] = useState(6);
    const [deckButtonsData, setDeckButtonsData] = useState([
        {
            id: 'heart-parrot',
            imgURL: 'https://media.giphy.com/media/S9oNGC1E42VT2JRysv/giphy.gif',
            label: 'Love'
        },
        {
            id: 'wow-sloth',
            imgURL: 'https://media.giphy.com/media/3NtY188QaxDdC/giphy.gif',
            label: 'WOW'
        },
        {
            id: 'cry-pikachu',
            imgURL: 'https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif',
            label: 'Cry'
        },
        {
            id: 'wooo-homer',
            imgURL: 'https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif',
            label: 'Woooo'
        },
        // {
        //     id: 'heart-parrot',
        //     imgURL: 'https://media.giphy.com/media/S9oNGC1E42VT2JRysv/giphy.gif',
        //     label: 'Love'
        // },
    ]);

    const bottomSheetRef = useRef();

    const { t } = useTranslation('translation');

    useEffect(() => {
        if (deckButtonsData.length < maxDeckButtons) {
            console.log('add button')
            let deckButtonsTemp = [...deckButtonsData];
            for (let i = deckButtonsData.length; i < maxDeckButtons; i++) {
                console.log('added button', i)
                deckButtonsTemp.push({ empty: true });
            }
            setDeckButtonsData(deckButtonsTemp);
        }
    }, []);

    const onMouseDownScroll = (event) => {
        window.scrolls.DeckChips = { x: event.clientX, scroll: bottomSheetRef.current.scrollLeft };
        window.addEventListener('mousemove', onMouseMove, true);
        window.addEventListener('mouseup', onMouseUpScroll, true);
    };

    const onMouseUpScroll = (event) => {
        window.removeEventListener('mousemove', onMouseMove, true);
        window.removeEventListener('mouseup', onMouseUpScroll, true);
    }

    const onMouseMove = (event) => {
        bottomSheetRef.current.scrollLeft = window.scrolls.DeckChips.scroll + (window.scrolls.DeckChips.x - event.clientX);
        // const { clientX, scrollLeft, scrollTop, clientY } = this.state;
        // bottomSheetRef.scrollLeft = scrollLeft - clientX + event.clientX;
        // bottomSheetRef.scrollTop = scrollTop - clientY + event.clientY;
    };

    const handleUploadMeme = () => {
        console.log('upload meme');
    }

    const handleButtonSelection = (buttonID) => {
        console.log(buttonID)
    }

    return (
        <BigDialog open={open}>
            <HeaderContainer>
                <HeaderTitleContainer>
                    <HeaderText>{`Quick Reactions`}</HeaderText>
                    <Bits style={{ margin: '0px 4px', width: '16px', height: '16px' }} />
                    <HeaderBitsText>{`100`}</HeaderBitsText>
                </HeaderTitleContainer>
                <MenuPopUp open={openMenu} placement='bottom-end' title={
                    <React.Fragment>
                        <MenuOptionsContainer>
                            <MenuOption onClick={() => {
                                window.open(`https://web.qapla.gg/hub/how?id=${userTwitchId}`, '_blank');
                            }}>
                                <MenuOptionEmoji>
                                    <span role='img' aria-label='Tutorials'>
                                        🎥
                                    </span>
                                </MenuOptionEmoji>
                                <MenuOptionText>
                                    {t('TweetReactionView.menu.tutorials')}
                                </MenuOptionText>
                                <ExternalLinkWhite style={{ marginLeft: 'auto' }} />
                            </MenuOption>
                        </MenuOptionsContainer>
                    </React.Fragment>
                } >
                    <MenuButtonContainer>
                        <MenuHintText style={{
                            opacity: hoverMenu ? '0.6' : '0',
                        }}>
                            Menu
                        </MenuHintText>
                        <div
                            onMouseEnter={() => { setHoverMenu(true); }}
                            onMouseLeave={() => { setHoverMenu(false); }}
                            onClick={() => { setOpenMenu(!openMenu) }}
                            style={{ cursor: 'pointer' }}
                        >
                            {openMenu ?
                                <CloseMenu />
                                :
                                <Menu />
                            }
                        </div>
                    </MenuButtonContainer>
                </MenuPopUp>
            </HeaderContainer>
            <Subtitle>{`Add clips to your Meme Deck`}</Subtitle>
            <DeckButtonsContainer>
                {deckButtonsData.map((element) => {

                    if (element.empty) {
                        return (
                            <DeckButtonAvailable onClick={handleUploadMeme}>
                                <DeckButtonAvailableInnerContainer>
                                    <VideoIcon />
                                    <DeckButtonAvailableAddButton>{`Add Meme`}</DeckButtonAvailableAddButton>
                                </DeckButtonAvailableInnerContainer>
                            </DeckButtonAvailable>
                        )
                    }
                    return (
                        <DeckButton onClick={() => handleButtonSelection(element.id)} style={{
                            background: `url('${element.imgURL}') center center / cover no-repeat`,
                        }}>
                            <DeckButtonText>{element.label}</DeckButtonText>
                        </DeckButton>
                    );
                })}
            </DeckButtonsContainer>
            <BottomSheet ref={bottomSheetRef} onMouseDown={onMouseDownScroll}>
                <BottomSheetChip onClick={() => { console.log('a') }}>
                    <BottomSheetChipAvatar>

                    </BottomSheetChipAvatar>
                    <BottomSheetChipText>{`Create Reaction`}</BottomSheetChipText>
                </BottomSheetChip>
                <BottomSheetChip>
                    <BottomSheetChipEmoji>{`👋 `}</BottomSheetChipEmoji>
                    <BottomSheetChipText>{`Pop Up`}</BottomSheetChipText>
                </BottomSheetChip>
                <BottomSheetChip>
                    <BottomSheetChipEmoji>{`👽 `}</BottomSheetChipEmoji>
                    <BottomSheetChipText>{`Edit Avatar`}</BottomSheetChipText>
                </BottomSheetChip>
                <BottomSheetChip>
                    <BottomSheetChipEmoji>{`👽 `}</BottomSheetChipEmoji>
                    <BottomSheetChipText>{`Edit Avatar`}</BottomSheetChipText>
                </BottomSheetChip>
            </BottomSheet>
        </BigDialog>
    )

}

export default ReactionsDeckDialog;
