import React from "react";
import "../stylesheet/modals.css";

export const DisclosureFormModal = ({ file, share, props, type }) => {
  const onClose = () => {
    if (type == 'request') {
      props.history.push({
        pathname: "/",
      });
    }
  }
  return (
    <div id="download-modal" class="modal modal-fixed-footer">
      <div class="modal-content">
        <div className="row modal-title">
          <span>Request Modal</span>
        </div>
        <div className="pdf">
          <iframe src={file} width="100%" height="300px"></iframe>
        </div>
      </div>
      <div className="modal-footer">
        <button className="modal-close waves-effect waves btn-flat" onClick={onClose}>
          cancel
        </button>
        <a className="modal-close  waves-effect waves btn-flat" onClick={share}>
          Share
        </a>
      </div>
    </div>
  );
};
