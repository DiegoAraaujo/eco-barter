// Caminho do arquivo: src/pages/AddItem.jsx
//
// Página de cadastro de novos itens (sem mocks).
// - Persiste em localStorage via services/storage (loadTable/saveTable).
// - Usa fonte estável de categorias em src/constants/categories.
// - Mantém validação, preview e redirecionamento para Minha Área.

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/AddItem.css";
import PageTitle from "../components/ui/PageTitle";
import ButtonLarge from "../components/ui/ButtonLarge";
import Container from "../components/ui/Container";
import { useAuth } from "../context/AuthContext";
import { loadTable, saveTable } from "../services/storage"; // <-- troca mocks/db por services/storage
import { CATEGORY_BY_SLUG, prettyCategory } from "../constants/categories"; // <-- troca mocks/items por constants
import IMG_FALLBACK from "../assets/img/placeholder.png";

const MAX_IMAGE_MB = 5;

const AddItem = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const initialFormState = {
    titulo: "",
    descricao: "",
    categoria: "", // slug
    imagem: null,  // File
  };

  const [formData, setFormData] = useState(initialFormState);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const wrapperRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const fileToDataURL = (file) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });

  const validate = (state = formData) => {
    const next = {};
    if (!state.titulo.trim()) next.titulo = "Informe um título.";
    if (!state.descricao.trim()) next.descricao = "Descreva o item.";
    if (!state.categoria) next.categoria = "Escolha uma categoria.";
    if (!state.imagem) next.imagem = "Envie uma imagem do item.";
    return next;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

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

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const clearImage = (silent = false) => {
    setFormData((p) => ({ ...p, imagem: null }));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!silent) setErrors((p) => ({ ...p, imagem: "Envie uma imagem do item." }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!isAuthenticated || !user?.id) {
      alert("Faça login para cadastrar um item.");
      return;
    }

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

      const categorySlug = formData.categoria;
      const categoryLabel = CATEGORY_BY_SLUG[categorySlug]?.name || prettyCategory(categorySlug);

      const newItem = {
        id: `item_${Date.now().toString(36)}`,
        title: formData.titulo.trim(),
        description: formData.descricao.trim(),
        category: categoryLabel,
        categorySlug,
        image: imageDataUrl || IMG_FALLBACK, // DataURL
        imageDescription: `Foto de ${formData.titulo.trim()}`,
        city: user?.city || "",
        owner: String(user.id),
        condition: "Usado",
        createdAt: Date.now(),
      };

      // Persistência local (sem mocks)
      const items = loadTable("items");
      items.push(newItem);
      saveTable("items", items);

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
