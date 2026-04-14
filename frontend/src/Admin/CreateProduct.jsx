import React, { useEffect, useState } from 'react';
import '../AdminStyles/CreateProduct.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProduct, removeErrors, removeSuccess } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';
import AdminQuickMenu from '../components/AdminQuickMenu';

function CreateProduct() {

    const { success, loading, error } = useSelector(state => state.admin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [discountPercent, setDiscountPercent] = useState(0);
    const [image, setImage] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [video, setVideo] = useState([]);
    const [videoPreview, setVideoPreview] = useState([]);

    const categories = ['Mobile Accessories', 'Gaming Accessories', 'TV', 'Smart Gadgets', 'Car Accessories', 'Photography', 'Toys'];
    const createProductSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('name', name);
        myForm.set('price', price);
        myForm.set('description', description);
        myForm.set('category', category);
        myForm.set('stock', stock);
        myForm.set('discountPercent', discountPercent);
        image.forEach((img) => {
            myForm.append('image', img);
        })
        video.forEach((vid) => {
            myForm.append('video', vid);
        })
        dispatch(createProduct(myForm));
    }

    const createProductImage = (e) => {
        const files = Array.from(e.target.files);
        setImage(files);
        setImagePreview([]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagePreview((old) => [...old, reader.result]);
                }
            }
            reader.readAsDataURL(file);
        })
    }

    const createProductVideo = (e) => {
        const files = Array.from(e.target.files);
        setVideo([]);
        setVideoPreview([]);

        files.forEach((file) => {
            setVideoPreview((old) => [...old, file.name]);
            setVideo((old) => [...old, file]);
        })
    }

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success) {
            toast.success("Product Created Successfully!", { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            setName("");
            setPrice("");
            setDescription("");
            setCategory("");
            setStock("");
            setImage([]);
            setImagePreview([]);
            setVideo([]);
            setVideoPreview([]);
            navigate('/admin/dashboard');
        }
    }, [dispatch, error, success, navigate])

    return (
        <>
            <Navbar />
            <AdminQuickMenu />
            <PageTitle title='Create Product' />
            <div className="create-product-container">
                <h1 className="form-title">Create Product</h1>
                <form className="product-form" encType='multipart/form-data' onSubmit={createProductSubmit}>
                    <input type="text" className="form-input" placeholder='Enter Product Name' required name='name' value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="number" className="form-input" placeholder='Enter Product Pice' required name='price' value={price} onChange={(e) => setPrice(e.target.value)} />
                    <input type="text" className="form-input" placeholder='Enter Product Description' required name='description' value={description} onChange={(e) => setDescription(e.target.value)} />
                    <select className="form-select" required name='category' value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Choose a Category</option>
                        {categories.map((item) => (
                            <option value={item} key={item}>{item}</option>
                        ))
                        }
                    </select>
                    <input type="number" className="form-input" placeholder='Enter Product Stock' required name='stock' value={stock} onChange={(e) => setStock(e.target.value)} />
                    <input
                        type="number"
                        className="form-input"
                        placeholder='Enter Discount Percentage'
                        required
                        min={0}
                        max={100}
                        step={1}
                        name='discountPercent'
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(e.target.value)}
                    />
                    <label className="form-label">Product Images</label>
                    <div className="file-input-container">
                        <input type="file" accept='image/*' className='form-input-file' multiple name='image' onChange={createProductImage} />
                    </div>
                    <div className="image-preview-container">
                        {imagePreview.map((img, index) => (
                            <img src={img} alt="Product Preview" className='image-preview' key={index} />
                        ))}
                    </div>
                    <label className="form-label">Product Videos (Optional)</label>
                    <div className="file-input-container">
                        <input type="file" accept='video/*' className='form-input-file' multiple name='video' onChange={createProductVideo} />
                    </div>
                    <div className="video-preview-container">
                        {videoPreview.map((vid, index) => (
                            <p key={index} className='video-preview'>{vid}</p>
                        ))}
                    </div>
                    <button className="submit-btn">{loading ? 'Creating Product...' : 'Create'}</button>
                </form>
            </div>

            <Footer />
        </>
    )
}

export default CreateProduct