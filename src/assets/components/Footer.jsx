import { NavLink } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Home01Icon, FavouriteIcon } from '@hugeicons/core-free-icons';
import '../../styles/footer.css';

function Footer() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <NavLink to="/" end className="nav-button">
        <HugeiconsIcon icon={Home01Icon} size={24} aria-hidden="true" />
        <span>Home</span>
      </NavLink>
      <NavLink to="/favorites" className="nav-button">
        <HugeiconsIcon icon={FavouriteIcon} size={24} aria-hidden="true" />
        <span>Favorites</span>
      </NavLink>
    </nav>
  );
}

export default Footer;
