import "./header.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/CartContext";

function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const userInitial = user?.username?.trim()?.charAt(0)?.toUpperCase() || "U";
  const avatarKey = `avatar_${user?.username}`;
  const [avatar, setAvatar] = useState(() => localStorage.getItem(avatarKey));

  useEffect(() => {
    setAvatar(localStorage.getItem(avatarKey));
    const handleAvatarUpdate = () => setAvatar(localStorage.getItem(avatarKey));
    window.addEventListener("avatar-updated", handleAvatarUpdate);
    window.addEventListener("storage", handleAvatarUpdate);
    return () => {
      window.removeEventListener("avatar-updated", handleAvatarUpdate);
      window.removeEventListener("storage", handleAvatarUpdate);
    };
  }, [avatarKey]);

  return (
    <header className="header">
      <div className="header_logo"><div className="logo-wrapper"><Link to="/"><img src="https://zcncvckglgttnjwrwuuc.supabase.co/storage/v1/object/public/pizza-images/important/logo.png" alt="4epupizza" /></Link></div></div>
      <div className="nav_bar"><nav><ul><li><Link to="/catalog">Catalog</Link></li><li><Link to="/constructor">Builder</Link></li><li><Link to="/promotions">Deals</Link></li><li><Link to="/about">About</Link></li></ul></nav></div>
      <div className="header_actions">
        {isAuthenticated ? <div className="header-user"><Link to="/profile" className="header-user__profile" aria-label="Open profile"><span className="header-user__avatar" aria-hidden="true" style={{ overflow: "hidden" }}>{avatar ? <img src={avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : userInitial}</span><span className="header-user__name">{user.username}</span></Link><button className="btn--logout" type="button" onClick={logout}>Log out</button></div> : <Link to="/login" className="btn--login">Sign in</Link>}
        <Link to="/cart" className="btn--cart" id="header-cart-button"><img src="https://zcncvckglgttnjwrwuuc.supabase.co/storage/v1/object/public/pizza-images/important/cart.png" alt="Cart" />{totalItems > 0 && <span className="cart-badge">{totalItems > 99 ? "99+" : totalItems}</span>}</Link>
      </div>
    </header>
  );
}
export default Header;