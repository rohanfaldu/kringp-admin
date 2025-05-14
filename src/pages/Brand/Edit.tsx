import { useEffect, useState } from 'react';
import Preloader from "../../components/common/Preloader";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Brand } from "../../Types/Brand";
import { FetchData } from "../../utils/FetchData";
import { useNavigate, useSearchParams } from 'react-router-dom';
import InputField from "../../components/form/input/InputField";
import Select from "../../components/form/select/Select"
import Button from '../../components/ui/button/Button';
export default function EditCountry() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [country, setCountry] = useState<Brand>({
        id: '',
        name: '',
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
                    const result = await FetchData<Brand>(`/brand-type/get/${id}`, 'GET');
                    console.log(result, 'result')
                    if (result.status) {
                        setCountry(result.data);  // Set the single country data
                    } else {
                        throw new Error(result.message || 'Failed to fetch Brand');
                    }
                } catch (error) {
                    console.error("Failed to fetch Brand:", error);
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
                    status: country.status,
                }
            }else{
                perameter = {
                    name: country.name,
                    status: country.status,
                }
            }
            const endpoint = id ? `/brand-type/edit/${id}` : '/brand-type/create';
            const method = id ? 'POST' : 'POST';
            const result = await FetchData(endpoint, method, perameter);
            console.log(country, ">>>>>>>>>>>> Brand");
            if (result.status) {
                navigate('/brand');
            }
        } catch (error) {
            console.error('Error saving Brand:', error);
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
                title={id ? "Edit Brand" : "Add Brand"}
                description={id ? "Edit Brand Details" : "Add New Brand"}
            />
            <PageBreadcrumb pageTitle={id ? "Edit Brand" : "Add Brand"} />
            <div className="space-y-6">
                <ComponentCard title={id ? "Edit Brand" : "Add Brand"}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputField
                                label="Brand Name"
                                type="text"
                                value={country.name}
                                onChange={(e) => setCountry({ ...country, name: e.target.value })}
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
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </>
    );
}