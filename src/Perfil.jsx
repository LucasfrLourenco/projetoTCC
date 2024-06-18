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
  const { userType } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3001/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { telefone, descricao, disponivel, categoria, nome, idade, id } =
          response.data;
        setTelefone(telefone);
        setDescricao(descricao);
        setDisponivel(disponivel);
        setCategoria(categoria);
        setNomePerfil(nome);
        setNovoNome(nome);
        setIdade(idade);

        // Fetch media das avaliações
        if (userType === "PF") {
          const mediaResponse = await axios.get(
            `http://localhost:3001/avaliacoes/media/${id}`
          );
          setMediaAvaliacao(mediaResponse.data);

          // Fetch todas as avaliações
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

    try {
      await axios.put(
        "http://localhost:3001/perfil",
        {
          telefone,
          senha,
          descricao,
          disponivel,
          categoria,
          nome: novoNome,
          idade,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Perfil atualizado com sucesso!");
      setNomePerfil(novoNome);
      setEditMode(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil", error);
      setError("Erro ao atualizar perfil. Por favor, tente novamente.");
    }
  };

  const handleEditClick = () => {
    setEditMode(true); // Ativar modo de edição ao clicar no botão de editar
  };

  const handleCancelEdit = () => {
    setEditMode(false); // Cancelar edição e voltar para o modo de visualização
  };

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="perfil-container">
      {!editMode ? (
        <div>
          <h2>Perfil de {nomePerfil}</h2>
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
                <p>
                  <strong>Idade:</strong> {idade}
                </p>
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
                Ver Avaliações
              </button>
            </div>
          )}
          <button onClick={handleEditClick}>Editar</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <h2>Editar Perfil</h2>
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
