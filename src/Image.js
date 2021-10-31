import { Storage } from "@aws-amplify/storage";
import { useState, useEffect } from "react";

function Image({ imgKey, actions }) {
  const [dig, setDig] = useState(false);
  const [src, setSrc] = useState(null);
  useEffect(() => {
    (async () => {
      const url = await Storage.get(imgKey, { level: "private" });
      setSrc(url);
    })();
  }, []);
  return (
    <div class="p-0">
      <img
        className="img-fluid border"
        src={src}
        onClick={() => {
          setDig(!dig);
        }}
      />
      {dig && actions && (
        <div class="d-flex justify-content-between">
          {actions.map((action) => (
            <button
              key={action.text}
              className="btn btn-primary col-4"
              onClick={() => {
                action.cb({ imgKey, src });
              }}
            >
              {action.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Image;
