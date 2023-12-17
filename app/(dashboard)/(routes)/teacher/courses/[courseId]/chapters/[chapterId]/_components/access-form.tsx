"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

import type { Chapter } from "@prisma/client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { Landing } from "@/components/landing";
import { Preview } from "@/components/preview";
import { Checkbox } from "@/components/ui/checkbox";

interface AccessFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false)
});

export const AccessForm = ({
  initialData,
  courseId,
  chapterId
}: AccessFormProps) => {
  const [ isEditing, setIsEditing ] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { isFree: initialData.isFree }
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);

      toggleEdit();
      toast.success("Chapter updated");

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="w-full border bg-slate-100 rounded-md p-4 flex flex-col gap-y-2 shadow">
      <div className="font-medium flex items-center justify-between">
        Chapter access
        <Button variant="ghost" onClick={toggleEdit}>
          { isEditing
            ? <>Cancel</>
            : (
              <>
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit access
              </>
            )
          }
        </Button>
      </div>

      {
        !isEditing
          ? (
            <p className="text-sm">
              { initialData.isFree ? "This chapter is free for preview." : "This chapter is no free." }
            </p>
          )
          : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="isFree"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0 rounded-md border p-4 border-sky-100 bg-sky-100/50">
                      <FormControl>
                        <Checkbox className="mt-px" checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormDescription className="text-sm text-slate-500">
                        Check this box if you want to make this chapter free for preview.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <Button className="gap-x-2" disabled={!isValid || isSubmitting}>
                  { isSubmitting && <Landing isLoading={isSubmitting} /> }
                  <span>Save</span>
                </Button>
              </form>
            </Form>
          )
      }
    </div>
  );
}