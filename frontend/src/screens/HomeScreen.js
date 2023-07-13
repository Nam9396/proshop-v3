import React from 'react'
import { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { useGetProductsQuery } from '../slices/productsApi';
import Loading from '../components/Spinner';
import Message from '../components/Message';
import { useParams, Link } from 'react-router-dom';
import PaginationPart from '../components/Pagination';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
  // const [ products, setProducts ] = useState([]);

  // useEffect(() => {
  //   const fetchProducts = async() => {
  //     try {
  //       const { data } = await axios.get('http://localhost:8000/api/products');
  //       setProducts(data);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   fetchProducts();
  // }, []);
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({ pageNumber, keyword }); // khong hieu tai sao phai pass multiple arg in onject, khong the pass directly duoc
  

  return (
    
    <div>
      {!keyword ? <ProductCarousel/> : (
        <Link to='/' className='btn btn-light mb-4'>
         Go Back
        </Link>
      )}
      { isLoading ? (
        <Loading />      
      ) : error ? (
        <Message variant={'danger'}>
          { error?.data?.message || error.error }
        </Message>
      ) : (
        <>
          <h1>Lasted products</h1>
          <Row> 
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3} >
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <PaginationPart
            pages={data.pages} 
            page={data.page}
            isAdmin={false}
            keyword={keyword ? keyword : ''}
          />
        </>
      ) }
    </div>
  )
}

export default HomeScreen