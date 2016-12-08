import React, {PropTypes} from 'react';
import GenericSection from './common/GenericSection';
import {add, remove} from './api/Dependencies';

class App extends React.Component {
  constructor(props) {
    super(props);
    let {bootstrap} = props;
    let sections = bootstrap.sections.map((s, i) => (<GenericSection key={i} {...s} {...bootstrap}/>));
    this.state = {sections};
  }

  componentWillMount() {
    let {bootstrap} = this.props;
    if (bootstrap.stylesheets) {
      bootstrap.stylesheets.forEach(css => add(css, bootstrap));
    }
    if (bootstrap.scripts) {
      bootstrap.scripts.forEach(j => add(j, bootstrap));
    }
  }

  componentDidMount(){
    this.props.resolve();
  }

  componentWillUnmount() {
    let {bootstrap} = this.props;

    if (bootstrap.stylesheets) {
      bootstrap.stylesheets.forEach(css => remove(css, bootstrap));
    }
  }

  render() {
    let {bootstrap} = this.props;
    let {containerClass:className, containerId:id} = bootstrap;
    let dataAttr = bootstrap.dataAttr || {};
    let attr = {className, id};
    Object.keys(dataAttr).forEach(a => attr[`data-${a}`] = dataAttr[a]);
    return (
      <div {...attr}>
        {this.state.sections}
      </div>);
  }
}

App.propTypes = {
  bootstrap: PropTypes.object.isRequired,
  resolve: PropTypes.func.isRequired
  //myProp: PropTypes.string.isRequired
};

export default App ;
