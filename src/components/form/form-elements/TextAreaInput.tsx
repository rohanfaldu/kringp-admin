import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";

interface TextAreaInputProps {
  formData: {
    textArea: string;
    [key: string]: any;
  };
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  errorClassName?: string;
  errorBorderClassName?: string;
}

const TextAreaInput = ({ 
  formData, 
  setFormData, 
  errors,
  errorClassName = "text-[#dc2626] text-sm mt-1",
  errorBorderClassName = "border-[#dc2626]"
}: TextAreaInputProps) => {
  return (
    <ComponentCard title="Textarea Input">
      <div className="space-y-6">
        <div>
          <Label>Default Textarea</Label>
          <textarea
            rows={6}
            value={formData.textArea}
            onChange={(e) => setFormData({ ...formData, textArea: e.target.value })}
            placeholder="Type your message"
            className={`w-full rounded-lg border-[1.5px] bg-transparent py-3 px-5 outline-none transition ${
              errors.textArea ? errorBorderClassName : 'border-stroke'
            } dark:border-form-strokedark dark:bg-form-input`}
          />
          {errors.textArea && (
            <span className={errorClassName}>{errors.textArea}</span>
          )}
        </div>
      </div>
    </ComponentCard>
  );
};

export default TextAreaInput;
