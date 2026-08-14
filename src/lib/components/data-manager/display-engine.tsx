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
    OnChangeFn,
    PaginationState,
} from '@tanstack/react-table';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, SlidersHorizontal, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, toTitleCase } from '@/lib/utils';
import { SearchOptions } from './types';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

// --- Types & Interfaces ---

export interface DisplayConfig<T> {
    type: 'table' | 'list' | 'grid' | 'entity';
    data: T | T[]; // Can be an array (table/list) or single object (entity)
    columns?: ColumnDef<T>[]; // Required for Table
    searchKeys?: string[]; // Keys to generate search inputs for
    searchOptions?: SearchOptions;
    renderItem?: (item: T) => React.ReactNode; // Required for List/Grid
    className?: string;
    loading?: boolean;
    // For Entity View specifically
    entityConfig?: {
        titleKey?: keyof T;
        hiddenKeys?: string[];
        customRender?: Partial<Record<keyof T, (value: any, record: T) => React.ReactNode>>;
    };
    pagination?: {
        pageSizeOptions?: number[];
        persistPagination?: boolean;
    };
    paginationState?: PaginationState;
    onPaginationChange?: OnChangeFn<PaginationState>;
    columnVisibility?: VisibilityState;
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
    rowSelection?: Record<string, boolean>;
    onRowSelectionChange?: OnChangeFn<any>;
    bulkActions?: {
        enabled: boolean;
        identifierKey: keyof T;
        actions?: any[];
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
    searchOptions,
    children,
    actionButtons,
    pagination,
    paginationState,
    onPaginationChange,
    columnVisibility,
    onColumnVisibilityChange,
    rowSelection,
    onRowSelectionChange,
    bulkActions,
}: {
    data: T[];
    columns: ColumnDef<T>[];
    searchComponent?: SearchComponent[];
    searchConfig?: { placement?: 'inline' | 'top' };
    searchOptions?: SearchOptions;
    children?: React.ReactNode;
    actionButtons?: React.ReactNode;
    pagination?: {
        pageSizeOptions?: number[];
        persistPagination?: boolean;
    };
    paginationState?: PaginationState;
    onPaginationChange?: OnChangeFn<PaginationState>;
    columnVisibility?: VisibilityState;
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
    rowSelection?: Record<string, boolean>;
    onRowSelectionChange?: OnChangeFn<any>;
    bulkActions?: {
        enabled: boolean;
        identifierKey: keyof T;
        actions?: any[];
    };
}) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(() => {
        return !!searchOptions?.disableGlobal;
    });
    
    // Fallback internal row selection state if not controlled externally
    const [internalRowSelection, setInternalRowSelection] = React.useState({});

    const activeRowSelection = rowSelection ?? internalRowSelection;
    const activeOnRowSelectionChange = onRowSelectionChange ?? setInternalRowSelection;
 
    // Fallback internal column visibility state if not controlled externally
    const [internalColumnVisibility, setInternalColumnVisibility] = React.useState<VisibilityState>({});

    const activeColumnVisibility = columnVisibility ?? internalColumnVisibility;
    const activeOnColumnVisibilityChange = onColumnVisibilityChange ?? setInternalColumnVisibility;
 
    // Fallback internal pagination state if not controlled externally
    const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: pagination?.pageSizeOptions?.[0] ?? 15,
    });

    const activePagination = paginationState ?? internalPagination;
    const activeOnPaginationChange = onPaginationChange ?? setInternalPagination;

    const table = useReactTable({
        data,
        columns,
        defaultColumn: {
            enableSorting: false,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const keys = searchComponent?.map(s => s.column) ?? [];
            if (keys.length > 0 && !keys.includes(columnId)) {
                return false;
            }
            const value = row.getValue(columnId);
            if (value == null) return false;
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: activeOnColumnVisibilityChange,
        onRowSelectionChange: activeOnRowSelectionChange,
        onPaginationChange: activeOnPaginationChange,
        autoResetPageIndex: false,
        getRowId: (row: any, index: number) => {
            const idKey = bulkActions?.identifierKey || 'id';
            return String(row[idKey] ?? index);
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility: activeColumnVisibility,
            rowSelection: activeRowSelection,
            pagination: activePagination,
            globalFilter,
        },
    });

    const pageCount = table.getPageCount();
    const pageIndex = table.getState().pagination.pageIndex;

    React.useEffect(() => {
        if (pageCount > 0 && pageIndex >= pageCount) {
            table.setPageIndex(pageCount - 1);
        }
    }, [pageCount, pageIndex, table]);

    const disableGlobal = !!searchOptions?.disableGlobal;
    const disableAdvanced = !!searchOptions?.disableAdvanced;
    const forceAdvancedVisibleOnMobile = !!searchOptions?.forceAdvancedVisibleOnMobile || disableGlobal;
    const isToggleHiddenOnMobile = !forceAdvancedVisibleOnMobile || disableAdvanced;

    const showGlobal = !disableGlobal && !isAdvancedOpen;
    const showToggle = !disableAdvanced && !disableGlobal;
    const showAdvancedPanel = !disableAdvanced && (isAdvancedOpen || disableGlobal);

    return (
        <div className="w-full space-y-4 max-w-full">
            {children && <div className="p-1">{children}</div>}

            <div className="flex w-full flex-col gap-4">
                {/* Search Bar Logic */}
                {(searchComponent?.length ?? 0) > 0 && (
                    <div className="flex flex-col gap-3 w-full">
                        {/* Global Search / Advanced Filters Toolbar */}
                        <div className="flex flex-wrap items-center gap-2 w-full">
                            {/* Primary Global Search */}
                            {showGlobal && (
                                <div className={cn(
                                    "relative flex-1 min-w-[240px] max-w-sm",
                                    isToggleHiddenOnMobile && "mx-auto md:ml-0 md:mr-auto"
                                )}>
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search..."
                                        value={globalFilter ?? ''}
                                        onChange={(event) => setGlobalFilter(event.target.value)}
                                        className="pl-9 pr-9 h-9 text-sm"
                                    />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 h-5 w-5 text-muted-foreground/70 hover:text-foreground cursor-help transition-colors flex items-center justify-center rounded-full hover:bg-muted/50">
                                                    <HelpCircle className="h-3.5 w-3.5" />
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent side="top" align="center" className="max-w-xs p-3">
                                                <p className="text-primary-foreground/75 text-[11px] leading-relaxed">
                                                    Matches keywords against:
                                                </p>
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {searchComponent?.map(s => (
                                                        <span key={s.column} className="px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground capitalize">
                                                            {toTitleCase(s.column)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            )}

                            {/* Inline Advanced Filters */}
                            {showAdvancedPanel && (
                                <div className={cn(
                                    "flex flex-wrap items-center gap-2 flex-1",
                                    !forceAdvancedVisibleOnMobile && "hidden md:flex"
                                )}>
                                    {searchComponent?.map((component) => (
                                        <div key={component.column} className="relative flex-1 min-w-[160px] max-w-sm">
                                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/70" />
                                            <Input
                                                placeholder={component.placeholder ?? `Filter ${toTitleCase(component.column)}...`}
                                                value={(table.getColumn(component.column)?.getFilterValue() as string) ?? ''}
                                                onChange={(event) => table.getColumn(component.column)?.setFilterValue(event.target.value)}
                                                className={cn('pl-8 h-9 text-xs', component.className)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Advanced Filter Toggle Button */}
                            {showToggle && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const nextState = !isAdvancedOpen;
                                        setIsAdvancedOpen(nextState);
                                        
                                        // Reset search parameters depending on which mode is closed
                                        if (nextState) {
                                            // Opening Advanced Filters -> Clear Global Search
                                            setGlobalFilter('');
                                        } else {
                                            // Opening Global Search -> Clear Column Filters
                                            table.setColumnFilters([]);
                                        }
                                    }}
                                    className={cn(
                                        "gap-2 h-9 text-xs cursor-pointer ml-auto w-[160px] px-5 shrink-0",
                                        // Hidden on mobile by default (hidden md:flex) unless forceAdvancedVisibleOnMobile is true
                                        !forceAdvancedVisibleOnMobile && "hidden md:inline-flex"
                                    )}
                                >
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    {isAdvancedOpen ? "Hide Filters" : "Advanced Filters"}
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Toolbar (Column Toggle + Actions) */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 w-full sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                        {table.getFilteredRowModel().rows.length} record(s) found.
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                        {actionButtons}
                    </div>
                </div>

                {/* The Table */}
                <div className="rounded-md border bg-card w-full overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header, index) => {
                                        const canSort = header.column.getCanSort();
                                        const isSorted = header.column.getIsSorted();
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={cn(
                                                    "bg-secondary text-secondary-foreground px-2 py-3 sm:px-4 sm:py-4",
                                                    index === headerGroup.headers.length - 1 ? 'text-end' : '',
                                                    canSort ? 'cursor-pointer select-none hover:bg-secondary/80' : ''
                                                )}
                                                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div className={cn(
                                                        "flex items-center gap-1",
                                                        index === headerGroup.headers.length - 1 ? 'justify-end' : 'justify-start'
                                                    )}>
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                        {canSort && (
                                                            <span>
                                                                {isSorted === 'asc' ? (
                                                                    <ArrowUp className="h-4 w-4" />
                                                                ) : isSorted === 'desc' ? (
                                                                    <ArrowDown className="h-4 w-4" />
                                                                ) : (
                                                                    <ArrowUpDown className="h-4 w-4 opacity-50" />
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="max-w-[200px] sm:max-w-[300px] truncate px-2 py-3 sm:px-4 sm:py-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
                <div className="flex flex-row gap-2 items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        {pagination && (
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-medium text-muted-foreground whitespace-nowrap hidden sm:block">Rows per page</p>
                                <Select
                                    value={`${table.getState().pagination.pageSize}`}
                                    onValueChange={(value) => {
                                        table.setPageSize(Number(value));
                                    }}
                                >
                                    <SelectTrigger className="h-8 w-[80px] sm:w-[90px] px-2">
                                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                                    </SelectTrigger>
                                    <SelectContent side="top">
                                        {(pagination.pageSizeOptions || [15, 25, 50, 100]).map((pageSize) => (
                                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                                {pageSize}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="h-8 px-3 text-xs sm:w-24">
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="h-8 px-3 text-xs sm:w-24">
                            Next
                        </Button>
                    </div>
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
                        <div key={String(key)} className="grid grid-cols-1 sm:grid-cols-3 border-b pb-2 gap-1 sm:gap-2 last:border-0">
                            <span className="font-medium text-sm text-muted-foreground capitalize">
                                {String(key).replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <div className="sm:col-span-2 text-sm">
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
    searchOptions,
    renderItem,
    className,
    loading,
    entityConfig,
    pagination,
    paginationState,
    onPaginationChange,
    columnVisibility,
    onColumnVisibilityChange,
    rowSelection,
    onRowSelectionChange,
    bulkActions,
}: DisplayConfig<T>) => {

    const hasData = Array.isArray(data) ? data.length > 0 : !!data;
    const showLoadingPlaceholder = loading && !hasData;

    if (showLoadingPlaceholder) {
        return (
            <div className="flex h-64 w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin p-4 rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className={cn(
            "w-full transition-all p-4 duration-300 animate-in fade-in relative",
            loading && "opacity-75",
            className
        )}>

            {/* TABLE View */}
            {type === 'table' && Array.isArray(data) && columns && (
                <DataTable
                    data={data}
                    columns={columns}
                    searchComponent={searchKeys?.map(key => ({ column: key }))}
                    searchOptions={searchOptions}
                    pagination={pagination}
                    paginationState={paginationState}
                    onPaginationChange={onPaginationChange}
                    columnVisibility={columnVisibility}
                    onColumnVisibilityChange={onColumnVisibilityChange}
                    rowSelection={rowSelection}
                    onRowSelectionChange={onRowSelectionChange}
                    bulkActions={bulkActions}
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