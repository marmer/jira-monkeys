import React, {FunctionComponent} from "react";
import "./ModalView.css";

const ModalView: FunctionComponent<{ onClose: () => void }> = ({children, onClose}) => {
    return <>
        <div className="modalView">
            <button className="close" onClick={onClose}>X</button>
            {children}
        </div>
        <div className="modalOverlay"/>
    </>;
};
export default ModalView;
