import { ChangeEvent } from "react";

interface DefaultInputsProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  errorClassName?: string;
  errorBorderClassName?: string;
}

const DefaultInputs = ({ 
  formData, 
  setFormData, 
  errors, 
  errorClassName = "text-[#dc2626] text-sm mt-1",
  errorBorderClassName = "border-[#dc2626]" 
}: DefaultInputsProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, defaultInput: e.target.value });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Default Input
        </h3>
      </div>

      <div className="flex flex-col gap-5.5 p-6.5">
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Default Input
          </label>
          <input
            type="text"
            value={formData.defaultInput}
            onChange={handleChange}
            placeholder="Default Input"
            className={`w-full rounded-lg border-[1.5px] ${
              errors.defaultInput ? errorBorderClassName : 'border-stroke'
            } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
          />
          {errors.defaultInput && (
            <span className={errorClassName}>{errors.defaultInput}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefaultInputs;
