import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, FormGroup, FormLabel, FormControl } from 'react-bootstrap'; 
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentails } from '../slices/authSlice';
import Loader from '../components/Spinner.js';
import { createAuthUser } from '../slices/fetchUserSlice';
 
const LoginScreen = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ login, {isLoading} ] = useLoginMutation();
  const { userInfo } = useSelector(state => state.auth);

  // const { authUser, isLoading, error } = useSelector(state => state.authUser);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  
  useEffect(() => {
    if (userInfo) { 
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try { 
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(setCredentails({ ...res,  }));
      navigate(redirect);
    } catch (error) { 
      toast.error(error?.data?.message || error.error);
    }
  };

  // const submitHandler = async (e) => {
  //   e.preventDefault();
  //   try { 
  //     dispatch(createAuthUser({ email: email, password: password }));
  //     dispatch(setCredentails({ authUser,  }));
  //     navigate(redirect);
  //   } catch (error) { 
  //     toast.error(error?.data?.message || error.error);
  //   }
  // };

  return (
    <FormContainer>
      <h1>Sign in</h1>
      
      <Form onSubmit={submitHandler}>
        <FormGroup controlId='email' className='my-3'>
          <FormLabel>Email Address</FormLabel>
          <FormControl
            type='email'
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          >
          </FormControl>
        </FormGroup>

        <FormGroup controlId='password' className='my-3'>
          <FormLabel>Passord</FormLabel>
          <FormControl
            type='password'
            placeholder='Enter Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          >
          </FormControl>
        </FormGroup>

        <Button
          type='submit'
          variant='primary'
          className='mt-3' 
        >
          Sign In
        </Button>

        { isLoading && <Loader /> }
      </Form>
      
      <Row>
        <Col>
          New Customer? 
          <Link 
            to={redirect ? `/register?redirect=${redirect}` : `/register`}
          >Register</Link>
        </Col>
      </Row>

    </FormContainer>
  )
}

export default LoginScreen