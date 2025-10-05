import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import { Flex, Typography } from "antd";

import Details from './details';
import Error from "./error"
import Gallery from './gallery';
import List from "./list"

import style from './App.module.scss';

const { Title } = Typography;

function App() {
  return (
    <Router>
      <Flex gap="middle" align="center" vertical>
        <div className={style.header}>
          <Title>
            <span className={style.logo}>TMDB Popular Movie Directory</span>
          </Title>
          <Flex gap="middle" align="center" justify='center'>
            <div className={style.link}>
              <Title level={4}>
                <Link to="/">Search</Link>
              </Title>
            </div>
            <div className={style.link}>
              <Title level={4}>
                <Link to="/details">Gallery</Link>
              </Title>
            </div>
          </Flex>
        </div>
        <div className={style.body}>
          <Routes>
            <Route path="/details" element={<Details />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/" element={<List />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </div>
      </Flex>
    </Router>
  );
}

export default App;
