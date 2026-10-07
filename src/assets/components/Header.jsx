import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, FilterHorizontalIcon } from '@hugeicons/core-free-icons';
import '../../styles/header.css';

function Header({ showSearch, search, onSearchChange }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [diet, setDiet] = useState('');
  const [time, setTime] = useState('');

  return (
    <header className="header">
      <div className="header-brand">
        <h1>FlavorCraft</h1>
      </div>
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
          <button
            type="button"
            className="filter-button"
            aria-expanded={filtersOpen}
            aria-controls="recipe-filters"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <HugeiconsIcon icon={FilterHorizontalIcon} size={16} aria-hidden="true" />
            Filters
          </button>
          <div id="recipe-filters" className="filters" hidden={!filtersOpen}>
            <label>
              Diet
              <select value={diet} onChange={(event) => setDiet(event.target.value)}>
                <option value="">Any diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-free</option>
              </select>
            </label>
            <label>
              Cooking time
              <select value={time} onChange={(event) => setTime(event.target.value)}>
                <option value="">Any time</option>
                <option value="15">Up to 15 minutes</option>
                <option value="30">Up to 30 minutes</option>
                <option value="60">Up to 60 minutes</option>
              </select>
            </label>
          </div>
        </section>
      )}
    </header>
  );
}

export default Header;
