type FormSelectProps = {
  id: string;
  label: "Kommun" | "Region";
  value: number;
  setValue: (e: number) => void;
  children: React.ReactNode;
};

export default function FormSelect({
  id,
  label,
  value,
  setValue,
  children,
}: FormSelectProps) {
  return (
    <section className="inputSection">
      <label htmlFor={id} className="labelForm">
        {label}:
      </label>
      <select
        name=""
        id={id}
        required
        onChange={(e) => setValue(Number(e.target.value))}
        className="inputField"
        value={value || ""}
      >
        <option value="" disabled>
          Välj
        </option>
        {children}
      </select>
    </section>
  );
}
