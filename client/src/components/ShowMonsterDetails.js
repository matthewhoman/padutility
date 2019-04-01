import React, {Component} from 'react';
import ReturnNav from './ReturnNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

let monsterImageURL = "http://www.puzzledragonx.com/en/img/monster/MONS_#.jpg";

class ShowMonsterDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            monsterDataFetched : false
        }
    }

    componentWillReceiveProps() {
        let monsterId = sessionStorage.getItem('monsterId');
        if(monsterId) {
            fetch('/retrieveMonster?number=' + monsterId)
                .then(response => response.json())
                .then(data => {
                    this.setState(() => ({
                        monsterData : data,
                        monsterDataFetched : true,
                        monsterId : monsterId
                    }))
                }).catch(function(error) {
                    console.log('Request failed', error)
                });
        }
    }

    compon

    render() {
        const loading = (
            <div> <FontAwesomeIcon icon={faSpinner}/> loading ...</div>
        )
        return (
            <div>
              <ReturnNav history={this.props.history} header="Monster Details" suppressBack/>
                {
                 this.state.monsterData ?
                        this.state.monsterData.unreleased ? 
                            <div className="w3-xlarge" style={{color:"pink"}}>
                                * CARD IS NOT YET RELEASED
                            </div>
                        :
                        <div style={{position:"relative", display:"inline-block"}}>
                            <img src={"images/"+ (this.state.monsterData.element + 1) +".png"} 
                                style={{width:"30px",height:"30px",position:"absolute", bottom:"25px", right:"65px"}} />

                            {
                                this.state.monsterData.element2 ?
                                    <img src={"images/"+ (this.state.monsterData.element2 + 1) +".png"} 
                                        style={{width:"30px", height:"30px", position:"absolute", bottom:"25px", right:"25px"}}/>
                                :
                                <div></div>
                            }
                            <img src={monsterImageURL.replace("#", this.state.monsterData.id)} 
                                style={{width:"100%", height:"auto", maxHeight:"600px", maxWidth:"800px", outline:"18px solid black", outlineOffset:"-18px"}}/>
                        </div>
                : 
                <div></div>
                }
		    </div>
        )
    }
}

export default ShowMonsterDetails;