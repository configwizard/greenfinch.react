import React from 'react';

// Components
import ButtonText from '../../../atoms/ButtonText';
import { useModal } from '../../../organisms/Modal/ModalContext';
import CompModalStandard from '../../../organisms/Modal/ModalStandard';

const ButtonQRCode = ({ qrcode }) => {
    const { setModal, unSetModal } = useModal()
    return (
        <ButtonText
            type="default"
            size="small"
            hasIcon={true}
            faClass={"fa-sharp fa-solid fa-qrcode"} 
            text={"QR code available"}
            isDisabled={false}
            onClick={() => {
                setModal(
                <CompModalStandard
                    title={"QR Code available"}
                    hasSecondaryButton={false}
                    buttonTextPrimary={"Close"}
                    primaryClicked={async () => unSetModal()}>
                        <p>A QR code is avaiable for this notification, scan to view on Dora.</p>
                        <div className="d-flex">{qrcode}</div>
                </CompModalStandard>)
            }} />
    )
}

export default ButtonQRCode;