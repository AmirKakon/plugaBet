import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, FileSignature, CalendarCheck } from 'lucide-react';
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-right flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck className="w-6 h-6 text-accent" />
                  <span>דיווח נוכחות</span>
                </CardTitle>
                <CardDescription>
                  מלאו את טופס הנוכחות היומי וציינו אם אתם נשארים ללינה בבסיס.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Button asChild size="lg" className="w-full">
                  <Link href="/attendance">
                    <span>למעבר לטופס</span>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
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
            <Card className="text-right flex flex-col md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-accent"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span>אזור מנהל</span>
                </CardTitle>
                <CardDescription>
                  צפייה וניהול של דוחות וסיכומי משמרות. הכניסה למורשים בלבד.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link href="/admin">
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
