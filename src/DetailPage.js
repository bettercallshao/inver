import { API } from "aws-amplify";
import { Storage } from "@aws-amplify/storage";
import * as mutations from "./graphql/mutations";
import * as queries from "./graphql/queries";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import Image from "./Image";

const ALL = "all";

function DetailPage({ box, setBox }) {
  const [detail, setDetail] = useState(null);
  useEffect(() => {
    (async () => {
      const record = await API.graphql({
        query: queries.getBox,
        variables: {
          id: box,
          tag: ALL,
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
          tag: ALL,
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
                      const frontKey =
                        detail.frontKey !== key ? detail.frontKey : null;
                      await Storage.remove(`${box}/${key}`, {
                        level: "private",
                      });
                      pushDetail({ keys, frontKey });
                    },
                  },
                  ...(key !== detail.frontKey
                    ? [
                        {
                          text: "Promote",
                          cb: async () => pushDetail({ frontKey: key }),
                        },
                      ]
                    : []),
                ]}
              ></Image>
            ))}
      </div>
      <nav className="navbar fixed-bottom mb-5 p-2">
        <button
          className="btn btn-danger col-4 px-0"
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
          Delete
        </button>
        <form className="form-inline col-4 px-0">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            class="form-control"
            onChange={async (event) => {
              const file = event.target.files[0];
              const key = uuid();
              const keys = detail.keys || [];
              keys.push(key);
              const frontKey = detail.frontKey || key;
              await Storage.put(`${box}/${key}`, file, {
                level: "private",
              });
              await Storage.put(`${box}/${key}.flag`, file, {
                level: "private",
              });
              pushDetail({ keys, frontKey });
            }}
          />
        </form>
      </nav>
    </div>
  );
}

export default DetailPage;
