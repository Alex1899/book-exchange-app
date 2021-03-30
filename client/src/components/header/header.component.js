import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Person, BoxArrowRight } from "react-bootstrap-icons";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { useStateValue } from "../../contexts/state.provider";
import { ACTION } from "../../reducer/action-types/action-types";
import "./header.styles.scss";

const Header = () => {
  const [active, setActive] = useState("");
  const {
    state: { currentUser },
    dispatch,
  } = useStateValue();
  const history = useHistory();

  const handleClick = (e) => {
    const clicked = e.target.id;

    setActive(clicked);
  };

  return (
    <nav className="header d-flex align-items-center ml-4">
      <Link to="/" onClick={() => setActive("home")}>
        <img
          style={{ width: 150, marginRight: 50 }}
          src="/assets/logo.png"
          alt="University of Southampton"
        />
      </Link>

      <div className="d-flex">
        <Link
          id="home"
          onClick={handleClick}
          className={`link ${active === "home" && "active"}`}
          to="/"
        >
          Home
        </Link>
        <Link
          id="search"
          onClick={handleClick}
          className={`link ${active === "search" && "active"}`}
          to="/search"
        >
          Search
        </Link>
        <Link
          id="list-books"
          onClick={handleClick}
          className={`link ${active === "list-books" && "active"}`}
          to="/list-book"
        >
          List Books
        </Link>
      </div>
      {currentUser ? (
        <div className="d-flex ml-auto">
          <DropdownButton variant="" title={`Hello, ${currentUser.username}`}>
            {/* <Dropdown.ItemText>Dropdown item text</Dropdown.ItemText> */}
            <Dropdown.Item
              as="button"
              className="d-flex align-items-center"
              onClick={() => {
                setActive("");
                history.push("/profile");
              }}
            >
              <Person className="mr-2" />
              My Account
            </Dropdown.Item>
            <Dropdown.Item
              as="button"
              className="d-flex align-items-center"
              onClick={() => dispatch({ type: ACTION.LOGOUT_USER })}
            >
              <BoxArrowRight className="mr-2" />
              Sign Out
            </Dropdown.Item>
          </DropdownButton>
        </div>
      ) : (
        <Link className="link ml-auto" to="/signin">
          Sign In
        </Link>
      )}
    </nav>
  );
};

export default Header;
