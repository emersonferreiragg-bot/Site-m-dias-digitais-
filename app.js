(() => {
  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_PUBLISHABLE_KEY;
  const $ = (id) => document.getElementById(id);
  const authDialog = $('auth-dialog'), quizDialog = $('quiz-dialog');
  const contentDialog = $('content-dialog');
let pendingTopic = null;
  let supabase = null, currentUser = null, quizIndex = 0, selected = null, score = 0, answered = false;
let quizCompleted = false, quizSaving = false;
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
