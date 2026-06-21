import { Arkenstone } from "@/components";
import { DataManager } from "@/components/data-manager/data-manager";
import { DefaultMenu } from "@/components/dynamic-menu/default-menu";
import { DefaultPanelLayout } from "@/layouts";
import { ServiceFactory } from "@/services/service-factory";
import { ColumnDef } from "@tanstack/react-table";

// 1. Interfaces
interface ExampleData {
  id: number;
  name: string;
  description: string;
}

// 2. Service
// (Ideally this is in a separate file)
const ExampleDataService = new ServiceFactory<ExampleData>({
  endpoint: "/test-api",
  entityName: "ExampleData",
  store: {
    initialState: { list: [], selected: null, loading: false },
    persistName: "example-data-store",
  },
  syncWithStore: true,
});

// 3. Configuration
const exampleColumns: ColumnDef<ExampleData>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "description", header: "Description" },
];

export function DynamicMenuTest() {
  return (
    <Arkenstone
      config={{
        aclConfig: {
          mode: "local",
        },
        api: {
          isSameOrigin: false,
          url: "http://localhost:8000/api/v1",
          withCredentials: false
        },
      }}
    >
      <div className="container mx-auto w-200">
<DefaultMenu mapping={{}} menuItems={[]} config={{ behaviour: "show" }} classNames={{}} />
      </div>
    </Arkenstone>
  );
}
