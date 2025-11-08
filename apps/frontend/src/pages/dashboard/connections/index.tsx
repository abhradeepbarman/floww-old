import type { App, CommonResponse, Connection } from '@/@types/common';
import Header from '@/components/common/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/config';
import axiosInstance from '@/lib/axios';
import { queryClient } from '@/lib/query-client';
import { AppStatus } from '@repo/common/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type IAddConnectionResponse = CommonResponse<Connection>;
type IGetAuthUrlResponse = CommonResponse<string>;
type IGetAllAppsResponse = CommonResponse<App[]>;

const Connections = () => {
  const [selectedApp, setSelectedApp] = useState<{ name: string; key: string }>({ name: '', key: '' });

  const { data } = useQuery({
    queryKey: ['connections'],
    queryFn: async (): Promise<IGetAllAppsResponse> => {
      const res = await axiosInstance.get('/connection');
      return res.data;
    },
  });

  const handleConnectClick = (url: string) => {
    const width = 500;
    const height = 500;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    const title = `${selectedApp.name} connect`;
    const popup = window.open(url, title, `width=${width},height=${height},left=${left},top=${top}`);

    if (!popup) return;
  };

  const { mutate: addConnection } = useMutation({
    mutationFn: async ({
      accessToken,
      refreshToken,
      expiresAt,
      app,
    }: {
      accessToken: string;
      refreshToken: string;
      expiresAt: string;
      app: string;
    }): Promise<IAddConnectionResponse> => {
      const res = await axiosInstance.post(`/connection/${app}`, {
        accessToken,
        refreshToken,
        expiresAt,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success(`${selectedApp.name} connected successfully`);
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      setSelectedApp({ name: '', key: '' });
    },
    onError: () => {
      toast.error('Connection failed');
      setSelectedApp({ name: '', key: '' });
    },
  });

  const { mutate: removeConnection } = useMutation({
    mutationFn: async (appKey: string) => {
      await axiosInstance.delete(`/connection/${appKey}`);
    },
    onSuccess: () => {
      toast.success('Connection removed successfully');
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });

  const { mutate: getAuthUrl } = useMutation({
    mutationFn: async ({ appKey, appName }: { appKey: string; appName: string }): Promise<IGetAuthUrlResponse> => {
      setSelectedApp({ name: appName, key: appKey });
      const res = await axiosInstance.post(`/connection/${appKey}/url`);
      return res.data;
    },
    onSuccess: async ({ data: url }) => {
      handleConnectClick(url);
    },
    onError: () => {
      toast.error('Connection failed');
      setSelectedApp({ name: '', key: '' });
    },
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (config.NODE_ENV === 'production' && event.origin !== config.API_BASE_URL) return;
      const { success, accessToken, refreshToken, expiresAt, app } = event.data;
      if (!!success && accessToken) {
        addConnection({ accessToken, refreshToken, expiresAt, app });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [addConnection]);

  return (
    <div className="container mx-auto p-6">
      <Header title="Connections" description="Manage your app integrations here & get started" />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data && data.data.length > 0 ? (
          data.data.map(app => (
            <Card key={app.key} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-x-2">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg border bg-card p-2">
                      <img src={app.icon} alt={app.key} className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <CardDescription className="text-sm">{app.description}</CardDescription>
                    </div>
                  </div>
                  <div>
                    {app.status === AppStatus.CONNECTED && (
                      <Badge variant="secondary" className="whitespace-nowrap">
                        Connected
                      </Badge>
                    )}
                    {app.status === AppStatus.EXPIRED && (
                      <Badge variant="destructive" className="whitespace-nowrap">
                        Expired
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                {app.status === AppStatus.CONNECTED && app.expiresAt && (
                  <p className="text-sm text-muted-foreground">
                    Expires on:{' '}
                    <span className="font-medium text-foreground">{new Date(app.expiresAt).toUTCString()}</span>
                  </p>
                )}
                {app.status === AppStatus.EXPIRED && (
                  <p className="text-sm text-muted-foreground">
                    Expired on:{' '}
                    <span className="font-medium text-foreground">{new Date(app.expiresAt).toUTCString()}</span>
                  </p>
                )}
              </CardContent>

              <CardFooter>
                {app.status === AppStatus.DISCONNECTED || app.status === AppStatus.EXPIRED ? (
                  <Button
                    className="w-full font-semibold"
                    variant="outline"
                    onClick={() => getAuthUrl({ appKey: app.key, appName: app.name })}
                  >
                    Connect
                  </Button>
                ) : (
                  <Button
                    className="w-full font-semibold"
                    variant="destructive"
                    onClick={() => removeConnection(app.key)}
                  >
                    Remove Connection
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No connections available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
