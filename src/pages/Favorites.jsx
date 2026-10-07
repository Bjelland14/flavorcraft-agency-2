import '../styles/home.css';

function Favorites() {
  return (
    <main className="content">
      <section className="recipe-area" aria-labelledby="favorites-heading">
        <h2 id="favorites-heading">Favorites</h2>
        <p className="empty-state" role="status">No favorites yet.</p>
      </section>
    </main>
  );
}

export default Favorites;
