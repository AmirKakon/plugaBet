import { AttendanceForm } from '@/components/attendance/attendance-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AttendancePage() {
  return (
    <div className="container mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">דיווח נוכחות לינה</CardTitle>
          <CardDescription>
            נא למלא את הטופס כדי לדווח אם אתה נשאר ללינה בבסיס.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceForm />
        </CardContent>
      </Card>
    </div>
  );
}
