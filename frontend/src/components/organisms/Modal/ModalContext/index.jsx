import React, { useCallback, useEffect, useState } from 'react';

// Central style sheet for modals
import '../_settings/style.scss';

const ModalContext = React.createContext()

const Modal = ({ modal, unSetModal }) => {
    useEffect(() => {
        const bind = e => {
            if (e.keyCode !== 27) {
                return
            }
            if (document.activeElement && ['INPUT', 'SELECT'].includes(document.activeElement.tagName)) {
                return
            }
            unSetModal()
        }
        document.addEventListener('keyup', bind)
        return () => document.removeEventListener('keyup', bind)
    }, [modal, unSetModal])

    return (
        <section className="orgModal">
            { modal }
        </section>
    )
}

const ModalProvider = props => {
    const [modal, setModal] = useState()
    const unSetModal = useCallback(() => {
        setModal()
    }, [setModal])

    return (
        <ModalContext.Provider value={{ unSetModal, setModal }} {...props} >
            {props.children}
            {modal && <Modal modal={modal} unSetModal={unSetModal} />}
        </ModalContext.Provider>
    )
}

const useModal = () => {
    const context = React.useContext(ModalContext)
    if (context === undefined) {
        throw new Error('useModal must be used within a UserProvider')
    }
    return context
}

export { ModalProvider, useModal }
