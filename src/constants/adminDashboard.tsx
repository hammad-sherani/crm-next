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
  _id: string;
  username: string;
  email: string;
  status: string;
}

// Create columns function that accepts handlers
export const createColumns = (
  onEdit?: (userId: string) => void,
  onView?: (userId: string) => void,
  onDelete?: (userId: string) => void,
  onStatusChange?: (userId: string, status: string) => void,
  isDeleting?: boolean
): ColumnDef<User>[] => [
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
      accessorKey: "name",
      header: "User Name",
      cell: ({ row }) => {
        return <span className="font-medium capitalize">{row?.getValue("name")}</span>;
      },
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
  cell: ({ row }) => {
    const status = (row.getValue("status") as string) || "NA";

    const statusClass =
      status.toLowerCase() === "active"
        ? "bg-green-100/20 text-green-300"
        : status.toLowerCase() === "blocked"
        ? "bg-red-500/20 text-red-400"
        : "bg-gray-500/20 text-gray-400";

    return (
      <span
        className={`capitalize px-3 py-1 text-sm font-medium rounded-full ${statusClass}`}
      >
        {status}
      </span>
    );
  },
},
    {
      id: "actions",
      header: "Actions",
      // Inside the "actions" column cell
      cell: ({ row }) => {
        const user = row.original;
        const status = user.status;

        const actions = [
          {
            label: "Edit",
            icon: "uil:edit",
            onClick: () => onEdit?.(user._id),
            variant: "secondary" as const
          },
          {
            label: "View",
            icon: "grommet-icons:view",
            onClick: () => onView?.(user._id),
            variant: "secondary" as const
          },
          {
            label: "Delete",
            icon: "uil:trash",
            onClick: () => onDelete?.(user._id),
            variant: "destructive" as const
          },
        ];

        const statusButtons = [
          {
            show: status === "pending",
            icon: "ci:clock",
            tooltip: "Approve",
            statusToSet: "active"
          },
          {
            show: status === "rejected" || status === "pending",
            icon: "ic:baseline-check",
            tooltip: "Active",
            statusToSet: "active"
          },
          {
            show: status === "active" || status === "pending",
            icon: "material-symbols-light:close-rounded",
            tooltip: "Reject",
            statusToSet: "rejected"
          },
        ];

        return (
          <TooltipProvider>
            <div className="flex items-center space-x-2">
              {statusButtons.map(
                ({ show, icon, tooltip, statusToSet }, i) =>
                  show && (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-7 w-7 p-0 rounded-sm"
                          onClick={() =>
                            onStatusChange?.(user._id, statusToSet)
                          }
                        >
                          <Icon icon={icon} width="24" height="24" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
              )}

              {actions.map(({ label, icon, onClick, variant }, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={variant}
                      className="h-7 w-7 p-0 rounded-sm"
                      onClick={onClick}
                      disabled={label === "Delete" && isDeleting}
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
      }

    },
  ];

// Keep the original columns export for backward compatibility
export const columns: ColumnDef<User>[] = createColumns();