import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import UpdatedMessage from './UpdatedMessage';
import PadMonsterSearch from './PadMonsterSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons'
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
                <Navbar expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand>
                        {this.props.suppressBack ?  headerComp : 
                            <span><FontAwesomeIcon icon={faArrowLeft} onClick={this.handleButtonClick} /> 
                                   &nbsp;&nbsp;{headerComp}&nbsp;&nbsp;
                            </span>}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/profile">Profile</Nav.Link>
                            <Nav.Link href="/resume">Resume</Nav.Link>
                            <Nav.Link href="/projects">Projects</Nav.Link>
                            <Nav.Link href="/itunes">Music</Nav.Link>
                            <Nav.Link href="/movies">Movies</Nav.Link>
                            <Nav.Link href="/contact">Contact</Nav.Link>
                            <Nav.Link href="/monsterBook">Monster&nbsp;Book</Nav.Link>
                        </Nav>
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
                        {
                            this.props.suppressSearch ? <div></div> : <PadMonsterSearch/>
                        }
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