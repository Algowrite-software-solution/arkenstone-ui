/**
 * DataManager.tsx
 * 
 * The "Brain" of the Generic Service Architecture.
 * 
 * Responsibilities:
 * 1. Connects to the ServiceFactory to manage Data State (Fetch, Create, Update, Delete).
 * 2. Manages UI State (Selection, Creation Mode, Loading).
 * 3. Wires the "DisplayEngine" (Table/List) with the "InputEngine" (Form).
 * 4. Controls the Layout (SplitView vs Modal) via "LayoutManager".
 * 5. Handles Optimistic Updates and User Feedback (Toasts).
 */

import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
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
    
    // Access the Singleton Store from the Factory
    // We assume the factory provides { list, loading, update, reset }
    const store = service.useStore(); 
    const { list: data, loading, update: updateStore } = store((state: any) => state); 

    // Local UI State
    const [selectedId, setSelectedId] = useState<string | number | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    
    // Derived State
    const activeItem = useMemo(() => 
        selectedId ? data.find((i: T) => i.id === selectedId) : null, 
    [selectedId, data]);

    const isPanelOpen = !!selectedId || isCreating;

    // Helper: Developer Logging
    const log = (...args: any[]) => {
        if (devMode) console.log(`[DataManager:${config.title}]`, ...args);
    };

    // =========================================================================
    // 2. EFFECTS & DATA LOADING
    // =========================================================================

    useEffect(() => {
        let isMounted = true;
        
        const loadData = async () => {
            // Only fetch if data is empty or we want to force refresh on mount
            // For now, we fetch on mount to ensure freshness
            try {
                log("Fetching Data...");
                const response = await service.getAll();
                
                if (!isMounted) return;

                // Handle both Array response and Paginated response ({ data: [] })
                const listData = Array.isArray(response) ? response : (response as any)?.data || [];
                
                updateStore((state: any) => { 
                    state.list = listData; 
                    state.loading = false;
                });
                
                log("Data Loaded", listData);
            } catch (error) {
                console.error("Failed to load data", error);
                // The ServiceFactory default error handler will show the Toast
            }
        };

        loadData();

        return () => { isMounted = false; };
    }, [service]); // Dependency on service ensures correct instance

    // =========================================================================
    // 3. CRUD HANDLERS
    // =========================================================================

    const handleCreate = async (values: any) => {
        log("Creating Item", values);
        try {
            const res = await service.create(values);
            if (res) {
                toast.success(`${config.title} created successfully`);
                
                // Optimistic Update: Add to top of list
                updateStore((state: any) => { state.list.unshift(res); });
                
                setIsCreating(false);
            }
        } catch (e) {
            // Error handled by ServiceFactory
            log("Create Error", e);
        }
    };

    const handleUpdate = async (values: any) => {
        if (!selectedId) return;
        log("Updating Item", selectedId, values);
        
        try {
            const res = await service.update(selectedId, values);
            if (res) {
                toast.success(`${config.title} updated successfully`);
                
                // Optimistic Update: Replace item in list
                updateStore((state: any) => {
                    const idx = state.list.findIndex((i: T) => i.id === selectedId);
                    if (idx !== -1) state.list[idx] = res;
                });
                
                setSelectedId(null); // Close panel/modal on success
            }
        } catch (e) {
            log("Update Error", e);
        }
    };

    const handleDelete = async (id: string | number) => {
        if(!window.confirm("Are you sure you want to delete this item?")) return;
        
        log("Deleting Item", id);
        try {
            await service.delete(id);
            toast.success("Item deleted");
            
            // Optimistic Update: Remove from list
            updateStore((state: any) => {
                state.list = state.list.filter((i: T) => i.id !== id);
            });
            
            // Close panel if the deleted item was selected
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
    // 4. DISPLAY CONFIGURATION
    // =========================================================================

    // Inject "Actions" column if using Table View
    const tableColumns = useMemo(() => {
        if (config.display.type !== 'table') return [];
        
        const baseColumns = [...config.display.columns];
        
        // Add Action Column
        baseColumns.push({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: any) => (
                <div className="flex items-center justify-end gap-2">
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            setIsCreating(false);
                            setSelectedId(row.original.id);
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                        size="icon" 
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
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

    // Wrapper for List/Grid item rendering to inject actions
    const renderWrapper = (item: T) => {
        if (!config.display.renderItem) return null;
        
        return (
            <div className="group relative">
                {/* Render the user's custom component */}
                {config.display.renderItem(item)}
                
                {/* Overlay Actions (Visible on Hover for Grid/List) */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/90 p-1 rounded-md shadow-sm border">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setSelectedId(item.id)}>
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        );
    };

    // =========================================================================
    // 5. RENDER
    // =========================================================================

    return (
        <div className="w-full h-full flex flex-col overflow-hidden bg-background/50">
            
            {/* --- HEADER --- */}
            <div className="flex-none p-4 md:p-6 border-b bg-background flex justify-between items-start md:items-center">
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

            {/* --- BODY (Layout Manager) --- */}
            <div className="flex-1 overflow-hidden p-4 md:p-6">
                <LayoutManager
                    type={config.layout}
                    isDetailsOpen={isPanelOpen}
                    onCloseDetails={handleClose}
                    title={isCreating ? `Create ${config.title || 'Item'}` : `Edit ${config.title || 'Item'}`}
                    
                    // --- RIGHT PANEL / MODAL CONTENT (FORM) ---
                    detailsPanel={
                        <GenericForm 
                            fields={config.form.fields}
                            initialValues={isCreating ? {} : activeItem}
                            onSubmit={isCreating ? handleCreate : handleUpdate}
                            submitLabel={isCreating ? "Create" : "Save Changes"}
                            liveUpdate={config.form.liveUpdate}
                            className={config.layout === 'split-view' ? "h-full" : ""}
                        />
                    }
                >
                    {/* --- LEFT PANEL / MAIN CONTENT (DISPLAY) --- */}
                    <DisplayEngine 
                        type={config.display.type === 'grid' ? 'grid' : 
                              config.display.type === 'list' ? 'list' : 'table'}
                        
                        data={data}
                        loading={loading}
                        columns={tableColumns}
                        searchKeys={config.display.searchKeys}
                        renderItem={renderWrapper}
                        className="h-full overflow-auto" // Ensure table scrolls independently
                    />
                </LayoutManager>
            </div>
        </div>
    );
}