import { Arkenstone } from '../lib/components/arkestone'
import { DataManager } from '../lib/components/data-manager/data-manager'
import { ServiceFactory } from '../lib/services/service-factory'
import { ColumnDef } from '@tanstack/react-table'

// 1. Interface
interface ExampleData {
  id: number;
  name: string;
  status: string;
  category: string;
}

// 2. Service setup
const ExampleDataService = new ServiceFactory<ExampleData>({
  endpoint: "/mock-api",
  entityName: "ExampleData",
  store: {
    initialState: { list: [], selected: null, loading: false },
    persistName: "example-mock-store",
  },
  syncWithStore: true,
});

// Seed data
const initialData: ExampleData[] = [
  { id: 1, name: "Alice Smith", status: "Active", category: "Engineering" },
  { id: 2, name: "Bob Jones", status: "Inactive", category: "Design" },
  { id: 3, name: "Charlie Brown", status: "Active", category: "Product" },
  { id: 4, name: "David Miller", status: "Active", category: "Marketing" },
  { id: 5, name: "Emma Wilson", status: "Inactive", category: "HR" },
];

// Initialize list in store
ExampleDataService.useStore.setState({ list: initialData });

// Mock the API methods
ExampleDataService.getAll = async () => {
  return ExampleDataService.useStore.getState().list;
};

ExampleDataService.create = async (data: any) => {
  const newItem = {
    id: Date.now(),
    ...data,
  };
  return newItem;
};

ExampleDataService.update = async (id: string | number, data: any) => {
  const list = ExampleDataService.useStore.getState().list;
  const item = list.find((i: ExampleData) => i.id === Number(id));
  if (!item) return null;
  return {
    ...item,
    ...data,
  };
};

ExampleDataService.delete = async (id: string | number) => {
  return { success: true };
};

const columns: ColumnDef<ExampleData>[] = [
  { accessorKey: "id", header: "ID", enableSorting: true },
  { accessorKey: "name", header: "Name", enableSorting: true },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "category", header: "Category" },
];

export function TestDataManagerLocal() {
  return (
    <Arkenstone>
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Arkenstone Data Manager Preview</h1>
        <p className="text-muted-foreground">
          Click on headers (ID, Name, Status, Category) to sort the table dynamically.
        </p>

        <DataManager<ExampleData>
          config={{
            title: "Employees",
            description: "A table view of employees with built-in search, filtering, and sorting support.",
            service: ExampleDataService,
            layout: "modal",
            modalSize: "lg",
            devMode: true,
            display: {
              type: "table",
              columns: columns,
              searchKeys: ["name", "category", "status"],
            },
            form: {
              fields: [
                {
                  name: "name",
                  label: "Name",
                  type: "text",
                  validation: { required: true },
                },
                {
                  name: "status",
                  label: "Status",
                  type: "select",
                  options: [
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                  ],
                  validation: { required: true },
                },
                {
                  name: "category",
                  label: "Category",
                  type: "text",
                  validation: { required: true },
                },
              ],
            },
          }}
        />
      </div>
    </Arkenstone>
  );
}
