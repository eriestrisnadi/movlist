import React from "react";
import "./App.scss";
import { Nav } from "react-bootstrap";
import { Outlet, useLocation, Link } from "react-router-dom";

function App() {
  const { pathname } = useLocation();

  return (
    <div className="App">
      <div className="container mt-5">
        <Nav variant="tabs" activeKey={pathname || "/"} className="mb-3">
          <Nav.Item>
            <Nav.Link to="/" as={Link} eventKey="/">
              Movie Search
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link to="/favorites" as={Link} eventKey="/favorites">
              My Favorites
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
