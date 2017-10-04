import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components'
import Avatar from 'material-ui/Avatar'

const Container = styled.div`
  width:324px;
  position:relative;
  .bg1{
    background-color:${props=> props.theme.primaryColor};
  }
  .bg2{
    background-color:#4FC2C3;
  }
  .bg3{
    background-color:#85CDCE;
  }
  .bg4{
    background-color:#9BD0D0;
  }
  .bg5{
    background-color:#BAE7E9;
  }
  .bg6{
    background-color:#DAF8F9;
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
`

const Number = styled.div`
  width:60px;
  height:60px;
  font-size:32px;
  text-align:center;
  padding:9px;
  font-weight:bold;
  float:left;
`

const Name = styled.div`
  color:#222;
  font-size:19px;
  font-weight:bold;
`

const Sty = styled.div`
  color:#8F8F8F;
  font-size:13px;
`

//if height less than 900px remove last item
const defaultPic = '/tmp/avatar.png'

const TopWriterSidebar = ({writer, style}) => {
  /*var Sort = []
  for(let i=0;i<writer.length;i++){
    Sort.push(
      <Div className='serif-font' key={i}>
        <Avatar src='/tmp/avatar.png' size={50} />
        <div style={{padding:'0 30px 0 35px'}}>
          <Name>{writer[i].display}</Name>
          <Sty className='sans-font'>{writer[i].intro}</Sty>
        </div>
      </Div>
    )
  }*/
  return (
    <Container style={{...style}}>
      <Divider/>
      <Head>TOP WRITERS</Head>
        {writer && writer.map((data, index) => (
          <a href={data.url} key={index}>
            <Div className='serif-font'>
              <Avatar src={data.pic && data.pic.medium || defaultPic} size={55} />
              <div style={{padding:'0 30px 0 35px'}}>
                <Name>{data.display}</Name>
                <Sty className='sans-font'>{data.intro}</Sty>
              </div>
            </Div>
          </a>
        ))}
      <Divider/>
    </Container>
  )
}

export default TopWriterSidebar;
