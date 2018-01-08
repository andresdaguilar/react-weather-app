import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Async } from 'react-select';

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
            5000
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
        console.log(city);        
        fetch(`./api/weather/`+city.id)
        .then(result=>result.json())
        .then(items=> {
            city.weather = items;
            this.cities.push(city);
            console.log(this.cities);
        });               
    }

    handleChange (selectedOption){
        this.setState({ selectedOption });
        console.log(`Selected: ${selectedOption.label}`);
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
            return <h1>Loading...</h1>
        }
    }
}

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
                <h2>{this.props.temp} °C</h2>                  
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
        return <img src={this.urlImg+this.props.icon+".svg"} className="imageState"/>
    }    
}

export class AddCity extends Component{
    constructor(props){
        super(props);       
        this.url = 'https://www.metaweather.com/api/location/search/?query=';
        this.state = {value:''};
        this.handleClick = this.handleClick.bind(this);          
        this.updateValue = this.updateValue.bind(this);          
    }
    getOptions(input){        
        return fetch(`/api/search/${input}`)
        .then((response) => {
        return response.json();
        }).then((json) => {                  
            return { options: json };
        });
      
        
    }
    handleClick(e){
        //var addCity = {value: this.state.id, city: e.title};
        this.props.onClick({id: this.state.id, name: this.state.name});
        this.setState({id: 0, name: ''});
    }

    updateValue(e){
       this.setState({id: e.woeid, name: e.title});
    }

    render(){
        const { selectedOption } = this.state;
        const value = selectedOption && selectedOption.value;        
        return(
            <div className="card card-body">                 
               <Async
                valueKey="woeid" labelKey="title"
                name="title"
                value={this.state.value}
                multi={false}
                loadOptions={this.getOptions}
                onChange={this.updateValue.bind(this)}
                className="select-custom"
                />
                <button id="add" className="btn btn-default" onClick={this.handleClick.bind(this)} >Add City {this.state.name}</button>
            </div>
        )
    }
}