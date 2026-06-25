import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './LoginForm.css'

// Validation helpers
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.trim()) return 'Please enter your email or phone number.'
  if (!re.test(email)) return 'Please enter a valid email address.'
  return ''
}

const validatePassword = (password) => {
  if (!password) return 'Your password must contain between 4 and 60 characters.'
  if (password.length < 4) return 'Your password must contain between 4 and 60 characters.'
  return ''
}

export default function LoginForm() {
  const navigate = useNavigate()

  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [emailError, setEmailError] = useState('')
  const [pwError, setPwError]       = useState('')
  const [apiError, setApiError]     = useState('')
  const [isLoading, setIsLoading]   = useState(false)
  const [showPw, setShowPw]         = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [pwFocused, setPwFocused]   = useState(false)
  const [shake, setShake]           = useState(false)

  const emailRef = useRef(null)
  const pwRef    = useRef(null)

  // Clear API error on any field change
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (apiError) setApiError('')
    if (emailError) setEmailError('')
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (apiError) setApiError('')
    if (pwError) setPwError('')
  }

  // Blur-time validation
  const handleEmailBlur = () => {
    setEmailFocused(false)
    setEmailError(validateEmail(email))
  }

  const handlePasswordBlur = () => {
    setPwFocused(false)
    setPwError(validatePassword(password))
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const eErr = validateEmail(email)
    const pErr = validatePassword(password)
    setEmailError(eErr)
    setPwError(pErr)

    if (eErr || pErr) {
      triggerShake()
      if (eErr) emailRef.current?.focus()
      else      pwRef.current?.focus()
      return
    }

    setIsLoading(true)
    setApiError('')

    try {
      const baseURL = import.meta.env.VITE_API_URL || ''
      const { data } = await axios.post(`${baseURL}/api/auth/login`, { email, password })

      if (data.success) {
        // Store token and user info
        localStorage.setItem('netflix_token', data.token)
        localStorage.setItem('netflix_user', JSON.stringify(data.user))
        // Navigate to dashboard
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      triggerShake()
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.'
      setApiError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const hasEmailValue = email.length > 0
  const hasPwValue    = password.length > 0

  return (
    <form
      id="login-form"
      className={`login-form${shake ? ' login-form--shake' : ''}`}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* API Error Banner */}
      {apiError && (
        <div className="login-form__error-banner" role="alert">
          <svg className="login-form__error-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {apiError}
        </div>
      )}

      {/* Email Field */}
      <div className={`login-form__field${emailError ? ' login-form__field--error' : ''}${emailFocused || hasEmailValue ? ' login-form__field--active' : ''}`}>
        <input
          ref={emailRef}
          id="email"
          type="email"
          className="login-form__input"
          value={email}
          onChange={handleEmailChange}
          onFocus={() => setEmailFocused(true)}
          onBlur={handleEmailBlur}
          autoComplete="email"
          autoCapitalize="none"
          spellCheck="false"
          required
        />
        <label htmlFor="email" className="login-form__label">
          Email or phone number
        </label>
        {emailError && (
          <span className="login-form__field-error" role="alert">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {emailError}
          </span>
        )}
      </div>

      {/* Password Field */}
      <div className={`login-form__field login-form__field--password${pwError ? ' login-form__field--error' : ''}${pwFocused || hasPwValue ? ' login-form__field--active' : ''}`}>
        <input
          ref={pwRef}
          id="password"
          type={showPw ? 'text' : 'password'}
          className="login-form__input"
          value={password}
          onChange={handlePasswordChange}
          onFocus={() => setPwFocused(true)}
          onBlur={handlePasswordBlur}
          autoComplete="current-password"
          required
        />
        <label htmlFor="password" className="login-form__label">
          Password
        </label>
        {hasPwValue && (
          <button
            type="button"
            id="toggle-password"
            className="login-form__pw-toggle"
            onClick={() => setShowPw(!showPw)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? 'HIDE' : 'SHOW'}
          </button>
        )}
        {pwError && (
          <span className="login-form__field-error" role="alert">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {pwError}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        id="sign-in-btn"
        type="submit"
        className="login-form__submit"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <span className="login-form__spinner" />
        ) : (
          'Sign In'
        )}
      </button>

      {/* OR divider */}
      <div className="login-form__or">
        <span className="login-form__or-line" />
        <span className="login-form__or-text">OR</span>
        <span className="login-form__or-line" />
      </div>

      {/* Use code button */}
      <button type="button" id="use-code-btn" className="login-form__code-btn">
        Use a sign-in code
      </button>

      {/* Forgot password */}
      <a href="#" className="login-form__forgot">Forgot password?</a>


    </form>
  )
}
