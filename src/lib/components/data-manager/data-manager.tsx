/**
 * DataManager.tsx
 * 
 * The "Brain" of the Generic Service Architecture.
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, RotateCw, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, toTitleCase } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// --- Internal Modules ---
import { DataManagerConfig, ActionContext, ViewFieldConfig } from './types';
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
    const viewConfig = config.display.actions?.view ?? true;
    const editConfig = config.display.actions?.edit ?? true;
    const deleteConfig = config.display.actions?.delete ?? true;

    const isViewEnabled = viewConfig !== false && (typeof viewConfig !== 'object' || viewConfig.enabled !== false);
    const isEditEnabled = editConfig !== false && (typeof editConfig !== 'object' || editConfig.enabled !== false);
    const isDeleteEnabled = deleteConfig !== false && (typeof deleteConfig !== 'object' || deleteConfig.enabled !== false);

    const actionConfig = {
        view: isViewEnabled,
        edit: isEditEnabled,
        delete: isDeleteEnabled,
        custom: config.display.actions?.custom
    };

    // =========================================================================
    // 1. STATE MANAGEMENT
    // =========================================================================

    const { list: data, loading, update: updateStore } = service.useStore();

    // Local UI State
    const [selectedId, setSelectedId] = useState<string | number | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [resolvedData, setResolvedData] = useState<any>(null);
    const [resolvingId, setResolvingId] = useState<string | number | null>(null);
    const [resolvingType, setResolvingType] = useState<'edit' | 'view' | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    // Mobile viewport detection
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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

    // Pagination state (restores from Zustand store or LocalStorage if persistence is enabled)
    const [paginationState, setPaginationState] = useState(() => {
        if (typeof window !== 'undefined' && config.display.pagination?.persistPagination === true) {
            try {
                const saved = localStorage.getItem(`arkenstone:dm:${config.title || ''}:pagination`);
                if (saved) {
                    return JSON.parse(saved);
                }
            } catch (e) {
                console.error("Failed to load persisted pagination from localStorage", e);
            }
        }
        if (config.display.pagination?.persistPagination !== false && typeof service.useStore?.getState === 'function') {
            const storeState = service.useStore.getState() as any;
            if (storeState.pagination) {
                return storeState.pagination;
            }
        }
        return {
            pageIndex: 0,
            pageSize: config.display.pagination?.pageSizeOptions?.[0] ?? 15,
        };
    });

    useEffect(() => {
        if (typeof window !== 'undefined' && config.display.pagination?.persistPagination === true) {
            try {
                localStorage.setItem(`arkenstone:dm:${config.title || ''}:pagination`, JSON.stringify(paginationState));
            } catch (e) {
                console.error("Failed to persist pagination to localStorage", e);
            }
        }
        if (config.display.pagination?.persistPagination !== false && typeof service.useStore?.setState === 'function') {
            service.useStore.setState({ pagination: paginationState });
        }
    }, [paginationState, config.display.pagination?.persistPagination, service, config.title]);

    // Column visibility state (restores from Zustand store or LocalStorage if persistence is enabled)
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
        if (typeof window !== 'undefined' && config.display.persistColumnVisibility === true) {
            try {
                const saved = localStorage.getItem(`arkenstone:dm:${config.title || ''}:colVisibility`);
                if (saved) {
                    return JSON.parse(saved);
                }
            } catch (e) {
                console.error("Failed to load persisted column visibility from localStorage", e);
            }
        }
        if (config.display.persistColumnVisibility !== false && typeof service.useStore?.getState === 'function') {
            const storeState = service.useStore.getState() as any;
            if (storeState.columnVisibility) {
                return storeState.columnVisibility;
            }
        }
        return {};
    });

    useEffect(() => {
        if (typeof window !== 'undefined' && config.display.persistColumnVisibility === true) {
            try {
                localStorage.setItem(`arkenstone:dm:${config.title || ''}:colVisibility`, JSON.stringify(columnVisibility));
            } catch (e) {
                console.error("Failed to persist column visibility to localStorage", e);
            }
        }
        if (config.display.persistColumnVisibility !== false && typeof service.useStore?.setState === 'function') {
            service.useStore.setState({ columnVisibility });
        }
    }, [columnVisibility, config.display.persistColumnVisibility, service, config.title]);

    // Derived State
    const activeItem = useMemo(() =>
        selectedId ? data.find((i: T) => i.id === selectedId) : null,
        [selectedId, data]);

    const isPanelOpen = (!!selectedId || isCreating) && !isViewing;

    const log = (...args: any[]) => {
        if (devMode) console.log(`[DataManager:${config.title}]`, ...args);
    };

    const getActionState = useCallback((actionConfig: any, item: T) => {
        if (actionConfig === false) return { hidden: true, disabled: false };
        if (actionConfig === true) return { hidden: false, disabled: false };
        if (typeof actionConfig === 'function') {
            const res = actionConfig(item);
            return {
                hidden: !!res?.hidden,
                disabled: !!res?.disabled
            };
        }
        if (typeof actionConfig === 'object' && actionConfig !== null) {
            const isHidden = typeof actionConfig.hidden === 'function' 
                ? actionConfig.hidden(item) 
                : !!actionConfig.hidden;
            const isDisabled = typeof actionConfig.disabled === 'function' 
                ? actionConfig.disabled(item) 
                : !!actionConfig.disabled;
            const isEnabled = actionConfig.enabled !== false;
            return { 
                hidden: isHidden || !isEnabled, 
                disabled: isDisabled 
            };
        }
        return { hidden: true, disabled: false };
    }, []);

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

    const resolveItemData = async (item: T, type: 'edit' | 'view') => {
        const actionConfig = config.display.actions?.[type];
        let finalData: any = item;

        if (actionConfig && typeof actionConfig === 'object' && 'resolveData' in actionConfig && actionConfig.resolveData) {
            setResolvingId(item.id);
            setResolvingType(type);
            try {
                finalData = await actionConfig.resolveData(item);
            } catch (error) {
                toast.error("Failed to load details");
                setResolvingId(null);
                setResolvingType(null);
                return;
            }
            setResolvingId(null);
            setResolvingType(null);
        }

        setResolvedData(finalData);
        setSelectedId(item.id);
        if (type === 'edit') {
            setIsCreating(false);
        } else {
            setIsViewing(true);
        }
    };

    const handleClose = () => {
        setSelectedId(null);
        setIsCreating(false);
        setIsViewing(false);
        setResolvedData(null);
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

        let baseColumns = config.display.columns ? [...config.display.columns] : [];

        if (isMobile) {
            baseColumns = baseColumns.filter((column: any) => !column.meta?.hideOnMobile);
        }

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

        if (actionConfig?.view || actionConfig?.edit || actionConfig?.delete || (actionConfig?.custom && actionConfig.custom.length > 0)) {
            baseColumns.push({
                id: 'actions',
                header: 'Actions',
                cell: ({ row }: any) => {
                    const item = row.original;
                    const viewState = getActionState(viewConfig, item);
                    const editState = getActionState(editConfig, item);
                    const deleteState = getActionState(deleteConfig, item);

                    return (
                        <div className="flex items-center justify-end gap-2" data-dm="actions-wrapper">

                            {!viewState.hidden && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-primary hover:primary hover:bg-primary/20 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resolveItemData(item, 'view');
                                    }}
                                    disabled={viewState.disabled || (resolvingId === item.id && resolvingType === 'view')}
                                    data-dm-action="view"
                                >
                                    {resolvingId === item.id && resolvingType === 'view' ? (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            )}


                            {actionConfig?.custom && actionConfig.custom.map((action: any, index: number) => {
                                const isHidden = typeof action.hidden === 'function' ? action.hidden(item) : action.hidden;
                                if (isHidden) return null;

                                const isDisabled = typeof action.disabled === 'function' ? action.disabled(item) : action.disabled;

                                const context: ActionContext<T> = {
                                    edit: (targetItem) => resolveItemData(targetItem, 'edit'),
                                    view: (targetItem) => resolveItemData(targetItem, 'view'),
                                    delete: (targetItem) => handleDelete(targetItem.id),
                                    refresh: () => loadData(),
                                };

                                return (
                                    <Button
                                        key={index}
                                        size="icon"
                                        variant={action.variant || "ghost"}
                                        className={cn(
                                            "h-8 w-8 cursor-pointer",
                                            action.variant === 'destructive' 
                                                ? 'text-destructive hover:text-destructive/80 hover:bg-destructive/20' 
                                                : 'text-primary hover:primary hover:bg-primary/20',
                                            action.className
                                        )}
                                        disabled={isDisabled}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            action.onClick(item, context);
                                        }}
                                        title={action.label}
                                        data-dm-action="custom"
                                        data-dm-custom-label={action.label.toLowerCase().replace(/\s+/g, '-')}
                                    >
                                        {action.icon || action.label}
                                    </Button>
                                );
                            })}
                            {!editState.hidden && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-primary hover:primary hover:bg-primary/20 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resolveItemData(item, 'edit');
                                    }}
                                    disabled={editState.disabled || (resolvingId === item.id && resolvingType === 'edit')}
                                    data-dm-action="edit"
                                >
                                    {resolvingId === item.id && resolvingType === 'edit' ? (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    ) : (
                                        <Pencil className="h-4 w-4" />
                                    )}
                                </Button>
                            )}

                            {!deleteState.hidden && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/20 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item.id);
                                    }}
                                    disabled={deleteState.disabled}
                                    data-dm-action="delete"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    );
                },
            });
        }

        return baseColumns;
    }, [config.display.columns, config.display.bulkActions?.enabled, config.display.actions, selectedId, isMobile, resolvingId, resolvingType]);

    const renderWrapper = (item: T) => {
        if (!config.display.renderItem) return null;

        const editState = getActionState(editConfig, item);
        const deleteState = getActionState(deleteConfig, item);

        return (
            <div className="group relative">
                {config.display.renderItem(item)}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/90 p-1 rounded-md shadow-sm border" data-dm="actions-wrapper">
                    {!editState.hidden && (
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6" 
                            onClick={() => resolveItemData(item, 'edit')}
                            disabled={editState.disabled || (resolvingId === item.id && resolvingType === 'edit')}
                            data-dm-action="edit"
                        >
                            {resolvingId === item.id && resolvingType === 'edit' ? (
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border border-primary border-t-transparent" />
                            ) : (
                                <Pencil className="h-3 w-3" />
                            )}
                        </Button>
                    )}
                    {!deleteState.hidden && (
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6 text-destructive" 
                            onClick={() => handleDelete(item.id)}
                            disabled={deleteState.disabled}
                            data-dm-action="delete"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    )}
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
            <div className="flex-none px-0 py-3 sm:p-4 md:p-6 border-b flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="w-full sm:w-auto flex flex-col items-center sm:items-start text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">{config.title}</h1>
                    {config.description && (
                        <p className={cn(
                            "text-sm text-muted-foreground mt-1",
                            !config.showDescriptionOnMobile && "hidden sm:block"
                        )}>
                            {config.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {!config.display.disableRefresh && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                            onClick={loadData}
                            disabled={loading}
                            title="Refresh data"
                        >
                            <RotateCw className={cn("h-4 w-4", loading && "animate-spin")} />
                        </Button>
                    )}

                    {!isCreating && !config.display.disableCreate && (
                        <Button onClick={() => { setSelectedId(null); setIsCreating(true); }} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4 shrink-0" />
                            Add {config?.display?.createModalConfig?.createButtonText ?? (config.title || 'Item')}
                        </Button>
                    )}

                    {config.display.type === 'table' && (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-muted-foreground hover:text-foreground h-9 text-xs cursor-pointer shrink-0"
                                >
                                    <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {config.display.columns
                                    ?.filter((column: any) => 
                                        (column.accessorKey || column.id) && 
                                        column.enableHiding !== false && 
                                        !(isMobile && column.meta?.hideOnMobile)
                                    )
                                    .map((column: any) => {
                                        const columnId = column.accessorKey || column.id;
                                        const columnLabel = typeof column.header === 'string' ? column.header : toTitleCase(columnId);
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={columnId}
                                                className="capitalize cursor-pointer"
                                                checked={columnVisibility[columnId] !== false}
                                                onCheckedChange={(value) => {
                                                    setColumnVisibility((prev) => ({
                                                        ...prev,
                                                        [columnId]: !!value,
                                                    }));
                                                }}
                                            >
                                                {columnLabel}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Custom Element Space - Header */}
            {config.display.layoutSpaces?.header ?? null}

            {/* --- BODY --- */}
            <div className={`flex-1 overflow-hidden px-0 py-2.5 sm:p-4 md:p-6 ${config.display.layoutSpaces?.header ? 'mt-2' : ''} ${config.display.layoutSpaces?.footer ? 'mb-2' : ''}`}>
                
                {/* Bulk Actions Toolbar */}
                <div 
                    className={cn(
                        "grid overflow-hidden transition-all duration-300 ease-in-out",
                        config.display.bulkActions?.enabled && selectedIds.length > 0
                            ? "opacity-100 mb-4"
                            : "opacity-0 mb-0 pointer-events-none"
                    )}
                    style={{
                        gridTemplateRows: config.display.bulkActions?.enabled && selectedIds.length > 0 ? "1fr" : "0fr"
                    }}
                >
                    <div className="overflow-hidden min-h-0">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between bg-primary/5 border border-primary/20 p-3 rounded-lg">
                            <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
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
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                                {bulkActions.map((action, index) => (
                                    <Button
                                        key={index}
                                        variant={action.variant || "outline"}
                                        size="sm"
                                        onClick={() => action.onClick(selectedIds, selectedItems)}
                                        className="gap-2 cursor-pointer h-8 w-full sm:w-auto"
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
                            initialValues={isCreating ? {} : (resolvedData ?? activeItem ?? {})}
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
                        searchOptions={config.display.searchOptions}
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
                data={resolvedData ?? activeItem}
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
        fields?: ViewFieldConfig<any>[];
    };
}

export function ViewDialog({ isOpen, data, handleClose, config }: ViewDialogProps) {
    const renderValue = (value: any, item: any) => {
        if (value === null || value === undefined || value === '') {
            return <span className="text-muted-foreground/60 italic">—</span>;
        }

        if (typeof value === 'boolean') {
            return value ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30">Yes</span>
            ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border/50">No</span>
            );
        }

        if (typeof value === 'string') {
            // Check for image URL
            if (value.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || value.startsWith('data:image/')) {
                return (
                    <div className="relative group max-w-[240px] mt-1 rounded-lg overflow-hidden bg-muted/40 shadow-sm">
                        <img src={value} alt="Preview" className="max-h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                );
            }
            // Check for Email
            if (value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                return (
                    <a href={`mailto:${value}`} className="text-primary hover:underline break-all inline-flex items-center gap-1">
                        {value}
                    </a>
                );
            }
            // Check for Web Link
            if (value.startsWith('http://') || value.startsWith('https://')) {
                return (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all inline-flex items-center gap-1">
                        {value}
                    </a>
                );
            }
            // Check for ISO Date
            if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
                try {
                    return new Date(value).toLocaleString();
                } catch (e) {
                    // Fall through
                }
            }
        }

        if (typeof value === 'object') {
            return (
                <pre className="text-xs bg-muted/80 p-3 rounded-lg overflow-x-auto max-w-full font-mono text-foreground mt-1">
                    {JSON.stringify(value, null, 2)}
                </pre>
            );
        }

        return String(value);
    };

    const getFieldColSpan = (value: any) => {
        if (value && typeof value === 'object') return 'sm:col-span-2';
        if (value && typeof value === 'string' && (value.length > 80 || value.includes('\n'))) return 'sm:col-span-2';
        return 'sm:col-span-1';
    };

    return (
        <Dialog modal={false} open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-4xl w-full" >
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
                <div className="overflow-y-auto pr-2 space-y-4 max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh]">
                    {config?.renderItem ? (
                        config.renderItem(data)
                    ) : (
                        typeof data !== "object" || data === null ? (
                            <div className="bg-muted/20 p-4 rounded-xl">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Data</p>
                                <p className="text-sm font-medium text-foreground mt-1">{String(data)}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {config?.fields ? (
                                    config.fields.map((field) => {
                                        if (field.isSection) {
                                            return (
                                                <div 
                                                    key={field.name} 
                                                    className={cn(
                                                        "sm:col-span-2 font-bold text-[10px] uppercase tracking-wider text-primary border-b border-border pb-1.5 mt-4 first:mt-0", 
                                                        field.className
                                                    )}
                                                >
                                                    {field.label || toTitleCase(String(field.name))}
                                                </div>
                                            );
                                        }
                                        const val = data[field.name];
                                        const colSpan = getFieldColSpan(val);
                                        return (
                                            <div key={field.name} className={cn("bg-muted/20 p-3.5 rounded-xl hover:bg-muted/30 transition-colors flex flex-col space-y-1.5", colSpan, field.className)}>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                                    {field.label || toTitleCase(String(field.name))}
                                                </p>
                                                <div className="text-sm font-medium text-foreground break-words">
                                                    {field.render ? field.render(val, data) : renderValue(val, data)}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    Object.keys(data).filter(key => typeof data[key] !== 'function').map((key) => {
                                        const val = data[key];
                                        const colSpan = getFieldColSpan(val);
                                        return (
                                            <div key={key} className={cn("bg-muted/20 p-3.5 rounded-xl hover:bg-muted/30 transition-colors flex flex-col space-y-1.5", colSpan)}>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                                    {toTitleCase(key)}
                                                </p>
                                                <div className="text-sm font-medium text-foreground break-words">
                                                    {renderValue(val, data)}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )
                    )}
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
