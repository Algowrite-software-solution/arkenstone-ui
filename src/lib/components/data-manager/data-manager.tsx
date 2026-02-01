/**
 * DataManager.tsx
 * 
 * The "Brain" of the Generic Service Architecture.
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Internal Modules ---
import { DataManagerConfig } from './types';
import { LayoutManager } from './layout-manager';
import { GenericForm } from './input-engine';
import { DisplayEngine } from './display-engine';

export function DataManager<T extends { id: string | number }>({
    config
}: {
    config: DataManagerConfig<T>
}) {
    const { service, devMode } = config;

    // =========================================================================
    // 1. STATE MANAGEMENT
    // =========================================================================

    const { list: data, loading, update: updateStore } = service.useStore();

    // Local UI State
    const [selectedId, setSelectedId] = useState<string | number | null>(null);
    const [isCreating, setIsCreating] = useState(false);

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

    // Derived State
    const activeItem = useMemo(() =>
        selectedId ? data.find((i: T) => i.id === selectedId) : null,
        [selectedId, data]);

    const isPanelOpen = !!selectedId || isCreating;

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

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                log("Fetching Data...");
                const response = await service.getAll();

                if (!isMounted) return;

                const listData = Array.isArray(response) ? response : (response as any)?.data || [];

                updateStore((state: any) => {
                    state.list = listData;
                    state.loading = false;
                });

            } catch (error) {
                console.error("Failed to load data", error);
            }
        };

        loadData();

        return () => { isMounted = false; };
    }, [service]);


    const isImageInputExists = config.form?.fields?.some((field: any) => field.type === 'image');


    // =========================================================================
    // 4. CRUD HANDLERS
    // =========================================================================

    const handleCreate = async (values: any) => {
        log("Creating Item", values);
        try {
            const options = isImageInputExists ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
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
    };

    const handleUpdate = async (values: any) => {
        if (!selectedId) return;

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
            let options = {};

            if (isImageInputExists) {
                options = { headers: { 'Content-Type': 'multipart/form-data' } };
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
                                if (key.includes('removed') || key === config.form.fields.find(f => f.removedImagesField === key)?.removedImagesField) {
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
    };

    const handleDelete = async (id: string | number) => {
        // Await the custom confirmation dialog
        const isConfirmed = await requestConfirmation("Are you sure you want to delete this item? This action cannot be undone.");

        if (!isConfirmed) return;

        log("Deleting Item", id);
        try {
            await service.delete(id);
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
    };

    // =========================================================================
    // 5. DISPLAY CONFIGURATION
    // =========================================================================

    const tableColumns = useMemo(() => {
        if (config.display.type !== 'table') return [];

        const baseColumns = [...config.display.columns];

        baseColumns.push({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: any) => (
                <div className="flex items-center justify-end gap-2">
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
                </div>
            ),
        });

        return baseColumns;
    }, [config.display.columns, selectedId]);

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

                {!isCreating && (
                    <Button onClick={() => { setSelectedId(null); setIsCreating(true); }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add {config.title || 'Item'}
                    </Button>
                )}
            </div>

            {/* --- BODY --- */}
            <div className="flex-1 overflow-hidden p-4 md:p-6">
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
                    />
                </LayoutManager>
            </div>

            {/* --- CONFIRMATION DIALOG --- */}
            <ConfirmationDialog
                isOpen={confirmState.isOpen}
                message={confirmState.message}
                onConfirm={onConfirmDialog}
                onCancel={onCancelDialog}
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