import React, { Component } from 'react';
import {Link} from 'react-router-dom';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import ReturnNav from './ReturnNav'

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
    enhanced10combo : '61'
}

class MonsterBook extends Component {

    constructor(props) {
        super(props);

        this.state = {
            monstersFetched : false,
            typeFilter : [],
            elementFilter : [],
            awokenFilter: [],
            leaderFilter : '',
            activeFilter : ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.getMonsters = this.getMonsters.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.setDefaultState = this.setDefaultState.bind(this);
    }

    componentDidMount() {
        this.setDefaultState();
    }

    setDefaultState() {
        this.setState({
            monstersFetched : false,
            typeFilter : [],
            elementFilter : [],
            awokenFilter: [],
            leaderFilter : '',
            activeFilter : ''})
    }

    handleSubmit(event) {
        event.preventDefault();
        this.getMonsters();
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

    getMonsters() {
        let queryStr = '';
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

        queryStr = queryStr.substring(0, queryStr.length - 1);
        
        fetch('/retrieveMonsters?' + queryStr)
            .then(response => response.json())
            .then(data => {
                this.setState(() => ({
                    monstersFetched : true,
                    monsters : data, 
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
                            id={typeMap[key]}>
                        </input>
                        &nbsp;&nbsp;
                        <img src={"images/type/" + typeMap[key] +".png"} 
                                        style={{width:"18px",height:"18px", verticalAlign:"baseline"}} alt= ""/>
                        <span>&nbsp;&nbsp;</span>
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
                            id={elementMap[elKey]}>
                        </input>
                        &nbsp;&nbsp;
                        <img src={"images/element/" + elementMap[elKey] +".png"} 
                                        style={{width:"18px",height:"18px", verticalAlign:"baseline"}} alt= ""/>
                        <span>&nbsp;&nbsp;</span>
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
                            id={awokenMap[awKey]}>
                        </input>
                        &nbsp;&nbsp;
                        <img src={"images/Awokens/" + awokenMap[awKey] +".png"} 
                                        style={{width:"18px",height:"18px", verticalAlign:"baseline"}} alt= ""/>
                        <span>&nbsp;&nbsp;</span>
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
                    <div style={{display:"inline-block", width:"175px", height: "80px"}}>
                        <div>
                            <div style={{display:"inline-block",width:"65px"}}>
                                <div className="lightblueText" style={{fontSize:"12px"}}>No.{monster.id}</div>
                                <Link key={i} to={'/showMonsterDetails?monsterId=' + monster.id + "&monsterName=" + monster.name}>
                                    <div style={{
                                            display:"inline-block", 
                                            width:"60px", 
                                            height:"60px"}}>
                                        <img className="evoImageBig" 
                                            src={monster.img} 
                                            title={monster.id+ ".&nbsp;" + monster.name} 
                                            alt=""/>
                                    </div>
                                </Link>
                            </div>
                            <div style={{display:"inline-block",width:"70px",verticalAlign:"top"}}>
                            {
                                monster.awakenings.map((value, index) => {                     
                                    return (
                                            <div style={{display:"inline-block",width:"17px",height:"17px"}}>
                                                <img key={index} 
                                                    src={"images/Awokens/"+ value + ".png"}
                                                    style={{width:"15px",height:"15px"}} 
                                                    alt= ""/>
                                            </div>
                                        
                                    )
                                })
                            }
                            </div>
                        </div>
                    </div>
                )
            }
        }
        return (
            <div>
                <ReturnNav history={this.props.history} header="Monster Book"/>
                <div style={{margin:"12px"}}>
                    <div style={{marginBottom:"10px",maxWidth:"347px"}}>
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
                                <input name="leaderFilter" type="text" placeholder="Leader Skill" value={this.state.value} onChange={this.handleChange} />
                            </div>
                            <div style={{marginBottom:"10px"}}>
                                <input name="activeFilter" type="text" placeholder="Active Skill" value={this.state.value} onChange={this.handleChange} />
                            </div>
                            <div>
                                <input text="Find" variant="emphasis" type="submit" className="FormContent" />
                                <div className="w3-theme-dark w3-small" style={{display:"inline-block", marginLeft:"10px"}}>
                                    Top 100 results&nbsp;(&nbsp;{this.state.monsters ? this.state.monsters.length : 0}&nbsp;)
                                </div>
                                <button
                                    style={{backgroundColor:"DodgerBlue", color:"white", border:"none", float:"right"}}
                                    variant="emphasis" 
                                    className="FormContent" 
                                    onClick={this.resetForm}>
                                    Clear
                                </button>
                            </div>
                        </form>
                    </div>
                    <div>
                        {monsters}  
                    </div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>
            </div>     
        )
    }
}

export default MonsterBook;