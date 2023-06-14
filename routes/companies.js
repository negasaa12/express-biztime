const db = require('../db');
const express = require("express");
const router = express.Router();
const slugify = require('slugify');

router.get('/', async function (req,res,next){
    
    try{
        const results = await db.query('SELECT code, name FROM companies');
        // console.log(results)
        return res.json({ companies : results.rows})
        
    
    } 
    
    catch(err){
        return next(err);
    }
}) 

//GET A SINGLE COMPANY
router.get('/:code', async  (req,res,next)=>{
    
    try{
        const code  = req.params.code;
        const results = await db.query(`SELECT code, name, description FROM companies WHERE code ='${code}'`)

        return res.json(  {company: results.rows})
    }

    catch (err){
       return  next(err)
    }


})

//ADD A COMPANY
router.post('/', async (req, res, next) => {
    try {
      const { code, name, description } = req.body;
      const results = await db.query('INSERT INTO companies(code, name, description) VALUES($1, $2, $3) RETURNING *', [code,slugify(name), description]);
      return res.json({company :results.rows});
    } catch (err) {
      return next(err);
    }
  });
  

  //EDIT EXISTING COMPANY

  router.put('/:code', async (req,res,next)=>{

    try {
        let  code = req.params.code;

        let {name, description} = req.body;

        const result = await db.query('UPDATE companies SET  name=$1, description=$2 WHERE code = $3 RETURNING code, name, description', [name,description,code])

      
            return res.json({"company": result.rows[0]});
          

    } 
    
    catch(err){
        return next(err);
    }


  })



  router.delete("/:code", async function (req, res, next) {
    try {
      let code = req.params.code;
  
      const result = await db.query(
            `DELETE FROM companies
             WHERE code=$1
             RETURNING code`,
          [code]);
  
      if (result.rows.length == 0) {
        throw new ExpressError(`No such company: ${code}`, 404)
      } else {
        return res.json({"status": "deleted"});
      }
    }
  
    catch (err) {
      return next(err);
    }
  });
  









module.exports = router;