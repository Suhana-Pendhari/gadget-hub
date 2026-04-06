import React, { useEffect } from 'react';
import "../pageStyles/Home.css";
import "../pageStyles/DiscountDeals.css";
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import ImageSlider from '../components/ImageSlider.jsx';
import Product from '../components/Product.jsx';
import DiscountDealCard from '../components/DiscountDealCard.jsx';
import PageTitle from '../components/PageTitle.jsx';
import Loader from '../components/Loader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getDiscountedProducts, getProduct, removeErrors } from '../features/products/productSlice.js';
import { toast } from 'react-toastify';

function Home() {
    const { loading, error, products, productCount, discountedProducts, discountedLoading, discountedLoaded } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProduct({keyword:""}));
    }, [dispatch])
    useEffect(() => {
        // Default: show all discounted products in Hot Deals
        dispatch(getDiscountedProducts({ minDiscount: 1, limit: 50 }));
    }, [dispatch]);
    useEffect(()=>{
        if(error){
            toast.error(error.message, {position:'top-center', autoClose:3000});
            dispatch(removeErrors());
        }
    }, [dispatch, error])
    return (
        <>
            {loading ? (<Loader />) : (<>
                <PageTitle title="Home-My Website" />
                <Navbar />
                <ImageSlider />

                <div className="discount-deals-wrap">
                    <div className="discount-deals-heading">
                        <h2 className="discount-deals-title">Hot Deals</h2>
                    </div>

                    {discountedLoading || !discountedLoaded ? (
                        <div className="discount-deals-loading">Loading deals...</div>
                    ) : discountedProducts && discountedProducts.length > 0 ? (
                        <div className="discount-deals-carousel">
                            {discountedProducts.map((product) => (
                                <DiscountDealCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="discount-deals-empty">No high discounts right now.</div>
                    )}
                </div>

                <div className="home-container">
                    <h2 className="home-heading">Trending Now</h2>
                    <div className="home-product-container">
                        {products.map((product, index) => (
                            <Product product={product} key={index} />
                        ))}
                    </div>
                </div>
                <Footer />
            </>)}
        </>
    );
}

export default Home