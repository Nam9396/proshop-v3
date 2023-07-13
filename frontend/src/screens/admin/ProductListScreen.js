import React from 'react'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Loading from '../../components/Spinner.js'
import Message from '../../components/Message.js'
import { useCreateProductMutation, useDeleteProductByIdMutation, useGetProductsQuery } from '../../slices/productsApi.js'
import PaginationPart from '../../components/Pagination.js'

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const{ data, refetch, isLoading, error } = useGetProductsQuery({ pageNumber });
  const [ createdProduct, {isLoading: loadingCreate} ] = useCreateProductMutation();
  const [ deleteProductById, {isLoading: loadingDelete} ] = useDeleteProductByIdMutation();

  const deleteHandler = async (id) => { 
    if (window.confirm('Are you sure?')) { 
      try { 
        const productDelete = await deleteProductById(id).unwrap();
        if (productDelete) {
          toast.success('Product deleted')
          refetch();
        } else { 
          toast.error('Cannot delete')
        }
      } catch (err) { 
        toast.error(err?.data?.message || err.error);
      }  
    }
  }

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try { 
        await createdProduct();
        refetch(); // neu khong co, phai refesh trang moi hien ra san pham moi dc them vao, refetch chi dung cho query, khong dung cho mutation 
      } catch (err) { 
        toast.error(err.data.message || err.error)
      }
    }
  };
  
  return (
    <>
      <Row>
        <Col><h1>Products</h1></Col>
        <Col className='text-end'>
          <Button className='btn-sm m-3'
            onClick={createProductHandler}
          >
            <FaEdit />Create Product
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loading />}
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {data.products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer
                    to={`/admin/product/${product._id}/edit`}
                  >
                    <Button variant='light' className='btn-sm mx-2'
                    >
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button variant='danger' style={{color: 'white'}} className='btn-sm'
                   onClick={() => deleteHandler(product._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>    
            ))}    
            </tbody>
          </Table>
          <PaginationPart
            page={data.page}
            pages={data.pages}
            isAdmin={true}
          />
        </>
      )}
    </>
  )
}

export default ProductListScreen;