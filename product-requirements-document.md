# 📌 Product Requirements Document (PRD) - Markado

---

## 📖 App Overview

Markado é uma aplicação web que simplifica o agendamento e gestão de serviços profissionais, permitindo aos usuários configurarem suas disponibilidades, categorizarem serviços, gerenciarem pagamentos e monitorarem relatórios de desempenho de forma eficiente.

**Exemplos de referência:**
- [Markado](https://markado.co)
- [Calendly - Exemplo](https://calendly.com/marcaum/design)

---

## 🔄 User Flows

### 1. Onboarding
- Cadastro inicial e configuração básica do usuário (email, senha, informações pessoais, integração com apps externos).

### 2. Agendamento
- Visualização e gestão de reuniões agendadas.
- Solicitações de remarcação e alteração de detalhes do evento.

### 3. Disponibilidade
- Configuração de horários disponíveis para agendamentos.
- Personalização por dias e intervalos específicos.

### 4. Serviços
- Criação e categorização dos serviços oferecidos.
- Detalhamento de serviços como preço, duração, localização e funcionários envolvidos.

### 5. Relatórios
- Relatórios e dashboards com métricas de agendamentos marcados, remarcados, cancelados, e faturamento.
- Análises financeiras detalhadas por serviço.

### 6. Configurações
- Gestão das informações pessoais, segurança, integração com apps externos, métodos de pagamento e configurações avançadas.

### 7. Preview do Serviço
- Interface cliente para seleção de serviço, data, horário e detalhes adicionais necessários para realizar o agendamento.

---

## 🛠️ Tech Stack & APIs

### Front-end
- React.js (Next.js)
- Tailwind CSS
- Shadcn/ui Component Library

### Back-end
- Node.js (Express)
- Banco de Dados: PostgreSQL ou MongoDB

### APIs e Integrações
- Google Calendar API
- Stripe API (pagamentos)
- Zoom API (para agendamentos com vídeo conferência)
- Google Meet API

---

## ✅ Core Features

- **Agendamento:** Gestão completa de reuniões e eventos.
- **Disponibilidade:** Controle dos horários para atendimentos.
- **Serviços:** Organização clara e gestão dos tipos de serviços prestados.
- **Pagamentos:** Recebimento através de Stripe ou outros métodos integrados.
- **Relatórios:** Dashboard para acompanhar o desempenho financeiro e operacional.

---

## 📦 Escopo

### Dentro do Escopo
- Todos os requisitos descritos explicitamente no contrato.
- Features essenciais para agendamento, criação de disponibilidade, gerenciamento de serviços e pagamentos.

### Fora do Escopo (Próximo MVP)
- Funcionalidades relacionadas à gestão de equipes e colaboradores.
- Ferramentas avançadas de colaboração interna e multiusuários.

---

⚠️ **Nota:** Este documento serve como guia para desenvolvimento e validação, ajudando a garantir precisão e clareza na comunicação entre equipes técnicas e de produto, reduzindo assim as ambiguidades e alucinações de AI durante o workflow.

