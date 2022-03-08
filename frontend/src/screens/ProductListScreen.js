import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import {
  listProducts,
  deleteProductAction,
  createProductAction,
} from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import Paginate from '../components/Paginate';

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { products, loading, error, pages, page } = productList;

  const deleteProduct = useSelector((state) => state.deleteProduct);
  const {
    loading: loadingDel,
    success: successDel,
    error: errorDel,
  } = deleteProduct;

  const createProduct = useSelector((state) => state.createProduct);
  const {
    loading: loadingProduct,
    success: successProduct,
    error: errorProduct,
    product: createdProduct,
  } = createProduct;
  /***************CHECKS IF LOGIN & ADMIN & THEN DISPATCH********************/
  const userLogin = useSelector((state) => state.userLogin);

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (Object.keys(userLogin).length === 0) {
      history.push('/login?redirect=/');
    } else {
      if (!userLogin.userInfo) {
        history.push('/login?redirect=/');
      } else if (!userLogin.userInfo.isAdmin) {
        history.push(`/`);
      } else {
        if (successProduct) {
          history.push(`/admin/product/${createdProduct._id}/edit`);
        } else {
          dispatch(listProducts('', pageNumber));
        }
      }
    }
  }, [
    userLogin,
    history,
    dispatch,
    successDel,
    successProduct,
    createdProduct,
    pageNumber,
  ]);
  /****************************************************/

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteProductAction(id));
    }
  };
  const createProductHandler = () => {
    dispatch(createProductAction());
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create Product
          </Button>
        </Col>
      </Row>
      {loadingDel && <Loader />}
      {errorDel && <Message variant='danger'>{errorDel}</Message>}
      {loadingProduct && <Loader />}
      {errorProduct && <Message variant='danger'>{errorProduct}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table bordered striped hover responsive className='table-sm'>
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
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => {
                        deleteHandler(product._id);
                      }}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate page={page || pageNumber} pages={pages} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
