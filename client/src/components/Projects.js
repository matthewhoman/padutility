import React, { Component } from 'react';
import Base from './Base';
import LinedTitle from './LinedTitle';

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects : [
                {
                    title: "Illusive Affinity (TD Game)",
                    description: `Developed in LIBGDX, this is a project I started to learn gaming concepts. I chose LIBGDX because 
                                    it allows everything to be coded in Java yet creates ported versions of the app for GWT,
                                    Desktop, Iphone and Android. This game utilizes collision detections,
                                    animations, and threading. The games engine is pretty solid and there are some levels that are playable. 
                                    The game itself is still a work in progress and I'm pretty happy how it turned out.  
                                    All graphics were created by me using
                                    Gimp and Graphics Gale.`,
                    image: "../images/illusiveAffinity5.png",
                    link: "http://www.illusiveaffinity.appspot.com/",
                    linkTitle: "Illusive Affinity (Play)"
                },
                {
                    title: "Battle Cards (Card Game)",
                    description: `My first game I ever created. It is built strictly with GWT, sound coming from Gwt-voices. 
                                    This game is complete and ready to play. 
                                    It uses GWT Timers and HTML Canvas to render and run the game. 
                                    Cards can be upgraded and unlocked via in game progress, earning money and completing the campaign. 
                                    Game progress is saved to local storage in the browser and is encrypted so you cant cheat :) and so 
                                    you can continue your progress later on, just dont delete your browser cache!. 
                                    The game is also linked to Facebook via a like and share widget feel free to like and share it! :)`,
                    image: "../images/card4.png",
                    link: "http://www.cardgamehoman.appspot.com/",
                    linkTitle: "Battle Cards (Play)"
                },
                {
                    title: "Finance Tracker",
                    description: `This is my first GWT App. I created this to learn the framework. It's an app to keep track 
                                    of your finances. You can add your own transactions to the app and also schedule 
                                    reoccuring transactions so that they occur automatically. All data is kept in your local storage in 
                                    the browser so you can continue to use the app, just dont delete your browser cache! There is also 
                                    an option to get all your transactions into your clipboard so you can paste them into Excel or any other program. 
                                    The app is mobile friendly and will scale to the devices screen size.`,
                    image: "../images/financeTracker.png",
                    link: "http://www.financehelperhoman.appspot.com/",
                    linkTitle: "Finance Tracker (Launch)"
                },
                {
                    title: "2d Practice Scroller Game",
                    description: `This was my first free running game. Its created in GWT and Lienzo a GWT plugin. I developed this as a 
                    sandbox to practice gaming concepts and to try out the Lienzo plugin.`,
                    image: "../images/adventureGame.png",
                    link: "http://adventuregamehoman.appspot.com/",
                    linkTitle: "Adventure Game (2d Practice (Play))"
                },
                {
                    title: "Task Tracker",
                    description: `A simple task tracker developed in GWT. I developed this to test the CellTable in GWT. This table incorporates 
                    paging and editable cells. You can use this app to track tasks you have completed or need to complete. You
                    can add any amount of tasks and delete them inline or delete them all.  All tasks are stored in your 
                    local storage in the browser so you can continue to keep track of tasks day by day, just dont delete your browser cache!`,
                    image: "../images/taskTracker.png",
                    link: "http://tasktrackerhoman.appspot.com/",
                    linkTitle: "Task Tracker (Launch)"
                }
            ]
        }
    }

    render() {
        return (
            <Base header="Matthew&nbsp;Homan" 
                childComponent={
                    <div>
                        <LinedTitle title="Projects" margBottom></LinedTitle>
                        {
                            this.state.projects.map(project => {
                                return (
                                    <div className="w3-theme-l3" style={{marginBottom:"50px", textAlign:"center"}}>
                                        <div style={{display: "inline-block"}}>
                                            <div 
                                                style={{height: "100%", maxHeight:"400px", minHeight:"250px", width: "30%", verticalAlign: "middle",
                                                    maxWidth: "800px",  minWidth: "300px", backgroundSize: "contain", backgroundPosition: "0%40%", 
                                                    backgroundRepeat: "no-repeat", backgroundImage: "url('" + project.image + "')"}}>
                                            </div>
                                        </div>
                                        <div className="w3-center" 
                                                style={{verticalAlign: "top", display: "inline-block", marginLeft: "10px", 
                                                    direction:"ltr", width: "69%", minWidth: "300px", maxWidth: "800px"}}>
                                            <h1 style={{textAlign: "center", fontSize: "22px", fontWeight:"bold", 
                                                color: "rgba(153, 153, 153, 0.6)"}}>{project.title}</h1>
                                            <div className="w3-theme-dark" style={{fontSize: "16px"}}>{project.description}</div>
                                            <a style={{fontSize: "18px", textDecoration: "underline", textAlign:"left"}} 
                                                    href={project.link} target="_blank" rel="noopener noreferrer" 
                                                        className="w3-text-blue">{project.linkTitle}</a> 
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                }>
            </Base>
        )
    }
}

export default Projects;