import React from 'react';
import ReturnNav from '../navigation/ReturnNav';
import ScrollToTopBtn from './ScrollToTopBtn';

const Base = props => {
    let style = props.suppressMargins ? {} : {
        marginLeft: "15px", marginRight: "15px"
    }
    return (
        <div style={{paddingBottom:"50px"}}>
            <ReturnNav history={props.history} header={props.header} suppressBack suppressSearch/>
            <br></br>
            <div className="w3-theme-dark" style={style}>
                {props.childComponent}
            </div>
            <br></br>
            <ScrollToTopBtn scrollStepInPx="50" delayInMs=".01"/>
        </div>
    )
}
export default Base;