import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import './App.css';
import Details from './details';
import Gallery from './gallery';
import List from "./list"


function App() {
  return (
    <Router>
      <div>
        <nav>
          TODO
        </nav>

        <Routes>
          <Route path="/details" element={<Details />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/list" element={<List />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
