// src/components/Layout.jsx
import React from 'react';
import { PRIMARY_COLOR, WHITE } from '../theme';

const Header = () => (
    <header style={{ backgroundColor: PRIMARY_COLOR, color: WHITE, padding: '15px 20px', fontSize: '1.5em', fontWeight: 'bold' }}>
        Admin Dashboard
    </header>
);

const Container = ({ children }) => (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
    </div>
);

const Layout = ({ children }) => (
    <div>
        <Header />
        <Container>
            {children}
        </Container>
    </div>
);

export default Layout;