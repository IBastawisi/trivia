import React from 'react';
import { Link } from "@reach/router"

import '../stylesheets/Header.css';

const Header: React.FC = (props) =>
  <div className="App-header">
    <Link to="/">Udacitrivia</Link>
    <Link to="">List</Link>
    <Link to="/add">Add</Link>
    <Link to="/play">Play</Link>
  </div>

export default Header;
