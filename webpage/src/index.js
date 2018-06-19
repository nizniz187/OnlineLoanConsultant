import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import "./index.css";


class Logo extends React.Component {
  render() {
    return (
      <div id="logo">LOGO</div>
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
    for(let i = 0; i < options.length; i++) {
      options[i] = (
        <Option type={options[i].type} text={options[i].text} key={i} />
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
  renderButton(text) {
    return (
      <button type="button">{text}</button>
    );
  }
  render() {
    let option = null;
    switch(this.props.type){
      case "button":
        option = this.renderButton(this.props.text);
    }
    return option;
  }
}
class Content extends React.Component {
  render() {
    return (
      <div id="content">
        <Logo />
        <Comment text={this.props.comment} />
        <Question text={this.props.question} />
        <Answer options={this.props.answer} />
      </div>
    );
  }
}

// ========================================

$(()=>{
  ajaxGetQuestion(null, renderDOM);
});

function ajaxGetQuestion(qid, successHandler){
  $.ajax({
    url: "http://localhost:1234/GetQuestion", 
    data: { qid: qid }, dataType: "json", 
    method: "post", cache: false, 
    success: successHandler,
    error: (jqXHR)=>console.log(jqXHR)
  });
}
function renderDOM(data){
  ReactDOM.render(  
    <Content 
      comment={data.comment}
      question={data.question}
      answer={data.answer}
    />,
    document.getElementById("root")
  );
}
