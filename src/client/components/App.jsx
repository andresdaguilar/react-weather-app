import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Async } from 'react-select';
import {WeatherWidget} from './weather';
import {AddCity} from './addcity';
import Loader from 'react-loader';

export class App extends Component {
    constructor(props){
        super(props);
        this.state = {currentCity: 0, isLoading: true, weather: []};
        this.cities =[];
        fetch(`./api/getCities`)
        .then(result=>result.json())
        .then(items=>{
            this.cities=items;
            this.updateWeather();
        });       
        this.handleClick = this.handleClick.bind(this);           
    }

    updateWeather(){
        for(let i=0;i<this.cities.length; i++){
            fetch(`./api/weather/`+this.cities[i].id)
            .then(result=>result.json())
            .then(items=> {
                this.cities[i].weather=items;
                this.setState({isLoading: false});
            });     
        }
    }
    componentDidMount() {   
        this.setState({currentCity:0});
        this.timerID = setInterval(
            () => this.tick(),
            10000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick(){        
        let next = this.state.currentCity == this.cities.length-1 ? 0 : this.state.currentCity + 1;
        if (this.cities[next].weather == undefined){
            fetch(`./api/weather/`+this.cities[next].id)
            .then(result=>result.json())
            .then(items=>this.cities[next].weather = items);  
        }
        this.setState({currentCity : next});        
    }

    handleClick(city){   
        fetch(`./api/weather/`+city.id)
        .then(result=>result.json())
        .then(items=> {
            city.weather = items;
            this.cities.push(city);
        });               
    }

    render() {         

        if (this.cities.length > 0){           
            var city = this.cities[this.state.currentCity].name;
            var temp = '';
            var state_name='N/D';
            var icon = '';
            if (this.cities[this.state.currentCity].weather != undefined){
                temp = this.cities[this.state.currentCity].weather.consolidated_weather[0].the_temp.toFixed(1);
                state_name = this.cities[this.state.currentCity].weather.consolidated_weather[0].weather_state_name;
                icon =  this.cities[this.state.currentCity].weather.consolidated_weather[0].weather_state_abbr;
            }            
            return (
                <div>              
                <WeatherWidget city={city} temp={temp} icon={icon} state={state_name}/>
                <AddCity onClick={this.handleClick}/>                
                </div>

            )
        }else{
            return (
                <div>
                    <h2>Loading cities...</h2>
                    <Loader loaded={false} lines={13} length={20} width={10} radius={20}
                    corners={1} rotate={0} direction={1} color="#000" speed={1}
                    trail={60} shadow={false} hwaccel={false} className="spinner"
                    zIndex={2e9} top="50%" left="50%" scale={1.00}
                    loadedClassName="loadedContent" />
                </div>
            )
        }
    }
}
