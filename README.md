# 외부 날씨 API를 연동한 게시판 & 무한 스크롤

> 개발 기간 : 2022년 11월 3일 ~ 11월 4일 (2일)

> 리팩토링(Refactoring) : 11월 5일 ~

## 프로젝트 구조

```bash
Project
 ┣ src
 ┃ ┣ controllers
 ┃ ┃ ┗ postsController.ts
 ┃ ┣ entities
 ┃ ┃ ┣ Posts.ts
 ┃ ┃ ┣ User.ts
 ┃ ┃ ┗ Weather.ts
 ┃ ┣ middlewares
 ┃ ┃ ┗ errorConstructor.ts
 ┃ ┣ routes
 ┃ ┃ ┣ index.ts
 ┃ ┃ ┗ postsRouter.ts
 ┃ ┣ services
 ┃ ┃ ┗ postsService.ts
 ┃ ┣ tests
 ┃ ┃ ┗ posts.test.ts
 ┃ ┣ app.ts
 ┃ ┣ dataSource.ts
 ┃ ┗ server.ts
 ┣ .env.sample
 ┣ .gitignore
 ┣ README.md
 ┣ babel.config.js
 ┣ package-lock.json
 ┣ package.json
 ┗ tsconfig.json
```

## 기술 스택

- TypeScript
- Node.js (Express.js)
- MySQL
- Typeorm
- Postman

## ERD

<img width="747" alt="스크린샷 2022-11-05 오후 5 03 18" src="https://user-images.githubusercontent.com/105341553/200110150-e0e9407f-ab07-40c7-b623-61943a363a46.png">

## API Documentation

- [Postman](https://documenter.getpostman.com/view/22699914/2s8YYEPk6k)

## 요구사항 분석

> Node.js로 아래의 요구사항을 만족하는 REST API 서버 개발

**1. 사용자의 게시글 작성**

- 제목과 본문 글자 수 제한
- 이모지 포함

**2. 사용자의 게시글 수정 및 삭제**

- 비밀번호 설정(암호화)

**3. 사용자의 게시글 조회**

- 모든 게시글 조회(최신순)

**4. 게시글 무한 스크롤**

- limit = 20

**5. 게시글의 날씨 정보 포함**

- 외부 날씨 API 활용

**6. Unit Test**

- Jest 라이브러리를 활용하여 구현 중

## 요구사항 구현 과정

**1. 게시글 작성**

```json
Request(Body) :

{
  "title" : "제목🤪",
  "content": "내용🤪🤪",
  "password": "비밀번호11",
  "userId": 1
}

```

```json
Response :

201 Created

{
  "message": "created posts"
}

```

- Method : POST
- Url : /posts
- 필수값이 없을 시 에러 구현 (userId는 로그인 과정이 없기 때문에 body에서 받음)
- 없는 userId일 경우 에러 구현
- 제목과 본문의 글자 수가 넘을 시 에러 구현
- 정규식을 사용하여 비밀번호가 양식에 맞지 않을 시 에러 구현
- 외부 날씨 API를 활용하여 현재 날씨를 가져온 후(Sunny, Clean 등) weather 테이블에 없는 날씨이면 추가 후 해당 날씨에 맞는 id를 가져온 다음 posts 테이블에 저장 <br>
  [구현 과정 블로그](https://velog.io/@jjmoon4682)
- bcrypt를 사용하여 비밀번호를 암호한 후 저장

**2. 게시글 수정**

```json
Request(Body) :

{
  "title" : "제목수정",
  "password": "비밀번호11"
}

```

```json
Response :

200 OK

{
  "message": "updated posts"
}

```

- Method : PATCH
- Url : /posts/postId
- 필수값이 없을 시 에러 구현
- 비밀번호가 맞지 않을 시 에러 구현
- 없는 postId일 경우 에러 구현

**3. 게시글 삭제**

```json
Request(Body) :

{
  "password": "비밀번호11"
}

```

```json
Response :

204 No Content

```

- Method : DELETE
- Url : /posts/postId
- 필수값이 없을 시 에러 구현
- 비밀번호가 맞지 않을 시 에러 구현
- 없는 postId일 경우 에러 구현
- soft delete로 구현

**4. 게시글 불러오기(전체, 무한 스크롤)**

```json
Response :

{
  "postsList": [
    {
      "id": 53,
      "title": "제목53🤪",
      "content": "내용53🤪🤪",
      "created_at": "2022-11-04T11:42:21.005Z",
      "updated_at": "2022-11-04T11:42:21.005Z",
      "user": {
        "id": 1,
        "name": "유저1"
      },
      "weather": {
        "id": 4,
        "name": "Clear"
      }
    },
    {
      "id": 52,
      "title": "제목52🤪",
      "content": "내용52🤪🤪",
      "created_at": "2022-11-04T11:35:10.220Z",
      "updated_at": "2022-11-04T11:35:10.220Z",
      "user": {
        "id": 1,
        "name": "유저1"
      },
      "weather": {
        "id": 1,
        "name": "Sunny"
      }
      ...
    }
  ]
}
```

- Method : GET
- Url : /posts, /posts?page=1
- id로 DESC 설정(최신 순)
- page 번호에 따라 20개씩 최신 순으로 구현

**5. Unit Test 구현 중**

<img src="https://user-images.githubusercontent.com/105341553/200112473-4037590c-a4bb-48c1-801b-f26b3dc3e9f1.png">
