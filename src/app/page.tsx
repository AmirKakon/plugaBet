import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto text-center">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            ברוכים הבאים למערכת פלוגה ב׳
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            כאן תוכלו לנהל את משימות ונוכחות החיילים בפלוגה.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="text-right">
            <CardHeader>
              <CardTitle>דיווח נוכחות</CardTitle>
              <CardDescription>
                מלאו את טופס הנוכחות היומי וציינו אם אתם נשארים ללינה בבסיס.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg">
                <Link href="/attendance">
                  <span>למעבר לטופס</span>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="text-right">
            <CardHeader>
              <CardTitle>אזור מנהל</CardTitle>
              <CardDescription>
                צפייה וניהול של דוחות וסיכומי משמרות. הכניסה למורשים בלבד.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" variant="outline">
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
  );
}
