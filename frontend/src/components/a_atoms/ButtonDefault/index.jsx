import React from 'react';
import classnames from 'classnames'

export const ButtonType = {
    BUTTON: 'button',
    RESET: 'reset',
    SUBMIT: 'submit',
}
  
export const ButtonTheme = {
    DEFAULT: 'default',
    ROUNDED: 'rounded',
}
  
export const ButtonSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}
  
type Props = {
    type: string,
    theme: string,
    size: string,
    onClick: Function,
    children: React.Node,
    className: string,
    disabled: boolean,
}

const ButtonDefault = ({ color }) => (
    <button
        type="button"
        className={classProps}
        onClick= {onClick}
        {/* 
        className={`atmButtonSimple ${selectedContainer ? "utInactive" : "utActive"}`}
            onClick={() => {    
                setModal(
                <CompModalStandard
                    title={"Add a new container"}
                    buttonTextPrimary={"Send"}
                    buttonTextSecondary={"Cancel"}
                    primaryClicked={async () => {await createContainer(document.getElementById("containerName").value); unSetModal()}}
                    secondaryClicked={async () => unSetModal()}>
                        <p>Choose a name for the container. (N.B. this cannot be changed)</p>
                        <Form.Control id="containerName" type="text" placeholder="e.g. holiday photos" />
                </CompModalStandard>)
        }}> 
        */} >
        <i className="fas fa-plus-circle"/>New container
    </button>
);
  
Button.defaultProps = {
    type: ButtonType.BUTTON,
    theme: ButtonTheme.DEFAULT,
    size: ButtonSize.MEDIUM,
    onClick: () => {},
    className: '',
    disabled: false,
  }
  
  export default Button

export default ButtonDefault;
