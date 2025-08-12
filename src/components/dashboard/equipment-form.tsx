"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { EQUIPMENT_LIST, RANKS } from "@/lib/constants";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Loader2 } from "lucide-react";

const equipmentStatusSchema = z.object({
  equipmentId: z.string(),
  name: z.string(),
  isOk: z.boolean(),
  comment: z.string().optional(),
}).refine(data => data.isOk || (!data.isOk && data.comment && data.comment.length > 0), {
  message: "יש למלא הערה במקרה של תקלה",
  path: ["comment"],
});

const formSchema = z.object({
  soldierName: z.string().min(2, { message: "שם הוא שדה חובה" }),
  rank: z.string({ required_error: "דרגה היא שדה חובה" }),
  equipment: z.array(equipmentStatusSchema),
  confirmation: z.literal(true, {
    errorMap: () => ({ message: "יש לאשר את ההצהרה" }),
  }),
});

export function EquipmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soldierName: "",
      equipment: EQUIPMENT_LIST.map(eq => ({ equipmentId: eq.id, name: eq.name, isOk: true, comment: "" })),
      confirmation: false,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "equipment",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log(values);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      form.reset();
    }, 1500);
  }

  if (isSuccess) {
    return (
      <Alert variant="default" className="border-green-500 bg-green-50 text-green-800">
        <CheckCircle className="h-4 w-4 !text-green-500" />
        <AlertTitle>הטופס נשלח בהצלחה!</AlertTitle>
        <AlertDescription>
          העברת המשמרת תועדה במערכת. ניתן לסגור חלון זה.
        </AlertDescription>
         <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-4">
          מילוי טופס חדש
        </Button>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="soldierName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>שם מלא</FormLabel>
                <FormControl>
                  <Input placeholder="ישראל ישראלי" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>דרגה</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר דרגה" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RANKS.map(rank => (
                      <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">בדיקת ציוד</h3>
          <div className="space-y-6">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`equipment.${index}`}
                render={({ field: itemField }) => (
                  <FormItem className="p-4 border rounded-lg bg-card/50">
                    <FormLabel className="text-base">{itemField.value.name}</FormLabel>
                    <FormDescription>
                      {EQUIPMENT_LIST.find(eq => eq.id === itemField.value.equipmentId)?.description}
                    </FormDescription>
                    <div className="py-2">
                       <FormField
                        control={form.control}
                        name={`equipment.${index}.isOk`}
                        render={({ field: checkField }) => (
                          <FormItem className="flex items-center gap-4">
                            <FormLabel>האם תקין?</FormLabel>
                            <FormControl>
                               <Checkbox
                                checked={checkField.value}
                                onCheckedChange={checkField.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    {!form.watch(`equipment.${index}.isOk`) && (
                      <FormField
                        control={form.control}
                        name={`equipment.${index}.comment`}
                        render={({ field: commentField }) => (
                          <FormItem className="mt-2">
                            <FormLabel>פירוט התקלה</FormLabel>
                            <FormControl>
                              <Textarea placeholder="פרט את הבעיה..." {...commentField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <Separator />

        <FormField
          control={form.control}
          name="confirmation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm" dir="rtl">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  אני, {form.watch('soldierName') || "החייל/ת"}, מאשר/ת כי בדקתי את כלל הציוד ומצאתי אותו במצב המתואר לעיל.
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} variant="accent" size="lg">
          {isSubmitting ? <Loader2 className="animate-spin" /> : "שלח וחתום"}
        </Button>
      </form>
    </Form>
  );
}
