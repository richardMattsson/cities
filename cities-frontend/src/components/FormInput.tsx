type FormInputProps = {
  id: string;
  label: "Stad" | "Kommun" | "Region" | "Befolkning";
  value: string | number;
  setValue: (e: string) => void;
};

export default function FormInput({
  id,
  label,
  value,
  setValue,
}: FormInputProps) {
  return (
    <section className="inputSection">
      <label htmlFor={id} className="labelForm">
        {label}:
      </label>

      <input
        id={id}
        type="text"
        placeholder={label}
        value={value}
        required
        onChange={(e) => setValue(e.target.value)}
        className="inputField"
      />
    </section>
  );
}
