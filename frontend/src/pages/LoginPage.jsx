import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import NetflixLogo from '../components/NetflixLogo'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('netflix_token')
    if (token) navigate('/dashboard', { replace: true })
  }, [navigate])

  return (
    <div className="login-page">
      {/* Disclaimer Banner */}
      <div className="login-disclaimer">
        ⚠️ <strong>Developer Demo Project:</strong> This is a clone built for portfolio purposes. It is <strong>NOT</strong> affiliated with Netflix. Please do not enter real login credentials.
      </div>

      {/* Background Hero */}
      <div className="login-bg">
        <div className="login-bg__gradient" />
      </div>

      {/* Header */}
      <header className="login-header">
        <div className="login-header__logo">
          <NetflixLogo />
        </div>
      </header>

      {/* Card */}
      <main className="login-main">
        <div className="login-card">
          <h1 className="login-card__title">Sign In</h1>
          <LoginForm />

          <div className="login-card__footer">
            <p className="login-card__remember">
              <input type="checkbox" id="remember-me" defaultChecked />
              <label htmlFor="remember-me">Remember me</label>
            </p>
            <a href="#" className="login-card__help">Need help?</a>
          </div>

          <div className="login-card__signup">
            <span>New to Netflix?</span>
            <a href="#" className="login-card__signup-link"> Sign up now.</a>
          </div>

          <p className="login-card__recaptcha">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
            <a href="#" className="login-card__recaptcha-link">Learn more.</a>
          </p>

          {/* Demo Credentials Box */}
          <div className="login-card__demo-info">
            <div className="login-card__demo-title">
              <span className="login-card__demo-title-icon">🔑</span> Demo Credentials
            </div>
            <div className="login-card__demo-item">
              <span className="login-card__demo-label">User:</span>
              <span className="login-card__demo-val">user@netflix.com / netflix123</span>
            </div>
            <div className="login-card__demo-item">
              <span className="login-card__demo-label">Test:</span>
              <span className="login-card__demo-val">test@test.com / password</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <div className="login-footer__inner">
          <p className="login-footer__contact">Questions? Call 000-800-919-1694</p>
          <nav className="login-footer__links">
            {['FAQ', 'Help Centre', 'Terms of Use', 'Privacy', 'Cookie Preferences', 'Corporate Information'].map(link => (
              <a key={link} href="#" className="login-footer__link">{link}</a>
            ))}
          </nav>
          <div className="login-footer__lang">
            <button className="login-footer__lang-btn">
              <span>🌐</span> English
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
