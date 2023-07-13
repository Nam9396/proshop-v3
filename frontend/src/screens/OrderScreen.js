import React, { useEffect } from 'react'
import { Row, Col, ListGroup, Image, Button, Card, ListGroupItem } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useDeliverOrderMutation, useGetOrderDetailsQuery, useGetPayPalClientIdQuery, usePayOrderMutation } from '../slices/ordersApiSlice';
import Loading from '../components/Spinner.js'
import Message from '../components/Message.js'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';


const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector(state => state.auth);

  const { data: order, refetch,  isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [ deliverOrder, { isLoading: loadingDeliver } ] = useDeliverOrderMutation(orderId);
  
  const [ payOrder, { isLoading: loadingPay } ] = usePayOrderMutation();
  const [ {isPending}, paypalDispatch ] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPayPalClientIdQuery();

  useEffect(() => {
    if (!loadingPayPal && !errorPayPal && paypal.clientId) { 
      const loadPayPalScript = async() => { 
        paypalDispatch({
          type: 'resetOptions', 
          value: { 
            'client-id': paypal.client,
            currency: 'USD'
          }
        });
        paypalDispatch({ 
          type: 'setLoadingStatus', 
          value: 'pending'
        });
      }
      if (order && !order.isPaid) { 
        if (!window.paypal) { 
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal])  

  const onApprove = (data, actions) => { 
    return actions.order.capture().then(async function (details) {
      try {  
        await payOrder({ orderId, details }); 
        refetch();
        toast.success('Payment successful');
      } catch (err) { 
        toast.error(err?.data?.message || err.error)
      }
    });
  }

  const onApproveTets = async () => { 
    await payOrder({ orderId, details: {
      payer: {}
    } }); 
    refetch();
    toast.success('Payment successful');
  }

  const onError = (err) => { 
    toast.error(err.message);
  }

  const createOrder = (data, actions) => { 
    
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: order.totalPrice },
        }
      ]
    }).then((orderId) => { return orderId })
  }
  
  const deliverOrderHandler = async () => { 
    try { 
      await deliverOrder(orderId);
      refetch();
      toast.success('Order delivered');
    } catch (error) {
      toast.error(error.data.message || error.message)
    }
  }
  
  return isLoading ? 
    <Loading/> : error ? 
    <Message variant='danger' /> : 
    (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroupItem>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong> {order.user.email}
              </p>
              <p>
                <strong>Address: </strong> {order.shippingAddress.city}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on { order.deliveredAt }
                </Message>
              ) : (
                <Message variant='danger'>
                  Not delivered
                </Message>
              )}
            </ListGroupItem>

            <ListGroupItem>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroupItem>

            <ListGroupItem>
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroupItem key={index}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroupItem>
          </ListGroup>
        </Col>
        
        <Col>
          <Card>
            <ListGroup variant='flush'>
              <ListGroupItem>
                <h2>Order Summary</h2>
              </ListGroupItem>

              <ListGroupItem>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
                <Row>
                  <Col>Tax Price</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
                {/* <Row>
                  <Col>Total Price</Col>
                  <Col>${order.totalPrice}</Col>
                </Row> */}
              </ListGroupItem>

              {loadingDeliver && <Loading/>}
              {userInfo && userInfo.isAdmin && order.isPaid && order.isDelivered && (
                <ListGroupItem>
                  <Button 
                    type='button' 
                    className='btn btn-block'
                    onClick={deliverOrderHandler}  
                  >
                    Mark as Delivered
                  </Button>
                </ListGroupItem>
              )}

              {!order.isPaid && (
                <ListGroupItem>
                  {loadingPay && <Loading />}
                  {isPending ? <Loading /> : (
                    <div>
                      <Button
                        onClick={onApproveTets}
                        style={{marginBottom: '10px'}}
                      >Test Pay Order</Button>
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        >
                        </PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroupItem>
              )}
            </ListGroup>
          </Card>
        </Col>
    
      </Row>
    </>
    )
}

export default OrderScreen