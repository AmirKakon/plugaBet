
"use client";

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
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormDetailDialog } from "./form-detail-dialog";


const chartConfig = {
  issues: {
    label: "תקלות",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export function SummaryView() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${BACKEND_BASE_URL}/api/forms`);
        if (!response.ok) {
          throw new Error('Failed to fetch submissions');
        }
        const data = await response.json();
        // The API returns { forms: [...] }, so we access data.forms
        const sortedSubmissions = (data.forms || []).sort((a: Submission, b: Submission) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setSubmissions(sortedSubmissions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, []);

  const getSubmissionStatus = (submission: Submission) => {
    const hasIssues = submission.equipmentStatus.some(
      (eq) => eq.status === "missing"
    );
    return hasIssues
      ? { text: "נרשמו חוסרים", variant: "destructive" as const }
      : { text: "תקין", variant: "default" as const };
  };

  const issueData = submissions.reduce((acc, sub) => {
    sub.equipmentStatus.forEach(item => {
      if (item.status === 'missing') {
        const existingItem = acc.find(d => d.equipment === item.name);
        if (existingItem) {
          existingItem.issues += 1;
        } else {
          acc.push({ equipment: item.name, issues: 1 });
        }
      }
    });
    return acc;
  }, [] as { equipment: string; issues: number }[]).filter(d => d.issues > 0);


  return (
    <>
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>דוחות אחרונים</CardTitle>
            <CardDescription>רשימת חתימות אחרונות על טפסי ציוד. לחץ על שורה לפרטים.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : error ? (
                <Alert variant="destructive">
                  <AlertTitle>שגיאה</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם חייל</TableHead>
                  <TableHead className="hidden md:table-cell">מ"א</TableHead>
                  <TableHead>משימה</TableHead>
                  <TableHead className="hidden sm:table-cell">תאריך</TableHead>
                  <TableHead className="text-left">סטטוס</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => {
                  const status = getSubmissionStatus(submission);
                  return (
                    <TableRow key={submission.id} onClick={() => setSelectedSubmissionId(submission.id)} className="cursor-pointer">
                      <TableCell className="font-medium">{`${submission.firstName} ${submission.lastName}`}</TableCell>
                      <TableCell className="hidden md:table-cell">{submission.soldierId}</TableCell>
                      <TableCell>{submission.task}</TableCell>
                      <TableCell className="hidden sm:table-cell">{format(new Date(submission.date), 'dd/MM/yyyy HH:mm')}</TableCell>
                      <TableCell className="text-left">
                        <Badge variant={status.variant}>{status.text}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>סיכום חוסרים בציוד</CardTitle>
            <CardDescription>כמות חוסרים מדווחים לפי סוג ציוד.</CardDescription>
          </CardHeader>
          <CardContent>
             {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : issueData.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={issueData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="equipment"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 15)}
                  reversed
                  width={100}
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
                <p className="text-muted-foreground">לא נרשמו חוסרים.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <FormDetailDialog 
        submissionId={selectedSubmissionId}
        onOpenChange={(isOpen) => {
            if(!isOpen) {
                setSelectedSubmissionId(null)
            }
        }}
       />
    </>
  );
}
