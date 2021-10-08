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
    <div>
      <img
        className="image"
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
              className="button"
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
