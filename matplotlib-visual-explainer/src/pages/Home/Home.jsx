import Playground from "../../playground/Playground";
import "./Home.css";

function Home() {
  return (
    <section className="home">
      <div className="home-heading">
        <h1>Matplotlib Visual Explainer</h1>
        <p>Learn Matplotlib visually by creating and exploring charts step by step.</p>
      </div>
      <Playground />
    </section>
  );
}

export default Home;
