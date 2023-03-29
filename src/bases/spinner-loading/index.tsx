import React from "react";
import cx from 'classnames'
import './styles/index.scss'

export interface SpinnerLoadingProps {
  color?:'default' | 'primary' | 'white',
  size?:number,
  style?:React.CSSProperties
}
const classPrefix = 'ygm-spinner-loading'
const SpinnerLoading:React.FC<SpinnerLoadingProps>=(props)=>{
  const {color,size} = props
  return (
    <div className={cx(`${classPrefix}`, `${classPrefix}-color-${color}`)} style={{...props.style, width:size,height:size}} ></div>
  )
}
SpinnerLoading.defaultProps ={
  color:'default',
  size:32
}
export default SpinnerLoading

SpinnerLoading.displayName = 'SpinnerLoading'
