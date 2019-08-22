import React from "react";
import api from "../service/api";
import { Grid, Cell } from 'react-mdl';
import Title from "../template/title";

class Calculate extends React.Component {
  
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
  }

  changeHandler = (index, rate) => {

    let minutes = document.getElementsByClassName('minutes')[index].value;
    if(!minutes) {
      this.response(index, '', 'withPlan');
      this.response(index, '', 'withoutPlan');
      return;
    }

    let filter = rate.origin + '/' + rate.target + '/' + minutes; 
    this.send(index, filter);
  };

  send(index, filter) {

    let url = '/calculate/' + filter;

    api.get(url).then(response => { 
      this.response(index, response.data, 'withoutPlan');
    });

    api.get(url + '/' +
      document.getElementsByClassName('minutesPlan')[index].value)
    .then(response => { 
      this.response(index, response.data, 'withPlan');
    });
  }

  response(index, data, field) {
    // eslint-disable-next-line
    this.state.rates[index][field] = data === 0 ? "0.0" : data === '' ? '' : data;
    this.setState({
      rates : this.state.rates
    }); 
  }

  render() {
    return (
      
      <div>
        <Title />
        <div style={{width: '80%', margin: 'auto'}}>
          <Grid  >
            <Cell col={2}>Origem</Cell>
            <Cell col={2}>Destino</Cell>
            <Cell col={2}>Tempo</Cell>
            <Cell col={2}>Plano FaleMais</Cell>
            <Cell col={2}><b>Com FaleMais</b></Cell>
            <Cell col={2}><b>Sem FaleMais</b></Cell>
          </Grid>
          {this.state.rates.map(( rate, index ) => {
          return (
          <Grid  key={index} >
            <Cell col={2}>0{rate.origin}</Cell>
            <Cell col={2}>0{rate.target}</Cell>
            <Cell col={2}>
              <input type="number" className="minutes"
                  onChange={() => this.changeHandler(index, rate)}
                  style={{width: '50px'}}
              />          
            </Cell>
            <Cell col={2}>
              <select className="minutesPlan" onChange={() => this.changeHandler(index, rate)}>
                  {this.state.plans.map(( plan, index ) => {
                    return (
                      <option value={plan.minute} key={plan.minute}>
                        {plan.name}
                      </option>
                    );
                  })}
              </select>
            </Cell>
            <Cell col={2}>
              {rate.withPlan ? 
                new Intl.NumberFormat('pt-BR', 
                  { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }
                ).format(rate.withPlan) : ''}
            </Cell>
            <Cell col={2}>
              {rate.withoutPlan ? 
                new Intl.NumberFormat('pt-BR', 
                  { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }
                ).format(rate.withoutPlan) : ''}
            </Cell>
          </Grid>
          );})}
        </div>
      </div>
    );
  }
}

export default Calculate;