import React, { Component } from "react";
import axios from "axios";
import Profile from "./components/Profile";
import {
  TextField,
  Button,
  CircularProgress as Loader,
} from "@material-ui/core";

class App extends Component {
  state = {
    username: "",
    image: "",
    searched: false,
    repos: [],
    loading: false,
  };

  onFormSubmit = (e) => {
    e.preventDefault();

    this.setState({
      loading: true,
    });

    var avatar_url;

    axios
      .get(`https://api.github.com/users/${this.state.username}`)
      .then((res) => {
        avatar_url = res.data.avatar_url;
        return axios.get(res.data.repos_url);
      })
      .then((res) => {
        this.setState({
          loading: false,
          repos: res.data,
          image: avatar_url,
          searched: true,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  };

  onUsernameChange = (e) => {
    this.setState({
      searched: false,
      username: e.target.value,
    });
  };

  render() {
    return (
      <div className="App">
        <div className="formContainer">
          <h1 style={{ marginTop: 0 }}>{process.env.REACT_APP_NAME}</h1>
          <form
            style={{ alignItems: "flex-end", display: "flex" }}
            onSubmit={this.onFormSubmit}
          >
            <TextField
              style={{ flex: 1, justifyContent: "center" }}
              onChange={this.onUsernameChange}
              type="text"
              label="Enter a Github username"
            />
            <Button type="submit">Search</Button>
          </form>

          {this.state.loading ? (
            <Loader style={{ display: "block", margin: "15px auto" }} />
          ) : null}

          {this.state.searched && (
            <Profile
              username={this.state.username}
              image={this.state.image}
              repos={this.state.repos}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;
