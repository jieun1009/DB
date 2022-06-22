var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'user',
  password : 'password',
  database : 'navermovie',
  multipleStatements: true
});

db.connect();
var template = require('./template.js');
var detail = require('./detail.js');
var detail_actor= require('./detail_actor.js');
var detail_director= require('./detail_director.js');
var url = require('url');
//여기까지 mysql 연결



// index 화면
exports.home = function(request, response){
  db.query(`SELECT * FROM movie`, function(err, result){
      var list = template.list(result);
      var html = template.HTML(list);
      response.end(html);
});
}

// index에서 영화 검색
exports.page = function(request, response){
  
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM movie`, function(err, result){
      if(err) {
        throw err;  // 에러 발생 시 콘솔 출력 및 애플리케이션 중지
      }
      var query;


      /**
       * 검색요소 선택
       * movie_select : 검색 키워드 / movie_order : 정렬요소
       * 키워드 & 정렬에 맞춰 sql 쿼리문 변화
       */
      var search_query; // 검색 쿼리
      if(queryData.movie_select =='title'){ 
        if(queryData.movie_order == 'korean') {search_query = `select * from movie m where m.title like '%${queryData.search}%' order by binary(title)`;}  
        else if(queryData.movie_order == 'year') {search_query =`select * from movie m join opening_date od on m.mcode=od.mcode where m.title like '%${queryData.search}%' order by od.opening_date`;}
        else if(queryData.movie_order == 'rate') {search_query=`select * from movie m where m.title like '%${queryData.search}%' order by m.viewer_rate desc`;}
      } 
      else if(queryData.movie_select =='director') {
        if(queryData.movie_order == 'korean') {search_query = `select * from movie m join movie_director md join director d on m.mcode=md.mcode and d.dno=md.dno  where d.dname like '${queryData.search}%' order by binary(m.title);`;}  
        else if(queryData.movie_order == 'year') {search_query =`select  * from movie m join movie_director md join director d join opening_date od on m.mcode=md.mcode and d.dno=md.dno and od.mcode=m.mcode where d.dname like '${queryData.search}%' order by od.opening_date`;}
        else if(queryData.movie_order == 'rate') {search_query=`select * from movie m join movie_director md join director d on m.mcode=md.mcode and d.dno=md.dno  where d.dname like '${queryData.search}%' order by m.viewer_rate desc;`;}
      }
      else if(queryData.movie_select =='actor') {
        if(queryData.movie_order == 'korean') {search_query = `select * from movie m join movie_actor ma join actor a on m.mcode=ma.mcode and a.ano=ma.ano  where a.aname like '${queryData.search}%' order by binary(m.title)`;}  
        else if(queryData.movie_order == 'year') {search_query =`select  * from movie m join movie_actor ma join actor a join opening_date od on m.mcode=ma.mcode and a.ano=ma.ano and od.mcode=m.mcode where a.aname like '${queryData.search}%' order by od.opening_date`;}
        else if(queryData.movie_order == 'rate') {search_query=` select * from movie m join movie_actor ma join actor a on m.mcode=ma.mcode and a.ano=ma.ano  where a.aname like '${queryData.search}%' order by m.viewer_rate desc`;}
      }
      else if(queryData.movie_select =='genre') {
        if(queryData.movie_order == 'korean') {search_query = `select * from movie m join genre g on m.mcode=g.mcode  where g.genre = '${queryData.search}' order by binary(m.title);  `;}  
        else if(queryData.movie_order == 'year') {search_query =`select  * from movie m join genre g join opening_date od on m.mcode=g.mcode and od.mcode=m.mcode where g.genre = '${queryData.search}' order by od.opening_date;`;}
        else if(queryData.movie_order == 'rate') {search_query=`select * from movie m join genre g on m.mcode=g.mcode  where g.genre = '${queryData.search}' order by m.viewer_rate desc; `;}
      }
      else if(queryData.movie_select =='year') {
        if(queryData.movie_order == 'korean') {search_query = `select * from movie m join opening_date od on m.mcode=od.mcode where year(od.opening_date) = '${queryData.search}' order by binary(title); `;}  
        else if(queryData.movie_order == 'year') {search_query =`select * from movie m join opening_date od on m.mcode=od.mcode where year(od.opening_date) = '${queryData.search}' order by od.opening_date;`;}
        else if(queryData.movie_order == 'rate') {search_query=`select * from movie m join opening_date od on m.mcode=od.mcode where year(od.opening_date) = '${queryData.search}' order by viewer_rate desc;`;}
      }
      else if(queryData.movie_select =='nation') {
        if(queryData.movie_order == 'korean') {search_query = `select * from movie m join nation n on m.mcode=n.mcode where n.nation ='${queryData.search}' order by binary(title);`;}  
        else if(queryData.movie_order == 'year') {search_query =`select * from movie m join nation n join opening_date od on m.mcode=od.mcode and m.mcode=n.mcode where n.nation= '${queryData.search}' order by od.opening_date;`;}
        else if(queryData.movie_order == 'rate') {search_query=`select * from movie m join nation n on m.mcode=n.mcode where n.nation= '${queryData.search}' order by viewer_rate desc`;}
      } 
      
      /*
      * 쿼리 실행 : 검색한 영화 띄워줌
      */
      db.query(search_query, function(err2, result2) {
      if(err2) { //검색 실패 = 첫 화면으로 이동
          let list = template.list(result);
        
          let html = template.HTML(list);
          response.writeHead(404);
          response.end(html);
          
      }
        //검색 성공
        var list = template.list(result2);
        var html = template.HTML( list);
        response.writeHead(200);
        response.end(html); //영화 목록 html로 전송
      })
    });
}


// 영화 상세보기 페이지
exports.detail_page = function(request, response) {

    var _url = request.url;
    var queryData = url.parse(_url, true).query;


    //전체 영화 검색 
    db.query(`SELECT * FROM movie`, function(err, result){ 
        if(err) {
          throw err;  // 에러 발생 시 콘솔 출력 및 애플리케이션 중지
        }

            // 영화 클릭하면 mcode에 맞는 영화 검색 
                var query = `SELECT *  FROM movie m where m.mcode=${queryData.id};`+ //영화 검색

                `select *`+  //배우검색
                      ` from movie_actor ma join actor a join movie m on ma.ano=a.ano and m.mcode=ma.mcode`+
                      ` where m.mcode=${queryData.id};`+

                `select *`+ //감독검색
            ` from movie m join movie_director md join director d on m.mcode=md.mcode and md.dno=d.dno`
            +` where m.mcode=${queryData.id};`+

            //사진 검색
            `SELECT photo_src FROM movie m join photo p on m.mcode=p.mcode where m.mcode=${queryData.id};` +

            // 장르 검색
            `select * from movie m join genre g on m.mcode=g.mcode where m.mcode=${queryData.id};`+

            // 제작국가 검색
            `select * from movie m join nation n on m.mcode=n.mcode where m.mcode=${queryData.id};`+

            // 관람가 검색
            `select * from rate r join movie m on m.mcode=r.mcode where r.mcode=${queryData.id};`+

            //개봉일 검색
            `select *,DATE_FORMAT(opening_date, '%Y. %m. %d.') AS open_date from opening_date od join movie m on m.mcode=od.mcode where m.mcode=${queryData.id};`+

            // 평점 검색
            `select *,DATE_FORMAT(g_date, '%Y. %m. %d.') AS date from grade g join movie m on g.mcode=m.mcode where m.mcode=${queryData.id};`+

            //리뷰 검색
            `select *,DATE_FORMAT(r_date, '%Y. %m. %d.') AS date from review r join movie m on r.mcode=m.mcode where m.mcode=${queryData.id};`
        
          db.query(query, function(err2, result) { 
          
            if(err2) {
              throw err2; 
            }
            
            // 각 쿼리 결과 저장
            let result_movie = result[0];
            let result_actor = result[1];
            let result_director = result[2];
            let result_photo = result[3];
            let result_genre = result[4];
            let result_nation = result[5];
            let result_rate = result[6];
            let result_open = result[7];
            let result_grade = result[8];
            let result_review = result[9];

            /**
             * 쿼리에서 가져온 값 list_~~함수로 넘겨서 형식 맞춰 받아와 html에 추가
             */

            var title = result_movie[0].title;
            var list_movie = detail.list_movie(result_movie[0], result_genre, result_nation,result_open); 
            var list_actor = detail.list_actor(result_actor);
            var list_director = detail.list_director(result_director);
            var list_photo = detail.list_photo(result_photo);
            var list_actor_director=detail.list_actor_director(result_actor,result_director);
            var main_photo = result_movie[0].mainimgurl;
            var list_grade = detail.list_grade(result_grade);
            var list_review = detail.list_review(result_review);
            var list_rate = detail.list_rate(result_rate);
            
            

            var html = detail.HTML(title, list_movie, list_actor,list_director,list_photo,main_photo,list_actor_director,list_grade,list_review,list_rate); //html로 매개변수 넘김
            response.writeHead(200);
            response.end(html); //detail.js 띄우기
          })
        });
   
}



//배우 상세보기 페이지
exports.detail_actor_page = function(request, response) {

  var _url = request.url;
  var queryData = url.parse(_url, true).query;

    // 클릭한 배우 ano에 맞는 배우 검색 
  db.query(`SELECT *,DATE_FORMAT(a_birth, '%Y년 %m월 %d일') AS a_birth_day, DATE_FORMAT(a_death, '%Y년 %m월 %d일') AS a_death_day from actor where ano=${queryData.aid}`, function(err, result){ 
      if(err) {
        throw err;  // 에러 발생 시 콘솔 출력 및 애플리케이션 중지
      }

      //배우가 찍은 영화목록 띄움
      db.query(`SELECT * from actor a join movie m join movie_actor ma on a.ano=ma.ano `+
      `and ma.mcode=m.mcode where a.ano=${queryData.aid}`, function(err2, result_movie){
        if(err2) {
          throw err2;  // 에러 발생 시 콘솔 출력 및 애플리케이션 중지
        }

        var title = result[0].aname;
        var list_actor = detail_actor.list_actor(result[0]); //클릭한 배우는 어차피 한명이니까 0번째 넘김
        var list_actor_movie = detail_actor.list_actor_movie(result_movie); //찍은 영화 목록 함수로 넘김
        var list_actor_photo = result[0].a_imgurl
        var html = detail_actor.HTML(title, list_actor,list_actor_movie,list_actor_photo,); //html로 위 변수를 넘김
        response.writeHead(200);
        response.end(html); //detail_actor.js 띄우기
      });
   
    });
 
    
}


//감독 상세보기 페이지
exports.detail_director_page = function(request, response) {

  var _url = request.url;
  var queryData = url.parse(_url, true).query;

  db.query(`select * from director where dno=${queryData.did}`, function(err, result){
    if(err) {
      throw err;  // 에러 발생 시 콘솔 출력 및 애플리케이션 중지
    }
      // 클릭한 배우 dno에 맞는 감독 검색 
    db.query(`SELECT * FROM director d join movie m join movie_director md on d.dno=md.dno `+
      `and md.mcode=m.mcode where d.dno=${queryData.did}`, function(err2, result_movie){ 
    if(err2) {
      throw err2;  // 에러 발생 시 콘솔 출력 및 애플리케이션 중지
    }
    var title = result[0].dname;
    var list_director = detail_director.list_director(result[0]); //감독은 한명이니까 0번째
    var list_director_movie = detail_director.list_director_movie(result_movie); //찍은 영화 목록 함수로 넘김
    var list_director_photo = result[0].d_imgurl; //감독사진


    var html = detail_director.HTML(title, list_director,list_director_movie,list_director_photo); //html로 매개변수 넘김
    response.writeHead(200);
    response.end(html); //detail_director.js 띄우기
    });

  })
  
    
}




