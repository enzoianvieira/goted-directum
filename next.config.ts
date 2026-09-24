import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O indicador de dev do Next.js ficava por cima do botão de configurações
  // no rail. Ele só existe em desenvolvimento (não aparece em produção).
  devIndicators: false,
};

export default nextConfig;
