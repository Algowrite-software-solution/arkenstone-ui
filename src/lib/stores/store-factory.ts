import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

/**
 * Define Base Actions for the factory
 */
export interface BaseActions<T> {
  update: (fn: (state: T) => void) => void;
  reset: () => void;
}

/**
 * Generic store factory that will be used to create a store.
 */
export const createGenericStore = <
  TState extends object,
  TCustomActions = {}
>(
  initialState: TState,
  options: {
    name?: string;
    methods?: (
      set: (fn: (state: TState) => void) => void, 
      get: () => TState & BaseActions<TState> & TCustomActions
    ) => TCustomActions;
  } = {}
) => {
  const { name, methods } = options;

  /**
   * Define the combined Store Type
   */
  type StoreType = TState & BaseActions<TState> & TCustomActions;

  /**
   * Define the Initializer
   */
  const stateInitializer: StateCreator<
    StoreType,
    [["zustand/immer", never]], 
    []
  > = (set, get) => ({
    ...initialState,

    // Generic Immer Update
    update: (fn) => set((state) => {
        fn(state as TState);
    }),

    // Generic Reset
    reset: () => set(() => ({ ...initialState })),

    // Custom Methods Injection
    ...(methods ? methods(set as any, get) : ({} as TCustomActions)),
  });

  /**
   * Conditional Middleware Applying process
   */
  if (name) {
    return create<StoreType>()(
      persist(
        immer(stateInitializer), 
        {
          name,
          storage: createJSONStorage(() => localStorage),
          // Optional: Handle merging state if structure changes
          merge: (persistedState, currentState) => ({ ...currentState, ...(persistedState as object) }),
          version: 0,
          migrate: (persistedState, version) => {
            if (version === 0) {
                // #TODO update here to migrate state changes 
            }
            return persistedState as TState;
        }
        }
      )
    );
  }

  return create<StoreType>()(immer(stateInitializer));
};