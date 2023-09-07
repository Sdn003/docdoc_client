import { Button, IconButton } from '@mui/material'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import './App.css';


 class ErrorBoundary extends Component {
 
    
    constructor(props) {
        super(props)
        this.state = {
            hasError : false
        }
    }

 static getDerivedStateFromError(error){
    return{
        hasError : true
    }
 }

 componentDidCatch(error, info) {
    console.log(error)
    console.groupCollapsed(info)
 }
 
    render() {
        if(this.state.hasError){
            return (
              <>
                <div className="errorWrraper">
                  <div className="errorContainer">
                      <ReportProblemIcon className="errorBtn" />
                    <div>
                      <h3>Error Occurred</h3>
                    </div>
                    <Link to="/Cards">
                        <Button variant="contained" className="textField">
                          Go To Menu
                        </Button>
                    </Link>
                  </div>
                </div>
              </>
            );
        }
    return this.props.children
  }
}

export default ErrorBoundary