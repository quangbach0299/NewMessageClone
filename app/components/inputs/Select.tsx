import ReactSelect from "react-select";

interface SelectProps {
  label: string;
  value?: Record<string, any>;
  onChange: (value: any) => void;
  options: Record<string, any>[];
  disabled?: boolean;
}

// Record là một kiểu dữ liệu được sử dụng để mô tả một đối tượng có cấu trúc dữ liệu đơn giản, trong đó các thuộc tính và kiểu dữ liệu của chúng được xác định trước
// Record<K, T>
// K: Kiểu dữ liệu của các thuộc tính trong đối tượng. Đây có thể là kiểu dữ liệu string, number, symbol, hoặc một liên hợp (union) của chúng.
// T: Kiểu dữ liệu của các giá trị tương ứng với các thuộc tính trong đối tượng.
// const person: Record<string, string> = {
//   name: "John",
//   age: "30",
//   city: "New York",
// };

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled,
}) => {
  return (
    <div className="z-[100]">
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2 ">
        <ReactSelect
          isDisabled={disabled}
          options={options}
          value={value}
          onChange={onChange}
          isMulti
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          classNames={{
            control: () => "text-sm",
          }}
        />
      </div>
    </div>
  );
};

export default Select;
