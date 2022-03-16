import React from 'react';

function Modal({
  title,
  closeModal,
  children
}: React.PropsWithChildren<{ title: string; closeModal: Function }>) {
  function onClickClose() {
    closeModal();
  }

  return (
    <div className="modal">
      <div className="modal-panel">
        <div className="modal-header">
          <h2 className="title">{title}</h2>
          <a className="btn-icon close" onClick={onClickClose}>
            <i className="fa-solid fa-xmark"></i>
          </a>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
