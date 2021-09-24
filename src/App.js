import "./App.css";

import Amplify from "aws-amplify";
import { Storage } from "@aws-amplify/storage";
import {
  AmplifyAuthenticator,
  AmplifySignOut,
  AmplifySignUp,
  AmplifySignIn,
  AmplifyS3Image,
  AmplifyS3ImagePicker,
} from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";

import useQState from "./useQState";
import { useEffect, useState } from "react";

Amplify.configure(awsconfig);

function Image({ blob, handleDelete }) {
  const [dig, setDig] = useState(false);
  const [src, setSrc] = useState(null);
  return (
    <div>
      <AmplifyS3Image
        level="private"
        imgKey={blob.key}
        handleOnLoad={(event) => {
          setSrc(event.target.src);
        }}
        onClick={() => {
          setDig(!dig);
        }}
      />
      {dig && (
        <div>
          <button
            className="button"
            onClick={() => {
              window.open(src);
            }}
          >
            Open
          </button>
          <button
            className="button"
            onClick={() => {
              Storage.remove(blob.key, { level: "private" }).then(handleDelete);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  const [box, setBox] = useQState("box", "");
  const [blobs, setBlobs] = useState([]);
  const pull = () => {
    Storage.list(box, {
      level: "private",
    }).then(setBlobs);
  };
  useEffect(pull, [box]);
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
      <AmplifySignOut />
      <AmplifyS3ImagePicker level="private" path={box} headerTitle="" headerHint="" />
      <div className="gallery">
        {blobs.map((blob, idx) => (
          <Image key={idx} blob={blob} handleDelete={pull}></Image>
        ))}
      </div>
    </AmplifyAuthenticator>
  );
}

export default App;
