(() => {
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_PUBLISHABLE_KEY;
  const $ = (id) => document.getElementById(id);
  const authDialog = $('auth-dialog'), quizDialog = $('quiz-dialog');
  const contentDialog = $('content-dialog');
let pendingTopic = null;
  let supabase = null, currentUser = null, quizIndex = 0, selected = null, score = 0, answered = false;
let quizCompleted = false, quizSaving = false;
  let quizQuestions = [];
  const questions = [
  {
    q: 'Qual característica diferencia principalmente as mídias digitais das mídias tradicionais?',
    a: [
      'A impossibilidade de interação com o público',
      'A circulação de informações apenas em horários determinados',
      'A possibilidade de interação, atualização e compartilhamento rápido de conteúdos',
      'A utilização exclusiva de textos impressos',
      'A ausência de participação dos usuários'
    ],
    c: 2,
    why: 'As mídias digitais permitem interação, atualização constante e compartilhamento de conteúdos em diferentes plataformas.'
  },
  {
    q: 'Uma pessoa utiliza a mesma senha em vários serviços digitais. Qual é o principal risco dessa prática?',
    a: [
      'A internet ficará mais lenta',
      'Uma invasão poderá comprometer várias contas ao mesmo tempo',
      'Os aplicativos deixarão de receber atualizações',
      'O armazenamento do celular será reduzido',
      'As contas ficarão automaticamente públicas'
    ],
    c: 1,
    why: 'Se uma senha for descoberta, criminosos poderão tentar utilizá-la para acessar outros serviços.'
  },
  {
    q: 'Ao encontrar uma notícia surpreendente nas redes sociais, qual procedimento demonstra melhor senso crítico?',
    a: [
      'Compartilhar antes que a notícia seja apagada',
      'Confiar na quantidade de curtidas',
      'Verificar a fonte, a data e comparar a informação com outras fontes confiáveis',
      'Acreditar quando a notícia tiver uma imagem',
      'Considerar verdadeiro tudo que é publicado por conhecidos'
    ],
    c: 2,
    why: 'A verificação da fonte, da data e a comparação com outras referências ajudam a identificar informações falsas ou desatualizadas.'
  },
  {
    q: 'Qual situação representa melhor o exercício da cidadania digital?',
    a: [
      'Publicar informações pessoais de outras pessoas sem autorização',
      'Utilizar perfis falsos para ofender usuários',
      'Compartilhar qualquer conteúdo sem verificar sua origem',
      'Respeitar opiniões, proteger dados pessoais e agir com responsabilidade na internet',
      'Ignorar as regras das plataformas digitais'
    ],
    c: 3,
    why: 'A cidadania digital envolve direitos, deveres, respeito, segurança e responsabilidade no ambiente online.'
  },
  {
    q: 'Uma ferramenta de inteligência artificial analisa milhares de imagens para reconhecer objetos. Qual capacidade está sendo utilizada?',
    a: [
      'Impressão física de documentos',
      'Reconhecimento de padrões em dados',
      'Substituição da conexão com a internet',
      'Armazenamento exclusivo de arquivos de texto',
      'Criação de equipamentos sem programação'
    ],
    c: 1,
    why: 'Sistemas de IA podem identificar padrões em grandes conjuntos de dados e utilizar esse aprendizado para reconhecer elementos em novas imagens.'
  }
,
  {
    q: 'Qual é a principal função da hierarquia visual em um projeto gráfico?',
    a: [
      'Utilizar o maior número possível de fontes',
      'Organizar os elementos para orientar a atenção do observador',
      'Eliminar todos os espaços vazios',
      'Deixar todos os elementos com o mesmo destaque',
      'Substituir a necessidade de planejamento'
    ],
    c: 1,
    why: 'A hierarquia visual organiza os elementos por importância e conduz o olhar do público.'
  },
  {
    q: 'Em uma composição visual, o contraste é utilizado principalmente para:',
    a: [
      'Tornar todos os elementos visualmente iguais',
      'Eliminar a identidade visual',
      'Destacar diferenças e melhorar a percepção das informações',
      'Impedir a leitura de textos',
      'Reduzir obrigatoriamente a quantidade de cores'
    ],
    c: 2,
    why: 'O contraste diferencia elementos e ajuda a destacar informações importantes.'
  },
  {
    q: 'Qual alternativa apresenta um exemplo de comunicação assíncrona?',
    a: [
      'Uma chamada de vídeo ao vivo',
      'Uma conversa telefônica',
      'Uma reunião virtual em tempo real',
      'O envio de um e-mail respondido algumas horas depois',
      'Uma transmissão ao vivo com participação imediata'
    ],
    c: 3,
    why: 'Na comunicação assíncrona, os participantes não precisam interagir no mesmo momento.'
  },
  {
    q: 'Por que a tipografia deve ser escolhida considerando o público e a finalidade do projeto?',
    a: [
      'Porque todas as fontes possuem a mesma função',
      'Porque a tipografia influencia a legibilidade e a comunicação da mensagem',
      'Porque fontes decorativas sempre são mais acessíveis',
      'Porque o tamanho do texto não interfere na leitura',
      'Porque a tipografia substitui as imagens'
    ],
    c: 1,
    why: 'A escolha tipográfica influencia a leitura, a organização e a personalidade visual do projeto.'
  },
  {
    q: 'Uma imagem encontrada na internet pode ser utilizada livremente em qualquer trabalho?',
    a: [
      'Sim, desde que esteja disponível em um site',
      'Sim, se não possuir marca-d’água',
      'Não, é necessário considerar direitos autorais e condições de uso',
      'Sim, desde que seja publicada em uma rede social',
      'Não, imagens digitais nunca podem ser reutilizadas'
    ],
    c: 2,
    why: 'Imagens podem possuir proteção autoral. É importante verificar licenças e permissões de utilização.'
  },
  {
    q: 'Qual é a principal vantagem de utilizar um sistema de identidade visual consistente?',
    a: [
      'Impedir mudanças futuras na marca',
      'Fazer cada material apresentar uma aparência completamente diferente',
      'Facilitar o reconhecimento e manter unidade na comunicação da marca',
      'Eliminar a necessidade de um logotipo',
      'Garantir vendas independentemente do produto'
    ],
    c: 2,
    why: 'A consistência visual ajuda o público a reconhecer e associar os materiais à mesma marca.'
  },
  {
    q: 'O que caracteriza uma prática de phishing?',
    a: [
      'Uma atualização legítima do sistema',
      'Uma tentativa de enganar alguém para obter informações confidenciais',
      'Uma técnica de organização de arquivos',
      'Um método de compactação de imagens',
      'Uma ferramenta de edição de vídeos'
    ],
    c: 1,
    why: 'O phishing utiliza mensagens ou páginas falsas para tentar roubar senhas e outros dados.'
  },
  {
    q: 'Em um projeto de design, qual é a função principal do alinhamento?',
    a: [
      'Organizar os elementos e criar relações visuais entre eles',
      'Aumentar aleatoriamente os tamanhos dos objetos',
      'Eliminar a distribuição dos elementos',
      'Utilizar somente imagens centralizadas',
      'Substituir o contraste por cores semelhantes'
    ],
    c: 0,
    why: 'O alinhamento cria organização e conexão visual entre os elementos de uma composição.'
  },
  {
    q: 'Qual atitude contribui para uma comunicação mais acessível nas mídias digitais?',
    a: [
      'Utilizar textos pequenos e com pouco contraste',
      'Publicar vídeos sem considerar legendas',
      'Organizar informações e oferecer recursos como textos alternativos e legendas',
      'Utilizar apenas cores para transmitir todas as informações',
      'Evitar descrições em imagens'
    ],
    c: 2,
    why: 'Recursos de acessibilidade ajudam pessoas com diferentes necessidades a compreender o conteúdo.'
  },
  {
    q: 'Qual é o papel do briefing no desenvolvimento de um projeto de design?',
    a: [
      'Definir apenas as cores finais',
      'Substituir todas as etapas de criação',
      'Reunir informações sobre objetivos, público e necessidades do projeto',
      'Garantir que não haverá alterações',
      'Escolher automaticamente o programa utilizado'
    ],
    c: 2,
    why: 'O briefing orienta o projeto ao reunir informações essenciais sobre o problema e os objetivos.'
  },
  {
    q: 'Uma publicação possui muitas informações, cores e elementos competindo pela atenção. Qual princípio pode ajudar a melhorar sua organização?',
    a: [
      'Hierarquia visual',
      'Repetição aleatória',
      'Excesso de ornamentação',
      'Ausência de alinhamento',
      'Redução obrigatória de todas as fontes'
    ],
    c: 0,
    why: 'A hierarquia visual estabelece prioridades e facilita a compreensão da mensagem.'
  },
  {
    q: 'Qual é uma limitação importante que deve ser considerada ao utilizar inteligência artificial para produzir conteúdo?',
    a: [
      'A IA nunca consegue gerar textos',
      'Todo conteúdo produzido é automaticamente verdadeiro',
      'A IA pode apresentar informações incorretas ou inventadas',
      'A IA funciona somente sem dados',
      'O conteúdo gerado não pode ser revisado'
    ],
    c: 2,
    why: 'Conteúdos gerados por IA precisam ser avaliados e verificados antes de serem utilizados.'
  },
  {
    q: 'Qual situação representa melhor o uso de metodologias ativas na aprendizagem?',
    a: [
      'O estudante apenas copia o conteúdo sem participar',
      'O professor apresenta informações sem atividades',
      'O estudante resolve problemas e participa da construção do conhecimento',
      'A turma evita qualquer atividade em grupo',
      'O aprendizado depende exclusivamente da memorização'
    ],
    c: 2,
    why: 'Metodologias ativas estimulam a participação e o envolvimento do estudante no processo de aprendizagem.'
  },
  {
    q: 'Por que é importante considerar o público-alvo antes de criar uma publicação digital?',
    a: [
      'Para utilizar sempre a mesma linguagem em qualquer situação',
      'Para adaptar linguagem, formato e conteúdo às necessidades do público',
      'Para evitar qualquer tipo de planejamento',
      'Para escolher elementos visuais sem objetivo',
      'Para eliminar a identidade da comunicação'
    ],
    c: 1,
    why: 'Conhecer o público ajuda a produzir mensagens mais relevantes, compreensíveis e adequadas.'
  },
  {
    q: 'Qual alternativa descreve melhor a diferença entre resolução e formato de imagem?',
    a: [
      'São exatamente a mesma característica',
      'Resolução está relacionada à quantidade de detalhes; formato define como o arquivo é codificado e armazenado',
      'Formato determina exclusivamente o tamanho físico da tela',
      'Resolução define apenas as cores disponíveis',
      'Formato é utilizado somente em arquivos de áudio'
    ],
    c: 1,
    why: 'A resolução influencia o nível de detalhes da imagem, enquanto formatos como JPEG e PNG definem formas de armazenamento.'
  },
  {
    q: 'Uma empresa deseja criar uma identidade visual facilmente reconhecida pelo público. Qual decisão contribui mais para esse objetivo?',
    a: [
      'Alterar completamente as cores em cada publicação',
      'Utilizar elementos visuais consistentes em diferentes materiais',
      'Evitar qualquer padrão de composição',
      'Usar fontes diferentes em todas as peças',
      'Eliminar o logotipo dos materiais'
    ],
    c: 1,
    why: 'A consistência dos elementos visuais fortalece o reconhecimento e a identidade de uma marca.'
  },
  {
    q: 'Qual é a principal diferença entre imagens vetoriais e imagens rasterizadas?',
    a: [
      'Imagens vetoriais são sempre fotografias',
      'Imagens rasterizadas nunca podem ser editadas',
      'Imagens vetoriais podem ser ampliadas sem perda de qualidade, enquanto rasterizadas dependem de pixels',
      'Imagens rasterizadas são formadas exclusivamente por linhas matemáticas',
      'Não existe diferença entre os dois formatos'
    ],
    c: 2,
    why: 'Imagens vetoriais são descritas matematicamente; imagens rasterizadas são compostas por pixels.'
  },
  {
    q: 'Em uma página com muito conteúdo, qual recurso ajuda o usuário a encontrar informações com maior facilidade?',
    a: [
      'Organização por títulos, categorias e menus claros',
      'Textos longos sem separação',
      'Botões sem identificação',
      'Elementos posicionados aleatoriamente',
      'Ausência de navegação'
    ],
    c: 0,
    why: 'Uma estrutura organizada facilita a localização das informações e melhora a experiência do usuário.'
  },
  {
    q: 'O que significa experiência do usuário (UX) no desenvolvimento de um site?',
    a: [
      'Apenas a escolha das cores da página',
      'A quantidade de imagens utilizadas',
      'A experiência geral de uma pessoa ao utilizar o produto ou serviço',
      'Somente a velocidade da conexão de internet',
      'A programação visual do logotipo'
    ],
    c: 2,
    why: 'UX considera a experiência completa do usuário, incluindo facilidade de uso, eficiência e satisfação.'
  },
  {
    q: 'Qual alternativa representa uma boa prática de proteção de dados pessoais?',
    a: [
      'Publicar documentos pessoais em redes sociais',
      'Compartilhar códigos de autenticação com desconhecidos',
      'Fornecer dados pessoais apenas quando necessário e em serviços confiáveis',
      'Utilizar redes públicas para acessar qualquer conta sem cuidado',
      'Manter todas as informações pessoais visíveis'
    ],
    c: 2,
    why: 'Limitar o compartilhamento de dados reduz a exposição e os riscos relacionados à privacidade.'
  },
  {
    q: 'Uma mensagem apresenta um link urgente solicitando a confirmação da senha de uma conta. Qual atitude é mais segura?',
    a: [
      'Acessar imediatamente o link',
      'Enviar a senha para confirmar a identidade',
      'Verificar a solicitação pelos canais oficiais do serviço',
      'Encaminhar a mensagem para todos os contatos',
      'Desativar o antivírus para abrir o endereço'
    ],
    c: 2,
    why: 'Solicitações suspeitas devem ser verificadas diretamente nos canais oficiais, sem fornecer credenciais por links desconhecidos.'
  },
  {
    q: 'Qual é a finalidade principal de uma licença Creative Commons?',
    a: [
      'Impedir qualquer compartilhamento de conteúdo',
      'Estabelecer condições para que outras pessoas utilizem uma obra',
      'Garantir que toda obra seja de domínio público',
      'Eliminar automaticamente os direitos autorais',
      'Proibir a identificação do autor'
    ],
    c: 1,
    why: 'As licenças Creative Commons permitem que autores definam condições específicas de reutilização de suas obras.'
  },
  {
    q: 'Ao produzir um vídeo educativo, por que é importante organizar um roteiro antes da gravação?',
    a: [
      'Para impedir alterações durante a edição',
      'Para garantir que o vídeo tenha sempre a mesma duração',
      'Para organizar ideias, sequência das informações e objetivo da mensagem',
      'Para eliminar a necessidade de revisar o conteúdo',
      'Para substituir completamente a edição'
    ],
    c: 2,
    why: 'O roteiro ajuda a estruturar o conteúdo e manter a comunicação clara e coerente.'
  },
  {
    q: 'Qual situação demonstra o uso adequado de contraste entre texto e fundo?',
    a: [
      'Texto amarelo sobre fundo branco',
      'Texto cinza claro sobre fundo branco',
      'Texto escuro sobre fundo claro, com diferença suficiente para facilitar a leitura',
      'Texto com a mesma cor do fundo',
      'Texto transparente sobre uma fotografia'
    ],
    c: 2,
    why: 'Um contraste adequado melhora a legibilidade e facilita o acesso à informação.'
  },
  {
    q: 'Em uma publicação digital, qual é o risco de utilizar informações sem verificar sua autoria e origem?',
    a: [
      'Aumentar automaticamente a qualidade visual',
      'Divulgar conteúdos incorretos ou violar direitos autorais',
      'Melhorar a acessibilidade do material',
      'Garantir maior credibilidade',
      'Reduzir a necessidade de planejamento'
    ],
    c: 1,
    why: 'A falta de verificação pode contribuir para a desinformação e para o uso indevido de obras.'
  },
  {
    q: 'Qual é a função de um protótipo no desenvolvimento de uma interface digital?',
    a: [
      'Substituir definitivamente o produto final',
      'Permitir testar a estrutura e a navegação antes da implementação completa',
      'Impedir mudanças no projeto',
      'Definir automaticamente o conteúdo de todas as páginas',
      'Eliminar a necessidade de ouvir os usuários'
    ],
    c: 1,
    why: 'Protótipos permitem avaliar ideias e identificar problemas antes do desenvolvimento final.'
  },
  {
    q: 'Qual indicador mede diretamente a proporção de pessoas que clicaram em um link em relação às visualizações de uma publicação?',
    a: [
      'Taxa de cliques (CTR)',
      'Resolução da imagem',
      'Quantidade de fontes utilizadas',
      'Tempo de carregamento do computador',
      'Número de arquivos armazenados'
    ],
    c: 0,
    why: 'A taxa de cliques relaciona o número de cliques com as impressões ou visualizações consideradas.'
  },
  {
    q: 'Uma publicação recebe muitos comentários negativos. Qual atitude representa uma gestão responsável da comunicação?',
    a: [
      'Apagar todas as críticas automaticamente',
      'Responder com ofensas aos usuários',
      'Analisar as manifestações e responder com respeito e transparência',
      'Compartilhar dados pessoais dos críticos',
      'Ignorar qualquer problema relatado'
    ],
    c: 2,
    why: 'Uma comunicação responsável considera críticas, esclarece dúvidas e mantém o respeito nas interações.'
  },
  {
    q: 'Por que a compressão de imagens é utilizada em sites?',
    a: [
      'Para aumentar obrigatoriamente a resolução',
      'Para reduzir o tamanho dos arquivos e ajudar no carregamento das páginas',
      'Para transformar imagens em arquivos de áudio',
      'Para eliminar todas as cores',
      'Para impedir a exibição em celulares'
    ],
    c: 1,
    why: 'A compressão pode diminuir o tamanho dos arquivos e contribuir para páginas mais rápidas.'
  },
  {
    q: 'Qual alternativa descreve melhor o conceito de desinformação?',
    a: [
      'Qualquer informação publicada em um site',
      'Informação falsa ou enganosa que pode ser divulgada para confundir ou manipular pessoas',
      'Uma notícia verdadeira publicada por um jornal',
      'Uma opinião pessoal identificada como opinião',
      'Um conteúdo educativo com referências'
    ],
    c: 1,
    why: 'Desinformação envolve conteúdos falsos ou enganosos que podem influenciar a percepção das pessoas.'
  },
  {
    q: 'Em um projeto gráfico, por que o espaço em branco é importante?',
    a: [
      'Porque representa necessariamente um erro de composição',
      'Porque impede a leitura de textos',
      'Porque ajuda a organizar os elementos e melhora a compreensão visual',
      'Porque deve ocupar sempre a maior parte da página',
      'Porque substitui todos os elementos gráficos'
    ],
    c: 2,
    why: 'O espaço em branco cria respiro visual, separa informações e contribui para a organização da composição.'
  },
  {
    q: 'Qual é a principal finalidade de uma chamada para ação (CTA) em uma publicação digital?',
    a: [
      'Apresentar informações sem orientar o usuário',
      'Estimular o usuário a realizar uma ação específica',
      'Substituir todo o conteúdo visual',
      'Impedir a interação com a publicação',
      'Aumentar o tamanho dos arquivos'
    ],
    c: 1,
    why: 'Uma CTA orienta o público para uma ação, como acessar um site, inscrever-se ou conhecer um produto.'
  },
  {
    q: 'Ao utilizar inteligência artificial para criar uma imagem, qual cuidado deve ser considerado?',
    a: [
      'Considerar que toda imagem gerada é livre de restrições',
      'Ignorar possíveis vieses e direitos relacionados ao conteúdo utilizado',
      'Publicar o resultado sem qualquer avaliação',
      'Presumir que a ferramenta nunca comete erros',
      'Evitar informar que houve uso de IA em qualquer situação'
    ],
    c: 1,
    why: 'É importante avaliar resultados, possíveis vieses, direitos envolvidos e regras aplicáveis ao uso do conteúdo.'
  },
  {
    q: 'Qual princípio de design ajuda a manter elementos relacionados visualmente próximos?',
    a: [
      'Proximidade',
      'Distorção',
      'Fragmentação',
      'Aleatoriedade',
      'Saturação'
    ],
    c: 0,
    why: 'O princípio da proximidade agrupa elementos relacionados e facilita a compreensão das informações.'
  },
  {
    q: 'Qual é uma vantagem de utilizar formatos responsivos no desenvolvimento de sites?',
    a: [
      'Exibir exatamente a mesma disposição em qualquer tela',
      'Adaptar a apresentação do conteúdo a diferentes tamanhos de dispositivos',
      'Impedir o acesso por celulares',
      'Eliminar a necessidade de navegação',
      'Aumentar obrigatoriamente o consumo de dados'
    ],
    c: 1,
    why: 'O design responsivo adapta a interface a diferentes telas, melhorando a experiência em celulares, tablets e computadores.'
  },
  {
    q: 'Qual atitude ajuda a evitar conflitos durante uma colaboração em ambientes digitais?',
    a: [
      'Ignorar as contribuições dos participantes',
      'Alterar arquivos compartilhados sem comunicar o grupo',
      'Estabelecer regras de comunicação e respeitar as opiniões dos colaboradores',
      'Compartilhar conversas privadas sem autorização',
      'Impedir que os integrantes apresentem sugestões'
    ],
    c: 2,
    why: 'A colaboração digital depende de comunicação clara, respeito e organização entre os participantes.'
  }
,
  {
    q: 'Ao criar uma interface para celular, qual decisão favorece a usabilidade?',
    a: [
      'Utilizar botões pequenos e próximos uns dos outros',
      'Priorizar controles fáceis de identificar e tocar',
      'Esconder as funções principais em menus complexos',
      'Utilizar textos sem contraste',
      'Evitar qualquer indicação de navegação'
    ],
    c: 1,
    why: 'Controles claros e fáceis de tocar tornam a navegação mais simples em dispositivos móveis.'
  },
  {
    q: 'Qual é a finalidade de um mapa de empatia no processo de design?',
    a: [
      'Definir exclusivamente as cores de uma marca',
      'Calcular o custo de impressão de um projeto',
      'Compreender melhor pensamentos, sentimentos e necessidades dos usuários',
      'Substituir os testes de usabilidade',
      'Criar automaticamente o código de um aplicativo'
    ],
    c: 2,
    why: 'O mapa de empatia ajuda a compreender o público e orientar soluções mais adequadas às suas necessidades.'
  },
  {
    q: 'Uma imagem apresenta dimensões de 1920 × 1080 pixels. O que esses números representam?',
    a: [
      'A quantidade de cores disponíveis',
      'A largura e a altura da imagem em pixels',
      'O tamanho do arquivo em megabytes',
      'A velocidade de carregamento',
      'A quantidade de camadas da imagem'
    ],
    c: 1,
    why: 'As dimensões em pixels indicam a largura e a altura da imagem digital.'
  },
  {
    q: 'Qual é a principal característica do formato PNG em relação à transparência?',
    a: [
      'Não permite imagens coloridas',
      'Armazena somente arquivos de áudio',
      'Pode preservar áreas transparentes na imagem',
      'Sempre produz arquivos menores que JPEG',
      'Não permite compressão'
    ],
    c: 2,
    why: 'O PNG oferece suporte à transparência, sendo útil para logotipos, ícones e elementos gráficos.'
  },
  {
    q: 'Em uma composição, utilizar cores complementares significa escolher cores que:',
    a: [
      'Estão próximas no círculo cromático',
      'São exatamente iguais',
      'Estão em posições opostas no círculo cromático',
      'Possuem obrigatoriamente a mesma luminosidade',
      'Não podem ser utilizadas juntas'
    ],
    c: 2,
    why: 'Cores complementares ficam em posições opostas no círculo cromático e podem produzir contraste marcante.'
  },
  {
    q: 'Qual é a principal função das legendas em vídeos digitais?',
    a: [
      'Aumentar automaticamente a resolução',
      'Facilitar o acompanhamento do conteúdo falado e ampliar a acessibilidade',
      'Substituir todas as imagens',
      'Reduzir a duração do vídeo',
      'Impedir a reprodução sem internet'
    ],
    c: 1,
    why: 'Legendas ajudam pessoas surdas ou com deficiência auditiva e também auxiliam quem assiste sem áudio.'
  },
  {
    q: 'Uma equipe deseja avaliar se os usuários conseguem encontrar facilmente um botão em um aplicativo. Qual método é mais adequado?',
    a: [
      'Testar a navegação com usuários e observar suas dificuldades',
      'Escolher a posição do botão sem testar',
      'Aumentar todos os elementos da tela',
      'Retirar os menus do aplicativo',
      'Avaliar somente a quantidade de cores'
    ],
    c: 0,
    why: 'Testes de usabilidade permitem observar como pessoas reais interagem com uma interface.'
  },
  {
    q: 'O que caracteriza uma bolha de filtro nas plataformas digitais?',
    a: [
      'A exclusão de todos os conteúdos publicados',
      'A apresentação de conteúdos personalizados que pode limitar o contato com perspectivas diferentes',
      'A proteção automática contra notícias falsas',
      'A impossibilidade de utilizar mecanismos de busca',
      'A remoção de anúncios de uma plataforma'
    ],
    c: 1,
    why: 'A personalização pode reforçar interesses existentes e reduzir a exposição a opiniões diferentes.'
  },
  {
    q: 'Qual é a diferença entre RGB e CMYK no uso de cores?',
    a: [
      'RGB é utilizado principalmente em telas e CMYK em processos de impressão',
      'RGB é exclusivo para impressão e CMYK para vídeos',
      'Os dois sistemas representam apenas tons de cinza',
      'CMYK não permite produzir imagens coloridas',
      'RGB e CMYK são formatos de arquivo'
    ],
    c: 0,
    why: 'RGB trabalha com luz nas telas, enquanto CMYK utiliza tintas no processo de impressão.'
  },
  {
    q: 'Qual alternativa representa uma aplicação adequada de análise de métricas em redes sociais?',
    a: [
      'Alterar a identidade visual diariamente',
      'Avaliar alcance e engajamento para compreender o desempenho das publicações',
      'Ignorar os resultados das campanhas',
      'Considerar apenas o número de seguidores',
      'Publicar sem definir objetivos'
    ],
    c: 1,
    why: 'Métricas como alcance, cliques e engajamento ajudam a avaliar resultados em relação aos objetivos.'
  },
  {
    q: 'Por que é importante realizar cópias de segurança de arquivos digitais?',
    a: [
      'Para aumentar a quantidade de anúncios',
      'Para evitar a necessidade de organizar arquivos',
      'Para recuperar informações em caso de perda, falha ou dano',
      'Para impedir qualquer atualização',
      'Para tornar arquivos automaticamente públicos'
    ],
    c: 2,
    why: 'Backups permitem recuperar dados quando os arquivos originais são perdidos ou danificados.'
  },
  {
    q: 'Qual é o principal objetivo de uma paleta de cores em um projeto gráfico?',
    a: [
      'Definir um conjunto de cores que mantenha coerência visual',
      'Impedir o uso de imagens',
      'Substituir a tipografia',
      'Garantir que todas as cores tenham o mesmo destaque',
      'Eliminar a necessidade de conhecer o público'
    ],
    c: 0,
    why: 'A paleta orienta o uso das cores e contribui para a unidade visual do projeto.'
  },
  {
    q: 'Uma pessoa recebe um arquivo desconhecido enviado por um contato que não esperava a mensagem. Qual atitude é mais segura?',
    a: [
      'Abrir imediatamente o arquivo',
      'Encaminhar o arquivo para outros contatos',
      'Confirmar a origem da mensagem e verificar o arquivo antes de abri-lo',
      'Desativar as proteções do aparelho',
      'Compartilhar o arquivo em grupos públicos'
    ],
    c: 2,
    why: 'Arquivos inesperados podem conter ameaças. Confirmar a origem e verificar o conteúdo reduz riscos.'
  },
  {
    q: 'Qual é a função do storytelling em uma comunicação digital?',
    a: [
      'Organizar informações por ordem alfabética',
      'Utilizar narrativas para transmitir mensagens e criar conexão com o público',
      'Eliminar a necessidade de planejamento',
      'Substituir todos os recursos visuais',
      'Garantir que uma publicação se torne viral'
    ],
    c: 1,
    why: 'O storytelling utiliza narrativas para tornar a comunicação mais envolvente e significativa.'
  },
  {
    q: 'Qual alternativa descreve melhor o conceito de acessibilidade digital?',
    a: [
      'Criar conteúdos disponíveis somente em computadores',
      'Desenvolver ambientes e conteúdos que possam ser utilizados por pessoas com diferentes necessidades',
      'Utilizar exclusivamente imagens e vídeos',
      'Eliminar recursos de navegação por teclado',
      'Reduzir o tamanho de todas as fontes'
    ],
    c: 1,
    why: 'A acessibilidade digital busca remover barreiras para que diferentes pessoas possam acessar e utilizar conteúdos e serviços.'
  },
  {
    q: 'Em um projeto de interface, o que é um wireframe?',
    a: [
      'Uma versão final com todos os efeitos visuais',
      'Um esquema que representa a estrutura e a organização dos elementos de uma tela',
      'Um formato de áudio digital',
      'Um sistema de armazenamento em nuvem',
      'Uma ferramenta exclusiva para edição de fotografias'
    ],
    c: 1,
    why: 'O wireframe representa a estrutura básica de uma interface antes da definição visual detalhada.'
  },
  {
    q: 'Qual cuidado deve ser tomado ao utilizar músicas em vídeos publicados na internet?',
    a: [
      'Utilizar qualquer música sem verificar as permissões',
      'Considerar direitos autorais e as condições de uso da música',
      'Acreditar que músicas curtas nunca possuem proteção',
      'Remover o nome do artista para liberar o uso',
      'Presumir que toda música encontrada em redes sociais é livre'
    ],
    c: 1,
    why: 'Músicas podem ser protegidas por direitos autorais. É necessário verificar licenças e permissões de uso.'
  },
  {
    q: 'Qual é a importância de definir objetivos antes de iniciar uma campanha digital?',
    a: [
      'Permitir avaliar se as ações realizadas alcançaram os resultados desejados',
      'Impedir alterações durante a campanha',
      'Garantir resultados sem considerar o público',
      'Eliminar a necessidade de acompanhar métricas',
      'Substituir a criação do conteúdo'
    ],
    c: 0,
    why: 'Objetivos claros orientam as decisões e permitem avaliar o desempenho da campanha.'
  },
  {
    q: 'Uma plataforma recomenda conteúdos com base no histórico de navegação do usuário. Qual tecnologia pode estar envolvida nesse processo?',
    a: [
      'Impressão 3D',
      'Sistemas de recomendação que analisam dados e padrões de comportamento',
      'Edição vetorial de imagens',
      'Compactação de arquivos de áudio',
      'Digitalização de documentos impressos'
    ],
    c: 1,
    why: 'Sistemas de recomendação analisam dados e padrões para sugerir conteúdos que possam interessar ao usuário.'
  }
,
  {
    q: 'Uma equipe percebe que os usuários abandonam um formulário antes de concluí-lo. Qual ação pode ajudar a identificar o problema?',
    a: [
      'Adicionar mais campos obrigatórios',
      'Observar usuários realizando o preenchimento e analisar suas dificuldades',
      'Remover todas as instruções',
      'Alterar aleatoriamente as cores',
      'Aumentar o número de etapas sem avaliação'
    ],
    c: 1,
    why: 'A observação e os testes de usabilidade ajudam a identificar obstáculos na experiência dos usuários.'
  },
  {
    q: 'Qual é a principal diferença entre interface do usuário (UI) e experiência do usuário (UX)?',
    a: [
      'UI trata da aparência e dos elementos de interação; UX considera a experiência geral de uso',
      'UI e UX significam exclusivamente programação',
      'UX trata apenas das cores e UI apenas da velocidade',
      'UI é utilizada somente em jogos',
      'UX substitui a necessidade de uma interface'
    ],
    c: 0,
    why: 'UI está relacionada à interface e seus elementos visuais e interativos. UX considera a experiência completa de utilização.'
  },
  {
    q: 'Uma campanha digital alcançou muitas pessoas, mas recebeu poucas interações. Qual conclusão é mais adequada?',
    a: [
      'O alcance garante que a campanha atingiu todos os objetivos',
      'O conteúdo pode precisar de ajustes para estimular a participação do público',
      'As métricas não possuem utilidade',
      'A campanha deve ser encerrada sem análise',
      'O número de seguidores deve ser a única medida considerada'
    ],
    c: 1,
    why: 'Alcance e engajamento medem aspectos diferentes. É necessário analisar os objetivos e o comportamento do público.'
  },
  {
    q: 'Qual prática contribui para evitar a sobrecarga de informações em uma peça gráfica?',
    a: [
      'Utilizar todos os elementos disponíveis',
      'Organizar o conteúdo por importância e eliminar informações desnecessárias',
      'Aplicar várias fontes sem critério',
      'Reduzir o espaço entre todos os elementos',
      'Destacar todas as informações com a mesma intensidade'
    ],
    c: 1,
    why: 'A seleção e a organização das informações tornam a mensagem mais clara e facilitam sua compreensão.'
  },
  {
    q: 'Por que o texto alternativo é importante em imagens de páginas digitais?',
    a: [
      'Porque aumenta obrigatoriamente a resolução',
      'Porque descreve o conteúdo visual para tecnologias assistivas',
      'Porque substitui todos os títulos',
      'Porque impede o carregamento das imagens',
      'Porque altera automaticamente as cores'
    ],
    c: 1,
    why: 'O texto alternativo pode transmitir informações visuais a pessoas que utilizam leitores de tela.'
  },
  {
    q: 'Qual é o risco de utilizar apenas cores para indicar informações importantes em uma interface?',
    a: [
      'A interface ficará necessariamente mais lenta',
      'Alguns usuários podem não distinguir as informações, especialmente pessoas com daltonismo',
      'O conteúdo será convertido em áudio',
      'A página deixará de funcionar em computadores',
      'As imagens perderão sua resolução'
    ],
    c: 1,
    why: 'Informações também devem ser indicadas por textos, ícones ou outros recursos, não apenas por cores.'
  },
  {
    q: 'Ao planejar uma publicação para diferentes redes sociais, qual estratégia é mais adequada?',
    a: [
      'Publicar sempre o mesmo formato sem considerar a plataforma',
      'Adaptar linguagem, formato e apresentação ao público e às características de cada plataforma',
      'Ignorar as dimensões recomendadas',
      'Utilizar exclusivamente textos longos',
      'Evitar analisar os resultados'
    ],
    c: 1,
    why: 'Cada plataforma possui características e públicos próprios, por isso a adaptação pode melhorar a comunicação.'
  },
  {
    q: 'Qual é a função de um sistema de gerenciamento de conteúdo (CMS)?',
    a: [
      'Controlar exclusivamente a temperatura do computador',
      'Facilitar a criação, edição e organização de conteúdos digitais',
      'Substituir todos os sistemas operacionais',
      'Criar conexões físicas de internet',
      'Impedir a publicação de páginas'
    ],
    c: 1,
    why: 'Um CMS permite administrar conteúdos de sites sem exigir que todas as alterações sejam feitas diretamente no código.'
  },
  {
    q: 'Uma imagem será impressa em tamanho grande. Qual cuidado é importante para evitar perda perceptível de qualidade?',
    a: [
      'Utilizar uma imagem com resolução adequada ao tamanho e à distância de visualização',
      'Reduzir a imagem para poucos pixels',
      'Converter qualquer arquivo para GIF',
      'Aumentar o tamanho sem considerar os pixels disponíveis',
      'Aplicar transparência em toda a imagem'
    ],
    c: 0,
    why: 'A resolução necessária depende do tamanho de impressão e da distância em que o material será observado.'
  },
  {
    q: 'Qual alternativa apresenta uma característica de uma fonte tipográfica serifada?',
    a: [
      'Possui pequenos traços nas extremidades de algumas letras',
      'Não apresenta qualquer diferença entre letras',
      'É formada exclusivamente por símbolos',
      'Não pode ser utilizada em textos impressos',
      'Possui sempre aparência manuscrita'
    ],
    c: 0,
    why: 'Fontes serifadas apresentam pequenos prolongamentos ou acabamentos nas extremidades de determinados caracteres.'
  },
  {
    q: 'Por que é importante identificar conteúdos patrocinados em plataformas digitais?',
    a: [
      'Para impedir que os usuários visualizem anúncios',
      'Para deixar claro quando existe uma relação comercial ou publicidade',
      'Para garantir que o produto anunciado seja o melhor',
      'Para eliminar a necessidade de verificar informações',
      'Para transformar anúncios em notícias'
    ],
    c: 1,
    why: 'A identificação da publicidade favorece a transparência e permite que o público reconheça conteúdos comerciais.'
  },
  {
    q: 'Qual comportamento pode indicar uma tentativa de engenharia social?',
    a: [
      'Uma pessoa solicita informações confidenciais usando pressão ou fingindo ser alguém de confiança',
      'Um programa organiza arquivos por nome',
      'Um site apresenta seu endereço institucional',
      'Um usuário altera a própria foto de perfil',
      'Um aplicativo recebe uma atualização oficial'
    ],
    c: 0,
    why: 'A engenharia social explora a confiança e as emoções das pessoas para obter informações ou provocar ações.'
  },
  {
    q: 'Qual é a finalidade de manter uma linguagem visual consistente em uma plataforma educacional?',
    a: [
      'Dificultar o reconhecimento das seções',
      'Criar unidade visual e facilitar a identificação dos elementos',
      'Impedir atualizações futuras',
      'Utilizar obrigatoriamente apenas uma cor',
      'Eliminar a hierarquia das informações'
    ],
    c: 1,
    why: 'A consistência visual ajuda os usuários a reconhecer padrões e compreender melhor a organização da plataforma.'
  },
  {
    q: 'Ao utilizar dados de uma pesquisa em um infográfico, qual cuidado é essencial?',
    a: [
      'Modificar os números para melhorar a aparência',
      'Apresentar os dados sem indicar sua origem',
      'Verificar a fonte e representar os dados de maneira fiel',
      'Escolher apenas os números que confirmam uma opinião',
      'Eliminar informações que contradizem a conclusão'
    ],
    c: 2,
    why: 'A precisão dos dados e a identificação das fontes são fundamentais para a credibilidade de um infográfico.'
  },
  {
    q: 'Qual é a principal vantagem de utilizar componentes reutilizáveis no desenvolvimento de interfaces?',
    a: [
      'Impedir a manutenção do projeto',
      'Reaproveitar elementos e manter maior consistência entre telas',
      'Aumentar obrigatoriamente o tamanho dos arquivos',
      'Eliminar a necessidade de testes',
      'Criar elementos diferentes em todas as páginas'
    ],
    c: 1,
    why: 'Componentes reutilizáveis reduzem repetição e ajudam a manter padrões visuais e funcionais.'
  },
  {
    q: 'Uma pessoa utiliza uma imagem gerada por IA que apresenta informações visuais incorretas. Qual deve ser sua atitude antes de publicar?',
    a: [
      'Publicar sem revisar, pois a IA não comete erros',
      'Verificar o resultado e corrigir problemas relevantes',
      'Aumentar a saturação para esconder os erros',
      'Compartilhar como fotografia documental sem confirmação',
      'Ignorar possíveis impactos da imagem'
    ],
    c: 1,
    why: 'Conteúdos gerados por IA podem conter erros e precisam de revisão antes da divulgação.'
  },
  {
    q: 'Qual é a função de um domínio na identificação de um site?',
    a: [
      'Representar o endereço utilizado para localizar o site na internet',
      'Definir a resolução das imagens',
      'Armazenar exclusivamente vídeos',
      'Substituir o conteúdo das páginas',
      'Determinar o número de usuários conectados'
    ],
    c: 0,
    why: 'O domínio é um nome utilizado para acessar um endereço na internet, como exemplo.com.'
  },
  {
    q: 'Por que é importante atualizar regularmente um site ou aplicativo?',
    a: [
      'Para remover toda a identidade visual',
      'Para corrigir falhas, melhorar a segurança e aperfeiçoar funcionalidades',
      'Para impedir o acesso de novos usuários',
      'Para eliminar todos os dados automaticamente',
      'Para garantir que nunca haverá problemas'
    ],
    c: 1,
    why: 'Atualizações podem corrigir vulnerabilidades, resolver problemas e melhorar o funcionamento do produto.'
  },
  {
    q: 'Qual alternativa representa melhor o conceito de cultura participativa nas mídias digitais?',
    a: [
      'Os usuários apenas recebem informações sem interagir',
      'Os usuários também produzem, compartilham e colaboram na circulação de conteúdos',
      'Somente empresas podem publicar conteúdos',
      'A comunicação ocorre exclusivamente por meios impressos',
      'A participação do público é proibida'
    ],
    c: 1,
    why: 'A cultura participativa valoriza a contribuição dos usuários na criação, circulação e discussão de conteúdos.'
  },
  {
    q: 'Uma equipe deseja saber se uma mudança no botão de cadastro melhorou os resultados. Qual método permite comparar duas versões?',
    a: [
      'Backup incremental',
      'Teste A/B',
      'Compressão de imagem',
      'Mapeamento de cores',
      'Restauração de sistema'
    ],
    c: 1,
    why: 'O teste A/B compara versões diferentes para avaliar qual apresenta melhor desempenho em determinado objetivo.'
  }
,
  {
    q: 'Uma equipe está desenvolvendo um site educacional e percebe que os usuários não encontram facilmente os conteúdos. Qual mudança seria mais adequada?',
    a: [
      'Adicionar mais elementos decorativos à página inicial',
      'Reorganizar a navegação com categorias claras e títulos objetivos',
      'Retirar todos os menus',
      'Diminuir o contraste dos textos',
      'Colocar todos os conteúdos em uma única página sem divisões'
    ],
    c: 1,
    why: 'Uma navegação organizada facilita a localização dos conteúdos e melhora a experiência dos usuários.'
  },
  {
    q: 'Qual é a principal finalidade de um guia de estilo em um projeto de design digital?',
    a: [
      'Definir padrões visuais e regras de utilização dos elementos da identidade',
      'Substituir todas as pesquisas com usuários',
      'Impedir a criação de novas páginas',
      'Armazenar exclusivamente arquivos de vídeo',
      'Determinar automaticamente o conteúdo textual'
    ],
    c: 0,
    why: 'O guia de estilo documenta padrões de cores, tipografia, componentes e outros elementos visuais.'
  },
  {
    q: 'Uma publicação apresenta um gráfico sem indicar a escala do eixo vertical. Qual problema isso pode causar?',
    a: [
      'Melhorar automaticamente a precisão dos dados',
      'Dificultar a interpretação e produzir uma percepção distorcida das diferenças',
      'Aumentar a acessibilidade do gráfico',
      'Eliminar a necessidade de apresentar a fonte',
      'Garantir que todos compreendam os resultados'
    ],
    c: 1,
    why: 'Escalas inadequadas ou ausentes podem dificultar a leitura e levar a interpretações equivocadas.'
  },
  {
    q: 'Qual prática ajuda a tornar uma senha mais resistente a tentativas de descoberta?',
    a: [
      'Utilizar apenas o nome e a data de nascimento',
      'Repetir uma senha curta em diferentes serviços',
      'Criar uma senha longa, exclusiva e difícil de adivinhar',
      'Compartilhar a senha com pessoas próximas',
      'Utilizar sequências simples como 123456'
    ],
    c: 2,
    why: 'Senhas longas e exclusivas dificultam ataques e reduzem o impacto de vazamentos entre serviços.'
  },
  {
    q: 'Qual é a função de um certificado digital TLS em um site?',
    a: [
      'Garantir que todas as informações publicadas sejam verdadeiras',
      'Permitir uma conexão criptografada e ajudar a autenticar a identidade do site',
      'Eliminar a necessidade de senhas',
      'Aumentar a resolução das imagens',
      'Impedir todos os tipos de ataques digitais'
    ],
    c: 1,
    why: 'O TLS protege a comunicação entre navegador e servidor. Ele não garante que o conteúdo do site seja verdadeiro ou seguro em todos os aspectos.'
  },
  {
    q: 'Em uma campanha, o público visualiza uma publicação, mas não realiza a ação desejada. Qual elemento pode precisar de revisão?',
    a: [
      'A chamada para ação e a clareza da proposta apresentada',
      'A extensão do nome do arquivo',
      'A quantidade de pastas no computador',
      'O sistema operacional utilizado pelo designer',
      'A resolução da tela do criador'
    ],
    c: 0,
    why: 'Uma chamada para ação clara e uma proposta relevante ajudam o público a compreender o próximo passo.'
  },
  {
    q: 'Qual é a diferença entre dados quantitativos e qualitativos em uma pesquisa com usuários?',
    a: [
      'Quantitativos descrevem opiniões; qualitativos apresentam apenas números',
      'Quantitativos envolvem medidas numéricas; qualitativos exploram características, opiniões e experiências',
      'Ambos representam exclusivamente porcentagens',
      'Qualitativos não podem ser analisados',
      'Quantitativos são utilizados somente em pesquisas impressas'
    ],
    c: 1,
    why: 'Dados quantitativos podem ser medidos numericamente, enquanto dados qualitativos ajudam a compreender percepções e experiências.'
  },
  {
    q: 'Uma equipe utiliza imagens muito pesadas em uma página. Qual consequência pode ocorrer?',
    a: [
      'O carregamento pode ficar mais lento, especialmente em conexões limitadas',
      'A página ficará automaticamente mais acessível',
      'O site deixará de utilizar cores',
      'O conteúdo será convertido em áudio',
      'A segurança será garantida'
    ],
    c: 0,
    why: 'Arquivos grandes podem aumentar o tempo de carregamento e prejudicar a experiência dos visitantes.'
  },
  {
    q: 'Qual alternativa descreve corretamente o conceito de design centrado no usuário?',
    a: [
      'Desenvolver produtos considerando necessidades, limitações e objetivos das pessoas',
      'Criar interfaces somente com base na preferência do desenvolvedor',
      'Priorizar efeitos visuais independentemente da funcionalidade',
      'Evitar pesquisas e testes durante o desenvolvimento',
      'Utilizar o mesmo projeto para qualquer público'
    ],
    c: 0,
    why: 'O design centrado no usuário considera as pessoas durante as decisões de projeto e busca atender às suas necessidades.'
  },
  {
    q: 'Por que a revisão humana é importante em conteúdos produzidos com inteligência artificial?',
    a: [
      'Porque a IA não consegue produzir nenhum tipo de texto',
      'Porque permite verificar precisão, contexto, coerência e possíveis problemas',
      'Porque transforma automaticamente qualquer conteúdo em informação científica',
      'Porque elimina a necessidade de fontes',
      'Porque impede qualquer alteração posterior'
    ],
    c: 1,
    why: 'A revisão humana ajuda a identificar erros, informações inventadas e inadequações no conteúdo gerado.'
  },
  {
    q: 'Qual característica diferencia um arquivo SVG de uma imagem JPEG?',
    a: [
      'SVG é um formato vetorial baseado em elementos gráficos; JPEG é um formato rasterizado',
      'JPEG é utilizado exclusivamente para áudio',
      'SVG não pode representar formas geométricas',
      'JPEG permite ampliar imagens infinitamente sem perda',
      'Os dois formatos são necessariamente idênticos'
    ],
    c: 0,
    why: 'SVG descreve elementos vetoriais, enquanto JPEG armazena imagens rasterizadas comprimidas.'
  },
  {
    q: 'Qual é a importância de estabelecer uma grade (grid) em uma composição gráfica?',
    a: [
      'Criar referências de alinhamento e organizar a distribuição dos elementos',
      'Impedir o uso de imagens',
      'Definir obrigatoriamente uma única cor',
      'Eliminar os espaços entre elementos',
      'Substituir o conteúdo textual'
    ],
    c: 0,
    why: 'A grade fornece uma estrutura que facilita o alinhamento, a consistência e a organização visual.'
  },
  {
    q: 'Uma pessoa compartilha uma fotografia de outra pessoa sem autorização, expondo informações privadas. Qual questão está principalmente envolvida?',
    a: [
      'Compressão de arquivos',
      'Privacidade e proteção de dados pessoais',
      'Resolução de tela',
      'Hierarquia tipográfica',
      'Otimização de mecanismos de busca'
    ],
    c: 1,
    why: 'A exposição indevida de imagens e informações pode violar a privacidade e direitos da pessoa retratada.'
  },
  {
    q: 'Qual é o objetivo principal da otimização para mecanismos de busca (SEO)?',
    a: [
      'Melhorar a possibilidade de um conteúdo ser encontrado nos resultados de busca',
      'Impedir que páginas sejam indexadas',
      'Substituir a criação de conteúdo',
      'Aumentar exclusivamente o tamanho das imagens',
      'Garantir a primeira posição em qualquer pesquisa'
    ],
    c: 0,
    why: 'SEO reúne práticas que ajudam mecanismos de busca a compreender e apresentar páginas relevantes. Não garante uma posição específica.'
  },
  {
    q: 'Qual situação demonstra uma utilização inadequada de métricas digitais?',
    a: [
      'Comparar resultados com objetivos previamente definidos',
      'Analisar diferentes indicadores em conjunto',
      'Considerar apenas curtidas como prova de sucesso, independentemente do objetivo',
      'Avaliar a evolução dos resultados ao longo do tempo',
      'Identificar quais conteúdos geram mais interação'
    ],
    c: 2,
    why: 'Uma métrica isolada pode não representar o sucesso de uma ação. Os indicadores devem ser relacionados aos objetivos.'
  },
  {
    q: 'Qual é a finalidade de utilizar um sistema de controle de versão em um projeto digital?',
    a: [
      'Registrar alterações no código e permitir acompanhar ou recuperar versões anteriores',
      'Eliminar automaticamente todos os erros',
      'Substituir a hospedagem do site',
      'Impedir o trabalho em equipe',
      'Converter imagens em vídeos'
    ],
    c: 0,
    why: 'O controle de versão registra mudanças e facilita a colaboração e a recuperação de versões anteriores.'
  },
  {
    q: 'Por que é importante utilizar linguagem simples em conteúdos educativos digitais?',
    a: [
      'Para eliminar todos os conceitos técnicos',
      'Para facilitar a compreensão sem comprometer a precisão das informações',
      'Para reduzir obrigatoriamente o número de páginas',
      'Para impedir o aprofundamento dos assuntos',
      'Para tornar todos os textos informais'
    ],
    c: 1,
    why: 'A linguagem simples facilita o entendimento e pode tornar o conteúdo mais acessível a diferentes públicos.'
  },
  {
    q: 'Qual é a função de um teste de acessibilidade em uma plataforma digital?',
    a: [
      'Verificar barreiras que possam dificultar o uso por pessoas com diferentes necessidades',
      'Medir exclusivamente a velocidade da internet',
      'Avaliar somente a aparência do logotipo',
      'Determinar o preço de venda do aplicativo',
      'Substituir todos os testes funcionais'
    ],
    c: 0,
    why: 'Testes de acessibilidade ajudam a identificar obstáculos de navegação, leitura e interação.'
  },
  {
    q: 'Uma equipe deseja reduzir o abandono durante o cadastro. Qual abordagem é mais adequada?',
    a: [
      'Solicitar o máximo possível de informações sem explicar o motivo',
      'Simplificar o formulário e solicitar apenas os dados necessários',
      'Adicionar etapas obrigatórias sem necessidade',
      'Esconder as instruções de preenchimento',
      'Retirar mensagens de confirmação'
    ],
    c: 1,
    why: 'Formulários mais simples e objetivos reduzem dificuldades e evitam a coleta desnecessária de informações.'
  },
  {
    q: 'Qual princípio deve orientar a publicação de um conteúdo educativo sobre segurança digital?',
    a: [
      'Apresentar recomendações claras, verificáveis e adequadas ao público',
      'Utilizar informações alarmistas para chamar atenção',
      'Omitir limitações e possíveis riscos',
      'Reproduzir orientações sem verificar sua origem',
      'Garantir proteção absoluta contra qualquer ameaça'
    ],
    c: 0,
    why: 'Conteúdos educativos sobre segurança devem ser claros, responsáveis e baseados em orientações confiáveis.'
  }
];
  
  function feedback(id,msg){$(id).textContent=msg||'';}
  const topics = {
    fundamentos: {
      title: 'Fundamentos das mídias digitais',
      body: `
        <h3>1. O que são mídias digitais?</h3>
        <p>As mídias digitais são meios de comunicação que utilizam tecnologias digitais para criar, transmitir e compartilhar informações. Elas permitem que conteúdos sejam acessados por computadores, celulares e outros dispositivos conectados.</p>

        <h3>2. Onde encontramos as mídias digitais?</h3>
        <p>Elas estão presentes em diversas ferramentas utilizadas no cotidiano, como:</p>
        <ul>
          <li>Redes sociais, como Instagram e TikTok.</li>
          <li>Sites e blogs informativos.</li>
          <li>Plataformas de vídeos e músicas.</li>
          <li>Aplicativos de mensagens.</li>
          <li>Jogos e ambientes virtuais.</li>
        </ul>

        <h3>3. Principais características</h3>
        <p><strong>Interatividade:</strong> permite que os usuários participem, comentem e compartilhem conteúdos.</p>
        <p><strong>Velocidade:</strong> facilita a transmissão de informações em pouco tempo.</p>
        <p><strong>Acessibilidade:</strong> possibilita acessar conteúdos em diferentes dispositivos e lugares com conexão.</p>
        <p><strong>Compartilhamento:</strong> permite que informações sejam distribuídas para muitas pessoas.</p>

        <h3>4. Importância na educação</h3>
        <p>As mídias digitais ajudam no processo de aprendizagem por meio de videoaulas, pesquisas, livros digitais, plataformas educativas e atividades interativas.</p>

        <h3>5. Uso consciente e responsável</h3>
        <p>É importante verificar a confiabilidade das informações, respeitar outras pessoas, proteger dados pessoais e evitar compartilhar notícias sem confirmar sua origem.</p>

        <h3>6. Exemplo prático</h3>
        <p>Quando um estudante assiste a uma videoaula, pesquisa um assunto em um site e compartilha suas descobertas com os colegas, está utilizando diferentes mídias digitais para aprender e se comunicar.</p>

        <h3>Conclusão</h3>
        <p>As mídias digitais transformaram a maneira como aprendemos, trabalhamos e nos comunicamos. Quando utilizadas com responsabilidade, podem ser grandes ferramentas de conhecimento e criatividade.</p>
      `
    },

    comunicacao: {
      title: 'Redes e comunicação',
      body: `
        <h3>1. O que é comunicação digital?</h3>
        <p>É a troca de informações por meio da internet e de tecnologias digitais. Ela permite que pessoas conversem, compartilhem ideias e mantenham contato mesmo estando distantes.</p>

        <h3>2. Principais ferramentas</h3>
        <ul>
          <li>Aplicativos de mensagens.</li>
          <li>Redes sociais.</li>
          <li>Chamadas de vídeo.</li>
          <li>E-mails.</li>
          <li>Fóruns e comunidades virtuais.</li>
        </ul>

        <h3>3. Tipos de comunicação</h3>
        <p><strong>Comunicação síncrona:</strong> acontece em tempo real, como em chamadas de vídeo e conversas ao vivo.</p>
        <p><strong>Comunicação assíncrona:</strong> não exige que as pessoas estejam conectadas ao mesmo tempo, como nos e-mails e mensagens respondidas posteriormente.</p>

        <h3>4. Vantagens da comunicação digital</h3>
        <p>Facilita o contato entre pessoas, permite compartilhar informações rapidamente e ajuda na colaboração em atividades escolares e profissionais.</p>

        <h3>5. Cuidados na internet</h3>
        <p>É importante respeitar as pessoas, evitar mensagens ofensivas, proteger informações pessoais e verificar a veracidade do que compartilhamos.</p>

        <h3>6. Exemplo prático</h3>
        <p>Quando estudantes utilizam um grupo de mensagens para organizar um trabalho escolar, estão usando a comunicação digital para trocar informações e colaborar.</p>

        <h3>Conclusão</h3>
        <p>A comunicação digital aproxima pessoas e facilita o compartilhamento de conhecimentos. Seu uso responsável contribui para um ambiente virtual mais seguro e respeitoso.</p>
      `
    },

    criatividade: {
      title: 'Design e criatividade',
      body: `
        <h3>1. O que é design digital?</h3>
        <p>O design digital é a criação e organização de elementos visuais para sites, aplicativos, redes sociais e outros ambientes digitais. Seu objetivo é transmitir mensagens de forma clara, atrativa e funcional.</p>

        <h3>2. Principais elementos visuais</h3>
        <p><strong>Cores:</strong> ajudam a transmitir sensações, destacar informações e criar identidade visual.</p>
        <p><strong>Tipografia:</strong> é o estilo das letras utilizado para organizar e facilitar a leitura dos textos.</p>
        <p><strong>Formas:</strong> ajudam a organizar informações e construir composições visuais.</p>
        <p><strong>Imagens:</strong> complementam mensagens e tornam os conteúdos mais interessantes.</p>

        <h3>3. Princípios de composição</h3>
        <p><strong>Alinhamento:</strong> organiza os elementos e cria uma aparência mais organizada.</p>
        <p><strong>Contraste:</strong> destaca elementos importantes por meio de diferenças visuais.</p>
        <p><strong>Hierarquia visual:</strong> orienta o olhar e mostra quais informações são mais importantes.</p>
        <p><strong>Equilíbrio:</strong> distribui os elementos de maneira harmoniosa.</p>

        <h3>4. A importância da criatividade</h3>
        <p>A criatividade permite desenvolver ideias originais, solucionar problemas e produzir conteúdos que chamam a atenção do público.</p>

        <h3>5. Ferramentas de criação</h3>
        <ul>
          <li>Canva: criação de artes e apresentações.</li>
          <li>Figma: criação de interfaces e protótipos.</li>
          <li>Adobe Photoshop: edição e manipulação de imagens.</li>
          <li>Adobe Illustrator: criação de ilustrações e elementos vetoriais.</li>
        </ul>

        <h3>6. Exemplo prático</h3>
        <p>Ao criar um cartaz digital para divulgar um evento escolar, o estudante escolhe cores, fontes, imagens e organiza as informações para comunicar a mensagem de maneira eficiente.</p>

        <h3>Conclusão</h3>
        <p>O design digital combina criatividade e organização visual para transmitir mensagens. Quando seus elementos são utilizados corretamente, os conteúdos se tornam mais atraentes, compreensíveis e eficientes.</p>
      `
    }
  };

  function showTopic(topic){
    const content = topics[topic];
    if(!content) return;

    $('content-title').textContent = content.title;
    $('content-body').innerHTML = content.body;
    contentDialog.showModal();
  }

  function openTopic(topic){
    if(!currentUser){
      pendingTopic = topic;
      feedback('auth-feedback','Entre na sua conta para acessar este conteúdo.');
      authDialog.showModal();
      return;
    }

    showTopic(topic);
  }
  function init(){
    if(!window.supabase){console.warn('Biblioteca Supabase não carregou.');return;}
    if(!key || key.includes('COLE_AQUI')){console.warn('Configure a chave publicável em config.js.');return;}
    supabase=window.supabase.createClient(url,key);
    supabase.auth.onAuthStateChange((_event,session)=>{currentUser=session?.user||null;setTimeout(refreshProfile,0);});
    refreshProfile(); loadRanking();
  }
  async function refreshProfile(){
    if(!supabase)return;
    const {data:{user}}=await supabase.auth.getUser(); currentUser=user;
    if(user){
      $('profile-title').textContent=user.user_metadata?.full_name||user.email||'Estudante';
      $('profile-description').textContent='Sua conta está conectada. Seus resultados e pontos ficam associados a este perfil.';
      $('profile-action').textContent='Gerenciar conta'; $('logout-btn').hidden=false;
      const {data}=await supabase.from('profiles').select('display_name,total_points,quiz_count').eq('id',user.id).maybeSingle();
      if(data){$('profile-title').textContent=data.display_name||$('profile-title').textContent;$('profile-points').textContent=data.total_points??0;$('profile-quizzes').textContent=data.quiz_count??0;}
    }else{
      $('profile-title').textContent='Seu perfil';$('profile-description').textContent='Entre ou crie uma conta para salvar seus pontos e acompanhar sua evolução.';$('profile-action').textContent='Entrar / Criar conta';$('profile-points').textContent='0';$('profile-quizzes').textContent='0';$('logout-btn').hidden=true;
    }
    loadRanking();
  }
  async function signUp(){
    if(!supabase)return feedback('auth-feedback','Configure a chave publicável no arquivo config.js primeiro.');
    const name=$('auth-name').value.trim(),email=$('auth-email').value.trim(),password=$('auth-password').value;
    if(!name||!email||password.length<6)return feedback('auth-feedback','Informe seu nome, e-mail e uma senha com pelo menos 6 caracteres.');
    feedback('auth-feedback','Criando sua conta...');
    const {data,error}=await supabase.auth.signUp({
  email,
  password,
  options:{
    data:{full_name:name},
    emailRedirectTo: window.location.origin + window.location.pathname
  }
});
    if(error)return feedback('auth-feedback',error.message);
    if(data.session){feedback('auth-feedback','Conta criada! Você já está conectado.');await refreshProfile();}
    else feedback('auth-feedback','Cadastro iniciado! Verifique seu e-mail para confirmar a conta e depois entre.');
  }
  async function signIn(){
    if(!supabase)return feedback('auth-feedback','Configure a chave publicável no arquivo config.js primeiro.');
    const email=$('auth-email').value.trim(),password=$('auth-password').value;
    if(!email||!password)return feedback('auth-feedback','Informe seu e-mail e sua senha.');
    feedback('auth-feedback','Entrando...');const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error)return feedback('auth-feedback',error.message);
    feedback('auth-feedback','Login realizado!');
await refreshProfile();

setTimeout(()=>{
  authDialog.close();

  if(pendingTopic){
    const topic = pendingTopic;
    pendingTopic = null;
    showTopic(topic);
  }
},700);
  }
  async function signOut(){if(supabase){await supabase.auth.signOut();feedback('auth-feedback','Você saiu da conta.');await refreshProfile();}}
  async function loadRanking(){
    if(!supabase)return;const {data,error}=await supabase.rpc('get_public_leaderboard');
    const panel=document.querySelector('.ranking-panel');if(!panel)return;
    panel.querySelectorAll('.rank-row,.rank-empty').forEach(el=>el.remove());
    if(error||!data?.length){const p=document.createElement('p');p.className='rank-empty';p.textContent='O ranking aparecerá aqui quando os estudantes concluírem quizzes.';panel.appendChild(p);return;}
    data.slice(0,10).forEach((item,i)=>{const row=document.createElement('div');row.className='rank-row';const pos=document.createElement('b');pos.textContent=String(i+1).padStart(2,'0');const name=document.createElement('span');name.textContent=item.display_name||'Estudante';const points=document.createElement('strong');points.textContent=(item.total_points||0)+' pts';row.append(pos,name,points);panel.appendChild(row);});
  }
  function startQuiz(){
  quizIndex=0;
  score=0;
  selected=null;
  answered=false;
  quizCompleted=false;
  quizSaving=false;
  renderQuestion();
  quizDialog.showModal();
  }
  function renderQuestion(){const q=questions[quizIndex];$('quiz-title').textContent=q.q;$('quiz-progress').textContent=`Pergunta ${quizIndex+1} de ${questions.length}`;$('quiz-content').innerHTML='';feedback('quiz-feedback','');$('quiz-next').textContent='Responder';$('quiz-next').disabled=false;selected=null;answered=false;q.a.forEach((answer,i)=>{const b=document.createElement('button');b.type='button';b.className='quiz-option';b.textContent=answer;b.addEventListener('click',()=>{if(answered)return;selected=i;document.querySelectorAll('.quiz-option').forEach(x=>x.classList.remove('chosen'));b.classList.add('chosen');});$('quiz-content').appendChild(b);});}
  
async function nextQuestion(){
  if(quizCompleted){
    if(!quizSaving) closeQuiz();
    return;
  }

  if(!answered){
    if(selected===null){
      return feedback('quiz-feedback','Escolha uma alternativa antes de responder.');
    }

    answered=true;
    const q=questions[quizIndex];
    const correct=selected===q.c;

    if(correct) score++;

    document.querySelectorAll('.quiz-option').forEach((b,i)=>{
      b.disabled=true;
      if(i===q.c) b.classList.add('chosen');
    });

    feedback('quiz-feedback',(correct?'Resposta correta! ':'Não foi dessa vez. ')+q.why);
    $('quiz-next').textContent=quizIndex===questions.length-1?'Finalizar':'Próxima pergunta';
    return;
  }

  if(quizIndex<questions.length-1){
    quizIndex++;
    renderQuestion();
    return;
  }

  quizCompleted=true;
  quizSaving=true;

  const points=score*10;

  $('quiz-title').textContent=`Você acertou ${score} de ${questions.length}!`;
  $('quiz-content').innerHTML=`<p>Você ganhou <strong>${points} pontos</strong> neste quiz.</p>`;
  $('quiz-progress').textContent='Resultado final';
  $('quiz-next').textContent='Concluir';
  $('quiz-next').disabled=true;
  feedback('quiz-feedback','');

  if(currentUser&&supabase){
    const {error}=await supabase.from('quiz_attempts').insert({
      user_id:currentUser.id,
      quiz_code:'fundamentos-midias-digitais',
      score:score,
      points:points,
      total_questions:questions.length
    });

    if(error){
      feedback('quiz-feedback','Resultado calculado, mas não foi possível salvar: '+error.message);
    }else{
      await refreshProfile();
      feedback('quiz-feedback','Pontuação salva no seu perfil!');
    }
  }else{
    feedback('quiz-feedback','Entre na sua conta para salvar esta pontuação no seu perfil e no ranking.');
  }

    quizSaving=false;
  $('quiz-next').disabled=false;
}

function closeQuiz(){
  quizDialog.close();
}

$('open-auth').addEventListener('click',()=>{feedback('auth-feedback','');authDialog.showModal();});
$('profile-action').addEventListener('click',()=>{feedback('auth-feedback','');authDialog.showModal();});
$('signup-btn').addEventListener('click',signUp);
$('login-btn').addEventListener('click',signIn);
$('logout-btn').addEventListener('click',signOut);
$('start-quiz').addEventListener('click',startQuiz);
$('quiz-next').addEventListener('click',nextQuestion);
  document.querySelectorAll('[data-topic]').forEach(button=>{
  button.addEventListener('click',event=>{
    event.preventDefault();
    openTopic(button.dataset.topic);
  });
});

$('content-back').addEventListener('click',()=>{
  contentDialog.close();
  document.getElementById('conteudos').scrollIntoView({
    behavior:'smooth'
  });
});

init();
})();
