import React from 'react';
import { useGetTopProductsQuery } from '../slices/productsApi';
import Loading from './Spinner.js';
import Message from './Message.js';
import { Carousel, CarouselItem, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return (
    isLoading ? (
      <Loading />
    ) : error ? (
      <Message variant='danger'>{error}</Message>
    ) : (
      <Carousel pause='hover' className='bg-primary mb-4'>
        {products.map(product => (
          <CarouselItem>
            <Link to={`/product/${product._id}`}>
              <Image src={product.image} alt={product.name} fluid />
              <Carousel.Caption className='carousel-caption'>
                <h2>{product.name}  ${product.price}</h2>
              </Carousel.Caption>
            </Link>
          </CarouselItem>
        ))}
      </Carousel>
    )
  )
}

export default ProductCarousel