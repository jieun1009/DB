var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'qkrWl2544',
  database : 'final_movie',
  multipleStatements: true
});

db.connect();
var template = require('./template.js');
var detail = require('./detail.js');
var url = require('url')
//여기까지 mysql 연결



// mysql을 읽어와서 목록 보여주기
exports.home = function(request, response){
  db.query(`SELECT * FROM movie`, function(err, result){
      var list = template.list(result);
      var html = template.HTML(list);
      response.end(html);
});
}

//검색 후 목록 보여주기
exports.page = function(request, response){
  
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM movie`, function(err, result){
      if(err) {
        throw err;  // 에러 발생 시 콘솔 출력 및 애플리케이션 중지
      }
      console.log(queryData.movie_select);
      
      if(queryData.movie_select =='title') var select = "m_title"; //검색 요소 선택
      else if(queryData.movie_select =='directory') var select = "dname";
      else if(queryData.movie_select =='actor') var select = "aname";
      else if(queryData.movie_select =='genre') var select = "scope_name";
      else if(queryData.movie_select =='year') var select = "m_year";
      else if(queryData.movie_select =='nation') var select = "nation_name";

      if(queryData.movie_order == 'korean') var order = `binary(${select})`; //정렬 요소 선택
      else if(queryData.movie_order == 'year') var order = "year(opening_date)";
      else if(queryData.movie_order == 'rate') var order = "audi_rate";

      db.query(`SELECT * FROM movie m `+ // 검색에 맞는 영화만 출력(일단 제목만)
       ` where ${select} like "%${queryData.search}%" order by ${order}`, function(err2, result2) {
        
      if(err2) {
          throw err2; 
        }
        var list = template.list(result2);
        var html = template.HTML( list);
        response.writeHead(200);
        response.end(html); //영화 목록 html로 전송
      })
    });
}

// mysql을 읽어와서 상세보기 보여주기 + join을 이용해서 배우까지 출력
exports.detail_page = function(request, response) {

    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    var title=null;
    var list_movie=null;
    var list_actor=null;
    var list_director=null;

    //전체 영화 검색 
    db.query(`SELECT * FROM movie`, function(err, result){ 
        if(err) {
          throw err;  // 에러 발생 시 콘솔 출력 및 애플리케이션 중지
        }

            // 영화 클릭하면 mcode에 맞는 영화 검색 
                var query = `SELECT * FROM movie m where m.mno=${queryData.id};`+ //영화 검색

                `select ma.role_MS, ma.role_name, a.aname`+  //배우검색
                      ` from movie_actor ma join actor a join movie m on ma.ano=a.ano and m.mno=ma.mno`+
                      ` where m.mno=${queryData.id};`+

                `select dname`+ //감독검색
            ` from movie m join movie_director md join director d on m.mno=md.mno and md.dno=d.dno`
            +` where m.mno=${queryData.id};`

        db.query(query, function(err, result) { 
          
            if(err) {
              console.log( err); 
            }

            let result_movie = result[0];
            let result_actor = result[1];
            let result_director = result[2];

            /**
             * 쿼리에서 가져온 값 list_~~함수로 넘겨서 형식 맞춰 받아와 html에 추가
             */

            var title = result_movie[0].m_title;
            var list_movie = detail.list_movie(result_movie[0]); 
            var list_actor = detail.list_actor(result_actor);
            var list_director = detail.list_director(result_director)
        

            var html = detail.HTML(title, list_movie, list_actor,list_director); //html로 매개변수 넘김
            response.writeHead(200);
            response.end(html); //detail.js 띄우기
          })
        });

        

      
}




