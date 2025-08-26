// Caminho do arquivo: src/pages/AddItem.jsx

// Página de cadastro de novos itens.
// - Permite que o usuário adicione título, descrição, categoria e imagem do item.
// - Valida os campos obrigatórios e restrições (imagem obrigatória, máximo de 5MB).
// - Converte a imagem para DataURL para salvar no mock DB (localStorage).
// - Usa AuthContext para verificar se o usuário está autenticado.
// - Salva no "items" do mock DB (mocks/db.js).
// - Após salvar, redireciona para "Minha Área".
// - Inclui preview da imagem e botão para removê-la.

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/AddItem.css";
import PageTitle from "../components/ui/PageTitle";
import ButtonLarge from "../components/ui/ButtonLarge";
import Container from "../components/ui/Container";
import { useAuth } from "../context/AuthContext";
import { loadTable, saveTable } from "../mocks/db";
import { CATEGORY_BY_SLUG, prettyCategory } from "../mocks/items";

const MAX_IMAGE_MB = 5;

const AddItem = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Estado inicial do formulário
  const initialFormState = {
    titulo: "",
    descricao: "",
    categoria: "", // slug
    imagem: null,  // File
  };

  const [formData, setFormData] = useState(initialFormState);
  const [previewUrl, setPreviewUrl] = useState(null);   // preview da imagem
  const [errors, setErrors] = useState({});             // erros de validação
  const [submitting, setSubmitting] = useState(false);  // estado do envio

  const wrapperRef = useRef(null);
  const fileInputRef = useRef(null);

  // Cleanup do preview ao desmontar
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  // Converte File → DataURL para persistir no mock DB
  const fileToDataURL = (file) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });

  // Validação básica do formulário
  const validate = (state = formData) => {
    const next = {};
    if (!state.titulo.trim()) next.titulo = "Informe um título.";
    if (!state.descricao.trim()) next.descricao = "Descreva o item.";
    if (!state.categoria) next.categoria = "Escolha uma categoria.";
    if (!state.imagem) next.imagem = "Envie uma imagem do item.";
    return next;
  };

  // Atualiza campos (inclui upload de imagem)
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Upload de imagem
    if (name === "imagem") {
      const file = files?.[0];
      if (!file) {
        setFormData((p) => ({ ...p, imagem: null }));
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setErrors((p) => ({ ...p, imagem: "Envie uma imagem do item." }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((p) => ({ ...p, imagem: "Selecione um arquivo de imagem." }));
        return;
      }
      if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
        setErrors((p) => ({ ...p, imagem: `Imagem acima de ${MAX_IMAGE_MB}MB.` }));
        return;
      }
      setErrors((p) => ({ ...p, imagem: "" }));
      setFormData((prev) => ({ ...prev, imagem: file }));
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      return;
    }

    // Campos texto (título, descrição, categoria)
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Remove imagem selecionada
  const clearImage = (silent = false) => {
    setFormData((p) => ({ ...p, imagem: null }));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!silent) setErrors((p) => ({ ...p, imagem: "Envie uma imagem do item." }));
  };

  // Submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Precisa estar logado
    if (!isAuthenticated || !user?.id) {
      alert("Faça login para cadastrar um item.");
      return;
    }

    // Valida antes de enviar
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0];
      wrapperRef.current?.querySelector(`#${first}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const imageDataUrl = await fileToDataURL(formData.imagem);

      // Monta item novo
      const categorySlug = formData.categoria;
      const categoryLabel = CATEGORY_BY_SLUG[categorySlug]?.name || prettyCategory(categorySlug);

      const newItem = {
        id: `item_${Date.now().toString(36)}`,
        title: formData.titulo.trim(),
        description: formData.descricao.trim(),
        category: categoryLabel,      // rótulo (ex.: "Livros")
        categorySlug,                 // slug (ex.: "livros")
        image: imageDataUrl,          // DataURL
        imageDescription: `Foto de ${formData.titulo.trim()}`,
        city: user?.city || "",
        owner: user.id,
        condition: "Usado",
        createdAt: Date.now(),
      };

      // Salva no mock DB
      const items = loadTable("items");
      items.push(newItem);
      saveTable("items", items);

      // Limpa formulário e redireciona
      setFormData(initialFormState);
      clearImage(true);
      navigate("/my-area", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Não foi possível cadastrar o item.");
    } finally {
      setSubmitting(false);
    }
  };

  // Opções de categorias a partir da fonte única
  const categoryOptions = Object.entries(CATEGORY_BY_SLUG)
    .map(([slug, meta]) => ({ slug, label: meta.name }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

  return (
    <Container className="add-item" size="md">
      <PageTitle tag="h1">Cadastrar Novo Item</PageTitle>

      <div className="cadastro-box" ref={wrapperRef}>
        <form
          className="cadastro-form"
          onSubmit={handleSubmit}
          noValidate
          aria-live="polite"
          aria-busy={submitting || undefined}
        >
          {/* Campo: Título */}
          <div className="campo">
            <label htmlFor="titulo">Título do item</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              placeholder="Ex.: Livro – O Pequeno Príncipe"
              value={formData.titulo}
              onChange={handleChange}
              required
              maxLength={120}
              disabled={submitting}
              aria-invalid={Boolean(errors.titulo)}
              aria-describedby={errors.titulo ? "titulo-error" : undefined}
            />
            {errors.titulo && (
              <p id="titulo-error" className="erro-validacao" role="alert">
                {errors.titulo}
              </p>
            )}
          </div>

          {/* Campo: Imagem */}
          <div className="campo">
            <label htmlFor="imagem">Foto do item</label>
            <input
              type="file"
              id="imagem"
              name="imagem"
              accept="image/*"
              required
              onChange={handleChange}
              disabled={submitting}
              aria-invalid={Boolean(errors.imagem)}
              aria-describedby={errors.imagem ? "imagem-error" : "imagem-hint"}
              ref={fileInputRef}
            />
            <small id="imagem-hint" className="hint">
              PNG, JPG ou WEBP até {MAX_IMAGE_MB}MB.
            </small>
            {errors.imagem && (
              <p id="imagem-error" className="erro-validacao" role="alert">
                {errors.imagem}
              </p>
            )}

            {previewUrl && (
              <div className="preview-wrap">
                <img
                  className="preview-img"
                  src={previewUrl}
                  alt={`Pré-visualização do item${formData.titulo ? `: ${formData.titulo}` : ""}`}
                />
                <button
                  type="button"
                  className="preview-remove"
                  onClick={() => clearImage(false)}
                  disabled={submitting}
                >
                  Remover imagem
                </button>
              </div>
            )}
          </div>

          {/* Campo: Descrição */}
          <div className="campo">
            <label htmlFor="descricao">Descrição do item</label>
            <textarea
              id="descricao"
              name="descricao"
              rows={3}
              placeholder="Descreva o estado, marca, tamanho, observações..."
              value={formData.descricao}
              onChange={handleChange}
              required
              maxLength={800}
              disabled={submitting}
              aria-invalid={Boolean(errors.descricao)}
              aria-describedby={errors.descricao ? "descricao-error" : "descricao-hint"}
            />
            <div className="campo-meta">
              <small id="descricao-hint" className="hint">Até 800 caracteres.</small>
              <small className="count">{formData.descricao.length}/800</small>
            </div>
            {errors.descricao && (
              <p id="descricao-error" className="erro-validacao" role="alert">
                {errors.descricao}
              </p>
            )}
          </div>

          {/* Campo: Categoria */}
          <div className="campo">
            <label htmlFor="categoria">Categoria</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              disabled={submitting}
              aria-invalid={Boolean(errors.categoria)}
              aria-describedby={errors.categoria ? "categoria-error" : undefined}
            >
              <option value="" disabled hidden>Escolha a categoria</option>
              {categoryOptions.map(({ slug, label }) => (
                <option key={slug} value={slug}>{label}</option>
              ))}
            </select>
            {errors.categoria && (
              <p id="categoria-error" className="erro-validacao" role="alert">
                {errors.categoria}
              </p>
            )}
          </div>

          {/* Botão de submit */}
          <div className="botoes-acao">
            <ButtonLarge
              type="submit"
              size="sm"
              className="btn-cadastrar"
              loading={submitting}
              disabled={submitting}
              aria-label="Cadastrar Item"
            >
              {submitting ? "Cadastrando…" : "Cadastrar Item"}
            </ButtonLarge>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default AddItem;
