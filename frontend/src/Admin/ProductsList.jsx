import React, { useEffect } from 'react';
import '../AdminStyles/ProductsList.css';
import Navbar from '../components/Navbar';
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Delete, Edit } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, fetchAdminProducts, removeErrors, removeSuccess } from '../features/admin/adminSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import AdminQuickMenu from '../components/AdminQuickMenu';

function ProductsList() {
    const { products, loading, error, deleting } = useSelector(state => state.admin);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchAdminProducts())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error])

    if (!products || products.length === 0) {
        return (
            <div className="product-list-container">
                <h1 className='product-list-title'>Admin Products</h1>
                <p className="no-admin-products">No Products Found</p>
            </div>
        )
    }

    const handleDelete = (productId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this product?');
        if (isConfirmed) {
            dispatch(deleteProduct(productId)).then((action) => {
                if (action.type === 'admin/deleteProduct/fulfilled') {
                    toast.success("Product Deleted Successfully!", { position: 'top-center', autoClose: 3000 });
                    dispatch(removeSuccess());
                }
            })
        }
    }

    return (
        <>
            {loading ? (<Loader />) : (<>
                <Navbar />
                <AdminQuickMenu />
                <PageTitle title='All Products' />
                <div className="product-list-container">
                    <h1 className="product-list">All Products</h1>
                    <div className="product-table-container">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Sr No</th>
                                <th>Product Image</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Ratings</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product, index) => {
                                const imageUrl = product?.image?.[0]?.url || './images/gadgethub-bg.jpeg';
                                return (
                                    <tr key={product._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img
                                                src={imageUrl}
                                                alt={product.name || 'Product Image'}
                                                className='admin-product-image'
                                            />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.price}/-</td>
                                        <td>{product.ratings}</td>
                                        <td>{product.category}</td>
                                        <td>{product.stock}</td>
                                        <td>{new Date(product.createdAt).toLocaleString()}</td>
                                        <td>
                                            <Link to={`/admin/product/${product._id}`} className='action-icon edit-icon'><Edit /></Link>
                                            <button className="action-icon delete-icon" disabled={deleting[product._id]} onClick={() => handleDelete(product._id)}>{deleting[product._id]?<Loader/>:<Delete/>}</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    </div>
                </div>
                <Footer />
            </>)}
        </>
    )
}

export default ProductsList