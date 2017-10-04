import React from 'react'
import PropTypes from 'prop-types'
import { OverlayImg, Pagination,Alert,EditMenu,BoxMenu,MenuList,DropdownWithIcon} from 'components'
import FontIcon from 'material-ui/FontIcon'
import styled from 'styled-components'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Link} from 'react-router-dom'
import moment from 'moment'
import CircularProgress from 'material-ui/CircularProgress';

const STATUS = {
  'DRAFTED': 0,
  'PUBLISHED': 1
}
const Cont = styled.div`
  width:100%;
`
const Onload =styled.div`
  position:relative;
  width:100%;
  height:500px;
  padding-top:200px;
  background:white;
`
const TitleLink = styled(Link)`
  color:#222;
  font-size:15px;
  font-weight:bold;
  float:left;
  height:52px;
  word-wrap: break-word;
  white-space: pre-wrap;      /* Webkit */
  white-space: -moz-pre-wrap; /* Firefox */
  white-space: -pre-wrap;     /* Opera <7 */
  white-space: -o-pre-wrap;   /* Opera 7 */
  word-wrap: break-word;      /* IE */
  padding-right:5px;
  overflow: hidden;
  max-width:220px;
  margin:0 0 0 15px;
`
const Name = styled.div`
  flex:2,
  color:#222;
  font-weight:bold;
  font-size:14px;
  padding-top:5px;
`
const ClickAbleHeader = styled.div`
  overflow:hidden;
  &:hover{
    cursor:pointer;
  }
`
const StoryTitle = ({style, story, status})=>{
  let {title, ptitle, cover, url} = story
  return(
    <Cont style={{...style}}>
      <Link to={url}><OverlayImg src={cover.small || cover.medium}
        style={{width:'87px',height:'52px',float:'left'}} alt={ptitle} /></Link>
      <TitleLink to={url} className="sans-font">{status===STATUS.DRAFTED ? title : ptitle}</TitleLink>
    </Cont>
  )
}

const HeaderTable = ({name,status,onClick,sort,sortByState,theme})=>{
  var me = false
  if(name.toLowerCase()==sort){
    me = true
  }
  return(
    <ClickAbleHeader className='row' onClick={onClick}>
      <Name className='sans-font'>{name}</Name>
      <div className={{flex:1}}>
        <FontIcon className="material-icons" style={{display:'block',height:'10px',color:me&&sortByState==(-1)?theme.accentColor:'#c4c4c4'}}>arrow_drop_up</FontIcon>
				<FontIcon className="material-icons" style={{display:'block',color:me&&sortByState==1?theme.accentColor:'#c4c4c4'}}>arrow_drop_down</FontIcon>
      </div>
    </ClickAbleHeader>    
  )
}

const StoriesTable = ({stories,selectStatus,onload,editStory,sortBy,sort,sortState}, context) => {
  var {theme} = context.setting.publisher

  return(
    <div> 
      {onload ? <Onload><div className='row'><CircularProgress size={60} thickness={6} style={{width:'60px',margin:'0 auto 0 auto'}}/></div></Onload> :
      <Table >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}>
          <TableRow style={{ height:55, background: '#F4F4F4',borderTop:'1px solid #e4e4e4'}}>
            <TableHeaderColumn style={{padding:'0 0 0 20px',width:'40%', height:55}}>
              <Name>Title</Name>
            </TableHeaderColumn>
            <TableHeaderColumn style={{padding:'0 10px 0 10px',width:'10%',textAlign:'center', height:55}}>
              <HeaderTable name='Writer' onClick={(e)=>sortBy(e,'writer')} sort={sort} sortByState={sortState} theme={ theme }/>
            </TableHeaderColumn>
            <TableHeaderColumn style={{width:'15%',textAlign:'center', height:55}}>
              <HeaderTable name='Column' onClick={(e)=>sortBy(e,'column')} sort={sort} sortByState={sortState} theme={ theme }/>
            </TableHeaderColumn>
            <TableHeaderColumn style={{width:'15%', height:55}}>
              <HeaderTable name='Stats' onClick={(e)=>sortBy(e,'stats')} sort={sort} sortByState={sortState} theme={ theme }/>
            </TableHeaderColumn>
            <TableHeaderColumn style={{width:'15%', height:55,padding:'0 14px 0 14px'}}>
              <HeaderTable name={selectStatus===STATUS.PUBLISHED ? 'Published' : 'Drafted'} onClick={(e)=>sortBy(e,selectStatus==STATUS.PUBLISHED ? 'published' : 'drafted')} sort={sort} sortByState={sortState} theme={ theme }/>
            </TableHeaderColumn>
            <TableHeaderColumn style={{width:'5%', height:55}}></TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          showRowHover={true}
          displayRowCheckbox={false}>
          {stories ? stories.map((story, index) => (
            <TableRow key={index}>
              <TableRowColumn style={{width:'40%',padding:'10px 0 10px 0'}}><StoryTitle story={story} status={selectStatus} /></TableRowColumn>
              <TableRowColumn style={{width:'10%',paddingRight:0,paddingLeft:0,textAlign:'center'}}>{story.writer && story.writer.url && <Link to={story.writer.url}>{story.writer.display}</Link>}</TableRowColumn>
              <TableRowColumn style={{width:'15%',paddingRight:0,paddingLeft:0,textAlign:'center'}}>{story.column && story.column.url && <Link to={story.column.url}>{story.column.name}</Link>}</TableRowColumn>
              <TableRowColumn style={{width:'15%'}}>{story.views || 0} Views<br/>{story.shares ? story.shares.total : 0} Shares</TableRowColumn>
              <TableRowColumn style={{width:'15%',wordWrap:'break-word',whiteSpace:'pre-wrap'}}>{selectStatus===STATUS.PUBLISHED ? moment(story.published).format('lll') : moment(story.created).format('lll')}</TableRowColumn>
              <TableHeaderColumn style={{width:'5%',paddingRight:0,paddingLeft:0,textAlign:'center',cursor:'pointer'}} ><FontIcon className='material-icons' onClick={(e)=>{editStory(e,story.id)}} style={{color:'#bfbfbf'}}>more_vert</FontIcon></TableHeaderColumn>
            </TableRow>
          )) : ''}
        </TableBody>
      </Table>}
    </div>
  )
}

StoriesTable.contextTypes = {
	setting: PropTypes.object
}

export default StoriesTable;