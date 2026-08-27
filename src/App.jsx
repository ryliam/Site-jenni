import React, { useState, useRef } from 'react';
import { Play } from 'lucide-react';

function App() {
  const [hoveredId, setHoveredId] = useState(null);
  
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const videoRef3 = useRef(null);

  const handleMouseEnter = (id, ref) => {
    setHoveredId(id);
    if (ref.current) {
      ref.current.play().catch(err => {
        console.log("Play interrupted: ", err);
      });
    }
  };

  const handleMouseLeave = (ref) => {
    setHoveredId(null);
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
    }
  };

  // SVG for the WhatsApp icon
  const WhatsAppIcon = () => (
    <svg 
      className="whatsapp-icon" 
      viewBox="0 0 24 24" 
      width="24" 
      height="24" 
      fill="currentColor"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.436 0 9.86-4.426 9.864-9.864.002-2.63-1.023-5.102-2.886-6.968C16.38 1.907 13.91 .882 11.278.882c-5.44 0-9.863 4.429-9.866 9.872-.001 1.562.415 3.09 1.202 4.424l-.992 3.628 3.71-.973zm11.587-6.85c-.326-.164-1.93-.953-2.229-1.062-.299-.109-.517-.164-.734.164-.218.327-.844 1.062-1.034 1.28-.19.218-.38.245-.706.081-1.127-.565-2.203-1.11-3.07-2.614-.232-.401.232-.372.662-1.23.076-.153.038-.287-.019-.396-.057-.109-.517-1.247-.707-1.706-.186-.447-.376-.386-.517-.393-.134-.007-.287-.008-.44-.008-.153 0-.403.057-.613.287-.21.23-.803.784-.803 1.91 0 1.127.82 2.215.933 2.37.113.153 1.614 2.464 3.91 3.455 1.92.83 2.69.75 3.65.61.545-.08 1.93-.79 2.202-1.556.272-.764.272-1.417.19-1.555-.081-.137-.299-.219-.625-.383z"/>
    </svg>
  );

  return (
    <div className="site-wrapper">
      <div className="app-container">
        <header className="app-header">
          <h1 className="brand-title">FK EVENT</h1>
          <p className="brand-tagline">Mariages · Baptêmes · Brunchs · Soirées</p>
        </header>

      <main className="app-content">
        {/* Informative Art de Recevoir Section */}
        <section className="info-section">
          <h2 className="section-title">L’ART DE RECEVOIR SUR-MESURE</h2>
          <div className="info-text-block">
            <p>
              Nous donnons une dimension inoubliable à chacun de vos événements. Nous orchestrons vos plus beaux moments — qu’il s’agisse d’un mariage élégant, d’un baptême chaleureux, d’un brunch convivial ou d’une soirée festive entre amis — en combinant haute gastronomie et scénographie raffinée.
            </p>
            <p>
              Nous concevons chaque réception comme une expérience unique : des classiques de la cuisine événementielle aux menus personnalisés intégrant, selon vos envies, les saveurs authentiques et revisitées de la gastronomie africaine. De l’art de la table à l’ambiance visuelle complète, nous créons une atmosphère sur-mesure pour que vous profitiez pleinement de vos invités.
            </p>
          </div>
        </section>

        {/* Hover-Expanding Video Cards Grid */}
        <section className={`cards-grid ${hoveredId !== null ? 'has-hovered' : ''}`}>
          <div 
            className={`media-card ${hoveredId === 1 ? 'is-expanded' : hoveredId !== null ? 'is-masked' : ''}`}
            onMouseEnter={() => handleMouseEnter(1, videoRef1)}
            onMouseLeave={() => handleMouseLeave(videoRef1)}
          >
            <video 
              ref={videoRef1}
              src="/video1.mp4#t=0.1" 
              preload="metadata"
              loop 
              muted
              playsInline
              className="card-video"
            />
            <div className={`card-overlay ${hoveredId === 1 ? 'is-hidden' : ''}`}>
              <div className="card-placeholder-overlay"></div>
              <span className="card-label">A Brunch moment</span>
              <button className="play-button" aria-label="Play Local Video 1">
                <Play className="play-icon" size={20} fill="currentColor" />
              </button>
            </div>
          </div>
          
          <div 
            className={`media-card ${hoveredId === 2 ? 'is-expanded' : hoveredId !== null ? 'is-masked' : ''}`}
            onMouseEnter={() => handleMouseEnter(2, videoRef2)}
            onMouseLeave={() => handleMouseLeave(videoRef2)}
          >
            <video 
              ref={videoRef2}
              src="/video2.mp4#t=0.1" 
              preload="metadata"
              loop 
              muted
              playsInline
              className="card-video"
            />
            <div className={`card-overlay ${hoveredId === 2 ? 'is-hidden' : ''}`}>
              <div className="card-placeholder-overlay"></div>
              <span className="card-label">Brunch food</span>
              <button className="play-button" aria-label="Play Local Video 2">
                <Play className="play-icon" size={20} fill="currentColor" />
              </button>
            </div>
          </div>

          <div 
            className={`media-card ${hoveredId === 3 ? 'is-expanded' : hoveredId !== null ? 'is-masked' : ''}`}
            onMouseEnter={() => handleMouseEnter(3, videoRef3)}
            onMouseLeave={() => handleMouseLeave(videoRef3)}
          >
            <video 
              ref={videoRef3}
              src="/video3.mp4#t=0.1" 
              preload="metadata"
              loop 
              muted
              playsInline
              className="card-video"
            />
            <div className={`card-overlay ${hoveredId === 3 ? 'is-hidden' : ''}`}>
              <div className="card-placeholder-overlay"></div>
              <span className="card-label">African brunch</span>
              <button className="play-button" aria-label="Play Local Video 3">
                <Play className="play-icon" size={20} fill="currentColor" />
              </button>
            </div>
          </div>
        </section>

        {/* Bouquet Sharing Section */}
        <section className="sharing-section">
          <h2 className="section-title">PARTAGER ENSEMBLE</h2>
          <div className="info-text-block">
            <p>
              Offrez un moment d’émotion unique grâce à notre service de partage. Choisissez et personnalisez un bouquet d'exception pour faire plaisir à vos proches : un gourmand bouquet de chocolats fins, un élégant bouquet de fleurs fraîches de saison, ou un surprenant bouquet d'argent décoratif pour marquer les esprits lors de vos célébrations.
            </p>
          </div>
          
          <div className="bouquet-grid">
            <div className="bouquet-card">
              <div className="bouquet-card-image" style={{ backgroundImage: "url('/chocolat.jpg')" }}></div>
              <div className="bouquet-card-info">
                <h3 className="bouquet-card-title">Bouquet de Chocolats</h3>
              </div>
            </div>
            
            <div className="bouquet-card">
              <div className="bouquet-card-image" style={{ backgroundImage: "url('/fleurs.jpg')" }}></div>
              <div className="bouquet-card-info">
                <h3 className="bouquet-card-title">Bouquet de Fleurs</h3>
              </div>
            </div>
            
            <div className="bouquet-card">
              <div className="bouquet-card-image" style={{ backgroundImage: "url('/argent.jpg')" }}></div>
              <div className="bouquet-card-info">
                <h3 className="bouquet-card-title">Bouquet d’Argent</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <h2 className="section-title">Contact</h2>
          <div className="contact-actions">
            <a 
              href="https://wa.me/33665604600" 
              className="whatsapp-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              <span className="whatsapp-text">Envoyez un message WhatsApp</span>
            </a>
          </div>
        </section>
      </main>
      </div>
    </div>
  );
}

export default App;
