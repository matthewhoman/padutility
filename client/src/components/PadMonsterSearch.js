import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

class PadMonsterSearch extends Component {

    constructor(props) {
        super(props);
        this.showMonster = this.showMonster.bind(this);
        this.state = { 
            monstersFetched : false, 
            showMonster : false
        };
    }

    componentDidMount() {
        this.getMonsters();
    }

    getMonsters() {
        let prevSearch = sessionStorage.getItem('monsterName');
            prevSearch = !prevSearch ? "" : prevSearch;
        fetch('/retrieveMonsters')
            .then(response => response.json())
            .then(data => {
                this.setState(() => ({
                    monstersFetched : true,
                    value: prevSearch,
                    suggestions: [],
                    monsterListDictionary : data, 
                }))
            }).catch(function(error) {
                console.log('Request failed', error)
            });
    }

    showMonster(id, name) {
        sessionStorage.setItem('monsterId', id);
        sessionStorage.setItem('monsterName', name);
        this.setState(() => ({
            showMonster: true
        }))
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
        <div className="autocompleteRow" style={{height:"100px"}} onClick={() => this.showMonster(suggestion.id, suggestion.name)}>
            <div className="overflows" style={{position:"relative", top:"10px", display:"table", tableLayout:"fixed", width:"100%"}}>
                <span className="overflows" style={{display:"table-cell", width:"100px"}}>
                    <img className="monsterImageSearch" src={suggestion.img} title={suggestion.id + ".&nbsp;" + suggestion.name} alt="" />
                </span>
                <span className="w3-small overflows" style={{display:"table-cell",verticalAlign:"top"}}>
                    <div className="overflows">{suggestion.name}</div>
                    <div className="overflows">
                        <span>Lv.&nbsp;{suggestion.lvl}</span>&nbsp;&nbsp;<span>HP&nbsp;{suggestion.hp}</span>&nbsp;&nbsp;<span>ATK&nbsp;{suggestion.atk}</span>&nbsp;&nbsp;<span>RCV&nbsp;{suggestion.maxrcv}</span>
                        <div className="overflows">Skill&nbsp;Turn:&nbsp;{suggestion.turnMax}&nbsp;-&nbsp;{suggestion.turnMin}</div>
                    </div>
                </span>
            </div>
        </div>
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
        if (this.state.showMonster === true) {
            this.setState(() => ({
                showMonster: false
            }))
            return (
                <div>
                <Redirect to={'/showMonsterDetails'} />
                </div>
            )
        }
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'Search for Monster',
            value,
            onChange: this.onChange
        };
        const loading = (
            <div> <FontAwesomeIcon icon={faSpinner}/> loading ...</div>
        )
        return (
            <div style={{id:"PadSearchBar", width: "100%", marginRight:"8px"}}>
              {
              this.state.monstersFetched && this.state.monsterListDictionary ? 
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
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