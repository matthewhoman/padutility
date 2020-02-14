import React, { Component } from 'react';

class ScrollToTopBtn extends Component {
  constructor() {
    super();

    this.state = {
        intervalId: 0,
        scrolled : 0
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.listenToScroll)
  }
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll)
  }
  
  scrollStep() {
    if (window.pageYOffset === 0) {
        clearInterval(this.state.intervalId);
    }
    window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
  }
  
  scrollToTop() {
    let intervalId = setInterval(this.scrollStep.bind(this), this.props.delayInMs);
    this.setState({ intervalId: intervalId });
  }

  listenToScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop
  
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
  
    const scrolled = winScroll / height
  
    this.setState({
      scrolled: scrolled,
    })
  }
  
  render () {
    if(this.state.scrolled === 0) {
      return (
        <div/>
      )
    }
    return (
      <button title='Back to top' className='w3-theme w3-xlarge' style={{border: "none", width: "100%"}} 
        onClick={ () => { this.scrollToTop(); }}>
        Back to top
      </button>
    )
  }
} 
export default ScrollToTopBtn;