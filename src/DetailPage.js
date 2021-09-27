import { API } from "aws-amplify";
import { Storage } from "@aws-amplify/storage";
import * as mutations from "./graphql/mutations";
import * as queries from "./graphql/queries";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import Image from "./Image";

function DetailPage({ box, setBox }) {
  const [detail, setDetail] = useState(null);
  useEffect(() => {
    (async () => {
      const record = await API.graphql({
        query: queries.getBox,
        variables: {
          id: box,
          tag: "all",
        },
      });
      setDetail(record.data.getBox);
    })();
  }, [box]);
  const pushDetail = async (record) => {
    const res = await API.graphql({
      query: mutations.updateBox,
      variables: {
        input: {
          id: box,
          tag: "all",
          ...record,
        },
      },
    });
    setDetail(res.data.updateBox);
  };
  const keyOrder = (key) => {
    if (key === detail.frontKey) return 0;
    if (key === detail.backKey) return 1;
    return 2;
  };
  return (
    <div>
      <div>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={async (event) => {
            const file = event.target.files[0];
            const key = uuid();
            const keys = detail.keys || [];
            keys.push(key);
            await Storage.put(`${box}/${key}`, file, {
              level: "private",
            });
            pushDetail({ keys });
          }}
        />
      </div>
      <div className="gallery">
        {detail &&
          detail.keys &&
          detail.keys
            .sort((a, b) => keyOrder(a) > keyOrder(b))
            .map((key) => (
              <Image
                key={key}
                imgKey={`${box}/${key}`}
                actions={[
                  {
                    text: "Delete",
                    cb: async () => {
                      const keys = detail.keys.filter((k) => k !== key);
                      await Storage.remove(`${box}/${key}`, {
                        level: "private",
                      });
                      pushDetail({ keys });
                    },
                  },
                  {
                    text: "To Front",
                    cb: async () => pushDetail({ frontKey: key }),
                  },
                  {
                    text: "To Back",
                    cb: async () => pushDetail({ backKey: key }),
                  },
                ]}
              ></Image>
            ))}
      </div>
      <div>
        <button
          className="button"
          onClick={async () => {
            const blobs = await Storage.list(box, { level: "private" });
            blobs.forEach((blob) => {
              Storage.remove(blob.key, { level: "private" });
            });
            const listResult = await API.graphql({
              query: queries.listBoxes,
              variables: {
                filter: {
                  id: {
                    eq: box,
                  },
                },
              },
            });
            for (const item of listResult.data.listBoxes.items) {
              await API.graphql({
                query: mutations.deleteBox,
                variables: {
                  input: {
                    id: item.id,
                    tag: item.tag,
                  },
                },
              });
            }
            setBox("");
          }}
        >
          Delete Box
        </button>
      </div>
    </div>
  );
}

export default DetailPage;
