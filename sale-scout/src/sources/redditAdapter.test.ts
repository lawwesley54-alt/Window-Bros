import { describe, expect, it } from "vitest";
import { citySubreddit, parseRedditListings } from "./redditAdapter";

const SAMPLE_RESPONSE = {
  data: {
    children: [
      {
        data: {
          id: "abc123",
          title: "Estate sale this weekend off Main St",
          selftext: "Lots of furniture and tools, starts Saturday morning.",
          permalink: "/r/austin/comments/abc123/estate_sale_this_weekend/",
          created_utc: 1_757_000_000,
        },
      },
      {
        // missing title/permalink — should be filtered out
        data: {
          id: "def456",
          selftext: "just a comment-like post",
        },
      },
    ],
  },
};

describe("parseRedditListings", () => {
  it("extracts posts with a title and permalink", () => {
    const posts = parseRedditListings(SAMPLE_RESPONSE);
    expect(posts).toHaveLength(1);
    expect(posts[0].id).toBe("abc123");
    expect(posts[0].title).toBe("Estate sale this weekend off Main St");
    expect(posts[0].permalink).toBe("/r/austin/comments/abc123/estate_sale_this_weekend/");
  });

  it("filters out posts missing required fields", () => {
    const posts = parseRedditListings(SAMPLE_RESPONSE);
    expect(posts.find((p) => p.id === "def456")).toBeUndefined();
  });

  it("handles an empty/malformed response without throwing", () => {
    expect(parseRedditListings({})).toEqual([]);
    expect(parseRedditListings(null)).toEqual([]);
  });
});

describe("citySubreddit", () => {
  it("lowercases and strips non-alphanumeric characters", () => {
    expect(citySubreddit("San Francisco")).toBe("sanfrancisco");
    expect(citySubreddit("St. Louis")).toBe("stlouis");
    expect(citySubreddit("Austin")).toBe("austin");
  });
});
