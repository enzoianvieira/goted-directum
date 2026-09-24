-- ============================================================================
-- GOTED — Dados iniciais (organização e usuário de demonstração)
-- ============================================================================
-- Os IDs precisam bater com lib/tenant.ts, que é quem a interface usa como
-- "organização atual" enquanto o tenant não vem da sessão do usuário logado.
-- Idempotente: pode rodar mais de uma vez.
-- ============================================================================

insert into goted.organizations (id, nome, segmento)
values ('00000000-0000-4000-8000-000000000001', 'Empresa Demonstração Ltda.', 'Comércio e serviços')
on conflict (id) do nothing;

insert into goted.users (id, nome, email)
values ('00000000-0000-4000-8000-000000000002', 'Empresário Demo', 'contato@empresademo.com.br')
on conflict (id) do nothing;

insert into goted.organization_members (organization_id, user_id, role)
values ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'cliente')
on conflict do nothing;
