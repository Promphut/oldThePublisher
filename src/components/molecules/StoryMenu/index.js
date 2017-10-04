import React from 'react'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton';
import {Link} from 'react-router-dom'
import { withRouter } from 'react-router'

// const LinkTo = (path)=>{
//   browserHistory.push(path)
// }

const Wrapper = styled.div`
  ${props => props.style}

  @media (max-width: 480px) {
    display: none;
  }
`

const StoryMenu = ({style, className, child, path, linkPath, page, next, history}, context) => {
  let {theme} = context.setting.publisher
  if (!next) {
    next = ' '
  }

  const chevronRightStyle = {
    fontSize: '24px',
    margin: '12px 20px',
    color: '#8f8f8f',
    cursor: 'default'
  }

  return (
    <Wrapper className={className+' row'} style={{...style}}>
      <FlatButton
        icon={
          <FontIcon className="material-icons"
            style={{
              fontSize: '24px',
              margin: '0px',
              color: (page == 'allcolumn') ? theme.accentColor : '#8f8f8f',
            }}>
            apps
          </FontIcon>
        }
        label="STORIES"
        onClick={() => history.push('/stories/columns')/*LinkTo('/stories/columns')*/}
        className='nunito-font'
        style={{
          marginTop:'5px',
          border: '1px solid #E2E2E2',
          borderRadius: '0px',
          width: '128px',
          height: '41px'
        }}
        labelStyle={{
          fontSize: '18px',
          paddingLeft: '12px', paddingRight: '6px',
          color: (page == 'allcolumn') ? theme.accentColor : '#8f8f8f',
          fontWeight: (page == 'allcolumn') ? 'bold' : 'normal'
        }}
        hoverColor='#E2E2E2'
      />

      {(page == 'allcolumn') ? '' :
        <FontIcon className="material-icons"
          style={chevronRightStyle}>
          chevron_right
        </FontIcon>
      }

      {(page == 'allcolumn') ? '' :
        <FlatButton
          label={next}
          className='nunito-font'
          style={{
            marginTop:'5px',
            border: '1px solid #E2E2E2',
            borderRadius: '0px',
            minWidth: 'auto',
            height: '41px'
          }}
          labelStyle={{
            fontSize: '18px',
            paddingLeft: '14px', paddingRight: '14px',
            color: theme.accentColor,
            fontWeight: 'bold'
          }}
          hoverColor='#E2E2E2'
        />
      }

      {!path?'':<FlatButton
        label={next}
        className='nunito-font'
        style={{marginTop:'5px'}}
        href={linkPath}
        icon={<FontIcon className="material-icons" style={{fontSize:'35px',color:'#8f8f8f'}}>chevron_right</FontIcon>}
        labelStyle={{fontSize:'18px',color:theme.accentColor,fontWeight:'bold'}}
      />}

    </Wrapper>
  )
}

StoryMenu.contextTypes = {
  setting: PropTypes.object
}

export default withRouter(StoryMenu);
