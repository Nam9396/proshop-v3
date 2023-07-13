import React, { useEffect, useState } from 'react';
import { Form, Button, Col, FormGroup, FormLabel, FormCheck } from 'react-bootstrap';
import FormContainer from '../components/FormContainer.js';
import CheckoutSteps from '../components/CheckoutSteps.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice.js';


const PaymentScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shippingAddress = useSelector(state => state.cart);
  const [ paymentMethod, setPaymentMethod ] = useState('PayPal');
  
  useEffect(() => {
    if (!shippingAddress) { 
      navigate('/shipping')
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder')
  };

  return (
    <FormContainer>

      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>

      <Form onSubmit={submitHandler}>
        <FormGroup>
          <FormLabel as='legend'>Select Method</FormLabel>
          <Col>
            <FormCheck
              type='radio'
              className='my-2'
              label='Paypal or Credit Card'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
            </FormCheck>
          </Col>
        </FormGroup>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>

    </FormContainer>
  )
}

export default PaymentScreen