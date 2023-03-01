import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Box, CircularProgress, Dialog, Typography } from '@mui/material';

import { uploadSubMeme } from '../services/storage';
import { subsMemesModeration } from '../services/functions';

const BigDialog = styled(Dialog)({
    '.MuiDialog-root': {
        // width: '100%',
    },
    '.MuiDialog-container': {
        // width: '100%',
        // padding: '0',
    },
    '.MuiDialog-paper': {
        display: 'flex',
        background: '#0D1021',
        width: '100vw',
        height: '100%',
        margin: 0,
        maxHeight: '100%',
        borderRadius: '0px',
        webkitBoxSizing: 'border-box',
        mozBoxSizing: 'border-box',
        boxSizing: 'border-box',
        overflow: 'hidden',
    },
});

const BottomSheet = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    backgroundColor: '#141539',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    padding: '24px',
    bottom: '0px',
    height: '96%',
    webkitBoxSizing: 'border-box',
    mozBoxSizing: 'border-box',
    boxSizing: 'border-box',
});

const ProgressLabelContainer = styled(Box)({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

const ProgressLabel = styled(Typography)({
    fontSize: '24px',
    fontWeight: '700',
    color: '#FFF'
});

const UploadingMemeDialog = ({ open, onClose, fileToUpload, onSuccessfulUpload }) => {
    const [uploadProgress, setUploadProgress] = useState(50);

    useEffect(() => {
        if (open && fileToUpload && fileToUpload.file) {
            uploadSubMeme(fileToUpload.file, (progress) => {
                setUploadProgress(progress / 2);
            }, async (url, filePath) => {
                try {
                    const result = await subsMemesModeration(filePath);
                    setUploadProgress(75);
                    if (result.data) {
                        if (result.data.accepted) {
                            setUploadProgress(100);
                            setTimeout(() => {
                                onSuccessfulUpload(url);
                            }, 375);
                        } else {
                            // Rejected
                            console.log('Rejected');
                        }
                    } else {
                        // Error?
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        }
    }, [open, fileToUpload]);

    return (
        <BigDialog open={open}
            onClose={onClose}>
            <BottomSheet>
                <CircularProgress value={uploadProgress}
                    variant='determinate'
                    sx={{
                        color: '#00FFDD'
                    }}
                    size={134}
                    thickness={2} />
                <ProgressLabelContainer>
                    <ProgressLabel>
                        {uploadProgress.toFixed(0)}%
                    </ProgressLabel>
                </ProgressLabelContainer>
            </BottomSheet>
        </BigDialog>
    );
}

export default UploadingMemeDialog;