---
title: 1.디스코드 봇 프로젝트 - 준비 단계

categories:
  - JDA
  - java
toc: true;
---

요즘 디스코드 봇 만드는것이 재미있어보여 나도 만들어보기로 했다.<br/>

## 준비단계 - 디스코드 봇 생성

봇을 만들기 위해 준비 작업을 해야 한다.<br/>
<https://discord.com/developers/applications><br/>
위의 사이트는 디스코드 봇을 만드는 개발자 사이트이다.<br/>
<br/>
![디스코드 개발자 사이트](/image/discordbot01-01.PNG "디스코드 개발자 사이트")<br/>
<br/>
로그인이 안 되어 있으면, 로그인 후 New Application을 누르고 이름을 정한 뒤 생성하면 된다.<br/>
나는 예제로 "실험"이란 이름을 가진 봇을 만들어 보았다.<br/>
<br/>
![디스코드 개발자 사이트](/image/discordbot01-02.PNG "디스코드 개발자 사이트")<br/> 
<br/>
이렇게 만들었으면 위 사진처럼 보일텐데 Cilent Id를 잘 복사 해 두고 왼쪽 사이드바에 있는 Bot을 누른다.
<br/>
![디스코드 개발자 사이트](/image/discordbot01-03.PNG "디스코드 개발자 사이트")<br/>
<br/><br/>
이 페이지로 왔으면 Add Bot을 눌러 봇을 만든다<br/>
<br/>
![디스코드 개발자 사이트](/image/discordbot01-04.PNG "디스코드 개발자 사이트")<br/>
<br/>
아까 Cilent Id와 마찬가지로 저 Click to Reveal Token을 누르면 나오는 토큰을 복사 해두자.<br/>
이 토큰은 아무한테도 공개해서는 안된다.<br/>

## 준비단계 - 디스코드 봇 초대하기

이제 기본적인 준비는 되었으니 봇을 디스코드 서버로 불러내 보자

<https://discord.com/oauth2/authorize?client_id=여기에 클라이언트 아이디&scope=bot><br/>
간혹 클라이언트 아이디와 토큰값을 헷갈리는 사람이 있는데 헷갈리지 않고 저곳에 클라이언트 아이디를 넣으면 <br/>
<br/>
![디스코드 개발자 사이트](/image/discordbot01-05.PNG "디스코드 개발자 사이트")<br/>
<br/>
이런 창이 하나 뜨는데 추가하고 싶은 서버를 찾아 누르고 승인을 누르면 봇이 아닌지 체크하는게 나오는데 체크 하는 그 즉시 서버에 디스코드 봇이 추가된다.<br/>
