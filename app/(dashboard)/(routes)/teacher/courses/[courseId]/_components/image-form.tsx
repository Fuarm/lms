"use client";

import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { Course } from ".prisma/client";

import { Button } from "@/components/ui/button";
import { ImageIcon, PencilIcon, PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required"
  }).nullable()
});

export const ImageForm = ({
  initialData,
  courseId
}: ImageFormProps) => {
  const [ isEditing, setIsEditing ] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);

      toggleEdit();
      toast.success("Course updated");

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }
  return (
    <div className="w-full border bg-slate-100 rounded-md p-4 flex flex-col gap-y-2 shadow">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button variant="ghost" onClick={toggleEdit}>
          { isEditing && <>Cancel</> }
          { !isEditing && !initialData.imageUrl && (
            <>
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              Add an image
            </>
          ) }
          { !isEditing && initialData.imageUrl && (
            <>
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit image
            </>
          ) }
        </Button>
      </div>
      { !isEditing && (
        !initialData.imageUrl
          ? (
            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
              <ImageIcon className="w-12 h-12 text-slate-500" />
            </div>
          ) : (
            <div className="relative aspect-video max-h-60">
              <Image
                className="object-cover rounded-md"
                fill
                alt="upload"
                src={initialData.imageUrl!}
              />
            </div>
          )
      ) }
      { isEditing && (
        <>
          <FileUpload
            endpoint="courseImage"
            onChange={(file) => {
              if (file?.url) onSubmit({ imageUrl: file.url })
            }}
          />
          <div className="text-sm text-slate-500 text-muted-foreground">
            16:9 aspect ratio recommended
          </div>
        </>
      ) }
    </div>
  );
}