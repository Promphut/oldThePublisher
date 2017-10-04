import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {PublisherInsightView, PublisherInsightTrend, PublisherInsightShare, PublisherInsightGrowth} from 'components'
import {Tabs, Tab} from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'

const Container = styled.div`
`

const Header = styled.div`
	margin: 0;
	padding: 0;
  height: 80px;
	width: 100%;
  background: #F4F4F4;
  display: flex;
`

const Title = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  font-family: 'Nunito', 'Mitr';
  font-size: 22px;
  font-weight: bold;
  padding-left: 32px;
`

const Item = styled.div`
	padding: 32px
`

let styles = {
  tabs: {
    background: 'none',
    height: '76.5px'
  },
  tab: {
    fontFamily:"'Nunito', 'Mitr'",
    color: '#222222',
    fontSize: '16px',
    fontWeight: 'bold',
    textTransform: 'none'
  }
}

class PublisherInsight extends React.Component {
  state = {
    slideIndex: 0
  }

  static contextTypes = {
    setting: PropTypes.object
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value
    })
  }

  render() {
    const {theme} = this.context.setting.publisher
    const {title, insigth} = this.props

    return (
      <Container>
        <Header>
          <Title>{title}</Title>
          <Tabs style={{flex:'1', paddingRight:'32px'}}
            tabItemContainerStyle={styles.tabs}
            inkBarStyle={{background:theme.accentColor, height:'5px'}}
            onChange={this.handleChange}
            value={this.state.slideIndex}
          >
            <Tab buttonStyle={styles.tab} label="View" value={0} />
            <Tab buttonStyle={styles.tab} label="Trend" value={1} />
            <Tab buttonStyle={styles.tab} label="Share" value={2} />
            <Tab buttonStyle={styles.tab} label="Engagement" value={3} />
          </Tabs>
        </Header>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <Item>
            <PublisherInsightView insigth={insigth}/>
          </Item>
          <Item>
            <PublisherInsightTrend insigth={insigth}/>
          </Item>
          <Item>
            <PublisherInsightShare insigth={insigth}/>
          </Item>
          <Item>
            <PublisherInsightGrowth insigth={insigth}/>
          </Item>
        </SwipeableViews>
      </Container>
    )
  }
}

export default PublisherInsight
