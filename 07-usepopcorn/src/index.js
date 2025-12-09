import React from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./StarRating";
// import "./index.css";
// import App from "./App";

function Test() {
  const [movieRating, setMovieRating] = React.useState(0);
  return (
    <div>
      <StarRating maxRating={8} color="green" onSetRate={setMovieRating} />
      <p>This movie was rated {movieRating} stars</p>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating
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
    <Test />
  </React.StrictMode>
);
