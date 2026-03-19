# Table Components

Data table components built with TanStack Table for flexible and powerful data display.

---

## Import

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/lib/components/ui/table';
```

---

## Basic Table

```tsx
<Table>
  <TableCaption>List of products</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Price</TableHead>
      <TableHead>Category</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {products.map((product) => (
      <TableRow key={product.id}>
        <TableCell>{product.name}</TableCell>
        <TableCell>${product.price}</TableCell>
        <TableCell>{product.category}</TableCell>
      </TableRow>
    ))}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell>Total</TableCell>
      <TableCell colSpan={2}>$1,234.56</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

---

## Table with Sorting

```tsx
import {
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  useReactTable,
} from '@tanstack/react-table';

function DataTable({ data, columns }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Filter Input */}
      <Input
        placeholder="Search..."
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getIsSorted() === 'asc' && ' ↑'}
                  {header.column.getIsSorted() === 'desc' && ' ↓'}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
```

---

## Column Definition

```tsx
const columns = [
  {
    accessorKey: 'name',
    header: 'Product Name',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'price',
    header: () => 'Price',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price);
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        onClick={() => console.log(row.original)}
      >
        View
      </Button>
    ),
  },
];
```

---

## Styling Table Cells

```tsx
<TableCell className="text-right">
  {/* Right-aligned content */}
</TableCell>

<TableCell className="font-medium">
  {/* Emphasized content */}
</TableCell>
```

---

## Responsive Tables

Wrap in a scrollable container:

```tsx
<div className="w-full overflow-auto">
  <Table>
    {/* Table content */}
  </Table>
</div>
```

---

## Related Components

For data management with built-in tables, see:
- [Data Manager](../data-management/data-manager.md)
