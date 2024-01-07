import { useState } from 'react'
import classNames from 'classnames/bind'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import style from './App.module.css'
// import './App.css'

const cx = classNames.bind(style)
// const cx = (str: string) => str;

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className={cx('logo')} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          {/* <img src={reactLogo} className={cx('logo react')} alt="React logo" /> */}
          
          <img src={reactLogo} className={cx('logo', 'react')} alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className={cx('card')}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={cx('read-the-docs')}>
        Click on the Vite and React logos to learn more
      </p>
      <p>
        hot reload yes?!?! oh cool! css too?
      </p>
    </>
  )
}

export default App
