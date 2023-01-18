import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import { getRandomGifByLibrary } from '../services/database';
import { useTwitch } from '../hooks/TwitchProvider';

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

const WeNeedPermissionDialog = ({ open, onClose }) => {
    const [gif, setGif] = useState('');
    const { t } = useTranslation('translation', { keyPrefix: 'dialogs.WeNeedPermissionDialog' });
    const twitch = useTwitch();

    useEffect(() => {
        async function loadGif() {
            const gif = await getRandomGifByLibrary('StreamerOffline');

            setGif(gif.val());
        }

        loadGif();
    }, []);

    // User can not close this dialog
    return (
        <Dialog open={true}
            onClose={() => {}}
            PaperProps={{
                style: {
                    background: '#141539',
                    borderRadius: '40px'
                }
            }}
            maxWidth='xs'>
            <Content>
                <img src={gif}
                    style={{
                        maxWidth: '237px',
                        maxHeight: '130px',
                        borderRadius: '20px'
                    }}
                    alt='Sad gif :(' />
                <TextContainer>
                    <Title>
                        {t('weNeedPermission')}
                    </Title>
                    <Description>
                        {t('permissionReason')}
                    </Description>
                </TextContainer>
                <UpgradeReactionButton onClick={twitch.actions.requestIdShare}>
                    {t('managePermission')}
                </UpgradeReactionButton>
            </Content>
        </Dialog>
    );
}

export default WeNeedPermissionDialog;