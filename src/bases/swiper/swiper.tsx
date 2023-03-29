import React, { useCallback, useEffect,useMemo, useRef, useState} from "react";

import './styles/swiper.scss'
import SwiperPageIndicator from "./swiper-page-indicator";
import SwiperItem from "@/bases/swiper/swiper-item";
import { modulus } from '@/bases/swiper/utils'

export interface SwiperProps {
  /** 是否循环播放 */
  loop?:boolean;
  /** 是否自动播放 */
  autoplay?:boolean;
  /**  轮播间隔事件 */
  autoPlayInterval?:number;
  /** 默认显示第几张 */
  defaultIndex?:number;
  showIndicator?:boolean;
  indicatorClassName?:string;
  children:React.ReactElement | React.ReactElement[];
  style?:React.CSSProperties & Partial<Record<'--height' | '--width' | '--track-padding' | '--border-radius',string>>
}
const classPrefix = 'ygm-swiper'
const Swiper:React.FC<SwiperProps> = props => {
  const [currentIndex,setCurrentIndex] = useState<number>(props.defaultIndex || 0)  // 当前Index
  const [dragging,setDragging] = useState<boolean>(false)  

  const startRef = useRef<number>(0)        // 第一次按下的位置 cilentX是距屏幕左侧的距离
  const slideRatioRef = useRef<number>(0)   // 移动了0.几
  const trackRef = useRef<HTMLDivElement>(null)  //  一个swiperItem的宽度
  const autoPlaying = useRef<boolean>(false)  // 判断当前是否正在播放中
  const intervalRef = useRef<number>(0)  // 保存setInterval的返回值




  const {validChildren,count} = useMemo(()=>{
    let count = 0
    const validChildren =  React.Children.map(props.children,(child) => {
      //  验证对象是不是一个React元素
      if(!React.isValidElement(child) ) return null
      //  验证对像是不是一个SwiperItem元素
      if(child.type !== SwiperItem){
        console.warn('Swiper chidren must be Swiper.Item component')
      }
      count++
      return child
    })
    return {validChildren,count}
  },[props.children])

  const getTransition = (positon:number)=>{
    if(dragging){
      return ''
    }else if(autoPlaying.current){
      if(positon === 0 || positon === -100){
        return 'transform .3s ease-out'
      }else{
        return ''
      }
    }else if(positon < -100){
      return ''
    }
    return 'transform .3s ease-out'
  }
  
  const getFinalPosition = (index:number)=>{
    // 如果当前是在0 那么currenindex = 0  finalposition = 0 + 0 = 0  1位置的就是100，以此类推
    // 如果当前在1 那么cri = 1 0 出的位置就是 -100 + 0 = -100  2 weizhi 就是100 以此类推
    let finalPosition = -currentIndex * 100 + index * 100   // 计算出所有图的位置
    if(!props.loop) return finalPosition
    const totalWidth = count * 100;
    // 无限轮播，当前图的前后平均分配轮播图数量
    const flagWidth = totalWidth / 2;
    // 1 2 3 4 ===》3 4 1 2     
    // 4===> 300 , flagWidth = 200                           比如当前current是0  fnp = 0 ,100 ,200 ,300
                                                                      // 4  -300 + 200 % 400 = -100 + 200 = 100
    // (300 + 200) % 400 = 100 100 - flagWidth ===> -100
    finalPosition = modulus(finalPosition+flagWidth, totalWidth) - flagWidth
    return finalPosition
  }
  const renderSwiperItem = ()=>{
    return (
      <div className={`${classPrefix}-track-inner`} >
        {React.Children.map(validChildren,(child,index)=>{
          const position = getFinalPosition(index)
          return (
            <div className={`${classPrefix}-slide`}
                 style={{
                   left:`-${index * 100}%`,
                   transform:`translate3d(${position}%,0,0)`,
                   transition:getTransition(position)
                 }} >
              {child}
            </div>
          )
        })}
      </div>
    )
  }

  const getSlideRatio = (diff:number)=>{
    const element = trackRef.current
    if(!element) return  0;
     return diff / element.offsetWidth
  }
  const boundIndex =useCallback(
    (currentIndex:number)=>{
      let min = 0;
      let max = count -1
      let ret = currentIndex
      ret = Math.max(currentIndex,min)
      ret = Math.min(ret,max)
      return ret
    },
    [count],
  )

  const swipeTo =useCallback(
    (index:number)=>{
      const targetIndex = props.loop ? modulus(index,count) : boundIndex(index)
      setCurrentIndex(targetIndex)
    },
    [boundIndex,count,props.loop],
  )
  const swipeNext = useCallback(
    () => {
      swipeTo(currentIndex+1)
    },
    [swipeTo,currentIndex],
  )

  const onTouchEnd = ()=>{
    const index = Math.round(slideRatioRef.current)
    slideRatioRef.current = 0

    const position = currentIndex + index
    swipeTo(position)
    setDragging(false)
    document.removeEventListener('touchmove',onTouchMove)
    document.removeEventListener('touchend',onTouchEnd)
  }

  const onTouchMove = (e:TouchEvent)=>{
    const currentX = e.changedTouches[0].clientX
    const diff = startRef.current - currentX
    slideRatioRef.current = getSlideRatio(diff)
    let position = currentIndex + slideRatioRef.current

    if (!props.loop){
      position = boundIndex(position)
    }
    setCurrentIndex(position)
  }

  const onTouchStart = (e:React.TouchEvent<HTMLDivElement>)=>{
      startRef.current = e.changedTouches[0].clientX
      clearInterval(intervalRef.current)  // 开始拖拽就不继续自动播放了
    document.addEventListener('touchmove',onTouchMove)
    document.addEventListener('touchend',onTouchEnd)
    setDragging(true)
  }

  useEffect(() => {
      if(!props.autoplay || dragging) return 

      intervalRef.current = window.setInterval(()=>{
          autoPlaying.current = true
          swipeNext()
      },props.autoPlayInterval)
    return () => {
      clearInterval(intervalRef.current)  // 组件销毁时清除定时器
    }
  }, [dragging,props.autoPlayInterval,props.autoplay,swipeNext])
  if(count === 0 || !validChildren){
    console.warn('Swiper at least one child element is required')
    return null
  }

  return (
    <div className={classPrefix} style={props.style} >
      <div className={`${classPrefix}-track`} ref={trackRef} onTouchStart={onTouchStart} >
        {renderSwiperItem()}
      </div>
      {props.showIndicator && (
        <div className={`${classPrefix}-indicator`}>
          <SwiperPageIndicator total={count} current={slideRatioRef.current > 0 ? Math.floor(currentIndex) : Math.ceil(currentIndex) }
          indicatorClassName={props.indicatorClassName}
          />
        </div>
      ) }
    </div>
  )
}

export default Swiper

Swiper.defaultProps = {
  autoplay:false,
  autoPlayInterval:3000,
  defaultIndex:0,
  showIndicator:true,
  loop:false
}

Swiper.displayName = 'Swiper'
