"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TrocarSenhaForm() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSucesso(false);

    if (novaSenha !== confirmacao) {
      setErro("A confirmação não corresponde à nova senha.");
      return;
    }

    setSalvando(true);
    try {
      const res = await fetch("/api/admin/senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Não foi possível trocar a senha.");
      }
      setSucesso(true);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmacao("");
    } catch (err) {
      setErro(
        err instanceof Error ? err.message : "Não foi possível trocar a senha."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm space-y-4">
      <div>
        <Label htmlFor="senhaAtual" className="mb-1.5">
          Senha atual
        </Label>
        <Input
          id="senhaAtual"
          type="password"
          autoComplete="current-password"
          value={senhaAtual}
          onChange={(e) => setSenhaAtual(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="novaSenha" className="mb-1.5">
          Nova senha
        </Label>
        <Input
          id="novaSenha"
          type="password"
          autoComplete="new-password"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          required
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Mínimo de 8 caracteres.
        </p>
      </div>
      <div>
        <Label htmlFor="confirmacao" className="mb-1.5">
          Confirmar nova senha
        </Label>
        <Input
          id="confirmacao"
          type="password"
          autoComplete="new-password"
          value={confirmacao}
          onChange={(e) => setConfirmacao(e.target.value)}
          required
        />
      </div>

      {erro && <p className="text-sm text-destructive">{erro}</p>}
      {sucesso && (
        <p className="text-sm text-green-700">Senha alterada com sucesso.</p>
      )}

      <Button
        type="submit"
        disabled={salvando}
        className="bg-brand-blue hover:bg-brand-blue/90"
      >
        {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Trocar senha"}
      </Button>
    </form>
  );
}
