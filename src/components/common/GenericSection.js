import React, {PropTypes} from 'react';
import GetHtml from '../api/GetHtmlComponent';
import {addCss, removeCss} from '../api/Css';
import {add, remove} from '../api/Dependencies';


class GenericSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {content: (<div/>)};
    let htmlName = props.html;
    GetHtml({htmlName})
      .then(content => this.setState({content}))
      .catch(err => this.setState({content: (<pre>{JSON.stringify(err, undefined, 4)}</pre>)}));
  }

  componentWillMount(){
    let{css, script, dependencies} = this.props;
    if(css){
      add(css, {dependencies});
    }

    if(script){
      add(script, {dependencies});
    }
  }

  componentWillUnmount(){
    let{css, script, dependencies} = this.props;
    if(css){
      remove(css, {dependencies});
    }

    if(script){
      remove(script, {dependencies});
    }
  }

  render() {

    return (
      <this.props.containerType id={this.props.id} className={this.props.className}>
        {this.state.content}
      </this.props.containerType>
    );
  }
}

GenericSection.defaultProps = {
    containerType: 'div'
};


GenericSection.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  containerType: PropTypes.oneOf(['div', 'span']),
  html: PropTypes.string.isRequired,
  css: PropTypes.string,
  script: PropTypes.string,
  dependencies: PropTypes.object
};

export default GenericSection;
