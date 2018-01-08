import React, { Component } from 'react';

export class WeatherWidget extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
        <div className="card">
            <div className="card-header">
                <h3>{this.props.city}</h3>
                <WeatherState icon={this.props.icon}/>
                <p>{this.props.state}</p>
            </div>
            <div className="card-body">
                <h2>{this.props.temp} °C </h2>                  
            </div>  

        </div>
        )
    }
}

export class WeatherState extends Component{    
    constructor(props){
        super(props);
        this.urlImg = 'https://www.metaweather.com/static/img/weather/';
    }
    render(){
        let icon = this.props.icon != "" ? this.urlImg+this.props.icon+".svg" : "";
        return <img src={icon} className="imageState"/>
    }    
}