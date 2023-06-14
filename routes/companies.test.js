process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');





afterEach( async() =>{

    await db.query('DELETE FROM companies');

})
afterAll(async ()=>{
        await db.end()
})


describe('/GET /companies', ()=>{
    let testCompany;
    beforeEach( async()=>{

        const results =  await db.query(`
        INSERT INTO companies
        VALUES ('apple', 'Apple Computer', 'Maker of OSX.') 
        RETURNING code, name`)
    
        testCompany = results.rows[0]
    })



    test('get a list of all companies',  async()=>{
        
        const res = await request(app).get('/companies')
        expect(res.body).toEqual({
           companies : [testCompany]
        })
    })
})



describe('/GET /companies/:code', () => {
    let testCompany;
    beforeEach( async()=>{

        const results =  await db.query(`
        INSERT INTO companies
        VALUES ('apple', 'Apple Computer', 'Maker of OSX.') 
        RETURNING code, name, description`)
    
        testCompany = results.rows[0]
    })


  test('get a single company', async () => {
    const res = await request(app).get('/companies/apple');
    expect(res.body).toEqual({ company: [testCompany] });
  });
});


describe("POST /companies", ()=>{

    

    test('create a single company', async()=>{

        const res = await request(app).post('/companies').send({code: 'Tech', name: "Computers", description: 'amazing things'})
        expect(res.body).toEqual(
            {company: [{code: 'Tech', name: "Computers", description: 'amazing things'}] }
        )
    })

})




describe("DELETE /companies/:id", ()=>{

    let testCompany;
    beforeEach( async()=>{

        const results =  await db.query(`
        INSERT INTO companies
        VALUES ('apple', 'Apple Computer', 'Maker of OSX.') 
        RETURNING code, name, description`)
    
        testCompany = results.rows[0]
    })


    test('delete a single company', async()=>{

        const res = await request(app).delete(`/companies/apple`)
        expect(res.body).toEqual(
            {status: "deleted"}
        )
    })

})



describe("PATCH /companies/:id", ()=>{

    let testCompany;
    beforeEach( async()=>{

        const results =  await db.query(`
        INSERT INTO companies
        VALUES ('apple', 'Apple Computer', 'Maker of OSX.') 
        RETURNING code, name, description`)
    
        testCompany = results.rows[0]
    })


    test('update a single company', async()=>{

        const res = await request(app).put(`/companies/apple`).send({code: 'Tech', name: "Computers", description: 'amazing things'})
        
        expect(res.body).toEqual(
            {company: { code: testCompany.code, name: "Computers", description: 'amazing things'} }
        )
    })

})
