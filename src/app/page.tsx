import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://placehold.co/1920x1080/e8f0fe/4a6572"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-20"
          data-ai-hint="military base background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            פלוגה ב
          </CardTitle>
          <p className="text-muted-foreground">ניהול ציוד והעברת משמרות</p>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
