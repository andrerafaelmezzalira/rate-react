import React, { Component } from "react";
import api from "./api";
import M from 'materialize-css';
import { TextInput, Table, Select } from 'react-materialize';

class Calculate extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      rates: [],
      plans: []
    };

    api.get('/rates/').then(response => { 
      this.setState({rates: response.data});
    });

    api.get('/plans/').then(response => { 
      this.setState({plans: response.data});
    });
    this.actionHandlerInput = this.actionHandlerInput.bind(this);
    this.actionHandlerSelect = this.actionHandlerSelect.bind(this);
  }

  actionHandlerInput = (index, rate, event) => {
    event.preventDefault();
    api.get('/calculate/' + rate.origin + '/' + rate.target + '/' +
      event.target.value + '/' + 
        document.getElementsByTagName('select')[index].value).then(response => { 
          this.iterate(rate, response.data, 'withPlan');
       });
       api.get('/calculate/' + rate.origin + '/' + rate.target + '/' +
       event.target.value).then(response => { 
        this.iterate(rate, response.data, 'withoutPlan');
        });
 
  };

  actionHandlerSelect = (index, rate, event) => {
    event.preventDefault();
    if(!document.getElementsByName('minutes')[index].value) {
      return;
    }

    api.get('/calculate/' + rate.origin + '/' + rate.target + '/' +
      document.getElementsByName('minutes')[index].value + '/' + 
        event.target.value).then(response => { 
          this.iterate(rate, response.data, 'withPlan');
      });
      api.get('/calculate/' + rate.origin + '/' + rate.target + '/' +
      document.getElementsByName('minutes')[index].value).then(response => { 
        this.iterate(rate, response.data, 'withoutPlan');
      });
  };

  iterate(rate, data, field){
    for(let i = 0; i < this.state.rates.length; i++){
      if (this.state.rates[i].origin === rate.origin && 
        this.state.rates[i].target === rate.target) {
          this.state.rates[i][field] = data;
          break;
        }
    }
    this.setState({
      rates : this.state.rates
    }); 
  }

  render() {
    return (
    <Table>
      <thead>
        <tr>
          <th >Origem</th>
          <th >Destino</th>
          <th >Tempo</th>
          <th >Plano FaleMais</th>
          <th >Com FaleMais</th>
          <th >Sem FaleMais</th>
        </tr>
      </thead>
      <tbody>
      {this.state.rates.map(( rate, index ) => {
        return (
          <tr key={index}>
            <td>{rate.origin}</td>
            <td>{rate.target}</td>
            <td><TextInput type="number" name="minutes" onChange={(e) => this.actionHandlerInput(index, rate, e)} /></td>
            <td>
              <Select onChange={(e) => this.actionHandlerSelect(index, rate, e)}>
                {this.state.plans.map(( plan, index ) => {
                  return (
                    <option value={plan.minute} key={plan.minute}>
                      {plan.name}
                    </option>
                  );
                })}
              </Select>
            </td>
            <td>{rate.withPlan}</td>
            <td>{rate.withoutPlan}</td>
          </tr>
        );
      })}
      </tbody>
    </Table>    
    );
  }
}

export default Calculate;