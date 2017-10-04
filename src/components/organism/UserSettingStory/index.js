import React from 'react'
import PropTypes from 'prop-types'
import { OverlayImg, Pagination,Alert} from 'components'
import FontIcon from 'material-ui/FontIcon'
import styled from 'styled-components'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import {Link} from 'react-router-dom'
import CircularProgress from 'material-ui/CircularProgress';
import moment from 'moment'
import auth from '../../../services/auth'
import api from '../../../services/api'
import utils from '../../../services/utils'
import config from '../../../config'

const Container = styled.div`
  width:100%;
`

const Section1  = styled.div`
  background-color:#F7F7F7;
  color:#8F8F8F;
  font-family:'Nunito';
  padding:15px;
  font-size:16px;
  border:1px solid #E2E2E2;
`

const TabHead = styled.div`
  padding:0 15px 0 15px;
  display:inline;
  font-size:16px;
  &:hover{
    color:#222;
    cursor:pointer;
    text-decoration:underline;
  }
`

const Section2 = styled.div`
  width:100%;
  padding:50px 15px 50px 15px;
  border-bottom:1px solid #E2E2E2;
`

const Col3 = styled.div`
  padding:0 5px 0 5px;
`

const Icon = styled.div`
  color:#222;
  font-size:32px;
  overflow:hidden;
  &:hover{
    cursor:pointer;
  }
`

const Primary = styled.div`
  background-color:${props=> props.theme.primaryColor};
  color:white;
  text-align:center;
  padding:15px 5px 15px 5px;
  font-size:16px;
  border:2px solid ${props=> props.theme.primaryColor};
`

const Second = styled.div`
  background-color:white;
  color:${props=> props.theme.primaryColor};
  text-align:center;
  padding:15px 5px 15px 5px;
  font-size:16px;
  border:2px solid ${props=> props.theme.primaryColor};
`

const Cont = styled.div`
  width:100%;
`

const TitleLink = styled(Link)`
  color:#222;
  font-size:15px;
  font-weight:bold;
  float:left;
  height:52px;
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

const IconEdit = styled(Link)`
  background-color:${props=> props.theme.primaryColor};
  color:white;
  border-radius:12px;
  padding:5px 8px 5px 8px;
  height: 35px;
  width:40px;
  margin:8px 12px 0 0;
  &:hover{
    cursor:pointer;
  }
`

const Page = styled.div`
  display: flex;
	flex-flow: row wrap;
	justify-content: center;
  padding:30px 0 30px 0;
`

const MyStory = styled.div`
  font-size:32px;
  color:#222;
`

const Onload =styled.div`
  position:relative;
  width:100%;
  height:500px;
  padding-top:200px;
  background:white;
`

const StoryTitle = ({style, story, selectStatus})=>{
  let {title, ptitle, cover, url} = story
  //console.log('story', story)
  return (
    <Cont style={{...style}}>
      <Link to={url}><OverlayImg src={cover.small || cover.medium}
        style={{width:'87px',height:'52px',float:'left'}} alt={ptitle}/></Link>
      <TitleLink to={url} className="sans-font">{selectStatus===STATUS.DRAFTED ? title : ptitle}</TitleLink>
    </Cont>
  )
}

const STATUS = {
  'DRAFTED': 0,
  'PUBLISHED': 1
}

class UserSettingStory extends React.Component {
  FEED_LIMIT = config.FEED_LIMIT

  static contextTypes = {
    setting: PropTypes.object
  }
  state = {
    selectStatus: STATUS.PUBLISHED,

    stories:[],
    storiesCount:0,
    selectStoryId:0,

    currentPage:0,
    totalPages: 0,

    sort:'latest',

    onLoad:false,
    editStory:false,

    alert:false
  }

  constructor(props) {
    super(props)

    this.user = auth.getUser()
    //console.log('USER', this.user)
  }

  getCurrentFilter = () => {
    return {
      writer: this.user._id,
      status: this.state.selectStatus
    }
  }

  getStories = () => {
    this.setState({onLoad:true})

    let {currentPage, sort} = this.state

    api.getFeed('story', this.getCurrentFilter(), sort, null, currentPage, this.FEED_LIMIT, {allowUnlisted: true})
    .then(result => {
      //console.log('getFeed()', result)
      this.setState({
        stories: result.feed,
        storiesCount: result.count,
        onLoad: false,
        totalPages: utils.getTotalPages(this.FEED_LIMIT, result.count[this.state.selectStatus])
      })
    })
  }

  editStory = (e,data) => {
    this.setState({
      editStory:true,
      editStoryWhere:e.currentTarget,
      selectStoryId:data
    })
  }

  closeEditStory = () => {
    this.setState({editStory:false})
  }

  filterPublished = () => {
    this.setState(
      {
        selectStatus: STATUS.PUBLISHED
      },
      ()=>{this.getStories()}
    )
  }

  filterDrafted = () => {
    this.setState(
      {
        selectStatus: STATUS.DRAFTED
      },
      ()=>{this.getStories()}
    )
  }

  changePage = (e) => {
    this.setState(
      {
        currentPage:e-1,
        //currentPage:e
      },
      ()=>{this.getStories()}
    )
  }

  alertDeleteStory = (e) => {
    this.setState({
      alert:true,
      alertWhere:e.currentTarget,
      alertChild: '',
      alertDesc:'Are you sure to delete this story?',
      alertConfirm:this.deleteStory
    })
  }

  alertUnpublishStory = (e) => {
    this.setState({
      alert:true,
      alertWhere:e.currentTarget,
      alertChild: '',
      alertDesc:'Are you sure to unpublish this story?',
      alertConfirm:this.unpublishStory
    })
  }

  alertPublishStory = (e) => {
    this.setState({
      alert:true,
      alertWhere:e.currentTarget,
      alertChild: '',
      alertDesc:'Are you sure to publish this story?',
      alertConfirm:this.publishStory
    })
  }

  deleteStory = () => {
    this.setState({editStory:false,alert:false})

    api.deleteStory(this.state.selectStoryId)
    .then(res => {
      this.getStories()
    })
  }

  unpublishStory = () => {
    this.setState({editStory:false,alert:false})

    api.setStoryStatus(this.state.selectStoryId, 0)
    .then(res => {
      this.getStories()
    })
  }

  publishStory = () => {
    this.setState({editStory:false,alert:false})

    api.setStoryStatus(this.state.selectStoryId, 1)
    .then(res => {
      this.getStories()
    })
  }

  goEditStory = () => {
    this.props.history.push('/me/stories/'+this.state.selectStoryId+'/edit')
  }

  handleRequestClose = () => {
    this.setState({alert:false})
  }

  componentDidMount(){
    this.getStories()
  }

  render(){
    let {alert,alertChild,alertConfirm,alertDesc,alertWhere,stories,selectStatus,onLoad,editStory,editStoryWhere,storiesCount,currentPage,totalPages} = this.state
    let {theme} = this.context.setting.publisher

    return (
      <Container>
        <Alert
          open={alert}
          anchorEl={alertWhere}
          onRequestClose={this.handleRequestClose}
          description={alertDesc}
          child={alertChild}
          confirm={alertConfirm}/>
        <div className='row' style={{padding:'30px 15px 20px 30px'}}>
          <MyStory className='nunito-font'>My Stories</MyStory>
        </div>
        <div className='row'>
          <div className='col-12'>
            <Section1 className="sans-font">
              <TabHead onClick={this.filterPublished} style={selectStatus===STATUS.PUBLISHED ? {fontWeight:'bold',color:'#222'} : {}} >{storiesCount[STATUS.PUBLISHED+''] || '0 '} Published</TabHead>
              <TabHead onClick={this.filterDrafted} style={selectStatus===STATUS.DRAFTED ? {fontWeight:'bold',color:'#222'} : {}} >{storiesCount[STATUS.DRAFTED+''] || '0 '} Drafted</TabHead>
              {/*<TabHead>3 Scheduled</TabHead>*/}
              {/*<FontIcon className="material-icons" style={{float:'right',margin:'0 0 0 0',color:'#8f8f8f'}}>search</FontIcon>*/}
            </Section1>
          </div>
        </div>
        <Popover
          open={editStory}
          anchorEl={editStoryWhere}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          style={{border:'2px solid '+theme.primaryColor}}
          onRequestClose={this.closeEditStory}
        >
          <MenuItem onClick={this.goEditStory} style={{color:theme.primaryColor,fontSize:'17px'}} className='nunito-font' leftIcon={<FontIcon className="material-icons" style={{color:theme.primaryColor}}>edit</FontIcon>}>Edit Story</MenuItem>
          <MenuItem onClick={this.alertDeleteStory} style={{color:theme.primaryColor,fontSize:'17px'}} className='nunito-font' leftIcon={<FontIcon className="material-icons" style={{color:theme.primaryColor}}>delete</FontIcon>}>Delete</MenuItem>
          {selectStatus===STATUS.PUBLISHED ? <MenuItem onClick={this.alertUnpublishStory} style={{color:theme.primaryColor,fontSize:'17px'}} className='nunito-font' leftIcon={<FontIcon className="material-icons" style={{color:theme.primaryColor}}>drafts</FontIcon>}>Unpublish</MenuItem>
          : <MenuItem onClick={this.alertPublishStory} style={{color:theme.primaryColor,fontSize:'17px'}} className='nunito-font' leftIcon={<FontIcon className="material-icons" style={{color:theme.primaryColor}}>assignment_turned_in</FontIcon>}>Publish</MenuItem>}
        </Popover>

        <Section2 style={{padding:'40px 5px 40px 5px'}}>
          {onLoad ? <Onload><div className='row'><CircularProgress size={60} thickness={6} style={{width:'60px',margin:'0 auto 0 auto'}}/></div></Onload>:
          <Table >
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn style={{width:'40%'}}>Title</TableHeaderColumn>
                <TableHeaderColumn style={{width:'10%',textAlign:'center'}}>Writer</TableHeaderColumn>
                <TableHeaderColumn style={{width:'15%',textAlign:'center'}}>Column</TableHeaderColumn>
                <TableHeaderColumn style={{width:'15%'}}>Stats</TableHeaderColumn>
                <TableHeaderColumn style={{width:'15%'}}>{selectStatus===STATUS.PUBLISHED?'Published':'Drafted'}</TableHeaderColumn>
                <TableHeaderColumn style={{width:'5%'}}></TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              showRowHover={true}
              displayRowCheckbox={false}>
              { stories && stories.map((story, index) => (
                <TableRow key={index}>
                  <TableRowColumn style={{width:'40%',padding:'10px 0 10px 0'}}><StoryTitle story={story} selectStatus={selectStatus} /></TableRowColumn>
                  <TableRowColumn style={{width:'10%',paddingRight:0,paddingLeft:0,textAlign:'center'}}>{story.writer && <Link to={story.writer.url}>{story.writer.display}</Link>}</TableRowColumn>
                  <TableRowColumn style={{width:'15%',paddingRight:0,paddingLeft:0,textAlign:'center'}}>{story.column && <Link to={story.column.url}>{story.column.name}</Link>}</TableRowColumn>
                  <TableRowColumn style={{width:'15%'}}>{story.views || 0} Views<br/>{story.shares ? story.shares.total : 0} Shares</TableRowColumn>
                  <TableRowColumn style={{width:'15%',wordWrap:'break-word',whiteSpace:'pre-wrap'}}>{selectStatus===STATUS.PUBLISHED ? moment(story.published).format('lll') : moment(story.created).format('lll')}</TableRowColumn>
                  <TableHeaderColumn style={{width:'5%',paddingRight:0,paddingLeft:0,textAlign:'center',cursor:'pointer'}} ><FontIcon className='material-icons' onClick={(e)=>{this.editStory(e,story.id)}} style={{color:'#bfbfbf'}}>more_vert</FontIcon></TableHeaderColumn>
                </TableRow>
              )) }
            </TableBody>
          </Table>}
        </Section2>
        {totalPages > 0 && <Page>
          <Pagination
            currentPage={currentPage+1}
            totalPages={totalPages}
            onChange={this.changePage}
          />
        </Page>}
      </Container>
    )
  }
}

export default UserSettingStory;
