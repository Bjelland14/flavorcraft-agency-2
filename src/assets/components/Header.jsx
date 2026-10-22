import { NavLink } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Home01Icon, FavouriteIcon, UserIcon } from '@hugeicons/core-free-icons';
import logo from '../logo.svg';
import '../../styles/header.css';

function Header({
  showSearch,
  search,
  onSearchChange,
  isRecipeDetail = false,
}) {
  return (
    <header className={`header${isRecipeDetail ? ' header--recipe-detail' : ''}`}>
      <div className="header-inner">
        <NavLink to="/" end className="header-brand" aria-label="FlavorCraft home">
          <img className="brand-logo" src={logo} alt="" aria-hidden="true" />
          <span className="brand-name" aria-label="FlavorCraft">
            <span className="brand-name-flavor">flavor</span>
            <span className="brand-name-craft">craft</span>
          </span>
        </NavLink>

        <div className="header-utility">
          {showSearch && (
            <section className="search-area" aria-label="Recipe search">
              <label className="search-field">
                <HugeiconsIcon icon={Search01Icon} size={20} aria-hidden="true" />
                <span className="sr-only">Search recipes</span>
                <input
                  type="search"
                  placeholder="Search a dish or ingredients..."
                  value={search}
                  onChange={(event) => onSearchChange(event.target.value)}
                />
              </label>
            </section>
          )}
          <nav className="top-nav" aria-label="Main navigation">
            <NavLink to="/" end className="top-nav-link">
              <HugeiconsIcon icon={Home01Icon} size={20} aria-hidden="true" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/favorites" className="top-nav-link">
              <HugeiconsIcon icon={FavouriteIcon} size={20} aria-hidden="true" />
              <span>Favorites</span>
            </NavLink>
            <button className="top-nav-link" type="button" aria-label="Log in">
              <HugeiconsIcon icon={UserIcon} size={20} aria-hidden="true" />
              <span>Log in</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
