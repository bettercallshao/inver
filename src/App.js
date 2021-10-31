import "./App.css";
import useQState from "./useQState";
import SearchPage from "./SearchPage";
import DetailPage from "./DetailPage";

import { useState } from "react";

import { Amplify, Auth, API } from "aws-amplify";
import {
  AmplifyAuthenticator,
  AmplifySignUp,
  AmplifySignIn,
} from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";
import * as mutations from "./graphql/mutations";

Amplify.configure(awsconfig);

const ALL = "all";

function App() {
  const [box, setBox] = useQState("box", "");
  const [tag, setTag] = useQState("tag", ALL);
  const [input, setInput] = useState(tag);
  const newBox = async () => {
    const newBox = await API.graphql({
      query: mutations.createBox,
      variables: {
        input: {
          tag: ALL,
        },
      },
    });
    setBox(newBox.data.createBox.id);
  };
  return (
    <AmplifyAuthenticator usernameAlias="email">
      <AmplifySignUp
        slot="sign-up"
        usernameAlias="email"
        formFields={[
          {
            type: "email",
            label: "Email",
            inputProps: { required: true, autocomplete: "username" },
          },
          {
            type: "password",
            label: "Password",
            inputProps: { required: true, autocomplete: "new-password" },
          },
        ]}
      />
      <AmplifySignIn slot="sign-in" usernameAlias="email" />
      {box ? (
        <DetailPage box={box} setBox={setBox} />
      ) : (
        <SearchPage setBox={setBox} tag={tag} />
      )}
      <nav className="navbar fixed-bottom p-2">
        <button
          className="btn btn-danger col-3 px-0"
          onClick={() => {
            Auth.signOut();
          }}
        >
          Out
        </button>
        <form className="form-inline col-3 px-0">
          <input
            type="text"
            className="form-control"
            defaultValue={tag}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
        </form>
        <button
          className="btn btn-secondary col-3 px-0"
          onClick={() => {
            setTag(input);
            setBox("");
          }}
        >
          Search
        </button>
        <button className="btn btn-success col-3 px-0" onClick={newBox}>
          New
        </button>
      </nav>
    </AmplifyAuthenticator>
  );
}

export default App;
