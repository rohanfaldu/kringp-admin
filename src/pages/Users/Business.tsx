import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AdvancedTable from "../../components/tables/AdvancedTables/AdvancedTable";
import { Business, BusinessUserResponse } from "../../Types/User";
import { Pagination } from "../../Types/Pagination";
import { FetchData } from "../../utils/FetchData";
import { authToken } from "../../utils/Auth";
import ConfirmPopup from "../../components/common/ConfirmPopup";

export default function BusinessList() {
    const [businessUser, setBusinessUser] = useState<Business[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const currentPage = 1;
    //const [rowsPerPage] = useState<number>(10);
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>("");
    const columns = [
        {
            header: 'Image',
            accessorKey: 'image',
            cell: (info: any) => (
                <div className="flex items-center justify-center">
                    {info.row.original.userImage ? (
                        <img
                            src={info.row.original.userImage ? info.row.original.userImage : '/images/icons/user-circle.svg'}
                            alt="Business"
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/icons/user-circle.svg'; // Fallback image
                            }}
                        />
                    ) : (
                        <img
                            src="/images/icons/user-circle.svg"
                            alt="Default"
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    )}
                </div>
            ),
        },
        {
            header: 'Name',
            accessorKey: 'name',
        },
        {
            header: 'Email Address',
            accessorKey: 'emailAddress',
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (info: any) => info.getValue() ? 'Active' : 'Inactive',
        },
        {
            header: 'Created At',
            accessorKey: 'createsAt',
            cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
        },
        {
            header: 'Actions',
            accessorKey: 'actions',
            cell: (info: any) => (
                <div className="flex items-center justify-center  gap-2">
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
        setDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        const getToken = authToken();
        if (!getToken) {
            console.error('No token found');
            return;
        }

        try {
            const response = await FetchData(
                '/user/delete',
                'DELETE',
                { id: deleteId },
                { 'Authorization': `Bearer ${getToken}` }
            );

            if (response.status) {
                toast.success("User Deleted Successfully!", {
                    style: {
                        backgroundColor: "#F0FDF4",
                        color: "#166534"
                    }
                });
                fetchUserBusiness(currentPage);
            } else {
                toast.error(response.message, {
                    style: {
                        backgroundColor: "#FEF2F2",
                        color: "#991B1B"
                    }
                });
            }
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error("Failed to delete user", {
                style: {
                    backgroundColor: "#FEF2F2",
                    color: "#991B1B"
                }
            });
        } finally {
            setIsConfirmOpen(false);
            setDeleteId("");
        }
    };

    const fetchUserBusiness = async (page: number) => {
        setLoading(true);
        try {
            const result = await FetchData<BusinessUserResponse>(
                '/user/getAllInfo',
                'POST',
                { page, limit: 10, type: "BUSINESS" }
            );
            if (result.status) {
                setBusinessUser(result.data.Users);
                setPagination({
                    total: result.data.pagination.total,
                    currentPage: result.data.pagination.page,
                    limit: result.data.pagination.limit,
                    totalPages: result.data.pagination.totalPages
                });
                //setCurrentPage(result.data.pagination.page);
            }
        } catch (error) {
            console.error("Failed to fetch countries:", error);
        } finally {
            setLoading(false);
        }
    } // Empty dependency array since it doesn't depend on any external values

    const handlePageChange = async (page: number) => {
        console.log("Page changed to:", page);
        setLoading(true);
        try {
            const result = await FetchData<BusinessUserResponse>(
                '/user/getAllInfo',
                'POST',
                { page, limit: 10, type: "BUSINESS" }
            );
            if (result.status) {
                setBusinessUser(result.data.Users);
                // setPagination({
                //     total: result.data.pagination.total,
                //     currentPage: result.data.pagination.page,
                //     limit: result.data.pagination.limit,
                //     totalPages: result.data.pagination.totalPages
                // });
                //setCurrentPage(result.data.pagination.page);
            }
        } catch (error) {
            console.error("Failed to fetch countries:", error);
        } finally {
            setLoading(false);
        }
    };

    const hasFetched = useRef(false);
    // Single useEffect with proper dependencies
    useEffect(() => {
        if (!hasFetched.current) {
            fetchUserBusiness(currentPage);
            hasFetched.current = true;
        }
    }, [currentPage]);

    const searchBusiness = (country: Business, searchTerm: string) => {
        const term = searchTerm.toLowerCase();
        return (
            (country.name && country.name.toLowerCase().includes(term)) ||
            (country.emailAddress && country.emailAddress.toLowerCase().includes(term)) ||
            (typeof country.status === 'boolean' &&
                (country.status ? 'active' : 'inactive').includes(term))
        );
    };

    return (
        <>
            <PageMeta title="Business List" description="Business List" />
            <PageBreadcrumb pageTitle="Business" />
            <div className="space-y-6">
                <ComponentCard title="Business List">
                    <AdvancedTable
                        data={businessUser}
                        columns={columns}
                        loading={loading}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        searchFunction={searchBusiness}
                    />
                </ComponentCard>
            </div>
            <ConfirmPopup
                isOpen={isConfirmOpen}
                message="Are you sure you want to delete this user?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
                title="Delete User"
                confirmText="Delete"
                cancelText="Cancel"
            />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                theme="light"
                closeButton={false}
                style={{ width: "auto" }}
                toastStyle={{
                    padding: "16px",
                    margin: "8px 0",
                    borderRadius: "8px",
                    boxShadow: "none",
                    minHeight: "auto"
                }}
            />
        </>
    );
}