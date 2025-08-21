"use client";

import { MOCK_SUBMISSIONS, EQUIPMENT_LIST } from "@/lib/constants";
import type { Submission } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "@/components/ui/chart";

const chartConfig = {
  issues: {
    label: "תקלות",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export function SummaryView() {
  const submissions = MOCK_SUBMISSIONS.sort((a, b) => b.date.getTime() - a.date.getTime());

  const getSubmissionStatus = (submission: Submission) => {
    const hasIssues = submission.equipmentStatus.some(
      (eq) => eq.status === "issue"
    );
    return hasIssues
      ? { text: "נרשמו תקלות", variant: "destructive" as const }
      : { text: "תקין", variant: "default" as const };
  };

  const issueData = EQUIPMENT_LIST.map(equipment => {
    const issueCount = submissions.reduce((acc, sub) => {
      const eqStatus = sub.equipmentStatus.find(es => es.equipmentId === equipment.id);
      return acc + (eqStatus?.status === 'issue' ? 1 : 0);
    }, 0);
    return { equipment: equipment.name, issues: issueCount };
  }).filter(d => d.issues > 0);


  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>דוחות אחרונים</CardTitle>
          <CardDescription>רשימת חתימות אחרונות על טפסי ציוד.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם חייל</TableHead>
                <TableHead>מ"א</TableHead>
                <TableHead>משימה</TableHead>
                <TableHead>תאריך</TableHead>
                <TableHead className="text-left">סטטוס</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => {
                const status = getSubmissionStatus(submission);
                return (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{`${submission.firstName} ${submission.lastName}`}</TableCell>
                    <TableCell>{submission.soldierId}</TableCell>
                    <TableCell>{submission.task}</TableCell>
                    <TableCell>{format(submission.date, 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell className="text-left">
                      <Badge variant={status.variant}>{status.text}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>סיכום תקלות בציוד</CardTitle>
          <CardDescription>כמות תקלות מדווחות לפי סוג ציוד.</CardDescription>
        </CardHeader>
        <CardContent>
          {issueData.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={issueData} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="equipment"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 15)}
                reversed
              />
              <XAxis dataKey="issues" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="issues" fill="var(--color-issues)" radius={4} />
            </BarChart>
          </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-muted-foreground">לא נרשמו תקלות.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
