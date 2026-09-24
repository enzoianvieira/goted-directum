"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface ChatMessage {
  id: number;
  from: "assistant" | "user";
  text: string;
}

const MENSAGEM_INICIAL: ChatMessage = {
  id: 0,
  from: "assistant",
  text:
    "Olá! Eu sou o Copiloto GOTED. Em breve vou conhecer o Scanner, a Origem, o Destino, os OKRs e o Roadmap da sua empresa para te ajudar na jornada. Por enquanto, esta é apenas a interface de conversa.",
};

export default function CopilotoPage() {
  const [mensagens, setMensagens] = useState<ChatMessage[]>([MENSAGEM_INICIAL]);
  const [texto, setTexto] = useState("");

  function enviar() {
    const conteudo = texto.trim();
    if (!conteudo) return;

    const novaMensagemUsuario: ChatMessage = {
      id: mensagens.length,
      from: "user",
      text: conteudo,
    };
    const respostaDemo: ChatMessage = {
      id: mensagens.length + 1,
      from: "assistant",
      text: "Esta é uma interface de demonstração — a inteligência do Copiloto ainda será construída.",
    };

    setMensagens((prev) => [...prev, novaMensagemUsuario, respostaDemo]);
    setTexto("");
  }

  return (
    <div className="panel">
      <div className="chat-shell">
        <div className="chat-messages">
          {mensagens.map((m) => (
            <div key={m.id} className={`chat-bubble ${m.from}`}>
              {m.text}
            </div>
          ))}
        </div>
        <form
          className="chat-input-row"
          onSubmit={(e) => {
            e.preventDefault();
            enviar();
          }}
        >
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Pergunte algo sobre a jornada da sua empresa..."
          />
          <button type="submit" className="primary-btn">
            <Send size={15} />
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
