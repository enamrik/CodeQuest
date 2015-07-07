var router = require('express').Router();

router.get('/', function(req, res){
    res.json({status: "OK"});
});

module.exports = router;
