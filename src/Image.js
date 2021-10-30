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
        <div>
          {actions.map((action) => (
            <button
              key={action.text}
              className="btn btn-primary m-1 float-end"
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
