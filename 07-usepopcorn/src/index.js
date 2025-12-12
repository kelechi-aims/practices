import React from "react";
import ReactDOM from "react-dom/client";
// import StarRating from "./StarRating";
// import TextExpanderComp from "./TextExpander";
import "./style.css";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />

    {/* <StarRating
      maxRating={7}
      messages={[
        "Terrible",
        "Bad",
        "Poor",
        "Okay",
        "Good",
        "Better",
        "Amazing",
      ]}
    />
    <StarRating
      color="red"
      size={24}
      maxRating={10}
      className="test"
      defaultRating={3}
    />
    <Test /> */}

    {/* <TextExpanderComp /> */}
  </React.StrictMode>
);
