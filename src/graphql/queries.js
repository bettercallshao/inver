/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getBox = /* GraphQL */ `
  query GetBox($id: ID!, $tag: String!) {
    getBox(id: $id, tag: $tag) {
      id
      tag
      owner
      description
      frontKey
      backKey
      keys
      createdAt
      updatedAt
    }
  }
`;
export const listBoxes = /* GraphQL */ `
  query ListBoxes(
    $id: ID
    $tag: ModelStringKeyConditionInput
    $filter: ModelBoxFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listBoxes(
      id: $id
      tag: $tag
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        tag
        owner
        description
        frontKey
        backKey
        keys
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const queryOwnerTag = /* GraphQL */ `
  query QueryOwnerTag(
    $owner: String
    $tag: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelBoxFilterInput
    $limit: Int
    $nextToken: String
  ) {
    queryOwnerTag(
      owner: $owner
      tag: $tag
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        tag
        owner
        description
        frontKey
        backKey
        keys
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
