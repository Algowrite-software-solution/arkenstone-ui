/**
 * DataManager.tsx
 * 
 * The "Brain" of the Generic Service Architecture.
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// --- Internal Modules ---
import { DataManagerConfig } from './types';
import { LayoutManager } from './layout-manager';
import { GenericForm } from './input-engine';
import { DisplayEngine } from './display-engine';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"


export function DataManager<T extends { id: string | number }>({
    config
}: {
    config: DataManagerConfig<T>
}) {
    const { service, devMode } = config;

    // Action Config
    const actionConfig = {
        view: true,
        edit: true,
        delete: true,
        ...config.display.actions
    };

    // =========================================================================
    // 1. STATE MANAGEMENT
    // =========================================================================

    const { list: data, loading, update: updateStore } = service.useStore();

    // Local UI State
    const [selectedId, setSelectedId] = useState<string | number | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isViewing, setIsViewing] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    // Row selection for bulk actions
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

    const selectedIds = useMemo(() => {
        return Object.keys(rowSelection).filter(key => rowSelection[key]);
    }, [rowSelection]);

    const selectedItems = useMemo(() => {
        if (!Array.isArray(data)) return [];
        const idKey = config.display.bulkActions?.identifierKey || 'id';
        return data.filter((item: T) => {
            const id = String((item as any)[idKey]);
            return !!rowSelection[id];
        });
    }, [data, rowSelection, config.display.bulkActions?.identifierKey]);

    // --- CONFIRMATION DIALOG STATE ---
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        message: string;
        resolver: ((value: boolean) => void) | null;
    }>({
        isOpen: false,
        message: "",
        resolver: null
    });

    // Pagination state (restores from Zustand store if persistence is enabled)
    const [paginationState, setPaginationState] = useState(() => {
        if (config.display.pagination?.persistPagination !== false) {
            const storeState = service.useStore.getState() as any;
            if (storeState.pagination) {
                return storeState.pagination;
            }
        }
        return {
            pageIndex: 0,
            pageSize: config.display.pagination?.pageSizeOptions?.[0] ?? 10,
        };
    });

    useEffect(() => {
        if (config.display.pagination?.persistPagination !== false) {
            service.useStore.setState({ pagination: paginationState });
        }
    }, [paginationState, config.display.pagination?.persistPagination, service]);

    // Column visibility state (restores from Zustand store if persistence is enabled)
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
        if (config.display.persistColumnVisibility !== false) {
            const storeState = service.useStore.getState() as any;
            if (storeState.columnVisibility) {
                return storeState.columnVisibility;
            }
        }
        return {};
    });

    useEffect(() => {
        if (config.display.persistColumnVisibility !== false) {
            service.useStore.setState({ columnVisibility });
        }
    }, [columnVisibility, config.display.persistColumnVisibility, service]);

    // Derived State
    const activeItem = useMemo(() =>
        selectedId ? data.find((i: T) => i.id === selectedId) : null,
        [selectedId, data]);

    const isPanelOpen = (!!selectedId || isCreating) && !isViewing;

    const log = (...args: any[]) => {
        if (devMode) console.log(`[DataManager:${config.title}]`, ...args);
    };

    // =========================================================================
    // 2. CONFIRMATION LOGIC
    // =========================================================================

    /**
     * Creates a Promise that resolves only when the user interacts 
     * with the dialog UI.
     */
    const requestConfirmation = useCallback((message: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmState({
                isOpen: true,
                message,
                resolver: resolve
            });
        });
    }, []);

    const onConfirmDialog = () => {
        if (confirmState.resolver) confirmState.resolver(true);
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
    };

    const onCancelDialog = () => {
        if (confirmState.resolver) confirmState.resolver(false);
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
    };

    // =========================================================================
    // 3. EFFECTS & DATA LOADING
    // =========================================================================

    const serializedParams = JSON.stringify(config?.serviceConfig?.getAll?.params ?? {});

    const loadData = useCallback(async () => {
        try {
            log("Fetching Data...");
            updateStore((state: any) => {
                state.loading = true;
            });
            const response = await service.getAll(JSON.parse(serializedParams));
            const listData = Array.isArray(response) ? response : (response as any)?.data || [];
            updateStore((state: any) => {
                state.list = listData;
                state.loading = false;
            });
        } catch (error) {
            console.error("Failed to load data", error);
            updateStore((state: any) => {
                state.loading = false;
            });
        }
    }, [service, serializedParams, updateStore]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const isImageInputExists = config.form?.fields?.some((field: any) => field.type === 'image');


    // =========================================================================
    // 4. CRUD HANDLERS
    // =========================================================================

    const handleCreate = async (values: any) => {
        if (config.display.disableCreate) return;

        setIsLoading(true); // update the button indications and change text

        log("Creating Item", values);
        try {
            let options: any = {}

            if (isImageInputExists) {
                options = {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            }

            let finalData = values;

            if (isImageInputExists) {
                const formData = new FormData();
                Object.keys(values).forEach(key => {
                    const val = values[key];
                    if (Array.isArray(val)) {
                        val.forEach(item => {
                            if (item instanceof File) formData.append(`${key}[]`, item);
                            else if (item !== null && item !== undefined && typeof item !== 'object') formData.append(`${key}[]`, String(item));
                        });
                    } else if (val instanceof File) {
                        formData.append(key, val);
                    } else if (val !== null && val !== undefined) {
                        formData.append(key, String(val));
                    }
                });
                finalData = formData;
            }

            const res = await service.create(finalData, options);
            if (res) {
                toast.success(`${config.title} created successfully`);
                updateStore((state: any) => { state.list.unshift(res); });
                setIsCreating(false);
            }
        } catch (e) {
            log("Create Error", e);
        }

        setIsLoading(false);
    };

    const handleUpdate = async (values: any) => {
        if (!selectedId) return;

        setIsLoading(true); // update the button indications and change text

        log("Updating Item 123", values);
        let payload = values;

        // ---------------------------------------------------------------------
        // LOGIC: PARTIAL UPDATE VS FULL UPDATE
        // ---------------------------------------------------------------------
        const shouldPartialUpdate = !!config.form.disablePartialUpdate; // #TODO : need to be fixed in final releases to mek it false by default. (remove one !)

        if (shouldPartialUpdate && activeItem) {
            const dirtyValues: any = {};
            let hasChanges = false;

            config.form.fields.forEach((field) => {
                const key = field.name;
                const newValue = values[key];
                const oldValue = (activeItem as any)[key];

                // Check for changes (Basic equality)
                // We check newValue !== undefined so we don't accidentally send nulls for fields not in form
                if (newValue !== undefined && newValue != oldValue) {
                    dirtyValues[key] = newValue;
                    hasChanges = true;
                }
            });

            if (!hasChanges) {
                toast.info("No changes detected.");
                return;
            }

            payload = dirtyValues;
            log("Updating with Partial Payload", payload);
        } else {
            log("Updating with Full Payload (Legacy Mode)", payload);
        }


        // #TODO : need to be fixed in final releases. the image input should be Images
        // on update remove the strings and keep only the Files on the payload of all image inputs
        config.form.fields.forEach((field) => {
            if (field.type === 'image') {
                const key = field.name;
                const value = payload[key];
                if (Array.isArray(value)) {
                    payload[key] = value.filter((item) => item instanceof File);
                }
            }
        });

        // ---------------------------------------------------------------------
        // API CALL
        // ---------------------------------------------------------------------
        try {
            // Check if we need FormData (for images) or JSON
            let finalData = payload;
            let options: any = {};

            if (isImageInputExists) {
                options = {
                    ...options,
                    headers: { 'Content-Type': 'multipart/form-data' }
                };
                const formData = new FormData();

                Object.keys(payload).forEach(key => {
                    const val = payload[key];

                    // Handle Arrays (e.g. MediaInput arrays, or removed_images)
                    if (Array.isArray(val)) {
                        val.forEach((item) => {
                            if (item instanceof File) {
                                // Append new files with array notation if backend expects it, or just key
                                // Usually frameworks handle "images[]" automatically if same key is used
                                formData.append(`${key}[]`, item);
                            } else if (typeof item === 'string') {
                                // For existing URLs in the main array, we usually DON'T send them back in the file field
                                // unless the backend expects a mix.
                                // Typically, we only send NEW files in the file field.
                                // However, if this is 'removed_images', we send strings.
                                if (key.includes('removed') || key === config.form.fields.find(f => f.removeImageOptions?.removedImagesField === key)?.removeImageOptions?.removedImagesField) {
                                    formData.append(`${key}[]`, item);
                                }
                            } else if (item !== null && item !== undefined) {
                                // Other array primitives
                                formData.append(`${key}[]`, String(item));
                            }
                        });
                    }
                    // Handle Single File (legacy support)
                    else if (val instanceof File) {
                        formData.append(key, val);
                    }
                    // Handle Primitives
                    else if (val !== null && val !== undefined) {
                        formData.append(key, String(val));
                    }
                });
                finalData = formData;
            }

            const res = await service.update(selectedId, finalData, options);

            if (res) {
                toast.success(`${config.title} updated successfully`);
                updateStore((state: any) => {
                    const idx = state.list.findIndex((i: T) => i.id === selectedId);
                    if (idx !== -1) {
                        // Update logic
                        state.list[idx] = res;
                    }
                });
                setSelectedId(null);
            }
        } catch (e) {
            log("Update Error", e);
        }

        setIsLoading(false);
    };

    const handleDelete = async (id: string | number) => {
        // Await the custom confirmation dialog
        const isConfirmed = await requestConfirmation("Are you sure you want to delete this item? This action cannot be undone.");

        if (!isConfirmed) return;

        log("Deleting Item", id);
        try {
            await service.delete(id, {
                data: config.serviceConfig?.delete?.params ?? {}
            });
            toast.success("Item deleted");

            updateStore((state: any) => {
                state.list = state.list.filter((i: T) => i.id !== id);
            });

            if (selectedId === id) {
                setSelectedId(null);
            }
        } catch (e) {
            log("Delete Error", e);
        }
    };

    const handleClose = () => {
        setSelectedId(null);
        setIsCreating(false);
        setIsViewing(false);
        // console.log("closed all opened panels!");
    };

    // =========================================================================
    // 5. DISPLAY CONFIGURATION
    // =========================================================================

    const bulkActions = useMemo(() => {
        if (!config.display.bulkActions?.enabled) return [];

        if (config.display.bulkActions.actions) {
            return config.display.bulkActions.actions;
        }

        const identifierKey = config.display.bulkActions.identifierKey || 'id';

        return [
            {
                label: "Delete Selected",
                icon: <Trash2 className="h-4 w-4" />,
                variant: "destructive" as const,
                onClick: async (selectedIds: any[]) => {
                    const isConfirmed = await requestConfirmation(
                        `Are you sure you want to delete the selected ${selectedIds.length} items? This action cannot be undone.`
                    );
                    if (!isConfirmed) return;

                    try {
                        const deletePromise = Promise.all(
                            selectedIds.map(id => service.delete(id, {
                                data: config.serviceConfig?.delete?.params ?? {}
                            }))
                        );
                        
                        toast.promise(deletePromise, {
                            loading: 'Deleting selected items...',
                            success: 'Selected items deleted successfully',
                            error: 'Failed to delete some items',
                        });

                        await deletePromise;

                        updateStore((state: any) => {
                            state.list = (state.list || []).filter(
                                (item: T) => !selectedIds.includes(String((item as any)[identifierKey]))
                            );
                        });

                        setRowSelection({});
                    } catch (e) {
                        log("Bulk Delete Error", e);
                    }
                }
            }
        ];
    }, [
        config.display.bulkActions,
        service,
        config.serviceConfig?.delete?.params,
        updateStore,
        requestConfirmation
    ]);

    const tableColumns = useMemo(() => {
        if (config.display.type !== 'table') return [];

        const baseColumns = [...config.display.columns];

        if (config.display.bulkActions?.enabled) {
            baseColumns.unshift({
                id: 'select',
                header: ({ table }: any) => (
                    <input
                        type="checkbox"
                        checked={table.getIsAllPageRowsSelected()}
                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                        aria-label="Select all"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer translate-y-[2px]"
                    />
                ),
                cell: ({ row }: any) => (
                    <input
                        type="checkbox"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        aria-label="Select row"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer translate-y-[2px]"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            });
        }

        if (actionConfig?.view || actionConfig?.edit || actionConfig?.delete) {
            baseColumns.push({
                id: 'actions',
                header: 'Actions',
                cell: ({ row }: any) => (
                    <div className="flex items-center justify-end gap-2">

                        {actionConfig?.view && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-primary hover:primary hover:bg-primary/20 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsViewing(true);
                                    setSelectedId(row.original.id);
                                }}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        )}

                        {actionConfig?.edit && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-primary hover:primary hover:bg-primary/20 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCreating(false);
                                    setSelectedId(row.original.id);
                                }}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        )}

                        {actionConfig?.delete && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/20 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(row.original.id);
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ),
            });
        }

        return baseColumns;
    }, [config.display.columns, config.display.bulkActions?.enabled, selectedId]);

    const renderWrapper = (item: T) => {
        if (!config.display.renderItem) return null;

        return (
            <div className="group relative">
                {config.display.renderItem(item)}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/90 p-1 rounded-md shadow-sm border">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setSelectedId(item.id)}>
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        );
    };

    // =========================================================================
    // 6. RENDER
    // =========================================================================

    return (
        <div className="w-full flex flex-col overflow-hidden bg-sidebar rounded-2xl relative">

            {/* --- HEADER --- */}
            <div className="flex-none p-4 md:p-6 border-b flex justify-between items-start md:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">{config.title}</h1>
                    {config.description && <p className="text-sm text-muted-foreground mt-1">{config.description}</p>}
                </div>

                <div className="flex items-center gap-2">
                    {!config.display.disableRefresh && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
                            onClick={loadData}
                            disabled={loading}
                            title="Refresh data"
                        >
                            <RotateCw className={cn("h-4 w-4", loading && "animate-spin")} />
                        </Button>
                    )}

                    {!isCreating && !config.display.disableCreate && (
                        <Button onClick={() => { setSelectedId(null); setIsCreating(true); }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add {config?.display?.createModalConfig?.createButtonText ?? (config.title || 'Item')}
                        </Button>
                    )}
                </div>
            </div>

            {/* Custom Element Space - Header */}
            {config.display.layoutSpaces?.header ?? null}

            {/* --- BODY --- */}
            <div className={`flex-1 overflow-hidden p-4 md:p-6 ${config.display.layoutSpaces?.header ? 'mt-2' : ''} ${config.display.layoutSpaces?.footer ? 'mb-2' : ''}`}>
                
                {/* Bulk Actions Toolbar */}
                <div className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    config.display.bulkActions?.enabled && selectedIds.length > 0
                        ? "grid-rows-[1fr] opacity-100 mb-4"
                        : "grid-rows-[0fr] opacity-0 mb-0 pointer-events-none"
                )}>
                    <div className="overflow-hidden">
                        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-primary">
                                    {selectedIds.length} record{selectedIds.length > 1 ? 's' : ''} selected
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-muted-foreground hover:text-foreground cursor-pointer h-7 px-2"
                                    onClick={() => setRowSelection({})}
                                >
                                    Clear selection
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                {bulkActions.map((action, index) => (
                                    <Button
                                        key={index}
                                        variant={action.variant || "outline"}
                                        size="sm"
                                        onClick={() => action.onClick(selectedIds, selectedItems)}
                                        className="gap-2 cursor-pointer h-8"
                                    >
                                        {action.icon}
                                        {action.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <LayoutManager
                    type={config.layout}
                    modalSize={config.modalSize}
                    isDetailsOpen={isPanelOpen}
                    onCloseDetails={handleClose}
                    title={isCreating ? `Create ${config.title || 'Item'}` : `Edit ${config.title || 'Item'}`}
                    detailsPanel={
                        <GenericForm
                            isCreating={isCreating}
                            fields={config.form.fields}
                            updateFormValues={config.updateFormValues}
                            initialValues={isCreating ? {} : (activeItem ?? {})}
                            onSubmit={isCreating ? handleCreate : handleUpdate}
                            isLoading={isLoading}
                            submitLabel={isCreating ? "Create" : "Save Changes"}
                            liveUpdate={config.form.liveUpdate}
                            className={config.layout === 'split-view' ? "h-full" : ""}
                        />
                    }
                >
                    <DisplayEngine
                        type={config.display.type === 'grid' ? 'grid' :
                            config.display.type === 'list' ? 'list' : 'table'}
                        data={data}
                        loading={loading}
                        columns={tableColumns}
                        searchKeys={config.display.searchKeys}
                        renderItem={renderWrapper}
                        className="h-full overflow-auto"
                        pagination={config.display.pagination}
                        paginationState={paginationState}
                        onPaginationChange={setPaginationState}
                        columnVisibility={columnVisibility}
                        onColumnVisibilityChange={setColumnVisibility}
                        rowSelection={rowSelection}
                        onRowSelectionChange={setRowSelection}
                        bulkActions={config.display.bulkActions}
                    />
                </LayoutManager>
            </div>

            {/* Custom Element Space - Footer */}
            {config.display.layoutSpaces?.footer ?? null}

            {/* --- CONFIRMATION DIALOG --- */}
            <ConfirmationDialog
                isOpen={confirmState.isOpen}
                message={confirmState.message}
                onConfirm={onConfirmDialog}
                onCancel={onCancelDialog}
            />

            <ViewDialog
                isOpen={isViewing}
                data={activeItem}
                handleClose={handleClose}
                config={config.display?.viewModalConfig}
            />
        </div>
    );
}

// =========================================================================
// HELPER COMPONENT
// =========================================================================

interface ConfirmationDialogProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmationDialog({ isOpen, message, onConfirm, onCancel }: ConfirmationDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background text-foreground border p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
                <h3 className="text-lg font-semibold mb-2">Confirm Action</h3>
                <p className="text-muted-foreground text-sm mb-6">{message}</p>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
}


// =========================================================================
// VIEW MODAL
// =========================================================================



interface ViewDialogProps {
    isOpen: boolean;
    data: any;
    handleClose: () => void;
    config?: {
        title?: string;
        description?: string;
        renderItem?: (item: any) => React.ReactNode;
    };
}

export function ViewDialog({ isOpen, data, handleClose, config }: ViewDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-4xl w-full" >
                <DialogHeader>
                    <DialogTitle>
                        {config?.title || "View Details"}
                    </DialogTitle>

                    {config?.description && (
                        <DialogDescription>
                            {config.description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                {/* SCROLLABLE BODY */}
                <div className="overflow-y-auto pr-2 space-y-4" style={{ maxHeight: '80vh' }}>
                    {typeof data === "object" && !config?.renderItem &&
                        data !== null &&
                        Object.keys(data).map((key) => (
                            <div key={key} className="flex flex-col space-y-1">
                                <p className="text-sm text-muted-foreground">{key}</p>
                                <p>{typeof data[key] !== "object" ? data[key] : null}</p>
                            </div>
                        ))}

                    {typeof data === "string" && (
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm text-muted-foreground">Data</p>
                            <p>{data}</p>
                        </div>
                    )}

                    {config?.renderItem && config.renderItem(data)}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
