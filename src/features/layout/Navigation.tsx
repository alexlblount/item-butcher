import React from 'react';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames/bind';
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
    <nav className={styles.nav}>
      <div className={styles.siteTitle}>Item Butcher</div>
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
    </nav>
  );
}
