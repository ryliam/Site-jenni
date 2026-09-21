import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Sparkles, MessageCircle, ArrowRight, Gift, Award, CheckCircle2 } from 'lucide-react';
import PetalExplosion from './PetalExplosion';

function App() {
  const [hoveredId, setHoveredId] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTheme, setActiveTheme] = useState('theme-hero');

  // ONE-TIME 3D FLOWER EXPLOSION STATE
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [hasExploded, setHasExploded] = useState(false);
  const [explosionOrigin, setExplosionOrigin] = useState({ x: 0.28, y: 0.65 });

  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const videoRef3 = useRef(null);
  const heroBouquetRef = useRef(null);

  // Video hover controls
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

  // Trigger one-time explosion sequence
  const triggerOneTimeExplosion = useCallback(() => {
    if (hasTriggered) return; // ONLY ONCE!
    setHasTriggered(true);

    // Compute exact center of the bouquet element in viewport
    if (heroBouquetRef.current) {
      const rect = heroBouquetRef.current.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;
      setExplosionOrigin({ x: originX, y: originY });
    }

    // Step 1: Bouquet expands smoothly in 3D (0 to 650ms)
    setIsExpanding(true);

    // Step 2: Bouquet reaches max scale and explodes into petals (at 650ms)
    setTimeout(() => {
      setHasExploded(true);
      setIsExpanding(false);
    }, 650);
  }, [hasTriggered]);

  // Scroll listener: dynamic background colors & ONE-TIME explosion trigger
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);

      // Trigger the 3D flower explosion JUST ONCE on first scroll
      if (!hasTriggered && y > 40) {
        triggerOneTimeExplosion();
      }

      // Dynamically determine theme based on scroll position
      if (y < 450) {
        setActiveTheme('theme-hero');
      } else if (y >= 450 && y < 1050) {
        setActiveTheme('theme-info');
      } else if (y >= 1050 && y < 1850) {
        setActiveTheme('theme-menu');
      } else if (y >= 1850 && y < 2700) {
        setActiveTheme('theme-videos');
      } else if (y >= 2700 && y < 3500) {
        setActiveTheme('theme-bouquets');
      } else {
        setActiveTheme('theme-contact');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasTriggered, triggerOneTimeExplosion]);

  // Mouse move for subtle 3D parallax tilt in the hero
  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // WhatsApp Icon Component
  const WhatsAppIcon = () => (
    <svg 
      className="whatsapp-icon" 
      viewBox="0 0 24 24" 
      width="20" 
      height="20" 
      fill="currentColor"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.436 0 9.86-4.426 9.864-9.864.002-2.63-1.023-5.102-2.886-6.968C16.38 1.907 13.91 .882 11.278.882c-5.44 0-9.863 4.429-9.866 9.872-.001 1.562.415 3.09 1.202 4.424l-.992 3.628 3.71-.973zm11.587-6.85c-.326-.164-1.93-.953-2.229-1.062-.299-.109-.517-.164-.734.164-.218.327-.844 1.062-1.034 1.28-.19.218-.38.245-.706.081-1.127-.565-2.203-1.11-3.07-2.614-.232-.401.232-.372.662-1.23.076-.153.038-.287-.019-.396-.057-.109-.517-1.247-.707-1.706-.186-.447-.376-.386-.517-.393-.134-.007-.287-.008-.44-.008-.153 0-.403.057-.613.287-.21.23-.803.784-.803 1.91 0 1.127.82 2.215.933 2.37.113.153 1.614 2.464 3.91 3.455 1.92.83 2.69.75 3.65.61.545-.08 1.93-.79 2.202-1.556.272-.764.272-1.417.19-1.555-.081-.137-.299-.219-.625-.383z"/>
    </svg>
  );

  return (
    <div className={`site-wrapper ${activeTheme}`}>
      {/* 3D Petal Explosion Canvas (Triggers ONLY ONCE) */}
      <PetalExplosion isTriggered={hasExploded} origin={explosionOrigin} />

      {/* Navigation Bar */}
      <nav className={`navbar ${scrollY > 50 ? 'navbar-scrolled' : ''}`}>
        <div className="nav-brand-group">
          <a href="#" className="nav-logo">
            <span className="logo-badge">FK</span>
            <div className="logo-texts">
              <span className="logo-main">FK EVENT</span>
              <span className="logo-sub">Art de Recevoir & Événements</span>
            </div>
          </a>
        </div>

        <ul className="nav-links">
          <li><a href="#services">Prestations</a></li>
          <li><a href="#menu">Notre Menu</a></li>
          <li><a href="#galerie">Vidéos</a></li>
          <li><a href="#bouquets">Bouquets & Partage</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <div className="nav-actions">
          <a 
            href="https://wa.me/33665604600?text=Bonjour%20FK%20EVENT,%20je%20souhaite%20des%20renseignements%20pour%20un%20événement."
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta-btn"
          >
            <WhatsAppIcon />
            <span>Devis Express</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="hero-section"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <div className="hero-left">
          <div className="hero-left-content">
            <div className="hero-pill-tag">
              <Sparkles size={14} className="pill-icon" />
              <span>MARIAGES · BAPTÊMES · BRUNCHS · SOIRÉES</span>
            </div>

            <h1 className="hero-title">
              L'Art de Recevoir<br/>
              <span className="hero-title-accent">Sur-Mesure</span>
            </h1>

            <p className="hero-subtitle">
              LE PARTENAIRE D’EXCEPTION DE TOUS VOS ÉVÉNEMENTS
            </p>

            {/* Action Buttons */}
            <div className="hero-actions-row">
              <a href="#services" className="hero-cta-primary">
                <span>Découvrir l'univers</span>
                <ArrowRight size={16} />
              </a>
              <a href="#bouquets" className="hero-cta-secondary">
                <Gift size={16} />
                <span>Nos Bouquets Cadeaux</span>
              </a>
            </div>
          </div>

          {/* 3D Interactive Flower Bouquet - Positioned at bottom corner as circled by user */}
          <div className="hero-bottom-bouquet">
            <div 
              ref={heroBouquetRef}
              className={`hero-bouquet-3d-wrapper ${isExpanding ? 'is-expanding' : ''} ${hasExploded ? 'is-exploded' : ''}`}
              style={{
                transform: `perspective(1000px) rotateX(${mousePos.y * 16}deg) rotateY(${mousePos.x * -16}deg)`,
              }}
              onClick={triggerOneTimeExplosion}
              title={!hasTriggered ? "Cliquez ou scrollez pour faire éclore les pétales !" : ""}
            >
              {!hasExploded ? (
                <div className="bouquet-interactive-card">
                  <div className="bouquet-aura-glow"></div>
                  <img 
                    src="/bouquet-rouge.png" 
                    alt="Bouquet de Roses Rouges Prestige" 
                    className="hero-bouquet-img" 
                  />
                  
                </div>
              ) : (
                <div className="bouquet-settled-badge">
                  <Sparkles size={14} className="settled-icon" />
                  <span>Pétales déployés</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-media-container">
            <video 
              src="/video1.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="hero-video"
            />
            <div className="hero-video-gradient-overlay"></div>
            <div className="hero-video-badge">
              <Award size={16} />
              <span>Scénographie & Haute Gastronomie</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="app-content">
        <div className="app-container">

          {/* Menu Section with Circular Bubbles */}
          <section id="menu" className="menu-section">
            <div className="section-header-badge">
              <span>DÉLICES & SAVEURS</span>
            </div>
            <h2 className="section-title">Notre Menu Événementiel</h2>
            <p className="section-subtitle">
              Des créations authentiques préparées avec passion pour émerveiller le palais de vos convives.
            </p>

            <div className="menu-grid">
              <div className="menu-card">
                <div className="menu-bubble-wrapper">
                  <div className="menu-bubble-ring"></div>
                  <img src="/menu1.jpg" alt="Okok Traditionnel" className="menu-image" />
                  <span className="menu-badge">Tradition</span>
                </div>
                <div className="menu-card-info">
                  <h3 className="menu-card-title">Okok Traditionnel</h3>
                  <p className="menu-card-desc">Feuilles d'okok braisées aux arachides, accompagnées de bâtons de manioc vapeur.</p>
                </div>
              </div>
              
              <div className="menu-card">
                <div className="menu-bubble-wrapper">
                  <div className="menu-bubble-ring"></div>
                  <img src="/menu2.webp" alt="Ndolé aux Crevettes et Plantains" className="menu-image" />
                  <span className="menu-badge star">Incontournable</span>
                </div>
                <div className="menu-card-info">
                  <h3 className="menu-card-title">Ndolé aux Crevettes</h3>
                  <p className="menu-card-desc">Ndolé onctueux garni de crevettes tigrées dorées, plantains mûrs frits et bobolo.</p>
                </div>
              </div>

              <div className="menu-card">
                <div className="menu-bubble-wrapper">
                  <div className="menu-bubble-ring"></div>
                  <img src="/menu3.jpg" alt="Eru & Waterfufu" className="menu-image" />
                  <span className="menu-badge">Prestige</span>
                </div>
                <div className="menu-card-info">
                  <h3 className="menu-card-title">Eru & Waterfufu</h3>
                  <p className="menu-card-desc">Légumes eru fondants cuisinés à l'huile de palme pure avec fufu de maïs/manioc savoureux.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Informative Art de Recevoir Section */}
          <section id="services" className="info-section">
            <div className="section-header-badge">
              <span>EXPÉRIENCE SIGNATURE</span>
            </div>
            <h2 className="section-title">L’ART DE RECEVOIR SUR-MESURE</h2>
            
            <div className="info-cards-grid">
              <div className="info-card-text">
                <p className="info-paragraph lead">
                  Donnez une dimension inoubliable à chacun de vos événements. Nous orchestrons vos plus beaux moments qu’il s’agisse d’un mariage élégant, d’un baptême chaleureux, d’un brunch convivial ou d’une soirée festive entre amis en combinant haute gastronomie et scénographie raffinée.
                </p>
                <p className="info-paragraph">
                  Chaque réception est conçue comme une expérience unique : des classiques de la cuisine événementielle aux menus personnalisés intégrant, selon vos envies, les saveurs authentiques et revisitées de la gastronomie africaine. De l’art de la table à l’ambiance visuelle complète, nous créons une atmosphère sur-mesure pour que vous profitiez pleinement de vos invités.
                </p>
              </div>

              <div className="info-card-highlights">
                <div className="highlight-item">
                  <CheckCircle2 size={20} className="highlight-icon" />
                  <div>
                    <h4>Scénographie Complète</h4>
                    <p>Décoration florale, art de la table et mise en lumière féerique.</p>
                  </div>
                </div>

                <div className="highlight-item">
                  <CheckCircle2 size={20} className="highlight-icon" />
                  <div>
                    <h4>Gastronomie Métissée</h4>
                    <p>Mariage harmonieux de cuisine du monde et saveurs africaines revisitées.</p>
                  </div>
                </div>

                <div className="highlight-item">
                  <CheckCircle2 size={20} className="highlight-icon" />
                  <div>
                    <h4>Service Clé en Main</h4>
                    <p>Coordination de A à Z pour une tranquillité totale le jour J.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          

          {/* Hover-Expanding Video Cards Grid */}
          <section id="galerie" className="videos-section">
            <div className="section-header-badge dark">
              <span>IMMERSION VISUELLE</span>
            </div>
            <h2 className="section-title light">Moments d'Exception en Vidéo</h2>
            <p className="section-subtitle light">
              Survolez une carte vidéo pour l'agrandir et vivre l'ambiance comme si vous y étiez.
            </p>

            <div className={`cards-grid ${hoveredId !== null ? 'has-hovered' : ''}`}>
              {/* Card 1 */}
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
              
              {/* Card 2 */}
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

              {/* Card 3 */}
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
            </div>
          </section>

          {/* Bouquet Sharing Section */}
          <section id="bouquets" className="sharing-section">
            <div className="section-header-badge">
              <span>ATTENTION DÉLICATE & SURPRISE</span>
            </div>
            <h2 className="section-title">PARTAGER ENSEMBLE</h2>
            <div className="info-text-block center">
              <p>
                Offrez un moment d’émotion unique grâce à notre service exclusif de bouquets personnalisés. Faites plaisir à vos invités ou à la personne célébrée avec nos trois créations prestigieuses :
              </p>
            </div>
            
            <div className="bouquet-grid">
              {/* Bouquet Chocolats */}
              <div className="bouquet-card">
                <div className="bouquet-card-image-wrapper">
                  <div className="bouquet-card-image" style={{ backgroundImage: "url('/chocolat.jpg')" }}></div>
                  <span className="bouquet-badge-pill">Gourmandise</span>
                </div>
                <div className="bouquet-card-info">
                  <h3 className="bouquet-card-title">Bouquet de Chocolats</h3>
                  <p className="bouquet-card-desc">
                    Sélection exquise de chocolats fins et confiseries d'exception, assemblés artistiquement en gerbe florale.
                  </p>
                  <a 
                    href="https://wa.me/33665604600?text=Bonjour,%20je%20souhaite%20commander%20un%20Bouquet%20de%20Chocolats."
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bouquet-order-btn"
                  >
                    <span>Commander ce bouquet</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
              
              {/* Bouquet Fleurs */}
              <div className="bouquet-card">
                <div className="bouquet-card-image-wrapper">
                  <div className="bouquet-card-image" style={{ backgroundImage: "url('/bouquet-rouge.png')" }}></div>
                  <span className="bouquet-badge-pill rose">Prestige</span>
                </div>
                <div className="bouquet-card-info">
                  <h3 className="bouquet-card-title">Bouquet de Roses Rouges</h3>
                  <p className="bouquet-card-desc">
                    Roses fraîches veloutées rouge passion sélectionnées à la main, présentées dans un habillage haute couture.
                  </p>
                  <a 
                    href="https://wa.me/33665604600?text=Bonjour,%20je%20souhaite%20commander%20un%20Bouquet%20de%20Roses%20Rouges."
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bouquet-order-btn"
                  >
                    <span>Commander ce bouquet</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
              
              {/* Bouquet d'Argent - Billets de 10 Euros */}
              <div className="bouquet-card highlight-card">
                <div className="bouquet-card-image-wrapper">
                  <div className="bouquet-card-image" style={{ backgroundImage: "url('/argent-10euros.jpg')" }}></div>
                  <span className="bouquet-badge-pill gold">Nouveauté Billets 10€</span>
                </div>
                <div className="bouquet-card-info">
                  <div className="bouquet-special-tag">
                    <Sparkles size={13} />
                    <span>Création Exclusive</span>
                  </div>
                  <h3 className="bouquet-card-title">Bouquet d’Argent (Billets de 10€)</h3>
                  <p className="bouquet-card-desc">
                    Véritables billets de 10€ pliés minutieusement en origami floral, délicatement parsemés de gypsophile et d’accents dorés.
                  </p>
                  <a 
                    href="https://wa.me/33665604600?text=Bonjour,%20je%20souhaite%20commander%20un%20Bouquet%20d%27Argent%20avec%20billets%20de%2010%20euros."
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bouquet-order-btn gold-btn"
                  >
                    <span>Personnaliser le montant</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="contact-section">
            <div className="contact-card-box">
              <div className="contact-badge">
                <MessageCircle size={15} />
                <span>RÉPONSE EN MOINS DE 2H</span>
              </div>
              <h2 className="contact-title">Donnons vie à votre prochain événement</h2>
              <p className="contact-subtitle">
                Discutons ensemble de vos envies de scénographie, de votre menu personnalisé ou de votre commande de bouquet.
              </p>

              <div className="contact-actions">
                <a 
                  href="https://wa.me/33665604600?text=Bonjour%20FK%20EVENT,%20je%20souhaite%20organiser%20un%20événement." 
                  className="whatsapp-btn-pulse"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  <span className="whatsapp-text">Contacter sur WhatsApp (+33 6 65 60 46 00)</span>
                </a>
              </div>

              <div className="contact-perks-row">
                <div className="perk-item">
                  <CheckCircle2 size={16} className="perk-icon" />
                  <span>Devis gratuit et sans engagement</span>
                </div>
                <div className="perk-item">
                  <CheckCircle2 size={16} className="perk-icon" />
                  <span>Dégustation préalable sur demande</span>
                </div>
                <div className="perk-item">
                  <CheckCircle2 size={16} className="perk-icon" />
                  <span>Livraison & installation soignées</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-col-main">
            <span className="footer-brand">FK EVENT</span>
            <p className="footer-desc">
              Haute gastronomie événementielle, scénographie florale et art de recevoir sur-mesure.
            </p>
          </div>
          <div className="footer-col-contact">
            <p className="footer-phone">+33 6 65 60 46 00</p>
            <p className="footer-loc">Île-de-France & Rayonnement National</p>
            <p className="footer-copy">© {new Date().getFullYear()} FK EVENT. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
