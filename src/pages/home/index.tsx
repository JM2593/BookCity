import React from 'react';
import styles from './index.module.scss';
import Header from './components/header';
import AxiosInstance from '@/hooks/useRequest/axiosInstance';
const Index: React.FC = () => {
  React.useEffect(() => {
    AxiosInstance.request({ url: 'api/v1/home' });
  }, []);

  return (
    <div className={styles.home}>
      <Header />
      Index
    </div>
  );
};

export default Index;
