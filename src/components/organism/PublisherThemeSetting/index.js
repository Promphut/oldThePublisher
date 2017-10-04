import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {PrimaryButton,SecondaryButton,UploadPicture,LogoLink,BGImg} from 'components'
import TextField from 'material-ui/TextField';
import { ChromePicker } from 'react-color';
import {findDOMNode as dom} from 'react-dom'
import Menu from 'material-ui/Menu'
import Popover from 'material-ui/Popover';
import Request from 'superagent'
import auth from '../../../services/auth'
import RaisedButton from 'material-ui/RaisedButton'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import config from '../../../config'

const Container = styled.form`
  width:100%;
  padding:0px 80px 80px 80px;
  border-bottom:1px solid #E2E2E2;
  .textTitle{
    color:#C2C2C2;
    font-family:'PT Sas';
    font-size:17px;
  }
  .head{
    color:#C2C2C2;
    font-family:'Nunito';
    font-size:18px;
    text-transform: uppercase;
  }
  .backgroundClip{
    background-clip:text;
    text-fill-color: transparent;
    -Webkit-background-clip:text;
    -Webkit-text-fill-color: transparent;
  }
  .bg1{
    background-color:${props=> props.theme.primaryColor};
  }
  .bg2{
    background-color:#4FC2C3;
  }
  .bg3{
    background-color:#85CDCE;
  }
  .bg4{
    background-color:#9BD0D0;
  }
  .bg5{
    background-color:#BAE7E9;
  }
  .bg6{
    background-color:#DAF8F9;
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
  padding-top:15px;
`

const TextStatus = styled.div`
  color:${props=> props.theme.primaryColor};
  font-size:15px;
  font-style:italic;
  float:left;
  margin:10px 20px 0 15px;
`

const Color = styled.div`
  width:22px;
  height:22px;
  float:left;
`

const BoxColor = styled.div`
  display:inline;
  margin:10px 30px 0 0;
  &:hover{
    cursor:pointer;
  }
`

const Desc = styled.div`
  color:#C2C2C2;
  font-size:14px;
  font-style:italic;
  display:inline;
  width:350px;
  margin:8px 0 0 0;
`

const Example = styled.div`
  width:100%;
  height:175px;
  padding:15px;
  font-size:11px;
  margin-bottom:10px;
`
const ShadeColor = styled.div`
  height:44px;
  width:100%;
`

const Topbar = styled.div`
  display:flex;
  width:100%;
  height:40px;
  border:1px solid #c4c4c4;
`
const BreakLine = styled.div`
  width:100%;
  height:1px;
  background-color:#E2E2E2;
  margin:50px 0;
`


class PublisherThemeSetting extends React.Component {
  state = {
    publisher:{},
    error:false,
    textStatus:'',
    open1: false,
    open2: false,
    open3: false,

    colorTheme:'light',
    primaryColor:'',
    secondaryColor:'',
    accentColor:'',

    uploadFavicon:null,
    uploadLogo:null,
    uploadSLogo:null
  }

  static contextTypes = {
    setting: PropTypes.object
  }

  handleTouchTap1 = (event) => {
    event.preventDefault();
    this.setState({
      open1: true,
      anchorEl1: event.currentTarget,
    });
  }
  handleTouchTap2 = (event) => {
    event.preventDefault();
    this.setState({
      open2: true,
      anchorEl2: event.currentTarget,
    });
  }
  handleTouchTap3 = (event) => {
    event.preventDefault();
    this.setState({
      open3: true,
      anchorEl3: event.currentTarget,
    });
  }

  handleRequestClose = () => {
    this.setState({
      open1: false,
      open2: false,
      open3: false,
    });
  }

  selectColor1 = (color) => {
    this.setState({ primaryColor: color.hex });
  }
  selectColor2 = (color) => {
    this.setState({ secondaryColor: color.hex });
  }
  selectColor3 = (color) => {
    this.setState({ accentColor: color.hex });
  }

  setData = () => {
    let {theme} = this.state.publisher
    //document.getElementById('analytic').value = typeof analytic == "undefined" ?'': analytic.tagManagerId
    this.setState({
      primaryColor: !theme.primaryColor? '#00B2B4': theme.primaryColor,
      secondaryColor: !theme.secondaryColor? '#CEF1B7': theme.secondaryColor,
      accentColor:!theme.accentColor? '#00B2B4': theme.accentColor,
      colorTheme: !theme.barTone? '#00B2B4': theme.barTone,
      uploadFavicon:theme.favicon,
      uploadLogo:theme.logo,
      uploadSLogo:theme.slogo
    })
  }

  getPublisherId = () => {
    let user = auth.getUser()

    Request
    .get(config.BACKURL+'/publishers/'+config.PID)
    .set('Accept','application/json')
    .end((err,res)=>{
      if(err) throw err
      else{
        //console.log('publisher', res.body.publisher)
        this.setState({publisher:res.body.publisher})
        this.setData()
      }
    })
  }

  updateData = (e) => {
    e.preventDefault()

    let data ={
      publisher : {
        theme: {
          primaryColor:this.state.primaryColor,
          secondaryColor:this.state.secondaryColor,
          accentColor:this.state.accentColor,
          barBgColor: this.state.primaryColor,
          barTone: this.state.colorTheme
        }
    }}

    Request
    .patch(config.BACKURL+'/publishers/'+config.PID)
    .set('x-access-token', auth.getToken())
    .set('Accept','application/json')
    .send(data)
    .end((err,res)=>{
      if(err)
        this.setState({
          textStatus:res.body.error.message,
          error:true
        })
      else{
        this.setState({
          textStatus:'Saved successfully',
          error:false
        })
        window.location.reload();
      }
    })
  }

  changeColorTheme = (e,val) => {
    this.setState({
      colorTheme:val
    })
  }

  componentDidMount(){
    this.getPublisherId()
  }

  render(){
    //console.log(this.context.setting.publisher.theme)
    let pub = this.state.publisher
    var {theme} = this.context.setting.publisher
    var {primaryColor,secondaryColor,accentColor,colorTheme,anchorEl1,anchorEl2,anchorEl3,open1,open2,open3,textStatus,uploadFavicon,uploadLogo,uploadSLogo,error} = this.state

    var styles={
      example2:{
        color:'#222',
        backgroundColor:'white',
        border:'1px solid #ededed'
      },
      example4:{
        color:'white',
        background:primaryColor,
        background:'linear-gradient(135deg, '+primaryColor+' 0%, '+secondaryColor+' 100%)',
      },
      example5:{
        color:'white',
        background:primaryColor,
      },
      radioButton: {
        marginBottom: 20,
      },
    }

    let shade = []
    for(let i=1;i<7;i++){
      shade.push(
        <ShadeColor key={i} className={'bg'+i}></ShadeColor>
      )
    }
    return (
      <Container onSubmit={this.updateData}>
        <Flex>
          <Title>
            <div className="sans-font">Cover picture</div>
          </Title>
          <Edit>
            <UploadPicture ratio={1920/350} src={pub.cover&&pub.cover.medium} ratio={1920/350} path={'/publishers/'+config.PID+'/cover'} type='cover' size='1920x350' width={500} height={100} />
          </Edit>
        </Flex>
        <Flex>
          <Title>
            <div className="sans-font">Cover Logo (.svg)</div>
          </Title>
          <Edit>
            <div className='row'>
              <UploadPicture crop={false} src={theme.llogo} path={'/publishers/'+config.PID+'/llogo'} size='.svg' type='llogo' allowTypes='|svg+xml|' width={200} height={23}  style={{flex:1}}/>
              <UploadPicture crop={false} src={theme.llogoGif} path={'/publishers/'+config.PID+'/llogo/gif'} size='.gif' type='llogoGif' allowTypes='|gif|' width={200} height={23}  style={{flex:1}}/>
            </div>
          </Edit>
        </Flex>
        <Flex>
          <Title>
            <div className="sans-font">Favicon (.ico)</div>
          </Title>
          <Edit>
            <UploadPicture crop={false} src={uploadFavicon} path={'/publishers/'+config.PID+'/favicon'} size='.ico' type='favicon' allowTypes='|x-icon|vnd.microsoft.icon|' width={60} height={60} />
          </Edit>
        </Flex>
        <Flex>
          <Title>
            <div className="sans-font">Small Logo (.svg)</div>
          </Title>
          <Edit>
            <div className='row'>
              <UploadPicture crop={false} src={uploadSLogo} path={'/publishers/'+config.PID+'/slogo'} size='.svg' type='slogo' allowTypes='|svg+xml|' width={60} height={60}  style={{flex:1}}/>
              <UploadPicture src={theme.slogoGif} path={'/publishers/'+config.PID+'/slogo/gif'} size='.gif' type='slogoGif' allowTypes='|gif|' width={60} height={60}  style={{flex:3}}/>
            </div>
          </Edit>
        </Flex>
        <Flex>
          <Title>
            <div className="sans-font">Large Logo (.svg)</div>
          </Title>
          <Edit>
            <UploadPicture crop={false} src={uploadLogo} path={'/publishers/'+config.PID+'/logo'} size='.svg' type='logo' allowTypes='|svg+xml|' width={300} height={35} />
          </Edit>
        </Flex>

        {/*<Title style={{marginTop:'50px'}}>
          <div className="sans-font">Example</div>
        </Title>
        <BGImg src={pub.cover&&pub.cover.medium} opacity={-1} style={{width:'100%',height:'160px',margin:'15px 0'}} alt={pub.name} >
          <div style={{width:150,margin:'60px auto 0px auto'}}>
            <LogoLink id='priview2' src={theme.logo} fill={colorTheme=='light'?primaryColor:'#ffffff'} title='logo'/>
          </div>
          <TextStatus className='nunito-font' style={{textAlign:'center',color:'white',float:'none',margin:'0'}}>{pub&&pub.tagline}</TextStatus>
        </BGImg>
        <BreakLine/>*/}

        <Flex>
          <Title>
            <div className="sans-font">Primary Color</div>
          </Title>
          <Edit>
            <div className='row'>
              <BoxColor id='color2' onClick={this.handleTouchTap1}>
                <Color style={{backgroundColor:primaryColor}}/>
                <i className="fa fa-angle-down" style={{margin:'4px'}} aria-hidden="true"></i>
                <Popover
                  open={open1}
                  anchorEl={anchorEl1}
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  onRequestClose={this.handleRequestClose}
                >
                  <ChromePicker
                    color={ primaryColor }
                    onChangeComplete={ this.selectColor1 }
                  />
                </Popover>
              </BoxColor>
              <Desc className="sans-font">Primary color should be a major color that looks good on both white and black background</Desc>
            </div>
          </Edit>
        </Flex>
        <Flex>
          <Title>
            <div className="sans-font">Secondary Color</div>
          </Title>
          <Edit>
            <div className='row'>
              <BoxColor id='color2' onClick={this.handleTouchTap2}>
                <Color style={{backgroundColor:secondaryColor}}/>
                <i className="fa fa-angle-down" style={{margin:'4px'}} aria-hidden="true"></i>
                <Popover
                  open={open2}
                  anchorEl={anchorEl2}
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  onRequestClose={this.handleRequestClose}
                >
                  <ChromePicker
                    color={ secondaryColor }
                    onChangeComplete={ this.selectColor2 }
                  />
                </Popover>
              </BoxColor>
              <Desc className="sans-font">Secondary Color may use for related information and as a gradient color</Desc>
            </div>
          </Edit>
        </Flex>
        <Flex>
          <Title>
            <div className="sans-font">Accent Color</div>
          </Title>
          <Edit>
            <div className='row'>
              <BoxColor id='color2' onClick={this.handleTouchTap3}>
                <Color style={{backgroundColor:accentColor}}/>
                <i className="fa fa-angle-down" style={{margin:'4px'}} aria-hidden="true"></i>
                <Popover
                  open={open3}
                  anchorEl={anchorEl3}
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  onRequestClose={this.handleRequestClose}
                >
                  <ChromePicker
                    color={ accentColor }
                    onChangeComplete={ this.selectColor3 }
                  />
                </Popover>
              </BoxColor>
              <Desc className="sans-font">Accent Color should be used for action button and interactive elements, such as text fields, progress bar and links</Desc>
            </div>
          </Edit>
        </Flex>
        <Flex>
          <Title>
            <div className="sans-font">Theme Top bar</div>
          </Title>
          <Edit style={{maxWidth:'490px'}}>
            <RadioButtonGroup name="Color Theme" valueSelected={colorTheme} onChange={this.changeColorTheme}>
              <RadioButton
                value="light"
                label={<Color style={{backgroundColor:'white',width:'200px',height:'40px',border:'2px solid #ededed',textAlign:'center',paddingTop:'6px'}}>Light Theme</Color>}
                style={styles.radioButton}
              />
              <RadioButton
                value="dark"
                label={<Color style={{backgroundColor:primaryColor,width:'200px',height:'40px',border:'2px solid #ededed',color:'white',textAlign:'center',paddingTop:'6px'}}>Dark Theme</Color>}
                style={styles.radioButton}
              />
            </RadioButtonGroup>

            <div className='row sans-font' style={{border:'1px solid #e2e2e2',padding:'10px',margin:'20px 0 0 0'}}>
              <Topbar style={{backgroundColor:colorTheme=='light'?'white':primaryColor,marginBottom:'20px'}}>
                <i className="material-icons" style={{margin:'9px',color:colorTheme=='light'?'#222':'white',float:'left'}}>menu</i>
                {/*{theme.primaryColor&&<LogoLink id='priview'  src={theme.logo} style={{float:'left',width:'100%',margin:'12px'}} fill={colorTheme=='light'?primaryColor:'#ffffff'} title='logo'/>}*/}
                <div className='nunito-font' style={{fontWeight:'bold',color:colorTheme=='light'?'#222':'white',padding:'8px', marginLeft:'20px'}}>About</div>
                <div className='nunito-font' style={{fontWeight:'bold',color:colorTheme=='light'?'#222':'white',padding:'8px'}}>Contact</div>
                <RaisedButton
                  label="button"
                  labelStyle={{fontWeight:'bold', fontSize:10, top:3, fontFamily:"'Nunito', 'Mitr'"}}
                  labelColor='white'
                  overlayStyle={{borderRadius: '20px'}}
                  rippleStyle={{borderRadius: '20px'}}
                  style={{borderRadius:'20px', height:'30px', background:accentColor, boxShadow:'none',margin:'4px 5px 0 20px'}}
                  buttonStyle={{borderRadius: '20px', background:accentColor, padding:'0 2px',float:'right'}}
                />
              </Topbar>
              <div className='col-6 ' style={{padding:'0 5px 0 5px'}}>
                <Example style={{...styles.example2}}>
                  <strong className="serif-font" style={{fontSize:'17px'}}>Preview of the major color selection</strong><br/><br/>
                  Content should look like this, isn't it pretty on this background color?
                  <div className='row'>
                    <RaisedButton
                      label="button"
                      labelStyle={{fontWeight:'bold', fontSize:12, top:-2, fontFamily:"'Nunito', 'Mitr'"}}
                      labelColor='white'
                      overlayStyle={{borderRadius: '20px'}}
                      rippleStyle={{borderRadius: '20px'}}
                      style={{display:'inline',borderRadius:'20px', height:'35px', lineHeight:'40px', background:accentColor, boxShadow:'none',margin:'15px 10px 0 0'}}
                      buttonStyle={{borderRadius: '20px',  background:accentColor, padding:'0 2px'}}
                    />
                    <RaisedButton
                      label="button"
                      labelStyle={{fontWeight:'bold', fontSize:12, top:-4, fontFamily:"'Nunito', 'Mitr'"}}
                      labelColor={accentColor}
                      overlayStyle={{borderRadius: '20px'}}
                      rippleStyle={{borderRadius: '20px'}}
                      style={{display:'inline',borderRadius:'20px', height:'35px', lineHeight:'40px', background:'white', boxShadow:'none',marginTop:'15px'}}
                      buttonStyle={{borderRadius: '20px', background:'white', border:('2px solid '+accentColor), padding:'0 2px'}}
                    />
                  </div>
                </Example>
              </div>
              <div className='col-6' style={{padding:'0 5px 0 5px'}}>
                <Example style={{...styles.example2,padding:'15px',fontSize:'11px',height:'auto'}} className='sans-font'>
                  <div style={{marginBottom:'15px',color:'#222'}}>Primary Text</div>
                  <div style={{marginBottom:'15px',color:'#8f8f8f'}}>Seondary Text</div>
                  <div style={{color:'#e2e2e2'}}>Disable/Hint Text</div>
                </Example>
                <div style={{...styles.example5,textAlign:'center',height:'50px',padding:'18px 0 0 0'}}>Primary Color</div>
                <div style={{...styles.example4,textAlign:'center',height:'50px',padding:'18px 0 0 0'}}>Gradient</div>
              </div>
            </div>
          </Edit>
        </Flex>
        <div className='sans-font' style={{marginTop:'30px',overflow:'hidden'}}>
          <PrimaryButton label='Save' type='submit' style={{float:'right',margin:'0 20px 0 0'}}/>
          <SecondaryButton label='Reset' onClick={this.setData} style={{float:'right',margin:'0 20px 0 0'}}/>
          <TextStatus style={{color:error?'#D8000C':theme.accentColor,float:'right'}}>{textStatus}</TextStatus>
        </div>

      </Container>
    )
  }
}

export default PublisherThemeSetting
