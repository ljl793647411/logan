<script>
export default {
  setCookie (key, value, day) {   // 设置cookie
    if(day !== 0){     //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
      var expires = day * 24 * 60 * 60 * 1000;
      var date = new Date(+new Date()+expires);
      document.cookie = key + "=" + escape(value) + ";expires=" + date.toUTCString();
    } else {
      document.cookie = key + "=" + escape(value);
    }
  },
  delCookie (value) {
    if (value) {
      this.setCookie('loganUsername', value, -100)
    }
  },
  getCookie(value) {
    let name = "loganUsername="
    let ca = document.cookie.split(';')
    for(let i=0; i<ca.length; i++) {
      let c = ca[i].trim()
      if (c.indexOf(name)==0) {
        return unescape(c.substring(name.length,c.length))
      }
    }
    return "";
  }
}
</script>
