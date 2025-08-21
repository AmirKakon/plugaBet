
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; 
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BACKEND_BASE_URL } from "@/lib/constants";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "שם פרטי הוא שדה חובה" }),
  lastName: z.string().min(2, { message: "שם משפחה הוא שדה חובה" }),
  soldierId: z.string().regex(/^[0-9]{7}$/, { message: "מספר אישי לא תקין" }),
  sleepingOnBase: z.boolean().default(false),
});

export function AttendanceForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      soldierId: "",
      sleepingOnBase: false,
    },
  });

  async function handleNextStep() {
    const isValid = await form.trigger(["firstName", "lastName", "soldierId"]);
    if (isValid) {
      setStep(2);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, date: new Date().toISOString() }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setIsSuccess(true);
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "הייתה בעיה בשליחת הטופס. נסה שוב.",
        variant: "destructive",
      })
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <Alert variant="default" className="border-green-500 bg-green-50 text-green-800">
        <CheckCircle className="h-4 w-4 !text-green-500" />
        <AlertTitle>הדיווח נשלח בהצלחה!</AlertTitle>
        <AlertDescription>
          תודה {form.getValues('firstName')}, הדיווח שלך נקלט במערכת.
        </AlertDescription>
         <Button onClick={() => {
           setIsSuccess(false);
           setStep(1);
           form.reset();
         }} variant="outline" className="mt-4">
          דיווח חדש
        </Button>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>
        {step === 1 && (
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-medium">שלב 1: פרטים אישיים</h3>
                    <p className="text-sm text-muted-foreground">נא למלא את פרטי החייל/ת המדווח/ת.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>שם פרטי</FormLabel>
                            <FormControl>
                            <Input placeholder="ישראל" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>שם משפחה</FormLabel>
                            <FormControl>
                            <Input placeholder="ישראלי" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="soldierId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>מספר אישי</FormLabel>
                        <FormControl>
                            <Input placeholder="1234567" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button onClick={handleNextStep} size="lg">הבא</Button>
            </div>
        )}

        {step === 2 && (
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-medium">שלב 2: דיווח לינה</h3>
                    <p className="text-sm text-muted-foreground">נא לסמן אם את/ה נשאר/ת ללינה בבסיס.</p>
                </div>
                <FormField
                control={form.control}
                name="sleepingOnBase"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">
                        נשאר/ת ללינה בבסיס?
                        </FormLabel>
                        <FormDescription>
                        סמן אם אתה מתכנן לישון בבסיס הלילה.
                        </FormDescription>
                    </div>
                    <FormControl>
                        <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    </FormItem>
                )}
                />
                <div className="flex gap-4">
                    <Button type="button" onClick={() => setStep(1)} variant="outline">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        חזור
                    </Button>
                    <button type="submit" disabled={isSubmitting} className={cn(buttonVariants({ size: "lg" }))}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "שלח דיווח"}
                    </button>
                </div>
            </div>
        )}
      </form>
    </Form>
  );
}
