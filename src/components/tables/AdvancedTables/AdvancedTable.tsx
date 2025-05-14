import { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useNavigate } from 'react-router-dom';
import Button from "../../ui/button/Button";
import { ExportIcons } from "../../../icons";
import Preloader from "../../../components/common/Preloader";
// Generic table column definition
interface TableColumn<T> {
  header: string;
  accessorKey: string;
  cell?: (info: { getValue: () => any, row: { original: T } }) => React.ReactNode;
}

// Pagination interface
interface PaginationProps {
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}


interface AddButtonProps {
  label: string,
  slug: string
}

// Props for the AdvancedTable component
interface AdvancedTableProps<T> {
  addButton?: AddButtonProps | null,
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationProps | null;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
  // Optional custom search function
  searchFunction?: (item: T, searchTerm: string) => boolean;
}

// Add this helper function before the AdvancedTable component
const getValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => {
    return acc && acc[part] !== undefined ? acc[part] : '';
  }, obj);
};

function AdvancedTable<T extends Record<string, any>>({
  addButton = null,
  data,
  columns,
  loading = false,
  pagination = null,
  onPageChange,
  searchFunction
}: AdvancedTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageValue, setCurrentPageValue] = useState(1);
  //const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filteredData, setFilteredData] = useState<T[]>([]);
  const [paginatedData, setPaginatedData] = useState<T[]>([]);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  console.log(addButton, '>>>> addButton')
  // Default search function if not provided
  const defaultSearchFunction = (item: T, term: string) => {
    const searchString = term.toLowerCase();
    // Search across all string and number fields
    return Object.entries(item).some(([_, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        return String(value).toLowerCase().includes(searchString);
      }
      if (typeof value === 'object' && value !== null) {
        // Search in nested objects with basic properties
        return Object.entries(value).some(([_, nestedValue]) => {
          if (typeof nestedValue === 'string' || typeof nestedValue === 'number') {
            return String(nestedValue).toLowerCase().includes(searchString);
          }
          return false;
        });
      }
      return false;
    });
  };

  // Filter data when search term changes
  useEffect(() => {
    if (!data) return;

    if (searchTerm === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        searchFunction
          ? searchFunction(item, searchTerm)
          : defaultSearchFunction(item, searchTerm)
      );
      setFilteredData(filtered);
    }

    // Reset to first page when search changes
    // if (pagination) {
    //   onPageChange && onPageChange(1);
    // } else {
    //   setCurrentPage(1);
    // }
    //  setCurrentPage(pagination);
  }, [searchTerm, data, searchFunction]);

  // Handle pagination internally or externally
  useEffect(() => {
    if (pagination) {
      // With external pagination, we use the data as is
      setPaginatedData(data);
    } else {
      // With internal pagination, we slice the filtered data
      const startIndex = (currentPage - 1) * itemsPerPage;
      setPaginatedData(filteredData.slice(startIndex, startIndex + itemsPerPage));
    }
  }, [filteredData, currentPage, itemsPerPage, pagination, data]);

  // Calculate total pages for internal pagination
  const totalPages = pagination
    ? pagination.totalPages
    : Math.ceil(filteredData.length / itemsPerPage);

  // Get page numbers for pagination controls
  const getPageNumbers = (current: number, total: number) => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < total - 1) {
      rangeWithDots.push('...', total);
    } else if (total > 1) {
      rangeWithDots.push(total);
    }

    return rangeWithDots;
  };

  // Handle internal page change
  const handleInternalPageChange = (page: number) => {
    if (pagination && onPageChange) {
      onPageChange(page);
      setCurrentPageValue(page);
    } else {
      setCurrentPage(page);
      setCurrentPageValue(page);
    }
  };
  // if(addButton){
  const handleAdd = (slug: any) => {
    navigate(slug);
  };
  //}

  return (
    loading ? (
      <Preloader />
    ) : (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>

            <div className="flex justify-center items-center gap-4">
              {(addButton) && (
                <>
                  <div className="">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleAdd(addButton.slug)}
                    >
                      {addButton.label}
                    </Button>
                  </div>
                </>
              )}
              <div className="">
                <CSVLink
                  data={filteredData}
                  filename="table-data.csv"
                  className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm transition-colors dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                  <ExportIcons className="w-5 h-5" />
                </CSVLink>

              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
                      isHeader
                      className="px-5 py-3 font-bold text-gray-500 text-center uppercase text-theme-xs dark:text-gray-400"
                    >
                      {column.header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      // colSpan={columns.length} 
                      className="px-5 py-4 text-center text-gray-500"
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {columns.map((column, colIndex) => (
                        <TableCell
                          key={colIndex}
                          className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400"
                        >
                          {column.cell ? (
                            column.cell({
                              getValue: () => getValue(item, column.accessorKey),
                              row: { original: item }
                            })
                          ) : (
                            getValue(item, column.accessorKey)
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {pagination ? (
              `Showing ${((currentPageValue - 1) * pagination.limit) + 1} to ${Math.min(currentPageValue * pagination.limit, pagination.total)} of ${pagination.total} entries`
            ) : ""}
          </div>

          {totalPages > 0 && (
            <nav>
              <ul className="flex flex-wrap items-center gap-2">
                <li>
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={pagination ? currentPageValue === 1 : currentPage === 1}
                    onClick={() => handleInternalPageChange(pagination ? currentPageValue - 1 : currentPage - 1)}
                  >
                    Previous
                  </Button>
                </li>

                {getPageNumbers(
                  pagination ? currentPageValue : currentPage,
                  totalPages
                ).map((page, index) => (
                  <li key={index}>
                    {typeof page === 'number' ? (
                      <Button
                        size="sm"
                        variant={pagination ?
                          (currentPageValue === page ? 'primary' : 'outline') :
                          (currentPage === page ? 'primary' : 'outline')
                        }
                        onClick={() => handleInternalPageChange(page)}
                      >
                        {page}
                      </Button>
                    ) : (
                      <span className="px-3.5 py-2">...</span>
                    )}
                  </li>
                ))}

                <li>
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={pagination ?
                      currentPageValue === pagination.totalPages :
                      currentPage === totalPages
                    }
                    onClick={() => handleInternalPageChange(pagination ? currentPageValue + 1 : currentPage + 1)}
                  >
                    Next
                  </Button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    )
  );
}

export default AdvancedTable;