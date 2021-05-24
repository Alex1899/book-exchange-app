import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Person, BoxArrowRight } from "react-bootstrap-icons";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import { useStateValue } from "../../contexts/auth.context";
import "./header.styles.scss";

const Header = () => {
  const [active, setActive] = useState("");
  const authContext = useStateValue();
  const history = useHistory();

  const handleClick = (e) => {
    const clicked = e.target.id;
    setActive(clicked);
  };

  return (
    <Navbar collapseOnSelect expand="md" bg="light" variant="light">
      <Navbar.Brand href="/">
        <img
          style={{ width: 150, marginRight: 50 }}
          src="/assets/logo.png"
          alt="University of Southampton"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Link
            id="home"
            className={`link ${active === "home" && "active"}`}
            to="/"
            onClick={handleClick}
          >
            Home
          </Link>
          <Link
            id="search"
            className={`link ${active === "search" && "active"}`}
            to="/search"
            onClick={handleClick}
          >
            Search
          </Link>
          <Link
            id="list-book"
            className={`link ${active === "list-book" && "active"}`}
            to="/list-book"
            onClick={handleClick}
          >
            List Book
          </Link>
        </Nav>
        <Nav>
          {authContext.isAuthenticated() ? (
            <NavDropdown
              title={`Hello, ${authContext.userInfo.username}`}
              id="collasible-nav-dropdown"
              className="mr-5"
            >
              <NavDropdown.Item
                className="d-flex align-items-center"
                onClick={() => {
                  setActive("");
                  history.push("/profile");
                }}
              >
                <Person className="mr-2" />
                My Account
              </NavDropdown.Item>
              <NavDropdown.Item
                className="d-flex align-items-center"
                onClick={() => authContext.logout()}
              >
                <BoxArrowRight className="mr-2" />
                Sign Out
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Link className="link" to="/signin">
              Sign In
            </Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>

  
  );
};

export default Header;
