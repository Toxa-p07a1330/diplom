import React, {useContext, useEffect} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {LangSelectorContext} from "../context/LangSelectorContextProvider";
import {getTranslations} from "../static/transltaions";

const Alert = (props) => {
  let langSelectContext = useContext(LangSelectorContext)
  let activeTranslation = getTranslations("alert", langSelectContext.data.lang);

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
          <Button color="primary" onClick={onok}>{activeTranslation.ok}</Button>{' '}
          <Button color="secondary" onClick={oncancel}>{activeTranslation.cancel}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Alert;