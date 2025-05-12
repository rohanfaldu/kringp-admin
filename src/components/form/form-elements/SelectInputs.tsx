import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Select from "../Select";
import MultiSelect from "../MultiSelect";

interface SelectInputsProps {
  formData: {
    selectInput: string;
    [key: string]: any;
  };
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  errorClassName?: string;
  errorBorderClassName?: string;
}

const SelectInputs = ({ 
  formData, 
  setFormData, 
  errors, 
  errorClassName = "text-[#dc2626] text-sm mt-1",
  errorBorderClassName = "border-[#dc2626]" 
}: SelectInputsProps) => {
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];

  const multiOptions = [
    { value: "1", text: "Option 1", selected: false },
    { value: "2", text: "Option 2", selected: false },
    { value: "3", text: "Option 3", selected: false },
    { value: "4", text: "Option 4", selected: false },
    { value: "5", text: "Option 5", selected: false },
  ];

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, selectInput: value });
  };

  return (
    <ComponentCard title="Select Inputs">
      <div className="space-y-6">
        <div>
          <Label>Select Input</Label>
          <Select
            options={options}
            placeholder="Select Option"
            onChange={handleSelectChange}
            className={`${errors.selectInput ? errorBorderClassName : ''}`}
          />
          {errors.selectInput && (
            <span className={errorClassName}>{errors.selectInput}</span>
          )}
        </div>
        <div>
          <MultiSelect
            label="Multiple Select Options"
            options={multiOptions}
            defaultSelected={["1", "3"]}
            onChange={(values) => setSelectedValues(values)}
          />
          <p className="sr-only">
            Selected Values: {selectedValues.join(", ")}
          </p>
        </div>
      </div>
    </ComponentCard>
  );
};

export default SelectInputs;
