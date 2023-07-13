import React, { useState } from 'react'
import { Form, Button, FormControl } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'


const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams(); // khong hieu dong nay dung de lam gi
  const [ keyword, setKeyword ] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) { 
      navigate(`/search/${keyword}`);
      setKeyword('');
    } else { 
      navigate('/');  
    }
  }

  return (
    <Form className='d-flex' onSubmit={submitHandler}>
      <FormControl
        onSubmit={submitHandler}
        type='text'
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search Products...'
        className='mr-sm-2 ml-sm-5'
      >
      </FormControl>      
      <Button type='submit' variant='outline-success' className='p-2 mx-2'>
        Search
      </Button>
    </Form>
  )
}

export default SearchBox