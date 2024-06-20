import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import Stars from "./Stars";
import Modal from "./Modal";
import "./perfil.css";

const Perfil = () => {
  const [nomePerfil, setNomePerfil] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [idade, setIdade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disponivel, setDisponivel] = useState(false);
  const [categoria, setCategoria] = useState("");
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [mediaAvaliacao, setMediaAvaliacao] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [imagem, setImagem] = useState(null); // Estado para armazenar a imagem
  const [imagemUrl, setImagemUrl] = useState(null); // Para visualização da imagem

  const { userType } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3001/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const {
          telefone,
          descricao,
          disponivel,
          categoria,
          nome,
          idade,
          id,
          imagem,
        } = response.data;
        setTelefone(telefone);
        setDescricao(descricao);
        setDisponivel(disponivel);
        setCategoria(categoria);
        setNomePerfil(nome);
        setNovoNome(nome);
        setIdade(idade);
        setImagemUrl(imagem ? `http://localhost:3001/imagens/${imagem}` : null);

        if (userType === "PF") {
          const mediaResponse = await axios.get(
            `http://localhost:3001/avaliacoes/media/${id}`
          );
          setMediaAvaliacao(mediaResponse.data);

          const avaliacoesResponse = await axios.get(
            `http://localhost:3001/avaliacoes/${id}`
          );
          setAvaliacoes(avaliacoesResponse.data);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil", error);
        setError("Erro ao carregar perfil");
      }
    };

    fetchProfile();
  }, [token, userType]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("telefone", telefone);
    formData.append("senha", senha);
    formData.append("descricao", descricao);
    formData.append("disponivel", disponivel);
    formData.append("categoria", categoria);
    formData.append("nome", novoNome);
    formData.append("idade", idade);
    if (imagem) {
      formData.append("imagem", imagem);
    }

    try {
      await axios.put("http://localhost:3001/perfil", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Perfil atualizado com sucesso!");
      setNomePerfil(novoNome);
      setEditMode(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil", error);
      setError("Erro ao atualizar perfil. Por favor, tente novamente.");
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleImagemChange = (e) => {
    setImagem(e.target.files[0]);
    setImagemUrl(URL.createObjectURL(e.target.files[0])); // Atualiza a visualização da imagem
  };

  return (
    <div className="perfil-container">
      {!editMode ? (
        <div>
          <h2>Perfil de {nomePerfil}</h2>
          {imagemUrl && (
            <img
              src={imagemUrl}
              alt="Imagem do Perfil"
              className="perfil-imagem"
            />
          )}
          {error && <p className="error-message">{error}</p>}
          <p>
            <strong>Nome:</strong> {nomePerfil}
          </p>
          <p>
            <strong>Telefone:</strong> {telefone}
          </p>
          {userType === "PF" && (
            <>
              <p>
                <strong>Idade:</strong> {idade}
              </p>
              <p>
                <strong>Descrição:</strong> {descricao}
              </p>
              <p>
                <strong>Categoria:</strong> {categoria}
              </p>
              <p>
                <strong>Disponível:</strong> {disponivel ? "Sim" : "Não"}
              </p>
            </>
          )}
          {userType === "PF" && (
            <div className="media-avaliacao">
              <h3>Média das Avaliações:</h3>
              {mediaAvaliacao !== null ? (
                <>
                  <Stars rating={Math.round(mediaAvaliacao)} />
                  <p>{mediaAvaliacao.toFixed(1)} estrelas</p>
                </>
              ) : (
                <p>Ainda não avaliado</p>
              )}
              <button
                onClick={handleModalToggle}
                className="ver-avaliacoes-button"
              >
                Avaliações
              </button>
            </div>
          )}
          <button onClick={handleEditClick}>Editar</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <h2>Editar Perfil</h2>
          {imagemUrl && (
            <img
              src={imagemUrl}
              alt="Imagem do Perfil"
              className="perfil-imagem"
            />
          )}
          {error && <p className="error-message">{error}</p>}
          <label>
            Nome:
            <input
              type="text"
              placeholder="Nome"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
            />
          </label>
          <label>
            Telefone:
            <input
              type="text"
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </label>
          <label>
            Senha:
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </label>
          {userType === "PF" && (
            <>
              <label>
                Idade:
                <input
                  type="number"
                  placeholder="Idade"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                />
              </label>
              <label>
                Descrição:
                <textarea
                  placeholder="Descrição"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                ></textarea>
              </label>
              <label>
                Imagem:
                <input type="file" onChange={handleImagemChange} />
              </label>
              <label>
                Categoria:
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="">Selecione a Categoria</option>
                  <option value="Garçom">Garçom</option>
                  <option value="Cozinheiro">Cozinheiro</option>
                  <option value="Atendente">Atendente</option>
                  <option value="Chefe de Cozinha">Chefe de Cozinha</option>
                  <option value="Sushiman">Sushiman</option>
                  <option value="Pizzaiolo">Pizzaiolo</option>
                  <option value="Churrasqueiro">Churrasqueiro</option>
                  <option value="Auxiliar de Cozinha">
                    Auxiliar de Cozinha
                  </option>
                  <option value="Entregador">Entregador</option>
                </select>
              </label>
              <label>
                Disponível:
                <input
                  type="checkbox"
                  checked={disponivel}
                  onChange={(e) => setDisponivel(e.target.checked)}
                />
              </label>
            </>
          )}
          <button type="submit">Salvar</button>
          <button type="button" onClick={handleCancelEdit}>
            Cancelar
          </button>
        </form>
      )}
      <Modal show={showModal} onClose={handleModalToggle}>
        <h2>Avaliações</h2>
        {avaliacoes.map((avaliacao, index) => (
          <div key={index} className="avaliacao">
            <Stars rating={avaliacao.nota} />
            <p>
              <strong>{avaliacao.avaliador}:</strong> {avaliacao.comentario}
            </p>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default Perfil;
