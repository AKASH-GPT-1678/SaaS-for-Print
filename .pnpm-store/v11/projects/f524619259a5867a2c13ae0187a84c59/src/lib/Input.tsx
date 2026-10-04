import { IconType } from "react-icons";

interface InputProps {
  label: string;
  placeholder: string;
  type: string;
  icon: IconType;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<InputProps> = ({
  label,
  placeholder,
  type,
  icon: Icon,
  onChange
}) => {
  return (
    <div className="flex flex-col mt-2">
      <label htmlFor="input" className="text-gray-400">
        {label}
      </label>

      <div className="flex flex-row justify-between items-center">
        <input
          type={type}
          id="input"
          placeholder={placeholder}
          className="outline-none"
          onChange={onChange}
        />

        <Icon size={18} />
      </div>

      <hr className="mt-2" />
    </div>
  );
};

export default CustomInput;