import React, { Component } from "react";
import { connect } from "react-redux";
import M from "materialize-css";
import TopNav from "../layout/TopNav";
import RequestList from "../layout/RequestList";

export class RequestApproval extends Component {
  state = {
    requestList: [
      {
        name:'Devidip',
        designation:'KMP',
        category:'KMP',
        security_type:'Shares',
        mode:'market',
        folio: "1",
        transaction_folio:'2',
        request_type: "Buy",
        date_requested_to: "01/02/2020",
        dealing_date_form: "01/02/2020",
        request_quantity: 10,
        proposed_price: 1300,
        market_price: 1000,
        status:'Rejected',
        company:'TCS',
        company_add:'2/3 Sadar Street, Kolkata:70007',
      },
      {
        name:'Dip',
        designation:'KMP',
        category:'KMP',
        security_type:'Shares',
        mode:'market',
        folio: "2",
        transaction_folio: "4",
        request_type: "Buy",
        date_requested_to: "01/02/2020",
        dealing_date_form: "01/02/2020",
        request_quantity: 10,
        proposed_price: 2000,
        market_price: 1000,
        status:'Approved',
        company:'Infosys',
        company_add:'2/3 Sadar Street, Karnatak:70007',
      },
    ],
  };
  componentDidMount = () => {
    var elems = document.querySelectorAll(".collapsible");
    var instances = M.Collapsible.init(elems, {});
  };
  render() {
    return (
      <div>
        <RequestList list={this.state.requestList} handleChange={this.handleChange}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RequestApproval);
