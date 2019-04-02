import React, {Component} from 'react';
import {Link} from 'react-router-dom';
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
        this.getMonster = this.getMonster.bind(this);
    }

    componentDidMount() {
        let urlParm = new URLSearchParams(this.props.location.search).get("monsterId");
        let monsterId = urlParm;
        if(monsterId) {
            this.getMonster(monsterId); 
        }
    }

    componentWillReceiveProps(nextProps) {
        let urlParm = new URLSearchParams(nextProps.location.search).get("monsterId");
        let monsterId = urlParm;

        if(monsterId) {
            this.getMonster(monsterId); 
        }
    }

    getMonster(monsterId) {
        fetch('/retrieveMonster?number=' + monsterId)
            .then(response => response.json())
            .then(data => {
                if(this.state.monsterData !== data) {
                    this.setState(() => ({
                        monsterData : data,
                        monsterDataFetched : true,
                        monsterId : monsterId
                    }))
                }
                //document.getElementsByName("react-autosuggest__input")[0].value = data.name;
            }).catch(function(error) {
                console.log('Request failed', error)
            });
    }

    render() {
        const loading = (
            <div> <FontAwesomeIcon icon={faSpinner}/> loading ...</div>
        )
        let rarityStars = [];
        if(this.state.monsterData && this.state.monsterData.rarity) {
            for(let i = 0; i < this.state.monsterData.rarity; i++) {
                rarityStars.push(<span key={i}><i className="fa fa-star" aria-hidden="true" style={{width:"5px",height:"5px"}}></i>&nbsp;&nbsp;</span>)
            }
        }

        let evoTreeComponent = []; 
        if(this.state.monsterData && this.state.monsterData.evoTree) {
            
            let evoTreeWrapperComponent = [];
            for(let j = 0; j < this.state.monsterData.evoTree.length; j++) {
                let evoTreeIndComponent = [];
                let evoMonster = this.state.monsterData.evoTree[j];
                    if(evoMonster.hasChild) {
                        evoTreeIndComponent.push(
                            <div key={j} className="evoImageWrap">
                                <Link to={'/showMonsterDetails?monsterId=' + evoMonster.childId + "&monsterName=" + evoMonster.childName}>
                                    <img className="evoImageBig" 
                                        src={evoMonster.childPic + ""} title={this.childId + ".&nbsp;" + evoMonster.childName} alt="Missing"/>
                                </Link>
                            </div>
                        )
                        for(let k = 0; k < evoMonster.evopics.length; k++) {
                            let evoPic = evoMonster.evopics[k];
                            evoTreeIndComponent.push(
                                <div key={evoMonster.evoIds[k]} className="evoImageWrap">
                                    <Link to={'/showMonsterDetails?monsterId=' + evoMonster.evoIds[k] + "&monsterName="}>{/* //TODO: GET NAME FOR EVO MATS */}
                                        <img className="evoImageSmall" src={evoPic} alt="Missing"/>
                                    </Link>
                                </div>
                            )
                        }
                        evoTreeIndComponent.push(
                            <div key={evoMonster.id} className="evoImageWrap">
                                <Link to={'/showMonsterDetails?monsterId=' + evoMonster.id + "&monsterName=" + evoMonster.name}>
                                    <img className="evoImageBig" 
                                        src={evoMonster.pic} title={evoMonster.id+ ".&nbsp;" + evoMonster.name} alt="Missing"/>
                                </Link>
                            </div>
                        )
                    }
                evoTreeWrapperComponent.push(<div key={j} className="evoContainer">{evoTreeIndComponent}</div>);
            }
            evoTreeComponent.push(<div key="evoTree">
                                    <div className="w3-margin-bottom w3-theme-dark w3-large">
                                        <b>Evolution Tree</b>
                                    </div>
                                    <div className="w3-margin-bottom" style={{maxWidth:"780px"}}>
                                        {evoTreeWrapperComponent}
                                    </div>
                                  </div>
                                  );
        }

        

        return ( 
            <div>
              <ReturnNav history={this.props.history} header="Monster Details"/>
                {
                this.state.monsterData ?
                        this.state.monsterData.unreleased ? 
                            <div className="w3-xlarge" style={{color:"pink"}}>
                                * CARD IS NOT YET RELEASED
                                <br></br>
                            </div>
                        :
                        <div>
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
                            <div style={{whiteSpace: "nowrap", marginLeft: "20px"}}>
                                <br></br>
                                <br></br>
                                <div style={{display: "inline-block"}}>
                                    <div style={{height:"70px", width:"70px", backgroundSize:"contain",
                                        backgroundRepeat:"no-repeat", backgroundImage:"url(" + this.state.monsterData.img + ")"}}>
                                    </div>
                                    <div className="w3-theme-dark w3-small">
                                        MP:{this.state.monsterData.mp}
                                    </div>
                                    <br></br>
                                </div>
                                <div style={{display:"inline-block", verticalAlign:"top", whiteSpace:"initial", marginLeft: "5px", marginRight: "25px"}} className="w3-theme-l3">
                                    <div className="w3-theme-dark">
                                        No.{this.state.monsterData.id}&nbsp;&nbsp;&nbsp;
                                        &nbsp;{rarityStars}&nbsp;                                         
                                        ({this.state.monsterData.rarity})&nbsp;/&nbsp;Cost:&nbsp;{this.state.monsterData.cost}
                                    </div>
                                    <div className="w3-theme-dark" style={{display:"inline-block"}}>
                                        {this.state.monsterData.name}
                                    </div>
                                </div>
                                <br></br>
                                <br></br>
                            </div>
                            <div className="w3-margin-bottom" style={{marginLeft: "20px", marginRight: "20px"}}>
                                <span className="w3-theme-dark w3-medium">
                                    <b>Skill&nbsp;</b>
                                </span>
                                <span className="w3-theme-dark w3-small">
                                    (lvl.&nbsp;1:&nbsp;Turn:&nbsp;{this.state.monsterData.turnMax}&nbsp;&nbsp;->&nbsp;
                                                        Turn:&nbsp;{this.state.monsterData.turnMin})
                                </span>
                                <div className="w3-theme-dark w3-small">
                                    &nbsp;&nbsp;{this.state.monsterData.activeSkill}: {this.state.monsterData.activeSkillDescription}
                                </div>
                                <br></br>
                                <div className="w3-theme-dark w3-medium">
                                    <b>Leader Skill</b>
                                </div>
                                <div className="w3-theme-dark w3-small">
                                    &nbsp;&nbsp;{this.state.monsterData.leaderSkill}: {this.state.monsterData.leaderSkillDescription}
                                </div> 
                            <br></br>
                            <br></br>
                            {evoTreeComponent}
                            </div>
                        </div>
                : 
                <div></div>
                }
		    </div>
        )
    }
}

export default ShowMonsterDetails;