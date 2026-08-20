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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CadastroForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoError, setFotoError] = useState<string | null>(null);
  const [comprimindo, setComprimindo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (valido) setStep(2);
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

            <label className="flex items-start gap-2 text-sm text-foreground">
              <Controller
                name="autorizaWhatsapp"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    className="mt-0.5"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              Autorizo receber dicas mensais do Projeto Cão Idoso pelo{" "}
              <span className="font-semibold text-brand-blue">WhatsApp</span>
            </label>

            <label className="flex items-start gap-2 text-sm text-foreground">
              <Controller
                name="aceitouPoliticaPrivacidade"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    className="mt-0.5"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              Li e concordo com a{" "}
              <Link
                href="/privacidade"
                target="_blank"
                className="text-brand-blue underline"
              >
                política de privacidade
              </Link>
            </label>
            {errors.aceitouPoliticaPrivacidade && (
              <p className="text-xs text-destructive">
                {errors.aceitouPoliticaPrivacidade.message}
              </p>
            )}
          </div>

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
              capture="environment"
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MACHO">Macho</SelectItem>
                      <SelectItem value="FEMEA">Fêmea</SelectItem>
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
