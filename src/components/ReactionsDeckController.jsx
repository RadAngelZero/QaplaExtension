import React, { useEffect, useState } from 'react';

import { useAuth } from '../hooks/AuthProvider';
import { useTwitch } from '../hooks/TwitchProvider';

import { listenToSubDeck, listenToViewerDeck, sendReaction, substractZaps, updateMemeOnSubDeckSlot, writeFullSubDeck } from '../services/database';

import { ZAP } from '../constants';

import ReactionsDeckDialog from './ReactionsDeckDialog';
import AddMemeDialogController from './AddMemeDialog/AddMemeDialogController';

const ReactionsDeckController = ({ open, streamerUid, streamerName }) => {
    const [deckData, setDeckData] = useState(null);
    const [quickReactionCost, setQuickReactionCost] = useState(null);
    const [userIsSub, setUserIsSub] = useState(false);
    const [openAddMemeDialog, setopenAddMemeDialog] = useState(false);
    const [indexToAddMeme, setIndexToAddMeme] = useState(0);
    const user = useAuth();
    const twitch = useTwitch();

    useEffect(() => {
        async function loadDeck() {
            if (twitch) {
                if (twitch.viewer.subscriptionStatus) {
                    setUserIsSub(true);
                    // Load sub deck
                    await listenToSubDeck(user.uid, streamerUid, (deck) => {
                        setDeckData(deck.exists() ? deck.val() : []);
                        setQuickReactionCost({ type: ZAP, price: 0 });
                    });
                } else {
                    setUserIsSub(false);
                    // Load viewer deck
                    await listenToViewerDeck(user.uid, streamerUid, (deck) => {
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

    const onUploadMeme = (index) => {
        console.log(index);
        if (deckData && index < deckData.length) {
            setIndexToAddMeme(index);
        } else {
            setIndexToAddMeme(deckData ? deckData.length : 0);
        }

        setopenAddMemeDialog(true);
    }

    const onRename = (index, newName) => {
        updateMemeOnSubDeckSlot(user.uid, streamerUid, index, { name: newName });
    }

    const onRemove = (index) => {
        const deck = [...deckData];
        deck.splice(index, 1);
        const deckObject = {};
        deck.forEach((deckMeme, index) => {
            deckObject[index] = deckMeme
        });

        writeFullSubDeck(user.uid, streamerUid, deckObject);
    }

    return (
        <>
        <ReactionsDeckDialog open={open}
            userTwitchId={user.twitchId}
            deckData={deckData}
            userIsSub={userIsSub}
            onSendMeme={onSendMeme}
            quickReactionCost={quickReactionCost}
            onUploadMeme={onUploadMeme}
            onRename={onRename}
            onRemove={onRemove} />
        <AddMemeDialogController open={openAddMemeDialog}
            onClose={() => setopenAddMemeDialog(false)}
            uid={user.uid}
            streamerUid={streamerUid}
            indexToAddMeme={indexToAddMeme} />
        </>
    );
}

export default ReactionsDeckController;