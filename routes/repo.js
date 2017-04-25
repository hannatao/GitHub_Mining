var express = require('express');
var router = express.Router();

router.get('/popular_repo', function(req, res, next) {
  res.render('popularRepo', { title: '热门项目' });
});

router.get('/popular_language', function(req, res, next) {
  res.render('popularLanguage', { title: '流行语言' });
});

router.get('/popular_frame', function(req, res, next) {
  res.render('popularFrame', { title: '流行框架' });
});

router.get('/popular_org', function(req, res, next) {
  res.render('popularOrg', { title: '热门组织' });
});

router.get('/repo_month', function(req, res, next) {
  res.render('repoMonth', { title: '热门项目变化图' });
});

router.get('/repo_Contributor', function(req, res, next) {
  res.render('repoContributor', { title: '热门开源贡献者' });
});

router.get('/repo_Word', function(req, res, next) {
  res.render('repoWord', { title: '高频词汇' });
});

module.exports = router;
