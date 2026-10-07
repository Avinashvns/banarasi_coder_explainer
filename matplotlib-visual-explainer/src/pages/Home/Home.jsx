import Playground from "../../playground/Playground";
import "./Home.css";

function Home({ selectedModule }) {
  return (
    <section className="home">
      <Playground
        selectedModule={selectedModule}
      />
    </section>
  );
}

export default Home;