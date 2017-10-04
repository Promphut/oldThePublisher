import React from 'react'
import styled from 'styled-components'
import {TwtShareButton, FbShareButton, InShareButton, LineShareButton, LineIcon2, CopyLinkIcon, Stick} from 'components'
import CopyToClipboard from 'react-copy-to-clipboard'
import utils from '../../../services/utils'
import api from '../../../services/api'
import config from '../../../config'

const ShareContainer = styled.div`
    position: fixed;
    bottom:0;
    display: ${props=>props.scrollOpacity?'none':'flex'};
    width: 100%;
    height: 45px;
    border-top: 1px solid #EAEAEA;
    z-index: 20;
`

const Item = styled.div `
    flex: 1;
    height: 45px;
    background-color: ${props => props.color};
    display: flex;
    justify-content: center;
    align-items: center;
`
const ShareButton = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default class ShareButtom extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            scrollOpacity: false,
            edge:0,
            scroll:0
        }
    }

    handleScroll = e => {
		const nowTop = e.srcElement.body.scrollTop
        if((nowTop>this.state.edge)){
            this.setState({scrollOpacity:true})
        }else{
            this.setState({scrollOpacity:false})
        }
    }

    onStoryCopied = (val) => {
        //console.log('onStoryCopied', val)
        // get sid
        val = utils.getTrailingSid(val)
        //this.setState({copied: true})
        if(val!=null) api.incStoryInsight(val, 'share', 'share_dark')
    }

    getEdge = () =>{
        var element = document.getElementById('storyDetail')
        var height = element.offsetHeight;
        var top = element.getBoundingClientRect().top;
        var total = height+top
        this.setState({edge:total})
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)
        this.getEdge()
        //console.log("H=",height,'T=',top,total)
    }

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll)
	}

    componentWillReceiveProps(nextProps) {
		if (nextProps.sid != this.props.sid) {
            this.getEdge()
		}
	}

    render() {
        return (
            <ShareContainer scrollOpacity = {this.state.scrollOpacity} >
                <Item color='#3A579A'><FbShareButton  button={<ShareButton> <i className="fa fa-facebook" aria-hidden="true" style={{color:'white', fontSize:'18px'}}></i> </ShareButton>} /></Item>
                <Item color='#60AADE'><TwtShareButton button={<ShareButton> <i className="fa  fa-twitter" aria-hidden="true" style={{color:'white', fontSize:'18px'}}></i> </ShareButton>} /></Item>
                <Item color='#0077b5'><InShareButton  button={<ShareButton> <i className="fa  fa-linkedin" aria-hidden="true" style={{color:'white', fontSize:'18px'}}></i> </ShareButton>} /></Item>
                <Item color='#00c300'><LineShareButton button={<ShareButton> <LineIcon2 width='31.38px' height='12px' color='#FFF'/> </ShareButton>} /></Item>
                <Item color='#FFF'><CopyToClipboard text={this.props.url} onCopy={this.onStoryCopied}><ShareButton> <CopyLinkIcon width='18px' height='18px' color='#8E8E8E'/> </ShareButton></CopyToClipboard></Item> 
            </ShareContainer>
        )
    }

}
