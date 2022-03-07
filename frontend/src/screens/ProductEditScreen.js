import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProduct, updateProductAction } from '../actions/productActions';
import FormContainer from '../components/FormContainer';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productSingle = useSelector((state) => state.productSingle);
  const { loading, error, product } = productSingle;

  const updateProduct = useSelector((state) => state.updateProduct);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = updateProduct;

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
        //Logic moved to second useEffect for clarity
      }
    }
  }, [userLogin, history, dispatch]);
  /****************************************************/

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProductAction({
        _id: productId,
        name,
        description,
        brand,
        price,
        category,
        countInStock,
        image,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post('/api/uploads', formData, config);
      setImage(data);
      setUploading(false);
    } catch (e) {
      console.error(e);
      setUploading(false);
    }
  };

  useEffect(() => {
    console.log('hi');
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push(`/admin/productlist`);
    } else {
      if (!product || !product.name || product._id !== productId) {
        dispatch(listProduct(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setDescription(product.description);
        setCountInStock(product.countInStock);
      }
    }
  }, [productId, dispatch, product, successUpdate, history]);
  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='my-3'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='price' className='my-3'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='brand' className='my-3'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                }}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='category' className='my-3'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='description' className='my-3'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='countInStock' className='my-3'>
              <Form.Label>Count in stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter count in stock'
                value={countInStock}
                onChange={(e) => {
                  setCountInStock(e.target.value);
                }}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='image' className='my-3'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
                required
              ></Form.Control>
              <Form.Control
                type='file'
                label='Choose File'
                custom
                onChange={uploadFileHandler}
              ></Form.Control>
              {uploading && <Loader />}
            </Form.Group>
            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
