import { API } from "aws-amplify";
import { Auth } from "@aws-amplify/auth";
import * as queries from "./graphql/queries";
import { useEffect, useState } from "react";
import Image from "./Image";

const ALL = "all";

function SearchPage({ setBox, tag }) {
  const [boxes, setBoxes] = useState([]);
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
        setBoxes(listResult.data.listBoxes.items.sort((b1, b2) => 
          new Date(b2.updatedAt).getTime() - new Date(b1.updatedAt).getTime()));
      } else {
        setBoxes([]);
      }
    })();
  }, [tag, user]);
  return (
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
  );
}

export default SearchPage;
