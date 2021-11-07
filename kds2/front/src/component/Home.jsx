import React from 'react';
import {getTranslations} from "../static/transltaions";
import {LangSelectorContext} from "../context/GlobalContextProvider";

export default class Home extends React.Component {

    activeTranslation = {}
    static contextType = LangSelectorContext;
    componentDidMount() {
        this.activeTranslation = getTranslations("home", this.context.data.lang);
        this.forceUpdate();
    }

    render() {
      return (
          <div className="ml-0 h-100 w-100">
              <div className="pt-4 ml-4">
                <h2>{this.activeTranslation.title}</h2>
                <h3>{this.activeTranslation.copiright}</h3>
              </div>
         </div>
      );
  }
}