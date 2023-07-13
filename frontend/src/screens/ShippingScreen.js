import React, { useState } from 'react';
import { Form, Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import FormContainer from '../components/FormContainer.js';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../slices/cartSlice.js';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps.js';

const ShippingScreen = () => {
  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;

  const [ address, setAddress ] = useState(shippingAddress.address || '');
  const [ city, setCity ] = useState(shippingAddress.city || '');
  const [ postalCode, setPostalCode ] = useState(shippingAddress.postalCode || '');
  const [ country, setCountry ] = useState(shippingAddress.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => { 
    e.preventDefault();
    dispatch(
      saveShippingAddress({ address, city, postalCode, country })
    );
    navigate('/payment');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />

      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <FormGroup controlId='address' className='my-2'>
          <FormLabel></FormLabel>
          <FormControl
            type='text'
            placeholder='Enter address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></FormControl>
        </FormGroup>

        <FormGroup controlId='city' className='my-2'>
          <FormLabel></FormLabel>
          <FormControl
            type='text'
            placeholder='Enter city'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></FormControl>
        </FormGroup>

        <FormGroup controlId='postalCode' className='my-2'>
          <FormLabel></FormLabel>
          <FormControl
            type='text'
            placeholder='Enter postalCode'
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          ></FormControl>
        </FormGroup>

        <FormGroup controlId='country' className='my-2'>
          <FormLabel></FormLabel>
          <FormControl
            type='text'
            placeholder='Enter country'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          ></FormControl>
        </FormGroup>

        <Button type='submit' variant='primary' className='my-2'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen