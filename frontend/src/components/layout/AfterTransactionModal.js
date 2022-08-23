import React from "react";
import "../stylesheet/modals.css";
import "../stylesheet/common.css";

export default function AfterTransactionModal({
  state,
  HandleChange,
  OnSubmit,
  loading,
  requestFolios,
}) {
  console.log(requestFolios);
  return (
    <div id="after-transaction-modal" class="modal">
      <div class="row modal-content">
        <div className="row modal-title ">
          <span>Edit Transaction</span>
        </div>
        <div>
          <form>
            <div className="row">
              <div className="col s12 m12 l12">
                <label for="disabled">Name</label>
                <input
                  disabled
                  value={state.name}
                  id="disabled"
                  type="text"
                  class="validate"
                  onChange={HandleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col s6 m6 l6">
                <label for="disabled">Request Type</label>
                <input
                  disabled
                  id="disabled"
                  type="text"
                  class="validate"
                  value={state.request_type}
                />
              </div>
              <div className="col s6 m6 l6">
                <label for="disabled">Security Type</label>
                <input
                  disabled
                  id="disabled"
                  type="text"
                  class="validate"
                  value={state.security_type}
                />
              </div>
            </div>
            <div className="row">
              <div className="col s6 m6 l6">
                <label for="disabled">PAN</label>

                <input
                  disabled
                  id="disabled"
                  type="text"
                  class="validate"
                  value={state.pan}
                />
              </div>
              <div className="col s6 m6 l6">
                <label>Folio (or DpId+ClientId)</label>
                <select
                  class="browser-default"
                  id="request_folio"
                  onChange={HandleChange}
                >
                  <option value="" disabled selected>
                    Choose your option
                  </option>
                  {requestFolios
                    ? requestFolios.allFolios &&
                      requestFolios.allFolios.map((foilo) => (
                        <option value={foilo.folio}>{foilo.folio}</option>
                      ))
                    : null}
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col s6 m6 l6">
                <label for="transaction_date">Transaction Date</label>
                <input
                  onChange={HandleChange}
                  value={state.transaction_date}
                  id="transaction_date"
                  type="date"
                  min={state.today}
                  class="validate"
                />
              </div>
              <div className="col s6 m6 l6">
                <label>Trade Exchange</label>
                <select
                  id="stock_exchange"
                  /* value={state.stock_exchange} */ onChange={HandleChange}
                  class="browser-default"
                >
                  <option value="" disabled selected>
                    Choose your option
                  </option>
                  <option value="NSE">NSE</option>
                  <option value="BSE">BSE</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col s6 m6 l6">
                <label for="transaction_price">Transaction Price</label>
                <input
                  onChange={HandleChange}
                  id="transaction_price"
                  type="number"
                  class="validate"
                />
              </div>
              <div className="col s6 m6 l6">
                <label for="request_quantity">Quantity</label>
                <input
                  onChange={HandleChange}
                  id="transaction_quantity"
                  type="number"
                  class="validate"
                />
              </div>
            </div>
          </form>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves btn-flat">
              CANCEL
            </button>
            <button
              disabled={loading}
              type="submit"
              onClick={OnSubmit}
              className="waves-effect waves btn-flat"
            >
              submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
