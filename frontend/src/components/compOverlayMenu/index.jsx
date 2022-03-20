import React from "react";
import onClickOutside from "react-onclickoutside";
import {useModal} from "../compModals/compModalContext";
import CompModalStandard from "../compModals/compModalStandard";
// import {createContainer} from "../../manager/containers";
import { Form } from "react-bootstrap";

function CompOverlayMenu(props) {
    //leave this for the time being - it should allow us to click outside to close like the dropdown, but currently not working
    CompOverlayMenu.handleClickOutside = () => props.setShowMenu(false)
    const { setModal, unSetModal } = useModal()
    return (
        props.show ? 
            <div onClick={() => props.setShowMenu(false)}>
                <div className="utOverlayMenuSmall" onClick={e => e.stopPropagation()}>
                    <nav class="nav flex-column align-items-start">
                        { props.type === "object" ?  
                            <>
                                <button className="atmButtonBase nav-link" onClick={props.view}><i className="fas fa-eye"/>&nbsp;View</button>
                                <button className="atmButtonBase nav-link" onClick={props.download}><i className="fas fa-download"/>&nbsp;Download</button> 
                            </>
                        : null }
                        {/*  <button data-bs-toggle="modal" data-bs-target="#deleteModal" type="button" className="atmButtonBase nav-link"><i className="fas fa-trash-alt"/>&nbsp;Delete</button> */}
                        <button 
                            type="button" 
                            className="atmButtonBase nav-link"
                            onClick={() => {
                                setModal(
                                <CompModalStandard 
                                    title={"Confirmation"} 
                                    buttonTextPrimary={"Yes"} 
                                    buttonTextSecondary={"No"} 
                                    secondaryClicked={async () => unSetModal()} 
                                    primaryClicked={() => {props.onDelete(); unSetModal()}}>
                                        <p>Are you sure you want to delete this item?</p>
                                </CompModalStandard>)
                            }}>
                            <i className="fas fa-trash-alt"/>&nbsp;Delete
                        </button>
                    </nav>
                </div>
                {/* <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <CompModalStandard title="Delete?" buttonTextPrimary="Yes" buttonTextSecondary="No" clicked={props.onDelete}>
                        <Form.Label>Are you sure?</Form.Label>
                        <Form.Text>Are you sure you want to delete this item?</Form.Text>
                    </CompModalStandard>
                </div> */}
            </div> : null
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => CompOverlayMenu.handleClickOutside,
};

export default onClickOutside(CompOverlayMenu, clickOutsideConfig);
// export default CompOverlayMenu;
