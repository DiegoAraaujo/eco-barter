import "../../styles/select.css";

function Select({label, name, options, value, onChange}){
    return(
        <label>
                {label}
                <select name={name} value={value} onChange={onChange}>
                <option value="">Selecione</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
                </select>
            </label>
    )   
}
export default Select;