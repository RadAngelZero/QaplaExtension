import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import { getRandomGifByLibrary } from '../services/database';

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

const UnderstoodButton = styled(Button)({
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

const ReactionsSnoozedDialog = ({ open, onClose }) => {
    const [gif, setGif] = useState('');
    const { t } = useTranslation('translation', { keyPrefix: 'dialogs.ReactionsSnoozedDialog' });

    useEffect(() => {
        async function loadGif() {
            const gif = await getRandomGifByLibrary('StreamerOffline');

            setGif(gif.val());
        }

        loadGif();
    }, []);

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
                        {t('reactionsSnoozed')}
                    </Title>
                    <Description>
                        {t('streamsHasReactionsDisabled')}
                    </Description>
                </TextContainer>
                <UnderstoodButton onClick={onClose}>
                    {t('understood')}
                </UnderstoodButton>
            </Content>
        </Dialog>
    );
}

export default ReactionsSnoozedDialog;