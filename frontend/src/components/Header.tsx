import React from 'react';
import { Link } from "@reach/router"

import Brain from "../images/brain.svg"

const Header: React.FC = (props) =>
  <div className="navbar navbar-expand navbar-dark bg-dark sticky-top">
    <Link className="navbar-brand" to="/">
    <img src={Brain} width="30" height="30" alt="logo" className="d-inline-block align-top mr-1" loading="lazy" />
      Udacitrivia</Link>
    <div className="navbar-nav">
      <Link getProps={({ isCurrent }) => isCurrent ? { className: "nav-item nav-link active" } : { className: "nav-item nav-link" }} to="/add">Add</Link>
      <Link getProps={({ isCurrent }) => isCurrent ? { className: "nav-item nav-link active" } : { className: "nav-item nav-link" }} to="/play">Play</Link>
    </div>
  </div>

export default Header;
