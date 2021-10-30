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

function App() {
  const [box, setBox] = useQState("box", "");
  const [tag, setTag] = useQState("tag", SearchPage.ALL);
  const [input, setInput] = useState(tag);
  const newBox = async () => {
    const newBox = await API.graphql({
      query: mutations.createBox,
      variables: {
        input: {
          tag: SearchPage.ALL,
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
      <nav class="navbar fixed-bottom p-0">
        <button
          className="btn btn-danger"
          onClick={() => {
            Auth.signOut();
          }}
        >
          Sign Out
        </button>
        <form className="form-inline">
          <input
            type="text"
            class="form-control"
            defaultValue={tag}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
        </form>
        <button
          className="btn btn-primary"
          onClick={() => {
            setTag(input);
            setBox("");
          }}
        >
          Search
        </button>
        <button className="btn btn-primary" onClick={newBox}>
          New
        </button>
      </nav>
    </AmplifyAuthenticator>
  );
}

export default App;
