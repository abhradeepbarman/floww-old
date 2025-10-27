import type { CommonResponse } from '@/@types/common';
import Header from '@/components/common/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import config from '@/config';
import axiosInstance from '@/lib/axios';
import { AppStatus } from '@repo/common/types';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

interface IGetConnectionResponse extends CommonResponse {
  data: {
    name: string;
    key: string;
    icon: string;
    status: AppStatus;
    description: string;
    expiresAt: Date;
  }[];
}

const queryClient = new QueryClient();

const Connections = () => {
  const [externalPopup, setExternalPopup] = useState<Window | null>(null);
  const [selectedAppKey, setSelectedAppKey] = useState<string>('');
  const { data } = useQuery({
    queryKey: ['connections'],
    queryFn: async (): Promise<AxiosResponse<IGetConnectionResponse>> => {
      return await axiosInstance.get('/connection');
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async ({ code, selectedAppKey }: { code: string; selectedAppKey: string }) => {
      await axiosInstance.post(`/connection/${selectedAppKey}/token`, { code });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['connections'],
      });
    },
  });

  const handleConnectClick = (appKey: string, appName: string) => {
    setSelectedAppKey(appKey);
    const width = 700;
    const height = 500;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    const title = `${appName} connect`;
    const url = `${config.API_BASE_URL}/api/v1/connection/${appKey}`;
    const popup = window.open(url, title, `width=${width},height=${height},left=${left},top=${top}`);
    setExternalPopup(popup);
  };

  useEffect(() => {
    if (!externalPopup) return;

    const timer = setInterval(() => {
      if (externalPopup.closed) {
        clearInterval(timer);
        setExternalPopup(null);
        setSelectedAppKey('');
        return;
      }

      const currentUrl = externalPopup.location.href;
      if (!currentUrl) return;

      const searchParams = new URL(currentUrl).searchParams;
      const code = searchParams.get('code');

      if (code) {
        externalPopup.close();
        clearInterval(timer);
        setExternalPopup(null);
        console.log(`Popup returned code = ${code}`);

        mutateAsync({ code, selectedAppKey })
          .then(() => console.log('Connected successfully'))
          .catch(err => console.error('Error connecting:', err))
          .finally(() => {
            setSelectedAppKey('');
          });
      }
    }, 500);

    return () => clearInterval(timer);
  }, [externalPopup, mutateAsync, selectedAppKey]);

  return (
    <div>
      <Header title="Connections" description="Manage your app integrations here & get started" />
      <div className="mt-5 flex">
        {data?.data?.data &&
          data.data.data.length > 0 &&
          data.data.data.map(app => (
            <Card key={app.key} className="w-full max-w-sm h-[200px] flex flex-col">
              <CardHeader className="flex justify-between">
                <div className="flex items-center gap-x-3">
                  <img src={app.icon} alt={app.key} className="w-8 h-8" />
                  <div>
                    <p className="text-xl font-semibold">{app.name}</p>
                    <p className="text-sm">{app.description}</p>
                  </div>
                </div>
                <div>
                  {app.status == AppStatus.CONNECTED && (
                    <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums" variant="secondary">
                      Connected
                    </Badge>
                  )}
                  {app.status == AppStatus.EXPIRED && (
                    <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums" variant="destructive">
                      Expired
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                {app.status === AppStatus.CONNECTED && (
                  <p className="text-sm text-muted-foreground">
                    Expires on: <span className="font-semibold">{app.expiresAt.toString()}</span>
                  </p>
                )}
                {app.status === AppStatus.EXPIRED && (
                  <p className="text-sm text-muted-foreground">
                    Expired on: <span className="font-semibold">{app.expiresAt.toString()}</span>
                  </p>
                )}
              </CardContent>
              <CardFooter className="justify-end">
                {app.status === AppStatus.DISCONNECTED || app.status === AppStatus.EXPIRED ? (
                  <Button
                    className="w-full font-semibold"
                    variant={'outline'}
                    onClick={() => handleConnectClick(app.key, app.name)}
                  >
                    Connect
                  </Button>
                ) : (
                  <Button className="w-full font-semibold" variant={'destructive'}>
                    Remove Connection
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Connections;
