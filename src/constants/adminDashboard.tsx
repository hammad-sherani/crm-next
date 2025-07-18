"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

 export const adminLinks = [
      { label: "Dashboard", icon: "heroicons:home-16-solid", href: "/admin/dashboard" },
      { label: "Users", icon: "heroicons:user-group-16-solid", href: "/admin/users" },
      { label: "Settings", icon: "heroicons:cog-16-solid", href: "/admin/settings" },
      // Add more links here...
    ];


export type User = {
  id: string
  email: string
  status: string
  amount: number
}

export const userData: User[] = [
  { id: "1", email: "ken99@example.com", status: "Success", amount: 316 },
  { id: "2", email: "abe45@example.com", status: "Success", amount: 242 },
  { id: "3", email: "monserrat44@example.com", status: "Processing", amount: 837 },
  { id: "4", email: "silas22@example.com", status: "Success", amount: 874 },
  { id: "5", email: "carmella@example.com", status: "Failed", amount: 721 },
]




export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      return <div>${amount.toFixed(2)}</div>
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: () => (
      <div className="flex items-center space-x-2">
      <Button variant="secondary" className="h-4 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      <Button variant="secondary" className="h-4 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      </div>
    ),
  },
]
