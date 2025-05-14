import { useEffect, useState, useRef } from 'react';
import Preloader from "../../components/common/Preloader";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { FetchData } from "../../utils/FetchData";
import { FetchImageData } from "../../utils/FetchImageData";
import { useNavigate, useSearchParams } from 'react-router-dom';
import InputField from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import Select from "../../components/form/select/Select"
import Button from '../../components/ui/button/Button';
import { Categories } from '../../Types/Category';
import { getImageName } from '../../components/common/Function';
import { UploadedImage } from "../../Types/UploadedImage";

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
    
    useEffect(() => {
        try {


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
                            throw new Error(result?.message || 'Failed to fetch categories');
                        }
                    } catch (error) {
                        console.error("Failed to fetch categories:", error);
                    } finally {
                        setLoading(false);
                    }
                };
                getCityById();
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }

    }, [id]);
 
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let imageURL = category.image; // Default to existing image if editing

            const file = fileInputRef.current?.files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append("images", file);

                const addImage = await FetchImageData<UploadedImage[]>("/upload/image", "POST", formData, {}, true);
                if (Array.isArray(addImage.data)) {
                    console.log(addImage.data[0]); // Safe access
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
                                fileName={(category.image) ? getImageName(category.image.toString()) : ''}
                                // fileName={(category.image) ? getImageName(category.image) : ''}
                                onChange={() => {
                                    setCategory({ ...category, image: category.image });
                                }}
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