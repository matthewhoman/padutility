import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import UpdatedMessage from './UpdatedMessage';
import PadMonsterSearch from '../puzzlesanddragons/PadMonsterSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons'

class ReturnNav extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabs : [
                { url : "profile", name : "Profile"},
                { url : "resume", name : "Resume"},
                { url : "game", name : "Games"},
                { url : "projects", name : "Projects"},
                { url : "news", name : "News"},
                { url : "itunes", name : "Music"},
                // { url : "movies", name : "Movies"},
                { url : "contact", name : "Contact"},
                { url : "monsterBook", name : "Monster Book"}
            ],
            socialIcons : [
                { url : "https://github.com/matthewhoman", title : "Git Hub", icon : "github.svg"},
                { url : "http://www.linkedin.com/pub/matthew-homan/4a/528/546", title : "Linked In", icon : "linkedin.svg"},
                { url : "https://www.facebook.com/matthew.homan1", title : "Facebook", icon : "facebook.svg"},
                { url : "http://instagram.com/m.h.h.11", title : "Instagram", icon : "instagram.svg"},
                { url : "https://www.paypal.me/MatthewHoman", title : "Paypal", icon : "paypal.svg"},
                { url : "https://www.twitch.tv/beastedxx", title : "Twitch", icon : "twitch.svg"},
                { url : "http://steamcommunity.com/id/b34st3d", title : "Steam", icon : "steam.svg"},
                { url : "http://matthewhoman.deviantart.com/", title : "Deviant Art", icon : "deviantart.svg"}
            ]
        };
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.shouldHighlight = this.shouldHighlight.bind(this);

    }

    handleButtonClick() {
        this.props.history.goBack();
    }

    handleLogOut() {
        sessionStorage.clear();
    }

    shouldHighlight(tabName) {
        return window.location.href.includes(tabName) ? 
            {color: "white"} : {};
    }

    render() { 
        let breadCrumbs = JSON.parse(sessionStorage.getItem('breadCrumbs'));
        let location = "";
        if(this.props.history) {
            location = this.props.history.location.pathname.substr(1);
        }
        let breadCrumbComponents = [];

        if(!breadCrumbs) {
            breadCrumbs = [location];
        } else {
            if(!breadCrumbs.includes(location)) {
                breadCrumbs.push(location);
            //if bread crumb already exists we must have back tracked... update breadcrumbs
            } else {
                let indexToSplice = breadCrumbs.indexOf(location) + 1;
                breadCrumbs.splice(indexToSplice, breadCrumbs.length);
            }

            for(let breadLocation of breadCrumbs) {
                breadCrumbComponents.push(<Breadcrumb.Item active={breadLocation === location ? true : false} 
                    key={breadLocation} href={breadLocation}>{breadLocation}</Breadcrumb.Item>)
            }
        }   

        sessionStorage.setItem('breadCrumbs', JSON.stringify(breadCrumbs));
    
        let headerComp = <span>{this.props.header}</span>;
    
        return (
            <div className="fixedHeader">
                <Navbar expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand style={{fontSize:"25px"}}>
                        {this.props.suppressBack ?  headerComp : 
                            <span><FontAwesomeIcon icon={faArrowLeft} onClick={this.handleButtonClick} /> 
                                   &nbsp;&nbsp;{headerComp}&nbsp;&nbsp;
                            </span>}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" children={<div>Menu</div>} style={{border:"none",outline:"none"}}/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            {
                                this.state.tabs.map(tab => {
                                    let tabNameLeft = tab.name.includes(" ") ? tab.name.substring(0, tab.name.indexOf(" ")) : tab.name;
                                    let tabNameRight = tab.name.includes(" ") ? tab.name.substring(tab.name.indexOf(" ") + 1, tab.name.length) : "";
                                    return (<Nav.Link key={tab.name} href={"/" + tab.url} style={this.shouldHighlight(tab.url)}>
                                            {tabNameLeft}&nbsp;{tabNameRight}</Nav.Link>)
                                })
                            }
                        </Nav>
                        {
                            this.state.socialIcons.map(icon => {
                                return(
                                <a key={icon.title} href={icon.url} target="_blank" rel="noopener noreferrer">
                                    <img className="socialMediaIcon" src={"/images/socialmedia/" + icon.icon} 
                                        title={icon.title} alt={icon.title}></img>
                                </a>)
                            })
                        }
                    </Navbar.Collapse>
                </Navbar>
                {
                    this.props.suppressSearch || <PadMonsterSearch clearMonsterSuggest={this.props.clearMonsterSuggest}/>
                }
                <UpdatedMessage customMsg={this.props.customMsg} updated={this.props.updated} />
            </div>
        )
    }
}

export default ReturnNav;