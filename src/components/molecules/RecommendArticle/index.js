import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components'
import {OverlayImg} from 'components'

const Container = styled.div`
  width:590px;
  margin:30px auto 0 auto;
  .imgWidth{
    width:590px;
    height:290px;
  }
  @media (min-width: 768px) and (max-width: 991px) {
    width: 350px;
    .imgWidth{
      width:350px;
      height:180px;
    }
  }
  @media (min-width: 992px) and (max-width: 1200px) {
    width: 500px;
    .imgWidth{
      width:500px;
      height:240px;
    }
  }
  @media (max-width:480px){
    position:relative;
    width:100%;
    top:0;
    left:0;
    .imgWidth{
      width:100%;
      height:164px;
    }
  }
`

const Div = styled.div`
  color:#8F8F8F;
  font-size:15px;
  text-align:center;
  margin:10px 0 10px 0;
  @media (max-width:480px){
    font-size:12px;
    margin:5px 0 0 0;
  }
`

const Column = styled(Link)`
  font-weight:bold;
`

const NameLink = styled(Link)`
  display: block;
  color:#222;
  font-weight:bold;
  text-align:center;
  font-size:28px;
  padding: 0 30px 0 30px;
  @media (max-width:480px){
    font-size:18px;
  }
`

const RecommendArticle = ({detail})=>{
  if(!detail) return (<Container/>)

  let {column,ptitle,writer,votes,comments,url,cover,style,coverMobile} = detail

  return(
    <Container style={{...style}}>
      <Link to={url}><OverlayImg src={cover.medium || cover.small} className='imgWidth' alt={ptitle} /></Link>
      {column && <Div className='sans-font'>in <Column to={column.url}>{column.name}</Column></Div>}
      <NameLink to={url} className='serif-font'>{ptitle}</NameLink>
      <Div className='sans-font'>By <Link to={writer.url}><strong>{writer.display}</strong></Link> - {votes ? votes.total : 0} Votes {comments ? comments.count : 0} Comments</Div>
    </Container>
  )
}

export default RecommendArticle;
