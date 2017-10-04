import React from 'react'
import styled from 'styled-components'
import {PublisherInsight} from 'components'

const Container = styled.div`
  width: 100%;
`

const PublisherInsightWriters = () => {
	return (
      <Container>
        <PublisherInsight title='Writer Analytic' insigth='topwriters'/>
      </Container>
    )
}

export default PublisherInsightWriters
