import React from 'react';
import useRequest from '@/hooks/useRequest/useRequest';
import { useNavigate } from 'react-router-dom';

import api from '@/pages/home/api'

import { IHomeData } from '@/pages/home/types';

import styles from './index.module.scss'
import { Card, Grid, Space } from '@/bases';
import { px2rem } from '@/utils/unit';
import BookCover from '@/components/bookCover';



const Recommend: React.FC = () => {
    const { data } = useRequest<IHomeData>({ url: api.getHomeData })
    
    const navigate = useNavigate()
    const onHandleClick = () => {
        navigate('/book-list/recommend')
    }
    const renderContent = () => {
        return data?.recommend.map(book => (
            <React.Fragment key={book.bookId} >
                <Grid.Item onClick={() => navigate(`/book/${book.bookId}`)} >
                    <BookCover src={book.coverImg} alt={book.title} />
                    <Space direction='vertical' gap={px2rem(6)} >
                        <div className={styles.bookName}>{book.title}</div>
                        <div className={styles.author}>{book.author}</div>
                    </Space>
                    </Grid.Item>
            </React.Fragment>
        ))
    }

    return (
        <div className={styles.recommend}>
            <Card title='今日推荐'
                extra='更多'
                onHeaderClick={onHandleClick} headerClassName={styles.header} >
                <Grid columns={4} gap={px2rem(16)} >
                    {renderContent()}
                </Grid>
            </Card>
        </div>
    );
};

Recommend.displayName='Recommend'
export default Recommend;