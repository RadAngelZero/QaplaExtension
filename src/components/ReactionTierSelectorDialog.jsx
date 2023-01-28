import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Dialog, IconButton } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Close } from './../assets/Icons/Close.svg';
import { ReactComponent as UpgradeArrow } from './../assets/Icons/UpgradeArrow.svg';
import { ReactComponent as GIF } from './../assets/Icons/GIF.svg';
import { ReactComponent as Memes } from './../assets/Icons/Memes.svg';
import { ReactComponent as Sticker } from './../assets/Icons/Sticker.svg';
import { ReactComponent as GiphyText } from './../assets/Icons/GiphyText.svg';
import { ReactComponent as TTSBot } from './../assets/Icons/TTSBot.svg';
import { ReactComponent as Interactions } from './../assets/Icons/Interactions.svg';
import { ReactComponent as Bits } from './../assets/Icons/Bits.svg';
import { getRandomGifByLibrary } from '../services/database';
import AvatarGif from './../assets/Gifs/AvatarIcon.gif';
import { ZAP } from '../constants';

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
    cursor: 'pointer'
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

const ReactionTierSelectorDialog = ({ open, onClose, costs, changeReactionLevel, randomEmoteUrl }) => {
    const [level1Gif, setLevel1Gif] = useState(null);
    const [level2Gif, setLevel2Gif] = useState(null);
    const [level3Gif, setLevel3Gif] = useState(null);
    const { t } = useTranslation('translation', { keyPrefix: 'dialogs.ReactionTierSelectorDialog' });

    useEffect(() => {
        async function loadGif(setLevel, library) {
            const gif = await getRandomGifByLibrary(library);

            return setLevel(gif.val());
        }

        if (!level1Gif && !level2Gif && !level3Gif) {
            loadGif(setLevel1Gif, 'ChannelPointsReactions');
            loadGif(setLevel2Gif, 'level2Reactions');
            loadGif(setLevel3Gif, 'level3Reactions');
        }

    }, [level1Gif, level2Gif, level3Gif]);

    const onChangeReactionLevel = (level) => {
        changeReactionLevel(level);
        onClose();
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
            <ReactionTierSelectorContainer >
                <HeaderContainer>
                    <CloseIconButton onClick={onClose}>
                        <Close />
                    </CloseIconButton>
                    <HeaderText>
                        {t('reactionTiers')}
                    </HeaderText>
                </HeaderContainer>
                <TiersContainer>
                    <Tier onClick={() => onChangeReactionLevel(1)}
                        style={{
                            background: `url('${level1Gif}')`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat'
                        }}>
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
                                {t('level1')}
                            </Title>
                            <PriceContainer>
                                {costs[0] && costs[0].type === ZAP ?
                                    <Interactions />
                                    :
                                    <Bits />
                                }
                                <PriceText>
                                    {costs[0] && costs[0].price.toLocaleString()}
                                </PriceText>
                            </PriceContainer>
                        </BottomContainer>
                    </Tier>
                    <Tier onClick={() => onChangeReactionLevel(2)}
                        style={{
                            background: `url('${level2Gif}')`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat'
                        }}>
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
                            <Icon>
                                <img src={AvatarGif}
                                    height='32px'
                                    width='32px'
                                    alt='Avatar Gif' />
                            </Icon>
                        </IconsContainer>
                        <BottomContainer>
                            <Title>
                                {t('level2')}
                            </Title>
                            <PriceContainer>
                                {costs[1] && costs[1].type === ZAP ?
                                    <Interactions />
                                    :
                                    <Bits />
                                }
                                <PriceText>
                                    {costs[1] && costs[1].price.toLocaleString()}
                                </PriceText>
                            </PriceContainer>
                        </BottomContainer>
                    </Tier>
                    <Tier onClick={() => onChangeReactionLevel(3)}
                        style={{
                            background: `url('${level3Gif}')`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat'
                        }}>
                        <IconsContainer>
                            <Icon>
                                <UpgradeArrow />
                            </Icon>
                            <Icon>
                                {randomEmoteUrl ?
                                    <img src={randomEmoteUrl}
                                        height='32px'
                                        width='32px'
                                        alt='Emote' />
                                    :
                                    <CircularProgress size={32} />
                                }
                            </Icon>
                        </IconsContainer>
                        <BottomContainer>
                            <Title>
                                {t('level3')}
                            </Title>
                            <PriceContainer>
                                {costs[2] && costs[2].type === ZAP ?
                                    <Interactions />
                                    :
                                    <Bits />
                                }
                                <PriceText>
                                    {costs[2] && costs[2].price.toLocaleString()}
                                </PriceText>
                            </PriceContainer>
                        </BottomContainer>
                    </Tier>
                </TiersContainer>
            </ReactionTierSelectorContainer>
        </Dialog>
    );
}

export default ReactionTierSelectorDialog;