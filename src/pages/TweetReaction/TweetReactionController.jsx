import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTwitch } from '../../hooks/TwitchProvider';
import { useAuth } from '../../hooks/AuthProvider';
import { useSegment } from '../../hooks/SegmentProvider';

import {
    getAvailableExtraTips,
    getReactionPriceDefault,
    getStreamerWithTwitchId,
    listenToUserReactionsCount,
    sendReaction,
    substractZaps,
    getReactionPriceDefaultForSubs,
    getAreReactionsEnabledFlag,
    listenForStreamerReactionPrice,
    listenForStreamerReactionPriceForSubs
} from '../../services/database';
import { getStreamerEmotes } from '../../services/functions';

import {
    AVATAR,
    AVATAR_OPTION_GIF,
    CUSTOM_TTS_VOICE,
    EMOTE,
    EMOTE_RAIN,
    GIPHY_GIFS,
    GIPHY_STICKERS,
    GIPHY_TEXT,
    HAPPY_VIBE,
    MEMES,
    ZAP
} from '../../constants';

import TweetReactionView from './TweetReactionView';
import GiphyMediaSelectorDialog from '../../components/GiphyMediaSelectorDialog';
import MemeMediaSelectorDialog from '../../components/MemeMediaSelectorDialog';
import ReactionTierSelectorDialog from '../../components/ReactionTierSelectorDialog';
import ChooseBotVoiceDialog from '../../components/ChooseBotVoiceDialog';
import Create3DTextDialog from '../../components/Create3DTextDialog';
import ReactionSentDialog from '../../components/ReactionSentDialog';
import NoReactionsDialog from '../../components/NoReactionsDialog';
import EmptyReactionDialog from '../../components/EmptyReactionDialog';
import CreateAvatarDialog from '../../components/CreateAvatarDialog';
import ChooseAvatarAnimationDialog from '../../components/ChooseAvatarAnimationDialog';
import ReactionsSnoozedDialog from '../../components/ReactionsSnoozedDialog';
import FullScreenEmoteAnimationDialog from '../../components/FullScreenEmoteAnimationDialog';

const TweetReactionController = () => {
    const [message, setMessage] = useState('');
    const [openGiphyDialog, setOpenGiphyDialog] = useState(false);
    const [giphyDialogMediaType, setGiphyDialogMediaType] = useState(GIPHY_GIFS);
    const [openMemeDialog, setOpenMemeDialog] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [openReactionLevelModal, setOpenReactionLevelModal] = useState(false);
    const [reactionLevel, setReactionLevel] = useState(1);
    const [extraTip, setExtraTip] = useState(null);
    const [tipping, setTipping] = useState(false);
    const [selectedVoiceBot, setSelectedVoiceBot] = useState(null);
    const [openBotVoiceDialog, setOpenBotVoiceDialog] = useState(false);
    const [costs, setCosts] = useState([undefined, undefined, undefined]);
    const [subscribersCosts, setSubscribersCosts] = useState([undefined, undefined, undefined]);
    const [streamerUid, setStreamerUid] = useState(null);
    const [custom3DText, setCustom3DText] = useState(null);
    const [open3DTextDialog, setOpen3DTextDialog] = useState(false);
    const [randomEmoteUrl, setRandomEmoteUrl] = useState(undefined);
    const [emotes, setEmotes] = useState([]);
    const [selectedEmote, setSelectedEmote] = useState(null);
    const [numberOfReactions, setNumberOfReactions] = useState(0);
    const [availableTips, setAvailableTips] = useState([]);
    const [sending, setSending] = useState(false);
    const [streamerName, setStreamerName] = useState('');
    const [openSentDialog, setOpenSentDialog] = useState(false);
    const [openNoReactionsDialog, setOpenNoReactionsDialog] = useState(false);
    const [openEmptyReactionDialog, setOpenEmptyReactionDialog] = useState(false);
    const [streamerIsPremium, setStreamerIsPremium] = useState(false);
    const [openCreateAvatarDialog, setOpenCreateAvatarDialog] = useState(false);
    const [openAnimationAvatarDialog, setOpenAnimationAvatarDialog] = useState(false);
    const [avatarAnimation, setAvatarAnimation] = useState(null);
    const [openReactionsSnoozedDialog, setOpenReactionsSnoozedDialog] = useState(false);
    const [costsUpdates, setCostsUpdates] = useState(null);
    const [selectedVibe, setSelectedVibe] = useState(HAPPY_VIBE);
    const [segmentTrackMade, setSegmentTrackMade] = useState(false);
    const [openEmotesAnimationSelectorDialog, setOpenEmotesAnimationSelectorDialog] = useState(false);
    const [selectedEmoteAnimation, setSelectedEmoteAnimation] = useState(EMOTE_RAIN);
    const [selectedEmotes, setSelectedEmotes] = useState([]);
    const [avatarWasCreatedForAnimation, setAvatarWasCreatedForAnimation] = useState(true);
    const [openVibeMenu, setOpenVibeMenu] = useState(false);
    const twitch = useTwitch();
    const user = useAuth();
    const segment = useSegment();
    const { t } = useTranslation('translation', { keyPrefix: 'TweetReactionController' })

    let reactionPaid = false; // Flag for purchases with Twitch, it does not work using useState but it works this way

    useEffect(() => {
        async function loadTips() {
            const extraTips = await getAvailableExtraTips();

            if (extraTips.exists()) {
                setAvailableTips(extraTips.val());
            }
        }

        loadTips();
    }, []);

    useEffect(() => {
        if (user && user.uid && !segmentTrackMade) {
            segment.track('Viewer Opened Extension', {
                Uid: user.uid
            });

            setSegmentTrackMade(true);
        }
    }, [user, segmentTrackMade]);

    useEffect(() => {
        /**
         * If openCreateAvatarDialog is true and avatarId has a valid value, close the create avatar
         * dialog and open the dialog to allow the user to choose an avatar animation
         */
        if (openCreateAvatarDialog && user && user.avatarId) {
            setOpenCreateAvatarDialog(false);
            if (avatarWasCreatedForAnimation) {
                setOpenAnimationAvatarDialog(true);
            } else {
                setOpenVibeMenu(true);
            }
        }
    }, [openCreateAvatarDialog, user, avatarWasCreatedForAnimation]);

    useEffect(() => {
        async function getStreamerData(streamerId) {
            const streamer = await getStreamerWithTwitchId(streamerId);
            let uid = '';
            let streamerName = '';
            let streamerIsPremium = false;
            streamer.forEach((streamer) => {
                uid = streamer.key;
                streamerName = streamer.val().displayName;
                streamerIsPremium = streamer.val().premium;
            });
            setStreamerUid(uid);
            setStreamerName(streamerName);
            setStreamerIsPremium(streamerIsPremium);
        }

        async function loadPrices() {
            const costsArray = [];

            for (let i = 1; i <= 3; i++) {
                listenForStreamerReactionPrice(streamerUid, `level${i}`, async (reactionPrice) => {
                    let costObject = null;
                    if (reactionPrice.exists()) {
                        costObject = reactionPrice.val();
                    } else {
                        const defaultCost = await getReactionPriceDefault(`level${i}`);
                        costObject = defaultCost.val();
                    }

                    // Overwrite price value if price is for bits reaction
                    costObject.price = costObject.type === ZAP ? costObject.price : costObject.bitsPrice;

                    costsArray[i - 1] = costObject;

                    if (costsArray.length === 3) {
                        setCostsUpdates(costsArray[i - 1]);
                        setCosts(costsArray);
                    }
                });
            }

            if (streamerIsPremium) {
                const subscribersCosts = [];
                for (let i = 1; i <= 3; i++) {
                    listenForStreamerReactionPriceForSubs(streamerUid, `level${i}`, async (reactionPrice) => {
                        let costObject = null;
                        if (reactionPrice.exists()) {
                            costObject = reactionPrice.val();
                        } else {
                            const defaultCost = await getReactionPriceDefaultForSubs(`level${i}`);
                            costObject = defaultCost.val();
                        }

                        // Overwrite price value if price is for bits reaction
                        costObject.price = costObject.type === ZAP ? costObject.price : costObject.bitsPrice;

                        subscribersCosts[i - 1] = costObject;

                        if (subscribersCosts.length === 3) {
                            setCostsUpdates(subscribersCosts[i - 1]);
                            setSubscribersCosts(subscribersCosts);
                        }
                    });
                }
            }
        }

        async function loadStreamerEmotes() {
            const emotesRequest = await getStreamerEmotes(streamerUid);

            if (emotesRequest && emotesRequest.data) {
                let emotes = emotesRequest.data ? emotesRequest.data : null;
                if (emotes) {

                    /**
                     * Twitch don't allow us to use their global emotes in our extension
                     * See 4.3 on the next url for more information
                     * https://dev.twitch.tv/docs/extensions/guidelines-and-policies#4-content-policy
                     */
                    emotes = emotes.filter((emoteList) => (emoteList.key !== 'global'));

                    setEmotes(emotes);

                    // Find the first array who has more than 0 elements
                    const array = emotes.find((typeOfEmote) => typeOfEmote.data[0].length > 0);
                    if (array) {
                        const randomNumber = Math.floor(Math.random() * array.data[0].length);

                        return setRandomEmoteUrl(array.data[0][randomNumber].images.url_4x);
                    }
                }
            }

            /**
             * If for some reason we reach here, that means we could not find an emote, so we set the
             * randomEmoteUrl as null
             */
            setRandomEmoteUrl(null);
        }

        if (!streamerUid) {
            if (user && user.twitchExtensionData && user.twitchExtensionData.channelId) {
                getStreamerData(user.twitchExtensionData.channelId);
            }
        } else {
            loadPrices();
            loadStreamerEmotes();
            listenToUserReactionsCount(user.uid, streamerUid, (count) => {
                setNumberOfReactions(count.exists() ? count.val() : 0);
            });
        }
    }, [user, streamerUid]);

    /**
     * For some reason, updating arrays don't trigger re renders with hooks, so we use this variable only to update the prices
     * in the UI for the user, we write something in it and then we set it to null here so every time we write something we are sure
     * react is going to render again (two times, but at least we know it will always render)
     */
    useEffect(() => {
        if (costsUpdates) {
            setCostsUpdates(null);
        }
    }, [costsUpdates]);

    const toggleTipping = () => {
        setTipping(!tipping);
    }

    const setTip = (tipObject) => {
        setExtraTip(tipObject);
        setTipping(false);
    }

    const onMediaOptionClick = (mediaType) => {
        switch (mediaType) {
            case GIPHY_GIFS:
            case GIPHY_STICKERS:
                setGiphyDialogMediaType(mediaType);
                setOpenGiphyDialog(true);
                break;
            case MEMES:
                setOpenMemeDialog(true);
                break;
            case CUSTOM_TTS_VOICE:
                setOpenBotVoiceDialog(true);
                break;
            case GIPHY_TEXT:
                setOpen3DTextDialog(true);
                break;
            case EMOTE:
                setOpenEmotesAnimationSelectorDialog(true);
                break;
            case AVATAR:
                if (user.avatarId) {
                    setOpenAnimationAvatarDialog(true);
                } else {
                    setOpenCreateAvatarDialog(true);
                }
                break;
            default:
                break;
        }
    }

    const onMediaSelected = (media) => {
        setSelectedMedia(media);
        setOpenGiphyDialog(false);
        setOpenMemeDialog(false);
    }

    const on3DTextSelected = (message, custom3DText) => {
        setMessage(message);
        setCustom3DText(custom3DText);
        setOpen3DTextDialog(false);
    }

    const onVoiceSelected = (selectedVoiceBot) => {
        if (selectedVoiceBot) {
            setSelectedVoiceBot({
                ...selectedVoiceBot,
                title: selectedVoiceBot.key,
                type: CUSTOM_TTS_VOICE,
                onRemove: () => setSelectedVoiceBot(null),
                timestamp: new Date().getTime()
            });
        } else {
            setSelectedVoiceBot(null);
        }
    }

    const onAvatarAnimationSelected = (animationId) => {
        setAvatarAnimation({
            url: AVATAR_OPTION_GIF,
            id: animationId,
            title: 'Avatar On',
            type: AVATAR,
            onRemove: () => setAvatarAnimation(null),
            timestamp: new Date().getTime()
        });
        setOpenAnimationAvatarDialog(false);
    }

    const onUpgradeReaction = (reactionLevel, mediaUnlocked) => {
        onMediaOptionClick(mediaUnlocked);
        setReactionLevel(reactionLevel);

        // Remove options not available in the selected tier
        switch (reactionLevel) {
            case 1:
                setSelectedVoiceBot(null);
                setCustom3DText(null);
                setSelectedEmote(null);
                setAvatarAnimation(null);
                break;
            case 2:
                setSelectedEmote(null);
                break;
            default:
                break;
        }
    }

    const onEmoteAnimationSelected = (selectedEmotes, selectedAnimation) => {
        setSelectedEmoteAnimation(selectedAnimation);
        setSelectedEmotes(selectedEmotes);
        setOpenEmotesAnimationSelectorDialog(false);

        // Necessary to show pill on UI
        setSelectedEmote({
            url: selectedEmotes[0],
            title: t(selectedAnimation),
            type: EMOTE,
            onRemove: () => { setSelectedEmotes([]); setSelectedEmote(null); },
            timestamp: new Date().getTime()
        });
    }

    const createAvatarForTTS = () => {
        setOpenCreateAvatarDialog(true);
        setAvatarWasCreatedForAnimation(false);
    }

    const writeReaction = async (bits, channelPointsReaction = false, zapsCost) => {
        let messageExtraData = selectedVoiceBot ?
            {
                voiceAPIName: selectedVoiceBot.voiceAPIName,
                voiceName: selectedVoiceBot.key
            }
            :
            {};

        messageExtraData.giphyText = custom3DText ?
            custom3DText
            :
            {};

        await sendReaction(
            bits,
            user.uid,
            user.userName,
            user.twitchUsername,
            user.photoUrl,
            streamerUid,
            streamerName,
            selectedMedia ?
                {
                    ...selectedMedia
                }
                :
                {},
            message,
            messageExtraData,
            {
                type: EMOTE,
                emojis: selectedEmotes,
                animationId: selectedEmoteAnimation
            },
            (new Date()).getTime(),
            user.avatarId,
            user.avatarBackground,
            avatarAnimation ? avatarAnimation.id : '',
            selectedVibe,
            channelPointsReaction
        );

        if (channelPointsReaction) {
            await substractZaps(user.uid, streamerUid, zapsCost);
        }

        setOpenSentDialog(true);

        const currentReactionCost = (streamerIsPremium && twitch.viewer.subscriptionStatus) ? subscribersCosts[reactionLevel - 1] : costs[reactionLevel - 1];
        segment.track('Reaction Sent', {
            Bits: bits,
            ExtraBits: channelPointsReaction ? bits : currentReactionCost - bits,
            IsZapReaction: channelPointsReaction,
            ReactionCost: currentReactionCost,
            ReactionHasMessage: message !== '',
            ReactionHasMedia: Boolean(selectedMedia).valueOf(),
            ReactionHasCustomVoice: messageExtraData.voiceAPIName !== undefined,
            ReactionHasGiphyText: messageExtraData.giphyText !== {},
            ReactionHasEmoteRain: selectedEmotes.length > 0,
            ReactionHasAvatarAnimation: Boolean(avatarAnimation).valueOf(),
            SentTo: streamerUid,
            UserHasAvatar: Boolean(user.avatarId).valueOf(),
            ZapsCost: zapsCost
        });
    }

    const onSendReaction = async () => {
        const sendButtonDisabled = (!message && !selectedMedia);
        if (sendButtonDisabled) {
            return setOpenEmptyReactionDialog(true);
        }

        const areReactionsEnabled = await getAreReactionsEnabledFlag(streamerUid);

        // If reactionsEnabled flag does not exist or exists and it is true, send the reaction
        if (!areReactionsEnabled.exists() || (areReactionsEnabled.exists() && areReactionsEnabled.val())) {
            if (!sending) {
                setSending(true);
                /**
                 * If the streamer is a Qapla premium user and the user using the extension is a subscriber of the channel, show the
                 * preferential reactions costs for subs defined by the streamer
                 */
                const currentReactionCost = (streamerIsPremium && twitch.viewer.subscriptionStatus) ? subscribersCosts[reactionLevel - 1] : costs[reactionLevel - 1];
                if (currentReactionCost.type !== ZAP) {
                    twitch.bits.onTransactionComplete((transactionObject) => {
                        if (transactionObject.initiator === 'current_user') {
                            // Transaction comes from reaction payment
                            if (!reactionPaid) {
                                reactionPaid = true

                                if (extraTip) {
                                    // Reaction paid, charge extra tip now
                                    twitch.bits.useBits(extraTip.twitchSku);
                                } else {
                                    // Reaction paid and no extra tip, write reaction
                                    writeReaction(currentReactionCost.price);
                                }
                            } else {
                                // Reaction and extra tip are paid, write reaction
                                writeReaction(currentReactionCost.price + extraTip.cost);
                            }
                        }
                    });

                    twitch.bits.onTransactionCancelled(() => {
                        // If the user already paid the reaction, but he canceled the extra tip
                        if (reactionPaid) {
                            // Send the reaction only with the Bits he actually paid
                            writeReaction(currentReactionCost.price);
                        }

                        // In any case, unlock the sending button
                        setSending(false);
                    });

                    // Listeners are set, start the purchase attempt
                    twitch.bits.useBits(currentReactionCost.twitchSku);
                } else {
                    // Check if user has enough Zaps to react
                    if (numberOfReactions >= currentReactionCost.price) {
                        if (extraTip) {
                            // Channel point reaction but with extra tip
                            twitch.bits.onTransactionComplete((transactionObject) => {
                                if (transactionObject.initiator === 'current_user') {
                                    // Extra tip paid, write reaction
                                    writeReaction(extraTip.cost, true, currentReactionCost.price);
                                }
                            });

                            twitch.bits.onTransactionCancelled(() => {
                                // If the user cancels the purchase unlock the sending button and show tip menu
                                setSending(false);
                                toggleTipping();
                            });

                            // Listeners are set, start the purchase attempt
                            twitch.bits.useBits(extraTip.twitchSku);
                        } else {
                            // Channel point reaction, don't charge products and write reaction
                            writeReaction(0, true, currentReactionCost.price);
                        }
                    } else {
                        setOpenNoReactionsDialog(true);
                        setSending(false);
                    }
                }
            }
        } else {
            // If reactionsEnabled flag exists and it is false open ReactionsSnoozedDialog
            setOpenReactionsSnoozedDialog(true);
        }
    }

    const resetReaction = () => {
        // Reset all variables
        setMessage('');
        setSelectedMedia(null);
        setExtraTip(null);
        setSelectedVoiceBot(null);
        setCustom3DText(null);
        setSelectedEmotes([]);
        setSelectedEmote(null);
        setSending(false);
        setAvatarAnimation(null);
        reactionPaid = false;

        // Close modal
        setOpenSentDialog(false);
    }

    let availableContent = [];
    switch (reactionLevel) {
        case 1:
            availableContent = [
                GIPHY_GIFS,
                MEMES,
                GIPHY_STICKERS
            ];
            break;
        case 2:
            availableContent = [
                GIPHY_GIFS,
                MEMES,
                GIPHY_STICKERS,
                GIPHY_TEXT,
                CUSTOM_TTS_VOICE,
                AVATAR
            ];
            break;
        case 3:
            availableContent = [
                GIPHY_GIFS,
                MEMES,
                GIPHY_STICKERS,
                GIPHY_TEXT,
                CUSTOM_TTS_VOICE,
                AVATAR,
                EMOTE
            ];
            break;
        default:
            availableContent = [
                GIPHY_GIFS,
                GIPHY_STICKERS,
                MEMES,
            ];
            break;
    }

    /**
     * If the streamer is a Qapla premium user and the user using the extension is a subscriber of the channel, show the
     * preferential reactions costs for subs defined by the streamer
     */
    const currentReactionCost = (streamerIsPremium && twitch.viewer.subscriptionStatus) ? subscribersCosts[reactionLevel - 1] : costs[reactionLevel - 1];
    const costsPerReactionLevel = (streamerIsPremium && twitch.viewer.subscriptionStatus) ? subscribersCosts : costs;

    return (
        <>
            <TweetReactionView onSend={onSendReaction}
                sending={sending}
                numberOfReactions={numberOfReactions}
                message={message}
                setMessage={setMessage}
                currentReactionCost={currentReactionCost}
                costsPerReactionLevel={costsPerReactionLevel}
                onMediaOptionClick={onMediaOptionClick}
                selectedMedia={selectedMedia}
                cleanSelectedMedia={() => setSelectedMedia(null)}
                mediaSelectorBarOptions={availableContent}
                reactionLevel={reactionLevel}
                tipping={tipping}
                toggleTipping={toggleTipping}
                extraTip={extraTip}
                setExtraTip={setTip}
                onChangeReactionLevel={() => setOpenReactionLevelModal(true)}
                voiceBot={selectedVoiceBot}
                custom3DText={custom3DText}
                onRemoveCustom3DText={() => setCustom3DText(null)}
                randomEmoteUrl={randomEmoteUrl}
                userImage={user && user.photoUrl ? user.photoUrl : null}
                emoteRaid={selectedEmote}
                onUpgradeReaction={onUpgradeReaction}
                availableTips={availableTips}
                avatarAnimation={avatarAnimation}
                avatarId={user.avatarId}
                avatarBackground={user.avatarBackground}
                selectedVibe={selectedVibe}
                onChangeSelectedVibe={setSelectedVibe}
                userTwitchId={user.twitchId}
                createAvatarForTTS={createAvatarForTTS}
                openVibeMenu={openVibeMenu}
                setOpenVibeMenu={setOpenVibeMenu} />
            <GiphyMediaSelectorDialog open={openGiphyDialog}
                onClose={() => setOpenGiphyDialog(false)}
                mediaType={giphyDialogMediaType}
                onMediaSelected={onMediaSelected} />
            <MemeMediaSelectorDialog open={openMemeDialog}
                onClose={() => setOpenMemeDialog(false)}
                onMediaSelected={onMediaSelected} />
            <ReactionTierSelectorDialog open={openReactionLevelModal}
                onClose={() => setOpenReactionLevelModal(false)}
                costs={costsPerReactionLevel}
                changeReactionLevel={(level) => onUpgradeReaction(level, null)}
                randomEmoteUrl={randomEmoteUrl} />
            <ChooseBotVoiceDialog open={openBotVoiceDialog}
                onClose={() => setOpenBotVoiceDialog(false)}
                currentVoice={selectedVoiceBot ? selectedVoiceBot.key : null}
                onVoiceSelected={onVoiceSelected} />
            <Create3DTextDialog open={open3DTextDialog}
                onClose={() => setOpen3DTextDialog(false)}
                defaultMessage={message}
                on3DTextSelected={on3DTextSelected} />
            <EmptyReactionDialog open={openEmptyReactionDialog}
                onClose={() => setOpenEmptyReactionDialog(false)} />
            <CreateAvatarDialog open={openCreateAvatarDialog}
                onClose={() => setOpenCreateAvatarDialog(false)}
                userTwitchId={user.twitchId} />
            <ChooseAvatarAnimationDialog open={openAnimationAvatarDialog}
                onClose={() => setOpenAnimationAvatarDialog(false)}
                avatarId={user.avatarId}
                onAvatarAnimationSelected={onAvatarAnimationSelected} />
            <ReactionSentDialog open={openSentDialog}
                onClose={resetReaction} />
            <NoReactionsDialog open={openNoReactionsDialog}
                onClose={() => setOpenNoReactionsDialog(false)}
                currentLevel={reactionLevel}
                costs={costsPerReactionLevel}
                numberOfReactions={numberOfReactions}
                onUpgradeReaction={(level) => { onUpgradeReaction(level, null); setOpenNoReactionsDialog(false); }} />
            <ReactionsSnoozedDialog open={openReactionsSnoozedDialog}
                onClose={() => setOpenReactionsSnoozedDialog(false)} />
            <FullScreenEmoteAnimationDialog open={openEmotesAnimationSelectorDialog}
                onClose={() => setOpenEmotesAnimationSelectorDialog(false)}
                emotes={emotes}
                randomEmoteUrl={randomEmoteUrl}
                onEmoteAnimationSelected={onEmoteAnimationSelected} />
        </>
    );
}

export default TweetReactionController;