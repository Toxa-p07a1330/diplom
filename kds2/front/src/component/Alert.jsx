import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const Alert = (props) => {
  const {
    message,
    title,
    ok,
    close,
    arg,
    modal,
  } = props;

  const onok = () =>
  {
    close();
    ok && ok(arg);
  }

    const oncancel = () =>
    {
      close();
    }

  return (
    <div>
      <Modal isOpen={modal} fade={false}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
        {message}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onok}>Ok</Button>{' '}
          <Button color="secondary" onClick={oncancel}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Alert;