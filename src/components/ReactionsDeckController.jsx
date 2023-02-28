import React, { useCallback, useEffect, useState } from 'react';

import { useAuth } from '../hooks/AuthProvider';
import { useTwitch } from '../hooks/TwitchProvider';

import { listenToSubDeck, listenToViewerDeck, saveMemeOnDeckSlot, sendReaction, substractZaps } from '../services/database';
import { uploadSubMeme } from '../services/storage';
import { subsMemesModeration } from '../services/functions';

import { ZAP } from '../constants';

import ReactionsDeckDialog from './ReactionsDeckDialog';
import AddMemeDialog from './AddMemeDialog';

const ReactionsDeckController = ({ open, streamerUid, streamerName }) => {
    const [deckData, setDeckData] = useState(null);
    const [quickReactionCost, setQuickReactionCost] = useState(null);
    const [userIsSub, setUserIsSub] = useState(false);
    const [openAddMemeDialog, setopenAddMemeDialog] = useState(true);
    const user = useAuth();
    const twitch = useTwitch();

    useEffect(() => {
        async function loadDeck() {
            if (twitch) {
                if (twitch.viewer.subscriptionStatus) {
                    setUserIsSub(true);
                    // Load sub deck
                    await listenToSubDeck('613408163', streamerUid, (deck) => {
                        setDeckData(deck.exists() ? deck.val() : []);
                        setQuickReactionCost({ type: ZAP, price: 0 });
                    });
                } else {
                    setUserIsSub(false);
                    // Load viewer deck
                    await listenToViewerDeck('613408163', streamerUid, (deck) => {
                        setDeckData(deck.exists() ? deck.val() : []);
                        setQuickReactionCost({ type: ZAP, price: 0 });
                    });
                }
            }
        }

        if (user && /* user.uid && */ streamerUid && twitch) {
            loadDeck();
        }
    }, [user, streamerUid, twitch]);

    const onSendMeme = (memeData) => {
        const isZapReaction = quickReactionCost.type === ZAP;
        if (isZapReaction) {
            writeQuickReaction(memeData, true);
        } else {
            twitch.bits.onTransactionComplete((transactionObject) => {
                if (transactionObject.initiator === 'current_user') {
                    writeQuickReaction(quickReactionCost.price, false);
                }
            });

            twitch.bits.useBits(quickReactionCost.twitchSku);
        }
    }

    const writeQuickReaction = async (memeData, isZapReaction) => {
        if (quickReactionCost) {

            /**
             * Quick reactions are just the simplest version of reactions, so we can send them using the same
             * method and omitting some parameters
             */
            await sendReaction(
                !isZapReaction ? quickReactionCost.price : 0,
                user.uid,
                user.userName,
                user.twitchUsername,
                user.photoUrl,
                streamerUid,
                streamerName,
                memeData,
                '',
                {},
                null,
                (new Date()).getTime(),
                user.avatarId,
                user.avatarBackground,
                null,
                null,
                isZapReaction
            );

            if (isZapReaction) {
                await substractZaps(user.uid, streamerUid, quickReactionCost.price);
            }
        }
    }

    const onUploadMeme = () => {
        setopenAddMemeDialog(true);
    }

    const onMemeUploaded = useCallback(async (files, rejectedFiles) => {
        if (rejectedFiles[0] && rejectedFiles[0].errors && rejectedFiles[0].errors[0] && rejectedFiles[0].errors[0].code) {
            switch (rejectedFiles[0].errors[0].code) {
                case 'file-too-large':
                    // 8mb exceeded
                    break;
                case 'file-invalid-type':
                    // Invalid type
                    break;
                default:
                    break;
            }
        }

        if (files && files[0]) {
            const file = files[0];
            try {
                // Create a video
                const video = document.createElement('video');
                video.autoplay = false;

                // Preload their metadata
                video.preload = 'metadata';

                // When metadata is ready
                video.onloadedmetadata = () => {

                    //Check length of the video
                    if (video.duration <= 8) {
                        uploadSubMeme(file, (progress) => {
                        }, async (url, filePath) => {
                            try {
                                const result = await subsMemesModeration(filePath);
                                if (result.data) {
                                    if (result.data.accepted) {
                                        // Testing deckData.length
                                        saveMemeOnDeckSlot(user.uid, streamerUid, deckData.length, {
                                            url,
                                            width: video.videoWidth,
                                            height: video.videoHeight,
                                            id: 'elasticId',
                                            name: 'Name'
                                        });
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
                    } else {
                        console.log('Don`t upload meme');
                    }
                };

                video.src = URL.createObjectURL(file);
            } catch (e) {
                console.log(e);
            }
        }

    }, [user, streamerUid]);

    return (
        <>
        <ReactionsDeckDialog open={open}
            userTwitchId={user.twitchId}
            deckData={deckData}
            userIsSub={userIsSub}
            onSendMeme={onSendMeme}
            quickReactionCost={quickReactionCost}
            onUploadMeme={onUploadMeme}
            onMemeUploaded={onMemeUploaded} />
        <AddMemeDialog open={openAddMemeDialog}
            onClose={() => setopenAddMemeDialog(false)}
            onMemeUploaded={onMemeUploaded} />
        </>
    );
}

export default ReactionsDeckController;