import React, { Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { CircularProgress } from '@mui/material';
import { OrbitControls } from '@react-three/drei';

import AvatarAnimation from './AvatarAnimation';

const AvatarAnimationPreview = ({ avatarId, animationData, showAnimation, setShowAnimation }) => {
    const avatarUrl = `https://api.readyplayer.me/v1/avatars/${avatarId}.glb`;

    return (
        <div style={{
            backgroundColor: '#00020E',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {!showAnimation &&
                <CircularProgress sx={{
                    color: '#00FFDD',
                    position: 'absolute'
                }} />
            }
            <div style={{ opacity: showAnimation ? 1 : 0 }}>
                <Canvas camera={{ position: [10, 10, 10], aspect: .5625 }}
                    style={{
                        backgroundColor: 'transparent',
                        width: '100vw',
                        height: '100vh',
                    }}>
                    <ambientLight intensity={1} />
                    <directionalLight intensity={0.4} />
                    <OrbitControls />
                    <primitive object={new THREE.GridHelper(100, 100, '#140034', '#140034')} />
                    <Suspense fallback={null}>
                        <AvatarAnimation avatarUrl={avatarUrl}
                            animationData={animationData}
                            showAnimation={showAnimation}
                            setShowAnimation={setShowAnimation} />
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
}

export default AvatarAnimationPreview;