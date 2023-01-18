import React from 'react';
import styled from '@emotion/styled';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ReactComponent as ExternalLink } from './../assets/Icons/ExternalLink.svg';

const Container = styled(Box)({
    height: '100vh',
    background: `url('./assets/QaplaExtensionBackground.jpg') no-repeat center center fixed`,
    backgroundSize: 'cover',
    justifyContent: 'center',
    alignContent: 'center',
    display: 'flex'
});

const Card = styled(Box)({
    padding: '36px 32px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#141833',
    boxShadow: '0px 4px 80px 15px rgba(0, 0, 0, 0.75)',
    borderRadius: '35px',
    alignSelf: 'center',
    minWidth: '460px',
    webkitBoxSizing: 'border-box',
    mozBoxSizing: 'border-box',
    boxSizing: 'border-box',
});

const CardTitle = styled(Typography)({
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '1px',
    background: 'linear-gradient(240.69deg, #FFD3FB 23.14%, #F5FFCB 51.88%, #9FFFDD 82.48%)',
    backgroundClip: 'text',
    textFillColor: 'transparent'
});

const CardInstructions = styled(Typography)({
    marginTop: '16px',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '19px',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    whiteSpace: 'pre-line'
});

const CardButton = styled(Button)({
    marginTop: '32px',
    background: '#00FFDD',
    boxShadow: '0px 20px 40px -10px rgba(0, 255, 221, 0.2)',
    borderRadius: '16px',
    fontSize: '18px',
    fontWeight: '700',
    color: '#141833',
    paddingTop: '16px',
    paddingBottom: '16px',
    textTransform: 'none',
    '&:hover': {
        background: '#00FFDD',
        opacity: .9
    }
});

const Config = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'Config' });

    /**
     * In another tab of the browser request the user autorization to link their Twitch Account with our Twitch App
     * The redirect_uri is the link to our dashboard, where user can configure their settings and get their overlay
     * url for their OBS
     */
    const uri = `https://id.twitch.tv/oauth2/authorize?` +
        `client_id=3cwpzmazn716nmz6g1087kh4ciu4sp&` +
        `redirect_uri=https://dashboard.qapla.gg/&` +
        `response_type=code&` +
        `scope=user:read:email%20user:edit%20bits:read%20user:edit%20channel:read:subscriptions%20channel:manage:redemptions%20channel:read:redemptions%20moderation:read`;

    return (
        <Container>
            <Card>
                <CardTitle>
                    {t('welcome')}
                </CardTitle>
                <CardInstructions>
                    {t('instructions')}
                </CardInstructions>
                <CardButton fullWidth
                    endIcon={<ExternalLink />}
                    href={uri}
                    target='_blank'>
                    {t('openDashboard')}
                </CardButton>
            </Card>
        </Container>
    );
}

export default Config;