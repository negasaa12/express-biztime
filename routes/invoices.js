const db = require('../db');
const express = require("express");
const router = express.Router();

const slugify = require('slugify');


router.get('/', async function (req,res,next){
    
    try{
        const results = await db.query('SELECT * FROM invoices');
        // console.log(results)
        return res.json({ invoices : results.rows})
        
    
    } 
    
    catch(err){
        return next(err);
    }
}) 

router.get('/:id', async (req,res,next)=>{

    try{
        let id = req.params.id;

        const results =  await db.query(`SELECT * FROM invoices WHERE id=${id}`);

        return res.json({incoices: results.rows})



    }
    catch (err){

        return next(err);
    }



})


router.post("/", async function (req, res, next) {
    try {
      let {comp_code, amt} = req.body;
  
      const result = await db.query(
            `INSERT INTO invoices (comp_code, amt) 
             VALUES ($1, $2) 
             RETURNING id, comp_code, amt, paid, add_date, paid_date`,
          [comp_code, amt]);
  
      return res.json({"invoice": result.rows[0]});
    }
  
    catch (err) {
      return next(err);
    }
  });


  router.put("/:code", async function (req, res, next) {
    try {
      let {name, description} = req.body;
      let code = req.params.code;
      let paidDate = null;
      const currResult = await db.query(
            `UPDATE companies
             SET name=$1, description=$2
             WHERE code = $3
             RETURNING code, name, description`,
          [name, description, code]);
  
      if (currResult.rows.length === 0) {
        throw new ExpressError(`No such company: ${code}`, 404)
      } 

      
    const currPaidDate = currResult.rows[0].paid_date;

    if (!currPaidDate && paid) {
      paidDate = new Date();
    } else if (!paid) {
      paidDate = null
    } else {
      paidDate = currPaidDate;
    }

    const result = await db.query(
          `UPDATE invoices
           SET amt=$1, paid=$2, paid_date=$3
           WHERE id=$4
           RETURNING id, comp_code, amt, paid, add_date, paid_date`,
        [amt, paid, paidDate, id]);

    return res.json({"invoice": result.rows[0]});
    }
  
    catch (err) {
      return next(err);
    }
  
  });

  
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