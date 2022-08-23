import React, { Component } from "react";
import { connect } from "react-redux";
import { signIn } from "../../store/action/AuthAction";
import { Redirect } from "react-router-dom";
import "../stylesheet/common.css";
import { companyData } from "../../store/action/CommonAction";

class Login extends Component {
  state = {
    email: "",
    password: "",
  };
  componentDidMount() {
    this.props.CompanyData();
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.signIn(this.state);
  };
  render() {
    const { authError, user, authLoading, data } = this.props.auth;
    if (user) {
      if (!data.userDetails.is_compliance && data.userDetails.status == "Temp")
        return <Redirect to="/info" />;
      else return <Redirect to="/" />;
    }
    if (authLoading) {
      return (
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      );
    }
    return (
      <div
        className="container"
        style={{ transform: "translate(0%, 20%)", width: "80%" }}
      >
        <div className="row">
          <div className="col s12" style={{ padding: 20 }}>
            <div className="card style-card login_card">
              <div className="row card-content center center-align">
                <form
                  className=""
                  onSubmit={this.handleSubmit}
                  style={{ marginTop: 0 }}
                >
                  <div className="row background">
                    <div className="col s12 l6 m6 transbox style-block">
                      <div className="row">
                        <div className="col s2 m2 l2">
                          <img
                            src="assets/images/company.png"
                            widht="30"
                            height="40"
                            style={{ marginTop: 36 }}
                          />
                        </div>
                        <div className="col s10 m10 l10">
                          <h2 className="type-animation">
                            {this.props.company && this.props.company.name}
                          </h2>
                        </div>
                      </div>
                      <h3>
                        Welcome to{" "}
                        {this.props.company && this.props.company.name}’s
                        Structured Digital Database System.Online portal for
                        compliance of Company’s Policy for Prevention of Insider
                        Trading.
                      </h3>
                      <span>(Login with your Username and Password)</span>
                    </div>
                    <div className="col s12 l6 m6 form-block">
                      <h5>Sign In</h5>
                      <div className="input-field login-field">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                      <div className="input-field login-field">
                        <label htmlFor="password">Password</label>
                        <input
                          type="password"
                          id="password"
                          onChange={this.handleChange}
                          required
                        />
                      </div>

                      <div
                        className="input-field center center-align"
                        style={{ marginTop: 50 }}
                      >
                        <button className="btn ">Login</button>
                        <div className="red-text center">
                          {authError ? <p>{authError}</p> : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="copyright left">
                  <span>
                    Designed & Developed by CBMSL.© All Rights Reserved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state.common);
  return {
    auth: state.auth,
    company: state.common.getCompanyData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    CompanyData: () => {
      dispatch(companyData());
    },
    signIn: (credentials) => {
      dispatch(signIn(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
