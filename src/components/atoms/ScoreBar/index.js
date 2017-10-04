import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background: #F4F4F4;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
	flex-flow: row wrap;
  width: 192px;
  height: 24px;
  padding: 4px 0px;
`

const Item = styled.div`
  font-size: 12px;
	text-align: center;
	flex: 1;
  font-weight: bold;
`

const VerticalLine = styled.div`
  border: 1px solid #8E8E8E;
  opacity: .7;
`

const ScoreBar = ({style}) => {
  return (
    <Container className="sans-font" style={style}>
      <Item style={{color: '#EB5757'}}>0-2 %</Item>
      <VerticalLine/>
      <Item style={{color: '#8E8E8E'}}>3-9 %</Item>
      <VerticalLine/>
      <Item style={{color: '#27AE60'}}>10% +</Item>
    </Container>
  )
}

export default ScoreBar
