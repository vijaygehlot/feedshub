import React from 'react'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'

const AppLoginModal = () => {
    return (
        <>
        {/* // <Modal isOpen={modal} toggle={toggle}> */}
            <ModalBody>
                You need To login
            </ModalBody>
            <ModalFooter>
                <Button color="primary">Do Something</Button>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        {/* // </Modal> */}
        </>
    )
}

export default AppLoginModal