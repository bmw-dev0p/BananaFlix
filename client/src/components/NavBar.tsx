// import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import Auth from '../utils/auth';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';

const AppNavbar = ({
  //Properties needed to be passed in for Modal
  showModal,
  setShowModal,
  activeTab,
  setActiveTab,
}: {
  //Typescript for the properties above
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">BananaFlix</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav" role="navigation" className='flex-grow-0'>
            <Nav className="ml-auto d-flex align-items-end">
              <Nav.Link as={Link} to="/search">Search For Movies</Nav.Link>
              <Nav.Link as={Link} to="/trending">Trending</Nav.Link>
              {/* If user is logged in, show saved movies and logout, else show login/signup */}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to="/lists-next-seen">MyFlix</Nav.Link>
                  <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link onClick={() => setShowModal(true)}>Login</Nav.Link>
                  <Nav.Link onClick={() => setShowModal(true)}>Sign Up</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Modal for login/signup */}
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'login')}>
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
