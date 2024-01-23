import React from 'react'
import {Badge,  Navbar, Nav, Container, NavDropdown} from 'react-bootstrap'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import logo from '../assets/logo-light.png'
import { LinkContainer} from 'react-router-bootstrap'
import { useSelector } from 'react-redux'

const Header = () => {

  const { cartItems } = useSelector((state) => state.cart)
  const { userInfo } = useSelector((state) => state.auth)

  const logoutHandler = () => {
    console.log("LOGGING OUT MY NIGGAS")
  }

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand  > 
              <img src={logo} alt="Alternatif" className='logo'/>
            </Navbar.Brand>
          </LinkContainer>
          
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse>
            <Nav className='ms-auto'>
              <LinkContainer to="/cart" >
                <Nav.Link href="/cart">
                  <FaShoppingCart />Cart
                  {
                    cartItems.length > 0  && (
                        <Badge pill bg='success' style={{marginLeft:'5px'}}>
                            { cartItems.reduce((acc, cur) => acc + cur.qty, 0)}
                        </Badge>
                    ) 
                  }
                  </Nav.Link>
              </LinkContainer>
              { userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              ) : (
                <LinkContainer to="login">
                  <Nav.Link href="/login"><FaUser/> Sign In</Nav.Link>
                </LinkContainer>
              ) }
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header