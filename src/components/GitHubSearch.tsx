import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import _throttle from "lodash/throttle";
import {
  SEARCH_REPOSITORIES,
  ISearchRepositoriesVariables,
} from "../graphql/queries";

const GitHubSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRepositories, { loading, data, fetchMore }] =
    useLazyQuery(SEARCH_REPOSITORIES);

  const variables: ISearchRepositoriesVariables = {
    query: `in:name ${searchTerm}`,
    type: "REPOSITORY",
    first: 10,
    after: data?.search?.pageInfo?.endCursor || null,
  };

  const handleSearch = () => {
    searchRepositories({ variables });
  };

  const handleScroll = _throttle(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight &&
      data?.search.pageInfo.hasNextPage
    ) {
      fetchMore({
        variables: {
          query: `in:name ${searchTerm}`,
          after: data?.search.pageInfo?.endCursor || null,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            search: {
              ...fetchMoreResult.search,
              edges: [...prev.search.edges, ...fetchMoreResult.search.edges],
            },
          };
        },
      });
    }
  }, 300);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);
  return (
    <div>
      <input
        type="text"
        placeholder="Enter repository name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}

      {data && data.search && (
        <div>
          <ul>
            {data.search.edges.map((edge: any, id: Number) => (
              <li key={edge.node.id + id} style={{ minHeight: "100px" }}>
                {edge.node.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GitHubSearch;
