import "./Home.css";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import Main from "../components/Main/Main";
import Recomend from "../components/Main/Recomend";
import Promotions from "../components/Promotions/Promotions";
import About from "../components/Main/aboutus";
function Home() {
  return (
    <>
      <Header />
      <Main />
      <Recomend />
      <Promotions />
      <About />
      <Footer />
    </>
  );
}

export default Home;
