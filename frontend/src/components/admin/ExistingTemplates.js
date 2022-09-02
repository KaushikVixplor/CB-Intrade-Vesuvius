import React, { Component } from "react";
import { connect } from "react-redux";
import { getTempaltes, updateTemplate } from "../../store/action/HodAction";
import swal from "sweetalert";

export class ExistingTemplates extends Component {
  state = {
    edit: false,
    subject: "",
    body: "",
    updateFlag: false,
  };
  componentDidMount() {
    document.getElementById("subject").defaultValue =
      this.props.templates.subject;
    document.getElementById("body").defaultValue = this.props.templates.body;
  }
  componentDidUpdate() {
    if (this.state.updateFlag && !this.props.updateTemplateLoading) {
      if (this.props.updateTemplateSuccess) {
        swal("Success", "Success Fully updated", "success");
        this.props.GetTemplate(this.props.user.accessToken)
        this.setState({ updateFlag: false });
      }
      if (this.props.updateTemplateError) {
        swal("Oops!", this.props.message, "error");
        this.setState({ updateFlag: false });
      }
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    this.props.UpdateTemplate(
      this.props.state.selectedTemplate,
      e.target.id,
      this.props.user.accessToken
    );
    this.setState({updateFlag:true})
  };
  render() {
    // console.log('props : ', this.props)
    return (
      <div className="container" style={{ height: "85vh" }}>
        <form action="#">
          <div
            className="row item-header"
            style={{ width: "100%", marginLeft: 20 }}
          >
            <b>{this.props.templates.name}</b>
          </div>
          <div
            className="col s10 m10 l10"
            style={{
              height: 40,
              color: "slategrey",
              fontWeight: 900,
              marginLeft: 72,
            }}
          >
            <span className="right" style={{ marginTop: 10 }}>
              To fill up/update the following data click on the pen --{">"}
              {/* <i className="material-icons">trending_flat</i> */}
            </span>
          </div>
          <div className="col s1 m1 l1 right">
            <a
              className={
                this.props.state.edit
                  ? "btn-floating right btn-small"
                  : "btn-floating right btn-button"
              }
              onClick={this.props.editFlag}
            >
              <i className="material-icons">edit</i>
            </a>
          </div>
          <div className="row" style={{ width: "100%", marginLeft: 20 }}>
            <div>
              <div class="row">
                <form class="col s12">
                  <div class="row">
                    <div class="input-field col s12" style={{ marginTop: -10 }}>
                      <span className="textarea-heading">Subject</span>
                      <textarea
                        id="subject"
                        value={this.props.state.selectedTemplate.subject}
                        placeholder="Write your subject..."
                        disabled={this.props.state.edit ? false : true}
                        onChange={this.props.handleChangeTemplateValue}
                        style={{ padding: 10 }}
                      ></textarea>
                    </div>
                    <div class="input-field col s12" style={{ marginTop: -10 }}>
                      <span className="textarea-heading">Body</span>
                      <textarea
                        id="body"
                        //className="textarea"
                        value={this.props.state.selectedTemplate.body}
                        placeholder="Write your mail..."
                        disabled={this.props.state.edit ? false : true}
                        onChange={this.props.handleChangeTemplateValue}
                        style={{ height: "40vh", padding: 10 }}
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div style={{ marginTop: -10 }}>
            <button
              className="btn btn-button right"
              id={this.props.templates.id}
              onClick={this.onSubmit}
              disabled={this.props.state.edit ? false : true}
              style={{ marginTop: "-40px" }}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    updateTemplateLoading: state.Hod.updateTemplateLoading,
    updateTemplateSuccess: state.Hod.updateTemplateSuccess,
    updateTemplateError: state.Hod.updateTemplateError,
    message: state.Hod.message,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    UpdateTemplate: (body, id, token) => {
      dispatch(updateTemplate(body, id, token));
    },
    GetTemplate: (token) => {
      dispatch(getTempaltes(token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExistingTemplates);
