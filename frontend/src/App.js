import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import Login from "./components/auth/Login";
import ClientDashboard from "./components/dashboard/ClientDashboard";
import TradingRequest from "./components/client/TradingRequest";
import Dashboard from "./components/dashboard/Dashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import ViewTransictions from "./components/client/ViewTransictions";
import UserInformation from "./components/admin/UserInformation";
import NewKmpForm from "./components/admin/NewKmpForm";
import { refreshToken } from "./store/action/AuthAction";
import { refreshInterval } from "./config/constants";
import './custom.css'

import HomePage from "./components/layout/HomePage";

class App extends Component {
  componentDidUpdate() {
    const { auth, RefreshToken } = this.props;
    console.error('auth', auth)
    if (auth && auth.user && auth.user.refreshAccessToken && RefreshToken) {
      if (this.refreshTimer) clearInterval(this.refreshTimer);
      this.refreshTimer = setInterval(() => {
        RefreshToken(auth.user.accessToken, auth.user.refreshAccessToken);
      }, refreshInterval);
    }
  }
  componentWillUnmount() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  }
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route path="/login" component={Login} />
            {/* <Route exact path="/" component={HomePage} /> */}
            <Route exact path="/" component={Dashboard} />
            <Route path="/info" component={ClientDashboard} />
            <Route path="/request" component={TradingRequest} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/view" component={ViewTransictions} />
            <Route path="/users" component={UserInformation} />
            <Route
              path="/form-to-fill-up-for-connected-person-joining"
              component={NewKmpForm}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    auth: state.auth,
    authLoading: state.auth.authLoading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    RefreshToken: (token, rToken) => {
      dispatch(refreshToken(token, rToken));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
