import { API } from "aws-amplify";
import { Auth } from "@aws-amplify/auth";
import * as mutations from "./graphql/mutations";
import * as queries from "./graphql/queries";
import { useEffect, useState } from "react";
import Image from "./Image";
import useQState from "./useQState";

const ALL = "all";

function SearchPage({ setBox }) {
  const newBox = async () => {
    const newBox = await API.graphql({
      query: mutations.createBox,
      variables: {
        input: {
          tag: ALL,
        },
      },
    });
    setBox(newBox.data.createBox.id);
  };
  const [boxes, setBoxes] = useState([]);
  const [tag, setTag] = useQState("tag", ALL);
  const [input, setInput] = useState(tag);
  const [user, setUser] = useState(null);
  useEffect(() => {
    (async () => {
      setUser(await Auth.currentUserInfo());
    })();
  }, []);
  useEffect(() => {
    if (!user) {
      return;
    }
    (async () => {
      const searchResult = await API.graphql({
        query: queries.queryOwnerTag,
        variables: {
          owner: user.username,
          tag: { eq: tag },
        },
      });
      const searchBoxes = searchResult.data.queryOwnerTag.items;
      if (searchBoxes.length) {
        const listResult = await API.graphql({
          query: queries.listBoxes,
          variables: {
            filter: {
              or: searchBoxes.map((item) => ({
                id: { eq: item.id },
              })),
              tag: { eq: ALL },
            },
          },
        });
        setBoxes(listResult.data.listBoxes.items);
      } else {
        setBoxes([]);
      }
    })();
  }, [tag, user]);
  return (
    <div>
      <div>
        <button className="button" onClick={newBox}>
          New Box
        </button>
      </div>
      <div>
        <input
          type="text"
          defaultValue={tag}
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
        <button
          className="button"
          onClick={() => {
            setTag(input);
          }}
        >
          Search Tag
        </button>
      </div>
      <div className="gallery">
        {boxes.map((box) => (
          <Image
            key={box.id}
            imgKey={`${box.id}/${box.frontKey}`}
            actions={[
              {
                text: "Details",
                cb: () => setBox(box.id),
              },
            ]}
          ></Image>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
