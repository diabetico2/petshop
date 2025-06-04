describe ("Teste API", () => {
 const api = 'http://localhost:3000/users';

  it('listar', () => {
    cy.request({
        method: 'GET',
        url: api
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  })
})