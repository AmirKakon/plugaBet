import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, FileSignature, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="container mx-auto text-center py-12 px-4">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
              ברוכים הבאים למערכת פלוגה ב׳
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              כאן תוכלו לנהל את משימות ונוכחות החיילים בפלוגה.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
             <Card className="text-right flex flex-col">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                  <FileSignature className="w-6 h-6 text-accent" />
                  <span>טופס ציוד</span>
                </CardTitle>
                <CardDescription>
                  חתמו על ציוד בתחילת כל משימה ודווחו על תקלות.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Button asChild size="lg" className="w-full">
                  <Link href="/equipment">
                    <span>למעבר לטופס</span>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="text-right flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="w-6 h-6 text-accent" />
                  <span>אזור מנהל</span>
                </CardTitle>
                <CardDescription>
                  צפייה וניהול של דוחות וסיכומי משמרות. הכניסה למורשים בלבד.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link href="/login">
                    <span>כניסה למנהל</span>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
