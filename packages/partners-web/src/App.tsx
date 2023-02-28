import {useMemo} from 'react';
import ReactDOM from 'react-dom/client';
import {ThemeProvider, CssBaseline, StyledEngineProvider} from '@mui/material';
import {ThemeProvider as StylesThemeProvider} from '@mui/styles';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import getTheme from '@/assets/themes';
import RootRouter from '@/routes/RootRouter';

import '@/assets/styles/common-style.scss';

import {Loading} from '@/components';
import ModalComponent from '@/components/common/ModalComponent';
import AmplitudeTrackingInterceptor from '@/components/common/layout/AmplitudeTrackingInterceptor';
import ChannelTalk from '@/features/common/ChannelTalk';

import {initAmplitudeTracking} from '@/utils';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			refetchInterval: 3 * 60 * 1000, // 3분마다 캐시 갱신
		},
	},
});

initAmplitudeTracking();

function App() {
	const theme = useMemo(() => getTheme(), []);
	return (
		<QueryClientProvider client={queryClient}>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={theme}>
					<StylesThemeProvider theme={theme}>
						<CssBaseline />
						<AmplitudeTrackingInterceptor>
							<RootRouter />
							<ModalComponent />
							<Loading />
						</AmplitudeTrackingInterceptor>
						<ChannelTalk />
					</StylesThemeProvider>
				</ThemeProvider>
			</StyledEngineProvider>
		</QueryClientProvider>
	);
}

const container = document.getElementById('app') as HTMLElement;
ReactDOM.createRoot(container).render(<App />);
