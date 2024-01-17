import React from 'react';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames/bind';
import butcher from '@src/assets/butcher.png';
import styles from './Navigation.module.css';

const cx = classnames.bind(styles);

interface CustomNavLinkProps {
  to: string;
  children: React.ReactNode;
}

function TabLink({ to, children }: CustomNavLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive, isPending }) => cx(styles.navLink, { [styles.active]: isActive, [styles.pending]: isPending })}
    >
      {children}
    </NavLink>
  );
}

export default function Navigation() {
  return (
    <header className={styles.siteHeader}>
      <nav className={styles.nav}>
        <div className={styles.titleContainer}>
          <div className={styles.icon}>
            <img src={butcher} alt="Butcher" className={styles.logo} />
          </div>
          <div className={styles.title}>Item Butcher</div>
        </div>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <TabLink to="/vault">Vault</TabLink>
          </li>
          <li className={styles.navItem}>
            <TabLink to="/aspects">Aspects</TabLink>
          </li>
          <li className={styles.navItem}>
            <TabLink to="/test">Test</TabLink>
          </li>
        </ul>
        <div className={styles.filler} />
        <div className={styles.version}>v0.0.1.b7</div>
      </nav>
    </header>
  );
}
