import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { BGImg, ShareDropdown } from 'components'
import Avatar from 'material-ui/Avatar'
import FontIcon from 'material-ui/FontIcon'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import moment from 'moment'
import truncate from 'lodash/truncate'
import utils from '../../../services/utils'

const Container = styled.div`
  width:100%;
  padding:30px 0 30px 0;
  border-bottom: ${props => props.hr ? '' : '1px solid #e2e2e2'} ;
  overflow:hidden;
  display:flex;
  .imgWidth{
    width:100%;
    height:230px;
  }
  .imgWidthUser{
    width:100%;
    height:157px;
  }
  .des-hidden{
    display:block;
  }
  .by{
    margin-top:auto;
  }
  @media (min-width:481px) {
    .des-hidden{
      display:none !important;
    }
  }
  @media (max-width:480px) {
    display:block;
    width:100%;
    padding:16px 0 16px 0;
    margin-left:auto;
    margin-right:auto;
    .mob-hidden{
      display:none !important;
    }
    .imgWidth{
      width:100%;
      height:${props => props.height}px;
    }
    .by{
      margin-top:12px;
    }
  }
  @media (min-width: 768px) and (max-width: 992px) {
    padding:20px 0 20px 0;
    .imgWidth{
      height:178px;
    }
  }
`

const Div = styled.div`
  color:#8E8E8E;
  font-size:14px;
  @media (max-width:480px) {
    font-size:12px;
  }
`

const NameLink = styled(Link)`
  display: block;
  color:#222;
  font-weight:bold;
  font-size:18px;
  transition: .1s;

  &:hover{
    color: ${props => props.theme.accentColor};
  }
  @media (max-width:480px) {
    font-size:15px;
  }
`
const WriterLink = styled(Link)`
  color: #8E8E8E;
  opacity: .8;
  transition: .1s;

  &:hover {
    color: #8E8E8E;
    opacity: 1;
  }

`
const ColumnLink = styled(Link)`
  color: ${props => props.theme.accentColor};
  opacity: .8;
  transition: .1s;

  &:hover {
    color: ${props => props.theme.accentColor};
    opacity: 1;
  }
`
const ByLink = styled(Link)`
  color: ${props => props.color};
  opacity: .8;
  font-weight: bold;

  &:hover{
    color: ${props => props.color};
    opacity: 1;
  }
`

const BoxText = styled.div`
  float:left;
  width:477px;
  padding-left:38px;
  @media (max-width:480px) {
    width:100%;
    padding-left:0px;
    margin-top:10px;
  }
`

const Box = styled.div`
  flex:1;
  display:flex;
  flex-direction:column;
  padding:25px 0 0 20px;
  @media (max-width:480px) {
    margin:5px;
    display:block;
    padding:0px;
    padding-top:5px;
  }
`
const Box1 = styled.div`
  flex:1 300px;
  min-width:300px;
  @media (max-width:480px) {
    display:block;
    min-width:100%;
    width:100%;
  }
  @media (min-width: 768px) and (max-width: 992px) {
    flex:1 340px;
    min-width:340px;
  }
`

const ArticleBox = ({ detail, style, final ,id, isUserPage}, context) => {
	let {
		ptitle,
		cover,
		writer,
		column,
		votes,
		comments,
		updated,
		url,
		readTime,
		contentShort,
		created,
		published
	} = detail
	var { theme } = context.setting.publisher

	let writherDisplay = ''
	if (writer && writer.display) {
		writherDisplay = writer.display ? writer.display : ''
	}

	return (
		<Container hr={final} style={{ ...style }} height={(screen.width - 32) / 1.91}>
    <ShareDropdown buttonSize={16} url={url} className='hidden-des'/>
			<Box1 style={{ flex: '1' }}>
				<Div className="sans-font" style={{ margin: '0 0 8px 0' }}>
					{utils.dateFormat(published)}
				</Div>

				<BGImg
					url={url}
					src={cover.medium&&cover.medium||cover.small}
					className={isUserPage ? "imgWidthUser" : "imgWidth"}
				/>
			</Box1>
			<Box>
				<div className="row" style={{ overflow: 'hidden', display: 'flex' }}>
					<div
						style={{
							width: '16px',
							height: '1px',
							background: '#8E8E8E',
							flex: 1,
							margin: '10px 10px 0 0'
						}}
					/>
					<Div className="sans-font" style={{ margin: '0 0 7px 0', flex: 20 }}>
						{readTime + ' min read'}
            {isUserPage ?
            <strong>
              &nbsp;/&nbsp;
              <ColumnLink to={column && column.url}>
                {column.name}
              </ColumnLink>
					</strong> : ''}
					</Div>
          <ShareDropdown id={id} buttonSize={16} url={url} className='hidden-mob'/>
				</div>
				<NameLink to={url} className="nunito-font" style={{ marginTop: '5px' }}>

					{truncate(ptitle, {
						length: isUserPage ? 70 : 90,
						separator: ''
					})}
				</NameLink>

				<Div className="nunito-font" style={{ marginTop: '10px' }}>
					{truncate(contentShort, {
						length: 200,
						separator: ''
					})}
				</Div>
        { !isUserPage &&
				<Div className="nunito-font by">
					by
					{' '}
					<strong>
						<WriterLink to={writer && writer.url}>
							{' '}{writer.display}{' '}
						</WriterLink>
					</strong>
					{' '}
					in
					{' '}
					<strong>
						<ColumnLink to={column && column.url}>
							{column.name}
						</ColumnLink>
					</strong>
				</Div>
        }
			</Box>
		</Container>
	)
}

ArticleBox.contextTypes = {
	setting: PropTypes.object
}

export default ArticleBox
