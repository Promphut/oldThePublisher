import React from 'react'
import styled from 'styled-components'
import {PublisherInsight} from 'components'

const Container = styled.div`
  width: 100%;
`

const PublisherInsightColumns = () => {
	return (
      <Container>
        <PublisherInsight title='Column Analytic' insigth='topcolumns'/>
      </Container>
    )
}

export default PublisherInsightColumns
