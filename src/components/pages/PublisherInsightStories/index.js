import React from 'react'
import styled from 'styled-components'
import {PublisherInsight} from 'components'

const Container = styled.div`
  width: 100%;
`

const PublisherInsightStories = () => {
	return (
      <Container>
        <PublisherInsight title='Story Analytic' insigth='topstories'/>
      </Container>
    )
}

export default PublisherInsightStories
