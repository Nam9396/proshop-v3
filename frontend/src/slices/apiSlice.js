import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'
import { BASE_URL, PRODUCTS_URL } from '../constants'

const baseQuery = fetchBaseQuery({ 
  baseUrl: BASE_URL,
  credentials: 'include' //bao gom bien so nay se dam bao tat ca cac sub-request tu base_url se bao gom credential
  // hoac set up cho tung request dac biet de dam bao tinh bao mat
});

export const apiSlice = createApi({
  baseQuery, 
  tagTypes: [ 'Poduct', 'Order', 'User' ], 
  endpoints: (builder) => ({
   
  }),
  
});
