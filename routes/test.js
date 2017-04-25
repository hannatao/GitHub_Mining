var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('test', { title: 'GitHub_Mining' });
});

router.get('/2',function(req, res){
	res.render('test2', { title: 'GitHub_Mining' });
})

router.get('/3',function(req, res){
	res.render('test3', { title: 'GitHub_Mining' });
})
module.exports = router;