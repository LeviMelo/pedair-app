# CREST – Clinical REsearch Study Tool

## Descrição do Projeto

CREST (Clinical REsearch Study Tool) é uma plataforma web de pesquisa clínica voltada para o desenvolvimento de Protocolos ERAS (Enhanced Recovery After Surgery) em cirurgia torácica pediátrica. Seu propósito principal é coletar e analisar dados perioperatórios (pré-operatório, intraoperatório e pós-operatório) de crianças submetidas a procedimentos de via aérea, de forma a gerar recomendações baseadas em evidências para melhorar a segurança, reduzir complicações e otimizar o tempo de internação. Originalmente concebido para dar suporte ao "Projeto Respirar" (cirurgias pediátricas de via aérea no estado de Alagoas), PedAir foi projetado desde o início como um sistema **multi-projeto**, capaz de atender simultaneamente a múltiplos estudos, cada um com:

* Suas próprias regras de privacidade (incluindo políticas de LGPD),
* Seus próprios formulários (esquemas JSON/JSON Schema dinâmicos),
* E papéis de acesso completamente personalizáveis pelo líder do projeto.

A plataforma é voltada para uso primário por profissionais médicos em ambientes dinâmicos (como o intraoperatório), exigindo uma experiência de usuário (UX) ágil, interfaces de rápida identificação visual e excelente compatibilidade com dispositivos móveis (tablets e smartphones), além de desktops.

### Público-Alvo e Cenários de Uso

1. **Pesquisadores e Líderes de Estudo**
   • Criam projetos de pesquisa (ex.: "ERAS Pediátrico no Hospital X")
   • Definem políticas de consentimento, pseudonimização e retenção de dados
   • Configuram papéis específicos (ex.: "Preceptor", "Pesquisador Cego", "Enfermeiro")

2. **Profissionais de Saúde (Anestesistas, Cirurgiões, Enfermeiros)**
   • Preenchem formulários estruturados em tempo real (pré, intra e pós-operatório)
   • Utilizam dispositivos móveis ou tablets em ambiente clínico

3. **Pacientes ou Responsáveis**
   • Recebem tokens únicos (sem login) para responder formulários de seguimento (ex.: 30 dias após alta)
   • Podem fornecer consentimento e optar por receber lembretes por e-mail ou WhatsApp
   • Não têm acesso ao painel completo, apenas a links/token para preencher questionários

4. **Auditores e Colaboradores Externos**
   • Consultam dados pseudonimizados para análise de coorte, relatórios, exportações (sem identificar o paciente)
   • Verificam logs de auditoria para garantir conformidade científica e regulamentar

## Objetivos de Pesquisa

1. **Desenvolver Protocolo ERAS Específico**
   Analisar dados antropométricos, clínicos e anestésicos coletados em tempo real para identificar fatores preditores de melhores desfechos em cirurgias torácicas pediátricas. A partir dessa análise, propor um Protocolo ERAS adaptado às particularidades dessa população.

2. **Ferramenta de Coleta Flexível**
   Criar um motor de formulários dinâmicos (JSON/JSON Schema) que permita pesquisadores definirem esquemas de coleta (campos, tipos de entrada, validações, lógica condicional) sem necessidade de reprogramação. Esses formulários devem suportar entradas de profissionais (anestesiologistas, cirurgiões, enfermeiros) e de pacientes ou responsáveis (para dados de seguimento tardio).

3. **Governança Científica via RBAC Personalizado**
   Permitir que cada projeto defina papéis totalmente personalizados (ex.: "Preceptor", "Pesquisador Cego", "Coordenador de Campo", "Paciente") com permissões finas para visualizar, editar, aprovar ou exportar dados, respeitando o desenho metodológico do estudo (estudos cegados, ensaios clínicos randomizados, coortes, auditorias internas).

4. **Rastreamento Pseudonimizado de Pacientes**
   Linkar múltiplas submissões do mesmo paciente sem nunca expor dados de identificação direta. Utilizar pseudonimização determinística (HMAC-SHA256 com salt e pepper) para que pesquisadores busquem registros por dados conhecidos (iniciais, sexo, DOB, ID do projeto) sem armazenar ou conhecer a identidade real.

5. **Consentimento e Recontact**
   Implementar um sistema de consentimento multilayer:

   * **Consentimento de Projeto**: Aceitação geral de uso dos dados para pesquisa "X".
   * **Consentimento de Formulário**: Cada formulário pode ter cláusulas específicas ("Aceito fornecer dados de comorbidades").
   * **Consentimento de Recontacto**: Checkbox dedicado para permitir lembretes ou convites futuros.
     Cada projeto configura sua política (tempo de retenção, finalidade do recontacto, opt-in/opt-out), garantindo conformidade com a LGPD.

6. **Notificações e Lembretes Automatizados**
   Integração com serviço de e-mail (Mailgun, SendGrid ou similar) e, futuramente, WhatsApp Business API, para:

   * Enviar lembretes a pacientes ou responsáveis conforme cronogramas definidos (ex.: follow-up de 30 dias, convite a nova fase de estudo), sempre respeitando consentimento e criptografando o contato.
   * Suportar canais alternativos (SMS, WhatsApp) conforme flexibilidade de cada projeto e preferências regionais.

---

## Visão de Arquitetura

### 1. Backend

* **Framework**: Flask (Python 3.10+), organizado em Blueprints para separar lógicas de "projetos", "formulários", "usuários", "submissões", "notificações" e "auditoria".

* **ORM**: SQLAlchemy, com migrações gerenciadas por Alembic (via Flask-Migrate).

* **Banco de Dados**: PostgreSQL (hospedado no Supabase ou Render Managed), contendo tabelas principais:

  * `projects`: metadados de cada estudo, configurações de privacidade (JSONB), políticas de LGPD, preferências de notificação.
  * `forms`: cada registro armazena um `schema` (JSON Schema), `ui_schema` (configurações de widget), versão, e metadados (nome, descrição, visibilidade).
  * `form_submissions`: armazenamento de respostas, campo JSONB com os dados preenchidos, relaciona-se a `project_id`, `form_id`, `patient_id` e versão do schema.
  * `patients`: armazena apenas o `patient_id` (hash), data de criação, projeto associado, consentimentos, e relaciona—se a `contact_log` (caso habilitado).
  * `users`: contas de login (Google OAuth 2.0), armazenando `sub` (ID do Google), `email` criptografado (opcional), `approved` (boolean), data de cadastro.
  * `roles` e `user_roles`: definem papéis específicos para cada `project_id`. Por exemplo, "Preceptor A" tem X permissões, "Pesquisador Cego" tem Y, "Paciente" tem Z (limitado).
  * `contact_log`: registro de e-mails criptografados (AES-256 via `cryptography.fernet`) e data/hora de envio, consentimento específico de recontacto.
  * `access_logs`: auditoria de cada ação crítica (ex.: busca por `patient_id`, exportação de dados, modificação de schema, envio de notificações), contendo: `log_id`, `user_id`, `project_id`, `action`, `target_id` (se aplicável), `timestamp`, `IP` (opcional, para segurança) e `old_data`/`new_data` (para diffs básicos).

* **Pseudonimização**:

  ```python
  import hmac, hashlib

  def generate_patient_id(dob: str, gender: str, initials: str, project_id: str, salt: str, pepper: str) -> str:
      raw = f"{dob}|{gender}|{initials}|{project_id}|{pepper}".encode('utf-8')
      return hmac.new(salt.encode('utf-8'), raw, hashlib.sha256).hexdigest()
  ```

  * `salt` e `pepper` são segredos mantidos em ambiente seguro (Render Secrets, Supabase env vars ou Docker Secrets).
  * Para **exportação**, aplica-se um novo hash transitório sobre `patient_id` para gerar `export_patient_id`, garantindo que o `patient_id` original nunca saia do backend.

* **Autenticação & Autorização (RBAC)**:

  1. Usuário faz login via **Google OAuth 2.0** (biblioteca Authlib).
  2. Backend valida ID token, extrai `sub`, `email`, `name`; cria ou recupera registro em `users`.
  3. Emite um **JWT** (via Flask-JWT-Extended) com claims:

     ```json
     {
       "sub": "<user_id_do_banco>",
       "email": "user@example.com",
       "roles": ["preceptor"],       // papéis ativos no contexto de um projeto
       "project_id": "<id_do_projeto>",
       "exp": 1718000000
     }
     ```
  4. Cada endpoint REST exige JWT válido. Antes de executar a ação, verifica-se nos `roles` e `user_roles` se o usuário possui permissão para aquela rota, naquele projeto (por exemplo, `can_edit_schema`, `can_submit_form`, `can_view_patient_data`).

* **HTTPS & Segurança**:

  * **Gunicorn + Nginx (ou TLS automático do PaaS)** para expor via HTTPS.
  * Configurar cabeçalhos de segurança (CSP, HSTS, X-Content-Type).
  * Segredos (salt, pepper, chaves de criptografia) em variáveis de ambiente seguras.
  * **Logs de auditoria** gravados em `access_logs`, retidos por no mínimo 180 dias.
  * Validação estrita de JSON Schema no backend para impedir injeções de campos extras ou maliciosos.

* **Migrações e Deploy**:

  * Uso de **Flask-Migrate** (`flask db migrate` / `flask db upgrade`) contra o banco remoto (Supabase ou Render Managed).
  * Deploy contínuo via GitHub → Render.com:

    * Serviço "Web Service" para o backend Flask (build: `pip install -r requirements.txt`; start: `gunicorn run:app --bind 0.0.0.0:10000`).
    * Serviço "Static Site" para frontend (build: `yarn build`; publish: `dist/`).
    * Variáveis de ambiente configuradas no painel do Render.

---

### 2. Frontend

* **Framework**: React 19 + TypeScript + Vite + Tailwind CSS.

* **Gerenciamento de Estado**:

  * **Zustand** para armazenar globalmente: JWT, informações do usuário, papéis ativos, `project_id` selecionado, e o estado de submissões de dados em progresso (incluindo dados de pacientes e dados de múltiplos formulários).
  * Estados locais em cada componente/formulário para controle de dados em tempo real antes de serem consolidados no estado global.

* **Formulários Dinâmicos** (JSON Schema + uiSchema):

  * O backend expõe, para cada `project_id` e `form_id`, um objeto JSON contendo:

    ```json
    {
      "schema": { /* JSON Schema com tipos, enum, required */ },
      "uiSchema": { /* mapeamento de widget, opções, placeholders */ }
    }
    ```
  * O frontend consome esse JSON e renderiza cada campo conforme especificado:

    * Tipos básicos: `number`, `string`, `boolean`, `array`, `object`.
    * Widgets especializados: `InputFieldWidget`, `SelectFieldWidget`, `RadioGroupWidget`, `CheckboxGroupWidget`, `StepperWidget`, `AutocompleteTagSelectorWidget`, `DrugSectionWidget`, etc.
    * Validações client-side (via bibliotecas JSON Schema) para impedir envio de dados inválidos.

* **Princípios de UX em Ambiente Clínico**:

  * **Toque e Gestos**: campos grandes, botões bem espaçosos, steppers e sliders para input rápido.
  * **Feedback Imediato**: validações em tempo real, mensagens de erro claras em destaque.
  * **Compatibilidade Móvel**: layouts fluidos que se ajustam a tablets e smartphones com tela sensível ao toque.
  * **Carregamento Integral de Formulários Individuais**: Para máxima agilidade, cada formulário *dentro de uma sequência de coleta* deve ser carregado integralmente de uma só vez. A navegação por passos ou seções que demandem cliques adicionais *dentro de um mesmo formulário* deve ser evitada.
  * **Fluxo de Coleta Sequencial Multi-Formulário por Paciente**: Para um determinado paciente, a coleta de dados pode envolver uma sequência de múltiplos formulários (ex: Pré-operatório -> Intraoperatório -> Pós-operatório). A interface deve guiar o usuário através desta sequência, permitindo avançar para o próximo formulário ou retornar ao anterior. O progresso deve ser salvo continuamente, permitindo que o usuário pause a coleta e a retome posteriormente do mesmo ponto.
  * **Múltiplos Formulários por Paciente (Visão Futura)**: Considerar a capacidade de carregar e alternar entre múltiplos formulários relacionados ao mesmo paciente em uma interface unificada, para contextos onde diferentes coletas precisam ser acessadas em sequência rápida.

* **Principais Páginas / Fluxos**:

  1. **Dashboard de Projetos**

     * Exibe lista de projetos do usuário, papéis, contadores de formulários pendentes e próximos follow-ups.
     * Botão "Criar Novo Projeto" (sempre visível para usuários com permissão).

  2. **Construtor de Formulários (Form Builder)**

     * Interface de arrastar e soltar (drag & drop) componentes para criar ou editar JSON Schema.
     * Definição de rótulos, placeholders, regras de validação, lógica condicional (ex.: "se campo A = X, exibir campo B").
     * Controle de versão: cada alteração gera uma nova versão do schema; possibilidade de manter versões antigas ativas para submissões históricas.

  3. **Editor de Papéis (Role Editor)**

     * Criar/editar papéis exclusivos para cada projeto (nome, descrição).
     * Atribuir permissões finas (por formulário, por ação — ex.: `can_view_any_submission`, `can_export_cohort_data`, `can_manage_users`).
     * Listar membros atuais, convidar novos usuários (e definir papel inicial).

  4. **Submissão de Dados Clínicos**

     * **Início da Coleta**: O processo inicia com a inserção de dados básicos de identificação do paciente (iniciais, sexo, DOB) e o registro de consentimentos necessários (inicialmente simulado, com lógica de validação complexa a ser desenvolvida).
     * **Sequência de Formulários**: Uma vez identificada a necessidade de coleta (ex: novo paciente para um protocolo específico), o sistema apresenta uma sequência predefinida de formulários (ex: Pré-Anestesia, seguido por Intraoperatório, etc.).
     * **Preenchimento Individual**: Cada formulário na sequência é carregado dinamicamente (JSON Schema + uiSchema) e apresentado integralmente para preenchimento.
     * **Navegação e Persistência**: O usuário pode navegar entre os formulários da sequência (próximo/anterior). Todo o progresso (dados do paciente e dados de cada formulário preenchido ou parcialmente preenchido) é salvo de forma persistente (utilizando Zustand e potencialmente armazenamento local/backend para rascunhos), permitindo que a submissão seja interrompida e retomada posteriormente.
     * **Envio Final**: Ao final da sequência, ou quando todos os formulários mandatórios estiverem completos, os dados consolidados são submetidos.
     * Backend gera `patient_id` (HMAC) e armazena cada submissão de formulário com `patient_id`, `user_id`, `timestamp`, e a versão do schema do formulário específico.

  5. **Busca de Paciente Pseudonimizado**

     * Usuário preenche "iniciais + sexo + DOB + project\_id" em um campo único.
     * Frontend envia GET para `/api/projects/:project_id/patients/search?initials=JS&gender=M&dob=2017-02-04`.
     * Backend recalcula hash e retorna todas as submissões vinculadas a esse `patient_id` (lista de `submission_id`, `form_id`, data, status).
     * O usuário (se tiver permissão, ex.: `can_view_any_submission`) pode abrir cada submissão sem ver dados identificadores diretos.

  6. **Agendamento de Notificações**

     * UI para configurar regras de lembrete: "X dias após data Y", "Dia fixo do mês", "Aniversário do procedimento".
     * Cada regra gera uma tarefa agendada (cron interno ou via PaaS scheduler).
     * Quando chega o momento, backend consulta `patient_id` com `next_followup_date <= hoje`; busca e-mail/WhatsApp (descriptografa em memória) e dispara mensagem.
     * Cria registro em `contact_log` para auditoria (quem enviou, quando, canal, resposta, se houver).

* **Comunicação com Backend**:

  * Todas as chamadas HTTP usam cabeçalho `Authorization: Bearer <JWT>`.
  * Variável de ambiente `VITE_API_URL` definida em `.env` para apontar ao endpoint do deploy (ex.: `https://api.pedair.com`).
  * Timeout, retry e tratamento de erros globais via interceptors (axios/fetch wrapper).

---

## Privacidade, Consentimento e Conformidade LGPD

1. **Pseudonimização Determinística**

   * Cada submissão armazena apenas `patient_id` (hash de HMAC com salt e pepper).
   * O usuário não vê nem envia `patient_id` diretamente.
   * Para exportação, aplica-se um hash transitório:

     ```python
     export_patient_id = sha256(patient_id + export_salt).hexdigest()
     ```
   * Não há mapeamento reverso neste último hash; portanto, dados exportados continuam agrupáveis sem risco de identificação.

2. **Consentimento Multicamadas**

   * **Consentimento de Projeto**: Ao entrar no projeto pela primeira vez (usuário ou paciente), exibe-se banner: "Aceito que meus dados sejam usados para pesquisa X?"
   * **Consentimento de Formulário**: Cada formulário pode conter um bloco de consentimento específico (ex.: "Aceito fornecer informações de histórico familiar").
   * **Consentimento de Recontacto**: Checkbox obrigatório para que paciente/responsável autorize envio de e-mails/WhatsApp. Se marcado, exibe campo para "Digite seu e-mail" (com validação de confirmação) ou "Número de WhatsApp".
   * O consentimento fica registrado em tabela própria, relacionando `patient_id`, `form_id`, `consent_type`, `timestamp`, `valid_until` (se houver expiração).
   * Se o paciente revoga o consentimento, bloqueiam-se todos os fluxos de notificação e, se necessário, seus dados podem ser excluídos (conforme configuração do projeto).

3. **Armazenamento de E-mails e Contatos**

   * Coletar **somente se consentido**.
   * E-mails são salvos em `contact_log` de forma **criptografada com AES-256** (biblioteca `cryptography.fernet`).
   * Chave de criptografia mantida em ambiente seguro, nunca exposta em código ou logs.

4. **Política de Retenção e Exclusão**

   * Definida em `privacy_profile.expires_after_days` por projeto.
   * Após vencimento, **os dados de contato são destruídos** permanentemente e as submissões continuam apenas com `patient_id` pseudonimizado.
   * Consentimentos expirados ou revogados ficam marcados como "inválidos" e não aparecem em buscas de recontacto.

5. **Registro de Auditoria**

   * Tabela `access_logs` armazena cada ação crítica:

     * Busca por `patient_id`
     * Edição de submissões
     * Envio de notificações
     * Criação/alteração de formulários e roles
     * Exportações de dados
   * Cada log inclui: `user_id`, `project_id`, `action`, `target_patient_id_hash`, `timestamp`, `IP` (opcional).
   * Logs retidos por no mínimo 180 dias para fins de auditoria e compliance.

---

## Papéis, Permissões e Governança Científica

* Cada projeto possui tabelas `roles` e `user_roles` que definem papéis arbitrários criados pelo líder:

  * Por exemplo, "Preceptor A", "Pesquisador B", "Coordenador de Campo", "Paciente".
  * Cada papel recebe um conjunto de permissões modulares, tais como:

    * **Visualizar Submissões** (`can_view_submissions`)
    * **Criar/Editar Formularios** (`can_edit_schema`)
    * **Enviar Notificações** (`can_send_notifications`)
    * **Exportar Dados** (`can_export_data`)
    * **Gerenciar Membros** (`can_manage_users`)
    * **Realizar Búsqueda Pseudonimizada** (`can_search_patient`)
  * O **Project Lead** (criador do projeto) recebe, por padrão, todas as permissões e pode:

    * Convidar novos usuários por e-mail (cria link único de convite).
    * Atribuir papéis e permissões específicas a cada membro.
    * Editar políticas de privacidade, consentimento e retenção.

* **Fluxo de autorização**:

  1. Usuário faz login via Google.
  2. Ao tentar acessar um recurso, o backend:

     * Decodifica JWT, extrai `sub` (user\_id), `project_id` e lista de `roles`.
     * Checa em `user_roles` se esse `user_id` tem permissão para a ação naquele `project_id`.
     * Se autorizado, executa; caso contrário, retorna HTTP 403.

---

## Fluxo de Uso (Exemplo Ilustrativo)

1. **Criação e Configuração de Novo Projeto**

   * Pesquisador A (Project Lead) clica em "Criar Novo Projeto" no Dashboard.
   * Preenche metadados: nome do estudo, descrição, políticas de LGPD (base legal, período de retenção, regras de recontacto).
   * Define papéis iniciais: "Preceptor", "Pesquisador Cego", "Enfermeiro", "Paciente".
   * Configura permissões de cada papel (por exemplo, "Pesquisador Cego" não vê dados sensíveis, apenas dados essenciais para análise).

2. **Definição de Formulários e Versões**

   * No "Form Builder", Pesquisador A importa o esquema JSON dos formulários tradicionais de ERAS (Pré-Operatório, Intra-Operatório, Pós-Operatório).
   * Ajusta validações, adiciona campos de consentimento e configura lógica condicional (ex.: apenas exibir "Dados de Longo Prazo" se "Consentimento de Recontacto" estiver marcado).
   * Publica a versão 1 do "Formulário Pré-Operatório" (form\_id = 123, version = 1).
   * Posteriormente, ao precisar coletar um campo adicional (ex.: "Intercorrências Cardiovasculares"), cria a versão 2 desse mesmo formulário, definindo script de migração (optionally) ou mantendo as duas versões ativas simultaneamente.

3. **Convite de Colaboradores**

   * Pesquisador A convida Ana (Enfermeira B) e Bruno (Estatístico C) por e-mail.
   * Enfermeira B recebe link de convite, faz login via Google e é atribuída ao papel "Enfermeiro" (permissões: `can_submit_form`, `can_view_patient_summary`).
   * Estatístico C recebe convite, faz login e recebe papel "Pesquisador Cego" (permissão: `can_export_data`, mas não vê campos que possibilitam identificar o paciente).

4. **Coleta de Dados Iniciais (Formulário Pré-Operatório)**

   * No dia do pré-operatório, Ana (Enfermeira B) clica em "Submeter Formulário" e escolhe "Formulário Pré-Operatório" (versão 2).
   * Preenche: iniciais "JS", sexo "M", DOB "2017-02-04", idade, peso, diagnósticos (autocomplete), comorbidades (tags), queixas.
   * Assinala "Aceito receber lembretes por e-mail" e digita "[joao.pai@example.com](mailto:joao.pai@example.com)". Ana clica em "Enviar".
   * O backend:

     1. Gera `patient_id = HMAC-SHA256( "2017-02-04|M|JS|project123|pepper", salt )`.
     2. Criptografa "[joao.pai@example.com](mailto:joao.pai@example.com)" via `Fernet` e registra em `contact_log`.
     3. Grava em `form_submissions` o JSON com `form_data`, `version=2` e `patient_id`.

5. **Coleta Intraoperatória (Formulário Intra-Operatório)**

   * No dia da cirurgia, o anestesiologista Dr. C faz login, abre "Formulário Intra-Operatório", digita "JS|M|2017-02-04" nos campos iniciais.
   * O frontend envia apenas `patient_input`; o backend recalcula o mesmo `patient_id` e preenche o `patient_id` nos dados.
   * Dr. C preenche todo o restante (procedimento, fármacos, intercorrências) e clica em "Enviar".
   * Esse registro fica vinculado automaticamente ao mesmo paciente.

6. **Busca e Edição de Submissões**

   * O Preceptor (com permissão `can_search_patient`) acessa "Buscar Paciente", insere "JS|M|2017-02-04".
   * Backend verifica permissão, recalcula `patient_id` e retorna lista de todas as submissões (Pré, Intra, Pós).
   * Preceptor clica em cada submissão para ver detalhes (campos anonimizados), sem jamais visualizar dados que permitam identificar diretamente o paciente.

7. **Follow-up e Lembretes Automatizados**

   * Na configuração de notificações, Pesquisador A definiu: "Enviar lembrete 30 dias após a data da cirurgia".
   * Um job diário no backend verifica:

     ```sql
     SELECT patient_id, contact_info
       FROM form_submissions
       WHERE form_id = <intra_id> 
         AND submission_date + interval '30 days' <= NOW()
         AND consent_recontact = true;
     ```
   * Para cada resultado, descriptografa o e-mail de `contact_log` e dispara mensagem "Por favor, preencha o Formulário de Avaliação aos 30 dias".
   * Registra cada envio em `access_logs`.

8. **Exportação e Análise de Microdados**

   * O Estatístico C (papel `can_export_data`) acessa "Exportar Dados" e seleciona "Formulário Intra-Operatório" → gera CSV.
   * Antes de retornar, o backend:

     1. Agrupa por `patient_id`.
     2. Para cada `patient_id`, calcula `export_patient_id = SHA256(patient_id + export_salt)`.
     3. Substitui todas as colunas de `patient_id` pelo `export_patient_id`.
   * O CSV contém: `export_patient_id`, dados clínicos (sem nenhum campo livre de texto que possa identificar) e `form_version`.
   * Estatístico faz download e analisa sem nunca saber quem é "JS".

---

## Próximos Passos

1. **Revisar Políticas de Privacidade por Projeto**

   * Ajustar cada `privacy_profile` para garantir LGPD (legítimo interesse vs. consentimento informado).
   * Definir períodos de retenção e exclusão de dados, rotacionamento de chaves de criptografia.

2. **Implementar Módulo de Pseudonimização**

   * Finalizar funções de HMAC (salt e pepper), rotacionamento de chaves.
   * Testar cenários de busca reversa (garantir que não é possível reverter).
   * Gerenciar secrets no ambiente de produção (Render Secrets, Supabase Secrets).

3. **Construir Backend de Autenticação e RBAC**

   * Configurar Google OAuth 2.0 (Authlib), integrar com tabela `users`.
   * Criar tabelas `roles` e `user_roles` e middleware/decorator para checar permissões.
   * Desenvolver endpoints CRUD para `projects`, `roles`, `forms`, `form_submissions`, `contact_log`.

4. **Desenvolver Construtor de Formulários Dinâmicos**

   * Criar UI React para arrastar e soltar componentes e gerar schema + uiSchema.
   * Validar JSON Schema no backend e no frontend.

5. **Implementar Sistema de E-Mail Criptografado e Agendamento**

   * Configurar `cryptography.fernet` para criptografar e-mails.
   * Criar serviço de agendamento (cron) para envio de lembretes.
   * Em seguida, realizar proof-of-concept de integração com WhatsApp Business API.

6. **Auditoria e Logs**

   * Garantir registro de cada ação em `access_logs`, com retenção mínima de 180 dias.
   * Desenvolver endpoints para visualização de logs (apenas para papéis com permissão `can_view_audit_logs`).

7. **Teste e Validação**

   * Criar cenários de teste para todos os fluxos principais:

     * Cadastro de projetos e configuração de privacidade.
     * Criação e atualização de formulários (mantendo versões).
     * Submissão inicial e subsequentes de dados.
     * Busca pseudonimizada de pacientes.
     * Envio de notificações e logs de auditoria.
     * Consentimento, revogação e exclusão de dados.
   * Realizar testes de segurança (pen-test básico) focados em proteção de dados e fluxo de autenticação.

---

PedAir entrega aos pesquisadores uma **infraestrutura de pesquisa orientada a dados** que captura informações clínicas de forma ética, flexível e segura, permitindo coletas personalizadas, análises avançadas e governança científica sofisticada, tudo em estrita conformidade com a LGPD.