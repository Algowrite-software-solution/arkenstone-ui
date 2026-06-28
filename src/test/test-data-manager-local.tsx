import { useState, useEffect } from 'react'
import { Arkenstone } from '../lib/components/arkestone'
import { DataManager } from '../lib/components/data-manager/data-manager'
import { ServiceFactory } from '../lib/services/service-factory'
import { ColumnDef } from '@tanstack/react-table'

// =========================================================================
// TAB 1: Static Posts Setup
// =========================================================================
interface ExampleData {
  id: number;
  title: string;
  body: string;
}

const ExampleDataService = new ServiceFactory<ExampleData>({
  endpoint: "https://jsonplaceholder.typicode.com/posts",
  entityName: "ExampleData",
  store: {
    initialState: { list: [], selected: null, loading: false },
    persistName: "example-mock-store",
  },
  syncWithStore: true,
});

ExampleDataService.getAll = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  ExampleDataService.useStore.setState({ list: data });
  return data;
};

ExampleDataService.create = async (data: any) => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const newItem = await response.json();
  newItem.id = Date.now();
  
  const currentList = ExampleDataService.useStore.getState().list;
  ExampleDataService.useStore.setState({ list: [newItem, ...currentList] });
  return newItem;
};

ExampleDataService.update = async (id: string | number, data: any) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const updatedItem = await response.json();
  
  const currentList = ExampleDataService.useStore.getState().list;
  const updatedList = currentList.map((item: ExampleData) =>
    item.id === Number(id) ? { ...item, ...data } : item
  );
  ExampleDataService.useStore.setState({ list: updatedList });
  return updatedItem;
};

ExampleDataService.delete = async (id: string | number) => {
  await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "DELETE",
  });
  
  const currentList = ExampleDataService.useStore.getState().list;
  const filteredList = currentList.filter((item: ExampleData) => item.id !== Number(id));
  ExampleDataService.useStore.setState({ list: filteredList });
  return { success: true };
};

const postColumns: ColumnDef<ExampleData>[] = [
  { accessorKey: "id", header: "ID", enableSorting: true },
  { accessorKey: "title", header: "Title", enableSorting: true },
  { accessorKey: "body", header: "Body" },
];

// =========================================================================
// TAB 2: Dynamic Random Users Setup
// =========================================================================
interface RandomUserData {
  id: string; // Satisfies <T extends { id: string | number }> constraint
  uuid: string;
  name: string;
  email: string;
  phone: string;
  thumbnail: string;
}

const RandomUserService = new ServiceFactory<RandomUserData>({
  endpoint: "https://randomuser.me/api/",
  entityName: "RandomUser",
  store: {
    initialState: { list: [], selected: null, loading: false },
    persistName: "random-user-mock-store",
  },
  syncWithStore: true,
});

RandomUserService.getAll = async () => {
  // Fetch 15 completely random users each time
  const response = await fetch("https://randomuser.me/api/?results=15");
  const data = await response.json();
  const mappedUsers = data.results.map((user: any) => ({
    id: user.login.uuid,
    uuid: user.login.uuid,
    name: `${user.name.first} ${user.name.last}`,
    email: user.email,
    phone: user.phone,
    thumbnail: user.picture.thumbnail,
  }));
  RandomUserService.useStore.setState({ list: mappedUsers });
  return mappedUsers;
};

RandomUserService.create = async (data: any) => {
  const generatedId = Math.random().toString(36).substring(2, 11);
  const newItem: RandomUserData = {
    id: generatedId,
    uuid: generatedId,
    thumbnail: "https://randomuser.me/api/portraits/thumb/men/1.jpg",
    name: data.name || "New User",
    email: data.email || "new.user@example.com",
    phone: data.phone || "000-000-0000",
  };
  const currentList = RandomUserService.useStore.getState().list;
  RandomUserService.useStore.setState({ list: [newItem, ...currentList] });
  return newItem;
};

RandomUserService.update = async (uuid: string | number, data: any) => {
  const currentList = RandomUserService.useStore.getState().list;
  const updatedList = currentList.map((item: RandomUserData) =>
    item.uuid === uuid ? { ...item, ...data } : item
  );
  RandomUserService.useStore.setState({ list: updatedList });
  return { id: String(uuid), uuid: String(uuid), ...data };
};

RandomUserService.delete = async (uuid: string | number) => {
  const currentList = RandomUserService.useStore.getState().list;
  const filteredList = currentList.filter((item: RandomUserData) => item.uuid !== uuid);
  RandomUserService.useStore.setState({ list: filteredList });
  return { success: true };
};

const userColumns: ColumnDef<RandomUserData>[] = [
  {
    accessorKey: "thumbnail",
    header: "Avatar",
    cell: ({ getValue }) => (
      <img
        src={getValue<string>()}
        alt="User thumbnail"
        className="w-8 h-8 rounded-full border border-border bg-muted"
      />
    )
  },
  { accessorKey: "name", header: "Name", enableSorting: true },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
];


// =========================================================================
// MAIN PREVIEW COMPONENT
// =========================================================================
export function TestDataManagerLocal() {
  const [currentPath, setCurrentPath] = useState(() => window.location.hash || '#/posts');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/posts');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <Arkenstone>
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Arkenstone Data Manager Preview</h1>
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-border pb-2">
          <button
            onClick={() => window.location.hash = '#/posts'}
            className={`px-4 py-2 font-medium text-sm rounded-t-md transition-colors cursor-pointer ${
              currentPath === '#/posts'
                ? 'border-b-2 border-primary text-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Posts (Static API)
          </button>
          <button
            onClick={() => window.location.hash = '#/users'}
            className={`px-4 py-2 font-medium text-sm rounded-t-md transition-colors cursor-pointer ${
              currentPath === '#/users'
                ? 'border-b-2 border-primary text-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Random Users (Dynamic API)
          </button>
          <button
            onClick={() => window.location.hash = '#/other'}
            className={`px-4 py-2 font-medium text-sm rounded-t-md transition-colors cursor-pointer ${
              currentPath === '#/other'
                ? 'border-b-2 border-primary text-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Other Page
          </button>
        </div>

        {/* Tab 1: Posts */}
        {currentPath === '#/posts' && (
          <>
            <p className="text-muted-foreground">
              Click on headers (ID, Title) to sort the table dynamically.
            </p>

            <DataManager<ExampleData>
              config={{
                title: "Posts",
                description: "A table view of posts with built-in search, filtering, pagination, and sorting support.",
                service: ExampleDataService,
                layout: "modal",
                modalSize: "lg",
                devMode: true,
                display: {
                  type: "table",
                  columns: postColumns,
                  searchKeys: ["title", "body"],
                  pagination: {
                    pageSizeOptions: [10, 20, 30],
                  },
                  bulkActions: {
                    enabled: true,
                    identifierKey: "id",
                    actions: [
                      {
                        label: "Print Titles",
                        variant: "outline",
                        onClick: (ids, items) => {
                          alert(`Selected titles: ${items.map(item => item.title).join(", ")}`);
                        }
                      }
                    ]
                  },
                },
                form: {
                  fields: [
                    {
                      name: "title",
                      label: "Title",
                      type: "text",
                      validation: { required: true },
                    },
                    {
                      name: "body",
                      label: "Body",
                      type: "textarea",
                      validation: { required: true },
                    },
                  ],
                },
              }}
            />
          </>
        )}

        {/* Tab 2: Random Users */}
        {currentPath === '#/users' && (
          <>
            <p className="text-muted-foreground">
              This dataset is fully dynamic. Click the refresh button in the header—every single reload queries randomuser.me and returns completely different records.
            </p>

            <DataManager<RandomUserData>
              config={{
                title: "Random Users",
                description: "Tests bulk actions, filters, and rendering using login.uuid as the identifierKey.",
                service: RandomUserService,
                layout: "modal",
                modalSize: "lg",
                devMode: true,
                display: {
                  type: "table",
                  columns: userColumns,
                  searchKeys: ["name", "email"],
                  pagination: {
                    pageSizeOptions: [5, 10, 15],
                  },
                  bulkActions: {
                    enabled: true,
                    identifierKey: "uuid",
                    actions: [
                      {
                        label: "Alert Selected Email",
                        variant: "secondary",
                        onClick: (ids, items) => {
                          alert(`Selected Emails: ${items.map(u => u.email).join(", ")}`);
                        }
                      }
                    ]
                  },
                },
                form: {
                  fields: [
                    {
                      name: "name",
                      label: "Full Name",
                      type: "text",
                      validation: { required: true },
                    },
                    {
                      name: "email",
                      label: "Email",
                      type: "text",
                      validation: { required: true },
                    },
                    {
                      name: "phone",
                      label: "Phone Number",
                      type: "text",
                      validation: { required: true },
                    },
                  ],
                },
              }}
            />
          </>
        )}

        {/* Tab 3: Other Page */}
        {currentPath === '#/other' && (
          <div className="p-12 border border-dashed rounded-lg bg-card text-center space-y-3">
            <h2 className="text-xl font-bold">Other Page</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              You navigated to the URL `#/other`. The active DataManager component has been unmounted.
            </p>
            <p className="text-sm text-primary font-medium">
              Click either "Posts" or "Random Users" tab above to go back and verify state persistence.
            </p>
          </div>
        )}
      </div>
    </Arkenstone>
  );
}
