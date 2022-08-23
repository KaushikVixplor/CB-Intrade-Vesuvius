import React from "react";

const ConfirmationModal = ({
  state,
  sendMail,
  sendMailCO
}) => {
  return (
    <div id="confirmation-modal" class="modal">
      <div class="row modal-content">
        <div className="row modal-title ">
          <span>Are You Sure ?</span>
        </div>
          <div>
            <img
              alt="svgImg"
              src="data:image/png;base64,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"
              style={{width: "15%",
                height: "15%"}}
            />
          </div>
        <div style={{ margin: 10 }}>
          <span style={{ color: "#022d36", fontWeight: 400, fontSize: 20 }}>Do you really want to share the intimation ?
             This process cannot be undone.</span>
        </div>
      </div>
      <div className="modal-footer">
        <button className="modal-close waves-effect waves btn-flat">
          Cancel
        </button>
        <button
          className="waves-effect waves modal-close btn-flat"
          onClick={sendMailCO}
        >
          Share With CO
        </button>
        <button
          className="waves-effect waves modal-close btn-flat"
          onClick={sendMail}
        >
          Share With CP
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
