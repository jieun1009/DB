module.exports = {
  HTML: function (list) {
    return `
      <!doctype html>
      <html>
      <head>
        <title>네이버 영화</title>
        <meta charset="utf-8">
        
 
      </head>
      <style>
        ul{
           list-style:none; text-decoration:none;
          }
      </style>
  
      <body>
      <!-- 처음 화면으로 넘어감 --!>
      <div style="background:black;width:110px">
        <a href="/" title="naver로 바로가기" class="ci_logo" id="lnb_gonaver"><img src="https://ssl.pstatic.net/static/movie/2013/07/logo_ci.png" width="62" height="13" alt="NAVER" " /></a>
        <a href="/" title="영화서비스홈으로 바로가기" class="svc_logo"><img src="https://ssl.pstatic.net/static/movie/2012/06/logo_svc.png" width="34" height="19" alt="영화"   /></a>
      </div>

        <br>

        <form action="/">
        
         <select name='movie_select'>
            <option value='title' selected>영화제목</option>
            <option value='director'>감독</option>
            <option value='actor'>배우</option>
            <option value='genre'>장르</option>
            <option value='year'>개봉년도</option>
            <option value='nation'>국가</option>
        </select>
        <select name='movie_order'>
            <option value='korean' selected>가나다순</option>
            <option value='year'>년도순</option>
            <option value='rate'>평점순</option>
        </select>
        <input type="text" name="search"> 
        <input type="submit" value="검색">
    
    </form>
        
        ${list} 
      </body>
      </html>
      `;
  },
  list: function (result) {
    var list = '<ul style="list-style:none;">';
    var i = 0;
    while (i < result.length) {
      list =
        list +
        `<li><a href="/?id=${result[i].mcode}"   style="text-decoration:none;"> ${result[i].title}</a></li><br>`;
      i = i + 1;
    }
    list = list + "</ul>";
    return list;
  },
};
