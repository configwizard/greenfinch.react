import React, {useState} from "react"
import CompOverlayMenu from "../../compOverlayMenu";

export function ContainerGrid(props) {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <>
            <div className="atmButtonGridHeader d-flex">
                <button 
                    type="button" 
                    className="atmButtonOptions ms-auto" 
                    onClick={() => setShowMenu(!showMenu)}>
                        { !showMenu ? <i className="far fa-ellipsis-h"/> : <i className="far fa-times" style={{"color":"red"}}/> }
                        <CompOverlayMenu setShowMenu={setShowMenu} show={showMenu}></CompOverlayMenu>
                </button>
            </div>
            <button 
                type="button"
                className="atmButtonGridContent d-flex flex-column align-items-center justify-content-between"
                onClick={() => props.onContainerSelection(props.item.id, props.item.attributes.name)}>
                    <div className="neo folder-icon"></div>
                    <span className="atmButtonGridName">{props.item.attributes.name}</span>
            </button>
        </>
    )
}
export function ContainerRow(props) {
    const [show, setShow] = useState(false)
    return (
        <div className="d-flex flex-row align-items-center">
            <div className="atmRowList">
                <button 
                    type="button" 
                    className="atmButtonRowContent" 
                    onClick={() => props.onContainerSelection(props.item.id, props.item.attributes.name)}>
                        <i className="fas fa-folder"/>
                        <span className="atmButtonRowName">{props.item.attributes.name}</span>
                </button>
            </div>
            <div className="atmRowList">Container Item 2</div>
            <div className="atmRowList">Container Item 3</div>
            <div className="ms-auto">
                <button 
                    type="button"   
                    className="atmButtonOptions" 
                    onClick={() => setShow(true)}>
                        <i className="far fa-ellipsis-h"/>
                        <CompOverlayMenu onClose={() => setShow(false)} show={show}></CompOverlayMenu>
                </button>
            </div>
        </div>
    )
}
