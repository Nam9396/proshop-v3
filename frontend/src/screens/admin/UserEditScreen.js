import React, { useEffect } from 'react'
import { Form, Button, FormGroup, FormLabel, FormControl, FormCheck } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../../components/Spinner.js'
import Message from '../../components/Message.js'
import FormContainer from '../../components/FormContainer.js';
import { useState } from 'react'
import { useGetUserByIdQuery, useUpdateUserByIdMutation } from '../../slices/usersApiSlice.js'


const UserEditScreen = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams(); 
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ isAdmin, setIsAdmin ] = useState(false);
  
  const { 
    refetch,
    data: userData, 
    isLoading, 
    error
  } = useGetUserByIdQuery(userId);

  const [ updateUser, { isLoading: loadingUpdateUser } ] = useUpdateUserByIdMutation();

  useEffect(() => {
    if (userData) { 
      setName(userData.name);
      setEmail(userData.email);
      setIsAdmin(userData.isAdmin);
    }
  }, [userData]);
  
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUser({
        userId,
        name, 
        email, 
        isAdmin,
      }).unwrap();
      if (res) { 
        toast.success('User updated');
        navigate('/admin/userlist');
      }
    } catch (err) { 
      toast.error(err?.data?.message || err.error)
    }
  }
  

  return (
    <>
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit User</h1>
          {loadingUpdateUser && <Loading />}
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

              <FormGroup controlId='email' className='my-2'>
                <FormLabel>Email</FormLabel>
                <FormControl
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                >
                </FormControl>
              </FormGroup>
                
              <FormGroup controlId='isAdmin' className='my-2'>
                <FormCheck
                  type='checkbox'
                  label='Is admin'
                  // checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.value)}
                >
                </FormCheck>
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

export default UserEditScreen;