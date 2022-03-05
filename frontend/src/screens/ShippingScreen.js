import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const userLogin = useSelector((state) => state.userLogin);
  const { shippingAddress } = cart;
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    history.push('/payment');
  };
  useEffect(() => {
    if (Object.keys(userLogin).length === 0) {
      history.push('/login?redirect=shipping');
    } else {
      if (!userLogin.userInfo) {
        history.push('/login?redirect=shipping');
      }
    }
  }, [userLogin, history]);
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='Address' className='my-3'>
          <Form.Label>Your Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Address'
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='City' className='my-3'>
          <Form.Label>Your City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter City'
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='postalCode' className='my-3'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='value'
            placeholder='Enter City'
            value={postalCode}
            onChange={(e) => {
              setPostalCode(e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='country' className='my-3'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Country'
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-2'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
