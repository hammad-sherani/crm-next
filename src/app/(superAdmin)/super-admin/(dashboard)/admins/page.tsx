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
import { Check, X, Search, Loader2, Eye, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { handleError } from '@/helper/handleError';
import { toast } from 'sonner';
import Link from 'next/link';

// Types
type AdminStatus = 'ACTIVE' | 'BLOCK' | 'PENDING';

type Admin = {
    id: string;
    name: string;
    email: string;
    country: string;
    phoneNumber: string;
    status: AdminStatus;
};

type LoadingButton = {
    id: string;
    status: AdminStatus;
} | null;

// Constants
const STATUS_CLASSES: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    BLOCK: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

// Utility functions
const filterAdmins = (admins: Admin[], searchTerm: string): Admin[] => {
    if (!searchTerm.trim()) return admins;
    
    const term = searchTerm.toLowerCase();
    return admins.filter(
        (admin) =>
            admin.name.toLowerCase().includes(term) ||
            admin.email.toLowerCase().includes(term) ||
            admin.country.toLowerCase().includes(term)
    );
};

// Components
const TableSkeleton: React.FC = () => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
                <div className="h-10 bg-gray-200 dark:bg-neutral-900 rounded-md animate-pulse" />
            </div>
        </div>

        <div className="relative rounded-lg border border-gray-50 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 shadow-sm">
            <div className="p-4 space-y-5">
                <div className="flex space-x-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 dark:bg-neutral-700 rounded flex-1 animate-pulse" />
                    ))}
                </div>

                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex space-x-4">
                        {Array.from({ length: 6 }).map((_, j) => (
                            <div key={j} className="h-4 bg-gray-100 dark:bg-neutral-800 rounded flex-1 animate-pulse" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

interface ActionButtonProps {
    icon: React.ElementType;
    tooltip: string;
    className: string;
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
    icon: Icon,
    tooltip,
    className,
    onClick,
    disabled = false,
    isLoading = false,
}) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Button
                variant="outline"
                size="sm"
                className={cn('h-8 w-8 p-0', className)}
                onClick={onClick}
                disabled={disabled || isLoading}
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
            </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
);

// Custom hooks
const useAdmins = () => {
    const [admins, setAdmins] = React.useState<Admin[]>([]);
    const [loading, setLoading] = React.useState(true);

    const fetchAdmins = React.useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/super-admin/admin", { cache: "no-store" });
            if (!res.ok) throw new Error('Failed to fetch admins');
            
            const data = await res.json();
            setAdmins(data.admins || []);
        } catch (error) {
            handleError(error);
            setAdmins([]);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    return { admins, loading, refetch: fetchAdmins };
};

const useStatusUpdate = (refetch: () => Promise<void>) => {
    const [updatingStatus, setUpdatingStatus] = React.useState<string | null>(null);
    const [loadingButton, setLoadingButton] = React.useState<LoadingButton>(null);

    const updateStatus = React.useCallback(async (status: AdminStatus, id: string) => {
        setLoadingButton({ id, status });
        setUpdatingStatus(id);

        try {
            const res = await fetch(`/api/super-admin/admin/${id}/change-status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ statusName: status }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            await refetch();
            toast.success("Status updated");
        } catch (err) {
            handleError(err);
        } finally {
            setUpdatingStatus(null);
            setLoadingButton(null);
        }
    }, [refetch]);

    return { updatingStatus, loadingButton, updateStatus };
};

const useDeleteAdmin = (refetch: () => Promise<void>) => {
    const [deletingId, setDeletingId] = React.useState<string | null>(null);

    const deleteAdmin = React.useCallback(async (id: string) => {
        setDeletingId(id);
        try {
            const res = await fetch(`/api/super-admin/admin/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete admin");

            toast.success("Deleted Successfully");
            await refetch();
        } catch (error) {
            handleError(error);
        } finally {
            setDeletingId(null);
        }
    }, [refetch]);

    return { deletingId, deleteAdmin };
};

// Main component
const AdminTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const { admins, loading, refetch } = useAdmins();
    const {  loadingButton, updateStatus } = useStatusUpdate(refetch);
    const { deletingId, deleteAdmin } = useDeleteAdmin(refetch);

    const filteredData = React.useMemo(
        () => filterAdmins(admins, searchTerm),
        [admins, searchTerm]
    );

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
            cell: ({ getValue }) => {
                const email = getValue() as string;
                return (
                    <a 
                        href={`mailto:${email}`} 
                        className="hover:underline transition-colors"
                    >
                        {email}
                    </a>
                );
            },
        },
        { 
            accessorKey: 'country', 
            header: 'Country' 
        },
        {
            accessorKey: 'phoneNumber',
            header: 'Phone',
            cell: ({ getValue }) => (
                <span className="text-gray-600 dark:text-gray-400">
                    {getValue() as string}
                </span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ getValue }) => {
                const status = getValue() as AdminStatus;
                const badgeClass = STATUS_CLASSES[status] || 
                    'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-200';

                return (
                    <Badge className={cn('capitalize', badgeClass)}>
                        {status.toLowerCase()}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const { status, id } = row.original;
                const canActivate = status === 'BLOCK' || status === 'PENDING';
                const canBlock = status === 'ACTIVE' || status === 'PENDING';
                const isDeleting = deletingId === id;

                return (
                    <div className="flex gap-1">
                        {canActivate && (
                            <ActionButton
                                icon={Check}
                                tooltip="Activate"
                                className="hover:bg-green-50 text-green-600 dark:text-green-400 dark:hover:bg-green-900/30"
                                onClick={() => updateStatus('ACTIVE', id)}
                                isLoading={loadingButton?.id === id && loadingButton?.status === 'ACTIVE'}
                            />
                        )}

                        {canBlock && (
                            <ActionButton
                                icon={X}
                                tooltip="Block"
                                className="hover:bg-red-50 text-red-600 dark:text-red-400 dark:hover:bg-red-900/30"
                                onClick={() => updateStatus('BLOCK', id)}
                                isLoading={loadingButton?.id === id && loadingButton?.status === 'BLOCK'}
                            />
                        )}

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    asChild
                                >
                                    <Link href={`/super-admin/admins/${id}`}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>View Details</TooltipContent>
                        </Tooltip>

                        <ActionButton
                            icon={Trash}
                            tooltip="Delete"
                            className="hover:bg-red-50 text-red-600 dark:text-red-400 dark:hover:bg-red-900/30"
                            onClick={() => deleteAdmin(id)}
                            isLoading={isDeleting}
                        />
                    </div>
                );
            },
        },
    ], [ loadingButton, deletingId, updateStatus, deleteAdmin ]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) {
        return <TableSkeleton />;
    }

    return (
        <div className="space-y-4">
            {/* Search and Controls */}
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

            {/* Table */}
            <div className="relative rounded-lg border border-gray-50 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 shadow-sm">
                {/* <div className="absolute top-2 right-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                            <DropdownMenuItem onClick={refetch}>
                                <div className="flex items-center gap-2">
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="h-4 w-4" />
                                    )}
                                    Refresh
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Export</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div> */}

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