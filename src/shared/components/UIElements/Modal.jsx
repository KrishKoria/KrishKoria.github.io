import React from "react";
import "./Modal.css";
import ReactDOM from "react-dom";
import Backdrop from "./Backdrop.jsx";
import {CSSTransition} from "react-transition-group";

const ModalOverlay = React.forwardRef((props,ref) => {
    const content = (
        <div className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()}>
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>
    )
    return ReactDOM.createPortal(content, document.getElementById("modal"))
})
export const Modal = (props) => {
    const nodeRef = React.useRef(null);
    return (
        <React.Fragment>
            {props.show && <Backdrop onClick={props.onCancel}/>}
            <CSSTransition nodeRef={nodeRef} in={props.show} mountOnEnter unmountOnExit timeout={200} classNames="modal">
                <ModalOverlay ref={nodeRef} {...props}/>
            </CSSTransition>
        </React.Fragment>
    )
}

