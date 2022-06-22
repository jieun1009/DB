var http = require('http');
var url = require('url');
var search = require('./search.js');


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined && queryData.search ===undefined && queryData.aid===undefined
          && queryData.did ===undefined ){ // 메인 페이지 = 영화 목록 띄움
        search.home(request, response);
      } else { 
        if(queryData.search) { // 영화 검색
          search.page(request, response);
          
        } else if(queryData.id){ //영화 상세보기 페이지
          search.detail_page(request,response);
         
        }else if(queryData.aid){ //배우 상세보기 페이지
          search.detail_actor_page(request,response);
          
        }else if(queryData.did){ //감독 상세보기 페이지
          search.detail_director_page(request,response);
        }else{
          response.writeHead(404);
          response.end('Not found');
        }
    }
  }
});
app.listen(1234);
