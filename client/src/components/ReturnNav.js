import React, { Component } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import UpdatedMessage from './UpdatedMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import PadMonsterSearch from './PadMonsterSearch'

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
        let userName = this.props.userName ? this.props.userName : 
                            sessionStorage.getItem('userName');
        let userID = this.props.userID ? this.props.userID : 
                            sessionStorage.getItem('userID');
        let patientName = this.props.patientName ? this.props.patientName : 
                            sessionStorage.getItem('patientName');

        sessionStorage.setItem('patientName', patientName);
        sessionStorage.setItem('userID', userID);
        sessionStorage.setItem('userName', userName);
        
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
                    <Navbar.Text style={{textOverflow:"ellipsis", overflow:"hidden", marginLeft:"auto", paddingRight:"3px", paddingLeft:"3px"}}>
                        {/* <div style={{verticalAlign:"sub"}} title={"Welcome, " + userName}
                            fontSize={12} >Welcome, <Link to={"profile"}>{userName}</Link>&nbsp;&nbsp;
                        </div> */}
                        <Navbar.Toggle children={<FontAwesomeIcon icon={faBars} />} style={{border:"none", float:"right"}}/>
                    </Navbar.Text>
                    <PadMonsterSearch/>
                    <Navbar.Collapse>
                        <Nav style={{whiteSpace:"nowrap",textAlign:"right",direction:"rtl"}}>
                            <Navbar.Text style={{marginLeft:"auto"}}>
                                <Link to={'/monsterBook'}>Monster Book</Link>
                                <NavDropdown.Divider style={{width:"150px"}}/>
                                <Link to={'/unreleasedMonsters'}>Unreleased Monsters</Link>
                                <NavDropdown.Divider style={{width:"150px"}}/>
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