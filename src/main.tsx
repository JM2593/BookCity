import ReactDom from 'react-dom/client';
import App from '@/App';

import '@/assets/styles/index.scss';

ReactDom.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
