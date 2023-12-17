"use client";

import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import type { Chapter, MuxData } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { PencilIcon, PlusCircleIcon, VideoIcon } from "lucide-react";
import { FileUpload } from "@/components/file-upload";

interface VideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1).nullable()
});

export const VideoForm = ({
  initialData,
  courseId,
  chapterId
}: VideoFormProps) => {
  const [ isEditing, setIsEditing ] = useState(false);

  const toggleEdit = () => setIsEditing(current => !current);

  const router = useRouter();

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
        Chapter video
        <Button variant="ghost" onClick={toggleEdit}>
          { isEditing && <>Cancel</> }
          { !isEditing && !initialData.videoUrl && (
            <>
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              Add a video
            </>
          ) }
          { !isEditing && initialData.videoUrl && (
            <>
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit video
            </>
          ) }
        </Button>
      </div>
      { !isEditing && (
        !initialData.videoUrl
          ? (
            <div className="h-60 bg-slate-200 rounded-md cursor-pointer" onClick={toggleEdit}>
              <VideoIcon className="w-12 h-12 text-slate-500 mx-auto mt-20" />
              <div className="flex items-center justify-center gap-x-1 text-sm">
                <PlusCircleIcon className="w-4 h-4 mr-2" />
                Add a video
              </div>
            </div>
          ) : (
            <MuxPlayer
              className="max-h-80 aspect-video"
              playbackId={initialData?.muxData?.playbackId || ""}
            />
          )
      ) }
      { isEditing && (
        <>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(file) => {
              if (file?.url) onSubmit({ videoUrl: file.url })
            }}
          />
          <div className="text-sm text-slate-500 text-muted-foreground">
            Upload this chapter&apos;s video.
          </div>
        </>
      ) }
      {initialData.videoUrl && !isEditing && (
        <p className="text-xs text-muted-foreground">
          Videos can take a few minutes to process. Refresh the page if video does not appear.
        </p>
      )}
    </div>
  );
}