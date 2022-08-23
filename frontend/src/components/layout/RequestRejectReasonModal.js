import React from "react";
import { defaultProps } from "react-select/dist/Select-c074111f.cjs.prod";

export const RequestRejectReasonModal = (props) => {
    return (
        <div id="RequestRejectReasonModal" class="modal">
            <div class="row modal-content">
                <div className="row modal-title ">
                    <span style={{marginLeft: '21px', resize: 'none'}}>Reject Reason Modal</span>
                </div>
                <div>
                    <div className="row">
                        <div className="col s3 m3 l3">
                            <label>Reason</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s10 m10 l10">
                            <textarea 
                                id='reason'
                                style={{marginLeft: '21px', resize: 'none', height: '78px'}}
                                onChange={props.handleChange}
                            />
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
                    onClick={props.OnReject}
                >
                    submit
                </button>
            </div>
        </div>
    );
};


