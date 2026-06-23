import { useState } from "react";
import { Link } from "react-router-dom";
import "./Main.css";

function Main() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  console.log("Сейчас переменная isVideoOpen равна:", isVideoOpen);

  return (
    <main>
      <div className="pizza-background">Pizza</div>
      <div className="main-cont">
        <div className="text-section fade-in-up">
          <h1>
            <span className="gradient-text">Самая быстрая</span> <br /> доставка пиццы
          </h1>
          <p>
            Мы доставим сочную пиццу для вашей семьи за 30
            <br /> минут, если курьер опоздает -{" "}
            <span className="freepizz">пицца бесплатно!</span>
          </p>
          <p className="subtitle">Процесс приготовления:</p>

          <div className="video-preview" onClick={() => setIsVideoOpen(true)}>
            <img src="https://zcncvckglgttnjwrwuuc.supabase.co/storage/v1/object/public/pizza-images/important/pizza-frame.png" className="preview-image" />
            <img src="https://zcncvckglgttnjwrwuuc.supabase.co/storage/v1/object/public/pizza-images/important/Ellipse2.png" className="play-button" />
          </div>
          <div>
            <Link to="/catalog" className="catalog-button">
              Каталог
            </Link>
          </div>
        </div>
        <div className="photo-section fade-in-scale">
          <div className="photo-wrapper floating">
            <div className="badge badge-left">
              🔥 <span>30 минут</span>
            </div>
            <div className="badge badge-right">
              ⭐ <span>4.9</span>
            </div>
            <img src="https://zcncvckglgttnjwrwuuc.supabase.co/storage/v1/object/public/pizza-images/important/stepizza.jpeg" alt="Вкусная пицца" />
          </div>
        </div>
      </div>

      {isVideoOpen && (
        <div className="vide-player" onClick={() => setIsVideoOpen(false)}>
          <div className="video-content" onClick={(e) => e.stopPropagation()}>
            <video
              src="https://zcncvckglgttnjwrwuuc.supabase.co/storage/v1/object/public/pizza-images/video/pizza-making-main.mp4"
              controls
              autoPlay
              style={{ width: "100%", borderRadius: "20px" }}
            ></video>
          </div>
        </div>
      )}
    </main>
  );
}

export default Main;
