import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import './Resume.scss';

class Resume extends Component {
    constructor(props) {
        super(props);
        this.state = {
            extraDetail : {
                firstname : `Matthew`,
                lastname: `Homan`,
                title : `Lead Software Engineer at Cerner`,
                website : `https:\\matthewhoman.com`,
                github : `https://github.com/matthewhoman`,
                image : `../images/mesuitface.jpg`,
                email: `Matthew.h.homan@gmail.com`,
                phone: `(814) 242-5819`,
                address: `398 Lynetree Dr\n 
                          West Chester, Pa 19380`
            },
            introPoints : [
                `7+ years of experience with proven ability to leverage full-stack knowledge and 
                    experience to develop software per the client needs, quickly and accurately from start to end.`
                ,
                `Leadership experience to guide and mentor team members including new hires out of college.`
                ,
                `Understanding present errors and rectifying them for a hassle-free running of the software. 
                    Fixing problems such as performance and poor UI designs`
            ],
            techSkills : {
                languages : [
                    {
                        name: "Java", lvl: 80
                    },
                    {
                        name: "Javascript", lvl: 80
                    },
                    {
                        name: "React", lvl: 60
                    },
                    {
                        name: "CSS", lvl: 90
                    },
                    {
                        name: "NodeJS", lvl: 90
                    },
                    {
                        name: "HTML", lvl: 90
                    },
                    {
                        name: "Spring", lvl: 75
                    },
                    {
                        name: "Microsoft SQL Server", lvl: 80
                    },
                    {
                        name: "REST", lvl: 80
                    },
                    {
                        name: "Jasmine", lvl: 90
                    },
                    {
                        name: "Junit", lvl: 90
                    },
                    {
                        name: "GWT", lvl: 95
                    },
                    {
                        name: "MongoDB", lvl: 60
                    },
                    {
                        name: "Github", lvl: 50
                    }
                ]
            },
            experience : [
                {
                    title : `Associate Lead Software Engineer (Architecture Team), Cerner`,
                    date : `02/2015 – present`,
                    points : [
                        `Worked primarily on porting our legacy monolithic app to HTML5 standards. 
                            This required creating a transpiler (with NodeJS) and extensive changes across 2000+ files.`
                        , 
                        `Working across multiple teams / with offshore associates to coordinate effort and deliver solutions.`
                        ,
                        `Worked on full stack solutions including migrating legacy backends to Spring and re-working UI's to 
                            use more modern frameworks such as JQuery, Handlebars and advanced CSS.`
                        ,
                        `Evaluated / Setup Jasmine testing into our automated build pipeline in Jenkins.`
                        ,
                        `Developed REST API's for integration across multiple solutions.`
                        ,
                        `Developed support tools to reduce working time from hours to minutes.`
                        ,
                        `Evaluated, recommended and selected software solutions.`
                        ,
                        `Monitoring and reviewing program execution for expected performance, using browser debugging (F12), 
                            and Microsoft SQL Server profiling.`
                        ,
                        `Experience standing up an application in Heroku using nodeJS, React, MongoDb and Github.`
                        ,
                        `Excelled in rapid application development and management of technological issues for assigned projects.`
                    ]
                },
                {
                    title : `Sr. Software Engineer (Architecture Team), Siemens`,
                    date : `06/2012 – 02/2015`,
                    points : [
                        `Improved user experience through enhancing UIs based on client requirements. Implemented paging / 
                            lazy loading techniques for app efficiency.`
                        ,
                        `Expertise embedding GWT into our js/jsp architecture.`
                        ,
                        `Evaluated and converted our javascript imports to use RequireJS across our entire app.`
                    ]
                }
            ],
            education : {
                title : `University of Pitsburgh, PA - B.S. Computer Science - Math Minor`,
                date : `08/2008 - 04/2012`,
            }
        }
    }
    
    render() {
        return (
            <div className="w3-row" style={{width:"100%", height:"100%", display:"flex", flexWrap:"wrap"}}>
                <div className="w3-center" style={{minWidth: "320px", width:"100%", flex: "1 1 0px",
                        background: "#282828", backgroundImage: "url('../images/triangle.svg')", 
                        backgroundRepeat: "no-repeat", backgroundSize: "contain", backgroundPosition: "0%0%"}}>
                    <div style={{marginTop:"20px"}}>
                        <img src={this.state.extraDetail.image} style={{borderRadius: "50%", 
                            border: "3px solid white", marginBottom: "10px", width: "160px", height:"160px"}} alt= "profileImage"></img>
                        <div>
                            <h2 className="name" style={{display:"inline-block"}}>
                                {this.state.extraDetail.firstname}
                            </h2>
                            <h2 className="name" style={{color: "dodgerblue", display:"inline-block"}}>
                                &nbsp;{this.state.extraDetail.lastname}
                            </h2>
                        </div>
                        <div style={{textAlign:"left", display:"table", marginLeft:"auto", marginRight:"auto"}}>
                            <h5 className="name" style={{marginBottom:"30px"}}>
                                {this.state.extraDetail.title}
                            </h5>
                            <div style={{textAlign:"left", display:"table", marginLeft:"auto", marginRight:"auto"}}>
                                {/* <div style={{color:"white", marginBottom:"10px"}}>
                                    <div style={{display:"inline-block", verticalAlign:"top"}}>
                                        <FontAwesomeIcon icon={faMapMarker}/>&nbsp;&nbsp;&nbsp;&nbsp;
                                    </div>
                                    <div style={{display:"inline-block"}}>
                                        {
                                            this.state.extraDetail.address.split('\n').map((item, key) => {
                                                    return <div key={key}>{item}</div>
                                            })
                                        }
                                    </div>
                                </div>  */}
                                <div style={{color:"white", marginBottom:"10px"}}><FontAwesomeIcon icon={faPhone}/>&nbsp;&nbsp;{this.state.extraDetail.phone}
                                </div> 
                                <div style={{color:"white", marginBottom:"30px"}}><FontAwesomeIcon icon={faEnvelope}/>&nbsp;&nbsp;{this.state.extraDetail.email}
                                </div> 
                                <div style={{color:"white"}}>WebSite:&nbsp;&nbsp;
                                    <a className="webLink" href={this.state.extraDetail.website}>MatthewHoman.com</a>
                                </div>
                                <div style={{color:"white",marginBottom:"30px"}}>Github:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <a className="webLink" href={this.state.extraDetail.github}>Github</a>
                                </div>      
                            </div>            
                        </div>
                     </div>
                </div>
                <div className="w3-container" style={{minWidth:"300px", background:"white", flex: "2 1 0px"}}>
                    <h3 style={{marginTop:"25px"}}><b>Experience</b></h3>
                    {
                        this.state.experience.map((item, index) => {
                            return (
                                <div style={{marginTop:"20px"}}>
                                    <div style={{fontWeight: "boldest", color: "black"}}>
                                        <b>{item.title}</b>
                                    </div>
                                    <div>
                                        <b>({item.date})</b>
                                    </div>
                                    <ul>
                                    {
                                        item.points.map((point, index2) => {
                                            return (
                                                <li className="name" key={index2}><b>{point}</b></li>  
                                            )
                                        })
                                    }
                                    </ul>
                                </div>
                            )
                        })
                    }
                    {
                        <div style={{marginTop:"50px", marginBottom:"50px"}}>
                            <h3><b>Education</b></h3>
                            <div>
                                <b>{this.state.education.title}</b>
                            </div>
                            <div>
                                <b>({this.state.education.date})</b>
                            </div>
                        </div>
                    }
                </div>
                <div className="w3-container" style={{minWidth:"300px",background:"white", flex: "1 1 0px"}}>
                    <div style={{marginTop:"25px", marginLeft:"auto", marginBottom:"50px", marginRight:"auto"}}>
                        <h3><b>Technical Experience</b></h3>
                        {
                            this.state.techSkills.languages.map((item, index) => {
                                return(
                                    <div> 
                                        <div><b>{item.name}</b></div>
                                        <div key={index} style={{backgroundColor: "#ddd", width: "100%", height:"20px"}}>
                                           <div style={{width: item.lvl + "%", backgroundColor: "dodgerblue", height: "20px"}}></div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Resume;