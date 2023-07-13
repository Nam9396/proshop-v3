import React from 'react'
import { Navbar, Nav, Container, NavbarBrand, NavLink, Badge, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse'
import NavbarToggle from 'react-bootstrap/esm/NavbarToggle'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import logo from '../assets/logo.png'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../slices/usersApiSlice'
import { logoutLocalStorage } from '../slices/authSlice'
import SearchBox from './SearchBox'

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ logout ] = useLogoutMutation();
  
  const logoutHandler = async() => {
    try { 
      await logout().unwrap();
      dispatch(logoutLocalStorage());
      navigate('/login');
    } catch (error) { 
      console.log(error);
    }
  }

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
          <NavbarBrand>
            <img src={logo} alt='proshop' />  
            ProShop
          </NavbarBrand>
          </LinkContainer>
          <NavbarToggle aria-controls='basic-navbar-nav' />
          <NavbarCollapse id='basic-navbar-nav' >
            <Nav className='ms-auto'>
              <SearchBox />
              <LinkContainer to='/cart'>
                <NavLink><FaShoppingCart/>Cart
                  { 
                    cartItems.length > 0 && (
                      <Badge pill bg='success' style={{marginLeft: '5px'}}>
                        { cartItems.reduce((a, c) => a + c.qty, 0) }
                      </Badge>
                    )
                  }
                </NavLink>
              </LinkContainer>
              { userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <NavLink href='/login'><FaUser/>Sign in</NavLink>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>
                      Products
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>
                      Users
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>
                      Orders
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </NavbarCollapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header

