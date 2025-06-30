import React from 'react'

const Header = () => {
  return (
    <div className="header-nav">
      <div className="header-title">
        <span className="logo">
          <img src="/favicon.ico" alt="logo" className="logo-img" />
        </span>
        <h1>AFM - Agent Flavored Markdown</h1>
      </div>
      <div className="header-links">
        <a href="http://localhost:8080/" className="header-link">Home</a>
        <a href="http://localhost:8080/specification/" className="header-link">Specification</a>
        <a href="#" className="header-link active">Try It!</a>
        <a href="http://localhost:8080/hasithaa/afm" className="header-link">GitHub</a>
      </div>
    </div>
  )
}

export default Header
