exports.countUserOrg=function(reposMonth,type){
	var result = new Array();
	var reposUserType = new Array();
	var reposOrgType = new Array();
	var reposUserTotal = 0;
	var reposOrgTotal = 0;

	reposMonth.forEach(function(month){
		var userRepos = new Array();
		var orgRepos = new Array();
		var userMonth = {};
		var orgMonth = {};

		month.repos.forEach(function(repo){
			if(repo.owner.type=="User"){
				userRepos.push(repo);
			}
			else if(repo.owner.type=="Organization"){
				orgRepos.push(repo);
			}
		})

		delete month["repos"];

		userMonth["month"] = month.month;
		userMonth["type"] = type+"User";
		userMonth["repos_count"] = userRepos.length;

		orgMonth["month"] = month.month;
		orgMonth["type"] = type+"Organization";
		orgMonth["repos_count"] = orgRepos.length;

		reposUserTotal += userRepos.length;
		reposOrgTotal +=  orgRepos.length;

		reposUserType.push(userMonth);
		reposOrgType.push(orgMonth);
	})

	total = [{"label":"个人用户","value":reposUserTotal},{"label":"组织","value":reposOrgTotal}];
	var temp = reposMonth.concat(reposUserType.concat(reposOrgType));
	result = [temp,total]; 
	return result;
}



exports.countChinaWorld = function(repos,type){
	var months = [1,2,3,4,5,6,7,8,9,10,11,12];
	var reposMonths = new Array();
	months.forEach(function(month){
		var Month = {};
		var reposMonth = new Array();
		repos.forEach(function(repo){
			if(repo.month==month){
				reposMonth.push(repo);
			}
		})
		Month["month"] = month;
		Month["repos"] = reposMonth;
		Month["type"] = type;
		Month["repos_count"] = reposMonth.length;
		reposMonths.push(Month);
	})
	return reposMonths;
}