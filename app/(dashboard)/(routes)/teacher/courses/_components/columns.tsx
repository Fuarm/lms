"use client"

import { ColumnDef } from "@tanstack/react-table";
import type { Course } from "@prisma/client";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

import Link from "next/link";
import { ArrowUpDown, MoreHorizontal, PencilIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-x-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-x-1"
          onClick={ () => column.toggleSorting(column.getIsSorted() === "asc") }
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4"/>
        </button>
      )
    },
    cell: ({row}) => {
      const price = parseFloat(row.getValue("price") || "0");

      return <span>{formatPrice(price)}</span>
    }
  },
  {
    accessorKey: "isPublished",
    header: ({column}) => {
      return (
        <button
          className="flex items-center gap-x-1"
          onClick={ () => column.toggleSorting(column.getIsSorted() === "asc") }
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4"/>
        </button>
      )
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;

      return (
        <Badge className={cn(
          "bg-slate-500",
          isPublished && "bg-sky-700 hover:bg-sky-700/80"
        )}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-4 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/teacher/courses/${id}`}>
              <DropdownMenuItem>
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
]
