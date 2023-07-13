import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ pageNumber, keyword }) => ({ // khong hieu tai sao phai pass multiple arg in onject, khong the pass directly duoc
        url: PRODUCTS_URL,
        params: {
          pageNumber,
          keyword,
        }
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Poduct'], //guider noi day can cho refetch data ??? nhung minh loai boai thi data van dc refetch
    }), 
    getProductById: builder.query({ 
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`
      }),
      keepUnusedDataFor: 5, 
    }),
    deleteProductById: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`, 
        method: 'DELETE'
      })
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL, 
        method: 'POST', 
      }), 
      invalidatesTags: ['Product'],
    }), 
    updateProduct: builder.mutation({
      query: (data) => ({ 
        url: `${PRODUCTS_URL}/${data.productId}`, 
        method: 'PUT', 
        body: data
      }), 
      invalidatesTags: ['Product']
    }), 
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: 'POST', 
        body: data
      })
    }), 
    createProductReviews: builder.mutation({
      query: (data) => ({ 
        url: `${PRODUCTS_URL}/${data.productId}/reviews`, 
        method: 'POST', 
        body: data,
      }), 
      invalidatesTags: ['Product'],
    }), 
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`, 
      }), 
      keepUnusedDataFor: 5
    })
  })
})

export const { 
  useGetProductsQuery, 
  useGetProductByIdQuery,
  useDeleteProductByIdMutation,
  useCreateProductMutation,
  useUpdateProductMutation, 
  useUploadProductImageMutation,
  useCreateProductReviewsMutation,
  useGetTopProductsQuery,
} = productsApiSlice;