import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import styled from 'styled-components'
import {
	PrimaryButton,
	SecondaryButton,
	UploadPicture,
	DropdownWithIcon,
	Alert,
	MenuList,
  EditorCss,
  AnalyticContainer
} from 'components'
import { findDOMNode as dom } from 'react-dom'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import auth from '../../../services/auth'
import Snackbar from 'material-ui/Snackbar'
import FontIcon from 'material-ui/FontIcon'
import RaisedButton from 'material-ui/RaisedButton'
import Popover from 'material-ui/Popover'
import DropDownMenu from 'material-ui/DropDownMenu'
import AutoComplete from 'material-ui/AutoComplete'
import Chip from 'material-ui/Chip'
import moment from 'moment'
import CircularProgress from 'material-ui/CircularProgress'
import SwipeableViews from 'react-swipeable-views'
import {Helmet} from 'react-helmet'
import Request from 'superagent'
import api from '../../../services/api'
import config from '../../../config'

var MediumEditor = {}
if (process.env.BROWSER) {
  MediumEditor = require('medium-editor')
  window.MediumInsert = require('medium-editor-insert-plugin').MediumInsert
}

const Container = styled(EditorCss)`
  width:855px;
  padding:60px;
  border-bottom:1px solid #E2E2E2;
  h1{
    color:${props => props.theme.primaryColor};
    font-size:42px;
  }
`
const Paper = styled.div`
  position:relative;
  width:100%;
  min-height:500px;
  &:focus{
    outline: none;
  }
`
const HighlightBox = styled.div`
  width:100%;
  padding:2px;
  background: linear-gradient(135deg,  ${props => props.theme.primaryColor} 0%, ${props => props.theme.accentColor} 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
`
const Highlight = styled.div`
  position:relative;
  top:0;
  left:0;
  width:100%;
  background-color:white;
  padding:20px;
`
const HighlightText = styled.span`
  position:relative;
  top:10px;
  left:20px;
  z-index:5;
  color:${props=>props.theme.primaryColor};
  text-align:center;
  padding:0 9px;
  font-size:14px;
  font-weight:bold;
  font-family:'PT Sans';
  background:white;
  border-left:2px solid ${props=>props.theme.accentColor};
  border-right:2px solid ${props=>props.theme.accentColor};
`
const Title = styled.textarea`
  margin:15px 0 0 0;
  font-size:36px;
  font-weight:bold;
  overflowY:hidden;
  height:105px;
  color:#222;
  width:100%;
  outline: none;
  border:none;
  resize: none;
  &:focus{
    outline: none;
  }
`

const Divider = styled.div`
  width:100%;
  min-height:1px;
  margin:30px 0 30px 0;
  background-color:#bfbfbf;
`

const TextStatus = styled.div`
  font-size:15px;
  font-style:italic;
  color:${props => props.theme.accentColor};
  display:inline;
  float:right;
  padding:12px 20px 12px 20px;
`
const Layout = styled.div`
  width:307px;
  height:439px;
  background-position:center;
  background-size:cover;
  margin:0 auto 0 auto;
  &:hover{
    cursor:pointer;
    box-shadow: 0 0 10px ${props => props.theme.primaryColor};
  }
`
const Label = styled.div`
  color:#222;
  font-size:14px;
  display:inline;
  font-weight:bold;
`
const Label2 = styled.div`
  color:#222;
  font-size:19px;
  margin:20px auto 20px auto;
  font-weight:bold;
  width:50px;
`
const Delete = styled.div`
  font-family: 'Nunito', 'Mitr';
  color: #8E8E8E;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #222;
  }
`

const BasicSetting = styled.div`
`

const AdvanceSetting = styled.div`
`

const AdvancedEdit = styled.div`
  font-family: 'Nunito', 'Mitr';
  color: #8E8E8E;
  text-decoration: underline;
  cursor: pointer;
  float: right;
  display: inline-block;

  &:hover {
    color: #222;
  }
`

const HintLabel = styled.div`
  margin-left: 130px;
  color: #C2C2C2;
  font-style: italic;
  font-size: 11px;
  line-height: 8px;
`

const styles = {
	backButton: {
		color: '#8e8e8e',
		cursor: 'pointer',
		height: '20px'
	}
}

class NewStory extends React.Component {
  SAVE_STATUS = {
    'INITIAL': 0,
    'DIRTIED': 1,
    'UNDIRTIED': 2
  }

  state = {
    //story:'Write a story ...',
    story: {},
    chooseLayout:null,
    layout:'',
    open:false,
    column:null,
    contentType:'NEWS',
    html: '',
    highglight: '',

    focusWord: '',
    tag:[],
    addTag:[],
    pureTag:[],
    searchText:'',

    columnList:[],
    contentTypeList:[],
    sid:null,
    saveStatus:null,

    alert:false,

    title:'',
    slug:'',
    metaDesc:'',
    metaTitle:'',
    hintDesc:'',

    saveOnload:false,
    publishStatus:'',

    status: this.SAVE_STATUS.INITIAL,
    settingSlideIndex: 0
  }
  static contextTypes = {
    setting: PropTypes.object
  }

  chooseLayout = (layout) => {
    this.setState({layout})
  }

  selectedLayout = () => {
    this.setState({chooseLayout:1},()=>{
      this.editor = new MediumEditor('#paper',{
        toolbar: {
          buttons: [
              {name: 'bold',contentDefault: '<span class="fa fa-bold" ></span>',tagNames: ['strong']},
              {name: 'italic',contentDefault: '<span class="fa fa-italic" ></span>',tagNames: ['em']},
              {name: 'underline',contentDefault: '<span class="fa fa-underline" ></span>',},
              {
                  name: 'h1',
                  action: 'append-h2',
                  aria: 'Header',
                  tagNames: ['h2'],
                  style:{ prop: 'font-size', value: '28px' },
                  contentDefault: '<span class="fa fa-header" style="font-size:24px"><span>',
                  attrs: {'data-custom-attr': 'attr-value-h1'}
              },
              {
                  name: 'h2',
                  action: 'append-h3',
                  aria: 'Subheader',
                  tagNames: ['h3'],
                  contentDefault: '<span class="fa fa-header" style="font-size:14px"><span>',
                  attrs: {'data-custom-attr': 'attr-value-h2'}
              },
              {name: 'quote',contentDefault: '<span class="fa fa-quote-left" ></span>'},
              {name: 'anchor',contentDefault: '<span class="fa fa-link" ></span>'},
              {name: 'unorderedlist',contentDefault: '<span class="fa fa-list-ul" ></span>'},
              {name: 'justifyLeft',contentDefault: '<span class="fa fa-align-left" ></span>'},
              {name: 'justifyCenter',contentDefault: '<span class="fa fa-align-center" ></span>'},
              {name: 'justifyRight',contentDefault: '<span class="fa fa-align-right" ></span>'}
          ]
        },
        targetBlank: true,
        placeholder: {
          text: 'Write a story ...'
        }
      });

      $('#paper').mediumInsert({
          editor: this.editor,
          addons: {
              images: {
                captionPlaceholder: 'Type caption for image',
                fileUploadOptions: { // (object) File upload configuration. See https://github.com/blueimp/jQuery-File-Upload/wiki/Options
                    url: '/upload/img', // (string) A relative path to an upload script
                    preview:false,
                    maxChunkSize:10000000,
                    maxFileSize:10000000,
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i, // (regexp) Regexp of accepted file types
                    submit:function(e,data){
                      $('.medium-insert-active').append('<div class="container-loader"><div class="loader"></div></div>')
                    },
                },
                uploadCompleted:function ($el, data) {
                  $('.container-loader').remove()
                },
                styles: {
                  grid: {
                    label: ''
                  }
                  // full: {
                  //     label: this.state.layout=='article'?'<span class="fa fa-window-maximize"></span>':''
                  // }
                }
            },
            embeds: {
              label: '<span class="fa fa-code"></span>',
              parseOnPaste:true,
              oembedProxy:null 
            }
          }
      });

      this.editor2 = new MediumEditor('#highlight', {
        toolbar: {
          buttons: [
              {name: 'bold',contentDefault: '<span class="fa fa-bold" ></span>'},
              {name: 'italic',contentDefault: '<span class="fa fa-italic" ></span>'},
              {name: 'underline',contentDefault: '<span class="fa fa-underline" ></span>',},
              {name: 'anchor',contentDefault: '<span class="fa fa-link" ></span>'},
              {name: 'unorderedlist',contentDefault: '<span class="fa fa-list-ul" ></span>'},
              {name: 'orderedlist',contentDefault: '<span class="fa fa-list-ol" ></span>'}
          ]
        },
        targetBlank: true,
        placeholder: {
          text: 'Highlight'
        }
      });

      this.editor.subscribe('editableInput', this.handleEditableInput);
      this.editor2.subscribe('editableInput', this.handleEditableInput);
      this.interval = setInterval(this.autoSave, 3000)
    })
  }

   changeFocusWord = (e) => {
    if(this.state.status===this.SAVE_STATUS.DIRTIED)
      this.setState({
        focusWord:e.target.value,
        saveStatus:'Unsave'
      })
    else
      this.setState({
        focusWord:e.target.value,
        status:this.SAVE_STATUS.DIRTIED,
        saveStatus:'Unsave'
      })
  }

  handleEditableInput = (e, editable) => {
    if(this.state.status === this.SAVE_STATUS.INITIAL)
      this.setState({
        status: this.SAVE_STATUS.UNDIRTIED,
        saveStatus:''
      })
    else
      this.setState({
        status: this.SAVE_STATUS.DIRTIED,
        saveStatus:'Unsave'
      })
      this.findDescription()
  }

  findDescription = (maxLength = 140) => {
    if (document.getElementsByTagName('p')) {
      const story = document.getElementsByTagName('p')
      let description = ''

      for (let i = 0; i < story.length; i++) {
        let item = story[i].innerHTML
        description += item + ' '

        if (description.length > maxLength) {
          description = description.substring(0, maxLength) + '...'
          break
        }
      }
      this.setState({hintDesc:description})
    }
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
      settingSlideIndex: 0
    })
  }

  popoverSave = (e) => {
    this.setState({
      open:true,
      anchorEl:e.currentTarget
    })
  }

  chooseColumn = (e,ind,val) => {
    this.setState({
      column:val,
      status: this.SAVE_STATUS.DIRTIED,
      saveStatus:'Unsave'
    })
  }

  chooseContentType = (e,ind,val) => {
    const contentType = this.state.contentTypeList[val]
    this.setState({
      contentType,
      status: this.SAVE_STATUS.DIRTIED,
      saveStatus:'Unsave'
    })
  }

  getTags = () => {
    api.getTags()
    .then(tags => {
      let result = []
      tags.map((tag, i) => {
        result[i] = { text:tag.name, value:i, id:tag._id }
      })

      this.setState({
        tag:result,
        pureTag:tags
      })
    })
  }

  getColumns = () => {
    api.getColumns()
    .then(cols => {
      this.setState({columnList: cols})
    })
  }

  getContentType = () => {
    api.getContentTypes()
    .then(types => {
      this.setState({contentTypeList: types})
    })
  }

  autoSave = () => {
    let {prevState,sid,title,column,contentType,focusWord,story} = this.state
    if(this.state.sid){
      if(this.state.status === this.SAVE_STATUS.DIRTIED){
        const images = [].slice.call(dom(this.refs.paper).getElementsByTagName('img'))

        if (images) {
          images.map((value, index) => {
            value.setAttribute("alt", title)
          })
        }

        let allContents = this.editor.serialize()
        let el =  allContents.paper.value
        let highlight = this.editor2.serialize().highlight.value
        let s = {
          title:title,
          publisher:parseInt(config.PID),
          html:el,
          focusWord:focusWord,
          meta:story.meta,
          highlight
        }
        if(column) s.column = column
        s.contentType = contentType

        this.setState({
          saveStatus:'saving...',
          html:el,
          highlight,
        })

        api.updateStory(sid, s)
        .then(story => {
          this.setState({
            status: this.SAVE_STATUS.UNDIRTIED,
            saveStatus:"Saved "+ moment(new Date()).calendar(),
            slug:story.slug,
            metaTitle:story.meta&&story.meta.title,
            metaDesc:story.meta&&story.meta.desc
          })
        })
      }

    } else {
      //if(el!='<p><br></p>'||title!=''){
      if(this.state.status === this.SAVE_STATUS.DIRTIED){
        const images = [].slice.call(dom(this.refs.paper).getElementsByTagName('img'))

        if (images) {
          images.map((value, index) => {
            value.setAttribute("alt", title)
          })
        }

        let allContents = this.editor.serialize()
        let el =  allContents.paper.value
        let highlight = this.editor2.serialize().highlight.value
        let s = {
          title:title,
          publisher:parseInt(config.PID),
          html:el,
          highlight,
          format:this.state.layout
        }
        //console.log(s)
        if(column) s.column = column
        s.contentType = contentType

        api.createStory(s)
        .then(story => {
          //console.log(story)
          this.setState({
            status: this.SAVE_STATUS.UNDIRTIED,
            sid:story._id,
            story: story,
            saveStatus:"Saved "+ moment(story.updated).calendar()
          })
        })
      }

    }
  }

  publishStory = () => {
    let {sid,column,columnList,contentType,title,focusWord,story} = this.state
    let allContents = this.editor.serialize()
    let highlight = this.editor2.serialize().highlight.value

    let s = {
      title:title,
      publisher:parseInt(config.PID),
      status:1,
      focusWord:focusWord,
      html:allContents.paper.value,
      format: (columnList.find(col => col._id == column).name == 'news' 
      || columnList.find(col => col._id == column).name =='News') ? 'NEWS' : 'ARTICLE',
      meta:story.meta,
      highlight
    }
    if(column!='no') s.column = column
    s.contentType = contentType

    api.updateStory(sid, s)
    .then(story => {
      this.props.history.push(story.url)
    })
    .catch(err => {
      this.setState({
        publishStatus: err.message,
        open:false
      })
    })
  }

  unpublishStory = (e) => {
    api.updateStory(this.state.sid, {status:0})
    .then(story => {
      this.setState({
        sid: story._id,
        saveStatus: "Story has been unpublished.",
        open:false,
        story: {
          status: 0
        }
      })
    })
    .catch(err => {
      this.setState({
        publishStatus: err.message,
        open:false
      })
    })
  }

  deleteStory = () => {
    api.deleteStory(this.state.sid)
    .then(() => {
      this.props.history.push('/me/stories')
    })
  }

  selectedTag = (sel,index) => {
    var {tag,addTag,pureTag,sid} = this.state
    //console.log(sel)
    Request
    .post(config.BACKURL+'/stories/'+sid+'/tags/'+sel.id+'?token='+auth.getToken())
    .end((err,res)=>{
      if(err)throw err
      else{
        var addedTag = addTag
        var allTag = pureTag
        addedTag.push(sel)
        var Tag = tag
        var newTag = tag
        Tag.map((data,index)=>{
          if(data.text==sel.text){
            newTag.splice(index,1)
          }
        })

        this.setState({
          addTag:addedTag,
          searchText:'',
          tag:newTag
        })
      }
    })
  }

  removeSelectedTag = (data,index) => {
    var {sid,tag,addTag} = this.state
    //console.log(data)
    Request
    .delete(config.BACKURL+'/stories/'+sid+'/tags/'+data.id+'?token='+auth.getToken())
    .end((err,res)=>{
      if(err)throw err
      else{
          var Tag = tag
          Tag.push(data)
          var addedTag = addTag
          addedTag.splice(index,1)

          this.setState({
            tag:Tag,
            addTag:addedTag
          })
      }
    })
  }

  handleUpdateInput = (searchText) => {
    this.setState({
      searchText: searchText,
    });
  }

  alertClose = () => {
    this.setState({alert:false})
  }

  showAlert = (e) => {
    this.setState({
      alert:true,
      alertWhere:e.currentTarget,
      alertDesc:'Are you sure to delete this story ?',
      alertConfirm:this.deleteStory
    })
  }

  titleChanged = (e) => {
    if(this.state.status===this.SAVE_STATUS.DIRTIED)
      this.setState({
        title:e.target.value,
        saveStatus:'Unsave'
      })
    else
      this.setState({
        title:e.target.value,
        status:this.SAVE_STATUS.DIRTIED,
        saveStatus:'Unsave'
      })
  }

  settingHandleChange = (value) => {
    this.setState({
      settingSlideIndex: value
    })
  }

  changeSlug = (e) => {
    this.setState({slug:e.target.value})
  }

  changeTitle = (e) => {
    this.setState({metaTitle:e.target.value})
  }

  changeDesc = (e) => {
    this.setState({metaDesc:e.target.value})
  }

  changeMeta = () => {
    var sid =this.state.sid
    var slug = this.state.slug
    var title = this.state.metaTitle
    var desc = this.state.metaDesc
    var s = {
      slug,
      meta:{
        title,
        desc
      }
    }
    api.updateStory(sid, s).then((story)=>{
      this.setState({
        story
      })
    })
  }

  resetMeta = () => {
    var s = this.state.story
    //console.log(s)
    this.setState({
      slug:s.slug,
      metaTitle:s.meta.title,
      metaDesc:s.meta.desc
    })
  }

  componentDidMount(){
    this.getTags()
    this.getColumns()
    this.getContentType()
  }

  componentWillUnmount(){
    clearInterval(this.interval);

    if(this.state.chooseLayout!=null){
      this.editor.destroy()
      this.editor2.destroy()
    }
  }

  render(){
    let {chooseLayout,layout,open,anchorEl,column,contentType,tag,addTag,searchText,
      columnList,contentTypeList,sid,alert,alertWhere,alertConfirm,alertDesc,saveStatus,
      title,publishStatus, story, slug,metaTitle,metaDesc,hintDesc,html,focusWord,highlight} = this.state
    const dataSourceConfig = {text: 'text',value: 'value',id:'id'};
    let {theme} = this.context.setting.publisher

    let contentTypeId = 0
    for (let i = 0; i < contentTypeList.length; i ++) {
      if (contentTypeList[i] == contentType) {
        contentTypeId = i
      }
    }

    return (
      chooseLayout==null?
      <Container onSubmit={this.updateData}>
        <h1 className='nunito-font'>Choose Layout</h1>
        <div className='row' style={{marginTop:'60px',padding:'10px'}}>
          <div className='col-6'>
            <Label2 className="nunito-font" >News</Label2>
            <Layout style={{backgroundImage:'url(/pic/news.png)',boxShadow:layout=="NEWS"?'0 0 10px '+theme.primaryColor:''}} onClick={() => this.chooseLayout('NEWS')} />
          </div>
          <div className='col-6'>
            <Label2 className="nunito-font" >Article</Label2>
            <Layout style={{backgroundImage:'url(/pic/article.png)',boxShadow:layout=="ARTICLE"?'0 0 10px '+theme.primaryColor:''}} onClick={() => this.chooseLayout('ARTICLE')} />
          </div>
        </div>
        <div className='row' style={{display:'block',overflow:'hidden',marginTop:'50px'}}>
          <RaisedButton
            label="next"
            labelStyle={{fontWeight:'bold', fontSize:15, top:0, fontFamily:"'Nunito', 'Mitr'"}}
            labelColor='#fff'
            onClick={this.selectedLayout}
            labelPosition="before"
            overlayStyle={{borderRadius: '20px'}}
            rippleStyle={{borderRadius: '20px'}}
            style={{borderRadius:'20px', height:'40px', lineHeight:'40px', background:theme.primaryColor, boxShadow:'none',float:'right',visibility:layout==null?'hidden':'visible'}}
            buttonStyle={{borderRadius: '20px', background: theme.accentColor, border:'2px solid '+theme.accentColor, padding:'0 2px'}}
            icon={<FontIcon className='material-icons'>keyboard_arrow_right</FontIcon>}
          />
        </div>
      </Container>
      :
      <Container onSubmit={this.updateData}>
        {/*<Helmet>
          <link rel="stylesheet" href="/css/medium-editor.css" type="text/css" />
          <link rel="stylesheet" href="/css/tim.css" type="text/css" />
          <link rel="stylesheet" href="/css/medium-editor-insert-plugin.css" type="text/css" />
        </Helmet>*/}
        <Alert
          open={alert}
          anchorEl={alertWhere}
          onRequestClose={this.alertClose}
          description={alertDesc}
          confirm={alertConfirm}/>
        <RaisedButton
          onClick={this.popoverSave}
          label="Publish"
          labelStyle={{fontWeight:'bold', fontSize:15, top:0, fontFamily:"'Nunito', 'Mitr'"}}
          labelColor='#fff'
          labelPosition="before"
          overlayStyle={{borderRadius: '20px'}}
          rippleStyle={{borderRadius: '20px'}}
          style={{borderRadius:'20px', height:'40px', lineHeight:'40px', background:theme.accentColor, boxShadow:'none',float:'right',visibility:sid!=null?'visible':'hidden'}}
          buttonStyle={{borderRadius: '20px', background: theme.accentColor, border:'2px solid '+theme.accentColor, padding:'0 2px'}}
          icon={<FontIcon className='material-icons'>keyboard_arrow_down</FontIcon>}
        >
        <Popover
          open={open}
          anchorEl={anchorEl}
          autoCloseWhenOffScreen={false}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          style={{border:'3px solid '+theme.accentColor,width:'490px',padding:'30px',marginTop:8,boxShadow:'none',overflow:'hidden'}}
        >
        <SwipeableViews
          index={this.state.settingSlideIndex}
          onChangeIndex={this.settingHandleChange}
        >
          <BasicSetting>
            <AdvancedEdit onClick={() => this.settingHandleChange(1)}>Advanced Edit</AdvancedEdit>
            <div className='' style={{display:'block', clear:'both'}}>
              <Label className="nunito-font or" style={{float:'left',marginTop:'22px',minWidth:'60px'}}>Column: </Label>
              <SelectField
                hintText='Please Select Column First'
                value={column}
                onChange={this.chooseColumn}
                autoWidth={false}
                hintStyle={{top:'5px',left:'24px'}}
                labelStyle={{top:'-11px',left:'24px'}}
                iconStyle={{top:'-8px',left:'300px'}}
                style={{margin:'15px 0 15px 15px',width:'340px',height:'34px',border:'1px solid #e2e2e2',float:'left'}}
                underlineStyle={{display:'none'}}
                menuStyle={{width:'320px'}}
                menuItemStyle={{width:'320px'}}
                selectedMenuItemStyle={{color:'#222',background:theme.accentColor}}
              >
                {columnList.length!=0 && columnList.map((data,index)=>(
                  <MenuItem value={data._id} primaryText={data.name} key={index} />
                ))}
              </SelectField>
              <Label className="nunito-font or" style={{float:'left',marginTop:'22px',minWidth:'60px'}}>Type: </Label>
              <DropDownMenu
                value={contentTypeId}
                onChange={this.chooseContentType}
                autoWidth={false}
                labelStyle={{top:'-11px'}}
                iconStyle={{top:'-8px',left:'300px'}}
                style={{margin:'15px 0 15px 15px',width:'340px',height:'34px',border:'1px solid #e2e2e2',float:'left'}}
                underlineStyle={{display:'none'}}
                menuStyle={{width:'320px'}}
                menuItemStyle={{width:'320px'}}
                selectedMenuItemStyle={{color:'#222',background:theme.accentColor}}
              >
                <MenuItem value='no' primaryText='No Type' />
                {contentTypeList.length!=0 && contentTypeList.map((data,index)=>(
                  <MenuItem value={index} primaryText={data} key={index} />
                ))}
              </DropDownMenu>
              <Label className="nunito-font or" style={{float:'left',marginTop:'22px',minWidth:'60px'}}>Focus Word : </Label>
              <TextField
                value = {this.state.focusWord}
                onChange={this.changeFocusWord}
                hintText="Enter Keyword"
                style={{width:'280px',float:'right'}}
              />
            </div>
            <div className='' style={{display:'block',overflow:'hidden', clear:'both'}}>
              <Label className="nunito-font" style={{float:'left',marginTop:'26px'}}>Add up to 5 tags: </Label>
              <div className='row' style={{marginTop:'15px'}}>
                {addTag.length!=0?addTag.map((data,index)=>(
                  <Chip
                    key={index}
                    onRequestDelete={() => this.removeSelectedTag(data,index)}
                    style={{margin:'4px'}}
                  >
                    {data.text}
                  </Chip>
                )):''}
                {tag.length!=0?<AutoComplete
                  hintText="Add a Tag..."
                  dataSource={tag}
                  filter={AutoComplete.fuzzyFilter}
                  onNewRequest={this.selectedTag}
                  onUpdateInput={this.handleUpdateInput}
                  openOnFocus={true}
                  searchText={searchText}
                  dataSourceConfig={dataSourceConfig}
                />:''}
              </div>
            </div>
            <Divider/>
            {/*<div>
              <Label className="nunito-font" >Select cover picture : </Label>
              <div className='row' style={{overflow:'hidden',marginTop:'20px'}}>
                <div className='col-4'>
                  <UploadPicture ratio={330/500} path={'/stories/'+sid+'/covermobile'} src={story.coverMobile&&story.coverMobile.medium} size='330x500' width={96} height={137} label='Portrait Cover' type='coverMobile' style={{width:'96px',height:'137px',margin:'0 auto 0 auto'}} labelStyle={{top:'60px'}}/>
                </div>
                <div className='col-1'>
                  <div style={{marginTop:'58px'}}>Or</div>
                </div>
                <div className='col-6'>
                  <UploadPicture ratio={1920/860} path={'/stories/'+sid+'/cover'} src={story.cover&&story.cover.medium} size='1920x860' width={194} height={137} label='Landscape Cover' type='cover' style={{width:'194px',height:'137px',margin:'0 auto 0 auto'}} labelStyle={{top:'60px'}}/>
                </div>
              </div>
            </div>*/}
            <div className='' style={{overflow:'hidden',display:'block'}}>
              <TextStatus className='sans-font' style={{color:'#DC143C',float:'right',marginTop:'30px'}}>{publishStatus}</TextStatus>
            </div>
            <div className='row' style={{display:'block',overflow:'hidden',marginTop:'0px'}}>
              <Delete style={{float:'left',margin:'10px'}} onClick={this.showAlert}>Delete</Delete>
              <PrimaryButton label={story.status===1 ? moment(story.published).format('ddd, [at] h:mm a') : 'Publish'} style={{float:'right'}} onClick={this.publishStory} disabled={!column}/>
              {story.status===1 && <SecondaryButton label="Unpublish" style={{float:'right',marginRight:'20px'}} onClick={this.unpublishStory}/>}
            </div>
          </BasicSetting>
          <AdvanceSetting>
            <FontIcon className='material-icons'
              style={styles.backButton}
              onClick={() => this.settingHandleChange(0)}
            >
              chevron_left
            </FontIcon>
            <div className='row' style={{display:'block', overflow:'hidden'}}>
              <Label className="nunito-font or" style={{float:'left', margin:'19px 15px auto', minWidth:'80px'}}>URL: </Label>
              <TextField hintText={story.slug} name='slug' value={slug} onChange={this.changeSlug}/><br/>
              <Label className="nunito-font or" style={{float:'left', margin:'19px 15px auto', minWidth:'80px'}}>Title: </Label>
              <TextField hintText={title} name='metaTitle' value={metaTitle} onChange={this.changeTitle}/><br/>
              <Label className="nunito-font or" style={{float:'left', margin:'19px 15px auto', minWidth:'80px'}}>Description: </Label>
              <TextField hintText={hintDesc} name='metaDesc' value={metaDesc} onChange={this.changeDesc} multiLine={true} rows={1} rowsMax={5}/><br/>
              <HintLabel className='sans-font'>140 characters</HintLabel>

              <div style={{marginTop: '35px'}}>
                <SecondaryButton label='Reset' style={{float: 'right'}} onClick={this.resetMeta}/>
                <PrimaryButton label='Save' style={{float: 'right', marginRight:'10px'}} onClick={this.changeMeta}/>
              </div>
            </div>
          </AdvanceSetting>
        </SwipeableViews>
        </Popover>
        </RaisedButton>
        {sid!=null && <TextStatus className='sans-font'>{saveStatus}</TextStatus>}
        {sid&&<div>
          {/*<Label className="nunito-font" >Select cover picture: </Label>*/}
          <div className='row' style={{overflow:'hidden',margin:'100px 0 20px 0',paddingBottom:'40px',borderBottom:'1px solid #8E8E8E'}}>
            <div className='col-6'>
              <UploadPicture ratio={1200/628} path={'/stories/'+sid+'/cover'} src={story.cover&&story.cover.medium} size='1920x860' width={300} height={170} label='Landscape Cover' type='cover' style={{width:'194px',height:'137px',margin:'0 auto 0 auto'}} />
            </div>
            <div className='col-6'>
              <UploadPicture ratio={330/500} path={'/stories/'+sid+'/covermobile'} src={story.coverMobile&&story.coverMobile.medium} size='330x500' width={120} height={170} label='Portrait Cover' type='coverMobile' style={{width:'96px',height:'137px',margin:'0 auto 0 auto'}} />
            </div>
          </div>
        </div>}
        <Title placeholder='Title' className='serif-font' value={title} onChange={this.titleChanged}/>
        <div>
          <HighlightText>HIGHLIGHT</HighlightText>
          <HighlightBox>
            <Highlight ref='highlight' id='highlight'/>
          </HighlightBox>
        </div>
        <Paper ref='paper'  id='paper' />
        <Divider/>
				<AnalyticContainer content={html} focusWord={focusWord} title={title} highlight={highlight} />
      </Container>
    )
  }
}

export default NewStory
