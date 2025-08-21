
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { BACKEND_BASE_URL } from '@/lib/constants';

const formSchema = z.object({
  username: z.string().min(1, { message: 'שם משתמש הוא שדה חובה' }),
  password: z.string().min(1, { message: 'סיסמה היא שדה חובה' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    try {
      const { username, password } = values;
      const url = `${BACKEND_BASE_URL}/api/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

      const response = await fetch(url);
      
      if (response.ok) {
        sessionStorage.setItem('isAuthenticated', 'true');
        router.push('/admin');
      } else {
        toast({
          title: 'שגיאת התחברות',
          description: 'שם המשתמש או הסיסמה שהזנת שגויים.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'אירעה שגיאה בלתי צפויה. נסה שוב מאוחר יותר.',
        variant: 'destructive',
      });
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם משתמש</FormLabel>
              <FormControl>
                <Input placeholder="הכנס שם משתמש" {...field} />
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
              <FormLabel>סיסמה</FormLabel>
              <FormControl>
                <Input type="password" placeholder="הכנס סיסמה" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          התחבר
        </Button>
      </form>
    </Form>
  );
}
