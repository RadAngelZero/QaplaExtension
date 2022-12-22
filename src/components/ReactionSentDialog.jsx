import React from 'react';
import { Box, Button, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Close } from './../assets/Icons/Close.svg';
import { ReactComponent as SuccessCircle } from './../assets/Icons/SuccessCircle.svg';

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
    marginTop: '32px',
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
    textAlign: 'center'
});

const SendMoreButton = styled(Button)({
    marginTop: '32px',
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

const ReactionSentDialog = ({ open, onClose }) => {
    const { t } = useTranslation('translation', { keyPrefix: 'dialogs.ReactionSentDialog' });

    return (
        <Dialog open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    background: '#141539',
                    borderRadius: '40px'
                }
            }}>
            <CloseIconButton onClick={onClose}>
                <Close />
            </CloseIconButton>
            <Content>
                <SuccessCircle />
                <TextContainer>
                    <Title>
                        {t('sent')}
                    </Title>
                    <Description>
                        {t('alertWillShowUp')}
                    </Description>
                </TextContainer>
                <SendMoreButton onClick={onClose}>
                    {t('sendMoreReactions')}
                </SendMoreButton>
            </Content>
        </Dialog>
    );
}

export default ReactionSentDialog;