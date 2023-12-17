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
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { Landing } from "@/components/landing";
import { Preview } from "@/components/preview";
import { Editor } from "@/components/editor";

interface DescriptionFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string().min(1)
});

export const DescriptionForm = ({
  initialData,
  courseId,
  chapterId
}: DescriptionFormProps) => {
  const [ isEditing, setIsEditing ] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: initialData.description || "" }
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
        Chapter description
        <Button variant="ghost" onClick={toggleEdit}>
          { isEditing
            ? <>Cancel</>
            : (
              <>
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit description
              </>
            )
          }
        </Button>
      </div>

      {
        !isEditing
          ? (
            <>
              { !initialData.description && <p className="text-sm text-slate-500 italic">No description</p> }
              { initialData.description && <Preview value={initialData.description} /> }
            </>
          )
          : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Editor placeholder="e.g. 'This chapter is about...'" {...field} />
                      </FormControl>
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