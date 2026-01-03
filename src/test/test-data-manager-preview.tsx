import { Arkenstone } from "@/components";
import { DataManager } from "@/components/data-manager/data-manager";
import { Category, categoryService } from "@/e-commerce";
import { DefaultPanelLayout } from "@/layouts";
import { ServiceFactory } from "@/services/service-factory";
import { ColumnDef } from "@tanstack/react-table";

// 1. Interfaces
interface ExampleData {
  id: number;
  name: string;
  status: string;
  category_id: number;
  category?: Category;
}

// 2. Service
// (Ideally this is in a separate file)
const ExampleDataService = new ServiceFactory<ExampleData>({
  endpoint: "/arkenstone-tests",
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
  { accessorKey: "status", header: "Status" },
  { accessorKey: "category.name", header: "Category" },
];

export default function EmployeePage() {
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
      <DefaultPanelLayout>
        <DataManager<ExampleData>
        config={{
          title: "Example Data Manager",
          description: "Manage example data entries",
          service: ExampleDataService,
          layout: "modal", // Try 'modal' to see the difference instantly
          modalSize: "full",
          devMode: true,

          display: {
            type: "table",
            columns: exampleColumns,
            searchKeys: ["name", "status"],
          },

          form: {
            fields: [
              {
                name: "name",
                label: "Full Name",
                type: "text",
                validation: { required: true, min: 2 },
              },
              {
                name: "status",
                label: "Status",
                type: "select",
                validation: { required: true, min: 5 },
                options: [
                  { value: 0, label: "Active" },
                  { value: 1, label: "Inactive" },
                ],
              }, {
                name: "category_id",
                label: "Category",
                type: "select",
                validation: { required: true },
                fetchOptions() {
                  const categories = categoryService.getAll()
                  return categories.then((res) => res?.data?.map((category : Category ) => ({
                    value: category.id,
                    label: category.name,
                  })));
                },
                currentDataLoadConfig: {
                  transform(data) {
                    return data.category_id
                  },
                },
                enableDefaultOption: true,
                defaultOption: {
                  value: 0,
                  label: "Select Category",
                },
              },
            ],
          },
        }}
      />
      </DefaultPanelLayout>
    </Arkenstone>
  );
}
