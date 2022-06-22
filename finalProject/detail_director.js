module.exports = {
  HTML: function (
    title,
    list_director,
    list_director_movie,
    list_director_photo
  ) {
    return `
      <!doctype html>
      <html>
      <head>
        <title>${title} : 네이버 영화</title>
        <meta charset="utf-8">
      </head>
      <style>
        .subtitle{
          color: #c0c0c0; 
          font-size: x-small;
        }

        #filmo{
          margin: 20px 0px;
          padding: 10px;
          border: 1px solid black;
          height: 160px;
        }

        .body{
          margin: 30px;
        }
      </style>
      <body>
      <!-- 처음 화면으로 넘어감 --!>
      <div style="background:black;width:110px">
        <a href="/" title="naver로 바로가기" class="ci_logo" id="lnb_gonaver"><img src="https://ssl.pstatic.net/static/movie/2013/07/logo_ci.png" width="62" height="13" alt="NAVER" " /></a>
        <a href="/" title="영화서비스홈으로 바로가기" class="svc_logo"><img src="https://ssl.pstatic.net/static/movie/2012/06/logo_svc.png" width="34" height="19" alt="영화"   /></a>
      </div>

      <h1>${title}</h1>

      <div style="float:left;">
      ${list_director}
      <hr width=450px align=left>
      </div>
      <img src="${list_director_photo}" style="float:left; margin-left:30px">
        

      <div style="clear:both;">
        ${list_director_movie} 
      </div>

      </body>
      </html>
      `;
  },
  list_director: function (result) {
    //감독 형식
    var list = "";
    if (result.dname_eng) {
      list = list + `<strong class="subtitle">${result.dname_eng}</strong>`;
    }

    list = list + "</ul>";
    return list;
  },
  list_director_movie: function (result) {
    //감독이 제작한 영화 목록 형식
    var list = `<p><strong>필모그래피</strong> 총 <strong>${result.length}</strong>건</p>`;
    var i = 0;
    while (i < result.length) {
      list += `<div id="filmo" style='clear:both;'><p><img src="${result[i].mainimgurl}" class=img_main style="max-width: 100px; height: auto; margin-right:20px; float:left;"></img>
              <a href="/?id=${result[i].mcode}"> ${result[i].title}</a></div>`;
      i = i + 1;
    }
    list = list + "</p>";
    return list;
  },
};
