import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import '../componentStyles/AdminQuickMenu.css';

function AdminQuickMenu() {
    const [open, setOpen] = useState(false);

    const closeMenu = () => setOpen(false);

    return (
        <>
            <button
                type="button"
                className={`admin-quick-toggle ${open ? 'hidden' : ''}`}
                onClick={() => setOpen(true)}
            >
                <MenuIcon />
                Menu
            </button>
            {open && <div className="admin-quick-overlay" onClick={closeMenu}></div>}
            <aside className={`admin-quick-drawer ${open ? 'open' : ''}`}>
                <button type="button" className="admin-quick-close" onClick={closeMenu}>
                    <CloseIcon />
                </button>
                <h3>Admin Menu</h3>
                <nav>
                    <Link to="/admin/dashboard" onClick={closeMenu}>Dashboard</Link>
                    <Link to="/admin/products" onClick={closeMenu}>All Products</Link>
                    <Link to="/admin/product/create" onClick={closeMenu}>Create Product</Link>
                    <Link to="/admin/users" onClick={closeMenu}>All Users</Link>
                    <Link to="/admin/orders" onClick={closeMenu}>All Orders</Link>
                    <Link to="/admin/reviews" onClick={closeMenu}>All Reviews</Link>
                    <Link to="/admin/messages" onClick={closeMenu}>Messages</Link>
                </nav>
            </aside>
        </>
    );
}

export default AdminQuickMenu;
