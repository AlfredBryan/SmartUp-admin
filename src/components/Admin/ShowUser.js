import React, { Component } from "react";
import Navigation from "components/Navigation/Navigation";
import axios from "axios";

class ShowUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      user_id: this.props.match.params.id
    };
  }

  getUser = () => {
    const token = localStorage.getItem("token");
    const { user_id } = this.state;
    axios
      .get(`https://smart-up.herokuapp.com/api/v1/users/${user_id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          this.setState({
            user: res.data
          });
        }
      });
  };

  //capitalize function
  Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  //Age function
  getAge = dateString => {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  //ends

  componentDidMount() {
    this.getUser();
  }

  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <Navigation />
        <div className="main-content">
          <div className="container">
            <div className="newcard card-user">
              <div className="image">
                <img src={require("../../images/bgimg.jpg")} alt="..." />
              </div>
              <div className="content">
                <div className="author">
                  {user.image_url !== null ? (
                    <img
                      className="avatar border-gray"
                      src={user.image_url}
                      alt="..."
                    />
                  ) : (
                    <i className="fa fa-user avatar no_pics" />
                  )}

                  <h4 className="title">
                    <strong>Hi,</strong>
                    <strong style={{ padding: "0.5em" }}>{user.surname}</strong>
                    <br />
                  </h4>
                </div>
                <p className="profile_data">
                  <small>{this.Capitalize(user.sex || "")}</small>{" "}
                  <small className="profile_divider" />
                  <small>{user.level}</small>
                  <small className="profile_divider" />
                  <small>{this.getAge(user.date_of_birth)}YRS</small>
                </p>
                <hr className="profile_hr" />
                <p className="description text-center">
                  {user.address}
                  <br />
                  {user.email}
                </p>
              </div>
              <hr />
              <div className="text-center footer-social">
                <i className="fa fa-facebook footer-user" />
                <i className="fa fa-google footer-user" />
                <i className="fa fa-twitter footer-user" />
                <i className="fa fa-instagram footer-user" />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ShowUser;
