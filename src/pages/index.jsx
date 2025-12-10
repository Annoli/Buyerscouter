import Layout from "./Layout.jsx";

import Home from "./Home";

import PropertyMatch from "./PropertyMatch";

import BuyerDatabase from "./BuyerDatabase";

import BuyerProfile from "./BuyerProfile";

import BuyerSearch from "./BuyerSearch";

import Pricing from "./Pricing";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    PropertyMatch: PropertyMatch,
    
    BuyerDatabase: BuyerDatabase,
    
    BuyerProfile: BuyerProfile,
    
    BuyerSearch: BuyerSearch,
    
    Pricing: Pricing,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/PropertyMatch" element={<PropertyMatch />} />
                
                <Route path="/BuyerDatabase" element={<BuyerDatabase />} />
                
                <Route path="/BuyerProfile" element={<BuyerProfile />} />
                
                <Route path="/BuyerSearch" element={<BuyerSearch />} />
                
                <Route path="/Pricing" element={<Pricing />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}