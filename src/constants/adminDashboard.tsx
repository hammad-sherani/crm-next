import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Icon } from "@iconify/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const adminLinks = [
  { label: "Dashboard", icon: "heroicons:home-16-solid", href: "/admin/dashboard" },
  { label: "Users", icon: "heroicons:user-group-16-solid", href: "/admin/users" },
  { label: "Settings", icon: "heroicons:cog-16-solid", href: "/admin/settings" },
];

export interface User {
  id: string;
  name: string;
  email: string;
  status: string;
}

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name", // Changed from userName to name
    header: "Name",
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
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => {
      const actions = [
        { label: "Edit", icon: "uil:edit", onClick: () => {}, variant: "secondary" },
        { label: "View", icon: "grommet-icons:view", onClick: () => {}, variant: "secondary" },
        { label: "Delete", icon: "uil:trash", onClick: () => {}, variant: "destructive" },
      ] as const; // Use const assertion to narrow variant types
      return (
        <TooltipProvider>
          <div className="flex items-center space-x-2">
            {actions.map(({ label, icon, onClick, variant }, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <Button
                    variant={variant} // Type-safe: variant is 'secondary' | 'destructive'
                    className="h-7 w-7 p-0 rounded-sm"
                    onClick={onClick}
                  >
                    <Icon icon={icon} className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      );
    },
  },
];