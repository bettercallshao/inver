import "./App.css";
import useQState from "./useQState";
import SearchPage from "./SearchPage";
import DetailPage from "./DetailPage";

import { Amplify, Auth } from "aws-amplify";
import {
  AmplifyAuthenticator,
  AmplifySignUp,
  AmplifySignIn,
} from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

function App() {
  const [box, setBox] = useQState("box", "");

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
      <div>
        <button
          className="button"
          onClick={() => {
            setBox("");
          }}
        >
          Search
        </button>
        <button
          className="button"
          onClick={() => {
            Auth.signOut();
          }}
        >
          Sign Out
        </button>
      </div>
      {box ? (
        <DetailPage box={box} setBox={setBox} />
      ) : (
        <SearchPage setBox={setBox} />
      )}
    </AmplifyAuthenticator>
  );
}

export default App;
