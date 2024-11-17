import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
// import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import Auth from '../utils/auth';

const AppNavbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            BananaFlix
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar" className="d-flex flex-row-reverse">
            <Nav className="ml-auto d-flex">
              <Nav.Link as={Link} to="/SearchMovies">
                Search For Movies
              </Nav.Link>
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to="/Profile">
                    Profile
                  </Nav.Link>
                  <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link onClick={() => setShowLoginModal(true)}>Login</Nav.Link>
                  <Nav.Link onClick={() => setShowSignupModal(true)}>Sign Up</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Modal */}
      <Modal
        size="lg"
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        aria-labelledby="login-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="login-modal">Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginForm handleModalClose={() => setShowLoginModal(false)} />
        </Modal.Body>
      </Modal>

      {/* Signup Modal */}
      <Modal
        size="lg"
        show={showSignupModal}
        onHide={() => setShowSignupModal(false)}
        aria-labelledby="signup-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="signup-modal">Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SignupForm handleModalClose={() => setShowSignupModal(false)} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppNavbar;
