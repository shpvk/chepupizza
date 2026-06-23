import "./Main.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function Main() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <main>
      <div className="pizza-background">Pizza</div>
      <div className="main-cont">
        <div className="text-section fade-in-up">
          <h1>
            <span className="gradient-text">The fastest</span> <br /> pizza delivery
          </h1>
          <p>
            We deliver hot, juicy pizza for your family in 30 minutes.
            <br />If the courier is late, <span className="freepizz">the pizza is free!</span>
          </p>
          <p className="subtitle">How we make it:</p>

          <div className="video-preview" onClick={() => setIsVideoOpen(true)}>
            <img src="https://zcncvckglgttnjwrwuuc.supabase.co/storage/v1/object/public/pizza-images/important/pizza-frame.png" className="preview-image" alt="Pizza making preview" />
            <img src="https://zcncvckglgttnjwrwuuc.supabase.co/storage/v1/object/public/pizza-images/important/Ellipse2.png" className="play-button" alt="Play video" />
          </div>
          <div>
            <Link to="/catalog" className="catalog-button">Catalog</Link>
          </div>
        </div>
        <div className="photo-section fade-in-scale">
          <div className="photo-wrapper floating">
            <div className="badge badge-left"><span>&#128293;</span><span>30 min</span></div>
            <div className="badge badge-right"><span>&#11088;</span><span>4.9</span></div>
            <img src="https://zcncvckglgttnjwrwuuc.supabase.co/storage/v1/object/public/pizza-images/important/stepizza.jpeg" alt="Delicious pizza" />
          </div>
        </div>
      </div>

      {isVideoOpen && (
        <div className="vide-player" onClick={() => setIsVideoOpen(false)}>
          <div className="video-content" onClick={(event) => event.stopPropagation()}>
            <video src="https://zcncvckglgttnjwrwuuc.supabase.co/storage/v1/object/public/pizza-images/video/pizza-making-main.mp4" controls autoPlay style={{ width: "100%", borderRadius: "20px" }} />
          </div>
        </div>
      )}
    </main>
  );
}

export default Main;