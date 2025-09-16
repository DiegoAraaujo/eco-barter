import { useState } from "react";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import SmallerButton from '../components/ui/SmallerButton'
import "../styles/personalData.css";

export default function PersonalData() {
    const [form, setForm] = useState({
        nome: "",
        email: "",
        senha: "",
        telefone: "",
        endereco: "",
        cidade: "",
        estado: "",
    });
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dados enviados:", form);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <main id="conteudo" className="main-dados">
            <Header />
            <h1 className="titulo-dados">Dados Pessoais</h1>

            <div className="dados-box">
                <form className="dados-form" onSubmit={handleSubmit} noValidate>
                    <fieldset className="grupo-campos">
                        <legend>Informações Pessoais</legend>

                        <div className="campo">
                            <label htmlFor="nome">Nome completo</label>
                            <input
                                type="text"
                                id="nome"
                                placeholder="Ex.: Maria Souza"
                                value={form.nome}
                                onChange={handleChange}
                                required
                                autoComplete="name"
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="seuemail@exemplo.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="senha">Senha</label>
                            <input
                                type="password"
                                id="senha"
                                placeholder="Mín. 6 caracteres"
                                value={form.senha}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                                minLength={6}
                            />
                        </div>
                    </fieldset>

                    <fieldset className="grupo-campos">
                        <legend>Contato e Endereço</legend>

                        <div className="campo">
                            <label htmlFor="telefone">Telefone (WhatsApp)</label>
                            <input
                                type="tel"
                                id="telefone"
                                placeholder="(88) 9 0000-0000"
                                value={form.telefone}
                                onChange={handleChange}
                                required
                                autoComplete="tel"
                                inputMode="numeric"
                                pattern="[0-9\s\(\)\-+]*"
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="cidade">Cidade</label>
                            <input
                                type="text"
                                id="cidade"
                                placeholder="Sobral"
                                value={form.cidade}
                                onChange={handleChange}
                                required
                                autoComplete="address-level2"
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="estado">Estado</label>
                            <input
                                type="text"
                                id="estado"
                                placeholder="CE"
                                value={form.estado}
                                onChange={handleChange}
                                required
                                autoComplete="address-level1"
                                maxLength={2}
                            />
                        </div>
                    </fieldset>

                    <SmallerButton buttonMessage="Salvar Dados" />

                    <p
                        className="feedback-sucesso"
                        aria-live="polite"
                        style={{ visibility: saved ? "visible" : "hidden", marginTop: 10 }}
                    >
                        Dados salvos com sucesso!
                    </p>
                </form>
            </div>
            <Footer />
        </main>
    );
}