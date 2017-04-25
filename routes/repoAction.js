var express = require('express');
var router = express.Router();

var repo_china = require('../github_data/service/repoService.js');
var repo_frame = require('../github_data/service/repoFrameService.js');
var pop_language_china = require('../github_data/service/repoLanguageChinaService.js');
var pop_language_world = require('../github_data/service/repoLanguageWorldService.js');
var repo_org = require('../github_data/service/repoOrgService.js');
var repo_contri = require('../github_data/service/repoContributorsService.js');
var repo_location_month = require('../github_data/service/repoMonthWorldChinaService.js');
var repo_word = require('../github_data/service/repoDescriWordService.js');
var repos_words = require('../github_data/service/getRepoWordService.js');
var repos_class = require('../github_data/service/repoLevelService.js');
var async = require('async');

router.get('/repoChina_show', function(req, res, next) {
    async.waterfall([
        function(callback){
            var type = req.query.type;
            var top = req.query.top;
            callback(null,type,top);
        },
        repo_china.GetRepo,
        ],function(err,result){
            res.send(result);
     });
});


router.get('/orgChina_show', function(req, res, next) {
    async.waterfall([
        function(callback){
            var type = req.query.type;
            var top = req.query.top;
            callback(null,type,top);
        },
        repo_org.GetOrg,
        ],function(err,result){
            res.send(result);
     });
});

router.get('/frameChina_show', function(req, res, next) {
    async.waterfall([
        function(callback){
            var type = req.query.type;
            callback(null,type);
        },
        repo_frame.GetFrame,
        ],function(err,result){
            res.send(result);
     });
});

router.get('/contributors_show', function(req, res, next) {
    async.waterfall([
        function(callback){
            var type = req.query.type;
            var top = req.query.top;
            callback(null,type,top);
        },
        repo_contri.getContri,
        ],function(err,result){
            res.send(result);
     });
}); 

router.get('/repoWord_show', function(req, res, next) {
    async.waterfall([
        repo_word.getRepoWord
        ],function(err,result){
            res.send(result);
     });
}); 

router.get('/repoLocMonth_show', function(req, res, next) {
    async.waterfall([
        repo_location_month.GetRepoMonth
        ],function(err,result){
            res.send(result);
     });
}); 

router.get('/language_show', function(req, res, next) {
    async.series([
            pop_language_china.GetRepoLanguage,
            pop_language_world.GetRepoLanguage 
        ],function(err,result){
            res.send(result);
        });
}); 

router.get('/languageChina_show', function(req, res, next) {
    async.waterfall([
            pop_language_china.GetUserOrgLanguage
        ],function(err,result){
            res.send(result);
     });
}); 

router.get('/languageWorld_show', function(req, res, next) {
    async.waterfall([
        pop_language_world.GetUserOrgLanguage
        ],function(err,result){
            res.send(result);
    });
}); 

router.get('/reposWords_show', function(req, res, next) {
    async.waterfall([
        function(callback){
            var Repos = req.query.v;
            var words = repos_words.getRepoWord(Repos);
            callback(null,words);
        }
        ],function(err,result){
            res.send(result);
     });
}); 

router.get('/repoClass_show', function(req, res, next) {
    async.waterfall([
        function(callback){
            var type = req.query.type;
            callback(null,type);
        },
        repos_class.GetRepoClass
        ],function(err,result){
            res.send(result);
     });
});

module.exports = router;