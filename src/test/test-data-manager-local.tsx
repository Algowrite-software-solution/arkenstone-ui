import { useState, useEffect } from 'react'
import { Arkenstone } from '../lib/components/arkestone'
import { DataManager } from '../lib/components/data-manager/data-manager'
import { ServiceFactory } from '../lib/services/service-factory'
import { ColumnDef } from '@tanstack/react-table'
import { Star, Heart } from 'lucide-react'

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
  { accessorKey: "title", header: "Title", enableSorting: true, enableHiding: false },
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
            Posts (Static API - Default Search)
          </button>
          <button
            onClick={() => window.location.hash = '#/users'}
            className={`px-4 py-2 font-medium text-sm rounded-t-md transition-colors cursor-pointer shrink-0 ${
              currentPath === '#/users'
                ? 'border-b-2 border-primary text-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Random Users (Dynamic API - No Global Search)
          </button>
          <button
            onClick={() => window.location.hash = '#/only-global'}
            className={`px-4 py-2 font-medium text-sm rounded-t-md transition-colors cursor-pointer shrink-0 ${
              currentPath === '#/only-global'
                ? 'border-b-2 border-primary text-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Global Search Only
          </button>
          <button
            onClick={() => window.location.hash = '#/force-mobile'}
            className={`px-4 py-2 font-medium text-sm rounded-t-md transition-colors cursor-pointer shrink-0 ${
              currentPath === '#/force-mobile'
                ? 'border-b-2 border-primary text-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Mobile Advanced Toggle
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
            onClick={() => window.location.hash = '#/list'}
            className={`px-4 py-2 font-medium text-sm rounded-t-md transition-colors cursor-pointer shrink-0 ${
              currentPath === '#/list'
                ? 'border-b-2 border-primary text-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            List View (Tab Layout)
          </button>
          <button
            onClick={() => window.location.hash = '#/resolve-data'}
            className={`px-4 py-2 font-medium text-sm rounded-t-md transition-colors cursor-pointer shrink-0 ${
              currentPath === '#/resolve-data'
                ? 'border-b-2 border-primary text-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Resolve Data (Async Loading)
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
              This table configures the <strong>"split-view"</strong> layout (opening the form in a side panel drawer). It enables advanced sorting, custom conditional actions (e.g. Liked conditional triggers), bulk actions, and table pagination sizing.
            </p>

            <DataManager<ExampleData>
              config={{
                title: "Posts",
                description: "A table view of posts with built-in search, filtering, pagination, and sorting support.",
                showDescriptionOnMobile: true,
                service: ExampleDataService,
                layout: "split-view",
                modalSize: "lg",
                devMode: true,
                display: {
                  type: "table",
                  columns: postColumns,
                  searchKeys: ["title", "body"],
                  pagination: {
                    pageSizeOptions: [10, 20, 30],
                  },
                  actions: {
                    view: true,
                    edit: true,
                    delete: true,
                    custom: [
                      {
                        label: "Alert Title",
                        icon: <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />,
                        onClick: (item, context) => {
                          alert(`Custom action for "${item.title}". Triggers a manual list refresh.`);
                          context.refresh();
                        }
                      },
                      {
                        label: "Like Post (Conditional)",
                        icon: <Heart className="h-4 w-4" />,
                        className: "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50",
                        hidden: (item) => item.id % 2 === 0, // Hidden for even ID posts
                        disabled: (item) => item.id % 3 === 0, // Disabled if ID is divisible by 3
                        onClick: (item, context) => {
                          alert(`Liked: "${item.title}". Opening edit modal as a custom secondary flow.`);
                          context.edit(item);
                        }
                      }
                    ]
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
              This table configures the <strong>"modal"</strong> layout and tests fetching fully dynamic data from randomuser.me. It uses custom renderers for user avatars, disables global search while keeping advanced individual column filters active (<code>disableGlobal: true</code>), and manages custom bulk actions.
            </p>

            <DataManager<RandomUserData>
              config={{
                title: "Random Users",
                description: "Tests bulk actions, filters, and rendering using login.uuid as the identifierKey.",
                service: RandomUserService,
                layout: "modal",
                devMode: true,
                display: {
                  type: "table",
                  columns: userColumns,
                  searchKeys: ["name", "email"],
                  searchOptions: {
                    disableGlobal: true,
                  },
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

        {/* Tab 2.1: Global Search Only */}
        {currentPath === '#/only-global' && (
          <>
            <p className="text-muted-foreground">
              This table configures the <strong>"modal"</strong> layout and demonstrates clean global search capabilities by disabling advanced individual column filters (<code>disableAdvanced: true</code>). Only the central global search input is visible.
            </p>

            <DataManager<ExampleData>
              config={{
                title: "Global Search Only",
                description: "Demonstrates disabling the individual column filters.",
                service: ExampleDataService,
                layout: "modal",
                modalSize: "lg",
                devMode: true,
                display: {
                  type: "table",
                  columns: postColumns,
                  searchKeys: ["title", "body"],
                  searchOptions: {
                    disableAdvanced: true,
                  },
                  pagination: {
                    pageSizeOptions: [10, 20, 30],
                  },
                  actions: {
                    view: true,
                    edit: true,
                    delete: true,
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

        {/* Tab 2.2: Mobile Advanced Toggle */}
        {currentPath === '#/force-mobile' && (
          <>
            <p className="text-muted-foreground">
              This table configures the <strong>"modal"</strong> layout and demonstrates custom search options on smaller screens. It forces the advanced search toggle button to remain visible on mobile viewports (<code>forceAdvancedVisibleOnMobile: true</code>).
            </p>

            <DataManager<ExampleData>
              config={{
                title: "Mobile Advanced Toggle",
                description: "Forces the advanced filter toggle button to show on mobile devices.",
                service: ExampleDataService,
                layout: "modal",
                modalSize: "lg",
                devMode: true,
                display: {
                  type: "table",
                  columns: postColumns,
                  searchKeys: ["title", "body"],
                  searchOptions: {
                    forceAdvancedVisibleOnMobile: true,
                  },
                  pagination: {
                    pageSizeOptions: [10, 20, 30],
                  },
                  actions: {
                    view: true,
                    edit: true,
                    delete: true,
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

        {/* Tab 3: Grid View */}
        {currentPath === '#/grid' && (
          <>
            <p className="text-muted-foreground">
              This view configures the <strong>"fullscreen"</strong> layout and demonstrates rendering data in a <strong>"grid"</strong> card view instead of a table. It showcases custom card elements (hover cards) and injects a custom KPI statistics header inside the <code>layoutSpaces.header</code> area.
            </p>

            <DataManager<ExampleData>
              config={{
                title: "Featured Grid",
                description: "Grid layout mode with a stats header layout space injected above.",
                service: ExampleDataService,
                layout: "fullscreen",
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

        {/* Tab 4: List View */}
        {currentPath === '#/list' && (
          <>
            <p className="text-muted-foreground">
              This view configures the <strong>"tab-view"</strong> layout and showcases standard vertical <strong>"list"</strong> item rendering. The viewer and editor open inside an elegant nested secondary sub-tab layout instead of a modal or drawer.
            </p>

            <DataManager<ExampleData>
              config={{
                title: "Standard List",
                description: "List layout mode demonstrating the tab-view detail panel.",
                service: ExampleDataService,
                layout: "tab-view",
                devMode: true,
                display: {
                  type: "list",
                  renderItem: (item) => (
                    <div className="border border-border rounded-xl p-4 bg-card hover:bg-muted/10 transition-colors flex items-center justify-between gap-4 w-full">
                      <div className="space-y-1 truncate flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full">ID #{item.id}</span>
                          <span className="text-xs text-muted-foreground">Category: Overview</span>
                        </div>
                        <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{item.body}</p>
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

        {/* Tab: Resolve Data */}
        {currentPath === '#/resolve-data' && (
          <>
            <p className="text-muted-foreground mb-4">
              This table configures the <strong>"modal"</strong> layout and demonstrates asynchronous data resolution (<code>resolveData</code>) before mounting the details view. Clicking edit/view on any row displays a loading spinner for 1.5s while it fetches rich detailed content on demand.
            </p>

            <DataManager<ExampleData>
              config={{
                title: "Posts (Async Resolve)",
                description: "Simulates fetching rich detailed body text on demand when editing or viewing a post.",
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
                  actions: {
                    view: {
                      enabled: true,
                      resolveData: async (item) => {
                        // Simulate delay
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        return {
                          ...item,
                          body: `[RESOLVED VIEW DETAILS] ${item.body}`,
                          isActive: item.id % 2 !== 0,
                          coverImageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400",
                          authorEmail: "writer.admin@arkenstone.io",
                          readingTimeMinutes: 5,
                          projectMetadata: {
                            category: "Developer Documentation",
                            tags: ["react", "data-manager", "tailwind"],
                            version: "v2.4"
                          },
                          resolvedAt: new Date().toISOString()
                        };
                      },
                      // Hide view action dynamically for even IDs
                      hidden: (item) => item.id % 2 === 0,
                    },
                    edit: {
                      enabled: true,
                      resolveData: async (item) => {
                        // Simulate delay
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        return {
                          ...item,
                          title: `${item.title} (RESOLVED FOR EDITING)`
                        };
                      },
                      // Disable edit action dynamically if ID is divisible by 3
                      disabled: (item) => item.id % 3 === 0,
                    },
                    delete: {
                      enabled: true,
                      // Hide delete action dynamically if ID is divisible by 5
                      hidden: (item) => item.id % 5 === 0,
                    }
                  },
                  viewModalConfig: {
                    title: "Post Inspection Profile",
                    description: "Detailed system record containing resolved content fields.",
                    fields: [
                      { name: "sec-system", label: "System Status & Meta", isSection: true },
                      { name: "id", label: "Post Identifier" },
                      { name: "isActive", label: "Is Published / Active" },
                      { name: "resolvedAt", label: "Date & Time Resolved" },

                      { name: "sec-content", label: "Core Content details", isSection: true },
                      { name: "title", label: "Structured Title", className: "bg-primary/5" },
                      { name: "body", label: "Resolved Content Body" },

                      { name: "sec-author", label: "Author Profile & Analytics", isSection: true },
                      { name: "coverImageUrl", label: "Featured Cover Image" },
                      { name: "authorEmail", label: "Author Contact Email" },
                      { name: "readingTimeMinutes", label: "Est. Reading Time" },
                      { name: "projectMetadata", label: "Nested JSON Metadata" }
                    ]
                  }
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

        {/* Tab 5: Other Page */}
        {currentPath === '#/other' && (
          <div className="p-6 sm:p-12 border border-dashed rounded-lg bg-card text-center space-y-3">
            <h2 className="text-xl font-bold">Other Page</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              You navigated to the URL `#/other`. The active DataManager component has been unmounted.
            </p>
            <p className="text-sm text-primary font-medium">
              Click one of the tabs above to go back and verify state persistence.
            </p>
          </div>
        )}
      </div>
    </Arkenstone>
  );
}
