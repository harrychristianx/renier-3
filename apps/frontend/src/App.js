import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { PropertiesPage } from "./pages/PropertiesPage";
import { PropertyDetailPage } from "./pages/PropertyDetailPage";
export default function App() {
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx("main", { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/properties", element: _jsx(PropertiesPage, {}) }), _jsx(Route, { path: "/properties/:slug", element: _jsx(PropertyDetailPage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) })] }));
}
