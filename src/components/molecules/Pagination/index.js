import React from 'react';
import {createUltimatePagination, ITEM_TYPES} from 'react-ultimate-pagination';
import FlatButton from 'material-ui/FlatButton';
import NavigationFirstPage from 'material-ui/svg-icons/navigation/first-page';
import NavigationLastPage from 'material-ui/svg-icons/navigation/last-page';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import PropTypes from 'prop-types';
import utils from '../../../services/utils';

const flatButtonStyle = {
  minWidth: 20,
  color:'#8F8F8F',
  padding: 5
};
const active = {
  textDecoration:'underline',
  fontWeight:'bold'
}

const Page = ({value, isActive, onClick},context) => {
  //console.log('Page', value, isActive)
  var acc = context.setting.publisher.theme.accentColor
  return (
    <FlatButton 
      style={!isActive?{...flatButtonStyle, padding: '0px 0px 35px 0px'}:{...flatButtonStyle,...active,color:acc,padding: '0px 0px 35px 0px' }} 
      labelStyle={!isActive?{fontSize: utils.isMobile() ? '14px' : '16px' ,padding: '0px 10px 0px 10px'}
      :{fontSize: utils.isMobile() ? '14px' : '16px' ,fontWeight:'bold',padding: '0px 10px 0px 10px'}}  
      label={value.toString()} 
      primary={isActive} 
      onClick={onClick}/>
  )
};

const Ellipsis = ({onClick}) => (
  <FlatButton style={{...flatButtonStyle,padding: '0px 0px 35px 0px'}} labelStyle={{padding:0}} label="..." onClick={onClick}/>
);

const FirstPageLink = ({isActive, onClick}) => (
  <FlatButton style={{...flatButtonStyle,padding: '0px 0px 35px 0px'}} icon={<NavigationFirstPage style={{width: utils.isMobile() ? '20px' : '24px',height: utils.isMobile() ? '20px' : '24px'}}/>}  onClick={onClick}/>
);

const PreviousPageLink = ({isActive, onClick}) => (
  <FlatButton style={{...flatButtonStyle,padding: '0px 0px 35px 0px'}} icon={<NavigationChevronLeft style={{width: utils.isMobile() ? '20px' : '24px',height: utils.isMobile() ? '20px' : '24px'}}/>} onClick={onClick}/>
);

const NextPageLink = ({isActive, onClick}) => (
  <FlatButton style={{...flatButtonStyle,padding: '0px 0px 35px 0px'}} icon={<NavigationChevronRight style={{width: utils.isMobile() ? '20px' : '24px',height: utils.isMobile() ? '20px' : '24px'}}/>} onClick={onClick}/>
);

const LastPageLink = ({isActive, onClick}) => (
  <FlatButton style={{...flatButtonStyle,padding: '0px 0px 35px 0px'}} icon={<NavigationLastPage style={{width: utils.isMobile() ? '20px' : '24px',height: utils.isMobile() ? '20px' : '24px'}}/>} onClick={onClick}/>
);

const itemTypeToComponent = {
  [ITEM_TYPES.PAGE]: Page,
  [ITEM_TYPES.ELLIPSIS]: Ellipsis,
  [ITEM_TYPES.FIRST_PAGE_LINK]: FirstPageLink,
  [ITEM_TYPES.PREVIOUS_PAGE_LINK]: PreviousPageLink,
  [ITEM_TYPES.NEXT_PAGE_LINK]: NextPageLink,
  [ITEM_TYPES.LAST_PAGE_LINK]: LastPageLink
};

const Pagination = createUltimatePagination({itemTypeToComponent});

Page.contextTypes = {
	setting: PropTypes.object
};

export default Pagination;