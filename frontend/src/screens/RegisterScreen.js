import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, FormGroup, FormLabel, FormControl } from 'react-bootstrap'; 
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentails } from '../slices/authSlice';
import Loader from '../components/Spinner.js';
 
const RegisterScreen = () => {
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ register, {isLoading} ] = useRegisterMutation({ name, email, password });
  const { userInfo } = useSelector(state => state.auth);

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
    
    if (password !== confirmPassword) { 
      toast.error('Passwords do not match');
    } else { 
      try { 
        const res = await register({ name, email, password }).unwrap();
        console.log(res);
        dispatch(setCredentails({ ...res,  }));
        navigate(redirect);
      } catch (error) { 
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      
      <Form onSubmit={submitHandler}>
        <FormGroup controlId='name' className='my-3'>
          <FormLabel>Name</FormLabel>
          <FormControl
            type='text'
            placeholder='Enter User Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
          </FormControl>
        </FormGroup>

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

        <FormGroup controlId='confirm-password' className='my-3'>
          <FormLabel>Confirm Passord</FormLabel>
          <FormControl
            type='password'
            placeholder='Enter Password Again'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          >
          </FormControl>
        </FormGroup>

        <Button
          type='submit'
          variant='primary'
          className='mt-3' 
        >
          Register
        </Button>

        { isLoading && <Loader /> }
      </Form>
      
      <Row>
        <Col>
          Already have an account?
          <Link 
            to={redirect ? `/login?redirect=${redirect}` : `/login`}
          >Login</Link>
        </Col>
      </Row>

    </FormContainer>
  )
}

export default RegisterScreen;