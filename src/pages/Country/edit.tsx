import { useEffect, useState } from 'react';
import Preloader from "../../components/common/Preloader";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Country } from "../../Types/Country";
import { FetchData } from "../../utils/FetchData";
import { useNavigate, useSearchParams } from 'react-router-dom';
import InputField from "../../components/form/input/InputField";
import Select from "../../components/form/select/Select"
import Button from '../../components/ui/button/Button';
export default function EditCountry() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [country, setCountry] = useState<Country>({
        id: '',
        name: '',
        countryCode: '',
        status: true,
        createsAt: new Date(),
        updatedAt: new Date()
    });
    const [loading, setLoading] = useState(id ? true : false);

    useEffect(() => {
        if (id) {
            const getSpecificCountries = async () => {
                setLoading(true);
                try {
                    const result = await FetchData<Country>(`/country/get/${id}`, 'GET');
                    console.log(result, 'result')
                    if (result.status) {
                        setCountry(result.data);  // Set the single country data
                    } else {
                        throw new Error(result.message || 'Failed to fetch country');
                    }
                } catch (error) {
                    console.error("Failed to fetch country:", error);
                } finally {
                    setLoading(false);
                }
            };
            getSpecificCountries();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let perameter = {};
            if(id){
                perameter = {
                    id: country.id,
                    name: country.name,
                    countryCode:country.countryCode,
                    status: country.status,
                }
            }else{
                perameter = {
                    name: country.name,
                    countryCode:country.countryCode,
                    status: country.status,
                }
            }
            const endpoint = id ? `/country/edit/${id}` : '/country/create';
            const method = id ? 'POST' : 'POST';
            const result = await FetchData(endpoint, method, perameter);
            console.log(country, ">>>>>>>>>>>> Country");
            if (result.status) {
                navigate('/country');
            }
        } catch (error) {
            console.error('Error saving country:', error);
        }
    };

    if (loading) {
        return <Preloader />;
    }

    const handleStatusChange = (value: string) => {
        setCountry({...country, status: value === 'true'});
    };

    return (
        <>
            <PageMeta
                title={id ? "Edit Country" : "Add Country"}
                description={id ? "Edit Country Details" : "Add New Country"}
            />
            <PageBreadcrumb pageTitle={id ? "Edit Country" : "Add Country"} />
            <div className="space-y-6">
                <ComponentCard title={id ? "Edit Country" : "Add Country"}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputField
                                label="Country Name"
                                type="text"
                                value={country.name}
                                onChange={(e) => setCountry({ ...country, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <InputField
                                label="Country Code"
                                type="text"
                                value={country.countryCode}
                                onChange={(e) => setCountry({ ...country, countryCode: e.target.value })}
                            />
                        </div>
                        <div>
                            <Select
                                label="Status"
                                required={true}
                                options={[
                                    { value: 'true', label: 'Active' },
                                    { value: 'false', label: 'Inactive' }
                                ]}
                                onChange={handleStatusChange}
                                defaultValue={country.status ? 'true' : 'false'}
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                variant="primary"
                                type="submit"
                            >
                                Save Changes
                            </Button>
                            {/* <button
                                type="button"
                                onClick={() => navigate(-1)}  // Use navigate(-1) instead of router.back()
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-gray bg-primary border border-transparent rounded-md hover:bg-primary-dark"
                            >
                                Save Changes
                            </button> */}
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </>
    );
}