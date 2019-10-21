import React, { Component } from 'react';
import ReturnNav from './ReturnNav';

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <ReturnNav history={this.props.history} header="Projects" suppressBack suppressSearch/>
                <div className="w3-container w3-padding-64 w3-theme-l3">
			  <h2 style={{textAlign: "center"}}><b>Illusive Affinity (TD Game)</b></h2>
			  <div className="w3-card-12" style={{width: "100%"}}>
                  <img src="../images/illusiveAffinity5.png" alt="" 
                    style={{width:"100%", maxWidth:"1000px", display:"block", marginLeft:"auto", marginRight:"auto"}} />
                  <br />
                  <br />
				  <div className="w3-container w3-center">
				    <p>Developed in LIBGDX, this is a project I started to learn gaming concepts. I chose LIBGDX because 
						 it allows everything to be coded in Java yet creates ported versions of the app for GWT,
						 Desktop, Iphone and Android. This game utilizes collision detections,
						 animations, and threading. The games engine is pretty solid and there are some levels that are playable. 
						 The game itself is still a work in progress and I'm pretty happy how it turned out.  All graphics were created by me using
						 Gimp and Graphics Gale.</p>
				    <a href="http://www.illusiveaffinity.appspot.com/" target="_blank" rel="noopener noreferrer" className="w3-text-blue">Illusive Affinity (play)</a> 
				  </div>
			  </div>
			</div>
			<div className="w3-container w3-padding-64 w3-theme-l3">
			  <h2 style={{textAlign: "center"}}><b>Card Game</b></h2>
			  <div className="w3-card-12" style={{width:"100%"}}>
                  <img src="../images/card4.png" alt="" 
                    style={{width:"100%", maxWidth:"1000px", display:"block", marginLeft:"auto", marginRight:"auto"}} />
                  <br />
                  <br />
				  <div className="w3-container w3-center">
				    <p>My first game I ever created. It is built strictly with GWT, sound coming from Gwt-voices. This game is complete and ready to play. 
					   It uses GWT Timers and HTML Canvas to render and run the game. Cards can be upgraded and unlocked via in game progress, earning money and completing the campaign. 
						Game progress is saved to local storage in the browser and is encrypted so you cant cheat :) and so 
						you can continue your progress later on, just dont delete your browser cache!. The game is also linked to Facebook via a like and share widget feel free to like and share it! :)</p>
				    <a href="http://www.cardgamehoman.appspot.com/" target="_blank" rel="noopener noreferrer" className="w3-text-blue">Card Game (play)</a> 
				  </div>
			  </div>
			</div>
			<div className="w3-container w3-padding-64 w3-theme-l3">
			  <h2 style={{textAlign: "center"}}><b>Finance Tracker</b></h2>
			  <div className="w3-card-12" style={{width:"100%"}}>
                  <img src="../images/financeTracker.png" alt="" 
                    style={{width:"100%", maxWidth:"1000px", display:"block", marginLeft:"auto", marginRight:"auto"}} />
                  <br />
                  <br />
				  <div className="w3-container w3-center">
				    <p>This is my first GWT App. I created this to learn the framework. It's an app to keep track 
						of your finances. You can add your own transactions to the app and also schedule 
						reoccuring transactions so that they occur automatically. All data is kept in your local storage in 
						the browser so you can continue to use the app, just dont delete your browser cache! There is also 
						an option to get all your transactions into your clipboard so you can paste them into Excel or any other program. 
						The app is mobile friendly and will scale to the devices screen size. </p>
				    <a href="http://www.financehelperhoman.appspot.com/" target="_blank" rel="noopener noreferrer" className="w3-text-blue">Finance Tracker (run)</a> 
				  </div>
			  </div>
			</div>
			<div className="w3-container w3-padding-64 w3-theme-l3">
			  <h2 style={{textAlign: "center"}}><b>2d Practice Scroller</b></h2>
			  <div className="w3-card-12" style={{width:"100%"}}>
                  <img src="../images/adventureGame.png" alt="" 
                    style={{width:"100%", maxWidth:"1000px", display:"block", marginLeft:"auto", marginRight:"auto"}} />
                  <br />
                  <br />
				  <div className="w3-container w3-center">
				    <p>This was my first free running game. Its created in GWT and Lienzo a GWT plugin. I developed this as a 
						sandbox to practice gaming concepts and to try out the Lienzo plugin.  </p>
				    <a href="http://adventuregamehoman.appspot.com/" target="_blank" rel="noopener noreferrer" className="w3-text-blue">Adventure Game (2d Practice (play))</a> 
				  </div>
			  </div>
			</div>
			<div className="w3-container w3-padding-64 w3-theme-l3">
			  <h2 style={{textAlign: "center"}}><b>Task Tracker</b></h2>
			  <div className="w3-card-12" style={{width:"100%"}}>
                  <img src="../images/taskTracker.png" alt="" 
                    style={{width:"100%", maxWidth:"1000px", display:"block", marginLeft:"auto", marginRight:"auto"}} />
                  <br />
                  <br />
				  <div className="w3-container w3-center">
				    <p>A simple task tracker developed in GWT. I developed this to test the CellTable in GWT. This table incorporates 
						paging and editable cells. You can use this app to track tasks you have completed or need to complete. You
						can add any amount of tasks and delete them inline or delete them all.  All tasks are stored in your 
						local storage in the browser so you can continue to keep track of tasks day by day, just dont delete your browser cache!  </p>
				    <a href="http://tasktrackerhoman.appspot.com/" target="_blank" rel="noopener noreferrer" className="w3-text-blue">Task Tracker (run)</a> 
				  </div>
			  </div>
			</div>
		</div>
        )
    }
}

export default Projects;