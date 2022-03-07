import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { orderListAction } from '../actions/orderActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.orderList);
  const { orders, loading, error } = orderList;

  /***************CHECKS IF LOGIN & ADMIN & THEN DISPATCH********************/
  const userLogin = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (Object.keys(userLogin).length === 0) {
      history.push('/login?redirect=/');
    } else {
      if (!userLogin.userInfo) {
        history.push('/login?redirect=/');
      } else if (!userLogin.userInfo.isAdmin) {
        history.push(`/`);
      } else {
        dispatch(orderListAction());
      }
    }
  }, [userLogin, history, dispatch]);
  /****************************************************/

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table bordered striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ORDER_ID</th>
              {/* <th>CUST_ID</th> */}
              <th>CUST_NAME</th>
              <th>DATE</th>
              <th>DELIVERED</th>
              <th>PAID</th>
              <th>TOTAL</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='info' className='btn-sm'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
