import { useEffect } from "react";
import { PlanetService } from "../lib/services/planet-service";
import { Planet } from "../lib/services/planet-service";
import { PlanetState } from "../lib/services/planet-service";
import { Arkenstone } from "../lib/components/arkestone";

export function SolarSystemPreview() {
  const { planets, setPlanets, activePlanet, setActive } = PlanetService.useStore();


    // 2. Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            // Using the API method from the service
            const data = await PlanetService.getAll({ params: { name: 'Earth' } }, { withCredentials: false });
            console.log(data);
            
            // Manually updating store (unless you automated this in an extended class)
            if (data && Array.isArray(data)) {
                setPlanets(data); 
            }
        };
        fetchData();
    }, []);
    

    const handleDelete = async (id: number) => {
        // Call API - Error toast is automatic via factory defaults
        await PlanetService.delete(id);
        
        // Update UI
        PlanetService.storeApi.update((state : PlanetState) => {
            state.planets = state.planets.filter((planet: Planet) => planet.id !== id);
        });
    };


    // Test Helpers for FUN
function WorldVisualizer({ planet, activePlanet }: { planet: Planet, activePlanet: Planet | null }) {
  const radius = planet.radius;
  const circumference = 2 * Math.PI * radius;
  const circumferenceInPixels = circumference * 30; // 30 pixels per meter
  const diameterInPixels = circumferenceInPixels / 2;

  return (
    <div className="relative">
      <div
        className={activePlanet?.id === planet.id ? "absolute inset-0 bg-gray-200 rounded-full" : "absolute inset-0 bg-gray-600 rounded-full"}
        style={{ width: diameterInPixels, height: diameterInPixels }}
      />

      <div className="absolute -translate-x-1/2 -translate-y-1/2">
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${diameterInPixels} ${diameterInPixels}`}
        >
          <circle
            cx={diameterInPixels / 2}
            cy={diameterInPixels / 2}
            r={radius * 15} // 15 pixels per meter
            fill="transparent"
            stroke="white"
            strokeWidth="2"
          />
          <circle
            cx={diameterInPixels / 2}
            cy={diameterInPixels / 2}
            r={radius}
            fill="yellow"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs">
        {planet.name}
      </div>
      <button onClick={() => setActive(planet)}>Select</button>
      <button onClick={() => handleDelete(planet.id)}>Delete</button>
    </div>
  );
}

  return (
    <Arkenstone config={{
        aclConfig: {
            mode: 'local',
            // ROLE GROUPS
            groups: {
                'staff': ['admin', 'manager', 'editor'],
                'financial_approvers': ['admin', 'cfo']
            },
            // CAPABILITIES
            permissions: {
                'admin': ['*'],
                'manager': ['product.create', 'product.edit', 'order.view'],
                'editor': ['product.edit'],
                'guest': ['product.view']
            }
        },
        api: {
            url: 'http://localhost:8000/',
            isSameOrigin: false,
        }
    }}>
      <div className="bg-slate-400 p-10 rounded-lg text-center">
        <h1 className="text-2xl font-bold text-white">Solar System Preview</h1>
      </div>

      <div className="w-100">
        {planets.map((planet: Planet) => (
          <WorldVisualizer key={planet.id} planet={planet} activePlanet={activePlanet} />
        ))}
      </div>
    </Arkenstone>
  );
}



