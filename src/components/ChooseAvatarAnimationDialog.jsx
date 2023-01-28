import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, IconButton } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import { getAnimationsData } from '../services/database';

import { ReactComponent as Close } from './../assets/Icons/Close.svg';
import { ReactComponent as ExternalLink } from './../assets/Icons/ExternalLink.svg';
import { ReactComponent as QuestionMark } from './../assets/Icons/QuestionMark.svg';

const TopBarContainer = styled(Box)({
    width: '100vw',
    padding: '16px',
    position: 'absolute',
    top: 0,
    webkitBoxSizing: 'border-box',
    mozBoxSizing: 'border-box',
    boxSizing: 'border-box',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'space-between'
});

const IconsContainer = styled(Box)({
});

const AvatarAnimationPreview = styled('img')({
    backgroundColor: '#00020E',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
});

const AvatarPreviewButtonContainer = styled(Box)({
    position: 'absolute',
    bottom: '236px',
    right: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center'
});

const AvatarPreviewButton = styled(Button)({
    maxWidth: '260px',
    backgroundColor: '#3B4BF9',
    borderRadius: '100px',
    padding: '8px 16px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFF',
    textTransform: 'none',
    '&:hover': {
        opacity: .95,
        background: '#3B4BF9'
    }
});

const AnimationsOptionsMenu = styled(Box)({
    backgroundColor: '#0D1021',
    borderRadius: '40px 40px 0px 0px',
    position: 'absolute',
    bottom: 0,
    width: '100vw',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'auto',
    webkitBoxSizing: 'border-box',
    mozBoxSizing: 'border-box',
    boxSizing: 'border-box'
});

const AnimationPicker = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 8,
    alignContent: 'center',
    overflow: 'auto',
    maxWidth: '100%'
});

const GradientContainer = styled(Box)((props) => ({
    padding: 3,
    background: props.active === 'true' ? 'linear-gradient(135deg, #FF9999, #A87EFF)' : '#141539',
    height: 80,
    width: 80,
    borderRadius: 10,
    boxShadow: '0px 2.86125px 7.15312px rgba(0, 0, 0, 0.35)'
}));

const AnimationButton = styled(Button)({
    padding: 3,
    background: '#141539',
    height: 80,
    width: 80,
    borderRadius: 10,
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '14px',
    color: '#FFF',
    textTransform: 'none',
    '&:hover': {
        opacity: .9,
        background: '#141539'
    },
    '&:disabled': {
        background: '#141539',
        color: '#FFF'
    }
});

const UseAnimationButton = styled(Button)({
    marginTop: '32px',
    backgroundColor: '#00FFDD',
    borderRadius: '40px',
    padding: '8px 16px',
    color: '#0D1021',
    fontSize: '17px',
    fontWeight: '600',
    letterSpacing: .49,
    lineHeight: '22px',
    textTransform: 'none',
    '&:hover': {
        opacity: 0.9,
        backgroundColor: '#00FFDD'
    },
    '&:disabled': {
        opacity: 0.4,
        backgroundColor: '#00FFDD'
    }
});

const ChooseAvatarAnimationDialog = ({ open, onClose, avatarId, onAvatarAnimationSelected }) => {
    const [animations, setAnimations] = useState({});
    const [currentAnimation, setCurrentAnimation] = useState(null);
    const { t } = useTranslation('translation', { keyPrefix: 'dialogs.ChooseAvatarAnimationDialog' });

    useEffect(() => {
        async function getAnimation() {
            const animationData = await getAnimationsData();
            const defaultAnimationKey = Object.keys(animationData.val())[0];
            const defaultAnimation = animationData.val()[defaultAnimationKey];
            setCurrentAnimation({ ...defaultAnimation, id: defaultAnimationKey });
            setAnimations(animationData.val());
        }

        getAnimation();
    }, []);

    const changeAnimation = (animation) => {
        setCurrentAnimation(animation);
    }

    const openAvatarFullPreviewTab = () => {
        window.open(`http://localhost:6969/avatar/animation/${avatarId}/${currentAnimation.id}/`, '_blank');
    }

    return (
        <Dialog fullScreen
            open={open}
            onClose={onClose}>
            <TopBarContainer>
                <IconsContainer>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                    <IconButton>
                        <QuestionMark />
                    </IconButton>
                </IconsContainer>
            </TopBarContainer>
            <AvatarAnimationPreview src={currentAnimation ? currentAnimation.gif : ''} />
            <AvatarPreviewButtonContainer>
                <AvatarPreviewButton onClick={openAvatarFullPreviewTab}
                    endIcon={<ExternalLink fill='#FFF' />}>
                    {t('fullPreview')}
                </AvatarPreviewButton>
            </AvatarPreviewButtonContainer>
            <AnimationsOptionsMenu>
                <AnimationPicker>
                    {currentAnimation && Object.keys(animations).map((animationKey, index) => (
                        <GradientContainer key={`gradient-${index}`}
                            active={(currentAnimation.name === animations[animationKey].name).toString()}>
                            <AnimationButton disableRipple
                                disabled={currentAnimation.name === animations[animationKey].name}
                                onClick={() => changeAnimation({ ...animations[animationKey], id: animationKey})}>
                                {animations[animationKey].name}
                            </AnimationButton>
                        </GradientContainer>
                    ))}
                </AnimationPicker>
                <UseAnimationButton onClick={() => onAvatarAnimationSelected(currentAnimation.id)}>
                    {t('confirm')}
                </UseAnimationButton>
            </AnimationsOptionsMenu>
        </Dialog>
    );
}

export default ChooseAvatarAnimationDialog;