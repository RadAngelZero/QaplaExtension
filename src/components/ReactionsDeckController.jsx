import React, { useEffect, useState } from 'react';

import { useAuth } from '../hooks/AuthProvider';
import { useTwitch } from '../hooks/TwitchProvider';

import { getSubsDeck, getViewerDeck, sendReaction, substractZaps } from '../services/database';

import { ZAP } from '../constants';

import ReactionsDeckDialog from './ReactionsDeckDialog';

const ReactionsDeckController = ({ open, streamerUid, streamerName }) => {
    const [deckData, setDeckData] = useState(null);
    const [quickReactionCost, setQuickReactionCost] = useState(null);
    const [userIsSub, setUserIsSub] = useState(false);
    const user = useAuth();
    const twitch = useTwitch();

    useEffect(() => {
        async function loadDeck() {
            if (twitch) {
                if (twitch.viewer.subscriptionStatus) {
                    setUserIsSub(true);
                    // Load sub deck
                    const deck = await getSubsDeck('613408163', streamerUid);
                    setDeckData(deck.exists() ? deck.val() : {});
                    setQuickReactionCost({ type: ZAP, price: 0 });
                } else {
                    setUserIsSub(false);
                    // Load view deck
                    const deck = await getViewerDeck('613408163', streamerUid);
                    setDeckData(deck.exists() ? deck.val() : {});
                    setQuickReactionCost({ type: ZAP, price: 0 });
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

    return (
        <ReactionsDeckDialog open={open}
            userTwitchId={user.twitchId}
            deckData={deckData ? Object.keys(deckData).map((id) => ({ ...deckData[id], id })) : null}
            userIsSub={userIsSub}
            onSendMeme={onSendMeme}
            quickReactionCost={quickReactionCost} />
    );
}

export default ReactionsDeckController;