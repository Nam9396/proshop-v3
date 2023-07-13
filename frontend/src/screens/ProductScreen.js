import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { Form, Row, Col, Image, ListGroup, Card, Button, ListGroupItem, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import Rating from '../components/Rating';
import { toast } from 'react-toastify';
import { useCreateProductReviewsMutation, useGetProductByIdQuery } from '../slices/productsApi';
import Loading from '../components/Spinner';
import Message from '../components/Message';
import { addToCart } from '../slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import Meta from '../components/Meta';


const ProductScreen = () => {
  // const [ product, setProduct ] = useState({});
  // const { id } = useParams();

  
  // useEffect(() => {
  //   const getProductDetail = async() => {
  //     const response = await fetch(`http://localhost:8000/api/products/${id}`); 
  //     const json = await response.json();
  //     setProduct(json);
  //   };
  //   getProductDetail()
  // }, [id])
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId }= useParams();
  const { userInfo } = useSelector(state => state.auth);

  const [ qty, setQty ] = useState(1);
  const [ rating, setRating ] = useState(0);
  const [ comment, setComment ] = useState('');

  const { data: product, refetch, isLoading, error } = useGetProductByIdQuery(productId);
  const [ 
    createReviews, 
    { isLoading: loadingProductReview } 
  ] = useCreateProductReviewsMutation();
  
  const addToCartHandler = () => {
    dispatch(addToCart({...product, qty}));
    navigate('/cart');
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try { 
      const review = await createReviews({
        productId,
        rating, 
        comment,
      }).unwrap();
      
        toast.success('Review submitted'); 
        setComment(''); 
        setRating(0);
        refetch(); 
      
    } catch (err) { 
      toast.error(err?.data?.message || err.error);
      setComment(''); 
      setRating(0);
      refetch();
    } 
  };

  return (
    <div>
      { isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant={'danger'}>
          { error?.data?.message || error.error }
        </Message>
      ) : (
        <>
          <Meta
            title={product.name}
          />
          <Link to="/" className='btn btn-light my-3' >Go Back</Link>
          <Row>
            <Col md={5} >
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={4} >
              <ListGroup>
                <ListGroupItem>
                  <h3>{product.name}</h3>
                </ListGroupItem>
                <ListGroupItem>
                  <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </ListGroupItem>
                <ListGroupItem>
                  Price: ${product.price}
                </ListGroupItem>
                <ListGroupItem>
                  {product.description}
                </ListGroupItem>
              </ListGroup>
            </Col>
            <Col md={3} >
              <Card>
                <ListGroup>
                  <ListGroupItem>
                    <Row>
                      <Col>Status: </Col>
                      <Col>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</Col>
                    </Row>
                  </ListGroupItem>
                  
                  {product.countInStock > 0 && (
                    <ListGroupItem>
                      <Row>
                        <Col>Quantity</Col>
                        <Col>
                          <FormControl
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </FormControl>  
                        </Col>
                      </Row>

                    </ListGroupItem>
                  )}

                  <ListGroupItem>
                    <Button 
                      className='btn-block'
                      type='button'
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    > 
                      Add To Cart
                    </Button>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className='review'>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant='flush'>
              {product.reviews.map(review => (
                <ListGroupItem key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} />
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </ListGroupItem>
              ))}

                <ListGroupItem>
                  <h2>Write a review</h2>
                  {loadingProductReview && <Loading/>}
                  {userInfo ? (
                  <Form onSubmit={submitHandler}>
                    <FormGroup controlId='rating' className='my-2'>
                      <FormLabel>Rating</FormLabel>
                      <FormControl
                        as='select'
                        value={rating || 0}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value=''>Select...</option>
                        <option value='1'>1 - Poor</option>
                        <option value='2'>2 - Fair</option>
                        <option value='3'>3 - Good</option>
                        <option value='4'>4 - Very Good</option>
                        <option value='5'>5 - Excellent</option>
                      </FormControl>
                    </FormGroup>
                    <FormGroup controlId='comment' className='my-2'>
                      <FormLabel>Comment</FormLabel>
                      <FormControl
                        as='textarea'
                        row='3'
                        value={comment || ''}
                        onChange={(e) => setComment(e.target.value)}
                      >
                      </FormControl>
                    </FormGroup>
                    <Button
                        disabled={loadingProductReview}
                        type='submit'
                        variant='primary'
                    >
                      Submit
                    </Button>
                  </Form>
                  ) : ( 
                  <Message><Link to='/;ogin'>Sign in</Link>to write a review</Message> 
                  )}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </>
      ) }
      
    </div>
  )
}

export default ProductScreen;