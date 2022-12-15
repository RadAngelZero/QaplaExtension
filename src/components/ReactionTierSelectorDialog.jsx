import React, { useEffect, useState } from 'react';
import { Box, Dialog, IconButton, ImageList, ImageListItem, Ic } from '@mui/material';
import styled from '@emotion/styled';

import { ReactComponent as Close } from './../assets/Icons/Close.svg';
import { ReactComponent as UpgradeArrow } from './../assets/Icons/UpgradeArrow.svg';
import { ReactComponent as GIF } from './../assets/Icons/GIF.svg';
import { ReactComponent as Memes } from './../assets/Icons/Memes.svg';
import { ReactComponent as Sticker } from './../assets/Icons/Sticker.svg';
import { ReactComponent as Avatar } from './../assets/Icons/Avatar.svg';
import { ReactComponent as GiphyText } from './../assets/Icons/GiphyText.svg';
import { ReactComponent as TTSBot } from './../assets/Icons/TTSBot.svg';


import { ReactComponent as Interactions } from './../assets/Icons/Interactions.svg';
import { ReactComponent as Bits } from './../assets/Icons/Bits.svg';

const ReactionTierSelectorContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    marginTop: 'auto',
    minHeight: '92vh',
    background: '#141539',
    borderTopLeftRadius: '30px',
    borderTopRightRadius: '30px',
    padding: '0px 16px',
    paddingTop: '16px',
});

const HeaderContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '40px',
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

    background: 'linear-gradient(227.05deg, #FFD3FB 9.95%, #F5FFCB 48.86%, #9FFFDD 90.28%), #FFFFFF',
    webkitBackgroundClip: 'text',
    webkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
});

const TiersContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: 'auto',
    marginTop: '8px',
    marginBottom: '8px',
});

const Tier = styled(Box)({
    margin: '8px 0px',
    borderRadius: '25px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#3B4BF9',
    padding: '24px',
    justifyContent: 'space-between',
});

const IconsContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
});

const Icon = styled(Box)({
    marginRight: '16px',
});

const BottomContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
});

const Title = styled('p')({
    color: '#fff',
    fontSize: '24px',
    fontWeight: '900',
    lineHeight: '29px',
    maxWidth: '240px',
    margin: 0,
    whiteSpace: 'pre-wrap',
});

const PriceContainer = styled(Box)({
    display: 'flex',
    backgroundColor: '#0D1021',
    padding: '6px 13px',
    borderRadius: '10px',
    alignItems: 'center',
    webkitBoxSizing: 'border-box', /* Safari/Chrome, other WebKit */
    mozBoxSizing: 'border-box',    /* Firefox, other Gecko */
    boxSizing: 'border-box',         /* Opera/IE 8+ */
});

const PriceText = styled('p')({
    color: '#fff',
    margin: 0,
    fontWeight: '700',
    fontSize: '24px',
    lineHeight: '29px',
    textAlign: 'center',
    background: 'linear-gradient(227.05deg, #FFD3FB 9.95%, #F5FFCB 48.86%, #9FFFDD 90.28%), #FFFFFF',
    webkitBackgroundClip: 'text',
    webkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    marginLeft: '8px',
});

const ReactionTierSelectorDialog = ({ open, onClose, onMediaSelected }) => {
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
            <ReactionTierSelectorContainer >
                <HeaderContainer>
                    <CloseIconButton onClick={onClose}>
                        <Close />
                    </CloseIconButton>
                    <HeaderText>
                        {`Reaction Tiers`}
                    </HeaderText>
                </HeaderContainer>
                <TiersContainer>
                    <Tier>
                        <IconsContainer>
                            <Icon>
                                <GIF />
                            </Icon>
                            <Icon>
                                <Memes />
                            </Icon>
                            <Icon>
                                <Sticker />
                            </Icon>
                        </IconsContainer>
                        <BottomContainer>
                            <Title>
                                Memes + TTS
                            </Title>
                            <PriceContainer>
                                <Interactions />
                                <PriceText>
                                    {`1`}
                                </PriceText>
                            </PriceContainer>
                        </BottomContainer>
                    </Tier>
                    <Tier>
                        <IconsContainer>
                            <Icon>
                                <UpgradeArrow />
                            </Icon>
                            <Icon>
                                <GiphyText />
                            </Icon>
                            <Icon>
                                <TTSBot />
                            </Icon>
                        </IconsContainer>
                        <BottomContainer>
                            <Title>
                                {'+ 3D Text,\nTTS Voice'}
                            </Title>
                            <PriceContainer>
                                <Bits />
                                <PriceText>
                                    {`100`}
                                </PriceText>
                            </PriceContainer>
                        </BottomContainer>
                    </Tier>
                    <Tier>
                        <IconsContainer>
                            <Icon>
                                <UpgradeArrow />
                            </Icon>
                            <Icon>
                                <Avatar />
                            </Icon>
                        </IconsContainer>
                        <BottomContainer>
                            <Title>
                                + Emote Animation
                            </Title>
                            <PriceContainer>
                                <Bits />
                                <PriceText>
                                    {`5,000`}
                                </PriceText>
                            </PriceContainer>
                        </BottomContainer>
                    </Tier>
                </TiersContainer>
            </ReactionTierSelectorContainer>
        </Dialog>
    )
}

export default ReactionTierSelectorDialog;