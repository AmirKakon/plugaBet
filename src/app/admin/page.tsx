import { SummaryView } from "@/components/admin/summary-view";

export default function AdminPage() {
  return (
    <div className="container mx-auto">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">סיכום דוחות ונוכחות</h2>
          <p className="text-muted-foreground">
            צפה בדוחות אחרונים ונתוני נוכחות.
          </p>
        </div>
        <SummaryView />
      </div>
    </div>
  );
}
