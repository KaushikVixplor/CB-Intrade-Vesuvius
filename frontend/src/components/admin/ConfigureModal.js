import React from "react";
import moment from "moment";

const ConfigureModal = ({
  state,
  handleWindowCloser,
  windowCloserSubmit,
  windowCloserSubmitShare,
  getDate,
  company
}) => {
  // var field1 = state.company.window_close_from
  //   ? moment(state.company.window_close_from).format("DD-MM-YYYY")
  //   : "";
  // field1 = field1.split("-").reverse().join("-");
  // var field = state.company.window_close_to
  //   ? moment(state.company.window_close_to).format("DD-MM-YYYY")
  //   : "";
  // field = field.split("-").reverse().join("-");
  return (
    <div id="configure-modal" class="modal">
      <div class="row modal-content">
        <div className="row modal-title ">
          <span>Trading Window Closure</span>
        </div>
        <div>
          <form style={{ margin: 10 }}>
            <div>
              <label for="from">Closure Start Date:</label>
              <input
                type="date"
                id="from"
                name="from"
                min={state.today}
                // defaultValue={field1}
                onChange={handleWindowCloser}
              />
            </div>
            <div>
              <label for="to">Quarter ending date:</label>
              <input
                type="date"
                id="to"
                name="to"
                min={state.today}
                // defaultValue={field}
                onChange={handleWindowCloser}
              />
            </div>
            {/* <div>
              <span style={{ "font-size": 12, "font-weight": "revert" }}>
                <b>Note:</b> The Treding Window will be closed from( The date
                you Input) until( The date you Input).
              </span>
            </div> */}
          </form>
          <div className="row">
            <p>
              <label>Purpose</label>
            </p>
            <div className="col s12 m12 l12">
              <textarea
                onChange={handleWindowCloser}
                id="purpose"
                rows="2"
                cols="80"
                name="purpose"
                // defaultValue={state.company.purpose}
                form="usrform"
                style={{ resize: "none", padding: 10 }}
              ></textarea>
            </div>
            <div className="col s12 m12 l12">
              {company && company.window_close_from && company.window_close_to &&
                <span style={{ transform: 'translate(-5px, 8px)'}}> {'Configured window closure period: ' + getDate(company.window_close_from) + ' to ' + getDate(company.window_close_to) }</span>
              }
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button className="modal-close waves-effect waves btn-flat">
          Cancel
        </button>
        <button
          className="waves-effect waves modal-close btn-flat"
          onClick={windowCloserSubmitShare}
        >
          submit & send
        </button>
        <button
          className="waves-effect waves modal-close btn-flat"
          onClick={windowCloserSubmit}
        >
          submit
        </button>
      </div>
    </div>
  );
};

export default ConfigureModal;
