import "./_guild.css";
import React, { Component } from 'react'
import funPicto from "../picture/funPicto.png";
import musiquePicto from "../picture/musiquePicto.png";
import radioPicto from "../picture/radioPicto.png";
import sheeshPicto from "../picture/sheeshPicto.png";
import playlistPicto from "../picture/playlistPicto.png";
import renamePicto from "../picture/renamePicto.png";
import reactionPicto from "../picture/reactionPicto.png";
import logs from "../picture/logs.png";
import { Form } from 'react-bootstrap/'
// import Slider from '@mui/material/Slider';
import Musique from "../musique/musique.jsx";

class Guild extends Component {
    state = {
        success: false,
        error: false,
        heyreaction: false,
        musique: true,
        playlist: true,
        radio: true,
        rename: true,
        sheesh: false,
        logChannel: false,
        fun: true,
        file: {},
        volume: 0.5,
        loadMusique: false,
        preview: "",
        actualMusique: "",
        channelTextuelGuild: []
    }

    componentDidMount() {
        this.getData();
        this.getChannelGuild();
    }

    getData = () => {
        let id = this.props.match.params.id
        //let url = "https://backendbounsbot.herokuapp.com/guild/"

        //dev
        // let url = "http://localhost:3001/guild/"
        let url = "https://backendbounsbot.herokuapp.com/guild/"

        fetch(url + id)
            .then(response => response.json())
            .then((result) => {
                // console.log(result)
                this.setState({
                    guildInfo: result.guild,
                    heyreaction: result.guild[0].heyreaction,
                    musique: result.guild[0].musique,
                    playlist: result.guild[0].playlist,
                    radio: result.guild[0].radio,
                    rename: result.guild[0].rename,
                    sheesh: result.guild[0].sheesh,
                    logChannel: result.guild[0].logChannel,
                    fun: result.guild[0].fun
                });
            })
            .catch(console.log)
    };

    getChannelGuild = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${JSON.parse(window.localStorage.getItem('dataDiscord'))?.access_token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        let url = "http://localhost:5342"
        // let url = "https://bouns-bot.herokuapp.com"

        fetch(url + "/bot/getchannels/" + this.props.match.params.id,requestOptions)
            .then(response => response.json())
            .then((result) => {
                console.log(result.channels.filter(channel => channel.type === "text"))
                this.setState({
                    channelTextuelGuild: result.channels.filter(channel => channel.type === "text")
                });
            })
            .catch(console.log)
    };

    updateGuildConfig = async () => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = await JSON.stringify({
            "accesstoken": JSON.parse(window.localStorage.getItem('dataDiscord'))?.access_token,
            "guildId": this.state.guildInfo[0]?.guild,
            "logChannel": this.state.logChannel,
            "sheesh": this.state.sheesh,
            "heyreaction": this.state.heyreaction,
            "rename": this.state.rename,
            "musique": this.state.musique,
            "radio": this.state.radio,
            "playlist": this.state.playlist,
            "fun": this.state.fun
        });

        const body = await fetch('https://backendbounsbot.herokuapp.com/guild/'+this.props.match.params.id, {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            mode: 'cors'
        }).catch(console.log)

        console.log(body)

        if(body && body.status === 200)
        {
            this.setState({ success: true })
        }
        else
        {
            this.setState({ error: true })
        }
    }

    render() {
        return (
            <div className="Dashboard">
                <div className="top" style={{justifyContent: "center;"}}>
                    <h1>Information de la guilde</h1> 
                </div>
                <button className="save" onClick={this.updateGuildConfig}>Enregistrer</button>
                {(() => {
                    var rank = [];
                    rank.push(<div className='componentGuild'>
                        <div className="guildModule">
                            <div className="top">
                                <img className="picto" alt='logo' width="48" height="48" src={reactionPicto} ></img>
                                <Form.Check className="picto" type="switch" id="custom-switch success" onChange={() => { this.setState({ heyreaction: !this.state.heyreaction }) }} checked={this.state.heyreaction} />
                            </div>
                            <h5 className="hrnh5k-0 eeKdki sc-1wkjbe7-8 GoZzi">Réactions</h5>
                            <div>Laissez le bot réagir avec 👋 / 💤 suivant le message</div>
                        </div>
                        <div className="guildModule">
                            <div className="top">
                                <img className="picto" alt='logo' width="48" height="48" src={musiquePicto} ></img>
                                <Form.Check type="switch" id="custom-switch success" onChange={() => { this.setState({ musique: !this.state.musique }) }} checked={this.state.musique} />
                            </div>
                            <h5 className="hrnh5k-0 eeKdki sc-1wkjbe7-8 GoZzi">Musique</h5>
                            <div>Laissez vos membres écouter leurs meilleures musiques</div>
                        </div>
                        <div className="guildModule">
                            <div className="top">
                                <img className="picto" alt='logo' width="48" height="48" src={playlistPicto} ></img>
                                <Form.Check type="switch" id="custom-switch success" onChange={() => { this.setState({ playlist: !this.state.playlist }) }} checked={this.state.playlist} />
                            </div>
                            <h5 className="hrnh5k-0 eeKdki sc-1wkjbe7-8 GoZzi">Playlist</h5>
                            <div>Laissez vos membres réaliser / modifier / écouter leurs playlists</div>
                        </div>
                        <div className="guildModule">
                            <div className="top">
                                <img className="picto" alt='logo' width="48" height="48" src={radioPicto} ></img>
                                <Form.Check type="switch" id="custom-switch success" onChange={() => { this.setState({ radio: !this.state.radio }) }} checked={this.state.radio} />
                            </div>
                            <h5 className="hrnh5k-0 eeKdki sc-1wkjbe7-8 GoZzi">Radio</h5>
                            <div>Laissez vos membres écouter une des 41 radios disponibles sur le Bot</div>
                        </div>
                        <div className="guildModule">
                            <div className="top">
                                <img className="picto" alt='logo' width="48" height="48" src={renamePicto} ></img>
                                <Form.Check type="switch" id="custom-switch success" onChange={() => { this.setState({ rename: !this.state.rename }) }} checked={this.state.rename} />
                            </div>
                            <h5 className="hrnh5k-0 eeKdki sc-1wkjbe7-8 GoZzi">Rename</h5>
                            <div>Laissez le bot rename les membres lorsque leur pseudo n'est pas identifiable par la moderation</div>
                        </div>
                        <div className="guildModule">
                            <div className="top">
                                <img className="picto" alt='logo' width="80" height="80" src={sheeshPicto} ></img>
                                <Form.Check type="switch" id="custom-switch success" onChange={() => { this.setState({ sheesh: !this.state.sheesh }) }} checked={this.state.sheesh} />
                            </div>
                            <h5 className="hrnh5k-0 eeKdki sc-1wkjbe7-8 GoZzi">Sheesh</h5>
                            <div>Laissez le bot reagir avec son meilleur SHEEEESHHHH si un membre dit sheesh</div>
                        </div>
                        <div className="guildModule">
                            <div className="top">
                                <img className="picto" alt='logo' width="48" height="48" src={funPicto} ></img>
                                <Form.Check type="switch" id="custom-switch success" onChange={() => { this.setState({ fun: !this.state.fun }) }} checked={this.state.fun} />
                            </div>
                            <h5 className="hrnh5k-0 eeKdki sc-1wkjbe7-8 GoZzi">Fun</h5>
                            <div>Laissez vos membres s'amuser avec des commandes funs et ludiques</div>
                        </div>
                        <div className="guildModule">
                            <div className="top">
                                <img className="picto" alt='logo' width="48" height="48" src={logs} ></img>
                                {/* <Form.Check type="switch" id="custom-switch success" onChange={() => { this.setState({ logChannel: !this.state.logChannel }) }} checked={this.state.fun} /> */}
                                <Form.Select value={this.state.logChannel} onChange={(event) => { this.setState({ logChannel: event.target.value }) }}>
                                    {(() => {
                                        var option = [];

                                        for(let value of this.state.channelTextuelGuild)
                                        {
                                            if(value.id === this.state.logChannel)
                                            {
                                                option.push(<option value={value.id} selected>{ value.name }</option>)
                                            }
                                            else
                                            {
                                                option.push(<option value={value.id}>{ value.name }</option>)
                                            }
                                        }
                                        
                                        return option;
                                    })()}
                                </Form.Select>
                            </div>
                            <h5 className="hrnh5k-0 eeKdki sc-1wkjbe7-8 GoZzi">Logs</h5>
                            <div>Choisir le channel pour afficher les logs du serveur</div>
                        </div>
                    </div>);

                    if (this.state.success) {
                        rank.push(<div className="cardSuccess">
                                    <div className="cardInsideSuccess">
                                        <div>
                                            <h2>Success</h2>
                                        </div>
                                        <div className="content">Mise à jour effectué<br/><br/></div>
                                            <div className="zoneInterationSucess">
                                                <div>
                                                    <button className="BoutonClose" onClick={()=> {this.setState({ success: false })}} color="#ffffff">Fermer</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>);
                    }
                    else if(this.state.error)
                    {
                        rank.push(<div className="cardSuccess">
                                    <div className="cardInsideError">
                                        <div>
                                            <h2>Erreur</h2>
                                        </div>
                                        <div className="content">La mise à jour des informations a échoué<br/><br/></div>
                                            <div className="zoneInterationError">
                                                <div>
                                                    <button className="BoutonClose" onClick={()=> {this.setState({ error: false })}} color="#ffffff">Fermer</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>);
                    }
    
                return rank;
        })()}

        <Musique guild={this.props.match.params.id}/>
                            </div>
                            )
                        }
                    }

                    export default Guild;
