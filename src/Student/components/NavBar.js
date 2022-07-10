import { Link } from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"


const navStyles = {
    container: {
      height: 60,
      backgroundColor: 'black',
      width: '100%'
    }, 
    logo : {
        fontSize: 25,
        paddingRight: 40,
        color: 'white',
        textDecoration : 'none',
        fontWeight: 'bold'
    },

    link : {
        textDecoration : 'none',
        paddingRight : 30,
        color: 'white',
        fontWeight: 'lighter'
    },
    link2 : {
        textDecoration : 'none',
        paddingRight : 20,
        color: 'white',
        fontWeight: 'lighter',
        marginLeft: 'auto',

    }
}

export const NavBar = () => {
  return (
<Navbar style = {{backgroundColor: 'black', marginBottom: 20}}>
  <Container  style={navStyles.container}>
    <Navbar.Brand style = {navStyles.logo} href = '\'> RecMe </Navbar.Brand>
      <Nav style = {{flexDirection: 'row', width:'100%', flex:1, }}>
        
        <Nav.Link style = {navStyles.link} href="\">Home</Nav.Link>
        <Nav.Link style = {navStyles.link} href="\dashboard">Dashboard</Nav.Link>
        <Nav.Link style = {navStyles.link} href="\saved">Saved</Nav.Link>
        <Nav.Link style = {navStyles.link} href="\profile">Profile</Nav.Link>
      </Nav>
  </Container>
</Navbar>
  );
};

