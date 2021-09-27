import "./App.css";
import useQState from "./useQState";
import SearchPage from "./SearchPage";
import DetailPage from "./DetailPage";

import Amplify from "aws-amplify";
import {
  AmplifyAuthenticator,
  AmplifySignOut,
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
        <AmplifySignOut />
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
