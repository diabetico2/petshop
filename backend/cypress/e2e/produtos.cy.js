describe('API de Produtos', () => {
    let produtoId;
    let petId;
    let usuarioId;
  
    before(() => {
      const timestamp = Date.now();
      const novoUsuario = {
        nome: `Cliente Teste ${timestamp}`,
        email: `cliente+${timestamp}@email.com`,
        senha: 'senha123'
      };
    
      cy.request('POST', '/usuarios', novoUsuario)
        .then((response) => {
          usuarioId = response.body.id;
          const novoPet = {
            nome: 'Pet Teste',
            raca: 'Vira Lata',
            usuarioId: usuarioId
          };
          return cy.request('POST', '/pets', novoPet);
        })
        .then((response) => {
          petId = response.body.id;
        });
    });
  
    it('deve criar um novo produto com sucesso', () => {
      const novoProduto = {
        nome: 'Ração Premium',
        tipo: 'Alimento',
        preco: 99.90,
        petId: petId
      };
  
      cy.request('POST', '/produtos', novoProduto)
        .then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('id');
          expect(response.body.nome).to.eq(novoProduto.nome);
          expect(response.body.tipo).to.eq(novoProduto.tipo);
          expect(response.body.preco).to.eq(novoProduto.preco);
          produtoId = response.body.id;
        });
    });
  
    it('deve retornar erro ao criar produto com dados inválidos', () => {
      const produtoInvalido = {
        nome: '',
        tipo: '',
        preco: -10
      };
  
      cy.request({
        method: 'POST',
        url: '/produtos',
        body: produtoInvalido,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  
    it('deve listar todos os produtos', () => {
      cy.request('GET', '/produtos')
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
          expect(response.body.length).to.be.greaterThan(0);
        });
    });
  
    it('deve encontrar um produto específico por ID', () => {
      cy.request('GET', `/produtos/${produtoId}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('id', produtoId);
        });
    });
  
    it('deve retornar erro ao buscar produto inexistente', () => {
      cy.request({
        method: 'GET',
        url: '/produtos/99999',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  
    it('deve atualizar um produto existente', () => {
      const dadosAtualizacao = {
        nome: 'Ração Premium Plus',
        preco: 129.90
      };
  
      cy.request('PATCH', `/produtos/${produtoId}`, dadosAtualizacao)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.nome).to.eq(dadosAtualizacao.nome);
          expect(response.body.preco).to.eq(dadosAtualizacao.preco);
        });
    });
  
    it('deve excluir um produto existente', () => {
      cy.request('DELETE', `/produtos/${produtoId}`)
        .then((response) => {
          expect(response.status).to.eq(200);
        });
    });
  
    after(() => {
      if (petId) {
        cy.request('DELETE', `/pets/${petId}`)
          .then(() => {
            if (usuarioId) {
              cy.request('DELETE', `/usuarios/${usuarioId}`);
            }
          });
      } else if (usuarioId) {
        cy.request('DELETE', `/usuarios/${usuarioId}`);
      }
    });
  });