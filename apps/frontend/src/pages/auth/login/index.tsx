import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axiosInstance from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { authValidators } from '@repo/common/validators';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const Login = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof authValidators.loginSchema>) => {
      return axiosInstance.post('/auth/login', values);
    },
    onSuccess: res => {
      localStorage.setItem('user', JSON.stringify(res.data.data));
      navigate('/dashboard');
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message);
    },
  });

  const form = useForm<z.infer<typeof authValidators.loginSchema>>({
    resolver: zodResolver(authValidators.loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof authValidators.loginSchema>) => {
    await mutate(values);
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>Enter your email below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldGroup>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="test@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Field>
                      <Button type="submit">
                        {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : 'Login'}
                      </Button>
                      <Button variant="outline" type="button">
                        Login with Google
                      </Button>
                      <FieldDescription className="text-center">
                        Don&apos;t have an account? <Link to={'/register'}>Register</Link>
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
