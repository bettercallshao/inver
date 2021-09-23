import logo from "./logo.svg";
import "./App.css";

import Amplify from "aws-amplify";
import {
  AmplifyAuthenticator,
  AmplifySignOut,
  AmplifySignUp,
  AmplifySignIn,
  AmplifyS3Album,
  AmplifyS3Image,
} from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

function App() {
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
      <div className="App">
        <header className="App-header">
          {/* <AmplifyS3Image level="private" imgKey="Toronto-Naeem-Jaffer-Getty-Images.jpg" /> */}
          <AmplifyS3Album level="private" path="" picker />
          <AmplifySignOut />
        </header>
      </div>
    </AmplifyAuthenticator>
  );
}

export default App;
