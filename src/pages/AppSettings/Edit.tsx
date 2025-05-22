import { useEffect, useState } from 'react';
import Preloader from "../../components/common/Preloader";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { AppSetting } from "../../Types/AppSettings";
import { FetchData } from "../../utils/FetchData";
import { useNavigate, useSearchParams } from 'react-router-dom';
import InputField from "../../components/form/input/InputField";
// import Select from "../../components/form/select/Select"
import Button from '../../components/ui/button/Button';
export default function EditCountry() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [country, setCountry] = useState<AppSetting>({
        id: '',
        title: '',
        slug: '',
        value: '',
        createdAt: new Date(),
        updatedAt: new Date()
    });
    const [loading, setLoading] = useState(id ? true : false);

    useEffect(() => {
        if (id) {
            const getSpecificCountries = async () => {
                setLoading(true);
                try {
                    const result = await FetchData<AppSetting>(`/app-data/get/${id}`, 'GET');
                    console.log(result, 'result')
                    if (result.status) {
                        setCountry(result.data);  // Set the single country data
                    } else {
                        throw new Error(result.message || 'Failed to fetch App Setting Data');
                    }
                } catch (error) {
                    console.error("Failed to fetch App Setting Data:", error);
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
                    title: country.title,
                    value: country.value,
                }
            }else{
                perameter = {
                    title: country.title,
                    value: country.value,
                }
            }
            const endpoint = id ? `/app-data/edit/${id}` : '/app-data/create';
            const method = id ? 'POST' : 'POST';
            const result = await FetchData(endpoint, method, perameter);
            console.log(country, ">>>>>>>>>>>> Brand");
            if (result.status) {
                navigate('/app-settings');
            }
        } catch (error) {
            console.error('Error saving App Setting Data:', error);
        }
    };

    if (loading) {
        return <Preloader />;
    }

    // const handleStatusChange = (value: string) => {
    //     setCountry({...country, value: value === 'true'});
    // };

    return (
        <>
            <PageMeta
                title={id ? "Edit App Setting Data" : "Add App Setting Data"}
                description={id ? "Edit App Setting Details" : "Add New App Setting Data"}
            />
            <PageBreadcrumb pageTitle={id ? "Edit App Setting " : "Add App Setting "} />
            <div className="space-y-6">
                <ComponentCard title={id ? "Edit App Setting " : "Add App Setting "}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputField
                                label="App Setting title"
                                type="text"
                                value={country.title}
                                onChange={(e) => setCountry({ ...country, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <InputField
                                label="App Setting Value"
                                type="text"
                                value={country.value}
                                onChange={(e) => setCountry({ ...country, value: e.target.value })}
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