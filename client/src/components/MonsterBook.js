import React, { Component } from 'react';
import {Link} from 'react-router-dom';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import ReturnNav from './ReturnNav';
import Collapsible from 'react-collapsible';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from './Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

var typeMap = {
    evolve : '0',
    balanced : '1',
    physical : '2',
    healer : '3',
    dragon : '4',
    god : '5',
    attacker : '6',
    devil : '7',
    machine : '8',
    awaken : '12',
    enhanced : '14',
    vendor : '15'
  }

var elementMap = {
    fire : '0',
    water : '1',
    wood : '2',
    light : '3',
    dark : '4',
}

var awokenMap = {
    enhancedhp : '1',
    enhancedattack : '2',
    enhancedrcv : '3',
    reducefiredamage : '4',
    reducewaterdamage : '5',
    reducewooddamage : '6',
    reducelightdamage : '7',
    reducedarkdamage : '8',
    autorecover : '9',
    resistancebind : '10',
    resistanceblind : '11',
    resistancejammer : '12',
    resistancepoision : '13',
    enhancedfireorbs : '14',
    enhancedwaterorbs : '15',
    enhancedwoodorbs : '16',
    enhancedlightorbs : '17',
    enhanceddarkorbs : '18',
    extendtime : '19',
    bindrecover : '20',
    skillplus : '21',
    enhancedfireratt : '22',
    enhancedwateratt : '23',
    enhancedwoodatt : '24',
    enhancedlightatt : '25',
    enhanceddarkatt : '26',
    twoprongedattack : '27',
    resistanceskillbind : '28',
    enhancedheartorbs : '29',
    multiplayerboost : '30',
    dragonkiller : '31',
    godkiller : '32',
    devilkiller : '33',
    machinekiller : '34',
    attackerkiller : '35',
    physicalkiller : '36',
    healerkiller : '37',
    balancedkiller : '38',
    awakenmaterialkiller : '39',
    enhancedkiller : '40',
    vendorkiller : '41',
    evolvekiller : '42',
    enhanced7combo : '43',
    guardbreak : '44',
    bonusattack : '45',
    enhanceteamhp : '46',
    enhanceteamrcv : '47',
    voiddamagepiercer : '48',
    awokenassist : '49',
    superbonusattack : '50',
    skillcharge : '51',
    resistancebindplus : '52',
    extendtimeplus : '53',
    resistanceclouds : '54',
    resistanceimobolity : '55',
    skillboostplus : '56',
    hpgreater80percentattackboost : '57',
    hplessthan50percentattackboost : '58',
    ldamagereduction : '59',
    lunlockorbsandincreaseattack : '60',
    enhanced10combo : '61',
    comboorbs : '62',
    voice : '63',
    dungeonbonus : '64',
    reducedhp : '65',
    reducedattack : '66',
    reducedrcv : '67',
    resistanceblindplus : '68',
    resistancejammerplus : '69',
    resistancepoinsonplus : '70',
    jammerblessing : '71',
    poisonblessing : '72'
}

class MonsterBook extends Component {

    constructor(props) {
        super(props);

        this.state = {
            monstersFetched : false,
            typeFilter : sessionStorage.getItem('typeFilter') ? JSON.parse(sessionStorage.getItem('typeFilter')) : [],
            elementFilter : sessionStorage.getItem('elementFilter') ? JSON.parse(sessionStorage.getItem('elementFilter')) : [],
            awokenFilter: sessionStorage.getItem('awokenFilter') ? JSON.parse(sessionStorage.getItem('awokenFilter')) : [],
            leaderFilter : sessionStorage.getItem('leaderFilter') ? JSON.parse(sessionStorage.getItem('leaderFilter')) : '',
            activeFilter : sessionStorage.getItem('activeFilter') ? JSON.parse(sessionStorage.getItem('activeFilter')) : '',
            filterOpen : sessionStorage.getItem('filterOpen') !== 'undefined' ? JSON.parse(sessionStorage.getItem('filterOpen')) : false,
            page: sessionStorage.getItem('page') ? JSON.parse(sessionStorage.getItem('page')) : 1
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.getMonsters = this.getMonsters.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.setDefaultState = this.setDefaultState.bind(this);
        this.loadMoreMonsters = this.loadMoreMonsters.bind(this);
        this.loadPrevMonsters = this.loadPrevMonsters.bind(this);
    }

    componentDidMount() {
        this.getMonsters(this.state.page);
    }

    setDefaultState() {
        this.setState({
            monstersFetched : false,
            typeFilter : [],
            elementFilter : [],
            awokenFilter: [],
            leaderFilter : '',
            activeFilter : '',
            page: 1
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.getMonsters(1);
    }

    handleChange(event) {
        if(event.target.type.toLowerCase() === "text") {
            this.setState({[event.target.name]: event.target.value});
        } else if(event.target.type.toLowerCase() === "checkbox") {
            let filterName = event.target.getAttribute('filtername');
            let checkBoxFilter = this.state[filterName];
            if(event.target.checked) {
                checkBoxFilter.push(event.target.name);
            } else {
                var index = checkBoxFilter.indexOf(event.target.name);
                if (index > -1) {
                    checkBoxFilter.splice(index, 1);
                }
            }
            this.setState(() => ({
                [filterName]: checkBoxFilter
            }))
        }
    }

    resetForm() {
        document.getElementById("filterForm").reset();
        this.setDefaultState();
    }

    loadPrevMonsters() {
        let pageNo  = this.state.page - 1;
        this.setState({page: pageNo});
        this.getMonsters(pageNo);
    }

    loadMoreMonsters()  {
        let pageNo  = this.state.page + 1;
        this.setState({page: pageNo});
        this.getMonsters(pageNo);
    }

    getMonsters(pageNo) {
        let queryStr = '';
        let page = pageNo ? pageNo : this.state.page;

        queryStr += "page=" + page;
        queryStr += "&"

        if(this.state.typeFilter.length > 0) {
            queryStr += "typeFilter=" + JSON.stringify(this.state.typeFilter)
            queryStr += "&"
        }
        if(this.state.awokenFilter.length > 0) {
            queryStr += "awokenFilter=" + JSON.stringify(this.state.awokenFilter)
            queryStr += "&"
        }
        if(this.state.elementFilter.length > 0) {
            queryStr += "elementFilter=" + JSON.stringify(this.state.elementFilter)
            queryStr += "&"
        }
        if(this.state.leaderFilter.length > 0) {
            queryStr += "leaderFilter=" + encodeURIComponent(this.state.leaderFilter)
            queryStr += "&"
        }
        if(this.state.activeFilter.length > 0) {
            queryStr += "activeFilter=" + encodeURIComponent(this.state.activeFilter)
        }

        sessionStorage.setItem('typeFilter', JSON.stringify(this.state.typeFilter));
        sessionStorage.setItem('activeFilter', JSON.stringify(this.state.activeFilter));
        sessionStorage.setItem('leaderFilter', JSON.stringify(this.state.leaderFilter));
        sessionStorage.setItem('elementFilter', JSON.stringify(this.state.elementFilter));
        sessionStorage.setItem('awokenFilter', JSON.stringify(this.state.awokenFilter));
        sessionStorage.setItem('page', JSON.stringify(pageNo));

        queryStr = queryStr.substring(0, queryStr.length - 1);
        
        fetch('/retrieveMonsters?' + queryStr)
            .then(response => response.json())
            .then(data => {
                this.setState(() => ({
                    monstersFetched : true,
                    monsters : data.monsters, 
                    hasMore : data.hasMore,
                    pageDisplay : data.monsters.length > 0 ? data.currentPage + "/" + Math.ceil(data.totalPages) : '',
                    page: page
                }))
            }).catch(function(error) {
                console.log('Request failed', error)
            });
    }

    render() {
        let checkBoxTypeComps = [];
        for (var key in typeMap) {
            if (typeMap.hasOwnProperty(key)) {
                checkBoxTypeComps.push(
                    <div className="w3-theme-dark" key={key} style={{textAlign:"left", display:"inline-block", marginLeft:"5px", marginBottom:"10px"}}>
                        <input name={typeMap[key]} onChange={this.handleChange} type="checkbox" filtername="typeFilter"
                            style={{width: "18px",height:"18px",display:"inline-block",verticalAlign:'bottom'}}
                            id={typeMap[key]} checked={this.state.typeFilter.includes(typeMap[key])}>
                        </input>
                        &nbsp;&nbsp;
                        <img src={"images/type/" + typeMap[key] +".png"} 
                                        style={{width:"18px",height:"18px", verticalAlign:"baseline"}} alt= ""/>
                        <span>&nbsp;</span>
                    </div>
                )
            }
        } 

        let checkBoxElementComps = [];
        for (var elKey in elementMap) {
            if (elementMap.hasOwnProperty(elKey)) {
                checkBoxElementComps.push(
                    <div className="w3-theme-dark" key={elKey} style={{textAlign:"left", display:"inline-block", marginLeft:"5px", marginBottom:"10px"}}>
                        <input name={elementMap[elKey]} onChange={this.handleChange} type="checkbox" filtername="elementFilter"
                            style={{width: "18px",height:"18px",display:"inline-block",verticalAlign:'bottom'}}
                            id={elementMap[elKey]} checked={this.state.elementFilter.includes(elementMap[elKey])}>
                        </input>
                        &nbsp;&nbsp;
                        <img src={"images/element/" + elementMap[elKey] +".png"} 
                                        style={{width:"18px",height:"18px", verticalAlign:"baseline"}} alt= ""/>
                        <span>&nbsp;</span>
                    </div>
                )
            }
        } 

        let checkBoxAwokenComps = [];
        for (var awKey in awokenMap) {
            if (awokenMap.hasOwnProperty(awKey)) {
                checkBoxAwokenComps.push(
                    <div className="w3-theme-dark" key={awKey} style={{textAlign:"left", display:"inline-block", marginLeft:"5px", marginBottom:"10px"}}>
                        <input name={awokenMap[awKey]} onChange={this.handleChange} type="checkbox" filtername="awokenFilter"
                            style={{width: "18px",height:"18px",display:"inline-block",verticalAlign:'bottom'}}
                            id={awokenMap[awKey]} checked={this.state.awokenFilter.includes(awokenMap[awKey])}>
                        </input>
                        &nbsp;&nbsp;
                        <img src={"images/Awokens/" + awokenMap[awKey] +".png"} 
                                        style={{width:"18px",height:"18px", verticalAlign:"baseline"}} alt= ""/>
                        <span>&nbsp;</span>
                    </div>
                )
            }
        } 
        
        // if(!this.state.monstersFetched) {
        //     return (
        //         <div style={{color:"white"}}> <FontAwesomeIcon icon={faSpinner}/> loading ...</div>
        //     )
        // }
        let monsters = [];
        if(this.state.monstersFetched) {
            for(let i = 0; i < this.state.monsters.length; i++) {
                let monster = this.state.monsters[i];
                monsters.push(
                    <div key={monster.id} style={{display:"inline-block",marginBottom:"5px",width:"69px"}}>
                        <div>
                            <div style={{display:"inline-block",width:"69px",marginBottom:"2px"}}>
                                <Link key={i} to={'/showMonsterDetails?monsterId=' + monster.id + "&monsterName=" + monster.name}>
                                    <div style={{
                                            display:"inline-block", 
                                            width:"60px", 
                                            height:"60px"}}>
                                        <Image 
                                            className="evoImageBig"
                                            title={monster.id+ ".&nbsp;" + monster.name}
                                            id={monster.id}
                                            alt={monster.id+ ".  " + monster.name}>
                                        </Image>
                                    </div>
                                </Link>
                            </div>
                            <div>
                                <OverlayTrigger
                                    rootClose={true}
                                    trigger="click"
                                    key="bottom"
                                    placement="bottom"
                                    overlay={
                                        <Popover
                                            className="w3-theme-dark"
                                            style={{border:"1px solid white"}}
                                            id={'popover-positioned-bottom'}
                                        >
                                            <div style={{display:"inline-block"}}>
                                                <div className="lightblueText">No.{monster.id}</div>
                                                <div className="w3-theme-dark">{monster.name}</div>
                                            <div>
                                                {
                                                    monster.types.map((value, index) => {                     
                                                        return (
                                                                value !== '-1' ?
                                                                    <div key={index} style={{display:"inline-block",width:"17px",height:"17px"}}>
                                                                        <img  
                                                                            src={"images/type/"+ value + ".png"}
                                                                            style={{width:"15px",height:"15px"}} 
                                                                            alt= ""/>
                                                                    </div>
                                                                :
                                                                <div key={index}></div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            {
                                                monster.awakenings.map((value, index) => {                     
                                                    return (
                                                            <div key={index} style={{display:"inline-block",width:"17px",height:"17px"}}>
                                                                <img 
                                                                    src={"images/Awokens/"+ value + ".png"}
                                                                    style={{width:"15px",height:"15px"}} 
                                                                    alt= ""/>
                                                            </div>
                                                        
                                                    )
                                                })
                                            }
                                            </div>
                                            <br />
                                            <br />
                                            <span className="w3-theme-dark w3-bold">
                                                <b>Skill&nbsp;</b>
                                            </span>
                                            <span className="w3-theme-dark w3-small">
                                                (lvl.&nbsp;1:&nbsp;Turn:&nbsp;{monster.turnMax}&nbsp;&nbsp;<FontAwesomeIcon icon={faArrowRight} />&nbsp;
                                                                    Turn:&nbsp;{monster.turnMin})
                                            </span>
                                            <div className="w3-small" style={{color:"lightblue",width:"auto"}}>
                                                &nbsp;&nbsp;{monster.activeSkill}:
                                            </div>
                                            <div className="w3-theme-dark w3-small">
                                            <div style={{display:"inline-block",width:"2%"}}>&nbsp;</div>
                                                <div style={{display:"inline-block", width:"98%"}}>{monster.activeSkillDescription}</div>
                                            </div>
                                            <br></br>
                                            <div className="w3-theme-dark w3-bold">
                                                <b>Leader Skill</b>
                                            </div>
                                            <div className="w3-small" style={{color:"lightgreen",width:"auto"}}>
                                                &nbsp;&nbsp;{monster.leaderSkill}:
                                            </div> 
                                            <div className="w3-theme-dark w3-small">
                                            <div style={{display:"inline-block",width:"2%"}}>&nbsp;</div>
                                                <div style={{display:"inline-block", width:"98%"}}>{monster.leaderSkillDescription}</div>
                                            </div> 
                                        </Popover>
                                    }
                                    >
                                    <Button 
                                        className="w3-theme-dark w3-small" 
                                        style={{width:"60px"}} 
                                        variant="secondary">
                                        Details
                                    </Button>
                                </OverlayTrigger>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        let prevButton = [];
        if(this.state.page > 1 && this.state.page !== 1) {
            prevButton.push(           
                <div key={this.state.page} style={{display:"inline-block",width:"69px"}}>
                    <Button 
                        className="w3-theme-dark w3-small" 
                        onClick={this.loadPrevMonsters}
                        style={{width:"60px"}} 
                        variant="secondary">
                        &lt;
                    </Button>
                </div>
            ) 
        } else {
            prevButton.push(           
                <div key={this.state.page} style={{display:"inline-block",width:"69px"}}>
                </div>
            ) 
        }
        let hasMoreButton = [];
        if(this.state.hasMore) {
            hasMoreButton.push(           
                <div key={this.state.page} style={{display:"inline-block",width:"69px"}}>
                    <Button 
                        className="w3-theme-dark w3-small" 
                        onClick={this.loadMoreMonsters}
                        style={{width:"60px"}} 
                        variant="secondary">
                        &gt;
                    </Button>
                </div>
            ) 
        }
        return (
            <div>
                <ReturnNav history={this.props.history} header="PAD Monster Book" suppressBack/>
                <Container fluid={true}>
                    <Row style={{marginLeft: "0px", marginRight: "0px"}}>
                        <Col sm={8} md='auto'>
                        <div style={{marginTop:"15px"}}>
                            <div style={{marginBottom:"12px",maxWidth:"347px"}}>
                                <Collapsible 
                                    trigger="Filters" 
                                    triggerStyle={{height:"35px",fontSize:"16px",padding:"5px"}}
                                    transitionTime={100}
                                    open={this.state.filterOpen}
                                    onOpen={() => sessionStorage.setItem('filterOpen', true)}
                                    onClose={() => sessionStorage.setItem('filterOpen', false)}
                                >
                                    <form id="filterForm" onSubmit={this.handleSubmit}> 
                                        <div style={{marginBottom:"10px"}}>
                                            {checkBoxElementComps}
                                        </div>
                                        <div style={{marginBottom:"10px"}}>
                                            {checkBoxTypeComps}
                                        </div>
                                        <div style={{marginBottom:"10px"}}>
                                            {checkBoxAwokenComps}
                                        </div>
                                        <div style={{marginBottom:"10px"}}>
                                            <input name="leaderFilter" type="text" placeholder="Leader Skill Description" value={this.state.leaderFilter} onChange={this.handleChange} />
                                        </div>
                                        <div style={{marginBottom:"10px"}}>
                                            <input name="activeFilter" type="text" placeholder="Active Skill Description" value={this.state.activeFilter} onChange={this.handleChange} />
                                        </div>
                                        <div>
                                            <input text="Find" variant="emphasis" type="submit" className="FormContent" />
                                            <button
                                                style={{backgroundColor:"DodgerBlue", color:"white", border:"none", float:"right"}}
                                                variant="emphasis" 
                                                className="FormContent" 
                                                onClick={this.resetForm}>
                                                Clear
                                            </button>
                                        </div>
                                    </form>
                                </Collapsible>
                            </div>
                            </div>
                        </Col>
                        <Col>
                        <div style={{marginTop:"15px"}}>
                            {monsters}  
                        </div>
                        <div>
                            <div style={{marginTop:"15px"}}>
                                {prevButton}
                                {hasMoreButton}
                            </div>
                            <div className="w3-theme-dark" style={{marginTop:"15px",marginLeft:"40px"}}>
                                {this.state.pageDisplay}
                            </div>
                        </div>
                        </Col>
                    </Row>
                </Container>
                <br></br>
                <br></br>
                <br></br>
            </div>     
        )
    }
}

export default MonsterBook;