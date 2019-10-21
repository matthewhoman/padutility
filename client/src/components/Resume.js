import React, { Component } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import ReturnNav from './ReturnNav';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class Resume extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numPages: null,
            pageNumber: 1,
        }
        this.changePage = this.changePage.bind(this);
    }

    changePage(num) {
        this.setState({
            pageNumber: num
        });
    }
    
    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }
    
    render() {
        const { pageNumber, numPages } = this.state;
    
        return (
            <div className="w3-theme-dark" style={{paddingBottom:"50px"}}>
                <ReturnNav history={this.props.history} header="Resume" suppressBack suppressSearch/>
                <Document
                    file="resume.pdf"
                    onLoadSuccess={this.onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} />
                    <button onClick={() => this.changePage(1)}>Prev Page</button>
                    <span>&nbsp;&nbsp;</span>
                    <button onClick={() => this.changePage(2)}>Next Page</button>
                    <span>&nbsp;&nbsp;</span>
                    <span>Page {pageNumber} of {numPages}</span>
                </Document>
            </div>
        );
    }
}

export default Resume;