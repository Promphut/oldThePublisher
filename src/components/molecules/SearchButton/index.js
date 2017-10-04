import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
import styled from 'styled-components'
import TextField from 'material-ui/TextField'
import trim from 'lodash/trim'
import config from '../../../config'
import utils from '../../../services/utils'
import PropTypes from 'prop-types'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const ButtonContainer = styled.div`
    width: auto;
    height: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 10px;
`

const Button = styled.div`
  text-align: center;
  margin-right: 8px;
  font-size: 21.86px;
  color: #ffffff;
  width: 30px;
  height: 30px;

  &:hover{
    cursor:pointer;
    color: ${props => props.theme.accentColor};
  }

`

const SearchButtonIcon = styled.i`
  transition: 0.2;
  color: ${props => (!props.scrolling && props.transparent && props.hasCover) || props.theme.barTone=='dark' ? '#ffffff':'#222'};
`

const getStyles = (name,theme,scrolling,transparent,hasCover) => {
    if(name=='hintStyle')
        return {
            color: (!scrolling && transparent && hasCover) ||theme == 'dark' ? 'rgba(255,255,255,0.7)':'rgba(34, 34, 34, 0.7)',
            fontWeight: 'normal'
        }
    else if(name=='inputStyle')
        return {
            color: (!scrolling && transparent && hasCover) ||theme == 'dark' ? '#ffffff':'#222',
        }
    else if(name=='textareaStyle')
        return {
            width: '180px',
            color: (!scrolling && transparent && hasCover) ||theme == 'dark' ? '#ffffff':'#222',
        }
}

const muiTheme = getMuiTheme({
  palette: {
    textColor: '#222',
  },
});

const muiTheme2 = getMuiTheme({
  palette: {
    textColor: '#ffffff',
  },
});

class SearchButton extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            focus: false,
            text: '',
            redirect: false
        }
    }

    static contextTypes = {
		setting: PropTypes.object
	}

    handleClick = (e) => {
        if(trim(this.state.text).length != 0)  {
            this.setState({focus : false, redirect: true})
            /*window.open(config.FRONTURL + '/search/stories?keyword=' + trim(this.state.text), "_top")*/
        }
        else if(!utils.isMobile()) this.setState({focus: true})
    }

    handleChange = (event) => {
        const value = event.target.value;
        if(value != this.state.text)
            this.setState({text: value})
    }

    handleFocus = (e) => {
      this.setState({focus: false})
    }


    componentDidMount() {
		document.getElementById("SearchBarButton").addEventListener('click', this.handleClick)
	}

    componentWillReceiveProps(nextProps) {
        if(this.state.redirect)
            this.setState({redirect : false, text : ''})
    }
    focusUsernameInputField = input => {
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    }

    render() {
        let { theme } = this.context.setting.publisher
        let { text, redirect } = this.state

        return(
            <div>
                {redirect && <Redirect push to={'/search/stories?keyword=' + trim(text)} />
                }
                <MuiThemeProvider muiTheme={(!this.props.scrolling && this.props.transparent && this.props.hasCover) || theme.barTone=='dark' ? muiTheme2 : muiTheme}>
                    <ButtonContainer mar= {utils.isMobile() ? '8px' : '32px'}>
                        {utils.isMobile() ?
                            <Link to ="/search/stories?keyword="><SearchButtonIcon id="SearchBarButton" className="fa fa-search" aria-hidden="true"></SearchButtonIcon></Link>
                            :
                            <Button>
                                <SearchButtonIcon scrolling={this.props.scrolling} transparent={this.props.transparent} hasCover={this.props.hasCover} id="SearchBarButton" className="fa fa-search" aria-hidden="true"></SearchButtonIcon>
                            </Button>
                        }
                        {this.state.focus &&
                            <TextField
                                id="SearchBarTextField"
                                hintText="Search Stories"
                                hintStyle={getStyles('hintStyle',theme.barTone, this.props.scrolling, this.props.transparent, this.props.hasCover)}
                                inputStyle={getStyles('inputStyle',theme.barTone,theme.barTone, this.props.scrolling, this.props.transparent, this.props.hasCover)}
                                style={getStyles('textareaStyle',theme.barTone,theme.barTone, this.props.scrolling, this.props.transparent, this.props.hasCover)}
                                textareaStyle={getStyles('textareaStyle',theme.barTone,theme.barTone, this.props.scrolling, this.props.transparent, this.props.hasCover)}
                                floatingLabelFocusStyle={getStyles('inputStyle',theme.barTone,theme.barTone, this.props.scrolling, this.props.transparent, this.props.hasCover)}
                                underlineFocusStyle={{borderColor: theme.accentColor}}
                                value={text}
                                onChange={this.handleChange}
                                onKeyPress={(ev) => {
                                    if (ev.key === 'Enter' && trim(text).length != 0) {
                                        // Do code here
                                        this.setState({focus:false ,redirect: true})
                                        {/*alert(this.state.text)*/}
                                        /*window.open(config.FRONTURL + '/search/stories?keyword=' + trim(text), "_top")*/
                                    } else if (ev.key === 'Enter') this.setState({text: ''})
                                }}
                                onBlur={text ? ()=>{} : this.handleFocus}
                                ref={this.focusUsernameInputField}
                            />}
                    </ButtonContainer>
                </MuiThemeProvider>
            </div>
            // </Link>
        )
    }

}

export default SearchButton
