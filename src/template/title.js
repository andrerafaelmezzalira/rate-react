import React from "react";
import { Layout, Header  } from 'react-mdl';

class Title extends React.Component {

  render() {
    return (
      <div style={{height: '100px', position: 'relative'}}>
          <Layout fixedHeader >
              <Header title="Plano FaleMais!">
              </Header>
          </Layout>
      </div>
    );
  }
}

export default Title;