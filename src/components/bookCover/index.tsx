import React from "react";

import styles from './index.module.scss'

export interface BookCoverProps{
    src:string,
    alt:string,
    style?:React.CSSProperties & Partial<Record<'--width' | '--height' | '--border-radius',string>>
}

const BookCover:React.FC<BookCoverProps> = (props)=>{
    return(
        <div className={styles.bookCover} >
            <img src={props.src} alt={props.alt} className={styles.coverImage}   />
        </div>
    )
}

export default BookCover