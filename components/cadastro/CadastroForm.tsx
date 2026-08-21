"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import { Camera, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  cadastroSchema,
  tutorFields,
  type CadastroFormValues,
} from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SEXOS: Record<string, string> = { MACHO: "Macho", FEMEA: "Fêmea" };

export function CadastroForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoError, setFotoError] = useState<string | null>(null);
  const [comprimindo, setComprimindo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [erroEtapa, setErroEtapa] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors },
  } = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      autorizaWhatsapp: false,
      aceitouPoliticaPrivacidade: false,
      sexo: undefined,
    },
  });

  async function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoError(null);
    setComprimindo(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.4,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
      });
      setFotoFile(compressed);
      setFotoPreview(URL.createObjectURL(compressed));
    } catch {
      setFotoError("Não foi possível processar a foto. Tente outra imagem.");
    } finally {
      setComprimindo(false);
    }
  }

  async function irParaEtapa2() {
    const valido = await trigger(tutorFields);
    if (valido) {
      setErroEtapa(null);
      setStep(2);
      return;
    }

    // Sem isto o botão parece "não fazer nada": o campo que barrou pode estar
    // fora da área visível, especialmente no celular.
    setErroEtapa("Confira os campos destacados para continuar.");
    formRef.current
      ?.querySelector<HTMLElement>("[aria-invalid='true'], .text-destructive")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function onSubmit(values: CadastroFormValues) {
    if (!fotoFile) {
      setFotoError("Adicione uma foto do seu cão.");
      return;
    }
    setErroEnvio(null);
    setEnviando(true);
    try {
      const formData = new FormData();
      formData.append("nomeCompleto", values.nomeCompleto);
      formData.append("whatsapp", values.whatsapp);
      formData.append("email", values.email ?? "");
      formData.append("autorizaWhatsapp", String(values.autorizaWhatsapp));
      formData.append(
        "aceitouPoliticaPrivacidade",
        String(values.aceitouPoliticaPrivacidade)
      );
      formData.append("nomeCao", values.nomeCao);
      formData.append("idadeAnos", String(values.idadeAnos));
      formData.append("raca", values.raca);
      formData.append("sexo", values.sexo);
      formData.append("pesoKg", String(values.pesoKg));
      formData.append("foto", fotoFile, fotoFile.name || "foto.jpg");

      const res = await fetch("/api/cadastros", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Não foi possível concluir o cadastro.");
      }

      const { id } = await res.json();
      router.push(`/carteirinha/${id}`);
    } catch (err) {
      setErroEnvio(
        err instanceof Error ? err.message : "Não foi possível concluir o cadastro."
      );
    } finally {
      setEnviando(false);
    }
  }

  const nomeCao = useWatch({ control, name: "nomeCao" });

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl bg-white p-6 shadow-xl"
    >
      {step === 1 ? (
        <>
          <h3 className="mb-1 text-center text-2xl font-bold text-brand-navy">
            Seus dados
          </h3>
          <p className="mb-5 text-center text-sm text-brand-blue">
            Etapa 1 de 2
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nomeCompleto" className="mb-1.5">
                Nome completo
              </Label>
              <Input id="nomeCompleto" {...register("nomeCompleto")} />
              {errors.nomeCompleto && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.nomeCompleto.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="whatsapp" className="mb-1.5">
                WhatsApp
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="(16) 99999-9999"
                {...register("whatsapp")}
              />
              {errors.whatsapp && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.whatsapp.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="mb-1.5">
                E-mail (opcional)
              </Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/*
              Checkbox nativo de propósito. É o campo de consentimento, e ele
              precisa funcionar em qualquer celular que aparecer no evento —
              o componente estilizado não marcava em toque real no aparelho.
              O texto vai dentro de um único <span> para o rótulo não virar
              vários itens de flex e quebrar em colunas no celular.
            */}
            <label className="flex items-start gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                className="mt-0.5 size-5 shrink-0 accent-brand-blue"
                {...register("autorizaWhatsapp")}
              />
              <span>
                Autorizo receber dicas mensais do Projeto Cão Idoso pelo{" "}
                <span className="font-semibold text-brand-blue">WhatsApp</span>
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                className="mt-0.5 size-5 shrink-0 accent-brand-blue"
                {...register("aceitouPoliticaPrivacidade")}
              />
              <span>
                Li e concordo com a{" "}
                <Link
                  href="/privacidade"
                  target="_blank"
                  // sem isto, tocar no link marcaria o checkbox junto
                  onClick={(e) => e.stopPropagation()}
                  className="text-brand-blue underline"
                >
                  política de privacidade
                </Link>
              </span>
            </label>
            {errors.aceitouPoliticaPrivacidade && (
              <p className="text-xs text-destructive">
                {errors.aceitouPoliticaPrivacidade.message}
              </p>
            )}
          </div>

          {erroEtapa && (
            <p className="mt-4 text-center text-sm text-destructive">
              {erroEtapa}
            </p>
          )}

          <Button
            type="button"
            onClick={irParaEtapa2}
            size="lg"
            className="mt-6 w-full rounded-full bg-brand-blue text-base hover:bg-brand-blue/90"
          >
            Continuar
          </Button>
        </>
      ) : (
        <>
          <h3 className="mb-1 text-center text-2xl font-bold text-brand-navy">
            Dados do cão
          </h3>
          <p className="mb-5 text-center text-sm text-brand-blue">
            Etapa 2 de 2
          </p>

          <div className="mb-5 flex flex-col items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed border-brand-blue/40 bg-brand-blue-light text-brand-blue overflow-hidden"
            >
              {fotoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fotoPreview}
                  alt="Prévia da foto do cão"
                  className="h-full w-full object-cover"
                />
              ) : comprimindo ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <Camera className="h-6 w-6" />
                  <span className="text-xs font-medium">Adicionar foto</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              // Sem "capture": com ele o celular abre a câmera direto e o tutor
              // não consegue escolher uma foto que já tem na galeria. Assim o
              // próprio sistema oferece as duas opções.
              className="hidden"
              onChange={handleFotoChange}
            />
            {fotoError && (
              <p className="mt-2 text-xs text-destructive">{fotoError}</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nomeCao" className="mb-1.5">
                Nome do cão
              </Label>
              <Input id="nomeCao" placeholder="Ex.: Thor" {...register("nomeCao")} />
              {errors.nomeCao && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.nomeCao.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="idadeAnos" className="mb-1.5">
                  Idade (anos)
                </Label>
                <Input
                  id="idadeAnos"
                  type="number"
                  min={1}
                  max={35}
                  {...register("idadeAnos")}
                />
                {errors.idadeAnos && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.idadeAnos.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="pesoKg" className="mb-1.5">
                  Peso (kg)
                </Label>
                <Input
                  id="pesoKg"
                  type="number"
                  step="0.1"
                  min={0}
                  {...register("pesoKg")}
                />
                {errors.pesoKg && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.pesoKg.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="raca" className="mb-1.5">
                Raça / SRD
              </Label>
              <Input
                id="raca"
                placeholder="Ex.: Golden Retriever ou SRD"
                {...register("raca")}
              />
              {errors.raca && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.raca.message}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-1.5">Sexo</Label>
              <Controller
                name="sexo"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    // Sem "items" o campo exibe o valor cru ("MACHO") depois de
                    // escolher, em vez do rótulo.
                    items={SEXOS}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SEXOS).map(([valor, rotulo]) => (
                        <SelectItem key={valor} value={valor}>
                          {rotulo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.sexo && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.sexo.message}
                </p>
              )}
            </div>
          </div>

          {erroEnvio && (
            <p className="mt-4 text-center text-sm text-destructive">
              {erroEnvio}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="rounded-full"
            >
              Voltar
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={enviando || comprimindo}
              className="flex-1 rounded-full bg-brand-blue text-base hover:bg-brand-blue/90"
            >
              {enviando ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                `Gerar carteirinha${nomeCao ? ` de ${nomeCao}` : ""}`
              )}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
