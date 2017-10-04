import React from 'react'
import PropTypes from 'prop-types'
import {
	TopNews,
	TopNewsSmall,
} from 'components'
import styled from 'styled-components'


const Content = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	@media (max-width:480px) {
		padding: 10px 0 0 0;
  }
`

const Main = styled.div`
	flex: 3 731px;
	max-width: 731px;
	@media (max-width:480px) {
    flex: 0 100%;
		max-width: 100%;
		padding:0 15px 0 15px;
  }
	@media (min-width: 768px) and (max-width: 992px) {
		flex: 3 474px;
		max-width: 474px;
  }
`
const Aside = styled.div`
	flex: 1 350px;
	max-width: 350px;
	margin-left:25px;
	@media (min-width: 768px) and (max-width: 992px) {
		flex: 1 227px;
		max-width: 227px;
  }
`

class TopNewsBox extends React.Component {
	static contextTypes = {
		setting: PropTypes.object
	}

	constructor(props) {
		super(props)

		this.state = {

		}
	}

	render() {
		let {  className,style,data } = this.props
		return (
      <Content className={className} style={{...style}}>
        <Main>
          <TopNews detail={data[0]} />
        </Main>
        <Aside>
          <TopNewsSmall detail={data[1]} />
          <TopNewsSmall detail={data[2]} />
          <TopNewsSmall
            detail={data[3]}
            style={{ borderBottom: '1px solid #000' }}
          />
        </Aside>
      </Content>
		)
	}
}

export default TopNewsBox
