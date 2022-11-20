
import { useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap/'
import Avatar from "../../components/avatar/avatar";

import LoadingComponent from "../loading/LoadingComponent.jsx";


export const Send = (props) => {
    const [loadingChargement, setLoadingChargement] = useState(false);
    const [loading, setLoading] = useState(true)
    const [channel, setChannel] = useState([])
    const [messageConfig, setMessageConfig] = useState({
        message: "",
        guild: props.guildId,
        channel: "",
    })

    useEffect(async () => {
        setLoading(true)
        await Promise.all([
            getChannelGuild()
        ])
        setLoading(false)
    }, [props.guildId])

    let getChannelGuild = async () => {
        console.log("---------------- FETCH CHANNEL ----------------")
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${JSON.parse(window.localStorage.getItem('dataDiscord'))?.access_token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        await fetch(process.env.REACT_APP_HOSTNAME_BOT + "/bot/getchannels/" + props.guildId, requestOptions)
            .then(response => response.json())
            .then((result) => {
                console.log(result.channels)
                setChannel(result.channels.filter(channel => channel.type === 0)
                );
            })
            .catch(console.log)

        console.log("---------------- END FETCH CHANNEL ----------------")
    };


    let selectChannel = (channel) => {
        console.log(channel)
        setMessageConfig({
            ...messageConfig,
            channel
        })
    }

    let listChannel = () => {
        if (channel.length > 0) {
            return channel.map((channel, index) => {
                if (messageConfig.channel == channel.id) {
                    return <p value={channel.id} key={index} onClick={() => selectChannel(channel.id)} className="channelSelected">{channel.name}</p>
                } else {
                    return <p key={index} value={channel.id} onClick={() => selectChannel(channel.id)}>{channel.name}</p>
                }
            })
        }
        else {
            return <option value="">Aucun channel</option>
        }
    }

    let sendmessage = async () => {
        console.log("---------------- SEND MESSAGE ----------------")
        if (messageConfig.message.length == 0 || messageConfig.channel == "" || loadingChargement) return;
        setLoadingChargement(true)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${JSON.parse(window.localStorage.getItem('dataDiscord'))?.access_token}`);

        var raw = await JSON.stringify(messageConfig);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        let url = process.env.REACT_APP_HOSTNAME_BOT

        fetch(url + "/bot/sendto/", requestOptions)
            .then(response => response.json())
            .then((result) => {
                if (result.message) {
                    setMessageConfig({
                        ...messageConfig,
                        message: ""
                    })
                    setLoadingChargement(false)
                }
            })
            .catch(console.log)
    }


    return (
        <>
            {loading ? <LoadingComponent /> :
                <div className="block padding-1 heightMax">
                    <div className="infoActive">
                        <h5>Envoyer un message sur un channel du discord</h5>
                    </div>

                    <div className="separator"></div>

                    <div className="sendMessageContainer">
                        <div className="sendMessageComponent">
                            {/* //Create message component like discord style */}
                            <div className="demo">
                                <div className="message">
                                    <div className="content">
                                        <Avatar classElement="avatar" />
                                        <div className="header_info">
                                            <span className="username">Bouns'bot</span>
                                            <span className="botCertified">
                                                <svg aria-label="Bot certifié" class="botTagVerified-2KCPMa" aria-hidden="false" role="img" width="16" height="16" viewBox="0 0 16 15.2"><path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="currentColor"></path></svg>
                                                BOT
                                            </span>
                                            <span className="timestamp">{new Date().toLocaleDateString()}</span>
                                        </div>
                                        <div className="message_content">
                                            <p>{messageConfig.channel == "" ? "Sélection un channel." : (messageConfig.message ? messageConfig.message : "Bonjour je suis Bouns'bot.")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"SendMessageInput" + (messageConfig.channel == "" || loadingChargement ? " disable" : "")}>
                                <input disabled={messageConfig.channel == "" || loadingChargement} type="text" placeholder="Envoyer un message" value={messageConfig.message} onChange={(e) => setMessageConfig({ ...messageConfig, message: e.target.value })} />
                                <svg width="28px" height="28px" viewBox="0 0 28 28" version="1.1" onClick={() => sendmessage()}>
                                    <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <g id="ic_fluent_send_28_filled" fill="var(--color-principal)" fill-rule="nonzero">
                                            <path d="M3.78963301,2.77233335 L24.8609339,12.8499121 C25.4837277,13.1477699 25.7471402,13.8941055 25.4492823,14.5168992 C25.326107,14.7744476 25.1184823,14.9820723 24.8609339,15.1052476 L3.78963301,25.1828263 C3.16683929,25.4806842 2.42050372,25.2172716 2.12264586,24.5944779 C1.99321184,24.3238431 1.96542524,24.015685 2.04435886,23.7262618 L4.15190935,15.9983421 C4.204709,15.8047375 4.36814355,15.6614577 4.56699265,15.634447 L14.7775879,14.2474874 C14.8655834,14.2349166 14.938494,14.177091 14.9721837,14.0981464 L14.9897199,14.0353553 C15.0064567,13.9181981 14.9390703,13.8084248 14.8334007,13.7671556 L14.7775879,13.7525126 L4.57894108,12.3655968 C4.38011873,12.3385589 4.21671819,12.1952832 4.16392965,12.0016992 L2.04435886,4.22889788 C1.8627142,3.56286745 2.25538645,2.87569101 2.92141688,2.69404635 C3.21084015,2.61511273 3.51899823,2.64289932 3.78963301,2.77233335 Z" id="🎨-Color" />
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <div className="channelForSend">
                                {listChannel()}
                            </div>
                        </div>

                    </div>
                </div>}
            {/* <div>{JSON.stringify(channel)}</div> */}

        </>
    )
}


