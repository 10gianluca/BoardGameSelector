import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FetchCSVData from "./FetchCSVData.js";

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/about" element={<FetchCSVData columnName="GAME " />} />
            </Routes>
        </Router>

    );
}


export default App;
