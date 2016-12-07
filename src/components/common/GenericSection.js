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
    let{css, dependencies} = this.props;
    if(css){
      add(css, {dependencies});
    }
  }

  componentWillUnmount(){
    let{css, dependencies} = this.props;
    if(css){
      remove(css, {dependencies});
    }
  }

  render() {
    return (
      <div id={this.props.id}>
        {this.state.content}
      </div>
    );
  }
}

GenericSection.propTypes = {
  id: PropTypes.string.isRequired,
  html: PropTypes.string.isRequired,
  css: PropTypes.string,
  dependencies: PropTypes.object
};

export default GenericSection;
