import React, { useCallback, useMemo, useRef, useState } from 'react';

import cx from 'classnames'
import './styles/index.scss'
import { getTimeItems } from './utils';
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';

export interface CountdownProps {
    /* 倒计时总长 */
    time: number;
    /* 倒计时格式 */
    format?: string;
    /* 结束文案 */
    endText?: string;
    /* 数字样式 */
    numberClassName?: string;
    /* 符号样式 */
    symbolClassName?: string;
    /* 结束文案样式 */
    endTextClassName?:string
}
const classPrefix = 'ygm-countdown'

type timeItemType = {num:string,symbol:string}[]

const Countdown: React.FC<CountdownProps> = (props) => {
    const [timeItems, setTimeItems] = useState<timeItemType>([])
    const [timeEnd,setTimeEnd] = useState<boolean>(false)

    const computeTimeRef = useRef<number>(props.time)  // 剩余时间
    const timerRef = useRef<number>(0)  // 定时器
    const endTimeMs = useMemo(()=>Date.now() + computeTimeRef.current,[] ) // 最终结束时间

    const setCountdownTimeItems = useCallback(() => {
        if (computeTimeRef.current <= 0) {
            setTimeEnd(true)
            clearTimeout(timerRef.current)
        }

        const timeItems = getTimeItems(props.format!, computeTimeRef.current)
        setTimeItems(timeItems)
    },[props.format])

    const initCountdown = useCallback(() => {
        clearTimeout(timerRef.current)
        // 获取当前时间
        const now = Date.now()
        // 获取剩余的毫秒数
        computeTimeRef.current = endTimeMs - now
        timerRef.current = window.setTimeout(() => {
            initCountdown()
        })
        setCountdownTimeItems()
    },[endTimeMs, setCountdownTimeItems])

    useIsomorphicLayoutEffect(() => {  // 需要再组件渲染之前完成计时器的初始化
        initCountdown()
        return () => {
            clearTimeout(timerRef.current)
        }
    },[initCountdown])
    return (
        <div className={classPrefix}>{
            timeEnd && props.endText ? (
                <div className={props.endTextClassName}>
                    {props.endText}
                </div> 
            ) : (
                    timeItems.map((item, index) => (
                    <div className={`${classPrefix}-item`} key={index} >
                            <div className={cx(`${classPrefix}-item-num`,props.numberClassName)} >{item.num}</div>
                            <div className={cx(`${classPrefix}-item-symbol`,props.symbolClassName)} >{item.symbol}</div>
                    </div>
                ))    
            )
         } </div>
    );
};

Countdown.displayName='CountDown'
export default Countdown;

Countdown.defaultProps = {
    format:'hh:mm:ss'
}