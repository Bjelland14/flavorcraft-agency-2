import '../styles/home.css';

function Home({ search }) {
  return (
    <main className="content">
      <section className="recipe-area" aria-labelledby="view-heading">
        <h2 id="view-heading">
          {search.trim() ? 'Search results' : 'Tonight for your family'}
        </h2>
        <p className="empty-state" role="status">No recipes yet.</p>
      </section>
    </main>
  );
}

export default Home;
