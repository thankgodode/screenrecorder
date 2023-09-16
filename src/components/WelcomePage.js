import { useState, useEffect } from "react";

import logo from "../images/LogoRec.png";
import bgImage from "../images/bg.png";
import MainPage from "./MainPage.js";

export default function WelcomePage() {
  const [nextPage, setNextPage] = useState(false);

  if (nextPage) return <MainPage />;

  const handleChangePage = () => setNextPage(true);

  return (
    <figure className="welcome-page">
      <img src={logo} style={{ width: "200px" }} alt="Logo" />
      <label>DEasy Rec</label>
      <button className="getStarted" onClick={() => handleChangePage()}>
        Get Started
      </button>
      <img src={bgImage} alt="background" className="bgImage1" />
      <img src={bgImage} alt="background" className="bgImage2" />
    </figure>
  );
}
