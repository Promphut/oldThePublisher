import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {PrimaryButton,SecondaryButton,UploadPicture,MetaDataDemo} from 'components'
import TextField from 'material-ui/TextField';
import api from '../../../services/api'
import utils from '../../../services/utils'
import cloneDeep from 'lodash/cloneDeep'
import config from '../../../config'

const Container = styled.form`
  width:100%;
  padding:0px 80px 80px 80px;
  .textTitle{
    color:#C2C2C2;
    font-family:'PT Sas';
    font-size:17px;
  }
  .head{
    color:#C2C2C2;
    font-family:'Nunito';
    font-size:18px;
  }
`

const Flex = styled.div`
  display:flex;
  items-align:center;
  flex-flow: row wrap;
  margin:50px 0 0 0;
`

const Title = styled.div`
  flex:2 150px;
  max-width:150px;
  color:#C2C2C2;
  font-size:17px;
  padding-top:15px;
`

const Edit = styled.div`
  flex:6 450px;
  max-width:450px;
`

const Social = styled.div`
  color:#8F8F8F;
  font-size:19px;
  overflow:hidden;
`

const TextStatus = styled.div`
  color:${props=> props.theme.primaryColor};
  font-size:15px;
  font-style:italic;
  margin:10px 20px 0 15px;
`

class PublisherProfileSetting extends React.Component {
  state = {
    publisher: {
      channels: {
        fb:'',
        twt:'',
        ig:'',
        yt:''
      },
      name:'',
      tagline:'',
      cover: {
        medium: ''
      },
      keywords:'',
      desc:''
    },

    error:false,
    textStatus:'',
    errText:''
    //uploadPhoto:null
  }

  static contextTypes = {
    setting: PropTypes.object
  }

  publisherChanged = (e) => {
    const name = e.target.name
    if(name=='tagline'){
      var val = e.target.value.split('')
      if(val.length>=80){
        this.setState({
          errText:'Maximun characters'
        })
        return
      } else {
        this.setState({
          errText:''
        })
      }
    }
    let pub = cloneDeep(this.state.publisher)
    utils.dotToObj(pub, name, e.target.value)
    //console.log('publisherChanged', pub, name, e.target.value)
    this.setState({
      publisher: pub
    })
  }

  updatePublisher = (e) => {
    if(e) e.preventDefault()

    api.updatePublisher(this.state.publisher)
    .then(pub => {
      this.publisher = pub

      this.setState({
        textStatus:'Saved successfully',
        error:false
      })
    })
    .catch(err => {
      this.setState({
        textStatus:res.body.error.message,
        error:true
      })
    })
  }

  resetDate = (e) => {
    if(e) e.preventDefault()

    this.setState({
      publisher: this.publisher
    })
  }

  componentWillReceiveProps(nextProps){
    this.publisher = cloneDeep(nextProps.publisher) // saved for reset

    this.setState({
      publisher: nextProps.publisher
    })
  }

  render(){
    let {textStatus,error,errText} = this.state
    let pub = this.state.publisher
    let {theme} = this.context.setting.publisher

    //console.log('render', pub)
    return (
      <Container onSubmit={this.updatePublisher}>
        <Flex>
          <Title>
            <div className="sans-font">Title</div>
          </Title>
          <Edit>
            <TextField
              value={pub.name}
              name='name'
              onChange={this.publisherChanged}
            />
          </Edit>
        </Flex>
        <Flex>
          <Title>
            <div className="sans-font">Description</div>
          </Title>
          <Edit>
            <TextField
              value={pub.desc}
              name='desc'
              onChange={this.publisherChanged}
            />
          </Edit>
        </Flex>
        <Title style={{marginTop:'50px'}}>
          <div className="sans-font">Example</div>
        </Title>
        <TextStatus className='sans-font' style={{color:"#C4C4C4",margin:'15px 0 5px 0'}}>Google Search Result</TextStatus>
        <MetaDataDemo style={{margin:'5px 0 5px 0'}} title={pub.name} description={pub.desc} keyword={pub.keywords} tagline={pub.tagline}/>
        <TextStatus className='sans-font' style={{color:"#C4C4C4",margin:'15px 0 5px 0'}}>Facebook Share</TextStatus>
        <div style={{border:'1px solid #c4c4c4',width:'350px'}}>
          <div style={{background:'#f4f4f4',width:'100%',height:'140px'}}></div>
          <div style={{background:'white',width:'100%'}}>
            <div style={{color:"#222",fontSize:'18px',margin:'5px 15px'}} className='sans-font'>{pub.name||'Title'}</div>
            <div style={{color:"#545454",fontSize:'14px',margin:'5px 15px'}} className='sans-font'>{pub.desc||'This is a description'}</div>
            <TextStatus className='sans-font' style={{color:"#C4C4C4",margin:'5px 15px',display:'block',clear:'both'}}>{config.FRONTURL}</TextStatus>
          </div>
        </div>

        <Flex>
          <Title>
            <div className="sans-font">Keywords</div>
          </Title>
          <Edit>
            <TextField
              value={pub.keywords}
              name='keywords'
              floatingLabelText="Comma separated"
              floatingLabelFixed={true}
              onChange={this.publisherChanged}
            />
          </Edit>
        </Flex>
        <Flex>
          <Title>
            <div className="sans-font">Tagline</div>
          </Title>
          <Edit>
            <TextField
              value={pub.tagline}
              multiLine={true}
              fullWidth={true}
              floatingLabelText="80 characters"
              floatingLabelFixed={true}
              rows={1}
              rowsMax={10}
              name='tagline'
              onChange={this.publisherChanged}
              errorText={errText}
            />
          </Edit>
        </Flex>
        <Flex>
          <Title>
            <div className="sans-font">Social Channels</div>
          </Title>
          <Edit>
            <Social className="sans-font">
              <i className="fa fa-facebook" style={{float:'left',margin:'20px 20px 0 0'}} aria-hidden="true"></i>
              <div style={{float:'left',margin:'15px 20px 0 0'}}>facebook.com/</div>
              <TextField style={{float:'left',margin:'5px 0 0 0'}} name='channels.fb' value={pub.channels && pub.channels.fb} onChange={this.publisherChanged} />
            </Social>
            <Social className="sans-font">
              <i className="fa fa-twitter" style={{float:'left',margin:'20px 20px 0 0'}} aria-hidden="true"></i>
              <div style={{float:'left',margin:'15px 20px 0 0'}}>twitter.com/</div>
              <TextField style={{float:'left',margin:'5px 0 0 0'}} name='channels.twt' value={pub.channels && pub.channels.twt} onChange={this.publisherChanged} />
            </Social>
            <Social className="sans-font">
              <i className="fa fa-instagram" style={{float:'left',margin:'20px 20px 0 0'}} aria-hidden="true"></i>
              <div style={{float:'left',margin:'15px 20px 0 0'}}>instagram.com/</div>
              <TextField style={{float:'left',margin:'5px 0 0 0'}} name='channels.ig' value={pub.channels && pub.channels.ig} onChange={this.publisherChanged} />
            </Social>
            <Social className="sans-font">
              <i className="fa fa-youtube-play" style={{float:'left',margin:'20px 20px 0 0'}} aria-hidden="true"></i>
              <div style={{float:'left',margin:'15px 20px 0 0'}}>youtube.com/</div>
              <TextField style={{float:'left',margin:'5px 0 0 0'}} name='channels.yt' value={pub.channels && pub.channels.yt} onChange={this.publisherChanged} />
            </Social>
          </Edit>
        </Flex>
        <div className='sans-font' style={{marginTop:'50px',overflow:'hidden'}}>
          <PrimaryButton label='Save' type='submit' style={{float:'right',margin:'0 20px 0 0'}}/>
          <SecondaryButton label='Reset' onClick={this.resetDate} style={{float:'right',margin:'0 20px 0 0'}}/>
          <TextStatus  style={{color:error?'#D8000C':theme.accentColor,float:'right'}}>{textStatus}</TextStatus>
        </div>
      </Container>
    )
  }
}

export default PublisherProfileSetting
