import React, { useEffect, useState } from 'react';
import '../pageStyles/Products.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import { getProduct, removeErrors } from '../features/products/productSlice';
import Loader from '../components/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import NoProducts from '../components/NoProducts';

function Products() {
    const { loading, error, products } = useSelector(state => state.product);
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get("keyword");
    const category = searchParams.get("category");
    const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
    const navigate = useNavigate();
    const categories = ['Mobile Accessories', 'Gaming Accessories', 'TV', 'Smart Gadgets', 'Car Accessories', 'Photography', 'Toys'];
    const uniqueProducts = products.filter((product, index, arr) => {
        if (!product?._id) return true;
        return index === arr.findIndex((p) => p?._id === product._id);
    });


    useEffect(() => {
        dispatch(getProduct({ keyword, category, limit: 24, page: 1 }));
    }, [dispatch, keyword, category])
    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error])
    const handleCategoryClick = (category)=>{
        const newSearchParams = new URLSearchParams(location.search);
        newSearchParams.set('category', category);
        navigate(`?${newSearchParams.toString()}`);
        setIsCategorySidebarOpen(false);
    }
    return (
        <>
            {(loading ? (<Loader />) : <>
                <PageTitle title="All Products" />
                <Navbar />
                <div className="products-layout">
                    <button
                        type="button"
                        className="category-drawer-toggle"
                        onClick={() => setIsCategorySidebarOpen(true)}
                    >
                        Categories
                    </button>
                    {isCategorySidebarOpen && (
                        <div
                            className="category-drawer-overlay"
                            onClick={() => setIsCategorySidebarOpen(false)}
                        ></div>
                    )}
                    <div className={`filter-section ${isCategorySidebarOpen ? 'mobile-open' : ''}`}>
                        <button
                            type="button"
                            className="category-drawer-close"
                            onClick={() => setIsCategorySidebarOpen(false)}
                        >
                            ✕
                        </button>
                        <h3 className="filter-heading">CATEGORIES</h3>
                        {/* Render All Categories */}
                        <ul>
                            {
                                categories.map((category)=>{
                                    return (
                                        <li key={category} onClick={()=>handleCategoryClick(category)}>{category}</li>
                                    )
                                })
                            }
                        </ul>
                    </div>

                    <div className="products-section">
                        {uniqueProducts.length>0?(<div className="products-product-container">
                            {uniqueProducts.map((product, index) => (
                                <Product key={product?._id || `product-${index}`} product={product} />
                            ))}
                        </div>):(
                            <NoProducts keyword={keyword}/>
                        )}
                    </div>
                </div>
                <Footer />
            </>)}
        </>
    )
}

export default Products