import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames/bind';

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import style from './App.module.css';

const cx = classNames.bind(style);

function App() {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'es' : 'en';
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className={cx('logo')} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className={cx('logo', 'react')} alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className={cx('card')}>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={cx('read-the-docs')}>Click on the Vite and React logos to learn more</p>
      <h3>
        Our Translated Header:
        <br />
        {t('hello')}
      </h3>
      <h4>Current Language: {currentLanguage}</h4>
      <button type="button" onClick={handleChangeLanguage}>
        Change Language
      </button>
    </>
  );
}

export default App;
