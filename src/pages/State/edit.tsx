import { useEffect, useState } from 'react';
import Preloader from "../../components/common/Preloader";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { State } from "../../Types/State";
import { FetchData } from "../../utils/FetchData";
import { useNavigate, useSearchParams } from 'react-router-dom';
import InputField from "../../components/form/input/InputField";
import Select from "../../components/form/select/Select"
import { Country, CountryResponse } from "../../Types/Country";
import Button from '../../components/ui/button/Button';

export default function EditState() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const [state, setState] = useState<State>({
        id: '',
        name: '',
        countryId: '',
        status: true,
        createsAt: new Date(),
        updatedAt: new Date()
    });
    console.log(state, ">>>>>>>>>>>> setState");

    const [loading, setLoading] = useState(id ? true : false);
    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        try {
            const getcountryList = async () => {
                const getCountryResult = await FetchData<CountryResponse>('/country/getAll', 'POST', { page: 1, limit: 1000 });
                console.log(getCountryResult, 'result')
                if (getCountryResult.status) {
                    setCountries(getCountryResult.data.countries);
                } else {
                    throw new Error(getCountryResult.message || 'Failed to fetch countries');
                }
            }
            getcountryList();
            if (id) {
                const getStateById = async () => {
                    setLoading(true);
                    try {

                        const result = await FetchData<any>(`/state/get/${id}`, 'GET');

                        if (result && result.status) {
                            const stateData = result.data?.state || result.data;

                            if (stateData) {
                                setState({
                                    id: stateData.id || '',
                                    name: stateData.name || '',
                                    countryId: stateData.countryId?.name || stateData.countryId || '',
                                    status: stateData.status !== undefined ? stateData.status : true,
                                    createsAt: stateData.createdAt ? new Date(stateData.createdAt) : new Date(),
                                    updatedAt: stateData.updatedAt ? new Date(stateData.updatedAt) : new Date()
                                });
                            } else {
                                console.error("No state data found in the response");
                            }
                        } else {
                            throw new Error(result?.message || 'Failed to fetch state');
                        }
                    } catch (error) {
                        console.error("Failed to fetch state:", error);
                    } finally {
                        setLoading(false);
                    }
                };
                getStateById();
            }
        } catch (error) {
            console.error("Failed to fetch state:", error);
        }

    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(state, ">>>>>>>>>>stateData");
        try {
            let perameter = {};
            if(id){
                perameter = {
                    id: state.id,
                    name: state.name,
                    countryId: state.countryId,
                    status: state.status,
                }
            }else{
                perameter = {
                    name: state.name,
                    countryId: state.countryId,
                    status: state.status,
                }
            }
            const endpoint = id ? `/state/edit/${id}` : '/state/create';
            const method = id ? 'POST' : 'POST';
            const result = await FetchData(endpoint, method, perameter);
            console.log(state, ">>>>>>>>>>>> state");
            if (result.status) {
                navigate('/state');
            }
        } catch (error) {
            console.error('Error saving state:', error);
        }
    };
    if (loading) {
        return <Preloader />;
    }

    const handleStatusChange = (value: string) => {
        console.log(value,'>>>>> value')
        setState({ ...state, status: value === 'true' });
    };

     const handlCountryChange = (value: string) => {
        console.log(value,'>>>>> value')
        setState({ ...state, countryId: value });
    };

    return (
        <>
            <PageMeta
                title={id ? "Edit State" : "Add State"}
                description={id ? "Edit State Details" : "Add New State"}
            />
            <PageBreadcrumb pageTitle={id ? "Edit State" : "Add State"} />
            <div className="space-y-6">
                <ComponentCard title={id ? "Edit State" : "Add State"}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputField
                                label="State Name"
                                type="text"
                                value={state.name}
                                onChange={(e) => setState({ ...state, name: e.target.value })}
                            />
                        </div>
                        {/* <div>
                            <InputField
                                label="Country Name"
                                type="text"
                                value={state.countryName}
                            />
                        </div> */}
                        <div>
                            <Select
                                label="Country"
                                required={true}
                                options={countries.map((country) => ({
                                    label: country.name,
                                    value: country.id
                                }))}
                                onChange={handlCountryChange}
                                defaultValue={state.countryId ? state.countryId : 'Select Country'}
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
                                defaultValue={state.status ? 'true' : 'false'}
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