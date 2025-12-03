import { DataManager } from '@/components/data-manager/data-manager';
import { ServiceFactory } from '@/services/service-factory';
import { ColumnDef } from '@tanstack/react-table';

// 1. Interfaces
interface Employee {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    departmentId?: string;
}

// 2. Service
// (Ideally this is in a separate file)
const EmployeeService = new ServiceFactory<Employee>({
    endpoint: '/employees',
    entityName: 'Employee',
    store: {
        initialState: { list: [], selected: null, loading: false },
        persistName: 'employees-store'
    }
});

// 3. Configuration
const employeeColumns: ColumnDef<Employee>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Full Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role' },
];

export default function EmployeePage() {
    return (
        <DataManager<Employee> 
            config={{
                title: "Employee Directory",
                description: "Manage system users and roles",
                service: EmployeeService,
                layout: 'split-view', // Try 'modal' to see the difference instantly
                devMode: true,
                
                display: {
                    type: 'table',
                    columns: employeeColumns,
                    searchKeys: ['name', 'email']
                },
                
                form: {
                    fields: [
                        { 
                            name: 'name', 
                            label: 'Full Name', 
                            type: 'text', 
                            validation: { required: true, min: 2 } 
                        },
                        { 
                            name: 'email', 
                            label: 'Email Address', 
                            type: 'email', 
                            validation: { required: true, pattern: /\S+@\S+\.\S+/ } 
                        },
                        { 
                            name: 'role', 
                            label: 'Job Role', 
                            type: 'select', 
                            options: [
                                { label: 'Developer', value: 'dev' },
                                { label: 'Manager', value: 'manager' },
                                { label: 'Designer', value: 'designer' },
                            ] 
                        },
                        { 
                            name: 'departmentId', 
                            label: 'Department', 
                            type: 'select',
                            // Dynamically fetch options from another API
                            fetchOptions: async () => {
                                // Simulate API call
                                await new Promise(r => setTimeout(r, 500)); 
                                return [
                                    { label: 'Engineering', value: 1 },
                                    { label: 'HR', value: 2 }
                                ];
                            } 
                        },
                        {
                            name: 'bio',
                            label: 'Biography',
                            type: 'textarea',
                            validation: { max: 500 }
                        },
                        {
                            name: 'isActive',
                            label: 'Active Account',
                            type: 'checkbox',
                            defaultValue: true
                        },
                        {
                            name: 'avatar',
                            label: 'Profile Picture',
                            type: 'image',
                            uploadEndpoint: '/api/upload' // Optional auto-upload
                        }
                    ]
                }
            }}
        />
    );
}