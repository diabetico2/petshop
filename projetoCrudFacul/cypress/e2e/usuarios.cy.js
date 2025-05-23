describe('API de Usuários', () => {
  let userId;

  it('deve criar um novo usuário com sucesso', () => {
    const novoUsuario = {
      nome: 'Teste Usuario',
      email: 'teste@email.com',
      senha: 'senha123'
    };

    cy.request('POST', '/usuarios', novoUsuario)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.nome).to.eq(novoUsuario.nome);
        expect(response.body.email).to.eq(novoUsuario.email);
        userId = response.body.id;
      });
  });

  it('deve retornar erro ao criar usuário com dados inválidos', () => {
    const usuarioInvalido = {
      nome: '',
      email: 'email-invalido',
      senha: ''
    };

    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: usuarioInvalido,
      failOnStatusCode: false
    }).then((response) => {
        expect(response.status).to.eq(409);
    });
  });

  it('deve listar todos os usuários', () => {
    cy.request('GET', '/usuarios')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
      });
  });

  it('deve encontrar um usuário específico por ID', () => {
    cy.request('GET', `/usuarios/${userId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', userId);
      });
  });

  it('deve retornar erro ao buscar usuário inexistente', () => {
    cy.request({
      method: 'GET',
      url: '/usuarios/99999',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it('deve atualizar um usuário existente', () => {
    const dadosAtualizacao = {
      nome: 'Nome Atualizado',
      email: 'atualizado@email.com'
    };

    cy.request('PATCH', `/usuarios/${userId}`, dadosAtualizacao)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.nome).to.eq(dadosAtualizacao.nome);
        expect(response.body.email).to.eq(dadosAtualizacao.email);
      });
  });

  it('deve excluir um usuário existente', () => {
    cy.request('DELETE', `/usuarios/${userId}`)
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });
}); 