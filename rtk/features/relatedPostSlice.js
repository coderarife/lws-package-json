//dependencies
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const fetch = require("node-fetch");

//creating async thunk for fetching post related to the post title fetched earlier
const fetchRelatedPosts = createAsyncThunk(
  "relatedPost/fetchRelatedPosts",
  async (url) => {
    console.log(`fetching related posts for ${url}`);
    const response = await fetch(url);
    const relatedPosts = await response.json();
    return relatedPosts;
  }
);

//creating slice for related posts
const relatedPostSLice = createSlice({
  name: "relatedPosts",
  initialState: {
    numberOfPosts: 0,
    url: "",
    relatedPosts: [],
    relatedPostTags: [],
  },
  reducers: {
    loadRelatedPost: (state, action) => {
      state.relatedPosts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("post/fetchPost/fulfilled", (state, action) => {
        state.relatedPostTags = action.payload.title.split(" ");
        state.url =
          "https://jsonplaceholder.typicode.com/posts?title_like=" +
          action.payload.title.split(" ").join("&title_like=");
      })
      .addCase(fetchRelatedPosts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchRelatedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.relatedPosts = action.payload;
        state.numberOfPosts = action.payload.length;
      })
      .addCase(fetchRelatedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

//export module
module.exports = relatedPostSLice.reducer;
module.exports.fetchRelatedPosts = fetchRelatedPosts;

