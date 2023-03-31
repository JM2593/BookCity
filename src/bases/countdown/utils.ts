const DAY_MILLISECOND = 1000 *  60 * 60 * 24 // 一天的毫秒数
const HOURS_MILLISECOND = 1000 *  60 * 60 // 一小时的毫秒数
const MINUTES_MILLISECOND = 1000 * 60 // 一分钟的毫秒数

const formatTime = (val:number):string => {
    if (val <= 0) return '00'
    return val < 10 ?  `0${val}` : `${val}`
}

const getTime = (format: string, timeLeft: number) => {
    let d = timeLeft;

    let [_,s,m,h] = [1000, 60, 60, 24].map(unit => {  // ? 一个字绝！！
        let num = d % unit;
        d = Math.floor(d / unit)
        return num
    })
    if (timeLeft > DAY_MILLISECOND && !format.includes('d')) {
            h += d*24
    }

    if (timeLeft > HOURS_MILLISECOND && !format.includes('h')) {
            m += h * 60
    }

    if (timeLeft > MINUTES_MILLISECOND && !format.includes('s')) {
            s += m * 60
    }

    return {
        dd: formatTime(d),
        hh: formatTime(h),
        mm: formatTime(m),
        ss: formatTime(s),
        d,
        h,
        m,
        s
    }
}

type formatType = 'dd' | 'hh' | 'mm' | 'ss';

export const getTimeItems = (format: string, timeLeft: number) => {
    // 匹配format
    const timeArr:Array<string> = format!.match(/[a-zA-Z]{1,3}/g) || []
    // 匹配字符
    const symbolArr:Array<string> = format.match(/[\u4e00-\u9fa5]+|[^a-zA-Z]/g) || []

    const time = getTime(format, timeLeft)
    
    return timeArr.map((item, i) => {
        return {
            num: time[item.toLowerCase() as formatType],
            symbol:symbolArr[i]
        }
    })
}