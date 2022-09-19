import ReactDOM from 'react-dom/client';

import '@/assets/styles/reset.css';
import '@/assets/styles/common.scss';
import RootRouter from '@/routes/RootRouter';

function App() {
	return <RootRouter />;
}

const container = document.getElementById('app') as HTMLElement;
ReactDOM.createRoot(container).render(<App />);
