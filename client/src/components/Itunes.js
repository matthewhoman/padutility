import React, { Component } from 'react';
import Base from './Base';
import LinedTitle from './LinedTitle';

class Itunes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchSize: 25,
            musicDataFetched : false,
            musicData : {},
            blindsOpen : [],
            lyrics : []
        };
        this.openblind = this.openblind.bind(this);
    }

    componentDidMount() {
        fetch("https://itunes.apple.com/us/rss/topsongs/limit="+this.state.searchSize+"/json")
            .then(response => response.json())
            .then(data => {
                if(data.feed && this.state.musicData !== data.feed.entry) {
                    this.setState(() => ({
                        musicDataFetched : true,
                        musicData : data.feed.entry,
                    }))
                }
            }).catch(function(error) {
                console.log('Request failed', error)
            });
    }

    openblind(song, artist, index) {
        let blindsOpen = this.state.blindsOpen;

        if(blindsOpen.includes(index +'SongId')) {
            let blindIndex = blindsOpen.indexOf(index +'SongId');
            if (index > -1) {
                blindsOpen.splice(blindIndex, 1);
            }
        } else {
            blindsOpen.push(index + "SongId");
            this.getSongMatch(unescape(song), artist, index);
        }
        
        this.setState(() => ({
            blindsOpen : blindsOpen
        }))
    }

    getSongMatch(song, artist, index) {
        var urlParam = "";
    
        urlParam += 'q_track=' + song;
        urlParam += '%26q_artist=' + artist;
        urlParam += '%26f_has_lyrics=1';

        fetch("/retrieveSong?params=" + urlParam)
            .then(response => response.json())
            .then(data => {
                if(data.message && data.message.body && data.message.body.track
                        && data.message.body.track.track_share_url) {
                    this.getLyrics(data, index);
                }
            }).catch(function(error) {
                console.log('Request failed', error)
            });
    }
    
    getLyrics(inResult, index){
        var result = inResult;
        var shareUrl = result.message.body.track.track_share_url;
        var urlParam = "";
        urlParam += 'track_id=' + result.message.body.track.track_id;
        
        fetch("/retrieveLyrics?track=" + urlParam)
            .then(response => response.json())
            .then(data => {
                if(data.message && data.message.body && data.message.body.lyrics &&
                        data.message.body.lyrics.lyrics_body) {
                    let lyricsStr = data.message.body.lyrics.lyrics_body.replace('******* This Lyrics is NOT for Commercial use *******','');
                    let lyrics = this.state.lyrics;

                    lyrics[index + "SongLyric"] = {
                        lyrics : lyricsStr,
                        shareUrl : shareUrl
                    }

                    this.setState(() => ({
                        lyrics : lyrics
                    }))
                }
            }).catch(function(error) {
                console.log('Request failed', error)
            });
    }
    
    render() {
        let musicPanels = [];
        if(this.state.musicDataFetched) {
            for(let i = 0; i < this.state.musicData.length; i++) {
                let entry = this.state.musicData[i];
                let artist = entry['im:artist'].label;
                let song = entry['im:name'].label;
                //let height = entry['im:image'][2].attributes.height;
                let imagesrc = entry['im:image'][2].label;
                
                let title = entry.title.label;
                let url = entry['im:collection'].link.attributes.href;
                
                let previewType = entry.link[1].attributes.type;
                let previewUrl = entry.link[1].attributes.href;
                musicPanels.push(
                    <div key={i + "musicPanel"} className="w3-container w3-margin-bottom w3-third"> 
                        <div style={{whiteSpace: "nowrap"}} className="w3-theme-l3">
                            <div id="mimage" 
                                style={{height: "170px", backgroundSize: "contain", backgroundPosition: "0%0%",
                                    backgroundRepeat: "no-repeat", backgroundImage: "url('" + imagesrc + "')", display: "inline-block"}}>
                            </div>
                            <div id="mtext" style={{verticalAlign: "top", display: "inline-block", 
                                    marginLeft: "10px", whiteSpace: "pre-line", width: "50%"}} 
                                        className="w3-margin-bottom">
                                <a className="w3-hover-text-indigo musicLink" target="_blank" rel="noopener noreferrer" href={url}><b>{title}</b></a>
                            </div>
                            <div className="w3-accordion w3-light-grey" style={{width: "100%"}}>
                                <button onClick={() => this.openblind(escape(song), artist, i)} 
                                    style={{outline: "0px"}} className="w3-btn-block w3-left-align w3-theme">Lyrics&nbsp;
                                    <i className="fa fa-caret-down"></i>
                                </button>
                                {
                                    this.state.blindsOpen.includes(i +'SongId') ? 
                                        <div id={i +'SongId'} className="w3-accordion-content w3-container w3-show">
                                            <pre style={{whiteSpace: "pre-wrap", wordWrap: "break-word"}} id={i +'SongLyric'}>
                                            {
                                                this.state.lyrics[i +'SongLyric'] && this.state.lyrics[i +'SongLyric'].lyrics ? 
                                                        <div>
                                                            <br/>
                                                            {this.state.lyrics[i +'SongLyric'].lyrics}
                                                            <br />
                                                            <a target="_blank" className="w3-hover-text-indigo w3-show-inline-block" style={{width: "100%", color: "blue"}} 
                                                                href={this.state.lyrics[i +'SongLyric'].shareUrl} rel="noopener noreferrer">- Full Lyrics -</a>
                                                        </div>
                                                : <div />
                                            }
                                            </pre>
                                        </div>
                                    :
                                    <div/>
                                }
                            </div>
                            <div style={{width: "100%"}}>
                                <audio controls style={{height:"55px", width:"100%"}}>
                                    <source src={previewUrl} type={previewType} />
                                </audio>
                            </div>
                        </div>
				    </div>
                )
            }
        }
        return (
            <Base header="Matthew&nbsp;Homan" 
                childComponent={
                    <div>
                        <LinedTitle title="Itunes&nbsp;Top&nbsp;Music" margBottom></LinedTitle>
                        {musicPanels}
                    </div>
                }>
            </Base>
        )
    }
}

export default Itunes;