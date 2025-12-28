import { Arkenstone } from "@/components";
import { DataManager } from "@/components/data-manager/data-manager";
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
            searchKeys: ["name", "description"],
          },

          form: {
            fields: [
              {
                name: "name",
                label: "Full Name",
                type: "text",
                validation: { required: true, min: 2 },
              },{
                name: "name",
                label: "Full Name",
                type: "text",
                validation: { required: true, min: 2 },
              },{
                name: "name",
                label: "Full Name",
                type: "text",
                validation: { required: true, min: 2 },
              },{
                name: "name",
                label: "Full Name",
                type: "text",
                validation: { required: true, min: 2 },
              },{
                name: "name",
                label: "Full Name",
                type: "text",
                validation: { required: true, min: 2 },
              },{
                name: "name",
                label: "Full Name",
                type: "text",
                validation: { required: true, min: 2 },
              },{
                name: "name",
                label: "Full Name",
                type: "text",
                validation: { required: true, min: 2 },
              },{
                name: "name",
                label: "Full Name",
                type: "text",
                validation: { required: true, min: 2 },
              },{
                name: "name",
                label: "Full Name",
                type: "text",
                validation: { required: true, min: 2 },
              },{
                name: "name",
                label: "Full Name",
                type: "text",
                validation: { required: true, min: 2 },
              },
              {
                name: "description",
                label: "Description",
                type: "text",
                validation: { required: true, min: 5 },
              }, {
                name: "boolean_value",
                label: "Boolean Field",
                type: "checkbox",
                validation: { required: true },
              },
              {
                name: "selected_item_id",
                label: "Select Item",
                type: "select",
                options: [
                  {
                    label: "Option 1",
                    value: "1"
                  },
                  {
                    label: "Option 2",
                    value: "2"
                  }
                ]
              },
               {
                name: "image",
                label: "Image",
                type: "image",
                validation: { required: true },
              },
            ],
          },
        }}
      />
      </DefaultPanelLayout>
    </Arkenstone>
  );
}
