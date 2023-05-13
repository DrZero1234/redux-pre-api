// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  // Declaring an array of string tag names for data types
  tagTypes: ["Post"],
  // The "endpoints" represent operations and requests for this server
  endpoints: builder => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getPosts: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => '/posts', // OR {url: '/posts', method: 'POST', body: newPost}
      // Listing a set of tags describing the data in that query
      providesTags: ["Post"],
    }),
    getPost: builder.query({
        query: (postId) => `/posts/${postId}`
    }),
    addNewPost: builder.mutation({
      query: initialPost => ({
        url: "/posts",
        method: "POST",
        body: initialPost
      }),
      // Listing a set of tags that are invalidated every time that mutation runs
      invalidatesTags: ["Post"]
    }),
    editPost: builder.mutation({
      query: post => ({
        url: `/posts/${post.id}`,
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: ["Post"]
    })
  })
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetPostsQuery,useGetPostQuery,useAddNewPostMutation,useEditPostMutation } = apiSlice