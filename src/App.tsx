import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import Layout from '@/components/layout';
import Home from '@/pages/home';
import CatchScreen from '@/pages/catch';
import DexScreen from '@/pages/dex';
import LocationsScreen from '@/pages/locations';
import StoryPage from '@/pages/story';
import SettingsScreen from '@/pages/settings';
import CreditsPage from '@/pages/credits';
import { MusicProvider } from '@/context/music-context';

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/locations" component={LocationsScreen} />
        <Route path="/catch/:locationId" component={CatchScreen} />
        <Route path="/story/:eventId" component={StoryPage} />
        <Route path="/settings" component={SettingsScreen} />
        <Route path="/dex" component={DexScreen} />
        <Route path="/credits" component={CreditsPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <MusicProvider>
            <Router />
          </MusicProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
