import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Logo extends React.Component {
  render() {
    return (
      <div id="logo" onClick={()=>{fetchNextQuestion();}}>LOGO</div>
    );
  }
}
class Comment extends React.Component {
  render() {
    return (
      <div id="comment">
        {this.props.text}
      </div>
    );
  }
}
class Question extends React.Component {
  renderText(text){
    if(Array.isArray(text)){
      for(let i = 0; i < text.length; i++){
        text[i] = (
          <div key={i}>{text[i]}</div>
        );
      }
    }
    return text;
  }
  render() {
    return (
      <div id="question">
        {this.renderText(this.props.text)}
      </div>
    )
  }
}
class Answer extends React.Component {
  renderOptions(options) {
    if(!Array.isArray(options)) { return null; }

    for(let i = 0; i < options.length; i++) {
      options[i] = (
        <Option key={i} attrs={options[i]} />
      );
    }
    return options;
  }
  render() {
    return (
      <div id="answer">
        {this.renderOptions(this.props.options)}
      </div>
    );
  }
}
class Option extends React.Component {
  renderButton(attrs) {
    if(attrs.nextQId) {
      return (
        <button type="button" className={attrs.main && "main"} onClick={()=>fetchNextQuestion(attrs.nextQId)}>
          {attrs.text}
        </button>
      );
    } else {
      return (
        <button type="button">{attrs.text}</button>
      );
    }
  }
  renderTextInput(attrs) {
    return (
      <div className="input-wrapper">
        {attrs.prefix && <span className="input-prefix">{attrs.prefix}</span> }
        <input type={attrs.type} />
        {attrs.suffix && <span className="input-suffix">{attrs.suffix}</span> }
      </div>
    );
  }
  render() {
    let option = null;
    switch(this.props.attrs.type){
      case "button":
        option = this.renderButton(this.props.attrs);
        break;
      case "text":
      case "tel":
        option = this.renderTextInput(this.props.attrs);
        break;
      default:
        break;
    }
    return option;
  }
}
class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = { comment: null, question: null, answer: null };
  }
  componentDidMount() {
    fetchNextQuestion();
  }
  setContent(data) {
    this.setState({ comment: data.comment, question: data.question, answer: data.answer });
  }
  render() {
    return (
      <div id="content">
        <Logo />
        <Comment text={this.state.comment} />
        <Question text={this.state.question} />
        <Answer options={this.state.answer} />
      </div>
    );
  }
}

// ========================================

let content = null;
document.body.onload = ()=>content = renderDOM();

function fetchNextQuestion(qid) {
  ajaxGetQuestion(qid)
    .then((resp)=>content.setContent(JSON.parse(resp)))
    .catch((resp)=>console.log(resp));
}
function ajaxGetQuestion(qid){
  return new Promise((resolve, reject)=>{
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:1234/GetQuestion", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        if(this.status === 200) { resolve(this.responseText); }
        else { reject(this.responseText); }
      }
    };
    xhttp.send("{\"qid\": " + (qid ? qid : null) + "}");
  });
}
function renderDOM(){
  return ReactDOM.render(
    <Content />, 
    document.getElementById("root")
  );
}
