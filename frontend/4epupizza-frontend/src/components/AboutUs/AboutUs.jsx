import './AboutUs.css'

const creators = [
  {
    username: 'shpvk',
    name: 'Єгор',
    role: 'Backend developer',
  },
  {
    username: 'KapibaraUa',
    name: 'Артем',
    role: 'Frontend developer, design',
  },
  {
    username: 'Xamilio',
    name: 'Олександр',
    role: 'Frontend developer',
  },
  {
    username: 'borzikpPlus',
    name: 'Олексій',
    role: "Frontend developer",
  },
]

function AboutUs() {
  return (
    <section className="about-us-page">
      <div className="about-us-hero">
        <h1>Про нас</h1>
        <p>
          Ми - невелика команда, яка зібрала цей сайт від тіста до коду.
          Нижче - ті, хто це зробив: тисни на фото, щоб залетіти до нас у GitHub.
        </p>
      </div>

      <div className="about-us-team">
        {creators.map((creator) => (
          <a
            key={creator.username}
            className="creator-card"
            href={`https://github.com/${creator.username}`}
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="creator-card__photo"
              src={`https://github.com/${creator.username}.png?size=240`}
              alt={creator.name}
              loading="lazy"
            />
            <h2 className="creator-card__name">{creator.name}</h2>
            <span className="creator-card__role">{creator.role}</span>
            <span className="creator-card__link">@{creator.username}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default AboutUs
