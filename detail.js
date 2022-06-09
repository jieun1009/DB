
module.exports = {
    HTML:function(title, list_movie,list_actor,list_director){
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">web</a> -${title}</h1>
        
        ${list_movie}
        ${list_actor}
        ${list_director}
 

      </body>
      </html>
      `;
    },list_movie:function(result){
      var list = '<ul>';
      list = list + "<li>"+result.m_title+" \ "+result.m_subtitle+" \ "+result.m_year+'<br>'; 
      list = list + "상영시간:"+result.playing_time+"분"+" \ "+ "총관객 수:"+result.sum_audi+" \ "+'<br>'; 
      list= list+"</ul>"
      return list;
      
    },list_actor:function(result){
      var list = '<ul>';
      var i = 0;
      while(i < result.length){
        list = list + `<li>배우 :<a href="/?id=${result[i].ano}">${result[i].aname}</a><br>`;
        list = list + "배역:"+result[i].role_name+" \ "+ "("+result[i].role_MS+") \ "+'<br></li>'; 
        i = i + 1;
      }
      list=list+`</ul>`;
      return list;

    },list_director:function(result){
      var list = '<ul>';
      var i = 0;
      while(i < result.length){
        list = list + `<li>감독: <a href="/?id=${result[i].dno}">${result[i].dname}</a><br></li>`;
        i = i + 1;
    }
      list=list+`</ul>`;
      return list;
    }
  }
  