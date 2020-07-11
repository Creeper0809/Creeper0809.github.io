---
title: 2.디스코드 봇 제작기 - 이클립스와 봇 연동
categories:

  - JDA
  - java
  
toc: true;
---

오늘은 자바와 저번에 만든 디스코드 봇을 연동하는법을 알려드리겠습니다.

## 메이븐으로 JDA 다운

<https://github.com/DV8FromTheWorld/JDA><br/>
위 링크에서 JDA의 버전 정보를 가져온다음에<br/>
<br/>
![pom.xml](/image/discordbot02-01.PNG "pom.xml")<br/>
<br/>
위 사진처럼 pom.xml 파일에 dependency와 repositories를 추가 해줍니다.<br/>
안보일수도 있으므로 밑에 코드를 적어놓겠습니다.<br/>

```
pom.xml

<repositories>
	<repository>
		<id>jcenter</id>
		<name>jcenter-bintray</name>
		<url>https://jcenter.bintray.com</url>
	</repository>
</repositories>

<dependency>
	<groupId>net.dv8tion</groupId>
	<artifactId>JDA</artifactId>
	<version>가져온 JDA버전</version>
</dependency>
```


이렇게 한뒤 저장을 하면 자동으로 JDA가 설치가 됩니다<br/>

## main 클래스

src - main - java 경로에 임의에 패키지와 클래스를 만들어줍니다.

``` java
import javax.security.auth.login.LoginException;

import net.dv8tion.jda.api.AccountType;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.OnlineStatus;

public class Main {
	public static JDA jda;

	public static void main(String[] args) {
		JDABuilder jb = new JDABuilder(AccountType.BOT);

		jb.setAutoReconnect(true);
		jb.setStatus(OnlineStatus.ONLINE);
		jb.setToken("복사해둔 토큰");
		try {
			jda = jb.build();
		} catch (LoginException e) {
			e.printStackTrace();
		}
	}
}
```

계정타입이 봇인 JDABuilder의 인스턴스를 생성해주면 이 JDABuilder를 통해 온라인 표시라던지 토큰으로 연동을 하던지등 여러가지 설정이 가능합니다.<br/>
저렇게 설정을 마친 JDABuilder는 .build() 메서드를 통해 JDA 인스턴스를 만들며 봇과 연동이 가능해집니다.<br/>

```
[main] INFO JDA - Login Successful!
[JDA MainWS-ReadThread] INFO WebSocketClient - Connected to WebSocket
[JDA MainWS-ReadThread] INFO JDA - Finished Loading!
```

위와 같은 메세지가 뜬다면 잘 연동시킨겁니다.<br/>
<br/>
![디스코드 연동](/image/discordbot02-02.PNG "디스코드 연동")<br/>
<br/>
디스코드를 확인해보니 저는 잘 연동이 된것같습니다.<br/>
이 봇은 계속 영구적으로 켜져있는게 아니라 이클립스에서 코딩한 프로그램을 계속 켜고 있어야 합니다.<br/>
## 다음시간 할것
다음 시간에는 메세지에 반응 하는방법을 설명하겠습니다.
