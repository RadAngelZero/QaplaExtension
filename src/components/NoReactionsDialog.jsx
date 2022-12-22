import React from 'react';
import { Box, Button, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Close } from './../assets/Icons/Close.svg';
import { ReactComponent as Bits } from './../assets/Icons/Bits.svg';
import ChannelPointsReaction from './../assets/Images/ChannelPointsReaction.png';

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

const NoReactionsDialog = ({ open, onClose, price, onUpgradeReaction }) => {
    const { t } = useTranslation('translation', { keyPrefix: 'dialogs.NoReactionsDialog' });

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
                <img src={ChannelPointsReaction}
                    alt='Channel Points' />
                <TextContainer>
                    <Title>
                        {t('noReactions')}
                    </Title>
                    <Description>
                        <b>
                            {t('descriptionBold')}
                        </b>
                        {t('description')}
                    </Description>
                </TextContainer>
                <UpgradeReactionButton onClick={onUpgradeReaction}
                    endIcon={<Bits style={{ height: '16px', width: '16px' }} />}>
                    {t('upgradeFor')}
                    <span style={{ marginLeft: '4px', color: '#00FFDD' }}>
                        {price}
                    </span>
                </UpgradeReactionButton>
            </Content>
        </Dialog>
    );
}

export default NoReactionsDialog;