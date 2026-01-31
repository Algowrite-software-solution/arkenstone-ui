/**
 *
 * A universal base class for application services.
 * connects the API layer with the State Management layer.
 *
 * Capabilities:
 * - CRUD operations with fully customizable options.
 * - Singleton Store management (Zustand).
 * - Dynamic Endpoints.
 * - Middleware hooks (before/after requests).
 * - Automatic Error/Success handling based on defaults.
 */

import { StoreApi, UseBoundStore } from "zustand";
import { apiDelete, apiGet, apiPost, apiPut, ApiOptions } from "../hooks/api"; // Adjust path
import { createGenericStore, BaseActions } from "../stores/store-factory"; // Adjust path

// --- Types ---

/**
 * Standard shape for a paginated list response.
 * Customize 'data', 'meta', 'links' based on your backend structure.
 */
export interface ListResponse<T> {
  data: T[];
  meta?: any;
  links?: any;
}

/**
 * Configuration options passed when initializing a specific Service.
 */
export interface ServiceConfig<TState extends object> {
  /**
   * Base endpoint for the resource (e.g., '/users').
   * Can be a string or a function returning a string for dynamic runtime resolution.
   */
  endpoint: string | (() => string);

  /**
   * Name of the entity (used for logging or debugging).
   */
  entityName?: string;

  /**
   * Sync the store with the API.
   */
  syncWithStore?: boolean;

  /**
   * Store Configuration.
   * If provided, the service will create a singleton Zustand store.
   */
  store?: {
    initialState: TState;
    /** Unique name for local storage persistence. If omitted, persistence is disabled. */
    persistName?: string;
    /** Custom actions/selectors to inject into the store */
    methods?: (set: any, get: any) => any;
  };
}

/**
 * The Abstract Base Class.
 * T = Entity Type (e.g., User)
 * C = Create DTO (e.g., CreateUserRequest)
 * U = Update DTO (e.g., UpdateUserRequest)
 * TState = Structure of the Zustand Store State
 */
export class ServiceFactory<
  T extends object,
  C extends object = Partial<T>,
  U extends object = Partial<T>,
  TState extends object = { list: T[]; selected: T | null; loading: boolean },
> {
  protected config: ServiceConfig<TState>;

  // Holds the singleton instance of the Zustand store hook
  private _store: UseBoundStore<
    StoreApi<TState & BaseActions<TState> & any>
  > | null = null;

  constructor(config: ServiceConfig<TState>) {
    this.config = config;
    console.log("Service Factory Implimentation Instanciated");
  }

  // =========================================================================
  // 1. Store Management (Singleton Pattern)
  // =========================================================================

  /**
   * Returns the React Hook for the Zustand store.
   * Initializes the store only once (lazy loading).
   */
  public get useStore() {
    if (!this.config.store) {
      throw new Error(
        `Store not configured for service: ${this.config.entityName || "Unknown"}`,
      );
    }

    if (!this._store) {
      console.log("Initiated the Generic Store Creation");
      this._store = createGenericStore<TState, any>(
        this.config.store.initialState,
        {
          name: this.config.store.persistName,
          methods: this.config.store.methods,
        },
      );
    }

    console.log("Generic Store Found! Accessing the Store");
    return this._store;
  }

  /**
   * Access the vanilla store state (non-hook) for usage outside React components.
   */
  public get storeApi() {
    console.log("Accessing the Store API");
    return this.useStore.getState();
  }

  // =========================================================================
  // 2. Dynamic Endpoint Handling
  // =========================================================================

  /**
   * Resolves the base URL. Supports dynamic strings based on runtime logic.
   * @param append - Optional string to append (e.g., '/active')
   */
  protected getEndpoint(append: string = ""): string {
    const base =
      typeof this.config.endpoint === "function"
        ? this.config.endpoint()
        : this.config.endpoint;

    // Remove trailing slash if present to avoid double slashes
    const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${cleanBase}${append}`;
  }

  // =========================================================================
  // 3. CRUD Operations (Fully Customizable)
  // =========================================================================

  /**
   * GET: Fetch all or paginated list.
   * Defaults: Display Error = True, Display Success = False
   */
  public async getAll(
    params: any = {},
    options: ApiOptions = {},
  ): Promise<ListResponse<T> | T[] | null> {
    const url = this.getEndpoint();
    const mergedOptions = this.applyMiddleware({
      displayError: true,
      displaySuccess: false,
      params,
      ...options,
    });

    console.log("Fetching all data from the API");
    const response = await apiGet(url, mergedOptions);

    if (this.config.syncWithStore) {
      console.log("Syncing with the store from API Response");
      this.useStore.setState({ list: response.data });
    }

    return response;
  }

  /**
   * GET: Fetch single entity by ID.
   */
  public async getById(
    id: string | number,
    options: ApiOptions = {},
  ): Promise<T | null> {
    const url = this.getEndpoint(`/${id}`);
    const mergedOptions = this.applyMiddleware({
      displayError: true,
      ...options,
    });

    return await apiGet(url, mergedOptions);
  }

  /**
   * POST: Create a new entity.
   */
  public async create(data: C, options: ApiOptions = {}): Promise<T | null> {
    const url = this.getEndpoint();
    const mergedOptions = this.applyMiddleware({
      data,
      displayError: true,
      displaySuccess: false, // Usually false, let the UI decide or override
      ...options,
    });

    return await apiPost(url, mergedOptions);
  }

  /**
   * PUT: Update an existing entity.
   */
  public async update(
    id: string | number,
    data: U,
    options: ApiOptions = {},
  ): Promise<T | null> {
    const url = this.getEndpoint(`/${id}`);
    const mergedOptions = this.applyMiddleware({
      data,
      displayError: true,
      displaySuccess: false,
      ...options,
    });

    return await apiPut(url, mergedOptions);
  }

  /**
   * DELETE: Remove an entity.
   */
  public async delete(
    id: string | number,
    options: ApiOptions = {},
  ): Promise<any> {
    const url = this.getEndpoint(`/${id}`);
    const mergedOptions = this.applyMiddleware({
      displayError: true,
      displaySuccess: false,
      ...options,
    });

    return await apiDelete(url, mergedOptions);
  }

  // =========================================================================
  // 4. Custom/RPC Style Actions
  // =========================================================================

  /**
   * Helper for custom actions (e.g., /users/1/activate)
   */
  public async customAction<Res = any>(
    method: "get" | "post" | "put" | "delete",
    actionPath: string,
    options: ApiOptions = {},
  ): Promise<Res | null> {
    // actionPath should be like '/activate' or '/1/approve'
    const url = this.getEndpoint(actionPath);
    const mergedOptions = this.applyMiddleware({
      displayError: true,
      ...options,
    });

    switch (method) {
      case "get":
        return await apiGet(url, mergedOptions);
      case "post":
        return await apiPost(url, mergedOptions);
      case "put":
        return await apiPut(url, mergedOptions);
      case "delete":
        return await apiDelete(url, mergedOptions);
    }
  }

  // =========================================================================
  // 5. Internals & Middleware
  // =========================================================================

  /**
   * Centralized place to inject default logic before any request.
   * Can be overridden by child classes to add auth headers, logging, etc.
   */
  protected applyMiddleware(options: ApiOptions): ApiOptions {
    // Example: You could inject a transformResponse here if needed
    return options;
  }
}
