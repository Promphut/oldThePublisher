import React from 'react'
import styled from 'styled-components'
import {RecommendArticle} from 'components'

const Recommend = styled.div`
	flex:12 1275px;
	max-width:1275px;
	margin-top:60px;
  .recommends{
		font-size:20px;
		color:#222;
		font-weight:bold;
    margin-left:23px;
	}
	@media (max-width: 480px) {
		flex:1 100%;
		max-width: 100%;
		padding:0 15px 0 15px;
    .mobile{
      width:100%;
      display:block;
    }
    .recommends{
      margin-left:0px;
    }
	}
`
const RecommendContainer = ({style,className,recommend})=>{
  return(
    recommend.length<=1?<Recommend style={{...style}} className={className} >
      <div className='recommends sans-font' >Recommends</div>
      <div className='row center'>
        {recommend.map((data,index)=>(
          <div className='col-lg-6 col-md-6 col-sm-12 mobile' key={index}>
            <RecommendArticle detail={data}/>
          </div>
        ))}
      </div>
    </Recommend>:<div></div>
  )
}

export default RecommendContainer