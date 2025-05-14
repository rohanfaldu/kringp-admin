import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AdvancedTable from "../../components/tables/AdvancedTables/AdvancedTable";
import { State, StateResponse } from "../../Types/State";
import { Pagination } from "../../Types/Pagination";
import Preloader from "../../components/common/Preloader";
import { FetchData } from "../../utils/FetchData";
import Button from '../../components/ui/button/Button';

export default function StateList() {
    const [states, setStates] = useState<State[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    const navigate = useNavigate();

    const handleEdit = (state: State) => {
        navigate(`/state/detail?id=${state.id}`);
    };

    const columns = [
        {
            header: 'Name',
            accessorKey: 'name',
        },
        {
            header: 'Country Name',
            accessorKey: 'countryKey',
            cell: (info: any) => {
                const countryKey = info.getValue();
                return countryKey?.name || 'Not Assigned';
            }
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (info: any) => info.getValue() ? 'Active' : 'Inactive',
        },
        {
            header: 'Created At',
            accessorKey: 'createsAt', // Fixed property name based on API response
            cell: (info: any) => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : 'N/A',
        },
        {
            header: 'Actions',
            accessorKey: 'actions',
            cell: (info: any) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => handleEdit(info.row.original)}
                        className="text-blue-500 hover:text-blue-700 relative group bg-blue-100 hover:bg-blue-200 p-2 rounded-lg dark:bg-blue-900/20 dark:hover:bg-blue-900/30 before:content-[attr(data-tooltip)] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:rounded-lg before:font-inter before:px-2 before:py-1 before:text-[0.6875rem] before:max-w-[300px] before:break-words before:font-medium before:bg-[#131920] before:text-white before:opacity-0 before:invisible hover:before:opacity-100 hover:before:visible before:transition-all before:duration-200 before:z-50 before:whitespace-nowrap before:mb-1"
                        data-tooltip="Edit"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" className="size-[18px]">
                            <path d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M16.04 3.02 8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M14.91 4.15a7.144 7.144 0 0 0 4.94 4.94" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </button>
                    <button
                        onClick={() => handleDelete(info.row.original.id)}
                        className="text-red-500 hover:text-red-700 relative group bg-red-100 hover:bg-red-200 p-2 rounded-lg dark:bg-red-900/20 dark:hover:bg-red-900/30 before:content-[attr(data-tooltip)] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:rounded-lg before:font-inter before:px-2 before:py-1 before:text-[0.6875rem] before:max-w-[300px] before:break-words before:font-medium before:bg-[#131920] before:text-white before:opacity-0 before:invisible hover:before:opacity-100 hover:before:visible before:transition-all before:duration-200 before:z-50 before:whitespace-nowrap before:mb-1"
                        data-tooltip="Delete"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" className="size-[18px]">
                            <path d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            ),
        },
    ];

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this state?')) {
            try {
                const response = await fetch(`https://api.kringp.com/api/state/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    // Refresh the table data
                    fetchStates(currentPage, rowsPerPage);
                } else {
                    throw new Error('Failed to delete state');
                }
            } catch (error) {
                console.error('Error deleting state:', error);
            }
        }
    };

    const fetchStates = async (page: number, limit: number) => {
        setLoading(true);
        try {
            const result = await FetchData<StateResponse>('/state/getAll', 'POST', { page, limit });
            console.log('API response:', result);

            if (result && result.status) {
                // Check for items array based on your API response structure
                if (result.data && Array.isArray(result.data.items)) {
                    // Use items instead of states
                    setStates(result.data.items);

                    // Extract pagination information
                    if (result.data.pagination) {
                        setPagination({
                            total: result.data.pagination.total || 0,
                            currentPage: result.data.pagination.page || 1,
                            limit: result.data.pagination.limit || 10,
                            totalPages: result.data.pagination.totalPages || 1
                        });
                    } else {
                        setPagination({
                            total: result.data.items.length,
                            currentPage: page,
                            limit: limit,
                            totalPages: Math.ceil(result.data.items.length / limit)
                        });
                    }
                } else if (result.data && Array.isArray(result.data)) {
                    // Alternative case: if data is directly an array of states
                    setStates(result.data);
                    setPagination({
                        total: result.data.length,
                        currentPage: page,
                        limit: limit,
                        totalPages: Math.ceil(result.data.length / limit)
                    });
                } else {
                    console.error("Unexpected data structure:", result.data);
                    setStates([]);
                }
            } else {
                console.error("API returned error:", result?.message || "Unknown error");
                setStates([]);
            }
        } catch (error) {
            console.error("Failed to fetch states:", error);
            setStates([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStates(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (limit: number) => {
        setRowsPerPage(limit);
        setCurrentPage(1); // Reset to first page when changing limit
    };

    // Custom search function to filter states
    const searchStates = (state: State, searchTerm: string) => {
        const term = searchTerm.toLowerCase();
        return (
            (state.name && state.name.toLowerCase().includes(term)) ||
            // (state.countryKey.name && state.countryKey.name.toLowerCase().includes(term)) ||
            (state.countryId && state.countryId.toLowerCase().includes(term)) ||
            (typeof state.status === 'boolean' &&
                (state.status ? 'active' : 'inactive').includes(term))
        );
    };

    if (loading) {
        return <Preloader />;
    }

    const handleAdd = () => {
        navigate('/state/detail');
    };

    return (
        <>
            <PageMeta title="States List" description="States List" />
            <PageBreadcrumb pageTitle="States" />
            <div className="space-y-6">
                <ComponentCard title="State List">
                    <div className="mb-4">
                        {/* <button
                            onClick={handleAdd}
                            className="px-4 py-2 text-sm font-medium text-red bg-primary border border-transparent rounded-md hover:bg-primary-dark"
                        >
                            Add State
                        </button> */}
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={handleAdd}
                        >
                            Add State
                        </Button>
                    </div>
                    <AdvancedTable
                        data={states}
                        columns={columns}
                        loading={loading}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        searchFunction={searchStates}
                    />
                </ComponentCard>
            </div>
        </>
    );
}