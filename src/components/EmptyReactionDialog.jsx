import React from 'react';
import { Box, Button, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Close } from './../assets/Icons/Close.svg';
import ReactionsCarousel from './../assets/Images/ReactionsCarousel.png';

const CloseIconButton = styled(IconButton)({
    position: 'absolute',
    top: '16px',
    right: '16px'
});

const Content = styled(DialogContent)({
    padding: '56px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
});

const TextContainer = styled(Box)({
    marginTop: '24px',
});

const Title = styled(Typography)({
    fontSize: '24px',
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center'
});

const Description = styled(Typography)({
    marginTop: '16px',
    fontSize: '16px',
    fontWeight: '400',
    color: '#FFF',
    textAlign: 'center',
    whiteSpace: 'break-spaces'
});

const UpgradeReactionButton = styled(Button)({
    marginTop: '32px',
    width: '100%',
    background: '#3B4BF9',
    borderRadius: '40px',
    fontSize: '17px',
    fontWeight: '600',
    color: '#FFF',
    textTransform: 'none',
    padding: '26px 42px',
    '&:hover': {
        opacity: .9,
        background: '#3B4BF9'
    }
});

const EmptyReactionDialog = ({ open, onClose }) => {
    const { t } = useTranslation('translation', { keyPrefix: 'dialogs.EmptyReactionDialog' });

    return (
        <Dialog open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    background: '#141539',
                    borderRadius: '40px'
                }
            }}
            maxWidth='xs'>
            <CloseIconButton onClick={onClose}>
                <Close />
            </CloseIconButton>
            <Content>
                <img src={ReactionsCarousel}
                    style={{
                        width: '222px',
                        height: '40px'
                    }}
                    alt='Options Carousel' />
                <TextContainer>
                    <Title>
                        {t('reactionEmpty')}
                    </Title>
                    <Description>
                        {t('instructions')}
                    </Description>
                </TextContainer>
                <UpgradeReactionButton onClick={onClose}>
                    {t('addContent')}
                </UpgradeReactionButton>
            </Content>
        </Dialog>
    );
}

export default EmptyReactionDialog;