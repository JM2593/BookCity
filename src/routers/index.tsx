import React from 'react';
import { useRoutes, Navigate } from 'react-router';

import Home from '@/pages/home';
import Detail from '@/pages/detail';
import Ranking from '@/pages/ranking';
import Shelf from '@/pages/shelf';
import Search from '@/pages/search';
import Chapter from '@/pages/chapter';
import Booklist from '@/pages/bookList';
import Category from '@/pages/category';
import BookList from '@/pages/bookList';

const Router: React.FC = React.memo(() => {
  const element = useRoutes([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/shelf',
      element: <Shelf />,
    },
    {
      path: '/ranking',
      element: <Ranking />,
    },
    {
      path: '/category',
      element: <Category />,
    },
    {
      path: '/search',
      element: <Search />,
    },
    {
      path: '/book-list/:key',
      element: <BookList />,
    },
    {
      path: '/book/:bookId/:chapterId',
      element: <Chapter />,
    },
    {
      path: '*',
      element: <Navigate to="/" />,
    },
  ]);
  return element;
});

export default Router;
