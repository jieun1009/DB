const { CLIENT_MULTI_RESULTS } = require("mysql/lib/protocol/constants/client");
const { list } = require("./template");

module.exports = {
  HTML: function (
    title,
    list_movie,
    list_actor,
    list_director,
    list_photo,
    main_photo,
    list_actor_director,
    list_grade,
    list_review,
    list_rate
  ) {
    return `
      <!doctype html>
      <html>
      <head>
        <title>${title} : 네이버 영화</title>
        <meta charset="utf-8">
        <script>
        var $menuEle = $('dt'); // 탭메뉴를 변수에 지정
        $menuEle.click(function() { // 탭메뉴 클릭 이벤트
          $('dd').addClass('hidden');
          $(this).next().removeClass('hidden');
        })
        </script>
      </head>


      <style>
        div{
          margin-left:10px
        }
        .rate{
          color: #808080;
          font-weight: bold ;
        }
        .rate2{
          font-size: x-large;
        }
        .subtitle{
          color: #c0c0c0; 
          font-size: x-small;
        }
        .img_main{
          margin:10px;
        }
        a{
          text-decoration: none
        }
        .tab_menu{position:relative;}
        .tab_menu .list{overflow:hidden;}
        .tab_menu .list li{float:left; margin-right:14px;  list-style:none; }
        .tab_menu .list .btn{font-size:20px;  list-style:none; color:black; }
        .tab_menu .list .cont{display:none; position:absolute; left:0px; background:#555; color:#fff; text-align:center; width:max-width: 100%; height:auto; }
        .tab_menu .list li.is_on .btn{font-weight:bold; color:white; background: gray;  list-style:none;}
        .tab_menu .list li.is_on .cont{display:block;}
        
      </style>
     
      
      <body style="margin:30px;">
      
      
  
        <!-- 처음 화면으로 넘어감 --!>
        <div style="background:black;width:110px">
          <a href="/" title="naver로 바로가기" class="ci_logo" id="lnb_gonaver"><img src="https://ssl.pstatic.net/static/movie/2013/07/logo_ci.png" width="62" height="13" alt="NAVER" " /></a>
          <a href="/" title="영화서비스홈으로 바로가기" class="svc_logo"><img src="https://ssl.pstatic.net/static/movie/2012/06/logo_svc.png" width="34" height="19" alt="영화"   /></a>
        </div>

        
          <div style="float:left;background:white;margin-bottom:20px;">
          
            <h1>${title}</h1>
            
            ${list_movie}
            ${list_director}
            ${list_actor}
            ${list_rate}
            
          </div>
          <img src="${main_photo}" class=img_main style="max-width: 30%; height: auto; float:left;">

      
        <div class="tab_menu" style="clear:both;">
          <ul class="list">
            <li class="is_on">
              <a href="#tab1" class="btn">포토</a>
              <div id="tab1" class="cont">${list_photo}</div>
            </li>
            <li>
              <a href="#tab2" class="btn">배우/감독</a>
              <div id="tab2" class="cont" style="line-height:70px;">${list_actor_director}</div>
            </li>
            <li>
              <a href="#tab3" class="btn">평점</a>
              <div id="tab3" class="cont">${list_grade}</div>
            </li>
            <li>
              <a href="#tab4" class="btn">리뷰</a>
              <div id="tab4" class="cont">${list_review}</div>
            </li>
          </ul>
        </div>

        <script>
          const tabList = document.querySelectorAll('.tab_menu .list li');
          
          for(var i = 0; i < tabList.length; i++){
            tabList[i].querySelector('.btn').addEventListener('click', function(e){
              e.preventDefault();
              for(var j = 0; j < tabList.length; j++){
                tabList[j].classList.remove('is_on');
              }
              this.parentNode.classList.add('is_on');
            });
          }
        </script>
            

      </body>
      </html>
      `;
  },
  list_movie: function (result, genre, nation, opening_date) {
    var list;
    list = `<strong class="subtitle">${result.subtitle}</strong><hr width=600px align=left> <p>`;

    //평점
    if (result.viewer_rate != null) {
      list =
        list +
        `<span class="rate">관람객</span> <strong class=rate2>${result.viewer_rate}</strong><span style="font-size:small";>(${result.viewer_cnt}명)&nbsp;</span>`;
    }
    if (result.jour_rate != null) {
      list =
        list +
        `<span class="rate">기자/평론가</span> <strong class=rate2>${result.jour_rate}</strong><span style="font-size:small";>(${result.jour_cnt}명)&nbsp;</span>`;
    }
    if (result.ntz_rate != null) {
      list =
        list +
        `<br><span class="rate">네티즌</span> <strong class=rate2>${result.ntz_rate}</strong><span style="font-size:small";>(${result.ntz_cnt}명)&nbsp;</span> <span class="rate">내 평점</span>   <hr width=600px align=left>`;
    }

    //장르
    var list_genre = `<a href="/?movie_select=genre&movie_order=korean&search=${genre[0].genre}">${genre[0].genre}</a>`;
    var i = 1;
    while (i < genre.length) {
      list_genre += ` <a href="/?movie_select=genre&movie_order=korean&search=${genre[i].genre}">${genre[i].genre}</a>`;
      i = i + 1;
    }
    //제작국가
    var list_nation = `<a href=" ?movie_select=nation&movie_order=korean&search=${nation[0].nation}">${nation[0].nation}</a>`;
    var i = 1;
    while (i < nation.length) {
      list_nation += ` <a href=" ?movie_select=nation&movie_order=korean&search=${nation[i].nation}">${nation[i].nation}</a>`;
      i = i + 1;
    }

    // 개봉일
    var list_open_date = `${opening_date[0].open_date} ${opening_date[0].open_reopen}`;
    var i = 1;
    while (i < opening_date.length) {
      list_open_date =
        list_open_date +
        `, ${opening_date[i].open_date} ${opening_date[i].open_reopen}`;
      i = i + 1;
    }

    //개요

    list =
      list +
      `
        <strong>개요</strong><span> ${list_genre} </span>|<span> ${list_nation} </span>|<span> ${result.playing_time}분</span> |
        <span>
            ${list_open_date}
        </span> <br>
        
        `;

    return list;
  },
  list_actor: function (result) {
    var list = " <strong>출연</strong> <span>";
    var i = 0;
    while (i < result.length) {
      list = list + ` <a href="/?aid=${result[i].ano}">${result[i].aname}</a>`;
      if (result[i].role_name != null) {
        list = list + "(" + result[i].role_name + ") ";
      }
      list = list + "|";
      i = i + 1;
      if (i == 3) {
        list = list.slice(0, list.length - 1);
        break; //상단 배우는 세명까지만!!
      }
    }
    list = list + "</span><br>";
    return list;
  },
  list_director: function (result) {
    var list = "<strong>감독 </strong>";
    var i = 0;
    while (i < result.length) {
      list = list + `<a href="/?did=${result[i].dno}">${result[i].dname}</a>`;
      i = i + 1;
    }
    list = list + `<br>`;
    return list;
  },
  list_photo: function (result) {
    var list = "";
    var i = 0;
    while (i < result.length) {
      list =
        list +
        `<img src="${result[i].photo_src}" style="max-width: 20%; height: auto;">     `;
      i = i + 1;
    }
    return list;
  },
  list_actor_director: function (actor, director) {
    var list = "<strong>출연</strong><br>";
    var i = 0;

    while (i < actor.length) {
      list =
        list +
        `<p style="text-align:left; background:white;  color:black;"><img src="${actor[i].a_imgurl}"  style="max-width: 100px; height: auto; float:left;"></img>`;

      list =
        list +
        `<a href="/?aid=${actor[i].ano}"> ${actor[i].aname}</a> <br><span style="color:red;"> ${actor[i].role_ms} </span>`;
      if (actor[i].role_name != null) {
        list += `| ${actor[i].role_name}역`;
      }
      list += `<Br></p>`;
      i = i + 1;
    }
    list = list + "<hr width=1000px align=left><strong>감독</strong><br>";
    var i = 0;

    while (i < director.length) {
      list =
        list +
        `<p style=" text-align:left; background:white;"><img src="${director[i].d_imgurl}"  ></img>`;
      list =
        list +
        `<a href="/?did=${director[i].dno}">${director[i].dname}</a></p>&nbsp;`;
      i = i + 1;
    }
    return list;
  },
  list_grade: function (result) {
    var list = "";
    var i = 0;
    while (i < result.length) {
      list =
        list +
        `<p style="background:white; text-align:left; "> <div style="float:left;"><strong>${result[i].grade}</strong></div>`;
      list =
        list +
        `<div style="float:left;background:white; width:1000px;text-align:left;"><span style="color:black;">${result[i].g_content} </span>
            <br><span style="color:gray;line-height:30px;">${result[i].g_nickname} | ${result[i].date}</span></div></p>&nbsp;`;
      i = i + 1;
    }
    return list;
  },
  list_review: function (result) {
    var list = "";
    var i = 0;
    while (i < result.length) {
      list =
        list +
        `<div style="background:white; text-align:left; color:black;margin-top:10px;margin-right:10px;"> <strong>${result[i].r_title}</strong>&nbsp;<span style="color:gray;font-size:small;text-align:right;">${result[i].date}</span><br><hr width=1000px>`;
      list =
        list +
        `<div style=" width:1000px;text-align:left;"><span style="color:gray;font-size:small;"> ${result[i].r_nickname}&nbsp; 조회 ${result[i].r_view} | 추천 ${result[i].r_goodcnt}</span>
            <br><span style="color:black;line-height:30px;">${result[i].r_content} </span></div></div>&nbsp;`;
      i = i + 1;
    }
    return list;
  },
  list_rate: function (result) {
    var list_rate = `<strong>등급</strong> <span></span> <span style="color: #808080;"> [${result[0].rate_nation}] </span>${result[0].rate}`;
    var i = 1;
    while (i < result.length) {
      list_rate =
        list_rate +
        `<span style="color: #808080;"> [${result[i].rate_nation}] </span>${result[i].rate}<br>`;
      i = i + 1;
    }
    if (result[0].sum_audi != null) {
      list_rate =
        list_rate +
        `<br><strong>흥행</strong> <span> 누적관객 </span><span>${result[0].sum_audi}명</span><br>`;
    }

    return list_rate;
  },
};
