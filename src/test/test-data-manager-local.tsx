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

// Seed data (generates 30 sample employees for pagination testing)
const initialData: ExampleData[] = Array.from({ length: 30 }, (_, index) => {
  const id = index + 1;
  const names = [
    "Alice Smith", "Bob Jones", "Charlie Brown", "David Miller", "Emma Wilson",
    "Frank Thomas", "Grace Davis", "Henry Wilson", "Ivy Taylor", "Jack Anderson",
    "Kate Thomas", "Liam Jackson", "Mia White", "Noah Martin", "Olivia Thompson",
    "Paul Harris", "Quinn Clark", "Ryan Lewis", "Sophia Walker", "Tyler Hall",
    "Ursula Allen", "Victor Young", "Wendy King", "Xavier Wright", "Yolanda Scott",
    "Zachary Green", "Abigail Adams", "Benjamin Baker", "Chloe Carter", "Daniel Diaz"
  ];
  const statuses = ["Active", "Inactive"];
  const categories = ["Engineering", "Design", "Product", "Marketing", "HR", "Sales", "Support"];
  
  return {
    id,
    name: names[index % names.length],
    status: statuses[index % statuses.length],
    category: categories[index % categories.length]
  };
});

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
