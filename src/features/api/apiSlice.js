// export NODE_OPTIONS=--openssl-legacy-provider

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
      providesTags:(result = [], error,arg) => [
        // Provides a general 'Post' tag for the whole list, as well as a specific {type: 'Post', id} tag for each received post object
        "Post",
        ...result.map(({id}) => ({type: "Post", id}))
      ]
    }),
    getPost: builder.query({
        query: (postId) => `/posts/${postId}`,
        // provides a specific {type: 'Post', id} object for the individual post object
        providesTags: (result,error,arg) => [{type: "Post", id: arg}],
    }),
    addNewPost: builder.mutation({
      query: initialPost => ({
        url: "/posts",
        method: "POST",
        body: initialPost
      }),
      // Listing a set of tags that are invalidated every time that mutation runs
      // Invalidates the general 'Post' tag, to refetch the whole list
      invalidatesTags: ["Post"]
    }),
    editPost: builder.mutation({
      query: post => ({
        url: `/posts/${post.id}`,
        method: "PATCH",
        body: post,
      }),
      //  invalidates the specific {type: 'Post', id} tag. This will force a refetch of both the individual post from getPost, as well as the entire list of posts from getPosts, because they both provide a tag that matches that {type, id} value.
      invalidatesTags: (result, error, arg) => [{type: "Post", id: arg.id}],
    })
  })
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetPostsQuery,useGetPostQuery,useAddNewPostMutation,useEditPostMutation } = apiSlice