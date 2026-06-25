import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NetflixLogo from '../components/NetflixLogo'
import './DashboardPage.css'

// Mock content rows — images from TMDB public CDN
const CONTENT_ROWS = [
  {
    title: 'Continue Watching',
    items: [
      {
        id: 1,
        title: 'Stranger Things',
        genre: 'Sci-Fi • Horror',
        progress: 72,
        color: '#c0392b',
        image: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      },
      {
        id: 2,
        title: 'The Crown',
        genre: 'Drama • History',
        progress: 45,
        color: '#2c3e50',
        image: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg',
      },
      {
        id: 3,
        title: 'Money Heist',
        genre: 'Crime • Thriller',
        progress: 89,
        color: '#8e44ad',
        image: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg',
      },
      {
        id: 4,
        title: 'Squid Game',
        genre: 'Thriller • Drama',
        progress: 30,
        color: '#27ae60',
        image: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
      },
    ],
  },
  {
    title: 'Trending Now',
    items: [
      {
        id: 5,
        title: 'Bridgerton',
        genre: 'Romance • Drama',
        progress: 0,
        color: '#e67e22',
        image: 'https://image.tmdb.org/t/p/w500/luoKpgVwi1E5nQsi7W0UuKHu2Rq.jpg',
      },
      {
        id: 6,
        title: 'Wednesday',
        genre: 'Mystery • Comedy',
        progress: 0,
        color: '#1a1a2e',
        image: 'https://image.tmdb.org/t/p/w500/hTExot1sfn7dHZjGrk0Aiwpntxt.jpg',
      },
      {
        id: 7,
        title: 'Ozark',
        genre: 'Crime • Drama',
        progress: 0,
        color: '#2d6a4f',
        image: 'https://image.tmdb.org/t/p/w500/eSVvx8xys2NuFhl8fevXt41wX7v.jpg',
      },
      {
        id: 8,
        title: 'Dark',
        genre: 'Sci-Fi • Mystery',
        progress: 0,
        color: '#023e8a',
        image: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg',
      },
      {
        id: 9,
        title: 'Narcos',
        genre: 'Crime • Biography',
        progress: 0,
        color: '#6b4226',
        image: 'https://image.tmdb.org/t/p/w500/rTmal9fDbwh5F0waol2hq35U4ah.jpg',
      },
    ],
  },
  {
    title: 'Top Picks For You',
    items: [
      {
        id: 10,
        title: 'Black Mirror',
        genre: 'Sci-Fi • Thriller',
        progress: 0,
        color: '#212121',
        image: 'https://image.tmdb.org/t/p/w500/he609rnU3tiwBjRklKNa4n2jQSd.jpg',
      },
      {
        id: 11,
        title: 'Peaky Blinders',
        genre: 'Crime • Drama',
        progress: 0,
        color: '#6b2737',
        image: 'https://image.tmdb.org/t/p/w500/7sqFEDDmK1hG5m92upolcfQxy7R.jpg',
      },
      {
        id: 12,
        title: 'The Witcher',
        genre: 'Fantasy • Action',
        progress: 0,
        color: '#1b4332',
        image: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
      },
      {
        id: 13,
        title: 'Breaking Bad',
        genre: 'Crime • Drama',
        progress: 0,
        color: '#344e41',
        image: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      },
    ],
  },
]

const GENRES = ['All', 'Movies', 'TV Shows', 'New & Popular', 'My List', 'Browse By Language']

export default function DashboardPage() {
  const navigate  = useNavigate()
  const [user, setUser]           = useState(null)
  const [activeGenre, setActiveGenre] = useState('All')
  const [menuOpen, setMenuOpen]   = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('netflix_user')
    if (raw) setUser(JSON.parse(raw))

    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('netflix_token')
    localStorage.removeItem('netflix_user')
    navigate('/login', { replace: true })
  }

  const AVATAR_COLORS = ['#e50914', '#0071eb', '#e87c03', '#46d369', '#a855f7']
  const avatarColor = user ? AVATAR_COLORS[(user.id - 1) % AVATAR_COLORS.length] : '#e50914'

  return (
    <div className="dashboard">
      {/* ── Navbar ── */}
      <header className={`dash-nav${scrolled ? ' dash-nav--scrolled' : ''}`}>
        <div className="dash-nav__left">
          <NetflixLogo width={130} />
          <nav className="dash-nav__links">
            {GENRES.map((g) => (
              <button
                key={g}
                className={`dash-nav__link${activeGenre === g ? ' dash-nav__link--active' : ''}`}
                onClick={() => setActiveGenre(g)}
              >
                {g}
              </button>
            ))}
          </nav>
        </div>
        <div className="dash-nav__right">
          {/* Search */}
          <button
            id="search-btn"
            className="dash-nav__icon-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
          {/* Bell */}
          <button id="notif-btn" className="dash-nav__icon-btn" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </button>
          {/* Avatar */}
          <div className="dash-nav__profile" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="dash-nav__avatar" style={{ background: avatarColor }}>
              {user?.avatar || 'U'}
            </div>
            <svg className={`dash-nav__chevron${menuOpen ? ' dash-nav__chevron--up' : ''}`} viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
            {menuOpen && (
              <div className="dash-nav__menu">
                <div className="dash-nav__menu-header">
                  <div className="dash-nav__avatar dash-nav__avatar--sm" style={{ background: avatarColor }}>
                    {user?.avatar || 'U'}
                  </div>
                  <div>
                    <p className="dash-nav__menu-name">{user?.name || 'User'}</p>
                    <p className="dash-nav__menu-plan">{user?.plan || 'Standard'} Plan</p>
                  </div>
                </div>
                <hr className="dash-nav__menu-divider" />
                <button className="dash-nav__menu-item">Account</button>
                <button className="dash-nav__menu-item">Help Centre</button>
                <hr className="dash-nav__menu-divider" />
                <button
                  id="sign-out-btn"
                  className="dash-nav__menu-item dash-nav__menu-item--signout"
                  onClick={handleSignOut}
                >
                  Sign out of Netflix
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <section className="dash-hero">
        <div className="dash-hero__bg" />
        <div className="dash-hero__content">
          <div className="dash-hero__badge">🔥 #1 in India Today</div>
          <h1 className="dash-hero__title">Stranger Things</h1>
          <p className="dash-hero__meta">
            <span className="dash-hero__match">97% Match</span>
            <span>2022</span>
            <span className="dash-hero__rating">TV-14</span>
            <span>4 Seasons</span>
            <span className="dash-hero__hd">HD</span>
          </p>
          <p className="dash-hero__desc">
            When a young boy vanishes, a small town uncovers a mystery involving secret experiments,
            terrifying supernatural forces and one strange little girl.
          </p>
          <div className="dash-hero__actions">
            <button id="play-btn" className="dash-hero__btn dash-hero__btn--play">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play
            </button>
            <button id="more-info-btn" className="dash-hero__btn dash-hero__btn--info">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              More Info
            </button>
          </div>
        </div>
        <div className="dash-hero__fade" />
      </section>

      {/* ── Welcome Toast ── */}
      {user && (
        <div className="dash-toast">
          👋 Welcome back, <strong>{user.name}</strong>!
        </div>
      )}

      {/* ── Content Rows ── */}
      <section className="dash-content">
        {CONTENT_ROWS.map((row) => (
          <div key={row.title} className="dash-row">
            <h2 className="dash-row__title">{row.title}</h2>
            <div className="dash-row__scroller">
              {row.items.map((item) => (
                <div key={item.id} className="dash-card">
                  <div
                    className="dash-card__thumb"
                    style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="dash-card__img"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    )}
                    <div className="dash-card__overlay">
                      <button className="dash-card__play">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                    </div>
                    {item.progress > 0 && (
                      <div className="dash-card__progress-bar">
                        <div className="dash-card__progress-fill" style={{ width: `${item.progress}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="dash-card__info">
                    <p className="dash-card__name">{item.title}</p>
                    <p className="dash-card__genre">{item.genre}</p>
                    {item.progress > 0 && (
                      <p className="dash-card__progress-text">{item.progress}% watched</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── Footer ── */}
      <footer className="dash-footer">
        <p>Questions? Call 000-800-919-1694</p>
        <p style={{ marginTop: 12, opacity: 0.5, fontSize: '0.8125rem' }}>
          © 2024 Netflix Clone — Built for demo purposes
        </p>
      </footer>
    </div>
  )
}
