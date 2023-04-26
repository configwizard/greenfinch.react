import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

// Components
import HeadingGeneral from '../../../atoms/HeadingGeneral';
import ButtonText from '../../../atoms/ButtonText';
import { useModal } from '../../../organisms/Modal/ModalContext';
import {forceSync, makeRunningToast} from "../../../../manager/manager";

import '../style.scss';
import CompModalLoading from "../../Modal/ModalLoading";

const ContainerHeaderPage = ({ lockUI, pageTitle, hasButton, hasIcon, faClass, buttonText, isButtonDisabled, createNewContainer, setLock }) => {
    const { setModal, unSetModal } = useModal();
    useEffect(() => {
        console.log("received lockUI ", lockUI)
        if (lockUI) {
            setModal(
                <CompModalLoading
                    unSetModal={async () => unSetModal()}
                    theme={"dark"}
                    size={"small"}
                    hasCloseWrapper={false}
                    hasCloseCorner={false}
                    hasPrimaryButton={false}
                    loadingMessage={"force syncing..."}
                >
                  <span>
                    Depending on certain conditions, connecting to the network can take some time. Please be patient
                  </span>
                </CompModalLoading>
            );
        } else {
            unSetModal();
        }
    }, [lockUI]);
    return (
        <div className="HeaderPageWrapper">
            <div className="HeaderPageInner d-flex align-items-center">
                <div>
                    <HeadingGeneral
                        level={"h1"}
                        isUppercase={false}
                        text={pageTitle}
                    />
                </div>
                <div className="ms-auto">
                    <ButtonText
                        size={"small"}
                        type={"clean"}
                        hasIcon={true}
                        faClass={"fa-sharp fa-solid fa-rotate"}
                        isDisabled={false}
                        text={"Force sync"}
                        onClick={async () => {await setLock(true); await forceSync(); await setLock(false);}}/>
                    { hasButton ? 
                        <ButtonText
                            size={"small"}
                            type={"default"}
                            hasIcon={hasIcon}
                            faClass={faClass}
                            isDisabled={isButtonDisabled}
                            text={buttonText}
                            onClick={() => createNewContainer(setModal, unSetModal)} /> 
                        : null }
                </div>
            </div>
        </div>
    );
}

export default ContainerHeaderPage;

HeadingGeneral.propTypes = {
    pageTitle: PropTypes.string,
};

HeadingGeneral.defaultProps = {
    pageTitle: "Lorem Ipsum"
};

ButtonText.propTypes = {
    hasButton: PropTypes.bool,
    hasIcon: PropTypes.bool,
    iconClass: PropTypes.string,
};

ButtonText.defaultProps = {
    hasButton: true,
    hasIcon: true
}
