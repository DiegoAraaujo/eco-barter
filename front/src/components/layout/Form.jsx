import { useState } from "react";
import InputFile from "../ui/InputFile.jsx";
import Select from "../ui/Select.jsx";
import FormButton from "../ui/FormButton.jsx";
import "../../styles/form.css";

function Form(){
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    const categoryOpt=[
        {value: "Roupas", label: "Roupas"},
        { value: "Brinquedos", label: "Brinquedos" },
        { value: "Eletrodoméstico", label: "Eletrodoméstico" }
    ];
    const districtOpt = [
        { value: "district1", label: "Bairro 1" },
        { value: "district2", label: "Bairro 2" },
        { value: "district3", label: "Bairro 3" }
    ];

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        district: "",
        img: null,
        userId: 1,
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }
    const handleFileChange = (file) => {
        setFormData({ ...formData, img: URL.createObjectURL(file) });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            !formData.name.trim() ||
            !formData.description.trim() ||
            !formData.category ||
            !formData.img
        ) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        setFormData({
            name: "",
            description: "",
            category: "",
            district: "",
            img: null,
            userId: 1     
        });
        setFileInputKey(Date.now());
        
    }
    return(
        <>
            <main className="form-container">
                <h3 className="textTopForm">Cadastrar novo item</h3>
                <div>
                    <form className="form-box" onSubmit={handleSubmit}>

                        <label>   
                            Título do item
                            <input type="text" name="name" value={formData.name} onChange={handleChange} />
                        </label>

                        <label>
                            Descrição do item
                            <input type="text" name="description" value={formData.description} onChange={handleChange} />
                        </label>
                        <Select
                            label="Categoria"
                            name="category"
                            options={categoryOpt}
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                        <Select
                            label="Local"
                            name="district"
                            options={districtOpt}
                            value={formData.district}
                            onChange={handleChange}
                        />

                        <InputFile text="Foto do Item" key={fileInputKey} onFileChange={handleFileChange} />

                        <FormButton buttonMessage="Enviar"></FormButton>
                    </form>
                </div>
            </main>
        </>
    );
}
export default Form;