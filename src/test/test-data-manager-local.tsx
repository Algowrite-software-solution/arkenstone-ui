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
  { accessorKey: "body", header: "Body", meta: { hideOnMobile: true } },
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
  { accessorKey: "phone", header: "Phone", meta: { hideOnMobile: true } },
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
      <div className="px-0 py-4 sm:p-8 mx-auto space-y-6 w-full max-w-full overflow-x-hidden">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Arkenstone Data Manager Preview</h1>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-border pb-2">
          <button
            onClick={() => window.location.hash = '#/posts'}
            className={`px-4 py-2 font-medium text-sm rounded-t-md transition-colors cursor-pointer shrink-0 ${
              currentPath === '#/posts'
                ? 'border-b-2 border-primary text-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Posts (Static API)
          </button>
          <button
            onClick={() => window.location.hash = '#/users'}
            className={`px-4 py-2 font-medium text-sm rounded-t-md transition-colors cursor-pointer shrink-0 ${
              currentPath === '#/users'
                ? 'border-b-2 border-primary text-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Random Users (Dynamic API)
          </button>
          <button
            onClick={() => window.location.hash = '#/grid'}
            className={`px-4 py-2 font-medium text-sm rounded-t-md transition-colors cursor-pointer shrink-0 ${
              currentPath === '#/grid'
                ? 'border-b-2 border-primary text-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Grid View (Custom Layout)
          </button>
          <button
            onClick={() => window.location.hash = '#/other'}
            className={`px-4 py-2 font-medium text-sm rounded-t-md transition-colors cursor-pointer shrink-0 ${
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
                showDescriptionOnMobile: true,
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
                layout: "split-view",
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

        {/* Tab 3: Grid View */}
        {currentPath === '#/grid' && (
          <>
            <p className="text-muted-foreground">
              This layout showcases grid rendering of items with card layouts and custom header widgets. Hover over a card to trigger actions.
            </p>

            <DataManager<ExampleData>
              config={{
                title: "Featured Grid",
                description: "Grid layout mode with a stats header layout space injected above.",
                service: ExampleDataService,
                layout: "modal",
                modalSize: "md",
                devMode: true,
                display: {
                  type: "grid",
                  layoutSpaces: {
                    header: (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                        <div className="border border-border bg-card p-4 rounded-xl shadow-sm">
                          <span className="text-xs text-muted-foreground uppercase font-semibold">Total Cards</span>
                          <h4 className="text-2xl font-bold text-foreground">100</h4>
                        </div>
                        <div className="border border-border bg-card p-4 rounded-xl shadow-sm">
                          <span className="text-xs text-muted-foreground uppercase font-semibold">Active Posts</span>
                          <h4 className="text-2xl font-bold text-primary">85</h4>
                        </div>
                        <div className="border border-border bg-card p-4 rounded-xl shadow-sm">
                          <span className="text-xs text-muted-foreground uppercase font-semibold">Drafts</span>
                          <h4 className="text-2xl font-bold text-amber-500">15</h4>
                        </div>
                      </div>
                    )
                  },
                  renderItem: (item) => (
                    <div className="border border-border rounded-xl p-4 bg-card hover:shadow-md transition-all h-full flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Post #{item.id}</span>
                        <h3 className="font-bold text-foreground line-clamp-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{item.body}</p>
                      </div>
                      <div className="text-xs text-muted-foreground pt-2 border-t flex justify-between">
                        <span>Status: Active</span>
                        <span>Author: System</span>
                      </div>
                    </div>
                  )
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
                      label: "Content Body",
                      type: "textarea",
                      validation: { required: true },
                    },
                  ],
                },
              }}
            />
          </>
        )}

        {/* Tab 4: Other Page */}
        {currentPath === '#/other' && (
          <div className="p-6 sm:p-12 border border-dashed rounded-lg bg-card text-center space-y-3">
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
