import { ServiceFactory } from "./service-factory";

export interface Planet {
    id: number;
    name: string;
    radius: number;
    habitable: boolean;
    moons: number;
    planetHash: string;
}

export interface CreatePlanetDto {
    name: string;
    radius: number;
    habitable: boolean;
    moons: number;
}

// Define the State Interface for the store
export interface PlanetState {
    planets: Planet[];
    activePlanet: Planet | null;
}

// Instantiate and Export
export const PlanetService = new ServiceFactory<Planet, CreatePlanetDto, Partial<Planet>, PlanetState>({
    endpoint: '/solar-system',
    entityName: 'Planet',
    store: {
        persistName: 'app-planets-cache', // Optional: saves to localStorage
        initialState: {
            planets: [],
            activePlanet: null
        },
        // Custom Store Actions
        methods: (set) => ({
            setPlanets: (planets: Planet[]) => set((state: PlanetState) => { state.planets = planets }),
            setActive: (planet: Planet) => set((state: PlanetState) => { state.activePlanet = planet }),
        })
    }
});