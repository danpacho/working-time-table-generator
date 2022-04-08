import "./styles/reset.css";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { Main } from "./components/atoms/layout";

ReactDOM.render(
    <React.StrictMode>
        <Main>
            <App />
        </Main>
    </React.StrictMode>,
    document.getElementById("root")
);
