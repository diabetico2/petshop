describe('API de Pets', () => {
  let petId;
  let usuarioId;

  before(() => {
    const novoUsuario = {
      nome: 'Dono do Pet',
      email: 'dono@email.com',
      senha: 'senha123',
    };

    cy.request('POST', '/usuarios', novoUsuario).then((response) => {
      usuarioId = response.body.id;
    });
  });

  it('deve criar um novo pet com sucesso', () => {
    const novoPet = {
      nome: 'Rex',
      raca: 'Labrador',
      usuarioId: usuarioId,
    };

    cy.request('POST', '/pets', novoPet).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      expect(response.body.nome).to.eq(novoPet.nome);
      expect(response.body.raca).to.eq(novoPet.raca);
      petId = response.body.id;
    });
  });

  it('deve retornar erro ao criar pet com dados inválidos', () => {
    const petInvalido = {
      nome: '123',
      raca: '',
      usuarioId: usuarioId,
    };

    cy.request({
      method: 'POST',
      url: '/pets',
      body: petInvalido,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('deve listar todos os pets', () => {
    cy.request('GET', '/pets').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
    });
  });

  it('deve encontrar um pet específico por ID', () => {
    cy.request('GET', `/pets/${petId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', petId);
    });
  });

  it('deve retornar erro ao buscar pet inexistente', () => {
    cy.request({
      method: 'GET',
      url: '/pets/99999',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it('deve atualizar um pet existente', () => {
    const dadosAtualizacao = {
      nome: 'Rex Atualizado',
      raca: 'Labrador Retriever',
    };

    cy.request('PATCH', `/pets/${petId}`, dadosAtualizacao).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.nome).to.eq(dadosAtualizacao.nome);
      expect(response.body.raca).to.eq(dadosAtualizacao.raca);
    });
  });

  it('deve excluir um pet existente', () => {
    cy.request('DELETE', `/pets/${petId}`).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  after(() => {
    cy.request('DELETE', `/usuarios/${usuarioId}`);
  });
});
