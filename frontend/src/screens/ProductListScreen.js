import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../slices/productApiSlice'
import { toast } from 'react-toastify'

const ProductListScreen = () => {
  
    const { data: products, isLoading, error, refetch } = useGetProductsQuery()
    const [createProduct, { isLoading: loadingCreate}] = useCreateProductMutation()
    const [deleteProduct, {isLoading: loadingDelete } ] = useDeleteProductMutation()

    const deleteHandler = async (id) => {
        if(window.confirm('Are you sure you want to delete the product?')){
            try {
                await deleteProduct(id)
                refetch()
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        }
    }

    const createProductHandler = async () => {
        if(window.confirm('Are you sure you want to create a new product')) {
            try {
                await createProduct()
                toast.success('Product deleted')
                refetch()
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        }
    }
  
    return (
    <>
        <Row>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className='text-end'>
                <Button className='m-3 btn-sm' onClick={ createProductHandler}><FaEdit /> Create Product</Button>
            </Col>
        </Row>
        { loadingCreate && <Loader />}
        { loadingDelete && <Loader />}
        { isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
            <>
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BAND</th>
                            <th></th>
                        </tr>
                    </thead> 
                    <tbody>
                        { products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                        <Button className='btn-sm mx-2' variant='light'><FaEdit /></Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}><FaTrash style={{color:'white'}}/></Button>    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </>
        )}

    </>
  )
}

export default ProductListScreen