import { ORDERS_URL, PAYPAL_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST', 
        body: {...order},
        // credentials: "include", //credentials phai la include, khong phai la true
        // prepareHeaders: (headers) => {
        //   headers.set("credentials", true)
        //     return headers
        // }
        // headers: { 'withCredentials': true } //// khong can set up cai nay nhu ng ta chi
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: 'GET', //
        // credentials: "include",
      }),
      keepUnusedDataFor: 5
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL
      }),
      keepUnusedDataFor: 5
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      })
    }), 
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`, 
        method: 'PUT', 
        body: {...details},
      })
    }), 
    getPayPalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL
      }), 
      keepUnusedDataFor: 5
    })
  })
})

export const { 
  useCreateOrderMutation,
  useGetOrderDetailsQuery, 
  useGetOrdersQuery,
  useDeliverOrderMutation,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
} = ordersApiSlice;