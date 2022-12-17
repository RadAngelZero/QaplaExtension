import React, { useEffect, useState } from 'react';

import TweetReactionView from './TweetReactionView';
import { CUSTOM_TTS_VOICE, EMOTE, GIPHY_GIFS, GIPHY_STICKERS, GIPHY_TEXT, MEMES } from '../../constants';
import GiphyMediaSelectorDialog from '../../components/GiphyMediaSelectorDialog';
import MemeMediaSelectorDialog from '../../components/MemeMediaSelectorDialog';
import ReactionTierSelectorDialog from '../../components/ReactionTierSelectorDialog';
import ChooseBotVoiceDialog from '../../components/ChooseBotVoiceDialog';
import { useTwitch } from '../../hooks/TwitchProvider';
import { useAuth } from '../../hooks/AuthProvider';
import { getReactionPriceDefault, getStreamerWithTwitchId, loadReactionPriceByLevel } from '../../services/database';
import Create3DTextDialog from '../../components/Create3DTextDialog';
import { getStreamerEmotes } from '../../services/functions';
import EmoteRainDialog from '../../components/EmoteRainDialog';

const TweetReactionController = () => {
    const [message, setMessage] = useState('');
    const [openGiphyDialog, setOpenGiphyDialog] = useState(false);
    const [giphyDialogMediaType, setGiphyDialogMediaType] = useState(GIPHY_GIFS);
    const [openMemeDialog, setOpenMemeDialog] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [openReactionLevelModal, setOpenReactionLevelModal] = useState(false);
    const [reactionLevel, setReactionLevel] = useState(3);
    const [extraTip, setExtraTip] = useState(null);
    const [tipping, setTipping] = useState(false);
    const [selectedVoiceBot, setSelectedVoiceBot] = useState(null);
    const [openBotVoiceDialog, setOpenBotVoiceDialog] = useState(false);
    const [costs, setCosts] = useState([0, undefined, undefined]);
    const [streamerUid, setStreamerUid] = useState(null);
    const [custom3DText, setCustom3DText] = useState(null);
    const [open3DTextDialog, setOpen3DTextDialog] = useState(false);
    const [randomEmoteUrl, setRandomEmoteUrl] = useState(undefined);
    const [emotes, setEmotes] = useState([]);
    const [openEmoteRainDialog, setOpenEmoteRainDialog] = useState(false);
    const [selectedEmote, setSelectedEmote] = useState(null);
    const twitch = useTwitch();
    const user = useAuth();

    useEffect(() => {
        async function loadProducts() {
            const products = await twitch.bits.getProducts();

        }

        loadProducts();
    }, []);

    useEffect(() => {
        async function getStreamerUid(streamerId) {
            const streamer = await getStreamerWithTwitchId(streamerId);
            setStreamerUid(Object.keys(streamer.val())[0]);
        }

        async function loadPrices() {
            const costs = [0];

            for (let i = 2; i <= 3; i++) {
                const costSnapshot = await loadReactionPriceByLevel(streamerUid, `level${i}`);
                let cost = null;
                if (costSnapshot.exists()) {
                    cost = costSnapshot.val();
                } else {
                    const defaultCost = await getReactionPriceDefault(`level${i}`);
                    cost = defaultCost.val();
                }

                costs.push(cost);
            }

            setCosts(costs);
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

                        return setRandomEmoteUrl(array.data[0][randomNumber].images.url_1x);
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
                getStreamerUid(user.twitchExtensionData.channelId);
            }
        } else {
            loadPrices();
            loadStreamerEmotes();
        }
    }, [user, streamerUid]);

    const tippingHandler = () => {
        setTipping(!tipping);
    }

    const setTip = (num) => {
        setExtraTip(num);
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
                setOpenEmoteRainDialog(true);
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

    const onEmoteSelected = (emote) => {
        setSelectedEmote({
            url: emote,
            title: 'Emote Raid',
            type: EMOTE,
            onRemove: () => setSelectedEmote(null),
            timestamp: new Date().getTime()
        });
        setOpenEmoteRainDialog(false);
    }

    let availableContent = [];
    switch (reactionLevel) {
        case 1:
            availableContent = [
                GIPHY_GIFS,
                GIPHY_STICKERS,
                MEMES
            ];
            break;
        case 2:
            availableContent = [
                GIPHY_TEXT,
                CUSTOM_TTS_VOICE,
                GIPHY_GIFS,
                GIPHY_STICKERS,
                MEMES,
            ];
            break;
        case 3:
            availableContent = [
                EMOTE,
                GIPHY_TEXT,
                CUSTOM_TTS_VOICE,
                GIPHY_GIFS,
                GIPHY_STICKERS,
                MEMES,
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

    return (
        <>
            <TweetReactionView
                message={message}
                setMessage={setMessage}
                onMediaOptionClick={onMediaOptionClick}
                selectedMedia={selectedMedia}
                cleanSelectedMedia={() => setSelectedMedia(null)}
                mediaSelectorBarOptions={availableContent}
                reactionLevel={reactionLevel}
                tipping={tipping}
                tippingHandler={tippingHandler}
                extraTip={extraTip}
                setExtraTip={setTip}
                onChangeReactionLevel={() => setOpenReactionLevelModal(true)}
                voiceBot={selectedVoiceBot}
                custom3DText={custom3DText}
                onRemoveCustom3DText={() => setCustom3DText(null)}
                randomEmoteUrl={randomEmoteUrl}
                userImage={user && user.photoUrl ? user.photoUrl : null}
                emoteRaid={selectedEmote} />
            {/*
            <TweetReactionScreen onSend={this.onSendReaction}
                sending={this.state.sending}
                qoins={this.state.reactionLevel !== 1}
                currentReactioncost={this.state.costs[this.state.reactionLevel - 1]}
                costsPerReactionLevel={this.state.costs}
                mediaSelectorBarOptions={availableContent}
                numberOfReactions={this.state.numberOfReactions}
                avatarReaction={this.state.avatarReaction}
                custom3DText={this.state.custom3DText}
                onRemoveCustom3DText={() => this.setState({ custom3DText: null })}
                voiceBot={this.state.selectedVoiceBot}
                emoteRaid={this.state.selectedEmote}
                openTutorial={!this.state.tutorialDone}
                onChangeReactionLevel={() => this.setState({ openReactionLevelModal: true })}
                onClosingTutorial={this.onClosingTutorial}
                disableExtraTip={this.state.disableExtraTip}
                message={this.state.message}
                onMessageChanged={(message) => this.setState({ message })}
                onMediaOptionPress={this.onMediaOptionPress}
                randomEmoteUrl={this.state.randomEmoteUrl}
                mediaType={this.state.mediaType}
                selectedMedia={this.state.selectedMedia}
                cleanSelectedMedia={() => this.setState({ selectedMedia: null })}
                extraTip={this.state.extraTip}
                setExtraTip={this.setExtraTip}
                streamerImage={this.state.streamerData.streamerImage}
                streamerUid={this.state.streamerData.streamerUid}
                onCancel={() => this.props.navigation.dismiss()}
                onOpenSearchStreamerModal={() => this.setState({ openSearchStreamerModal: true })}
                onUpgradeReaction={this.onUpgradeReaction} />
         */}
            <GiphyMediaSelectorDialog open={openGiphyDialog}
                onClose={() => setOpenGiphyDialog(false)}
                mediaType={giphyDialogMediaType}
                onMediaSelected={onMediaSelected} />
            <MemeMediaSelectorDialog open={openMemeDialog}
                onClose={() => setOpenMemeDialog(false)}
                onMediaSelected={onMediaSelected} />
            <ReactionTierSelectorDialog open={openReactionLevelModal}
                onClose={() => setOpenReactionLevelModal(false)}
                costs={costs}
                changeReactionLevel={setReactionLevel} />
            <ChooseBotVoiceDialog open={openBotVoiceDialog}
                onClose={() => setOpenBotVoiceDialog(false)}
                currentVoice={selectedVoiceBot ? selectedVoiceBot.key : null}
                onVoiceSelected={onVoiceSelected} />
            <Create3DTextDialog open={open3DTextDialog}
                onClose={() => setOpen3DTextDialog(false)}
                defaultMessage={message}
                on3DTextSelected={on3DTextSelected} />
            <EmoteRainDialog open={openEmoteRainDialog}
                onClose={() => setOpenEmoteRainDialog(false)}
                emotes={emotes}
                onEmoteSelected={onEmoteSelected} />
        </>
    );
}

export default TweetReactionController;
