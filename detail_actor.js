module.exports = {
  HTML: function (title, list_actor, list_actor_movie, list_actor_photo) {
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
          padding:10px;
          border: 1px solid black;
          height: 140px;
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
        ${list_actor}
      </div>
      <img src="${list_actor_photo}" style="float:left; margin-left:30px">
     

     
      
      <div style="clear:both;">
        ${list_actor_movie} 
      </div>

      </body>
      </html>
      `;
  },
  list_actor: function (result) {
    var list = "";
    if (result.aname_eng) {
      list = list + `<strong class="subtitle">${result.aname_eng}</strong>`;
    }

    list = list + `<hr width=450px align=left> <br>`;
    if (result.a_birth != null) {
      list = list + `<strong>출생</strong><span> ${result.a_birth_day}</span>`;
    }
    if (result.a_death != null) {
      list = list + `~${result.a_death_day}`;
    }

    return list;
  },
  list_actor_movie: function (result) {
    var list = "<div><p><strong>필모그래피</strong></p>";
    var i = 0;
    while (i < result.length) {
      list += `<div id="filmo" style='clear:both;'>
          <img src="${result[i].mainimgurl}" class=img_main style="max-width: 100px; height: auto; margin-right:20px; float:left;"></img>
          <a href="/?id=${result[i].mcode}"> ${result[i].title}</a> <br><span style="color:red;">${result[i].role_ms} </span>${result[i].role_name}역<Br>
        </div>`;
      i = i + 1;
    }
    list = list + "</div>";
    return list;
  },
};
