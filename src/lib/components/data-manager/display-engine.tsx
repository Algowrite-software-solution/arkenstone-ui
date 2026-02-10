import React from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// --- Types & Interfaces ---

export interface DisplayConfig<T> {
    type: 'table' | 'list' | 'grid' | 'entity';
    data: T | T[]; // Can be an array (table/list) or single object (entity)
    columns?: ColumnDef<T>[]; // Required for Table
    searchKeys?: string[]; // Keys to generate search inputs for
    renderItem?: (item: T) => React.ReactNode; // Required for List/Grid
    className?: string;
    loading?: boolean;
    // For Entity View specifically
    entityConfig?: {
        titleKey?: keyof T;
        hiddenKeys?: string[];
        customRender?: Partial<Record<keyof T, (value: any, record: T) => React.ReactNode>>;
    };
}

// --- 1. The Table Component (Adapted from your provided code) ---

export type SearchComponent = {
    column: string;
    placeholder?: string;
    className?: string;
};

function DataTable<T>({
    data,
    columns,
    searchComponent,
    searchConfig = { placement: 'inline' },
    children,
    actionButtons,
}: {
    data: T[];
    columns: ColumnDef<T>[];
    searchComponent?: SearchComponent[];
    searchConfig?: { placement?: 'inline' | 'top' };
    children?: React.ReactNode;
    actionButtons?: React.ReactNode;
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full space-y-4">
            {children && <div className="p-1">{children}</div>}

            <div className="flex w-full flex-col gap-4">
                {/* Search Bar Logic */}
                {(searchComponent?.length ?? 0) > 0 && (
                    <div className={cn("flex flex-col gap-2", searchConfig.placement === 'top' ? "w-full" : "w-full md:flex-row md:items-center")}>
                        {searchComponent?.map((component) => (
                            <div key={component.column} className="relative w-full md:max-w-sm flex justify-center items-center">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={component.placeholder ?? `Filter ${component.column}...`}
                                    value={(table.getColumn(component.column)?.getFilterValue() as string) ?? ''}
                                    onChange={(event) => table.getColumn(component.column)?.setFilterValue(event.target.value)}
                                    className={cn('pl-8', component.className)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Toolbar (Column Toggle + Actions) */}
                <div className="flex w-full items-center justify-between">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredRowModel().rows.length} record(s) found.
                    </div>
                    <div className="flex items-center gap-2">
                        {actionButtons}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="ml-auto">
                                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* The Table */}
                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header, index) => (
                                        <TableHead key={header.id} className={`bg-secondary text-secondary-foreground ${index === headerGroup.headers.length - 1 ? 'text-end' : ''}`}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

// --- 2. The List Component ---

function DataList<T>({
    data,
    renderItem
}: {
    data: T[],
    renderItem?: (item: T) => React.ReactNode
}) {
    if (!data || data.length === 0) {
        return <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">No Items Found</div>;
    }

    if (!renderItem) {
        return <div className="text-red-500">Error: renderItem prop is required for List View</div>;
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            {data.map((item, idx) => (
                <div key={(item as any).id || idx} className="w-full">
                    {renderItem(item)}
                </div>
            ))}
        </div>
    );
}

// --- 3. The Grid Component ---

function DataGrid<T>({
    data,
    renderItem
}: {
    data: T[],
    renderItem?: (item: T) => React.ReactNode
}) {
    if (!data || data.length === 0) return <div className="p-8 text-center text-muted-foreground">No Items Found</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {data.map((item, idx) => (
                <div key={(item as any).id || idx} className="h-full">
                    {renderItem ? renderItem(item) : <pre>{JSON.stringify(item)}</pre>}
                </div>
            ))}
        </div>
    );
}

// --- 4. The Single Entity Component ---

function DataEntity<T>({
    data,
    config
}: {
    data: T,
    config?: DisplayConfig<T>['entityConfig']
}) {
    if (!data) return null;

    // Extract Keys
    const keys = Object.keys(data) as Array<keyof T>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{config?.titleKey ? String(data[config.titleKey]) : "Entity Details"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {keys.map(key => {
                    // Filter hidden keys
                    if (config?.hiddenKeys?.includes(String(key))) return null;

                    const value = data[key];

                    return (
                        <div key={String(key)} className="grid grid-cols-3 border-b pb-2 last:border-0">
                            <span className="font-medium text-sm text-muted-foreground capitalize">
                                {String(key).replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <div className="col-span-2 text-sm">
                                {/* Check for Custom Renderer */}
                                {config?.customRender && config.customRender[key]
                                    ? config.customRender[key]!(value, data)
                                    : (
                                        // Default Rendering
                                        typeof value === 'object' && value !== null
                                            ? <pre className="text-xs bg-muted p-1 rounded">{JSON.stringify(value, null, 2)}</pre>
                                            : String(value)
                                    )
                                }
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    );
}

// --- 5. Main Export: Display Engine ---

export const DisplayEngine = <T extends object>({
    type,
    data,
    columns,
    searchKeys,
    renderItem,
    className,
    loading,
    entityConfig
}: DisplayConfig<T>) => {

    if (loading) {
        return (
            <div className="flex h-64 w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin p-4 rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className={cn("w-full transition-all p-4 duration-300 animate-in fade-in", className)}>

            {/* TABLE View */}
            {type === 'table' && Array.isArray(data) && columns && (
                <DataTable
                    data={data}
                    columns={columns}
                    searchComponent={searchKeys?.map(key => ({ column: key }))}
                />
            )}

            {/* LIST View */}
            {type === 'list' && Array.isArray(data) && (
                <DataList data={data} renderItem={renderItem} />
            )}

            {/* GRID View */}
            {type === 'grid' && Array.isArray(data) && (
                <DataGrid data={data} renderItem={renderItem} />
            )}

            {/* ENTITY View (Single Item) */}
            {type === 'entity' && !Array.isArray(data) && (
                <DataEntity data={data} config={entityConfig} />
            )}

            {/* Fallback for invalid config */}
            {(!data && !loading) && <div className="text-muted-foreground text-sm italic">No data to display.</div>}
        </div>
    );
};