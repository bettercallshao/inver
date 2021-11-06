import { Storage } from "@aws-amplify/storage";
import { useState, useEffect } from "react";
import { IMAGE_URL_EXPIRATION } from "./constants";
import { addToCache, getFromCache } from "./helpers/cache";

function Image({ imgKey, actions }) {
  const [dig, setDig] = useState(false);
  const [src, setSrc] = useState(null);
  useEffect(() => {
    (async () => {
      const cachedUrl = getFromCache(imgKey);
      if (cachedUrl) {
        setSrc(cachedUrl);
      } else {
        const url = await Storage.get(imgKey, { level: "private", expires: IMAGE_URL_EXPIRATION });
        setSrc(url);
        addToCache(imgKey, url);
      }
    })();
  });
  return (
    <div className="p-0">
      <img
        className="img-fluid border"
        src={src}
        onClick={() => {
          setDig(!dig);
        }}
        alt={imgKey}
      />
      {dig && actions && (
        <div className="d-flex justify-content-between">
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
