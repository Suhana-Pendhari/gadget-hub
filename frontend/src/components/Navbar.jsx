import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import "../componentStyles/Navbar.css";
import "../pageStyles/Search.css";
import { useSelector } from 'react-redux';
// import Logo from './Logo';


function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const toggleSearch = ()=>setIsSearchOpen(!isSearchOpen);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);
    const {isAuthenticated} = useSelector(state=>state.user);
    const {cartItems} = useSelector(state=>state.cart);
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
                    <li><Link to="/products" onClick={closeMenu}>About Us</Link></li>
                    <li><Link to="/products" onClick={closeMenu}>Contact Us</Link></li>
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
                    <Link to="/profile" className='register-link' onClick={closeMenu}>
                    </Link>
                )}
            </div>
        </div>
        {isMenuOpen && <div className="navbar-overlay" onClick={closeMenu}></div>}
    </nav>
  )
}

export default Navbar