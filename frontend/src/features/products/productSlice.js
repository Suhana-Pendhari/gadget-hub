import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const dedupeProductsById = (products = []) => {
    const seen = new Set();
    return products.filter((product) => {
        const id = product?._id;
        if (!id) return true;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
    });
};

export const getProduct = createAsyncThunk('product/getProduct', async({keyword, category, topReviews=false, limit, page=1}, {rejectWithValue})=>{
    try {
        const params = new URLSearchParams();
        if(category){
            params.set('category', category);
        }
        if(keyword){
            params.set('keyword', keyword);
        }
        if(topReviews){
            params.set('topReviews', 'true');
        }
        if(limit){
            params.set('limit', String(limit));
        }
        params.set('page', String(page));

        const {data} = await axios.get(`/api/v1/products?${params.toString()}`);
        const uniqueProducts = dedupeProductsById(data.products || []);
        return {
            ...data,
            products: uniqueProducts,
        };
    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred');
    }
})

// Home deals (high discounted products)
export const getDiscountedProducts = createAsyncThunk(
    'product/getDiscountedProducts',
    async ({ minDiscount = 40, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (minDiscount !== undefined) params.set('minDiscount', minDiscount);
            if (limit !== undefined) params.set('limit', limit);

            const { data } = await axios.get(`/api/v1/products/discounted?${params.toString()}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    }
);

// Product details
export const getProductDetails = createAsyncThunk('product/getProductDetails', async(id, {rejectWithValue})=>{
    try {
        const link = `/api/v1/product/${id}`;
        const {data} = await axios.get(link);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred');
    }
})

// Submit review
export const createReview = createAsyncThunk('product/createReview', async({rating, comment, productId}, {rejectWithValue})=>{
    try {
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const {data} = await axios.put('/api/v1/review', {rating, comment, productId}, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred');
    }
})

const productSlice = createSlice({
    name: 'product',
    initialState:{
        products:[],
        productCount:0,
        loading:false,
        error:null,
        product:null,
        resultsPerPage:4,
        totalPages:0,
        discountedProducts: [],
        discountedLoading: false,
        discountedLoaded: false,
        discountedError: null,
        reviewSuccess:false,
        reviewLoading:false
    },
    reducers:{
        removeErrors:(state)=>{
            state.error = null
        },
        removeSuccess:(state)=>{
            state.reviewSuccess = false
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getProduct.pending, (state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(getProduct.fulfilled, (state, action)=>{
            state.loading=false;
            state.error=null;
            state.products=action.payload.products;
            state.productCount=action.payload.productCount;
            state.resultsPerPage=action.payload.resultsPerPage;
            state.totalPages=action.payload.totalPages;
        })
        .addCase(getProduct.rejected, (state, action)=>{
            state.loading=false;
            state.error=action.payload || 'Something went wrong';
            state.products = [];
        })

        builder.addCase(getDiscountedProducts.pending, (state) => {
            state.discountedLoading = true;
            state.discountedError = null;
        })
        .addCase(getDiscountedProducts.fulfilled, (state, action) => {
            state.discountedLoading = false;
            state.discountedLoaded = true;
            state.discountedError = null;
            state.discountedProducts = action.payload.products || [];
        })
        .addCase(getDiscountedProducts.rejected, (state, action) => {
            state.discountedLoading = false;
            state.discountedLoaded = true;
            state.discountedError = action.payload || 'Something went wrong';
            state.discountedProducts = [];
        })

        builder.addCase(getProductDetails.pending, (state) => {
            state.loading=true;
            state.error=null;
        })
        .addCase(getProductDetails.fulfilled, (state, action)=>{
            state.loading=false;
            state.error=null;
            state.product=action.payload.product;
        })
        .addCase(getProductDetails.rejected, (state, action)=>{
            state.loading=false;
            state.error=action.payload || 'Something went wrong';
        })

        builder.addCase(createReview.pending, (state) => {
            state.reviewLoading=true;
            state.error=null;
        })
        .addCase(createReview.fulfilled, (state, action)=>{
            state.reviewLoading=false;
            state.reviewSuccess=true;
        })
        .addCase(createReview.rejected, (state, action)=>{
            state.reviewLoading=false;
            state.error=action.payload || 'Something went wrong';
        })
    }
})

export const {removeErrors, removeSuccess} = productSlice.actions;
export default productSlice.reducer;
