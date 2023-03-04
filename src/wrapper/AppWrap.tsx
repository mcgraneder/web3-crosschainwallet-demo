import { FunctionComponent } from "react";
import style from "./AppWrap.module.scss";

const AppWrap = (
  Component: FunctionComponent,
  className: string = "",
  wrapperClassName: string = "",
) =>
  function HOC() {
    return (
      <div className={`${style["app__sub-container"]} ${className || ""}`}>
        <div className={`${style["app__wrapper"]} ${wrapperClassName || ""}`}>
          <Component />
        </div>
      </div>
    );
  };

export default AppWrap;
