import { EquipmentForm } from '@/components/equipment/equipment-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function EquipmentPage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">טופס חתימה על ציוד</CardTitle>
          <CardDescription>
            נא למלא את כל השלבים כדי לחתום על הציוד למשימה.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentForm />
        </CardContent>
      </Card>
    </div>
  );
}
