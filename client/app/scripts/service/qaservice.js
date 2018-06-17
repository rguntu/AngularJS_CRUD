'use strict';

angular.module('clientApp').service('qaservice', qaservice);



qaservice.$inject = [ '$http', '$q' ];
function qaservice($http,$q) {
	var service = {};
  service.getAll = getAll;
  service.postQA = postQA;
  service.putQS = putQS;
  service.deleteQS = deleteQS;
  service.deleteQ = deleteQ;
  service.putQ = putQ;
  service.putA = putA;
  function getAll() {
    // return $http.get("http://api.myjson.com/bins/nlfmz");
    return $http.get("http://localhost:4000/questions");
  }

  function postQA(qs) {
    // return $http.get("http://api.myjson.com/bins/nlfmz");
    return $http.post("http://localhost:4000/questions",qs);
  }
  function putQS(qs) {
    return putQ(qs).then(function(data) {
      console.log(data);
      }, function(error) {
        console.log(error);
        return error;
      });
  }
  function deleteQS(qs) {
    return deleteQ(qs).then(function(data) {
      console.log(data);
      }, function(error) {
        console.log(error);
        return error;
      });
  }

  function putQ(qs) {
    return $http.put("http://localhost:4000/questions/"+qs.i,qs);
  }

  function deleteQ(qs) {
    return $http.delete("http://localhost:4000/questions/"+qs);
  }

  function putA(qid,as) {
    // return $http.get("http://api.myjson.com/bins/nlfmz");
    let qsObj = {
      text:as.text
    }
    return $http.put("http://localhost:4000/questions/"+qid+"/answers/"+as._id,as);
  }

  
	return service;
};

/** 
  service.getQ=function(id) {
    // return $http.get("http://api.myjson.com/bins/nlfmz");
    return $http.get("http://localhost:4000/questions/" + id);
  }
   service.postQA=function(qs) {
    // return $http.get("http://api.myjson.com/bins/nlfmz");
    return $http.post("http://localhost:4000/questions",qs);
  }
  service.putQ=function(qs) {
    // return $http.get("http://api.myjson.com/bins/nlfmz");
    return $http.post("http://localhost:4000/questions/"+qId,qs);
  }
  service.postQA=function(qs) {
    // return $http.get("http://api.myjson.com/bins/nlfmz");
    return $http.post("http://localhost:4000/questions/"+qId+"/answers",qs);
  }

  service.updateQA=function(qs) {
    // return $http.get("http://api.myjson.com/bins/nlfmz");
    return $http.post("http://localhost:4000/questions/"+qId+"/answers/"+aId,qs);
  }
**/