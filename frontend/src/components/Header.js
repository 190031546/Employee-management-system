import React from "react";

/* REACT BOOTSTRAP */
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

/* REACT ROUTER BOOTSTRAP */
import { LinkContainer } from "react-router-bootstrap";

/* REACT - REDUX */
import { useDispatch, useSelector } from "react-redux";

/* ACTION CREATORS */
import { logout } from "../actions/userActions";

/* COMPONENTS */
import SearchBox from "./SearchBox";

import logo from "../logo.png";

function Header() {
  /* PULLING A PART OF STATE FROM THE ACTUAL STATE IN THE REDUX STORE */
  const userLogin = useSelector((state) => state.userLogin);

  const { userInfo } = userLogin;

  /* HANDLER */
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <h5 style={{ color:'white'}}>Employee Management System</h5>
              {/* <img src={logo} alt="Otaku Shop" /> */}
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="navbarScroll" />

          <Navbar.Collapse id="navbarScroll">
            

            <Nav
              className="ms-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              { <LinkContainer to="/">
                <Nav.Link>
                  <i className="fas fa-home"></i> Home
                </Nav.Link>
              </LinkContainer> }
              { <LinkContainer to="/about">
                <Nav.Link>
                  <i className="fas fa-file"></i> About
                </Nav.Link>
              </LinkContainer> }
              { <LinkContainer to="/contact">
                <Nav.Link>
                  <i className="fa fa-address-book"></i> Contact
                </Nav.Link>
              </LinkContainer> }
              { <LinkContainer to="/services">
                <Nav.Link>
                  <i className="fa fa-thumbs-up"></i> Services
                </Nav.Link>
              </LinkContainer> }

              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                 
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Login
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Project Managers</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Employees</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Projects</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
