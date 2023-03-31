import React from 'react';

import styles from './index.module.scss';

import Header from './components/header';
import NavBar from './components/navbar';
import Popular from './components/popular';
import Loading from "@/components/Loading";
import {ErrorBlock ,Swiper , Space } from "@/bases";

import useRequest from "@/hooks/useRequest";
import { px2rem } from '@/utils/unit';


import api from '@/pages/home/api'
import Recommend from '@/pages/home/components/recommend';
import LimitedRead from '@/pages/home/components/limitedRead';
import Ranking from '@/pages/home/components/ranking';

const Index: React.FC = () => {
const {data,error} = useRequest<any>({url:api.getHomeData})
  if(error) {
    return <ErrorBlock  />
  }
  if(!data){
    return  <Loading />
  }
  return (
    <div className={styles.home}>
      <Header />

     <Space gap={px2rem(20)}  direction='vertical' >
     <Swiper autoplay loop  defaultIndex={0}  style={{'--border-radius':'12px'}} >
        {
          data!.banner.map((item,index)=>(
             <Swiper.Item key={index} >
              <img src={item.src} alt={item.alt} height='100%' width='100%' />
            </Swiper.Item>
          ))
        }
      </Swiper>
        <NavBar />
        <Popular />
        <Recommend />
        <LimitedRead />
        <Ranking />
     </Space>
    </div>
  );
};

export default Index;
