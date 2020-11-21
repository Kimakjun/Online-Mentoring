
## Node js Online Mentoring 프로젝트 

![](https://i.imgur.com/HeGHLso.jpg)
- 온라인 실시간 채팅을 통해 사용자간의 지식공유를 목적으로 만든 개인 프로젝트 입니다.

### 사용기술
 > 백앤드
 - Node Js(express)
 - redis
 - sequelize 
 - socket.io
 
 > 프론트
 - ejs 
 - socket.io
    
### 주요 기능 


1. 카카오 로그인 & redis

    - redis 를 활용하여 세션정보 저장, 서버 재시작해도 사용자의 로그인 유지되도록 구현.
    - passport kakaoStrategy 를 활용한 카카오 소셜 로그인 구현.  
    ![](https://i.imgur.com/u5oFvZm.png)



2. 채팅기능
    
    - socket 을 활용하여 채팅 기능을 구현
    ![](https://i.imgur.com/bF0BkPf.png)

    
    
3. 공고 포스팅
    
    ![](https://i.imgur.com/WDSe1Wt.png)
    

4. 공고 자동 삭제
    
    - node-schedule 라이브러리를 활용하여 현재시간이 현재 공고 시작시간을 넘으면 자동으로 삭제되도록 구현

    ![](https://i.imgur.com/HeGHLso.jpg)
                             
                                          ⬇
                             
    ![](https://i.imgur.com/1oytkoX.jpg)

    
    