import React, { Component } from 'react';
import ReturnNav from './ReturnNav';

class Itunes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchSize: 25,
            musicDataFetched : false,
            musicData : {}
        };
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
    
    render() {
        let musicPanels = [];
        if(this.state.musicDataFetched) {
            for(let i = 0; i < this.state.musicData.length; i++) {
                let entry = this.state.musicData[i];
                //let artist = entry['im:artist'].label;
                //let song = entry['im:name'].label;
                //let height = entry['im:image'][2].attributes.height;
                let imagesrc = entry['im:image'][2].label;
                
                let title = entry.title.label;
                let url = entry['im:collection'].link.attributes.href;
                
                let previewType = entry.link[1].attributes.type;
                let previewUrl = entry.link[1].attributes.href;
                musicPanels.push(
                    <div key={i + "musicPanel"} className="w3-container w3-margin-bottom"> 
                        <div style={{whiteSpace: "nowrap"}} className="w3-card2 w3-theme-l3">
                            <div id="mimage" 
                                style={{height: "170px", backgroundSize: "contain", backgroundPosition: "0%0%",
                                    backgroundRepeat: "no-repeat", backgroundImage: "url('" + imagesrc + "')", display: "inline-block"}}>
                            </div>
                            <div id="mtext" style={{verticalAlign: "top", display: "inline-block", marginLeft: "10px", whiteSpace: "pre-line", width: "50%"}} 
                                className="w3-margin-bottom">
                                <a className="w3-hover-text-indigo" target="_blank" rel="noopener noreferrer" href={url}><b>{title}</b></a>
                            </div>
                            <div className="w3-accordion w3-light-grey w3-margin-bottom" style={{width: "100%"}}>
                                <button className="w3-btn-block w3-left-align w3-theme">Lyrics
                                    <i className="fa fa-caret-down"></i>
                                </button>
                                <div id={i +'SongId'} className="w3-accordion-content w3-container">
                                    <pre style={{whiteSpace: "pre-wrap", wordWrap: "break-word"}} id={i +'SongLyric'}></pre>
                                </div>
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
            <div style={{paddingBottom:"50px"}}>
                <ReturnNav history={this.props.history} header="" suppressBack suppressSearch/>
                <br></br>
                <div className="w3-theme-dark" style={{marginLeft: "20px"}}>
                    {musicPanels}
                </div>
            </div>
        )
    }
}

export default Itunes;