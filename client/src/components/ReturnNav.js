import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import UpdatedMessage from './UpdatedMessage';
import PadMonsterSearch from './PadMonsterSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import Image from 'react-bootstrap/Image'

class ReturnNav extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick() {
        this.props.history.goBack();
    }

    handleLogOut() {
        sessionStorage.clear();
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
    
        let headerComp = <span fontSize={18}>{this.props.header}</span>;

        return (
            <div className="fixedHeader">
                <Navbar expand="true" bg="dark" variant="dark" style={{padding:"10px"}}>
                    <Navbar.Brand style={{textOverflow:"ellipsis", overflow:"hidden", whiteSpace:"normal", flexGrow:1}}>
                        {this.props.suppressBack ?  headerComp : 
                            <span><FontAwesomeIcon icon={faArrowLeft} onClick={this.handleButtonClick} /> 
                                   &nbsp;&nbsp;{headerComp}&nbsp;&nbsp;
                            </span>}
                    </Navbar.Brand>
                    <Navbar.Text className="hide-desktop" style={{boxSizing: "border-box", textOverflow:"ellipsis", overflow:"hidden", marginLeft:"auto", paddingRight:"3px", paddingLeft:"10px", paddingTop: "3px"}}>
                        {/* <div style={{verticalAlign:"sub"}} title={"Welcome, " + userName}
                            fontSize={12} >Welcome, <Link to={"profile"}>{userName}</Link>&nbsp;&nbsp;
                        </div> */}
                        <Navbar.Toggle children={<FontAwesomeIcon icon={faBars} />} style={{border:"none", float:"right"}}/>
                    </Navbar.Text>
                    {
                        this.props.suppressSearch ? <div></div> : <PadMonsterSearch/>
                    }
                    <Navbar.Text className="hide-mobile" style={{boxSizing: "border-box", textOverflow:"ellipsis", overflow:"hidden", marginLeft:"auto", paddingRight:"3px", paddingLeft:"10px", paddingTop: "3px"}}>
                        {/* <div style={{verticalAlign:"sub"}} title={"Welcome, " + userName}
                            fontSize={12} >Welcome, <Link to={"profile"}>{userName}</Link>&nbsp;&nbsp;
                        </div> */}
                        <Navbar.Toggle children={<FontAwesomeIcon icon={faBars} />} style={{border:"none", float:"right"}}/>
                    </Navbar.Text>
                    <Navbar.Collapse>
                        <Nav style={{textAlign:"right"}}>
                            <Navbar.Text style={{marginLeft:"auto"}}>
                                <div style={{display:"inline-block"}}><Link to={'/profile'}>Profile</Link>
                                &nbsp;|&nbsp;</div>
                                <div style={{display:"inline-block"}}><Link to={'/projects'}>Projects</Link>
                                &nbsp;|&nbsp;</div>
                                <div style={{display:"inline-block"}}><Link to={'/itunes'}>Music</Link>
                                &nbsp;|&nbsp;</div>
                                <div style={{display:"inline-block"}}><Link to={'/contact'}>Contact</Link>
                                &nbsp;|&nbsp;</div>
                                <div style={{display:"inline-block"}}><Link to={'/monsterBook'}>Monster Book</Link></div>
                                {/* <Link to={'/unreleasedMonsters'}>Unreleased Monsters</Link>
                                <NavDropdown.Divider style={{width:"150px"}}/> */}
                            </Navbar.Text>
                            <Navbar.Text style={{marginLeft:"auto"}}>
                                <a href="http://www.linkedin.com/pub/matthew-homan/4a/528/546" target="_blank" rel="noopener noreferrer">
                                    <Image className="socialMediaIcon" src="/images/socialmedia/linkedin.svg" title='Linked In'></Image>
                                </a>
                                <a href="https://www.facebook.com/matthew.homan1" target="_blank" rel="noopener noreferrer">
                                    <Image className="socialMediaIcon" src="/images/socialmedia/facebook.svg" title='Facebook'></Image>
                                </a>
                                <a href="http://instagram.com/m.h.h.11" target="_blank" rel="noopener noreferrer">
                                    <Image className="socialMediaIcon" src="/images/socialmedia/instagram.svg" title='Instagram'></Image>
                                </a>
                                <a href="https://www.paypal.me/MatthewHoman" target="_blank" rel="noopener noreferrer">
                                    <Image className="socialMediaIcon" src="/images/socialmedia/paypal.svg" title='PayPal'></Image>
                                </a>
                                <a href="https://www.twitch.tv/b34st3d" target="_blank" rel="noopener noreferrer">
                                    <Image className="socialMediaIcon" src="/images/socialmedia/twitch.svg" title='Twitch'></Image>
                                </a>
                                <a href="http://steamcommunity.com/id/b34st3d" target="_blank" rel="noopener noreferrer">
                                    <Image className="socialMediaIcon" src="/images/socialmedia/steam.svg" title='Steam'></Image>
                                </a>
                                <a href="http://matthewhoman.deviantart.com/" target="_blank" rel="noopener noreferrer">
                                    <Image className="socialMediaIcon" src="/images/socialmedia/deviantart.svg" title='Deviant Art'></Image>
                                </a>
                            </Navbar.Text>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <UpdatedMessage customMsg={this.props.customMsg} updated={this.props.updated} />
                {/* <Breadcrumb>
                    {breadCrumbComponents}
                </Breadcrumb>   */}
            </div>
        )
    }
}

export default ReturnNav;