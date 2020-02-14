import React, { Component } from 'react';
import Base from '../common/Base';
import LinedTitle from '../common/LinedTitle';

class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locationKey : "RzhVEwK3gLsrAFsEg62E83jSl797uDE0",
            category : "technology",
            newsDataFetched : false,
            newsData : {},
            newsTypes : [
                { name : "Arts", api : "arts"},
                { name : "Automobiles", api : "automobiles"},
                { name : "Books", api : "books"},
                { name : "Fashion", api : "fashion"},
                { name : "Food", api : "food"},
                { name : "Health", api : "health"},
                { name : "Home", api : "home"},
                { name : "Insider", api : "insider"},
                { name : "Magazine", api : "magazine"},
                { name : "National", api : "national"},
                { name : "Obituraries", api : "obituaries"},
                { name : "Opinion", api : "opinion"},
                { name : "Politics", api : "politics"},
                { name : "NY Region", api : "nyregion"},
                { name : "Real Estate", api : "realestate"},
                { name : "Science", api : "science"},
                { name : "Technology", api : "technology", selected: true},
                { name : "Theatre", api : "theatre"},
                { name : "T Magazine", api : "tmagazine"},
                { name : "Travel", api : "travel"},
                { name : "Upshot", api : "upshot"},
                { name : "World", api : "world"}
            ]
        };
        this.newsTypeChange = this.newsTypeChange.bind(this);
        this.fetchNews = this.fetchNews.bind(this);
    }

    componentDidMount() {
        this.fetchNews(this.state.category)
    }

    fetchNews(type) {
        fetch("https://api.nytimes.com/svc/topstories/v2/" + type + ".json?api-key=" + this.state.locationKey)
            .then(response => response.json())
            .then(data => {
                if(data && data.results) {
                    this.setState(() => ({
                        newsDataFetched : true,
                        newsData : data.results,
                    }))
                }
            }).catch(function(error) {
                console.log('Request failed', error)
            });
    }

    newsTypeChange(event) {
        let newsType = event.target.value;

        this.setState({
            category : newsType
        })

        this.fetchNews(newsType)
    }
    
    render() {
        let newsPanels = [];
        if(this.state.newsDataFetched) {
            for(let i = 0; i < this.state.newsData.length; i++) {
                var news = this.state.newsData[i];
		        var multimedia = news.multimedia;
                //if no multimedia dont show 
                if(!multimedia || multimedia.length === 0){
                    continue;
                }
                //default content
                var content = multimedia[0];
                
                if(!content){
                    continue;
                }
                
                //try for bigger content for nicer images
                if(multimedia.length > 4){
                    content = multimedia[4];
                }

                //var caption = content.caption;
                //var height = content.height;
                var imagesrc = content.url;
                var title = news.title;
                //var by = news.byline;
                var url = news.url;

                newsPanels.push(
                    <div key={i + "newsPanel"} className="w3-container w3-margin-bottom w3-third"> 
                        <div style={{whiteSpace: "nowrap"}} className="w3-theme-l3">
                            <div id="mimage" 
                                style={{height: "170px", backgroundSize: "contain", backgroundPosition: "0%0%",
                                    backgroundRepeat: "no-repeat", backgroundImage: "url('" + imagesrc + "')", display: "inline-block"}}>
                            </div>
                            <div id="mtext" style={{verticalAlign: "top", display: "inline-block", 
                                    marginLeft: "10px", whiteSpace: "pre-line", width: "50%"}} 
                                        className="w3-margin-bottom">
                                <a className="w3-hover-text-indigo newsLink" target="_blank" rel="noopener noreferrer" href={url}><b>{title}</b></a>
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
                        <LinedTitle title="NY&nbsp;Times&nbsp;News" margBottom></LinedTitle>
                        {
                            <div className="w3-container w3-margin-bottom">
                                <h3 style={{display:"inline-block"}}>News type selection:&nbsp;&nbsp;</h3>
                                <select onChange={this.newsTypeChange} style={{height:"22px", verticalAlign:"text-bottom"}}>
                                { 
                                    this.state.newsTypes.map(type => <option key={type.api} value={type.api} selected={type.selected}>{type.name}</option>)
                                }
                                </select>
                            </div>
                        }
                        {newsPanels}
                    </div>
                }>
            </Base>
        )
    }
}

export default News;