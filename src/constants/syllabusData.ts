
import { ExamSyllabus } from '@/types/contest';

export const EXAM_SYLLABUS: Record<string, ExamSyllabus> = {
  'PRF': {
    examId: 'PRF',
    subjects: [
      {
        name: 'LÍNGUA PORTUGUESA',
        questions: 18,
        topics: [
          {
            id: 'lp-1',
            title: '1 Compreensão e interpretação de textos de gêneros variados.',
            subtopics: []
          },
          {
            id: 'lp-2',
            title: '2 Reconhecimento de tipos e gêneros textuais.',
            subtopics: []
          },
          {
            id: 'lp-3',
            title: '3 Domínio da ortografia oficial.',
            subtopics: []
          },
          {
            id: 'lp-4',
            title: '4 Domínio dos mecanismos de coesão textual.',
            subtopics: [
              '4.1 Emprego de elementos de referenciação, substituição e repetição, de conectores e de outros elementos de sequenciação textual.',
              '4.2 Emprego de tempos e modos verbais.'
            ]
          },
          {
            id: 'lp-5',
            title: '5 Domínio da estrutura morfossintática do período.',
            subtopics: [
              '5.1 Emprego das classes de palavras.',
              '5.2 Relações de coordenação entre orações e entre termos da oração.',
              '5.3 Relações de subordinação entre orações e entre termos da oração.',
              '5.4 Emprego dos sinais de pontuação.',
              '5.5 Concordância verbal e nominal.',
              '5.6 Regência verbal e nominal.',
              '5.7 Emprego do sinal indicativo de crase.',
              '5.8 Colocação dos pronomes átonos.'
            ]
          },
          {
            id: 'lp-6',
            title: '6 Reescrita de frases e parágrafos do texto.',
            subtopics: [
              '6.1 Significação das palavras.',
              '6.2 Substituição de palavras ou de trechos de texto.',
              '6.3 Reorganização da estrutura de orações e de períodos do texto.',
              '6.4 Reescrita de textos de diferentes gêneros e níveis de formalidade.'
            ]
          },
          {
            id: 'lp-7',
            title: '7 Correspondência oficial (conforme Manual de Redação da Presidência da República).',
            subtopics: [
              '7.1 Aspectos gerais da redação oficial.',
              '7.2 Finalidade dos expedientes oficiais.',
              '7.3 Adequação da linguagem ao tipo de documento.',
              '7.4 Adequação do formato do texto ao gênero.'
            ]
          }
        ]
      },
      {
        name: 'RACIOCÍNIO LÓGICO-MATEMÁTICO',
        weight: 20,
        questions: 20,
        topics: [
          {
            id: 'rlm-1',
            title: '1 Modelagem de situações-problema por meio de equações do 1º e 2º graus e sistemas lineares.',
            subtopics: []
          },
          {
            id: 'rlm-2',
            title: '2 Noção de função.',
            subtopics: [
              '2.1 Análise gráfica.',
              '2.2 Funções afim, quadrática, exponencial e logarítmica.',
              '2.3 Aplicações.'
            ]
          },
          {
            id: 'rlm-3',
            title: '3 Taxas de variação de grandezas.',
            subtopics: [
              '3.1 Razão e proporção com aplicações.',
              '3.2 Regra de três simples e composta.'
            ]
          },
          {
            id: 'rlm-4',
            title: '4 Porcentagem.',
            subtopics: []
          },
          {
            id: 'rlm-5',
            title: '5 Regularidades e padrões em sequências.',
            subtopics: [
              '5.1 Sequências numéricas.',
              '5.2 Progressão aritmética e progressão geométrica.'
            ]
          },
          {
            id: 'rlm-6',
            title: '6 Noções básicas de contagem, probabilidade e estatística.',
            subtopics: []
          },
          {
            id: 'rlm-7',
            title: '7 Descrição e análise de dados.',
            subtopics: [
              '7.1 Leitura e interpretação de tabelas e gráficos apresentados em diferentes linguagens e representações.',
              '7.2 Cálculo de médias e análise de desvios de conjuntos de dados.'
            ]
          },
          {
            id: 'rlm-8',
            title: '8 Noções básicas de teoria dos conjuntos.',
            subtopics: []
          },
          {
            id: 'rlm-9',
            title: '9 Análise e interpretação de diferentes representações de figuras planas, como desenhos, mapas e plantas.',
            subtopics: [
              '9.1 Utilização de escalas.',
              '9.2 Visualização de figuras espaciais em diferentes posições.',
              '9.3 Representações bidimensionais de projeções, planificações e cortes.'
            ]
          },
          {
            id: 'rlm-10',
            title: '10 Métrica.',
            subtopics: [
              '10.1 Áreas e volumes.',
              '10.2 Estimativas.',
              '10.3 Aplicações.'
            ]
          }
        ]
      },
      {
        name: 'INFORMÁTICA',
        weight: 10,
        questions: 10,
        topics: [
          {
            id: 'inf-1',
            title: '1 Conceito de internet e intranet.',
            subtopics: []
          },
          {
            id: 'inf-2',
            title: '2 Conceitos e modos de utilização de tecnologias, ferramentas, aplicativos e procedimentos associados a internet/intranet.',
            subtopics: [
              '2.1 Ferramentas e aplicativos comerciais de navegação, de correio eletrônico, de grupos de discussão, de busca, de pesquisa, de redes sociais e ferramentas colaborativas.',
              '2.2 Noções de sistema operacional (ambiente Windows).',
              '2.3 Acesso a distância a computadores, transferência de informação e arquivos, aplicativos de áudio, vídeo e multimídia.'
            ]
          },
          {
            id: 'inf-3',
            title: '3 Transformação digital.',
            subtopics: [
              '3.1 Internet das coisas (IoT).',
              '3.2 Big data.',
              '3.3 Inteligência artificial.'
            ]
          },
          {
            id: 'inf-4',
            title: '4 Conceitos de proteção e segurança.',
            subtopics: [
              '4.1 Noções de vírus, worms, phishing e pragas virtuais.',
              '4.2 Aplicativos para segurança (antivírus, firewall, anti-spyware, VPN, etc.).'
            ]
          },
          {
            id: 'inf-5',
            title: '5 Computação na nuvem (cloud computing).',
            subtopics: []
          }
        ]
      },
      {
        name: 'FÍSICA',
        weight: 8,
        questions: 8,
        topics: [
          {
            id: 'fis-1',
            title: '1 Cinemática escalar, cinemática vetorial.',
            subtopics: []
          },
          {
            id: 'fis-2',
            title: '2 Movimento circular.',
            subtopics: []
          },
          {
            id: 'fis-3',
            title: '3 Leis de Newton e suas aplicações.',
            subtopics: []
          },
          {
            id: 'fis-4',
            title: '4 Trabalho.',
            subtopics: []
          },
          {
            id: 'fis-5',
            title: '5 Potência.',
            subtopics: []
          },
          {
            id: 'fis-6',
            title: '6 Energia cinética, energia potencial, atrito.',
            subtopics: []
          },
          {
            id: 'fis-7',
            title: '7 Conservação de energia e suas transformações.',
            subtopics: []
          },
          {
            id: 'fis-8',
            title: '8 Quantidade de movimento e conservação da quantidade de movimento, impulso.',
            subtopics: []
          },
          {
            id: 'fis-9',
            title: '9 Colisões.',
            subtopics: []
          }
        ]
      },
      {
        name: 'ÉTICA E CIDADANIA',
        weight: 7,
        questions: 7,
        topics: [
          {
            id: 'ec-1',
            title: '1 Ética e moral.',
            subtopics: []
          },
          {
            id: 'ec-2',
            title: '2 Ética, princípios e valores.',
            subtopics: []
          },
          {
            id: 'ec-3',
            title: '3 Ética e função pública: integridade.',
            subtopics: []
          },
          {
            id: 'ec-4',
            title: '4 Ética no setor público.',
            subtopics: [
              '4.1 Princípios da Administração Pública: moralidade (art. 37 da CF).',
              '4.2 Deveres dos servidores públicos: moralidade administrativa (Lei nº 8.112/1990, art. 116, IX).',
              '4.3 Política de governança da administração pública federal (Decreto nº 9.203/2017).',
              '4.4 Promoção da ética e de regras de conduta para servidores.',
              '4.4.1 Código de Ética Profissional do Servidor Público Civil do Poder Executivo Federal (Decreto nº 1.171/1994).',
              '4.4.2 Sistema de Gestão da Ética do Poder Executivo Federal e Comissões de Ética (Decreto nº 6.029/2007).',
              '4.4.3 Código de Conduta da Alta Administração Federal (Exposição de Motivos nº 37/2000).'
            ]
          },
          {
            id: 'ec-5',
            title: '5 Ética e democracia: exercício da cidadania.',
            subtopics: [
              '5.1 Promoção da transparência ativa e do acesso à informação (Lei nº 12.527/2011 e Decreto nº 7.724/2012).',
              '5.2 Tratamento de conflitos de interesses e nepotismo (Lei nº 12.813/2013 e Decreto nº 7.203/2010).'
            ]
          }
        ]
      },
      {
        name: 'GEOPOLÍTICA',
        weight: 7,
        questions: 7,
        topics: [
          {
            id: 'geo-1',
            title: '1 O Brasil político: nação e território.',
            subtopics: []
          },
          {
            id: 'geo-2',
            title: '2 Organização do Estado Brasileiro.',
            subtopics: []
          },
          {
            id: 'geo-3',
            title: '3 A divisão inter-regional do trabalho e da produção no Brasil.',
            subtopics: []
          },
          {
            id: 'geo-4',
            title: '4 A estrutura urbana brasileira e as grandes metrópoles.',
            subtopics: []
          },
          {
            id: 'geo-5',
            title: '5 Distribuição espacial da população no Brasil e movimentos migratórios internos.',
            subtopics: []
          },
          {
            id: 'geo-6',
            title: '6 Integração entre indústria e estrutura urbana e setor agrícola no Brasil.',
            subtopics: []
          },
          {
            id: 'geo-7',
            title: '7 Rede de transporte no Brasil: modais e principais infraestruturas.',
            subtopics: []
          },
          {
            id: 'geo-8',
            title: '8 A integração do Brasil ao processo de internacionalização da economia.',
            subtopics: []
          },
          {
            id: 'geo-9',
            title: '9 Geografia e gestão ambiental.',
            subtopics: []
          },
          {
            id: 'geo-10',
            title: '10 Macrodivisão natural do espaço brasileiro: biomas, domínios e ecossistemas.',
            subtopics: []
          }
        ]
      },
      {
        name: 'LÍNGUA ESTRANGEIRA (INGLÊS OU ESPANHOL)',
        weight: 8,
        questions: 8,
        topics: [
          {
            id: 'le-ing-1',
            title: 'I LÍNGUA INGLESA',
            subtopics: [
              '1 Compreensão de texto escrito em língua inglesa.',
              '2 Itens gramaticais relevantes para a compreensão dos conteúdos semânticos.'
            ]
          },
          {
            id: 'le-esp-1',
            title: 'II LÍNGUA ESPANHOLA',
            subtopics: [
              '1 Compreensão de texto escrito em língua espanhola.',
              '2 Itens gramaticais relevantes para a compreensão dos conteúdos semânticos.'
            ]
          }
        ]
      },
      {
        name: 'LEGISLAÇÃO DE TRÂNSITO',
        questions: 30,
        topics: [
          {
            id: 'lt-1',
            title: '1 Lei nº 9.503/1997 (Código de Trânsito Brasileiro) e suas alterações, inclusive as da Lei nº 14.071/2020.',
            subtopics: []
          },
          {
            id: 'lt-2',
            title: '2 Lei nº 5.970/1973.',
            subtopics: []
          },
          {
            id: 'lt-3',
            title: '3 Resoluções do Conselho Nacional de Trânsito (CONTRAN) e suas alterações',
            subtopics: [
              '04/1998; 14/1998; 24/1998; 36/1998; 92/1998, exceto os anexos; 110/2000; 160/2004; 210/2011; 211/2006; 216/2006; 227/2007, exceto os anexos; 253/2007; 254/2007; 268/2008; 290/2008; 292/2008; 349/2010; 360/2010; 432/2013; 441/2013; 453/2013; 471/2013; 508/2014; 520/2015; 525/2015; 552/2015, exceto os anexos; 561/2015, exceto as fichas; 619/2016; 667/2017, exceto os anexos; 723/2018; 735/2018, exceto os anexos; 740/2018; 780/2019; 789/2020, Anexo I; 798/2020; 803/2020; 806/2020; 809/2020; 810/2020.'
            ]
          }
        ]
      }
    ]
  },
  'PF': {
    examId: 'PF',
    subjects: [
      {
        name: 'LÍNGUA PORTUGUESA',
        questions: 24,
        topics: [
          {
            id: 'lp-pf-1',
            title: '1 Compreensão e interpretação de textos de gêneros variados.',
            subtopics: []
          },
          {
            id: 'lp-pf-2',
            title: '2 Reconhecimento de tipos e gêneros textuais.',
            subtopics: []
          },
          {
            id: 'lp-pf-3',
            title: '3 Domínio da ortografia oficial.',
            subtopics: []
          },
          {
            id: 'lp-pf-4',
            title: '4 Domínio dos mecanismos de coesão textual.',
            subtopics: [
              '4.1 Emprego de elementos de referenciação, substituição e repetição, de conectores e de outros elementos de sequenciação textual.',
              '4.2 Emprego de tempos e modos verbais.'
            ]
          },
          {
            id: 'lp-pf-5',
            title: '5 Domínio da estrutura morfossintática do período.',
            subtopics: [
              '5.1 Emprego das classes de palavras.',
              '5.2 Relações de coordenação entre orações e entre termos da oração.',
              '5.3 Relações de subordinação entre orações e entre termos da oração.',
              '5.4 Emprego dos sinais de pontuação.',
              '5.5 Concordância verbal e nominal.',
              '5.6 Regência verbal e nominal.',
              '5.7 Emprego do sinal indicativo de crase.',
              '5.8 Colocação dos pronomes átonos.'
            ]
          },
          {
            id: 'lp-pf-6',
            title: '6 Reescrita de frases e parágrafos do texto.',
            subtopics: [
              '6.1 Significação das palavras.',
              '6.2 Substituição de palavras ou de trechos de texto.',
              '6.3 Reorganização da estrutura de orações e de períodos do texto.',
              '6.4 Reescrita de textos de diferentes gêneros e níveis de formalidade.'
            ]
          },
          {
            id: 'lp-pf-7',
            title: '7 Correspondência oficial (conforme Manual de Redação da Presidência da República).',
            subtopics: [
              '7.1 Aspectos gerais da redação oficial.',
              '7.2 Finalidade dos expedientes oficiais.',
              '7.3 Adequação da linguagem ao tipo de documento.',
              '7.4 Adequação do formato do texto ao gênero.'
            ]
          }
        ]
      },
      {
        name: 'NOÇÕES DE DIREITO ADMINISTRATIVO',
        questions: 3,
        topics: [
          {
            id: 'da-pf-1',
            title: '1 Noções de organização administrativa.',
            subtopics: [
              '1.1 Centralização, descentralização, concentração e desconcentração.',
              '1.2 Administração direta e indireta.',
              '1.3 Autarquias, fundações, empresas públicas e sociedades de economia mista.'
            ]
          },
          {
            id: 'da-pf-2',
            title: '2 Ato administrativo.',
            subtopics: [
              '2.1 Conceito, requisitos, atributos, classificação e espécies.'
            ]
          },
          {
            id: 'da-pf-3',
            title: '3 Agentes públicos.',
            subtopics: [
              '3.1 Legislação pertinente.',
              '3.1.1 Lei nº 8.112/1990 e suas alterações.',
              '3.1.2 Disposições constitucionais aplicáveis.',
              '3.2 Disposições doutrinárias.',
              '3.2.1 Conceito.',
              '3.2.2 Espécies.',
              '3.2.3 Cargo, emprego e função pública.'
            ]
          },
          {
            id: 'da-pf-4',
            title: '4 Poderes administrativos.',
            subtopics: [
              '4.1 Hierárquico, disciplinar, regulamentar e de polícia.',
              '4.2 Uso e abuso do poder.'
            ]
          },
          {
            id: 'da-pf-5',
            title: '5 Licitação.',
            subtopics: [
              '5.1 Princípios.',
              '5.2 Contratação direta: dispensa e inexigibilidade.',
              '5.3 Modalidades.',
              '5.4 Tipos.',
              '5.5 Procedimento.'
            ]
          },
          {
            id: 'da-pf-6',
            title: '6 Controle da Administração Pública.',
            subtopics: [
              '6.1 Controle exercido pela Administração Pública.',
              '6.2 Controle judicial.',
              '6.3 Controle legislativo.'
            ]
          },
          {
            id: 'da-pf-7',
            title: '7 Responsabilidade civil do Estado.',
            subtopics: [
              '7.1 Responsabilidade civil do Estado no direito brasileiro.',
              '7.1.1 Responsabilidade por ato comissivo do Estado.',
              '7.1.2 Responsabilidade por omissão do Estado.',
              '7.2 Requisitos para a demonstração da responsabilidade do Estado.',
              '7.3 Causas excludentes e atenuantes da responsabilidade do Estado.'
            ]
          },
          {
            id: 'da-pf-8',
            title: '8 Regime jurídico-administrativo.',
            subtopics: [
              '8.1 Conceito.',
              '8.2 Princípios expressos e implícitos da Administração Pública.'
            ]
          }
        ]
      },
      {
        name: 'NOÇÕES DE DIREITO CONSTITUCIONAL',
        questions: 3,
        topics: [
          {
            id: 'dc-pf-1',
            title: '1 Direitos e garantias fundamentais: direitos e deveres individuais e coletivos; direito à vida, à liberdade, à igualdade, à segurança e à propriedade; direitos sociais; nacionalidade; cidadania e direitos políticos; partidos políticos; garantias constitucionais individuais; garantias dos direitos coletivos, sociais e políticos.',
            subtopics: []
          },
          {
            id: 'dc-pf-2',
            title: '2 Poder Executivo: forma e sistema de governo; chefia de Estado e chefia de governo.',
            subtopics: []
          },
          {
            id: 'dc-pf-3',
            title: '3 Defesa do Estado e das instituições democráticas: segurança pública; organização da segurança pública.',
            subtopics: []
          },
          {
            id: 'dc-pf-4',
            title: '4 Ordem social: base e objetivos da ordem social; seguridade social; meio ambiente; família, criança, adolescente, idoso, indígenas.',
            subtopics: []
          }
        ]
      },
      {
        name: 'NOÇÕES DE DIREITO PENAL E PROCESSUAL PENAL',
        questions: 3,
        topics: [
          {
            id: 'dpp-pf-1',
            title: '1 Princípios básicos.',
            subtopics: []
          },
          {
            id: 'dpp-pf-2',
            title: '2 Aplicação da lei penal.',
            subtopics: [
              '2.1 A lei penal no tempo e no espaço.',
              '2.2 Tempo e lugar do crime.',
              '2.3 Territorialidade e extraterritorialidade da lei penal.'
            ]
          },
          {
            id: 'dpp-pf-3',
            title: '3 O fato típico e seus elementos.',
            subtopics: [
              '3.1 Crime consumado e tentado.',
              '3.2 Ilicitude e causas de exclusão.',
              '3.3 Excesso punível.'
            ]
          },
          {
            id: 'dpp-pf-4',
            title: '4 Crimes contra a pessoa.',
            subtopics: []
          },
          {
            id: 'dpp-pf-5',
            title: '5 Crimes contra o patrimônio.',
            subtopics: []
          },
          {
            id: 'dpp-pf-6',
            title: '6 Crimes contra a fé pública.',
            subtopics: []
          },
          {
            id: 'dpp-pf-7',
            title: '7 Crimes contra a Administração Pública.',
            subtopics: []
          },
          {
            id: 'dpp-pf-8',
            title: '8 Inquérito policial.',
            subtopics: [
              '8.1 Histórico, natureza, conceito, finalidade, características, fundamento, titularidade, grau de cognição, valor probatório, formas de instauração, notitia criminis, delatio criminis, procedimentos investigativos, indiciamento, garantias do investigado; conclusão.'
            ]
          },
          {
            id: 'dpp-pf-9',
            title: '9 Prova.',
            subtopics: [
              '9.1 Preservação de local de crime.',
              '9.2 Requisitos e ônus da prova.',
              '9.3 Nulidade da prova.',
              '9.4 Documentos de prova.',
              '9.5 Reconhecimento de pessoas e coisas.',
              '9.6 Acareação.',
              '9.7 Indícios.',
              '9.8 Busca e apreensão.'
            ]
          },
          {
            id: 'dpp-pf-10',
            title: '10 Restrição de liberdade.',
            subtopics: [
              '10.1 Prisão em flagrante.'
            ]
          }
        ]
      },
      {
        name: 'LEGISLAÇÃO ESPECIAL',
        questions: 3,
        topics: [
          {
            id: 'le-pf-1',
            title: '1 Lei 14.967/2024 (Estatuto da Segurança Privada e da Segurança das Instituições Financeiras).',
            subtopics: []
          },
          {
            id: 'le-pf-2',
            title: '2 Lei nº 10.357/2001 (Normas de controle e fiscalização de produtos químicos).',
            subtopics: []
          },
          {
            id: 'le-pf-3',
            title: '3 Lei nº 13.445/2017 (Lei de migração).',
            subtopics: []
          },
          {
            id: 'le-pf-4',
            title: '4 Lei nº 11.343/2006 (normas de repressão ao tráfico ilícito de drogas) e suas alterações (aspectos penais e processuais penais).',
            subtopics: []
          },
          {
            id: 'le-pf-5',
            title: '5 Lei nº 9.455/1997 (crimes de tortura) e suas alterações (aspectos penais e processuais penais).',
            subtopics: []
          },
          {
            id: 'le-pf-6',
            title: '6 Lei nº 8.069/1990 (ECA) e suas alterações (aspectos penais e processuais penais).',
            subtopics: []
          },
          {
            id: 'le-pf-7',
            title: '7 Lei nº 10.826/2003 (Normas sobre registro, posse e comercialização de arma de fogo) e suas alterações (aspectos penais e processuais penais).',
            subtopics: []
          },
          {
            id: 'le-pf-8',
            title: '8 Lei nº 9.605/1998 (infrações ambientais) e suas alterações (aspectos penais e processuais penais).',
            subtopics: []
          },
          {
            id: 'le-pf-9',
            title: '9 Lei nº 10.446/2002 (infrações de repercussão interestadual ou internacional) e suas alterações.',
            subtopics: []
          },
          {
            id: 'le-pf-10',
            title: '10 Lei nº 13.444/2017 (identificação Civil Nacional).',
            subtopics: []
          },
          {
            id: 'le-pf-11',
            title: '11 Lei nº 14.534/2023 (adota CPF como nº identificação).',
            subtopics: []
          },
          {
            id: 'le-pf-12',
            title: '12 Lei nº 7.116/1983 (Carteira de Identidade) e Decreto nº 10.977/2022 (regulamenta a Lei nº 7.116/1983).',
            subtopics: []
          },
          {
            id: 'le-pf-13',
            title: '13 Decreto nº 11.797/2023 (serviço de identificação do cidadão).',
            subtopics: []
          },
          {
            id: 'le-pf-14',
            title: '14 Lei nº 9.545/1997 (institui o número único de registro de identidade civil).',
            subtopics: []
          },
          {
            id: 'le-pf-15',
            title: '15 Decreto nº 11.491/2023 (Convenção sobre o Crime Cibernético).',
            subtopics: []
          }
        ]
      },
      {
        name: 'ESTATÍSTICA',
        questions: 12,
        topics: [
          {
            id: 'est-pf-1',
            title: '1 Estatística descritiva e análise exploratória de dados: gráficos, diagramas, tabelas, medidas descritivas (posição, dispersão, assimetria e curtose).',
            subtopics: []
          },
          {
            id: 'est-pf-2',
            title: '2 Probabilidade.',
            subtopics: [
              '2.1 Probabilidade e Probabilidade Condicional.',
              '2.2 Conceitos básicos de probabilidade.',
              '2.3 Cálculo de probabilidades condicionais.',
              '2.4 Definições básicas e axiomas.',
              '2.5 Probabilidade condicional e independência.',
              '2.6 Variáveis aleatórias discretas e contínuas.',
              '2.7 Distribuição de probabilidades.',
              '2.8 Função de probabilidade.',
              '2.9 Função densidade de probabilidade.',
              '2.10 Esperança e momentos.',
              '2.11 Distribuições especiais.',
              '2.12 Distribuições condicionais e independência.',
              '2.13 Transformação de variáveis.',
              '2.14 Leis dos grandes números.',
              '2.15 Teorema central do limite.',
              '2.16 Amostras aleatórias.',
              '2.17 Distribuições amostrais.',
              '2.18 Independência de Eventos, Regra de Bayes e Teorema da Probabilidade Total.',
              '2.19 Conceito de independência.',
              '2.20 Aplicação da regra de Bayes.',
              '2.21 Uso do teorema da probabilidade total.',
              '2.21 Variáveis Aleatórias e Funções de Probabilidade.',
              '2.21.1 Definição e exemplos de variáveis aleatórias.',
              '2.21.2 Função de probabilidade (para variáveis discretas) e função densidade de probabilidade (para variáveis contínuas).',
              '2.22 Principais Distribuições de Probabilidade Discretas e Contínuas.',
              '2.22.1 Distribuição uniforme.',
              '2.22.2 Distribuição de Bernoulli.',
              '2.22.3 Distribuição binomial.',
              '2.22.4 Distribuição normal.',
              '2.23 Medidas de Tendência Central.',
              '2.23.1 Média (aritmética, ponderada, geométrica e harmônica).',
              '2.23.2 Mediana.',
              '2.23.3 Moda.',
              '2.24 Medidas de Dispersão.',
              '2.24.1 Amplitude.',
              '2.24.2 Variância.',
              '2.24.3 Desvio padrão.',
              '2.24.4 Coeficiente de variação.',
              '2.25 Coeficiente de Correlação de Pearson.',
              '2.25.1 Conceito e cálculo da correlação entre duas variáveis.',
              '2.26 Teorema Central do Limite.',
              '2.26.1 Importância do teorema para a distribuição amostral da média.',
              '2.27 Regra Empírica (Regra dos Três Sigma) da Distribuição Normal.',
              '2.27.1 Aproximação da dispersão dos dados na distribuição normal.',
              '2.28 Técnicas de Amostragem.',
              '2.29 Amostragem aleatória simples, estratificada, sistemática e por conglomerados.',
              '2.29.1 Conceitos básicos para determinação do tamanho amostral.'
            ]
          },
          {
            id: 'est-pf-3',
            title: '3 Inferência estatística.',
            subtopics: [
              '3.1 Estimação pontual: métodos de estimação, propriedades dos estimadores, suficiência.',
              '3.2 Estimação intervalar: intervalos de confiança, intervalos de credibilidade.',
              '3.3 Testes de hipóteses: hipóteses simples e compostas, níveis de significância e potência de um teste, teste t de Student, teste qui‐quadrado.'
            ]
          },
          {
            id: 'est-pf-4',
            title: '4 Análise de regressão linear.',
            subtopics: [
              '4.1 Critérios de mínimos quadrados e de máxima verossimilhança.',
              '4.2 Modelos de regressão linear.',
              '4.3 Inferência sobre os parâmetros do modelo.',
              '4.4 Análise de variância.',
              '4.5 Análise de resíduos.'
            ]
          },
          {
            id: 'est-pf-5',
            title: '5 Técnicas de amostragem: amostragem aleatória simples, estratificada, sistemática e por conglomerados.',
            subtopics: [
              '5.1 Tamanho amostral.'
            ]
          }
        ]
      },
      {
        name: 'RACIOCÍNIO LÓGICO',
        questions: 12,
        topics: [
          {
            id: 'rl-pf-1',
            title: '1 Estruturas lógicas.',
            subtopics: []
          },
          {
            id: 'rl-pf-2',
            title: '2 Lógica de argumentação: analogias, inferências, deduções e conclusões.',
            subtopics: []
          },
          {
            id: 'rl-pf-3',
            title: '3 Lógica sentencial (ou proposicional).',
            subtopics: [
              '3.1 Proposições simples e compostas.',
              '3.2 Tabelas verdade.',
              '3.3 Equivalências.',
              '3.4 Leis de Morgan.',
              '3.5 Diagramas lógicos.'
            ]
          },
          {
            id: 'rl-pf-4',
            title: '4 Lógica de primeira ordem.',
            subtopics: []
          },
          {
            id: 'rl-pf-5',
            title: '5 Princípios de contagem e probabilidade.',
            subtopics: []
          },
          {
            id: 'rl-pf-6',
            title: '6 Operações com conjuntos.',
            subtopics: []
          },
          {
            id: 'rl-pf-7',
            title: '7 Raciocínio lógico envolvendo problemas aritméticos, geométricos e matriciais.',
            subtopics: []
          }
        ]
      },
      {
        name: 'INFORMÁTICA',
        questions: 36,
        topics: [
          {
            id: 'inf-pf-1',
            title: '1 Conceito de internet e intranet.',
            subtopics: []
          },
          {
            id: 'inf-pf-2',
            title: '2 Conceitos e modos de utilização de tecnologias, ferramentas, aplicativos e procedimentos associados a internet/intranet.',
            subtopics: [
              '2.1 Ferramentas e aplicativos comerciais de navegação, de correio eletrônico, de grupos de discussão, de busca, de pesquisa e de redes sociais.',
              '2.2 Noções de sistema operacional (ambiente Linux e Windows).',
              '2.3 Acesso à distância a computadores, transferência de informação e arquivos, aplicativos de áudio, vídeo e multimídia.',
              '2.4 Edição de textos, planilhas e apresentações (ambientes Microsoft Office e LibreOffice).'
            ]
          },
          {
            id: 'inf-pf-3',
            title: '3 Redes de computadores.',
            subtopics: [
              '3.1 Formação de endereços IPV4 e IPV6.'
            ]
          },
          {
            id: 'inf-pf-4',
            title: '4 Conceitos de proteção e segurança.',
            subtopics: [
              '4.1 Noções de vírus, worms e pragas virtuais.',
              '4.2 Aplicativos para segurança (antivírus, firewall, anti-spyware etc.).'
            ]
          },
          {
            id: 'inf-pf-5',
            title: '5 Computação na nuvem (cloud computing).',
            subtopics: []
          },
          {
            id: 'inf-pf-6',
            title: '6 Fundamentos da Teoria Geral de Sistemas.',
            subtopics: [
              '6.1 Camadas de Aplicação, processos, frontend, backend.'
            ]
          },
          {
            id: 'inf-pf-7',
            title: '7 Sistemas de informação.',
            subtopics: [
              '7.1 Fases e etapas de sistema de informação.',
              '7.2 Análise de requisitos, especificação, ambientes de testes, homologação, produção e suporte.'
            ]
          },
          {
            id: 'inf-pf-8',
            title: '8 Teoria da informação.',
            subtopics: [
              '8.1 Conceitos de informação, dados, representação de dados, de conhecimentos, segurança e inteligência.'
            ]
          },
          {
            id: 'inf-pf-9',
            title: '9 Banco de dados.',
            subtopics: [
              '9.1 Base de dados, documentação e prototipação.',
              '9.2 Modelagem conceitual: abstração, modelo entidade-relacionamento, análise funcional e administração de dados.',
              '9.3 Dados estruturados e não estruturados.',
              '9.4 Banco de dados relacionais: conceitos básicos e características.',
              '9.5 Chaves e relacionamentos.',
              '9.6 Noções de mineração de dados: conceituação e características.',
              '9.7 Noções de aprendizado de máquina.',
              '9.8 Noções de Big data: conceito, premissas e aplicação.'
            ]
          },
          {
            id: 'inf-pf-10',
            title: '10 Redes de comunicação.',
            subtopics: [
              '10.1 Introdução a redes (computação/telecomunicações).',
              '10.2 Camada física, de enlace de dados e subcamada de acesso ao meio.',
              '10.3 Noções básicas de transmissão de dados: tipos de enlace, códigos, modos e meios de transmissão.'
            ]
          },
          {
            id: 'inf-pf-11',
            title: '11 Redes de computadores: locais, metropolitanas e de longa distância.',
            subtopics: [
              '11.1 Terminologia e aplicações, topologias, modelos de arquitetura (OSI/ISO e TCP/IP) e protocolos.',
              '11.2 Interconexão de redes, nível de transporte.'
            ]
          },
          {
            id: 'inf-pf-12',
            title: '12 Noções de programação Python e R.',
            subtopics: []
          },
          {
            id: 'inf-pf-13',
            title: '13 Metadados de arquivos.',
            subtopics: []
          },
          {
            id: 'inf-pf-14',
            title: '14 Formatos de arquivos de intercâmbio entre sistemas biométricos: NIST, XML, JSON.',
            subtopics: []
          },
          {
            id: 'inf-pf-15',
            title: '15 Testes de acurácia do NIST.GOV.',
            subtopics: [
              '15.1 Conceitos de falso positivo e falso negativo (FPIR e FNIR).'
            ]
          },
          {
            id: 'inf-pf-16',
            title: '16 Inteligência Artificial (IA).',
            subtopics: [
              '16.1 Conceitos de Machine Learning.',
              '16.2 Principais ferramentas de mercado (Copilot, ChatGPT, META).'
            ]
          },
          {
            id: 'inf-pf-17',
            title: '17 Tecnologias, Ferramentas e Aplicativos.',
            subtopics: [
              '17.1 Noções de sistema operacional (ambiente Linux e Windows).',
              '17.2 Noções de acesso remoto a computadores, transferência de arquivos, comunicação multimídia e colaboração online (Microsoft Teams).'
            ]
          },
          {
            id: 'inf-pf-18',
            title: '18 Noções de Redes e Comunicação.',
            subtopics: [
              '18.1 Conceito de Internet e Intranet.',
              '18.2 Noções de arquitetura e princípios de funcionamento das redes.',
              '18.3 Tipos de redes: locais (LAN), metropolitanas (MAN) e de longa distância (WAN).',
              '18.4 Modelo OSI/ISO e modelo TCP/IP: camadas, funções e protocolos associados.',
              '18.5 Protocolos de comunicação: Ethernet, IP (IPv4 e IPv6), TCP, UDP, DNS, DHCP e SNMP.',
              '18.6 Protocolos e mecanismos de segurança: VPN, SSL/TLS.',
              '18.7 Redes sem fio: padrões IEEE 802.11, WPA/WPA2, segurança e boas práticas.'
            ]
          },
          {
            id: 'inf-pf-19',
            title: '19 Noções de Computação em Nuvem.',
            subtopics: [
              '19.1 Definição e características das nuvens privadas e públicas.',
              '19.2 Modelos de Serviço em Nuvem: Infraestrutura como Serviço (IaaS), Plataforma como Serviço (PaaS) e Software como Serviço (SaaS).'
            ]
          },
          {
            id: 'inf-pf-20',
            title: '20 Conceitos de Proteção e Segurança.',
            subtopics: [
              '20.1 Ameaças digitais e malwares: noções de vírus, worms, trojans, ransomware, spyware, rootkits, botnets e outras pragas virtuais.',
              '20.2 Ferramentas e técnicas de segurança: uso de antivírus, firewall, anti-spyware e autenticação multifator (MFA).',
              '20.3 Noções de criptografia e proteção de dados: hash criptográfico (MD5, SHA-1, SHA-256), assinaturas digitais.',
              '20.4 Noções de Controle de acesso e autenticação.'
            ]
          },
          {
            id: 'inf-pf-21',
            title: '21 Dados.',
            subtopics: [
              '21.1 Banco de dados relacionais: conceitos básicos e características.',
              '21.2 Noções de linguagem SQL.',
              '21.3 Modelagem conceitual: entidades, atributos e relacionamentos.',
              '21.4 Dados estruturados e não estruturados.',
              '21.5 Conceito de DataWarehouse, DataMart, DataLake, DataMesh.',
              '21.6 Metadados.'
            ]
          },
          {
            id: 'inf-pf-22',
            title: '22 Noções de análise de dados.',
            subtopics: [
              '22.1 Mineração de dados: conceituação e características.',
              '22.2 Noções de Business Intelligence: Ferramentas e aplicabilidade.',
              '22.3 Noções de aprendizado de máquina, inteligência artificial.',
              '22.4 Noções de big data: conceito, premissas e aplicação.'
            ]
          },
          {
            id: 'inf-pf-23',
            title: '23 Noções de Programação e Interoperabilidade.',
            subtopics: [
              '23.1 Noções de programação em Python.',
              '23.2 Conceito de API (Application Programming Interface).',
              '23.3 ETL/ELT (Extract, Transform, Load).'
            ]
          }
        ]
      },
      {
        name: 'CONTABILIDADE GERAL',
        questions: 24,
        topics: [
          {
            id: 'cg-pf-1',
            title: '1 Conceitos, objetivos e finalidades da contabilidade.',
            subtopics: []
          },
          {
            id: 'cg-pf-2',
            title: '2 Patrimônio: componentes, equação fundamental do patrimônio, situação líquida, representação gráfica.',
            subtopics: []
          },
          {
            id: 'cg-pf-3',
            title: '3 Atos e fatos administrativos: conceitos, fatos permutativos, modificativos e mistos.',
            subtopics: []
          },
          {
            id: 'cg-pf-4',
            title: '4 Contas: conceitos, contas de débitos, contas de créditos e saldos.',
            subtopics: []
          },
          {
            id: 'cg-pf-5',
            title: '5 Plano de contas: conceitos, elenco de contas, função e funcionamento das contas.',
            subtopics: []
          },
          {
            id: 'cg-pf-6',
            title: '6 Escrituração: conceitos, lançamentos contábeis, elementos essenciais, fórmulas de lançamentos, livros de escrituração, métodos e processos, regime de competência e regime de caixa.',
            subtopics: []
          },
          {
            id: 'cg-pf-7',
            title: '7 Contabilização de operações contábeis diversas: juros, descontos, tributos, aluguéis, variação monetária/ cambial, folha de pagamento, compras, vendas e provisões, depreciações e baixa de bens.',
            subtopics: []
          },
          {
            id: 'cg-pf-8',
            title: '8 Balancete de verificação: conceitos, modelos e técnicas de elaboração.',
            subtopics: []
          },
          {
            id: 'cg-pf-9',
            title: '9 Balanço patrimonial: conceitos, objetivo, composição.',
            subtopics: []
          },
          {
            id: 'cg-pf-10',
            title: '10 Demonstração de resultado de exercício: conceito, objetivo, composição.',
            subtopics: []
          },
          {
            id: 'cg-pf-11',
            title: '11 Lei nº 6.404/1976 e suas alterações, legislação complementar e pronunciamentos do Comitê de Pronunciamentos Contábeis (CPC).',
            subtopics: []
          },
          {
            id: 'cg-pf-12',
            title: '12 Norma Brasileira de Contabilidade - NBC TSP Estrutura Conceitual, de 23 de setembro de 2016.',
            subtopics: []
          }
        ]
      }
    ]
  }
};

// Função para obter dados customizados do localStorage
export const getCustomSyllabusData = (): any => {
  try {
    const customData = localStorage.getItem('customSyllabusData');
    return customData ? JSON.parse(customData) : {};
  } catch {
    return {};
  }
};

// Função para salvar dados customizados no localStorage
export const saveCustomSyllabusData = (data: any) => {
  localStorage.setItem('customSyllabusData', JSON.stringify(data));
};

// Função para restaurar dados padrão
export const restoreDefaultSyllabus = (examId: string) => {
  const customData = getCustomSyllabusData();
  delete customData[examId];
  saveCustomSyllabusData(customData);
};

// Função para obter syllabus com dados customizados
export const getSyllabusWithCustomData = (examId: string) => {
  const originalSyllabus = EXAM_SYLLABUS[examId];
  if (!originalSyllabus) return null;

  const customData = getCustomSyllabusData();
  const examCustomData = customData[examId];

  if (!examCustomData) return originalSyllabus;

  return {
    ...originalSyllabus,
    subjects: originalSyllabus.subjects.map(subject => {
      const customSubjectData = examCustomData[subject.name];
      if (customSubjectData) {
        return {
          ...subject,
          topics: customSubjectData,
          isCustomized: true
        };
      }
      return subject;
    }),
    isCustomized: true
  };
};
