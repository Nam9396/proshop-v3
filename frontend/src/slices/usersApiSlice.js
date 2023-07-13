import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST', 
        body: data,
        credentials: "include", 
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: 'POST', 
        body: data,
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST'
      })
    }), 
    //Admin function
    getAllUsers: builder.query({
      query: () => ({
        url: USERS_URL
      }), 
      keepUnusedDataFor: 5, 
    }), 
    deleteUserById: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE'
      })
    }),
    getUserById: builder.query({
      query: (id) => ({ 
        url: `${USERS_URL}/${id}`, 
      })
    }), 
    updateUserById: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`, 
        method: 'PUT', 
        body: data, 
      }),
    })
  })
})

export const { 
  useLoginMutation, 
  useLogoutMutation, 
  useRegisterMutation, 
  useGetAllUsersQuery,
  useDeleteUserByIdMutation,
  useGetUserByIdQuery,
  useUpdateUserByIdMutation, 
} = usersApiSlice;