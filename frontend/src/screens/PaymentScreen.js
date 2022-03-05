import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const userLogin = useSelector((state) => state.userLogin);
  const dispatch = useDispatch();
  useEffect(() => {
    if (Object.keys(userLogin).length === 0) {
      history.push('/login?redirect=payment');
    } else {
      if (!userLogin.userInfo) {
        history.push('/login?redirect=payment');
      }
    }
  }, [userLogin, history]);
  if (!shippingAddress) {
    history.push('/shipping');
    return;
  }
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col className='my-3'>
            <Form.Check
              type='radio'
              id='PayPal'
              label='PayPal or Credit Card'
              name='paymentMethod'
              value='PayPal'
              checked
              onChange={(e) => {
                setPaymentMethod(e.target.value);
              }}
            ></Form.Check>
            {/* <Form.Check
              type='radio'
              id='Stripe'
              label='Stripe'
              name='paymentMethod'
              value='Stripe'
              onChange={(e) => {
                setPaymentMethod(e.target.value);
              }}
            ></Form.Check> */}
          </Col>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-2'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
