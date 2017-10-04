import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components'

const Container = styled.div`
  width:324px;
  position:relative;
  .bg1{
    background-color:${props=> props.theme.primaryColor} ;
  }
  .bg2{
    background-color:${props=> props.theme.primaryColor} ;
  }
  .bg3{
    background-color:${props=> props.theme.primaryColor} ;
  }
  .bg4{
    background-color:${props=> props.theme.primaryColor} ;
  }
  .bg5{
    background-color:${props=> props.theme.primaryColor} ;
  }
  .bg6{
    background-color:${props=> props.theme.primaryColor} ;
  }
`

const Head = styled.div`
  color:#8F8F8F;
  font-size:20px;
  width:171px;
  text-align:center;
  margin:20px auto 15px auto;
  border:1px solid #E2E2E2;
  background:white;
  padding:2px;
  font-family:'Nunito'

	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	cursor: default;
`

const Divider =styled.div`
  height:1px;
  width:100%;
  background-color:#E2E2E2;
  top:35px;
  z-index:-5;
  position:relative;
`

const Column = styled.div`
  font-weight:bold;
  font-size:36px;
  color:${props=> props.theme.primaryColor};
  text-align:center;
`

const Div = styled.div`
  width:100%;
  padding:12px 0px;
  display:flex;
  cursor: pointer;
  color: initial;
`

const Number = styled.div`
  color: #FFF;
  width:60px;
  height:60px;
  font-size:32px;
  text-align:center;
  padding:9px;
  font-weight:bold;
  float:left;

	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	cursor: default;
`

const Name = styled.div`
  color:#222;
  font-size:19px;
  font-weight:bold;
`

const Sty = styled.div`
  color:#8F8F8F;
  font-size:16px;
`
//if height less than 900px remove last item

const TopColumnSidebar = ({column, style}) => {
  return (
    <Container style={{...style}}>
      <Divider/>
      <Head>TOP COLUMNS</Head>
        {column && column.map((data, index) => (
          <a href={data.url} key={index}>
            <Div className='serif-font'>
              <Number className={'bg'+(1+index)}>{index+1}</Number>
              <div style={{padding:'14px 30px 0 30px'}}>
                <Name>{data.name}</Name>
                {/*<Sty className='sans-font'>{data.shortDesc}</Sty>*/}
              </div>
            </Div>
          </a>
        ))}
      <Divider/>
    </Container>
  )
}

export default TopColumnSidebar;
