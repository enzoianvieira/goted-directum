import { notFound } from "next/navigation";
import { PilarContent } from "@/components/pilar/PilarContent";
import { PILARES, getPilar } from "@/lib/pilares";

export function generateStaticParams() {
  return PILARES.map((p) => ({ pilar: p.slug }));
}

export default async function PilarPage({
  params,
}: {
  params: Promise<{ pilar: string }>;
}) {
  const { pilar: slug } = await params;
  const pilar = getPilar(slug);

  if (!pilar) {
    notFound();
  }

  return <PilarContent pilar={pilar} />;
}
