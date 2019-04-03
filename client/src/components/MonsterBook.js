import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import ReturnNav from './ReturnNav'

class MonsterBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            monstersFetched : false
        }
    }

    componentDidMount() {
        this.getMonsters();
    }

    getMonsters() {
        fetch('/retrieveMonsters')
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
        if(!this.state.monstersFetched) {
            return (
                <div style={{color:"white"}}> <FontAwesomeIcon icon={faSpinner}/> loading ...</div>
            )
        }
        let monsters = [];
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
        return (
            <div>
                <ReturnNav history={this.props.history} header="Monster Book"/>
                <div style={{margin:"12px"}}>
                    {monsters}  
                </div>
            </div>     
        )
    }
}

export default MonsterBook;