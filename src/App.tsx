import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import { Flex, Typography } from "antd";

import Details from './details';
import Error, { ERROR_NOT_FOUND } from "./common/Error"
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
          <Flex gap="middle" align="center" justify='center' className={style.nav}>
            <div className={style.item}>
              <Title level={4}>
                <Link to="/">Search</Link>
              </Title>
            </div>
            <div className={style.item}>
              <Title level={4}>
                <Link to="/gallery">Gallery</Link>
              </Title>
            </div>
          </Flex>
        </div>
        <div className={style.body}>
          <Routes>
            <Route path="/details/:id" element={<Details />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/" element={<List />} />
            <Route path="*" element={<Error msg={ERROR_NOT_FOUND} />} />
          </Routes>
        </div>
      </Flex>
    </Router>
  );
}

export default App;
