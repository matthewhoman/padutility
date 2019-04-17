import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReturnNav from './ReturnNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

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
        // const loading = (
        //     <div> <FontAwesomeIcon icon={faSpinner}/> loading ...</div>
        // )
        let rarityStars = [];
        if(this.state.monsterData && this.state.monsterData.rarity) {
            for(let i = 0; i < this.state.monsterData.rarity; i++) {
                rarityStars.push(<span key={i}><i className="fa fa-star" aria-hidden="true" style={{width:"5px",height:"5px"}}></i>&nbsp;&nbsp;</span>)
            }
        }

        let evoTreeComponent = [];
        if(this.state.monsterData) {
            for(let i = 0; i < this.state.monsterData.evoTree.length; i++) {
                let evo = this.state.monsterData.evoTree[i];
                let evoMatsComponent = [];
                for(let j = 0; j < evo.evoMats.length; j++) {
                    let mat = evo.evoMats[j];
                    if(mat === 0) {
                        evoMatsComponent.push(
                            <div key={i + j} className="evoImageWrap">
                                <img className="evoImageSmall" src="/images/transparent.png" alt=""/>
                                </div>
                        )
                    } else {
                        evoMatsComponent.push(
                            <div key={i + j} className="evoImageWrap">
                                <Link to={'/showMonsterDetails?monsterId=' + mat}>{/* TODO: do i need name? + "&monsterName=" + evoMonster.name}> */}
                                    <img className="evoImageSmall" 
                                        src={'http://www.puzzledragonx.com/en/img/book/' + mat + ".png"} title={mat} alt=" "/>
                                </Link>
                            </div>
                        )
                    }
                }
                evoTreeComponent.push(<div key={i}>
                                        <div className="w3-margin-bottom" style={{maxWidth:"780px"}}>
                                            <div key={evo.evoFromId} className="evoImageWrap">
                                                <Link to={'/showMonsterDetails?monsterId=' + evo.evoFromId + "&monsterName=" + evo.evoFromName}>
                                                    <img className="evoImageBig" 
                                                        src={'http://www.puzzledragonx.com/en/img/book/' + evo.evoFromId + ".png"} title={evo.evoFromId} alt=""/>
                                                </Link>
                                            </div>
                                            {evoMatsComponent}
                                            <div key={evo.evoToId} className="evoImageWrap">
                                                <Link to={'/showMonsterDetails?monsterId=' + evo.evoToId + "&monsterName=" + evo.evoToName}>
                                                    <img className="evoImageBig" 
                                                        src={'http://www.puzzledragonx.com/en/img/book/' + evo.evoToId + ".png"} title={evo.evoToId} alt=""/>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    );
                }
        }

        return ( 
            <div>
              <ReturnNav history={this.props.history} header="Monster Details"/>
                {
                this.state.monsterData ?
                        <div>
                            {
                                this.state.monsterData.unreleased 
                                ? 
                                <div className="w3-xlarge" style={{color:"pink"}}>
                                    * CARD IS NOT YET RELEASED
                                    <br></br>
                                </div>
                                :
                                <div></div>
                            }
                            <div style={{position:"relative", display:"inline-block"}}>
                                {/* outline to hide water mark on image */}
                                <img src={monsterImageURL.replace("#", this.state.monsterData.id)} 
                                    style={{width:"100%", height:"auto", maxHeight:"600px", maxWidth:"800px", outline:"18px solid black", outlineOffset:"-18px"}} alt= ""/> 
                            </div>
                            <div style={{whiteSpace: "nowrap", marginLeft: "20px"}}>
                                <br></br>
                                <br></br>
                                <div style={{display: "inline-block"}}>
                                    {/* outline to trim white borders */}
                                    <div style={{height:"60px", width:"60px", backgroundSize:"contain", outline:"1px solid black", outlineOffset:"-1px",
                                        backgroundRepeat:"no-repeat", backgroundImage:"url(" + this.state.monsterData.img + ")"}}>
                                    </div>
                                    <div className="w3-theme-dark w3-tiny">
                                        MP:{this.state.monsterData.mp}
                                    </div>
                                    <br></br>
                                </div>
                                <div style={{display:"inline-block", verticalAlign:"top", whiteSpace:"initial", marginLeft: "5px", marginRight: "25px"}} className="w3-theme-l3">
                                    <div className="lightblueText">
                                        No.{this.state.monsterData.id}&nbsp;&nbsp;&nbsp;
                                        {
                                            this.state.monsterData.type !== -1 && this.state.monsterData.type !== null ?
                                                <span><img src={"images/0" + this.state.monsterData.type +".png"} 
                                                    className="typeImg" alt= ""/>&nbsp;&nbsp;</span>
                                            :
                                            <div></div>
                                        }
                                        {
                                            this.state.monsterData.type2 !== -1 && this.state.monsterData.type2 !== null ?
                                                <span><img src={"images/0" + this.state.monsterData.type2 +".png"} 
                                                    className="typeImg" alt= ""/>&nbsp;&nbsp;</span>
                                            :
                                            <div></div>
                                        }
                                        {
                                            this.state.monsterData.type3 !== -1 && this.state.monsterData.type3 !== null ?
                                                <span><img src={"images/0" + this.state.monsterData.type3 +".png"} 
                                                    className="typeImg" alt= ""/>&nbsp;&nbsp;</span>
                                            :
                                            <div></div>
                                        }
                                    </div>
                                    <div className="w3-theme-dark">
                                        {this.state.monsterData.name}
                                    </div>
                                    <div className="w3-theme-dark" style={{display:"inline-block"}}>
                                        {rarityStars}&nbsp;({this.state.monsterData.rarity})
                                    </div>
                                </div>
                            </div>
                            <div className="w3-margin-bottom" style={{marginLeft: "20px", marginRight: "20px"}}>
                                {
                                    this.state.monsterData.awakenings.length > 0 
                                    ? 
                                    <div>
                                        <div className="w3-theme-dark w3-medium">
                                            <b>Awakenings:</b>
                                        </div>
                                        <div className="w3-theme-dark w3-small">
                                            {
                                                this.state.monsterData.awakenings.map((value, index) => {                     
                                                    return <img key={index} src={"images/Awokens/00"+ value + ".png"} //** NO DECSCRIPTION? */title={value.name + ":/n" + value.desc}
                                                            className="awakenImg" alt= ""/>
                                                })
                                            }
                                        </div>
                                        <br></br>
                                    </div>
                                    :
                                    <div></div>
                                }
                                {
                                    this.state.monsterData.superAwakenings.length > 0 
                                    ? 
                                        <div>
                                            <div className="w3-theme-dark w3-medium">
                                                <b>Super Awakenings:</b>
                                            </div>
                                            <div className="w3-theme-dark w3-small">
                                                {
                                                    this.state.monsterData.superAwakenings.map((value, index) => {                     
                                                        return <img key={index} src={"images/Awokens/00"+ value + ".png"} //** NO DECSCRIPTION? */title={value.name + ":/n" + value.desc}
                                                                className="awakenImg" alt= ""/>
                                                    })
                                                }
                                            </div>
                                            <br></br>
                                        </div>
                                    : 
                                    <div></div>
                                }
                                <div className="w3-theme-dark w3-small">
                                        Cost:&nbsp;{this.state.monsterData.cost}
                                </div>
                                <br></br>
                                <span className="w3-theme-dark w3-medium">
                                    <b>Skill&nbsp;</b>
                                </span>
                                <span className="w3-theme-dark w3-small">
                                    (lvl.&nbsp;1:&nbsp;Turn:&nbsp;{this.state.monsterData.turnMax}&nbsp;&nbsp;<FontAwesomeIcon icon={faArrowRight} />&nbsp;
                                                        Turn:&nbsp;{this.state.monsterData.turnMin})
                                </span>
                                <div className="w3-small" style={{color:"lightgreen",width:"auto"}}>
                                    &nbsp;&nbsp;{this.state.monsterData.activeSkill}:
                                </div>
                                <div className="w3-theme-dark w3-small">
                                <div style={{display:"inline-block",width:"2%"}}>&nbsp;</div>
                                    <div style={{display:"inline-block", width:"98%"}}>{this.state.monsterData.activeSkillDescription}</div>
                                </div>
                                <br></br>
                                <div className="w3-theme-dark w3-medium">
                                    <b>Leader Skill</b>
                                </div>
                                <div className="w3-small" style={{color:"lightblue",width:"auto"}}>
                                    &nbsp;&nbsp;{this.state.monsterData.leaderSkill}:
                                </div> 
                                <div className="w3-theme-dark w3-small">
                                <div style={{display:"inline-block",width:"2%"}}>&nbsp;</div>
                                    <div style={{display:"inline-block", width:"98%"}}>{this.state.monsterData.leaderSkillDescription}</div>
                                </div> 
                            <br></br>
                            <br></br>
                            {
                                evoTreeComponent.length !== 0 
                                ?
                                    <div className="w3-margin-bottom w3-theme-dark w3-medium">
                                        <b>Evolution Tree</b>
                                        {evoTreeComponent}
                                    </div>
                                :
                                <div></div>
                            }
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