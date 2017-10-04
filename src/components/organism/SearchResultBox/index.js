import React from 'react'
import styled from 'styled-components'

import isEmpty from 'lodash/isEmpty'

import { NewsBox} from 'components'

const NotFoundText = styled.span `
  font-size: 20px;
  font-family: 'Nunito', 'Mitr';
`

const NotFoundTextContainer = styled.div `
  width: 100%;
  text-align: center;
`

export default class SearchResultBox extends React.Component  {
  render() {

    var resultFeed = [];
    if (this.props.isLoading) {
      resultFeed = <NotFoundTextContainer><NotFoundText>กำลังค้นหา</NotFoundText></NotFoundTextContainer>
    }

    else if ((!isEmpty(this.props.result) || this.props.result === []) && this.props.page >=0) {

      resultFeed = []

      for (var i = 0 ; i < this.props.result.length ; i++)
          resultFeed.push(<NewsBox final={i == this.props.result.length - 1} detail={this.props.result[i]} key={i}/>)

    } else {

      resultFeed = <NotFoundTextContainer><NotFoundText>ไม่พบผลลัพธ์จากคำที่ค้นหา</NotFoundText></NotFoundTextContainer>

    }

    return (
      <div>
        {resultFeed}
      </div>
    )
  }
}
