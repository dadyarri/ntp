import React from "react";

import { Heading } from "@chakra-ui/react";

export class Clock extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        time: `${new Date().getHours()}:${new Date().getMinutes()}`
      };
    }
    componentDidMount() {
      this.intervalID = setInterval(
        () => this.tick(),
        1000
      );
    }
    componentWillUnmount() {
      clearInterval(this.intervalID);
    }
    tick() {
      this.setState({
        time: `${new Date().getHours()}:${new Date().getMinutes()}`
      });
    }
    render() {
      return (
          <Heading>{this.state.time}</Heading>
      );
    }
}