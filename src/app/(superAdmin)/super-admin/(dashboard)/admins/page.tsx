/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import * as React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, X, Clock, Search, Loader2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { handleError } from '@/helper/handleError';
import { toast } from 'sonner';

type Admin = {
    id: string;
    name: string;
    email: string;
    country: string;
    phoneNumber: string;
    status: 'ACTIVE' | 'BLOCK' | 'PENDING';
};

const AdminTable = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [admins, setAdmins] = React.useState<Admin[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [updatingStatus, setUpdatingStatus] = React.useState<string | null>(null);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/super-admin/admin", { cache: "no-store" });
            const data = await res.json();
            setAdmins(data.admins);
        } catch (error) {
            console.error("Failed to fetch admins:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchAdmins();
    }, []);

    console.log(admins);

    const filteredData = React.useMemo(() => {
        const term = searchTerm.toLowerCase();
        return admins.filter(
            (admin) =>
                admin.name.toLowerCase().includes(term) ||
                admin.email.toLowerCase().includes(term) ||
                admin.country.toLowerCase().includes(term)
        );
    }, [searchTerm, admins]);

    const columns = React.useMemo<ColumnDef<Admin>[]>(() => [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ getValue }) => (
                <span className="font-medium text-gray-900 dark:text-gray-100">
                    {getValue() as string}
                </span>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ getValue }) => (
                <a href={`mailto:${getValue()}`} className=" hover:underline ">
                    {getValue() as string}
                </a>
            ),
        },
        { accessorKey: 'country', header: 'Country' },
        {
            accessorKey: 'phoneNumber',
            header: 'Phone',
            cell: ({ getValue }) => (
                <span className="text-gray-600 dark:text-gray-400">{getValue() as string}</span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ getValue }) => {
                const status = getValue() as Admin['status'];

                const statusClasses: Record<string, string> = {
                    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                    inactive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                };

                const badgeClass =
                    statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-200';

                return <Badge className={cn('capitalize', badgeClass)}>{status}</Badge>;
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const { status } = row.original;
                const id = row.original.id;
                const isRejectable = status === 'ACTIVE' || status === 'PENDING';
                const isActive = status === 'BLOCK' || status === 'PENDING';
                const isUpdating = updatingStatus === id;

                const ActionButton = ({
                    icon: Icon,
                    tooltip,
                    className,
                    disabled = false,
                }: {
                    icon: React.ElementType;
                    tooltip: string;
                    className: string;
                    disabled?: boolean;
                }) => (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn('h-8 w-8 p-0', className)}
                                onClick={() => handleStatusChange(tooltip, id)}
                                disabled={disabled || isUpdating}
                            >
                                {isUpdating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Icon className="h-4 w-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{tooltip}</TooltipContent>
                    </Tooltip>
                );

                return (
                    <div className="flex gap-1">
                        {isActive && (
                            <ActionButton
                                icon={Check}
                                tooltip="Active"
                                className="hover:bg-green-50 text-green-600 dark:text-green-400 dark:hover:bg-green-900/30"
                            />
                        )}

                        {isRejectable && (
                            <ActionButton
                                icon={X}
                                tooltip="Block"
                                className="hover:bg-red-50 text-red-600 dark:text-red-400 dark:hover:bg-red-900/30"
                            />
                        )}

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={cn('h-8 w-8 p-0')}
                                    // onClick={() => handleStatusChange(tooltip, id)}
                                    // disabled={disabled || isUpdating}
                                >
                                    {/* {isUpdating ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Icon className="h-4 w-4" />
                                    )} */}

                                    <Eye />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>View</TooltipContent>
                        </Tooltip>
                    </div>
                );
            },
        },
    ], [updatingStatus]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleStatusChange = async (status: string, id: string) => {
        try {
            setUpdatingStatus(id);
            const res = await fetch(`/api/super-admin/admin/${id}/change-status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ statusName: status.toUpperCase() }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            const data = await res.json();
            await fetchAdmins();
            toast.success("Status updated");
            console.log("Status updated:", data);
        } catch (err) {
            handleError(err);
        } finally {
            setUpdatingStatus(null);
        }
    };
    

    const handleRefresh = () => {
        fetchAdmins();
    };

    const TableSkeleton = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                </div>
            </div>

            <div className="relative rounded-lg border border-gray-50 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 shadow-sm">
                <div className="p-4 space-y-5">
                    <div className="flex space-x-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 dark:bg-neutral-700 rounded flex-1 animate-pulse"></div>
                        ))}
                    </div>

                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex space-x-4">
                            {Array.from({ length: 6 }).map((_, j) => (
                                <div key={j} className="h-4 bg-gray-100 dark:bg-neutral-800 rounded flex-1 animate-pulse"></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <TableSkeleton />;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                        placeholder="Search admins..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 bg-white dark:bg-neutral-900/30 border-gray-50 dark:border-neutral-800 focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400"
                    />
                </div>
            </div>

            <div className="relative rounded-lg border border-gray-50 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 shadow-sm">
                <div className="absolute top-2 right-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M10 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM10 11.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM10 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                            <DropdownMenuItem onClick={handleRefresh}>
                                <div className="flex items-center gap-2">
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                            <path d="M21 3v5h-5" />
                                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                                            <path d="M3 21v-5h5" />
                                        </svg>
                                    )}
                                    Refresh
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Export</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <TooltipProvider>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900/70"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="text-gray-900 dark:text-gray-100 font-semibold"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} className="transition-colors duration-150">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-3 text-gray-700 dark:text-gray-300">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="text-center py-8 text-gray-500 dark:text-gray-400"
                                    >
                                        No admins found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default AdminTable;