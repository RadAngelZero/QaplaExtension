import React from 'react';
import { Box, Button, Dialog, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';

import { ReactComponent as Close } from './../../assets/Icons/Close.svg';
import { ReactComponent as Cloud } from './../../assets/Icons/Cloud.svg';
import { ReactComponent as Featured } from './../../assets/Icons/Featured.svg';
import { ReactComponent as VideoLibrary } from './../../assets/Icons/VideoLibrary.svg';

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

const DragDropContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '3px dashed rgba(59, 75, 249, 0.45)',
    borderRadius: '20px',
    width: '60%',
    padding: '50px 42px',
    gap: '26px',
    alignSelf: 'center',
    webkitBoxSizing: 'border-box',
    mozBoxSizing: 'border-box',
    boxSizing: 'border-box',
    marginTop: '106px',
    cursor: 'pointer'
});

const DragDropText = styled(Typography)({
    color: '#fff',
    fontSize: '20px',
    fontWeight: '500',
    lineHeight: '24px',
    textAlign: 'center',
});

const DragDropButton = styled(Button)({
    backgroundColor: '#3B4BF9',
    padding: '16px 24px',
    borderRadius: '100px',
    color: '#fff',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '24px',
    textAlign: 'center',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#3B4BF9',
        opacity: 1,
    },
});

const BottomSheet = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    width: '100%',
    backgroundColor: '#141539',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    padding: '48px 26px',
    bottom: '0px',
    gap: '32px',
});

const BottomSheetOptionContainer = styled(Box)({
    display: 'flex',
    gap: '16px',
    cursor: 'pointer',
});

const BottomSheetOptionTextContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
});

const BottomSheetOptionHeader = styled(Typography)({
    color: '#fff',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '24px',
});

const BottomSheetOptionSubtitle = styled(Typography)({
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '17px',
});

const AddMemeDialog = ({
    openDialog,
    onClose,
    onMemeUploaded,
    setLibraryTab,
    setOpenMemeLibDialog
}) => {

    const dropzone = useDropzone({
        accept: {
            'video/mp4': ['.mp4'],
            'video/mpeg': ['.mpeg'],
            'video/quicktime': ['.mov']
        },
        maxSize: 8388608, // Max size is 8 MB
        onDrop: onMemeUploaded,
        multiple: false,
        noClick: true
    });

    return (
        <BigDialog open={openDialog} {...dropzone.getRootProps()}>
            <Close style={{ position: 'absolute', top: '32px', left: '24px', cursor: 'pointer' }} onClick={onClose} />
            <DragDropContainer onClick={dropzone.open}>
                <input {...dropzone.getInputProps()} />
                <Cloud />
                <DragDropText>{`Upload and share a meme clip`}</DragDropText>
                <DragDropButton onClick={dropzone.open}>
                    {`Upload Video File`}
                </DragDropButton>
            </DragDropContainer>
            <BottomSheet style={{
                display: dropzone.isDragActive ? 'none' : 'flex'
            }}>
                <BottomSheetOptionContainer>
                    <Featured />
                    <BottomSheetOptionTextContainer onClick={() => {
                        setLibraryTab(0);
                        setOpenMemeLibDialog(true);
                    }}>
                        <BottomSheetOptionHeader>{`Add from subscribers library`}</BottomSheetOptionHeader>
                        <BottomSheetOptionSubtitle>{`Choose a meme from subscribers uploads`}</BottomSheetOptionSubtitle>
                    </BottomSheetOptionTextContainer>
                </BottomSheetOptionContainer>
                <BottomSheetOptionContainer onClick={() => {
                        setLibraryTab(1);
                        setOpenMemeLibDialog(true);
                    }}>
                    <VideoLibrary />
                    <BottomSheetOptionTextContainer>
                        <BottomSheetOptionHeader>{`Choose from general library`}</BottomSheetOptionHeader>
                        <BottomSheetOptionSubtitle>{`For all viewers`}</BottomSheetOptionSubtitle>
                    </BottomSheetOptionTextContainer>
                </BottomSheetOptionContainer>
            </BottomSheet>
        </BigDialog>
    );
}

export default AddMemeDialog;
