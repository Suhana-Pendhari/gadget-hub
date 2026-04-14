import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import "../componentStyles/Navbar.css";
import "../pageStyles/Search.css";
import { useDispatch, useSelector } from 'react-redux';
import { logout, removeSuccess } from '../features/user/userSlice';
import { toast } from 'react-toastify';
// import Logo from './Logo';


function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const toggleSearch = ()=>setIsSearchOpen(!isSearchOpen);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);
    const {isAuthenticated, user} = useSelector(state=>state.user);
    const {cartItems} = useSelector(state=>state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSearchSubmit = (e)=>{
        e.preventDefault();
        if(searchQuery.trim()){
            navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
        }else{
            navigate(`/products`);
        }
        setSearchQuery("");
        closeMenu();
    }
    const closeAllMenus = () => {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
    };

    const handleProfileAction = (path) => {
        setIsProfileMenuOpen(false);
        navigate(path);
    };

    const handleLogout = () => {
        dispatch(logout())
            .unwrap()
            .then(() => {
                toast.success('Logout Successful', { position: 'top-center', autoClose: 3000 });
                dispatch(removeSuccess());
                setIsProfileMenuOpen(false);
                navigate('/login');
            })
            .catch((error) => {
                toast.error(error?.message || 'Logout failed', { position: 'top-center', autoClose: 3000 });
            });
    };
    const mobileProfileName = user?.name ? user.name.split(" ")[0] : "You";

    useEffect(() => {
        document.body.classList.add('has-fixed-navbar');

        return () => {
            document.body.classList.remove('has-fixed-navbar');
        };
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('mobile-navbar-menu-open');
        } else {
            document.body.classList.remove('mobile-navbar-menu-open');
        }

        return () => {
            document.body.classList.remove('mobile-navbar-menu-open');
        };
    }, [isMenuOpen]);

  return (
    <nav className='navbar'>
        <div className="navbar-container">
            <div className="navbar-hamburger left" onClick={toggleMenu}>
                {isMenuOpen ? <CloseIcon className='icon'/> : <MenuIcon className='icon'/>}
            </div>

            <div className="navbar-logo">
                <Link to="/" onClick={closeMenu}>GadgetHub</Link>
            </div>

            <div className={`navbar-links ${isMenuOpen? 'active': ""}`}>
                <ul>
                    <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                    <li><Link to="/products" onClick={closeMenu}>Product</Link></li>
                    <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>
                    <li><Link to="/contact" onClick={closeMenu}>Contact Us</Link></li>
                </ul>
            </div>

            <div className="navbar-search">
                <div className="search-container">
                    <form className={`search-form ${isSearchOpen?'active':''}`} onSubmit={handleSearchSubmit}>
                        <input type="text"
                         className='search-input'
                         placeholder='Search products..'
                         value={searchQuery}
                         onChange={(e)=>setSearchQuery(e.target.value)}
                        />
                        <button type='button' className='search-icon' onClick={toggleSearch}>
                            <SearchIcon focusable="false"/>
                        </button>
                    </form>
                </div>
                <div className="cart-container navbar-cart">
                    <Link to="/cart" onClick={closeMenu}>
                        <ShoppingCartIcon className="icon"/>
                        <span className="cart-badge">{cartItems.length}</span>
                    </Link>
                </div>
            </div>

            <div className="navbar-icons">
                {!isAuthenticated ? (
                    <Link to="/register" className='register-link' onClick={closeMenu}>
                        <PersonAddIcon className='icon'/>
                    </Link>
                ) : (
                    <div className="auth-profile-wrap">
                    <button
                        type="button"
                        className='register-link auth-profile-link auth-profile-trigger'
                        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                    >
                        <img
                            src={user?.avatar?.url || "/images/profile.webp"}
                            alt={user?.name || "Profile"}
                            className="nav-profile-avatar"
                        />
                        <span className="nav-profile-name">{mobileProfileName}</span>
                        <KeyboardArrowDownIcon className="nav-profile-caret" />
                    </button>
                    {isProfileMenuOpen && (
                        <div className="nav-profile-dropdown">
                            <button type="button" onClick={() => handleProfileAction('/profile')}>My Profile</button>
                            <button type="button" onClick={() => handleProfileAction('/orders/user')}>My Orders</button>
                            <button type="button" onClick={() => handleProfileAction('/cart')}>Cart ({cartItems.length})</button>
                            {user?.role === 'admin' && (
                                <button type="button" onClick={() => handleProfileAction('/admin/dashboard')}>Admin Dashboard</button>
                            )}
                            <button type="button" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                    </div>
                )}
            </div>
        </div>
        {(isMenuOpen || isProfileMenuOpen) && <div className="navbar-overlay" onClick={closeAllMenus}></div>}
    </nav>
  )
}

export default Navbar