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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { EQUIPMENT_LIST } from "@/lib/constants";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Loader2, Check, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const equipmentStatusSchema = z.object({
  equipmentId: z.string(),
  name: z.string(),
  status: z.enum(["ok", "issue"]),
  quantity: z.number().min(0, { message: "כמות חייבת להיות מספר חיובי" }),
  comment: z.string().optional(),
}).refine(data => data.status === 'ok' || (data.status === 'issue' && data.comment && data.comment.length > 0), {
  message: "יש למלא הערה במקרה של תקלה",
  path: ["comment"],
});

const formSchema = z.object({
  firstName: z.string().min(2, { message: "שם פרטי הוא שדה חובה" }),
  lastName: z.string().min(2, { message: "שם משפחה הוא שדה חובה" }),
  soldierId: z.string().regex(/^[0-9]{7}$/, { message: "מספר אישי לא תקין" }),
  equipment: z.array(equipmentStatusSchema),
  confirmation: z.literal(true, {
    errorMap: () => ({ message: "יש לאשר את ההצהרה" }),
  }),
});

export function EquipmentForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      soldierId: "",
      equipment: EQUIPMENT_LIST.map(eq => ({ 
        equipmentId: eq.id, 
        name: eq.name, 
        status: "ok", 
        quantity: eq.defaultQuantity, 
        comment: "" 
      })),
      confirmation: false,
    },
  });

  const { fields, update } = useFieldArray({
    control: form.control,
    name: "equipment",
  });

  async function handleNextStep() {
    const isValid = await form.trigger(["firstName", "lastName", "soldierId"]);
    if (isValid) {
      setStep(2);
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    console.log(values);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // form.reset(); // Don't reset, so we can show the success message
    }, 1500);
  }

  if (isSuccess) {
    return (
      <Alert variant="default" className="border-green-500 bg-green-50 text-green-800">
        <CheckCircle className="h-4 w-4 !text-green-500" />
        <AlertTitle>הטופס נשלח בהצלחה!</AlertTitle>
        <AlertDescription>
          העברת המשמרת תועדה במערכת. תודה {form.getValues('firstName')}.
        </AlertDescription>
         <Button onClick={() => {
           setIsSuccess(false);
           setStep(1);
           form.reset();
         }} variant="outline" className="mt-4">
          מילוי טופס חדש
        </Button>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium">שלב 1: פרטים אישיים</h3>
              <p className="text-sm text-muted-foreground">נא למלא את פרטי החייל/ת המקבל/ת את המשמרת.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
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
              <h3 className="text-lg font-medium">שלב 2: בדיקת ציוד</h3>
              <p className="text-sm text-muted-foreground">נא לוודא את תקינות וכמות כלל הציוד הרשום.</p>
            </div>
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg bg-card/50">
                   <div className="flex justify-between items-start">
                      <div>
                        <FormLabel className="text-base">{field.name}</FormLabel>
                        <FormDescription>
                          {EQUIPMENT_LIST.find(eq => eq.id === field.equipmentId)?.description}
                        </FormDescription>
                      </div>
                       <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant={form.watch(`equipment.${index}.status`) === 'ok' ? 'secondary' : 'ghost'}
                            size="icon"
                            className={cn("h-8 w-8", form.watch(`equipment.${index}.status`) === 'ok' && "border-2 border-green-500")}
                            onClick={() => update(index, { ...form.getValues(`equipment.${index}`), status: 'ok' })}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                           <Button
                            type="button"
                             variant={form.watch(`equipment.${index}.status`) === 'issue' ? 'destructive' : 'ghost'}
                            size="icon"
                             className="h-8 w-8"
                            onClick={() => update(index, { ...form.getValues(`equipment.${index}`), status: 'issue' })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                      </div>
                   </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                       <FormField
                          control={form.control}
                          name={`equipment.${index}.quantity`}
                          render={({ field: quantityField }) => (
                            <FormItem>
                              <FormLabel>כמות</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...quantityField}
                                  onChange={e => quantityField.onChange(parseInt(e.target.value, 10) || 0)}
                                  />
                              </FormControl>
                               <FormMessage />
                            </FormItem>
                          )}
                        />
                      {form.watch(`equipment.${index}.status`) === 'issue' && (
                        <FormField
                          control={form.control}
                          name={`equipment.${index}.comment`}
                          render={({ field: commentField }) => (
                            <FormItem>
                              <FormLabel>פירוט התקלה</FormLabel>
                              <FormControl>
                                <Textarea placeholder="פרט את הבעיה..." {...commentField} />
                              </FormControl>
                               <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                </div>
              ))}
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
                      אני, {form.watch('firstName') || "החייל/ת"}, מאשר/ת כי בדקתי את כלל הציוד ומצאתי אותו במצב המתואר לעיל.
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button type="button" onClick={() => setStep(1)} variant="outline">
                <ArrowLeft className="ml-2 h-4 w-4" />
                חזור
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="accent" size="lg">
                {isSubmitting ? <Loader2 className="animate-spin" /> : "שלח וחתום"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
