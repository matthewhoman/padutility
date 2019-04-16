import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import ReturnNav from './ReturnNav'

class LeaderSkillSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            monstersFetched : false,
            value : ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getMonsters = this.getMonsters.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.getMonsters();
    }
    
    componentDidMount() {
        
    }

    getMonsters() {
        fetch('/retrieveLeaders?searchStr=' + this.state.value)
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
        let monsters = [];
        if(this.state.monstersFetched) {
            for(let i = 0; i < this.state.monsters.length; i++) {
                let monster = this.state.monsters[i];
                monsters.push(
                    <div style={{margin:"5px",display:"inline-block"}}>
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
                <ReturnNav history={this.props.history} header="Leader Skill Search"/>
                <form onSubmit={this.handleSubmit} style={{float:"right"}}>
                    <label style={{color:"white"}}>
                        Search for Leaders:
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Search" />
                </form>
                <div style={{margin:"12px"}}>
                    {monsters}  
                </div>
            </div>     
        )
    }
}

export default LeaderSkillSearch;