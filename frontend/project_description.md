# PedAir – Resumo do Projeto e Visão Geral

## Descrição do Projeto

PedAir é uma plataforma web de pesquisa clínica voltada para o desenvolvimento de Protocolos ERAS (Enhanced Recovery After Surgery) em cirurgia torácica pediátrica. O objetivo principal é coletar e analisar dados perioperatórios (pré-operatório, intraoperatório e pós-operatório) de crianças submetidas a procedimentos de via aérea, de forma a gerar recomendações baseadas em evidências para melhorar a segurança, reduzir complicações e otimizar o tempo de internação. Originalmente idealizado para dar suporte ao “Projeto Respirar” (cirurgias pediátricas de via aérea no estado de Alagoas), PedAir foi concebido como um sistema multi-projeto, capaz de atender múltiplos estudos simultaneamente, cada um com suas próprias regras de privacidade, formulários e papéis de acesso. A plataforma é projetada para ser utilizada primariamente por profissionais médicos em ambientes dinâmicos como o intraoperatório, exigindo, portanto, uma experiência de usuário (UX) ágil, com interfaces claras e de rápida identificação visual, e excelente compatibilidade com dispositivos móveis (tablets e smartphones) além de desktops.

## Objetivos de Pesquisa

1. **Desenvolver Protocolo ERAS Específico**
   Analisar dados antropométricos, clínicos e anestésicos coletados em tempo real para identificar fatores preditores de melhores desfechos em cirurgias torácicas pediátricas. A partir dessa análise, propor um Protocolo ERAS adaptado às particularidades dessa população.

2. **Ferramenta de Coleta Flexível**
   Criar um motor de formulários dinâmicos que permita pesquisadores definirem esquemas de coleta (campos, tipos de entrada, validações) sem necessidade de reprogramação. Esses formulários devem suportar entradas de profissionais (anestesiologistas, cirurgiões, enfermeiros) e de pacientes ou responsáveis (para dados de seguimento tardio).

3. **Governança Científica via RBAC**
   Permitir que cada projeto defina papéis personalizados (ex.: "Preceptor", "Pesquisador", "Enfermeiro", "Paciente") com permissões específicas para visualizar, editar, aprovar ou exportar dados, respeitando o desenho metodológico do estudo (estudos cegados, marcadores de boas práticas, auditorias internas).

4. **Rastreamento Pseudonimizado de Pacientes**
   Linkar múltiplas submissões do mesmo paciente sem nunca expor dados de identificação direta. Utilizar pseudonimização determinística (HMAC com salt e pepper) para que pesquisadores possam buscar registros por dados conhecidos (iniciais, sexo, data de nascimento) sem conhecer nem armazenar a identidade real.

5. **Consentimento e Recontact**
   Implementar um sistema de consentimento multilayer: consentimento genérico de projeto, consentimento específico de formulário e consentimento para recontacto. Cada projeto configura sua política (período de retenção, finalidade de recontacto, opt-in/opt-out), garantindo conformidade com LGPD.

6. **Notificações e Lembretes Automatizados**
   Integração com serviço de e-mail (Mailgun/SendGrid ou similar) para enviar lembretes a pacientes ou responsáveis, conforme cronogramas definidos (ex.: follow-up de 30 dias, convites para novas fases de estudo), respeitando consentimento e garantindo criptografia do contato.

## Visão de Arquitetura

### 1. Backend

* **Framework**: Flask (Python 3.10+), organizado em Blueprints para gerenciar projetos, formulários, usuários, submissões e notificações.

* **ORM**: SQLAlchemy, com migrações gerenciadas por Alembic (Flask-Migrate).

* **Banco de Dados**: PostgreSQL (hospedado no Supabase ou Render Managed), contendo:

  * `projects` (metadados de cada estudo, configurações de privacidade);
  * `forms` (definições de esquema JSON/JSON Schema para validação dinâmica);
  * `form_submissions` (armazenamento de respostas, campo JSONB, relacionando-se a `project_id` e `patient_id`);
  * `roles` e `user_roles` (papéis criados pelos líderes do projeto e permissões associadas);
  * `users` (contas com login Google OAuth, associadas a e-mail criptografado opcional);
  * `contact_log` (armazenamento de e-mails criptografados e registros de consentimento).

* **Pseudonimização**:

  ```python
  def generate_patient_id(dob, gender, initials, project_id, salt, pepper):
      raw = f"{dob}|{gender}|{initials}|{project_id}|{pepper}".encode()
      return hmac.new(salt.encode(), raw, hashlib.sha256).hexdigest()
  ```

  * `salt` e `pepper` são segredos mantidos em ambiente seguro;
  * Gera um `patient_id` determinístico para vínculo de múltiplas submissões sem expor a identidade real.

* **Autenticação & Autorização**:

  1. Usuário faz login com Google OAuth 2.0 → backend valida ID token via Authlib;
  2. Extrai `sub`, `email`, `name`; cria ou recupera usuário em tabela `users` (campo `approved` indica se já foi autorizado a participar);
  3. Emite JWT (Flask-JWT-Extended) com claims:

     ```json
     {
       "sub": user_id,
       "email": "user@example.com",
       "roles": ["preceptor"],  
       "project_id": "id_do_projeto",
       "exp": 1718000000
     }
     ```
  4. Cada endpoint REST exige JWT válido e checa claims para confirmação de papéis/p permissões no `project_id`.

* **HTTPS & Segurança**:

  * Padrão WSGI com Gunicorn, HTTPS via Let's Encrypt (se em VPS) ou TLS automático (PaaS);
  * Variáveis de ambiente seguras para segredos (Render Secrets, supabase env vars, Docker Secrets se VPS);
  * Logs de auditoria para cada acesso a `patient_id` e cada envio/edição de formulário, registrados em tabela dedicada (`access_logs`) por no mínimo 180 dias.

* **Migrações e Deploy**:

  * Estrutura de migração via `flask db migrate` / `flask db upgrade` contra Supabase;
  * Deploy em Render.com (serviço Web Flask + PostgreSQL gerenciado) e serviço Static Site para frontend, configurado em `render.yaml` ou painel web.

### 2. Frontend

* **Framework**: React 19 + TypeScript + Vite + Tailwind CSS.

* **Gerenciamento de estado**: Context API ou Zustand para compartilhar o JWT e informações do usuário/papéis entre componentes.

* **Formulários Dinâmicos**:

  * Backend fornece o JSON Schema de cada formulário cadastrado;
  * Frontend renderiza entradas conforme tipo (number, text, checkbox, radio, select, stepper, autocomplete);
  * Validações client-side via bibliotecas JSON Schema para feedback em tempo real.
  * A renderização dos campos de formulário priorizará a usabilidade em telas sensíveis ao toque, explorando diversos métodos de entrada de dados para além do teclado (ex: sliders para escalas numéricas, seletores de tempo interativos, steppers), visando minimizar a necessidade de digitação e agilizar o preenchimento em contextos clínicos.

* **Principais Páginas/Fluxos**:

  1. **Dashboard de Projetos**: lista os projetos do usuário, papéis e métricas rápidas (nº de formulários pendentes, próximos follow-ups);
  2. **Construtor de Formulários**: UI para criar/editar JSON Schema, arrastar campos, definir rótulos, validações e lógica condicional;
  3. **Editor de Papéis**: define novos papéis, associa permissões (visualizar determinados formulários, editar, exportar, aprovar submissões);
  4. **Submissão de Dados Clínicos**: carrega um formulário dinâmico, captura inputs, e envia via POST `/api/projects/:id/forms/:form_id/submissions`;
  5. **Busca de Paciente Pseudonimizado**: recebe "inicial + sexo + DOB + project\_id" como input, envia para `/api/projects/:id/patients/search`, backend re-recalcula hash e retorna submissões vinculadas.
  6. **Agendamento de Notificações**: tela para configurar regras de e-mail (ex.: "30 dias após alta" → enviar lembrete), gerando tarefas cron integradas ou utilizando API de agendamento do PaaS.

* **Comunicação com Backend**:

  * Todas as chamadas enviam cabeçalho `Authorization: Bearer <JWT>`;
  * Variável `VITE_API_URL` configurada em `.env` para apontar ao deploy do backend.

---

## Privacidade, Consentimento e Conformidade LGPD

1. **Pseudonimização Determinística**

   * Gerar `patient_id` por HMAC usando salt e pepper;
   * Esse ID serve para linkar múltiplas submissões sem expor identidade.

2. **Consentimento Multicamadas**

   * **Consentimento de Projeto**: no momento do primeiro acesso, perguntar "Aceito que meus dados sejam usados para pesquisa X?";
   * **Consentimento de Formulário**: cada formulário pode ter campos de consentimento específicos ("Aceito fornecer dados de comorbidades");
   * **Consentimento de Recontacto**: checkbox dedicado para que pacientes responsáveis permitam o envio de lembretes ou convites para fases futuras.

3. **Armazenamento de E-mails**

   * Só se coletar e-mail se paciente/responsável marcar consentimento explícito;
   * E-mail armazenado em `contact_log` criptografado com AES-256 via `cryptography.fernet`;
   * Chave de criptografia mantida em ambiente seguro, nunca exposta em código ou logs.

4. **Política de Retenção e Exclusão**

   * Definida no perfil de privacidade do projeto (`privacy_profile.expires_after_days`);
   * Após o vencimento, dados de contato são destruídos, e formulários permanecem pseudonimizados;
   * Consentimento expirado é removido ou marcado como inválido.

5. **Registro de Auditoria**

   * Toda busca por `patient_id`, edição de formulários e envio de notificações é logado com: `user_id`, `timestamp`, `project_id`, `action`, `target_patient_id_hash`;
   * Logs retidos conforme exigência mínima de 180 dias para fins de conformidade e auditoria.

---

## Papéis, Permissões e Governança Científica

* Cada projeto tem tabelas `roles` e `user_roles` que definem papéis arbitrários criados pelo líder (ex.: "Preceptor A", "Pesquisador B", "Auditor C", "Paciente D").

* Cada papel associa uma lista de permissões, por exemplo:

  * **Visualizar Formulários**: definir quais `form_id` podem ser vistos;
  * **Submissão/edição**: conceder ou negar direito de criar/editar submissões;
  * **Exportação**: permitir download de CSV/JSON de dados pseudonimizados;
  * **Gerenciamento de Membros**: designar usuários a papéis.

* Backend verifica, a cada requisição, se o JWT possui o papel correto no `project_id` para executar a ação solicitada.

---

## Fluxo de Uso (Exemplo)

1. **Criação de Novo Projeto**

   * Pesquisador requisita "Novo Projeto ERAS Pediátrico".
   * Define configurações de privacidade (pseudonimização, recontacto, consentimento) e escolhe papéis iniciais.
   * Convida colaboradores (préceptor, enfermeira, estatístico) definindo papéis e permissões iniciais.

2. **Configuração de Formulários**

   * Pesquisador X cria "Formulário Pré-Operatório" com campos: idade, peso, sexo, diagnósticos (autocomplete), comorbidades, queixas.
   * Validações definidas (ex.: peso > 0, idade entre 0 e 18).
   * Em seguida, cria "Formulário Intra-Operatório" (procedimento, fármacos, intercorrências) e "Formulário Recuperação" (tempo de recuperação, intercorrências pós-op).

3. **Coleta de Dados Iniciais**

   * Anestesiologista A faz login com Google; carrega "Formulário Pré-Operatório"; preenche dados do paciente (iniciais "JS", sexo "M", DOB "2017-02-04");
   * Se houver consentimento, coleta e-mail (criptografado no `contact_log`);
   * Backend gera `patient_id` via HMAC e armazena submissão vinculada.

4. **Submissões Posteriores**

   * No dia da cirurgia, Anestesiologista A abre "Formulário Intra-Operatório" e, ao inserir "JS|M|2017-02-04", o sistema gera o mesmo `patient_id` e vincula nova submissão.

5. **Busca e Edição de Dados**

   * Preceptor B, no painel, acessa "Buscar Paciente" e digita "JS|M|2017-02-04".
   * Backend recompila hash e retorna todas as submissões pseudonimizadas; Preceptor nunca vê e-mail ou dados que permitam identificação direta.

6. **Follow-up e Lembretes**

   * Uma tarefa agendada (cron ou job no PaaS) consulta diariamente "Quais `patient_id` têm `next_followup_date <= hoje`?"
   * Para cada, busca e-mail criptografado em `contact_log`, decripta em memória e envia lembrete "Por favor, preencha avaliação de recuperação aos 30 dias".

7. **Exportação e Análise**

   * Statistician C (papel "estatístico") gera CSV com todas as submissões pseudonimizadas de "Formulário Intra-Operatório", inclui `patient_id` apenas para análise de coorte, sem identificação real.

---

## Próximos Passos

1. **Revisar Políticas de Privacidade por Projeto**

   * Ajustar o `privacy_profile` para cada estudo, garantindo LGPD (conceito de "legítimo interesse" ou "consentimento") e definindo regras de recontacto, retenção e exclusão.

2. **Implementar Módulo de Pseudonimização**

   * Adicionar funções de HMAC com salt e pepper, gerenciar rotacionamento de chave, configurar secrets no ambiente de produção.

3. **Construir Backend de Autenticação e RBAC**

   * Configurar Google OAuth, criar tabelas `roles`, `user_roles`, implementar decorators para verificação de permissões.

4. **Desenvolver Construtor de Formulários Dinâmicos**

   * Criar UI no React que edite esquemas JSON/JSON Schema, defina validações, rótulos e lógica condicional.

5. **Implementar Sistema de E-Mail Criptografado e Agendamento**

   * Configurar `cryptography.fernet` para criptografar e-mails, desenvolver serviço de agendamento de lembretes (cron interno ou PaaS).

6. **Auditoria e Logs**

   * Garantir que cada busca por `patient_id`, edição, e envio de notificações seja logado, com retenção mínima de 180 dias.

7. **Teste e Validação**

   * Criar cenários de teste para fluxos principais:

     * Cadastro de projetos/formulários
     * Submissão de dados iniciais e subsequentes
     * Busca pseudonimizada de pacientes
     * Envio de notificações e análise de logs
     * Fluxos de consentimento, revogação e exclusão de dados.

---

PedAir entrega aos pesquisadores uma **infraestrutura de pesquisa orientada por dados** que captura dados clínicos de forma ética e segura, permitindo coletas personalizadas, análises avançadas e governança científica, tudo em conformidade com LGPD.

---

## Visão de Longo Prazo e Evolução Contínua

Além dos próximos passos imediatos, PedAir contempla evoluções futuras para aprimorar ainda mais a coleta e análise de dados:

1.  **Entrada de Dados Inteligente (Pós-MVP):**
    *   **Transcrição de Voz:** Integração com APIs de reconhecimento de voz para permitir que profissionais preencham campos do formulário através de comandos falados, aumentando a agilidade e permitindo o uso com as mãos livres.
    *   **Parseamento de Documentos (PDFs):** Desenvolvimento de funcionalidades para extrair informações relevantes de documentos existentes (ex: laudos em PDF) para pré-preenchimento de formulários, otimizando o tempo do pesquisador.

2.  **Analytics Avançado e Dashboards Interativos:**
    *   Expansão das capacidades de visualização de dados com dashboards mais interativos e personalizáveis para análise de coortes e identificação de tendências.

3.  **Interoperabilidade e Integração:**
    *   Exploração de integrações com outros sistemas hospitalares ou de pesquisa (ex: via HL7 FHIR ou APIs customizadas), respeitando as políticas de privacidade e segurança.
