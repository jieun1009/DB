var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./template.js');
var search = require('./search.js');
var path = require('path');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined && queryData.search ===undefined){ //메인 페이지 = 영화 목록 띄움
        search.home(request, response);
      } else { 
        if(queryData.search) { // 영화 검색
          // console.log(queryData);
          search.page(request, response);
        } else if(queryData.id){ //상세보기 페이지
          search.detail_page(request,response);
        } else{
          response.writeHead(404);
          response.end('Not found');
        }
    }
  }
});
app.listen(3000);