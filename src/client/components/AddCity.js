import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Async } from 'react-select';

export class AddCity extends Component{
    constructor(props){
        super(props);       
        this.url = 'https://www.metaweather.com/api/location/search/?query=';
        this.state = {value:' '};
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
        if (this.state.name != '' && this.state.name != undefined){
            this.props.onClick({id: this.state.id, name: this.state.name});
            this.setState({id: 0, name: ''});
        }
        
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
                <button id="add" disabled={this.state.name == ''} className="btn btn-default" onClick={this.handleClick.bind(this)} >Add City {this.state.name}</button>
            </div>
        )
    }
}