import React, { useState } from 'react';
import '../styles/pages/PersonalData.css';
import PageTitle from '../components/ui/PageTitle';
import ButtonLarge from '../components/ui/ButtonLarge';
import Container from '../components/ui/Container';

const PersonalData = () => {
  const initialFormState = {
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: 'Campo obrigatório' }));
    } else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors((prev) => ({ ...prev, [name]: 'E-mail inválido' }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      alert('Dados salvos com sucesso!');
      setFormData(initialFormState); // Limpa o formulário
      setErrors({});
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Container className="personal-data">
      <PageTitle>Dados Pessoais</PageTitle>

      <div className="dados-box">
        <form className="dados-form" onSubmit={handleSubmit} noValidate>
          {/* Grupo 1: Informações Pessoais */}
          <fieldset className="grupo-campos">
            <legend>Informações Pessoais</legend>

            {['nome', 'email', 'senha'].map((campo) => (
              <div className="campo" key={campo}>
                <label htmlFor={campo}>
                  {campo === 'nome'
                    ? 'Nome completo'
                    : campo.charAt(0).toUpperCase() + campo.slice(1)}
                </label>
                <input
                  type={campo === 'senha' ? 'password' : campo === 'email' ? 'email' : 'text'}
                  id={campo}
                  name={campo}
                  value={formData[campo]}
                  onChange={handleChange}
                  required
                  autoComplete={
                    campo === 'nome'
                      ? 'name'
                      : campo === 'email'
                        ? 'email'
                        : 'new-password'
                  }
                  aria-invalid={!!errors[campo]}
                  aria-describedby={`${campo}-error`}
                />
                {errors[campo] && (
                  <span id={`${campo}-error`} className="erro-validacao">
                    {errors[campo]}
                  </span>
                )}
              </div>
            ))}
          </fieldset>

          {/* Grupo 2: Contato e Endereço */}
          <fieldset className="grupo-campos">
            <legend>Contato e Endereço</legend>

            {['telefone', 'endereco', 'cidade', 'estado'].map((campo) => (
              <div className="campo" key={campo}>
                <label htmlFor={campo}>
                  {campo.charAt(0).toUpperCase() + campo.slice(1)}
                </label>
                <input
                  type="text"
                  id={campo}
                  name={campo}
                  value={formData[campo]}
                  onChange={handleChange}
                  required
                  autoComplete={
                    campo === 'telefone'
                      ? 'tel'
                      : campo === 'endereco'
                        ? 'street-address'
                        : campo === 'cidade'
                          ? 'address-level2'
                          : 'address-level1'
                  }
                  aria-invalid={!!errors[campo]}
                  aria-describedby={`${campo}-error`}
                />
                {errors[campo] && (
                  <span id={`${campo}-error`} className="erro-validacao">
                    {errors[campo]}
                  </span>
                )}
              </div>
            ))}
          </fieldset>

          <div className="botoes-acao">
            <ButtonLarge type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Dados'}
            </ButtonLarge>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default PersonalData;
