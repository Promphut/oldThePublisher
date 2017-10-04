import React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import {LogoLink, PrimaryButton} from 'components'
import Avatar from 'material-ui/Avatar'

const HideOnTablet = styled.div`
	@media (max-width: 640px) {
		display: none;
	}
`

const Wrapper = styled.div`
	margin: 0;
	padding: 0;
  background-color: white;
  height: 60px;
  border-bottom: 1px solid #e2e2e2;
`

const HamburgerWrapper = styled.a`
	display: inline-block;
  float: left;
  text-align: center;
  color: #8f8f8f;
  background-color: white;
  padding: 22px 25px;
  cursor: pointer;
`

const Hamburger = styled.div`
	content: '';
	height: 2px;
	width: 20px;
	background: #8d8d8d;
	box-shadow: 0 6px 0 #8d8d8d, 0 12px 0 #8d8d8d;
  marginBottom: 11px;
`

const A = styled.a`
	display: inline-block;
  float: left;
  text-align: center;
  color: #8f8f8f;
  background-color: white;
  text-decoration: none;
  padding: 18px 25px;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
    color: #222;
  }
`

let logoStyle = {
  display: 'inline-block',
  float: 'left',
  marginTop: '3px',
  padding: '17px 5px'
}

let buttonStyle = {
  display: 'inline-block',
  float: 'left',
  boxShadow: 'none',
  verticalAlign: 'middle',
  marginTop: '9px'
}

let avatarStyle = {
  display: 'inline-block',
  float: 'left',
  textAlign: 'center',
  margin: '13px',
  cursor: 'pointer'
}

const Navbar = () => {
  return (
    <Wrapper className="menu-font">
      <HamburgerWrapper>
        <Hamburger/>
      </HamburgerWrapper>
      <LogoLink to="/" style={logoStyle}/>

      <A>Home</A>
      <A>Stories</A>
      <A>About Us</A>
      <A>Contact</A>

      <HideOnTablet>
        <PrimaryButton
          label="Story"
          iconName="add"
          style={buttonStyle}
        />
      </HideOnTablet>
			<Avatar size={30} style={avatarStyle} />
    </Wrapper>
  )
}

export default Navbar;
