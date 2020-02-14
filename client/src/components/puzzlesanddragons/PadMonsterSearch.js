import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Image from './Image';

class PadMonsterSearch extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            monstersFetched : false,
            suggestions: [],
            value: '',
            clearMonsterSuggest : this.props.clearMonsterSuggest
        };
    }

    getSuggestions = (value, data) => {
        return data;
    };
    
    getSuggestionValue = suggestion => suggestion.name;
    
    renderSuggestion = suggestion => (
        <Link to={'/showMonsterDetails?monsterId=' + suggestion.id + "&monsterName=" + suggestion.name}>
            <div className="autocompleteRow">
                <div className="overflows" style={{position:"relative", top:"10px", 
                        display:"table", tableLayout:"fixed", width:"100%", height:"100%"}}>
                    <span className="overflows" style={{display:"table-cell", width:"90px"}}>
                        <Image 
                            className="monsterImageSearch"
                            title={suggestion.id + ".&nbsp;" + suggestion.name}
                            id={suggestion.id}
                            alt={suggestion.id}>
                        </Image>
                    </span>
                    <span className="w3-small overflows" style={{display:"table-cell",verticalAlign:"top"}}>
                        <div className="overflows">
                            <span className="lightblueText">No.{suggestion.id}</span>
                            <span style={{color: "darkgrey", float:"right"}}>
                                <span>MP{suggestion.mp}&nbsp;/&nbsp;</span>
                                <span><i className="fa fa-star" aria-hidden="true" style={{width:"5px",height:"5px"}}></i>
                                    &nbsp;&nbsp;{suggestion.rarity}&nbsp;/&nbsp;</span>
                                <span>S{suggestion.turnMax}&nbsp;<FontAwesomeIcon icon={faArrowRight} />&nbsp;{suggestion.turnMin}&nbsp;&nbsp;</span>
                                {
                                    suggestion.type && suggestion.type !== -1 && suggestion.type != null
                                    ?
                                    <img src={"images/type/" + suggestion.type +".png"} 
                                        style={{width:"18px",height:"18px", verticalAlign:"top"}} alt=""/>
                                    :
                                    <span></span>
                                }
                                {
                                    suggestion.type2 && suggestion.type2 !== -1 && suggestion.type2 != null
                                    ?
                                    <img src={"images/type/" + suggestion.type2 +".png"} 
                                        style={{width:"18px",height:"18px", verticalAlign:"top"}} alt=""/>
                                    :
                                    <span></span>
                                }
                                {
                                    suggestion.type3 && suggestion.type3 !== -1 && suggestion.type3 != null
                                    ?
                                    <img src={"images/type/" + suggestion.type3 +".png"} 
                                        style={{width:"18px",height:"18px", verticalAlign:"top"}} alt=""/>
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
            value: newValue,
            clearMonsterSuggest: false
        });
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        //if(value.length < 3) {return}
        fetch('/retrieveMonstersSuggest?searchStr=' + value)
            .then(response => response.json())
            .then(data => {
                this.setState(() => ({
                    monstersFetched : true,
                    value: value,
                    monsterListDictionary : data, 
                    suggestions: this.getSuggestions(value, data) 
                }))
            }).catch(function(error) {
                console.log('Request failed', error)
            });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        if(this.state.value.trim() === '' ||
            this.state.clearMonsterSuggest) {
            this.setState({
                suggestions: []
            });
        }
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
        // const loading = (
        //     <div style={{color:"white"}}> <FontAwesomeIcon icon={faSpinner}/> loading ...</div>
        // )
        return (
            <div className="mr-sm-2" style={{id:"PadSearchBar", width: "100%", maxWidth: "400px", marginTop: "10px",
                marginBottom: "5px", paddingLeft: "5px", paddingRight: "5px", marginLeft: "auto"}}>
              
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    renderInputComponent={inputComponent}
                    inputProps={inputProps}
                    alwaysRenderSuggestions
                    focusInputOnSuggestionClick={false}
                />
			  
		    </div>
        )
    }
}

export default PadMonsterSearch;