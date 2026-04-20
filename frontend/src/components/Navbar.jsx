import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineChartBar, HiOutlineUsers, HiOutlineLightningBolt } from 'react-icons/hi';

function Navbar() {
  return (
    <nav className="navbar" id="main-navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="brand-icon">🗳️</span>
        <span className="brand-text">PoW Predictor</span>
      </NavLink>

      <ul className="navbar-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            <HiOutlineHome /> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <HiOutlineChartBar /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/compare" className={({ isActive }) => isActive ? 'active' : ''}>
            <HiOutlineUsers /> Compare
          </NavLink>
        </li>
        <li>
          <NavLink to="/predict" className={({ isActive }) => isActive ? 'active' : ''}>
            <HiOutlineLightningBolt /> Predict
          </NavLink>
        </li>
      </ul>

      <div className="navbar-status">
        <span className="status-dot"></span>
        <span>System Online</span>
      </div>
    </nav>
  );
}

export default Navbar;
