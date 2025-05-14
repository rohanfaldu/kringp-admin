import { useEffect, useState, useRef } from 'react';
import Preloader from "../../components/common/Preloader";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { City } from "../../Types/City";
import { FetchData } from "../../utils/FetchData";
import { FetchImageData } from "../../utils/FetchImageData";
import { useNavigate, useSearchParams } from 'react-router-dom';
import InputField from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import Select from "../../components/form/select/Select"
import Button from '../../components/ui/button/Button';
import { State, StateResponse } from '../../Types/State';
import { Categories } from '../../Types/Category';
import { getImageName } from '../../components/common/Function';
export default function EditCategory() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const [category, setCategory] = useState<Categories>({
        id: '',
        name: '',
        image: '',
        status: true,
        createsAt: new Date(),
        updatedAt: new Date()
    });
    // console.log(state, ">>>>>>>>>>>> setState");

    const [loading, setLoading] = useState(id ? true : false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [states, setStates] = useState<State[]>([]);
    const [fileName, setFileName] = useState<string>("");
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

                        const result = await FetchData<any>(`/categories/get/${id}`, 'GET');

                        if (result && result.status) {
                            const categoryData = result.data;

                            if (categoryData) {
                                console.log(categoryData.image, 'Image')
                                setCategory({
                                    id: categoryData.id || '',
                                    name: categoryData.name || '',
                                    image: categoryData.image || '',
                                    status: categoryData.status !== undefined ? categoryData.status : true,
                                    createsAt: categoryData.createdAt ? new Date(categoryData.createdAt) : new Date(),
                                    updatedAt: categoryData.updatedAt ? new Date(categoryData.updatedAt) : new Date()
                                });
                            } else {
                                console.error("No data found in the response");
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
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let imageURL = category.image; // Default to existing image if editing

            const file = fileInputRef.current?.files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append("images", file);

                const addImage = await FetchImageData("/upload/image", "POST", formData, {}, true);
                if (!addImage.status || !addImage.data || !addImage.data[0].url) {
                    throw new Error("Image upload failed");
                }

                imageURL = addImage.data[0].url;
            }

            const parameter = {
                name: category.name,
                image: imageURL,
                status: category.status,
            };

            const endpoint = id ? `/categories/edit/${id}` : '/categories/create';
            const method = 'POST';
            const result = await FetchData(endpoint, method, parameter);

            if (result.status) {
                navigate('/category');
            }

        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    if (loading) {
        return <Preloader />;
    }

    const handleStatusChange = (value: string) => {
        console.log(value, '>>>>> value')
        setCategory({ ...category, status: value === 'true' });
    };


    return (
        <>
            <PageMeta
                title={id ? "Edit Category" : "Add Category"}
                description={id ? "Edit Category Details" : "Add New Category"}
            />
            <PageBreadcrumb pageTitle={id ? "Edit Category" : "Add Category"} />
            <div className="space-y-6">
                <ComponentCard title={id ? "Edit Category" : "Add Category"}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputField
                                label="Category Name"
                                type="text"
                                value={category.name}
                                onChange={(e) => setCategory({ ...category, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <FileInput
                                label="Category Image"
                                ref={fileInputRef}
                                fileName={ (category.image)?getImageName(category.image):''}
                                onChange={(e) => {
                                    setCategory({ ...category, image: category.image });
                                }}

                            />
                            {/* <Select
                                label="State"
                                required={true}
                                options={states.map((state) => ({
                                    label: state.name,
                                    value: state.id
                                }))}
                                onChange={handlStateChange}
                                defaultValue={category.stateId ? category.stateId : 'Select state'}
                            /> */}
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
                                defaultValue={category.status ? 'true' : 'false'}
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