import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
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

class MonsterBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            monstersFetched : false,
            typeFilter : []
        }
        this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getMonsters = this.getMonsters.bind(this);
    }

    componentDidMount() {
        //this.getMonsters();
    }

    handleCheckBoxChange(event) {
        let typeFilter = this.state.typeFilter
        if(event.target.checked) {
            typeFilter.push(event.target.name);
        } else {
            var index = typeFilter.indexOf(event.target.name);
            if (index > -1) {
                typeFilter.splice(index, 1);
            }
        }
        this.setState(() => ({
            typeFilter: typeFilter
        }))
    }

    handleSubmit(event) {
        this.getMonsters();
        event.preventDefault();
    }

    getMonsters() {
        let typeFilter = this.state.typeFilter.length > 0 ? this.state.typeFilter : null;
        fetch('/retrieveMonsters?typeFilter=' + JSON.stringify(typeFilter))
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
        let checkBoxComps = [];
        for (var key in typeMap) {
            if (typeMap.hasOwnProperty(key)) {
                checkBoxComps.push(
                    <div className="w3-theme-dark" key={key} style={{textAlign:"left", display:"inline-block", marginLeft:"5px", marginBottom:"10px"}}>
                        <input name={typeMap[key]} onChange={this.handleCheckBoxChange} type="checkbox" 
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
                    <div style={{margin:"5px",display:"inline-block"}}>
                        <div className="lightblueText" style={{fontSize:"12px"}}>No.{monster.id}</div>
                        <Link key={i} to={'/showMonsterDetails?monsterId=' + monster.id + "&monsterName=" + monster.name}>
                            <div style={{display:"inline-block", width:"60px", height:"60px"}}>
                                <img className="evoImageBig" 
                                    src={monster.img} title={monster.id+ ".&nbsp;" + monster.name} alt=""/>
                            </div>
                        </Link>
                    </div>
                )
            }
        }
        return (
            <div>
                <ReturnNav history={this.props.history} header="Monster Book"/>
                <div style={{margin:"12px"}}>
                    <div style={{marginBottom:"10px"}}>
                        <div className="w3-theme-dark w3-large">Filter: </div>
                        <form onSubmit={this.handleSubmit}> 
                            <div style={{marginBottom:"10px"}}>
                                {checkBoxComps}
                            </div>
                            <div>
                                <input text="Find" variant="emphasis" type="submit" className="FormContent" />
                                <div className="w3-theme-dark w3-small" style={{display:"inline-block", marginLeft:"10px"}}>
                                    Top 100 results&nbsp;(&nbsp;{this.state.monsters ? this.state.monsters.length : 0}&nbsp;)
                                </div>
                            </div>
                        </form>
                    </div>
                    <div>
                        {monsters}  
                    </div>
                </div>
            </div>     
        )
    }
}

export default MonsterBook;