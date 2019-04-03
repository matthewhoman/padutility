import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

class PadMonsterSearch extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            monstersFetched : false
        };
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
                    value: '',
                    suggestions: [],
                    monsterListDictionary : data, 
                }))
            }).catch(function(error) {
                console.log('Request failed', error)
            });
    }

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
    
        return inputLength === 0 ? [] : this.state.monsterListDictionary.filter(item =>
            item.name.toLowerCase().slice(0, inputLength) === inputValue
        );
    };
    
    getSuggestionValue = suggestion => suggestion.name;
    
    renderSuggestion = suggestion => (
        <Link to={'/showMonsterDetails?monsterId=' + suggestion.id + "&monsterName=" + suggestion.name}>
            <div className="autocompleteRow">
                <div className="overflows" style={{position:"relative", top:"10px", 
                        display:"table", tableLayout:"fixed", width:"100%", height:"100%"}}>
                    <span className="overflows" style={{display:"table-cell", width:"90px"}}>
                        <img className="monsterImageSearch" src={suggestion.img} title={suggestion.id + ".&nbsp;" + suggestion.name} alt="" />
                    </span>
                    <span className="w3-small overflows" style={{display:"table-cell",verticalAlign:"top"}}>
                        <div className="overflows">
                            <span className="lightblueText">No.{suggestion.id}</span>
                            <span style={{color: "darkgrey", float:"right"}}>
                                <span>MP{suggestion.mp}&nbsp;/&nbsp;</span>
                                <span><i className="fa fa-star" aria-hidden="true" style={{width:"5px",height:"5px"}}></i>
                                    &nbsp;&nbsp;{suggestion.rarity}&nbsp;/&nbsp;</span>
                                <span>S{suggestion.turnMax}&nbsp;->&nbsp;{suggestion.turnMin}&nbsp;&nbsp;</span>
                                {
                                    suggestion.type && suggestion.type !== null
                                    ?
                                    <img src={"images/"+ ("0" + suggestion.type) +".png"} 
                                        style={{width:"18px",height:"18px", verticalAlign:"top"}} alt= ""/>
                                    :
                                    <span></span>
                                }
                                {
                                    suggestion.type2 && suggestion.type2 !== null 
                                    ?
                                    <img src={"images/"+ ("0" + suggestion.type2) +".png"} 
                                        style={{width:"18px",height:"18px", verticalAlign:"top"}} alt= ""/>
                                    :
                                    <span></span>
                                }
                                {
                                    suggestion.type3 && suggestion.type3 !== null
                                    ?
                                    <img src={"images/"+ ("0" + suggestion.type3) +".png"} 
                                        style={{width:"18px",height:"18px", verticalAlign:"top"}} alt= ""/>
                                    :
                                    <span></span>
                                }
                            </span>
                        </div>
                        <div className="overflows"><b>{suggestion.name}</b></div>
                        <div className="overflows">
                            <span>Lv.&nbsp;{suggestion.lvl}</span>&nbsp;&nbsp;<span>HP&nbsp;{suggestion.hp}</span>&nbsp;&nbsp;
                            <span>ATK&nbsp;{suggestion.atk}</span>&nbsp;&nbsp;<span>RCV&nbsp;{suggestion.rcv}</span>
                        </div>
                    </span>
                </div>
            </div>
        </Link>
    );

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { value, suggestions } = this.state;

        const inputComponent = inputProps => (
            <div>
              <input {...inputProps} style={{cursor:"pointer"}} onClick={(event) => event.target.select()}/>
            </div>
        );

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'Search for Monster',
            value,
            onChange: this.onChange
        };
        const loading = (
            <div> <FontAwesomeIcon icon={faSpinner} style={{color:"white"}}/> loading ...</div>
        )
        return (
            <div style={{id:"PadSearchBar", width: "100%", maxWidth: "400px"}}>
              {
              this.state.monstersFetched && this.state.monsterListDictionary ? 
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    renderInputComponent={inputComponent}
                    inputProps={inputProps}
                />
              : 
              loading
              }
			  
		    </div>
        )
    }
}

export default PadMonsterSearch;