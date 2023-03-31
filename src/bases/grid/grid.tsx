import React, { useMemo } from 'react';

import './styles/grid.scss'

export interface GridProps {
    /* 列数 */
    columns: number;
    /* 各自之间的间距 */
    gap?: number | string | [number | string, number | string];
    children?:React.ReactNode
}
const formatGap = (gap: number | string) => (typeof gap === 'number' ? `${gap}px` : gap)
const classPrefix = 'ygm-grid'

const Grid: React.FC<GridProps> = (props) => {
    const style = useMemo(() => {
        if (props.gap !== undefined) {
            if (Array.isArray(props.gap)) {
                const [gapH, gapV] = props.gap
                return {
                    "--gap-horizontal": formatGap(gapH),
                    "--gap-vertical": formatGap(gapV),
                    "--columns":props.columns
                }
            } else {
                return {
                    "--gap": formatGap(props.gap),
                    "--columns":props.columns
                }
           }
        } 
        return {
            "--columns":props.columns
        }
        
    }, [props.columns, props.gap])
    
    return (
        <div className={classPrefix} style={style as React.CSSProperties} > {props.children}</div>
    );
};

export default Grid;