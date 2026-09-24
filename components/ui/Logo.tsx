import Image from "next/image";

// Assinatura oficial GOTED (design-system/Logo - Goted), conforme o Manual de
// Marca — seção "Versões para fundos escuros" / "Aplicação sobre fundos":
//   oficial -> marinho + petróleo, para fundos claros (areia/branco)
//   areia   -> areia + petróleo, para fundos marinho
//   branco  -> branco sólido, para fundos petróleo (o ponteiro colorido some
//              sobre a própria cor, por isso a versão monocromática)
export type LogoTone = "oficial" | "areia" | "branco";

const ICONE_SRC: Record<LogoTone, string> = {
  oficial: "/brand/goted-icone-oficial.png",
  areia: "/brand/goted-icone-areia.png",
  branco: "/brand/goted-icone-branco.png",
};

const COMPLETA_SRC: Record<LogoTone, string> = {
  oficial: "/brand/goted-oficial.png",
  areia: "/brand/goted-areia.png",
  branco: "/brand/goted-branco.png",
};

const TIPO_SRC: Record<LogoTone, string> = {
  oficial: "/brand/goted-tipo-oficial.png",
  areia: "/brand/goted-tipo-areia.png",
  branco: "/brand/goted-tipo-branca.png",
};

// Proporção real do arquivo de símbolo (quadrado).
export function LogoMark({
  size = 32,
  tone = "oficial",
}: {
  size?: number;
  tone?: LogoTone;
}) {
  return (
    <Image
      src={ICONE_SRC[tone]}
      alt="GOTED"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain" }}
      priority
    />
  );
}

// Apenas o logotipo (a palavra "goted"), sem o símbolo — proporção real
// ~2.64:1. Usar quando o símbolo já aparece em outro lugar ao lado (ex: rail).
export function LogoType({
  height = 18,
  tone = "oficial",
}: {
  height?: number;
  tone?: LogoTone;
}) {
  return (
    <Image
      src={TIPO_SRC[tone]}
      alt="goted"
      width={height * 2.64}
      height={height}
      style={{ objectFit: "contain" }}
      priority
    />
  );
}

// Proporção real da assinatura completa (símbolo + tipo): 1799×500 ~3.6:1.
const COMPLETA_RATIO = 1799 / 500;

export function LogoFull({
  height = 32,
  tone = "oficial",
}: {
  height?: number;
  tone?: LogoTone;
}) {
  return (
    <Image
      src={COMPLETA_SRC[tone]}
      alt="GOTED"
      width={Math.round(height * COMPLETA_RATIO)}
      height={height}
      style={{ objectFit: "contain" }}
      priority
    />
  );
}
