import React, { useEffect } from 'react'
import { Form, Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../../components/Spinner.js'
import Message from '../../components/Message.js'
import FormContainer from '../../components/FormContainer.js';
import { useState } from 'react'
import { useGetProductByIdQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../../slices/productsApi.js'

const ProductEditScreen = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams(); 
  const [ name, setName ] = useState('');
  const [ price, setPrice ] = useState('');
  const [ image, setImage ] = useState('');
  const [ brand, setBrand ] = useState('');
  const [ category, setCategory ] = useState('');
  const [ description, setDescription ] = useState('')
  const [ countInStock, setCountInStock ] = useState('');
 
  const { 
    refetch,
    data: product, 
    isLoading, 
    error
  } = useGetProductByIdQuery(productId);

  const [ 
    updateProduct, 
    {isLoading: loadingUpdate, error: errorUpdate}
  ] = useUpdateProductMutation();

  const [ 
    uploadProductImage, 
    {isLoading: loadingUploadImage, error: errorUploadImage}
  ] = useUploadProductImageMutation();

  useEffect(() => {
    if (product) { 
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setCategory(product.category);
      setBrand(product.brand);
      setCountInStock(product.countInStock);
    }
  }, [product]);
  
  const submitHandler = async (e) => {
    e.preventDefault();
    //huong dan khong dung try catch
    //neu handle error khong tot, code execution van dien ra nhung KHONG DUNG BAN CHAT va KHONG DUNG THU TU
    try {
      await updateProduct({
        productId: productId,
        name: name,
        price: price, 
        description: description,
        image: image, 
        brand: brand, 
        category: category,
        countInStock: countInStock,
      }); // khong hieu sao viec co unwrap khien loi duoc pass xuong catch va display len phia client, khong co unwrap - cac cau lenh trong try van duoc exe
      toast.success('Product updated');
      navigate('/admin/productlist');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
      console.log('this is error' + error);
    }
  }

  const uploadFileHandler = async (e) => { 
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try { 
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image)
    } catch (err) { 
      toast.error(err?.data?.message || err.error)
    }
  }
  

  return (
    <>
      <Link to='/admin/productList' className='btn btn-light my-3'>
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit Product</h1>
          {loadingUpdate && <Loading />}
          {isLoading ? (
            <Loading />
          ) : error ? (
            <Message variant='danger'>{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <FormGroup controlId='name' className='my-2'>
                <FormLabel>Name</FormLabel>
                <FormControl
                  type='text'
                  placeholder='Enter name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                >
                </FormControl>
              </FormGroup>

              <FormGroup controlId='price' className='my-2'>
                <FormLabel>Price</FormLabel>
                <FormControl
                  type='number'
                  placeholder='Enter price'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                >
                </FormControl>
              </FormGroup>

              <FormGroup controlId='description' className='my-2'>
                <FormLabel>Description</FormLabel>
                <FormControl
                  type='text'
                  placeholder='Enter description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                >
                </FormControl>
              </FormGroup>

              <FormGroup controlId='image' className='my-2'>
                <FormLabel>Image</FormLabel>
                <FormControl
                  type='text'
                  placeholder='Image url'
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                >
                </FormControl>
                <FormControl
                  type='file'
                  label='Choose file'
                  onChange={(e) => uploadFileHandler(e)} //sai lam khi thieu dau ()
                >
                </FormControl>
              </FormGroup>

              <FormGroup controlId='category' className='my-2'>
                <FormLabel>Category</FormLabel>
                <FormControl
                  type='text'
                  placeholder='Enter category'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                > 
                </FormControl>
              </FormGroup>

              <FormGroup controlId='brand' className='my-2'>
                <FormLabel>Brand</FormLabel>
                <FormControl
                  type='text'
                  placeholder='Enter brand'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                </FormControl>
              </FormGroup>

              <FormGroup controlId='countInStock' className='my-2'>
                <FormLabel>Count In Stock</FormLabel>
                <FormControl
                  type='number'
                  placeholder='Enter countInStock'
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                >
                </FormControl>
              </FormGroup>

              <Button
                type='submit'
                variant='primary'
                className='my-2'
              >
                Submit
              </Button>

            </Form>
          )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen;