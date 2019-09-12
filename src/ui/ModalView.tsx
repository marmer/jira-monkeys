import React, {FunctionComponent} from "react";
import "./ModalView.css";

const ModalView: FunctionComponent<{}> = ({children}) => {
    return <>
        <div className="modalView">
            <button className="close">X</button>
            {children}
        </div>
        <div className="modalOverlay"/>
    </>;
};
export default ModalView;
