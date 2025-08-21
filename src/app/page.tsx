import { EquipmentForm } from '@/components/dashboard/equipment-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">טופס העברת משמרת וציוד</CardTitle>
          <CardDescription>
            נא למלא את הטופס בתחילת כל משמרת. יש לוודא את תקינות כלל הציוד הרשום.
          </CardDescription>
        </CardHeader>
        <CardContent><EquipmentForm /></CardContent>
      </Card>
    </div>
  );
}
