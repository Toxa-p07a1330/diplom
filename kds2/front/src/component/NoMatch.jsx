import React, { Component } from 'react';
import {LangSelectorContext} from "../context/LangSelectorContextProvider";
import {getTranslations} from "../static/transltaions";

export default class Home extends React.Component {

    activeTranslation = {}
    static contextType = LangSelectorContext;
    componentDidMount() {
        this.activeTranslation = getTranslations("notMatch", this.context.data.lang);
        this.forceUpdate();
    }
        render() {
      return (
        <div className="container">
            <div className="danger">{this.activeTranslation.notFound}</div>
         </div>
      );
  }
}