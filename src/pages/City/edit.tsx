import { useEffect, useState } from 'react';
import Preloader from "../../components/common/Preloader";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { City } from "../../Types/City";
import { FetchData } from "../../utils/FetchData";
import { useNavigate, useSearchParams } from 'react-router-dom';
import InputField from "../../components/form/input/InputField";
import Select from "../../components/form/select/Select"
import Button from '../../components/ui/button/Button';
import { State, StateResponse } from '../../Types/State';

export default function EditState() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const [city, setState] = useState<City>({
        id: '',
        name: '',
        stateId: '',
        status: true,
        createsAt: new Date(),
        updatedAt: new Date()
    });
    // console.log(state, ">>>>>>>>>>>> setState");

    const [loading, setLoading] = useState(id ? true : false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [states, setStates] = useState<State[]>([]);

    useEffect(() => {
        try {
            const getstateList = async () => {
                const getStateResult = await FetchData<StateResponse>('/state/getAll', 'POST', { page: 1, limit: 1000 });
                if (getStateResult.status) {
                    setStates(getStateResult.data.items);
                } else {
                    throw new Error(getStateResult.message || 'Failed to fetch States');
                }
            }
            getstateList();
            
            if (id) {
                const getCityById = async () => {
                    setLoading(true);
                    try {

                        const result = await FetchData<any>(`/city/get/${id}`, 'GET');

                        if (result && result.status) {
                            const cityData = result.data?.city || result.data;

                            if (cityData) {
                                setState({
                                    id: cityData.id || '',
                                    name: cityData.name || '',
                                    stateId: cityData.stateId || city.stateId || '',
                                    status: cityData.status !== undefined ? cityData.status : true,
                                    createsAt: cityData.createdAt ? new Date(cityData.createdAt) : new Date(),
                                    updatedAt: cityData.updatedAt ? new Date(cityData.updatedAt) : new Date()
                                });
                            } else {
                                console.error("No city data found in the response");
                            }
                        } else {
                            throw new Error(result?.message || 'Failed to fetch city');
                        }
                    } catch (error) {
                        console.error("Failed to fetch city:", error);
                    } finally {
                        setLoading(false);
                    }
                };
                getCityById();
            }
        } catch (error) {
            console.error("Failed to fetch state:", error);
        }

    }, [id]);
    console.log(states, ">>>>>>>>>>>> states");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // console.log(city, ">>>>>>>>>>cityData");
        try {
            let perameter = {};
            if(id){
                perameter = {
                    id: city.id,
                    name: city.name,
                    stateId: city.stateId,
                    status: city.status,
                }
            }else{
                perameter = {
                    name: city.name,
                    stateId: city.stateId,
                    status: city.status,
                }
            }
            const endpoint = id ? `/city/edit/${id}` : '/city/create';
            const method = id ? 'POST' : 'POST';
            const result = await FetchData(endpoint, method, perameter);
            console.log(city, ">>>>>>>>>>>> city");
            if (result.status) {
                navigate('/city');
            }
        } catch (error) {
            console.error('Error saving city:', error);
        }
    };
    if (loading) {
        return <Preloader />;
    }

    const handleStatusChange = (value: string) => {
        console.log(value,'>>>>> value')
        setState({ ...city, status: value === 'true' });
    };

     const handlStateChange = (value: string) => {
        console.log(value,'>>>>> value')
        setState({ ...city, stateId: value });
    };

    return (
        <>
            <PageMeta
                title={id ? "Edit City" : "Add City"}
                description={id ? "Edit City Details" : "Add New City"}
            />
            <PageBreadcrumb pageTitle={id ? "Edit City" : "Add City"} />
            <div className="space-y-6">
                <ComponentCard title={id ? "Edit City" : "Add City"}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputField
                                label="City Name"
                                type="text"
                                value={city.name}
                                onChange={(e) => setState({ ...city, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Select
                                label="State"
                                required={true}
                                options={states.map((state) => ({
                                    label: state.name,
                                    value: state.id
                                }))}
                                onChange={handlStateChange}
                                defaultValue={city.stateId ? city.stateId : 'Select state'}
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
                                defaultValue={city.status ? 'true' : 'false'}
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
                            
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </>
    );
}