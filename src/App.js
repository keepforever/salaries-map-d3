import React, { Component } from 'react';
import { Container } from "./styled/app"
import Preloader from "./comps/Preloader"
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {

  state = {
    techSalaries: [],
  }

  render() {
    const { techSalaries } = this.state;

    if(techSalaries.length < 1) return <Preloader />

    return (
      <Container>
        Hello App
      </Container>
    );
  }
}

export default App;
