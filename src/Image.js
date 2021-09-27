import { AmplifyS3Image } from "@aws-amplify/ui-react";
import { useState } from "react";

function Image({ imgKey, actions }) {
  const [dig, setDig] = useState(false);
  const [src, setSrc] = useState(null);
  return (
    <div>
      <AmplifyS3Image
        level="private"
        imgKey={imgKey}
        handleOnLoad={(event) => {
          setSrc(event.target.src);
        }}
        onClick={() => {
          setDig(!dig);
        }}
      />
      {dig && actions && (
        <div>
          {actions.map((action) => (
            <button
              key={action.text}
              className="button"
              onClick={() => {
                action.cb({ imgKey, src });
              }}
            >
              {action.text}
            </button>
          ))}
          {/* <button
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
              Storage.remove(imgKey, { level: "private" }).then(handleDelete);
            }}
          >
            Delete
          </button> */}
        </div>
      )}
    </div>
  );
}

export default Image;
