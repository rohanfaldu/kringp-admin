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
import { SubCategories } from '../../Types/SubCategory';
import { getImageName } from '../../components/common/Function';
import { Categories } from '../../Types/Category';
import { UploadedImage } from "../../Types/UploadedImage";

export default function EditSubCategory() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');


    const [category, setSubCategory] = useState<SubCategories>({
        id: '',
        name: '',
        image: '',
        categoryId: '',
        status: true,
        createsAt: new Date(),
        updatedAt: new Date()
    });
    // console.log(state, ">>>>>>>>>>>> setState");

    const [loading, setLoading] = useState(id ? true : false);
    const [categories, setCategories] = useState<Categories[]>([]);


    useEffect(() => {
        try {
   
                const fetchCategories = async () => {
                    try {
                        const result = await FetchData<any>('/categories/getAll', 'POST');
                        if (result.status) {
                            setCategories(result.data.categories);
                        }
                    } catch (error) {
                        console.error('Failed to fetch categories:', error);
                    }
                };
                fetchCategories();
  

            if (id) {
                const getCityById = async () => {
                    setLoading(true);
                    try {

                        const result = await FetchData<any>(`/sub-categories/get/${id}`, 'GET');

                        if (result && result.status) {
                            const subcategoryData = result.data;

                            if (subcategoryData) {
                                console.log(subcategoryData.image, 'Image')
                                setSubCategory({
                                    id: subcategoryData.id || '',
                                    name: subcategoryData.name || '',
                                    image: subcategoryData.image || '',
                                    categoryId: subcategoryData.categoryId || '',
                                    status: subcategoryData.status !== undefined ? subcategoryData.status : true,
                                    createsAt: subcategoryData.createdAt ? new Date(subcategoryData.createdAt) : new Date(),
                                    updatedAt: subcategoryData.updatedAt ? new Date(subcategoryData.updatedAt) : new Date()
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
    console.log(categories, ">>>>>>>>>>>> categories Data")
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
                categoryId: category.categoryId,
                status: category.status,
            };

            const endpoint = id ? `/sub-categories/edit/${id}` : '/sub-categories/create';
            const method = 'POST';
            const result = await FetchData(endpoint, method, parameter);
            console.log(result, ">>>>>> result")
            if (result.status) {
                navigate('/sub-category');
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
        setSubCategory({ ...category, status: value === 'true' });
    };

    const handleCategoryChange = (value: string) => {
        console.log(value, '>>>>> selected category id');
        setSubCategory({ ...category, categoryId: value });
    };

    return (
        <>
            <PageMeta
                title={id ? "Edit Sub Categories" : "Add Sub Categories"}
                description={id ? "Edit Sub Categories Details" : "Add New Sub Categories"}
            />
            <PageBreadcrumb pageTitle={id ? "Edit Sub Categories" : "Add Sub Categories"} />
            <div className="space-y-6">
                <ComponentCard title={id ? "Edit Sub Categories" : "Add Sub Categories"}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputField
                                label="Sub Category Name"
                                type="text"
                                value={category.name}
                                onChange={(e) => setSubCategory({ ...category, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Select
                                label="Category"
                                required={true}
                                options={categories.map((category) => ({
                                    label: category.name,
                                    value: category.id
                                }))}
                                onChange={handleCategoryChange}
                                defaultValue={category.categoryId || ''}
                            />
                        </div>

                        <div>
                            <FileInput
                                label="Sub Category Image"
                                ref={fileInputRef}
                                fileName={(category.image) ? getImageName(category.image.toString()) : ''}
                                // fileName={(category.image) ? getImageName(category.image) : ''}
                                onChange={() => {
                                    setSubCategory({ ...category, image: category.image });
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